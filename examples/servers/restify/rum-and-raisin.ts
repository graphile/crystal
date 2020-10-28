#!/usr/bin/env -S npx ts-node
import restify = require('restify');
import {
  postgraphile,
  PostGraphileResponseNode,
  PostGraphileResponse,
} from /*'postgraphile'*/ '../../../';
import { database, schemas, options, port } from '../common';

const middleware = postgraphile(database, schemas, options);

const server = restify.createServer();
server.acceptable.push('text/event-stream');

/******************************************************************************/
// These middlewares aren't needed; we just add them to make sure that
// PostGraphile still works correctly with them in place.

server.use(restify.plugins.requestLogger());

server.use(restify.plugins.authorizationParser());
server.use(restify.plugins.dateParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.jsonp());
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.bodyParser());
server.use(
  restify.plugins.requestExpiry({
    startHeader: 'x-request-start',
    timeoutHeader: 'x-request-timeout',
  }),
);
server.use(restify.plugins.conditionalRequest());

server.pre(restify.plugins.pre.dedupeSlashes());
server.use(restify.plugins.pre.sanitizePath());
server.use(restify.plugins.pre.reqIdHeaders({ headers: ['X-Request-Id'] }));

/******************************************************************************/

/**
 * Converts a PostGraphile route handler into a Fastify request handler.
 */
const convertHandler = (
  handler: (res: PostGraphileResponse) => Promise<void>,
): restify.RequestHandler => (req, res, next) =>
  handler(new PostGraphileResponseNode(req, res, next)).catch(next);

// IMPORTANT: do **NOT** change these routes here; if you want to change the
// routes, do so in PostGraphile options. If you change the routes here only
// then GraphiQL won't know where to find the GraphQL endpoint and the GraphQL
// endpoint won't know where to indicate the EventStream for watch mode is.
// (There may be other problems too.)

// OPTIONS requests, for CORS/etc
server.opts(middleware.graphqlRoute, convertHandler(middleware.graphqlRouteHandler));

// This is the main middleware
server.post(middleware.graphqlRoute, convertHandler(middleware.graphqlRouteHandler));

// GraphiQL, if you need it
if (middleware.options.graphiql) {
  if (middleware.graphiqlRouteHandler) {
    server.head(middleware.graphiqlRoute, convertHandler(middleware.graphiqlRouteHandler));
    server.get(middleware.graphiqlRoute, convertHandler(middleware.graphiqlRouteHandler));
  }
  // Remove this if you don't want the PostGraphile logo as your favicon!
  if (middleware.faviconRouteHandler) {
    server.get('/favicon.ico', convertHandler(middleware.faviconRouteHandler));
  }
}

// If you need watch mode, this is the route served by the
// X-GraphQL-Event-Stream header; see:
// https://github.com/graphql/graphql-over-http/issues/48
if (middleware.options.watchPg) {
  if (middleware.eventStreamRouteHandler) {
    server.opts(middleware.eventStreamRoute, convertHandler(middleware.eventStreamRouteHandler));
    server.get(
      middleware.eventStreamRoute,
      (_req, res, next) => {
        // Prevent restify using gzip on the event stream
        // See: https://github.com/jameswomack/restify-eventsource/blob/832842dd6dc8dd49fccf8babcf1954d462c1ab03/lib/sse.js#L95-L98
        const resAny: any = res;
        if (typeof resAny.handledGzip === 'function') {
          resAny.handledGzip();
        }
        res.removeHeader('Content-Encoding');
        next();
      },
      convertHandler(middleware.eventStreamRouteHandler),
    );
  }
}

server.listen(port, () => {
  console.log(`PostGraphiQL available at ${server.url}${middleware.graphiqlRoute} 🚀`);
});
