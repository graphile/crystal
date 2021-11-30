/* tslint:disable:no-any */
import { CreateRequestHandlerOptions, HttpRequestHandler } from '../../interfaces';
import { PostGraphileResponse } from './frameworks';
import { IncomingMessage, ServerResponse } from 'http';
import { execute, subscribe, parse, validate, specifiedRules, ExecutionArgs } from 'graphql';
import {
  createHandler as createGraphQLSSEHandler,
  Handler as GraphQLSSEHandler,
} from 'graphql-sse';
import { makeLiveSubscribe } from './liveSubscribe';
import { pluginHookFromOptions } from '../pluginHook';

/**
 * Sets the headers and streams a body for server-sent events (primarily used
 * by watch mode).
 *
 * @internal
 */
export default function setupServerSentEvents(
  res: PostGraphileResponse,
  options: CreateRequestHandlerOptions,
): void {
  const req = res.getNodeServerRequest();
  const { _emitter, watchPg } = options;

  // Making sure these options are set.
  req.socket.setTimeout(0);
  req.socket.setNoDelay(true);
  req.socket.setKeepAlive(true);

  // Set headers for Server-Sent Events.
  res.statusCode = 200;
  // Don't buffer EventStream in nginx
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  if (req.httpVersionMajor >= 2) {
    // NOOP
  } else {
    res.setHeader('Connection', 'keep-alive');
  }

  // Creates a stream for the response
  const stream = res.endWithStream();

  // Notify client that connection is open.
  stream.write('event: open\n\n');

  // Setup listeners.
  const schemaChangedCb = () => stream.write('event: change\ndata: schema\n\n');

  if (watchPg) _emitter.on('schemas:changed', schemaChangedCb);

  // Clean up when connection closes.
  const cleanup = () => {
    req.removeListener('close', cleanup);
    req.removeListener('finish', cleanup);
    req.removeListener('error', cleanup);
    _emitter.removeListener('test:close', cleanup);
    _emitter.removeListener('schemas:changed', schemaChangedCb);
    stream.end();
  };
  req.on('close', cleanup);
  req.on('finish', cleanup);
  req.on('error', cleanup);
  _emitter.on('test:close', cleanup);
}

// through setup, we create the SSE handler only once and reuse it for additional requests
let sseHandler: GraphQLSSEHandler | undefined = undefined;

/**
 * Handles the request following the GraphQL over Server-Sent Events (SSE) protocol.
 * Internally uses `graphql-sse`.
 *
 * @internal
 */
export async function handleGraphQLSSE<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
>(res: PostGraphileResponse, postgraphileMiddleware: HttpRequestHandler): Promise<void> {
  const major = parseInt(process.version.replace(/\..*$/, ''), 10); // copied from isTurbo.js
  if (major <= 12) {
    throw new Error('graphql-sse requres Node >=12');
  }

  if (!sseHandler) {
    const {
      options,
      getGraphQLSchema,
      withPostGraphileContextFromReqRes,
      handleErrors,
    } = postgraphileMiddleware;
    const pluginHook = pluginHookFromOptions(options);
    const liveSubscribe = makeLiveSubscribe({ pluginHook, options });

    const staticValidationRules = pluginHook(
      'postgraphile:validationRules:static',
      specifiedRules,
      {
        options,
      },
    );

    sseHandler = createGraphQLSSEHandler<Request, Response>({
      execute,
      subscribe: options.live ? liveSubscribe : subscribe,
      validate(schema, document) {
        const validationErrors = validate(schema, document, staticValidationRules);
        if (validationErrors.length) {
          return validationErrors;
        }

        // TODO: implement
        // // You are strongly encouraged to use
        // // `postgraphile:validationRules:static` if possible - you should
        // // only use this one if you need access to variables.
        // const moreValidationRules = pluginHook('postgraphile:validationRules', [], {
        //   options,
        //   req,
        //   res,
        //   variables: variableValues,
        //   operationName: operationName,
        // });
        // if (moreValidationRules.length) {
        //   const moreValidationErrors = validate(schema, document, moreValidationRules);
        //   if (moreValidationErrors.length) {
        //     return moreValidationErrors;
        //   }
        // }

        return [];
      },
      async onSubscribe(req, res, params) {
        const context = await withPostGraphileContextFromReqRes(
          req,
          res,
          { singleStatement: true },
          context => context,
        );

        // Override schema (for --watch)
        const schema = await getGraphQLSchema();

        const args = {
          schema,
          contextValue: context,
          operationName: params.operationName,
          document: typeof params.query === 'string' ? parse(params.query) : params.query,
          variableValues: params.variables,
        };

        // A SSE request should be treated as any other request, usual PostGraphile middlewares should apply
        // applyMiddleware(options.sseMiddlewares, req, res)

        // for supplying custom execution arguments. if not already
        // complete, the pluginHook should fill in the gaps
        const hookedArgs = (pluginHook
          ? pluginHook('postgraphile:sse:onSubscribe', args, {
              options,
            })
          : args) as ExecutionArgs;

        return hookedArgs;
      },
      async onNext(req, _args, result) {
        if (result.errors) {
          // operation execution errors
          result.errors = handleErrors(result.errors, req, res.getNodeServerResponse());
          return result;
        }
      },
    });
  }

  const req = res.getNodeServerRequest();
  await sseHandler(
    req,
    res.getNodeServerResponse(),
    req.body, // when nullish, `graphql-sse` will read out the body vanilla Node style
  );
}
