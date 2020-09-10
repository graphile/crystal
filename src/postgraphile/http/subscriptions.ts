import { Server, IncomingMessage, ServerResponse, OutgoingHttpHeaders } from 'http';
import { HttpRequestHandler, mixed, Middleware } from '../../interfaces';
import {
  subscribe as graphqlSubscribe,
  specifiedRules,
  validate,
  GraphQLError,
  parse,
  ExecutionArgs,
} from 'graphql';
import * as WebSocket from 'ws';
import { createServer, ExecutionResultFormatter } from 'graphql-transport-ws';

import parseUrl = require('parseurl');
import { pluginHookFromOptions } from '../pluginHook';
import { isEmpty } from './createPostGraphileHttpRequestHandler';
import liveSubscribe from './liveSubscribe'; // TODO-db-200826 add support for live queries

interface Deferred<T> extends Promise<T> {
  resolve: (input?: T | PromiseLike<T> | undefined) => void;
  reject: (error: Error) => void;
}

function lowerCaseKeys(obj: Record<string, any>): Record<string, any> {
  return Object.keys(obj).reduce((memo, key) => {
    memo[key.toLowerCase()] = obj[key];
    return memo;
  }, {});
}

function deferred<T = void>(): Deferred<T> {
  let resolve: (input?: T | PromiseLike<T> | undefined) => void;
  let reject: (error: Error) => void;
  const promise = new Promise<T>((_resolve, _reject): void => {
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

export async function enhanceHttpServerWithSubscriptions<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
>(websocketServer: Server, postgraphileMiddleware: HttpRequestHandler): Promise<void> {
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
  const pluginHook = pluginHookFromOptions(options);
  const externalUrlBase = options.externalUrlBase || '';
  const graphqlRoute = options.graphqlRoute || '/graphql';

  const schema = await getGraphQLSchema();

  const keepalivePromisesByContextKey: { [contextKey: string]: Deferred<void> | null } = {};

  const contextKey = (ws: WebSocket, opId: string): string => ws['postgraphileId'] + '|' + opId;

  const releaseContextForSocketAndOpId = (ws: WebSocket, opId: string): void => {
    const promise = keepalivePromisesByContextKey[contextKey(ws, opId)];
    if (promise) {
      promise.resolve();
      keepalivePromisesByContextKey[contextKey(ws, opId)] = null;
    }
  };

  const addContextForSocketAndOpId = (
    context: mixed,
    ws: WebSocket,
    opId: string,
  ): Deferred<void> => {
    releaseContextForSocketAndOpId(ws, opId);
    const promise = deferred();
    promise['context'] = context;
    keepalivePromisesByContextKey[contextKey(ws, opId)] = promise;
    return promise;
  };

  const applyMiddleware = async (
    middlewares: Array<Middleware<Request, Response>> = [],
    req: Request,
    res: Response,
  ): Promise<void> => {
    for (const middleware of middlewares) {
      // TODO: add Koa support
      await new Promise((resolve, reject): void => {
        middleware(req, res, err => (err ? reject(err) : resolve()));
      });
    }
  };

  const reqResFromSocket = async (
    socket: WebSocket,
  ): Promise<{
    req: Request;
    res: Response;
  }> => {
    const req = socket['__postgraphileReq'];
    if (!req) {
      throw new Error('req could not be extracted');
    }
    let dummyRes: Response | undefined = socket['__postgraphileRes'];
    if (req.res) {
      throw new Error(
        "Please get in touch with Benjie; we weren't expecting req.res to be present but we want to reserve it for future usage.",
      );
    }
    if (!dummyRes) {
      dummyRes = new ServerResponse(req) as Response;
      dummyRes.writeHead = (
        statusCode: number,
        _statusMessage?: OutgoingHttpHeaders | string | undefined,
        headers?: OutgoingHttpHeaders | undefined,
      ): void => {
        if (statusCode && statusCode > 200) {
          // tslint:disable-next-line no-console
          console.error(
            `Something used 'writeHead' to write a '${statusCode}' error for websockets - check the middleware you're passing!`,
          );
          socket.close();
        } else if (headers) {
          // tslint:disable-next-line no-console
          console.error(
            "Passing headers to 'writeHead' is not supported with websockets currently - check the middleware you're passing",
          );
          socket.close();
        }
      };
      await applyMiddleware(options.websocketMiddlewares, req, dummyRes);

      // reqResFromSocket is only called once per socket, so there's no race condition here
      // eslint-disable-next-line require-atomic-updates
      socket['__postgraphileRes'] = dummyRes;
    }
    return { req, res: dummyRes };
  };

  const getContext = (socket: WebSocket, opId: string): Promise<mixed> => {
    return new Promise((resolve, reject): void => {
      reqResFromSocket(socket)
        .then(({ req, res }) =>
          withPostGraphileContextFromReqRes(req, res, { singleStatement: true }, context => {
            const promise = addContextForSocketAndOpId(context, socket, opId);
            resolve(promise['context']);
            return promise;
          }),
        )
        .then(null, reject);
    });
  };

  const wss = new WebSocket.Server({ noServer: true });

  let socketId = 0;

  websocketServer.on('upgrade', (req, socket, head) => {
    const { pathname = '' } = parseUrl(req) || {};
    const isGraphqlRoute = pathname === externalUrlBase + graphqlRoute;
    if (isGraphqlRoute) {
      wss.handleUpgrade(req, socket, head, ws => {
        wss.emit('connection', ws, req);
      });
    }
  });
  const staticValidationRules = pluginHook('postgraphile:validationRules:static', specifiedRules, {
    options,
  });

  createServer(
    {
      schema,
      validationRules: staticValidationRules,
      execute: () => {
        throw new Error('Only subscriptions are allowed over websocket transport');
      },
      subscribe: options.live ? liveSubscribe : graphqlSubscribe,
      onConnect: ({ socket, request, connectionParams }) => {
        socket['postgraphileId'] = ++socketId;
        if (!request) {
          throw new Error('No request!');
        }
        socket['__postgraphileReq'] = request;

        let normalizedConnectionParams = {};
        if (connectionParams) {
          normalizedConnectionParams = lowerCaseKeys(connectionParams);
          request['connectionParams'] = connectionParams;
          request['normalizedConnectionParams'] = normalizedConnectionParams;
        }
        if (!request.headers.authorization && normalizedConnectionParams['authorization']) {
          /*
           * Enable JWT support through connectionParams.
           *
           * For other headers you'll need to do this yourself for security
           * reasons (e.g. we don't want to allow overriding of Origin /
           * Referer / etc)
           */
          request.headers.authorization = String(normalizedConnectionParams['authorization']);
        }

        socket['postgraphileHeaders'] = {
          ...normalizedConnectionParams,
          // The original headers must win (for security)
          ...request.headers,
        };

        return true;
      },
      onSubscribe: async ({ socket }, message, args) => {
        const context = await getContext(socket, message.id);

        // Override schema (for --watch)
        args.schema = await getGraphQLSchema();

        // if the context value is missing, initialise it
        args.contextValue = { ...args.contextValue, ...(context as object) }; // mixed?

        const meta = {};

        const { req, res } = await reqResFromSocket(socket);
        const executionResultFormatter: ExecutionResultFormatter = (_ctx, response) => {
          if (response.errors) {
            response.errors = handleErrors(response.errors, req, res);
          }
          if (!isEmpty(meta)) {
            response['meta'] = meta;
          }
          return response;
        };

        const hookedParams = pluginHook
          ? pluginHook('postgraphile:ws:onSubscribe', args, {
              message,
              args,
              socket,
              options,
            })
          : args;

        // You are strongly encouraged to use
        // `postgraphile:validationRules:static` if possible - you should
        // only use this one if you need access to variables.
        const moreValidationRules = pluginHook('postgraphile:validationRules', [], {
          options,
          req,
          res,
          variables: args.variableValues,
          operationName: args.operationName,
          meta,
        });
        if (moreValidationRules.length) {
          const validationErrors: ReadonlyArray<GraphQLError> = validate(
            args.schema,
            typeof hookedParams.document === 'string'
              ? parse(hookedParams.document)
              : hookedParams.document,
            moreValidationRules,
          );
          if (validationErrors.length) {
            const error = new Error(
              'Query validation failed: \n' + validationErrors.map(e => e.message).join('\n'),
            );
            error['errors'] = validationErrors;
            throw error;
          }
        }

        return [hookedParams, executionResultFormatter] as [
          ExecutionArgs,
          ExecutionResultFormatter,
        ];
      },
      onComplete: ({ socket }, msg) => {
        releaseContextForSocketAndOpId(socket, msg.id);
      },
      /*
       * Heroku times out after 55s:
       *   https://devcenter.heroku.com/articles/error-codes#h15-idle-connection
       *
       * The lib itself should manage the keep-alive for client counterparts.
       */
      keepAlive: 15000,
    },
    wss,
  );
}
