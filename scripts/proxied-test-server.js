/**
 * The purpose of this script is to help us test that proxying is working
 * correctly, it sets up a server that listens on port 5000, and a proxy on
 * port 5151 that proxies to this server.
 *
 * GraphiQL: http://localhost:5151/api/subpath/graphiql
 * GraphQL: http://localhost:5151/api/subpath/gql
 *
 * Visiting GraphiQL, the following should be true:
 *
 * - GraphiQL should be able to complete introspection (issue a GraphQL query over HTTP POST)
 * - GraphiQL should be able to maintain a websocket connection to the server
 * - GraphiQL should be able to subscribe to watch mode via the event stream
 * - The GraphQL endpoint should return X-GraphQL-Event-Stream: /api/subpath/gql/stream
 */
{
  const express = require('express');
  const { postgraphile, makePluginHook } = require('..');
  const PgPubsub = require('@graphile/pg-pubsub').default;

  const pluginHook = makePluginHook([PgPubsub]);

  const app = express();

  app.use(
    '/subpath',
    postgraphile('pggql_test', ['a', 'b', 'c'], {
      pluginHook,
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
      subscriptions: true,
      simpleSubscriptions: true,
      graphqlRoute: '/gql',
      externalGraphqlRoute: '/api/subpath/gql',
    }),
  );

  app.listen(5000);
  console.log('Listening on localhost port 5000');
}

// -----------------------------------------------------------------------------

{
  const { createServer } = require('http');
  const express = require('express');
  const httpProxy = require('http-proxy');

  const proxy = httpProxy.createProxyServer({});
  const app = express();
  const server = createServer(app);

  app.use('/api', (req, res) => proxy.web(req, res, { target: 'http://localhost:5000' }));

  server.on('upgrade', (req, socket, head) => {
    if (req.url.match(/^\/api(\/|$)/)) {
      proxy.ws(req, socket, head, {
        target: `ws://localhost:5000${req.url.substr(4)}`,
        ignorePath: true,
      });
    }
  });

  server.listen(5151);
  function logError(e) {
    console.error(e);
  }
  proxy.on('error', logError);
  server.on('error', logError);
  app.on('error', logError);
  console.log('Proxying http://localhost:5151/api/* to http://localhost:5000/*');
}
