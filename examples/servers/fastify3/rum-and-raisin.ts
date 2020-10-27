#!/usr/bin/env -S npx ts-node
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import {
  postgraphile,
  PostGraphileResponseFastify3,
  PostGraphileResponse,
} from /*'postgraphile'*/ '../../../';
import { database, schemas, options, port } from '../common';

const middleware = postgraphile(database, schemas, options);

/******************************************************************************/
// These middlewares aren't needed; we just add them to make sure that
// PostGraphile still works correctly with them in place.

import fastifyCompression from 'fastify-compress';
const fastify = Fastify({ logger: true });
fastify.register(fastifyCompression, { threshold: 0, inflateIfDeflated: false });

/******************************************************************************/

/**
 * Converts a PostGraphile route handler into a Fastify request handler.
 */
const convertHandler = (handler: (res: PostGraphileResponse) => Promise<void>) => (
  request: FastifyRequest,
  reply: FastifyReply,
) => handler(new PostGraphileResponseFastify3(request, reply));

// IMPORTANT: do **NOT** change these routes here; if you want to change the
// routes, do so in PostGraphile options. If you change the routes here only
// then GraphiQL won't know where to find the GraphQL endpoint and the GraphQL
// endpoint won't know where to indicate the EventStream for watch mode is.
// (There may be other problems too.)

// OPTIONS requests, for CORS/etc
fastify.options(middleware.graphqlRoute, convertHandler(middleware.graphqlRouteHandler));

// This is the main middleware
fastify.post(middleware.graphqlRoute, convertHandler(middleware.graphqlRouteHandler));

// GraphiQL, if you need it
if (middleware.options.graphiql) {
  if (middleware.graphiqlRouteHandler) {
    fastify.head(middleware.graphiqlRoute, convertHandler(middleware.graphiqlRouteHandler));
    fastify.get(middleware.graphiqlRoute, convertHandler(middleware.graphiqlRouteHandler));
  }
  // Remove this if you don't want the PostGraphile logo as your favicon!
  if (middleware.faviconRouteHandler) {
    fastify.get('/favicon.ico', convertHandler(middleware.faviconRouteHandler));
  }
}

// If you need watch mode, this is the route served by the
// X-GraphQL-Event-Stream header; see:
// https://github.com/graphql/graphql-over-http/issues/48
if (middleware.options.watchPg) {
  if (middleware.eventStreamRouteHandler) {
    fastify.options(
      middleware.eventStreamRoute,
      convertHandler(middleware.eventStreamRouteHandler),
    );
    fastify.get(
      middleware.eventStreamRoute,
      // Must disable compression on event stream otherwise the request just hangs indefinitely
      { config: { compress: false } },
      convertHandler(middleware.eventStreamRouteHandler),
    );
  }
}

fastify.listen(port, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`PostGraphiQL available at ${address}${middleware.graphiqlRoute} 🚀`);
});
