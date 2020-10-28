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
    server.get(middleware.eventStreamRoute, convertHandler(middleware.eventStreamRouteHandler));
  }
}

server.listen(port, () => {
  console.log(`PostGraphiQL available at ${server.url}${middleware.graphiqlRoute} 🚀`);
});
