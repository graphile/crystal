import { Server, ServerResponse } from 'http';
import { HttpRequestHandler, mixed } from '../../interfaces';
import { subscribe, ExecutionResult } from 'graphql';
import { RequestHandler, Request, Response } from 'express';
import * as WebSocket from 'ws';
import { parse } from 'url';
import { SubscriptionServer, ConnectionContext } from 'subscriptions-transport-ws';

interface Deferred<T> extends Promise<T> {
  resolve: (input?: T | PromiseLike<T> | undefined) => void;
  reject: (error: Error) => void;
}

function lowerCaseKeys(obj: object): object {
  return Object.keys(obj).reduce((memo, key) => {
    memo[key.toLowerCase()] = obj[key];
    return memo;
  }, {});
}

function deferred<T>(): Deferred<T> {
  let resolve: (input?: T | PromiseLike<T> | undefined) => void;
  let reject: (error: Error) => void;
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  // tslint:disable-next-line prefer-object-spread
  return Object.assign(promise, {
    // @ts-ignore This isn't used before being defined.
    resolve,
    // @ts-ignore This isn't used before being defined.
    reject,
  });
}

export async function enhanceHttpServerWithSubscriptions(
  websocketServer: Server,
  postgraphileMiddleware: HttpRequestHandler,
) {
  if (websocketServer['__postgraphileSubscriptionsEnabled']) {
    return;
  }
  websocketServer['__postgraphileSubscriptionsEnabled'] = true;
  const {
    options,
    getGraphQLSchema,
    withPostGraphileContextFromReqRes,
    handleErrors,
  } = postgraphileMiddleware;
  const graphqlRoute = options.graphqlRoute || '/graphql';

  const schema = await getGraphQLSchema();

  const contextKeepalivePromisesByOpId = {};

  const contextKey = (ws: WebSocket, opId: string) => ws['postgraphileId'] + '|' + opId;

  const releaseContextByOpId = (ws: WebSocket, opId: string) => {
    const promise = contextKeepalivePromisesByOpId[contextKey(ws, opId)];
    if (promise) {
      promise.resolve();
    }
  };

  const addContextForOpId = (context: mixed, ws: WebSocket, opId: string) => {
    releaseContextByOpId(ws, opId);
    const promise = deferred();
    promise['context'] = context;
    contextKeepalivePromisesByOpId[contextKey(ws, opId)] = promise;
    return promise;
  };

  const applyMiddleware = async (
    middlewares: Array<RequestHandler> = [],
    req: Request,
    res: Response,
  ) => {
    for (const middleware of middlewares) {
      await new Promise((resolve, reject) => {
        middleware(req, res, err => (err ? reject(err) : resolve()));
      });
    }
  };

  const reqResFromSocket = async (socket: WebSocket) => {
    const req = socket['__postgraphileReq'];
    if (!req) {
      throw new Error('req could not be extracted');
    }
    let dummyRes = socket['__postgraphileRes'];
    if (req.res) {
      throw new Error(
        "Please get in touch with Benjie; we weren't expecting req.res to be present but we want to reserve it for future usage.",
      );
    }
    if (!dummyRes) {
      dummyRes = new ServerResponse(req);
      dummyRes.writeHead = (statusCode: number, statusMessage: never, headers: never) => {
        if (statusMessage || headers) {
          throw new Error(
            'Passing more than the statusCode to writeHead is not supported with websockets currently',
          );
        }
        if (statusCode && statusCode > 200) {
          // tslint:disable-next-line no-console
          console.error(
            `Something used 'writeHead' to write a '${statusCode}' error for websockets - check the middleware you're passing!`,
          );
          socket.close();
        }
      };
      await applyMiddleware(options.websocketMiddlewares || options.middlewares, req, dummyRes);
      socket['__postgraphileRes'] = dummyRes;
    }
    return { req, res: dummyRes };
  };

  const getContext = (socket: WebSocket, opId: string) => {
    return new Promise((resolve, reject) => {
      reqResFromSocket(socket)
        .then(({ req, res }) =>
          withPostGraphileContextFromReqRes(req, res, { singleStatement: true }, context => {
            const promise = addContextForOpId(context, socket, opId);
            resolve(promise['context']);
            return promise;
          }),
        )
        .then(null, reject);
    });
  };

  const wss = new WebSocket.Server({ noServer: true });

  websocketServer.on('upgrade', (req, socket, head) => {
    const url = req.originalUrl || req.url;
    const path = parse(url).pathname;
    if (path === graphqlRoute) {
      wss.handleUpgrade(req, socket, head, ws => {
        wss.emit('connection', ws, req);
      });
    }
  });

  SubscriptionServer.create(
    {
      schema,
      execute: () => {
        throw new Error('Only subscriptions are allowed over websocket transport');
      },
      subscribe,
      onConnect(
        connectionParams: object,
        _socket: WebSocket,
        connectionContext: ConnectionContext,
      ) {
        const { socket, request } = connectionContext;
        if (!request) {
          throw new Error('No request!');
        }
        request['connectionParams'] = connectionParams;
        const normalizedConnectionParams = Object.keys(connectionParams).reduce((memo, key) => {
          memo[key.toLowerCase()] = connectionParams[key];
          return memo;
        }, {});
        request['normalizedConnectionParams'] = normalizedConnectionParams;
        socket['__postgraphileReq'] = request;
        if (!request.headers.authorization && normalizedConnectionParams['authorization']) {
          request.headers.authorization = String(normalizedConnectionParams['authorization']);
        }

        socket['postgraphileHeaders'] = {
          ...lowerCaseKeys(connectionParams),
          ...request.headers,
        };
      },
      // tslint:disable-next-line no-any
      async onOperation(message: any, params: any, socket: WebSocket) {
        const opId = message.id;
        const context = await getContext(socket, opId);

        // Override schema (for --watch)
        params.schema = await getGraphQLSchema();

        Object.assign(params.context, context);

        const { req, res } = await reqResFromSocket(socket);
        const formatResponse = (response: ExecutionResult) => {
          if (response.errors) {
            response.errors = handleErrors(response.errors, req, res);
          }
          return response;
        };
        params.formatResponse = formatResponse;
        return params;
      },
      onOperationComplete(socket: WebSocket, opId: string) {
        releaseContextByOpId(socket, opId);
      },
    },
    wss,
  );
}
