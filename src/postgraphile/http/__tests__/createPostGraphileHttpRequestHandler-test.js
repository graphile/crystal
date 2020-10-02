/* tslint:disable no-console */
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { $$pgClient } from '../../../postgres/inventory/pgClientFromContext';
import createPostGraphileHttpRequestHandler from '../createPostGraphileHttpRequestHandler';
import request from './supertest';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const http = require('http');
const http2 = require('http2');
const connect = require('connect');
const express = require('express');
const compress = require('koa-compress');
const koa = require('koa');
const koaMount = require('koa-mount');
const fastify = require('fastify');
const restify = require('restify');
// tslint:disable-next-line variable-name
const EventEmitter = require('events');

const shortString = 'User_Running_These_Tests';
// Default bodySizeLimit is 100kB
const veryLongString = '_'.repeat(100 * 1024);

const gqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      },
      greetings: {
        type: GraphQLString,
        args: {
          name: { type: GraphQLString },
        },
        resolve: (source, { name }) => `Hello, ${name}!`,
      },
      query: {
        type: GraphQLString,
        resolve: (source, args, context) => context[$$pgClient].query('EXECUTE'),
      },
      testError: {
        type: GraphQLString,
        resolve: () => {
          const err = new Error('test message');
          err.extensions = { testingExtensions: true };
          err.detail = 'test detail';
          err.hint = 'test hint';
          err.code = '12345';
          err.where = 'In your code somewhere';
          err.file = 'alcchk.c';
          throw err;
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      },
    },
  }),
});

const pgClient = {
  query: jest.fn(() => Promise.resolve()),
  release: jest.fn(),
};

const pgPool = {
  connect: jest.fn(() => pgClient),
};

const defaultOptions = {
  getGqlSchema: () => Promise.resolve(gqlSchema),
  pgPool,
  disableQueryLog: true,
};

const serverCreators = new Map([
  [
    'http',
    handler => {
      return http.createServer(handler);
    },
  ],
  [
    'connect',
    (handler, _options, subpath) => {
      const app = connect();
      if (subpath) {
        app.use(subpath, handler);
      } else {
        app.use(handler);
      }
      return http.createServer(app);
    },
  ],
  [
    'express',
    (handler, _options, subpath) => {
      const app = express();
      if (subpath) {
        app.use(subpath, handler);
      } else {
        app.use(handler);
      }
      return http.createServer(app);
    },
  ],
  [
    'fastify',
    async (handler, _options, subpath) => {
      let server;
      function serverFactory(fastlyHandler, opts) {
        if (server) throw new Error('Factory called twice');
        server = http.createServer((req, res) => {
          fastlyHandler(req, res);
        });
        return server;
      }
      const app = fastify({ serverFactory });
      if (subpath) {
        throw new Error('Fastify does not support subpath at this time');
      } else {
        app.use(handler);
      }
      await app.ready();
      if (!server) {
        throw new Error('Fastify server not created!');
      }
      return server;
    },
  ],
  [
    'koa',
    (handler, options = {}, subpath) => {
      const app = new koa();
      if (options.onPreCreate) options.onPreCreate(app);
      if (subpath) {
        app.use(koaMount(subpath, handler));
      } else {
        app.use(handler);
      }
      return http.createServer(app.callback());
    },
  ],
  [
    'fastify-http2',
    async (handler, _options, subpath) => {
      let server;
      function serverFactory(fastlyHandler, opts) {
        if (server) throw new Error('Factory called twice');
        server = http2.createServer({}, (req, res) => {
          fastlyHandler(req, res);
        });
        return server;
      }
      const app = fastify({ serverFactory, http2: true });
      if (subpath) {
        throw new Error('Fastify does not support subpath at this time');
      } else {
        app.use(handler);
      }
      await app.ready();
      if (!server) {
        throw new Error('Fastify server not created!');
      }
      server._http2 = true;
      return server;
    },
  ],
  [
    'restify',
    (handler, options = {}, subpath) => {
      const app = restify.createServer();
      if (options.onPreCreate) options.onPreCreate(app);
      app.opts(handler.graphqlRoute, handler.graphqlRouteHandler);
      app.post(handler.graphqlRoute, handler.graphqlRouteHandler);
      if (handler.graphiqlRouteHandler) {
        app.head(handler.graphiqlRoute, handler.graphiqlRouteHandler);
        app.get(handler.graphiqlRoute, handler.graphiqlRouteHandler);
      }
      if (handler.faviconRouteHandler) {
        app.get('/favicon.ico', handler.faviconRouteHandler);
      }
      if (handler.eventStreamRouteHandler) {
        app.opts(handler.eventStreamRoute, handler.eventStreamRouteHandler);
        app.get(handler.eventStreamRoute, handler.eventStreamRouteHandler);
      }
      return app;
    },
  ],
]);

const toTest = [];
for (const [name, createServerFromHandler] of Array.from(serverCreators)) {
  toTest.push({ name, createServerFromHandler });
  if (name !== 'http' && name !== 'fastify' && name !== 'fastify-http2' && name !== 'restify') {
    toTest.push({ name, createServerFromHandler, subpath: '/path/to/mount' });
  }
}

for (const { name, createServerFromHandler, subpath = '' } of toTest) {
  const createServer = async (handlerOptions, serverOptions) => {
    const _emitter = new EventEmitter();
    const server = await createServerFromHandler(
      createPostGraphileHttpRequestHandler(
        Object.assign(
          { _emitter },
          subpath
            ? {
                externalUrlBase: subpath,
              }
            : null,
          defaultOptions,
          handlerOptions,
        ),
      ),
      serverOptions,
      subpath,
    );
    server._emitter = _emitter;
    return server;
  };

  describe(name + (subpath ? ` (@${subpath})` : ''), () => {
    test('will 404 for route other than that specified 1', async () => {
      const server1 = await createServer();
      await request(server1).post('/x').expect(404);
    });

    if (subpath) {
      test('will 404 for route other than that specified 2', async () => {
        const server2 = await createServer({
          graphqlRoute: `${subpath}/graphql`,
        });
        await request(server2).post(`${subpath}/graphql`).expect(404);
      });
      test('will 404 for route other than that specified 3', async () => {
        const server3 = await createServer({ graphqlRoute: `/graphql` });
        await request(server3).post(`/graphql`).expect(404);
      });
    }

    test('will 404 for route other than that specified 4', async () => {
      const server4 = await createServer({ graphqlRoute: `/x` });
      await request(server4).post(`${subpath}/graphql`).expect(404);
    });

    test('will respond to queries on a different route', async () => {
      const server = await createServer({ graphqlRoute: `/x` });
      await request(server)
        .post(`${subpath}/x`)
        .send({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } });
    });

    if (subpath) {
      test("will respond to queries on a different route with externalUrlBase = ''", async () => {
        const server = await createServer({
          graphqlRoute: `/x`,
          externalUrlBase: '',
        });
        await request(server)
          .post(`${subpath}/x`)
          .send({ query: '{hello}' })
          .expect(200)
          .expect('Content-Type', /json/)
          .expect({ data: { hello: 'world' } });
      });
    }

    test("infers externalUrlBase when it's not specified", async () => {
      const server = await createServer({ externalUrlBase: undefined });
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } });
    });

    test('will always respond with CORS to an OPTIONS request when enabled', async () => {
      const server = await createServer({ enableCors: true });
      await request(server)
        .options(`${subpath}/graphql`)
        .expect(200)
        .expect('Access-Control-Allow-Origin', '*')
        .expect('Access-Control-Allow-Methods', 'HEAD, GET, POST')
        .expect('Access-Control-Allow-Headers', /Accept, Authorization, X-Apollo-Tracing/)
        .expect('Access-Control-Expose-Headers', 'X-GraphQL-Event-Stream')
        .expect('');
    });

    test('will always respond to any request with CORS headers when enabled', async () => {
      const server = await createServer({ enableCors: true });
      await request(server)
        .post(`${subpath}/graphql`)
        .expect(400)
        .expect('Access-Control-Allow-Origin', '*')
        .expect('Access-Control-Allow-Methods', 'HEAD, GET, POST')
        .expect('Access-Control-Allow-Headers', /Accept, Authorization, X-Apollo-Tracing/)
        .expect('Access-Control-Expose-Headers', 'X-GraphQL-Event-Stream');
    });

    test('will not allow requests other than POST', async () => {
      const server = await createServer();
      await request(server).get(`${subpath}/graphql`).expect(405).expect('Allow', 'POST, OPTIONS');
      await request(server)
        .delete(`${subpath}/graphql`)
        .expect(405)
        .expect('Allow', 'POST, OPTIONS');
      await request(server).put(`${subpath}/graphql`).expect(405).expect('Allow', 'POST, OPTIONS');
    });

    test('will run a query on a POST request with JSON data', async () => {
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .set('Content-Type', 'application/json')
        .send(
          JSON.stringify({
            query: 'query GreetingsQuery($name: String!) {greetings(name: $name)}',
            variables: { name: shortString },
          }),
        )
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { greetings: `Hello, ${shortString}!` } });
    });

    test("will throw error if there's too much JSON data", async () => {
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .set('Content-Type', 'application/json')
        .send(
          JSON.stringify({
            query: 'query GreetingsQuery($name: String!) {greetings(name: $name)}',
            variables: { name: veryLongString },
          }),
        )
        .expect(413);
    });

    test("will not throw error if there's lots of JSON data and a high limit", async () => {
      const server = await createServer({ bodySizeLimit: '1MB' });
      await request(server)
        .post(`${subpath}/graphql`)
        .set('Content-Type', 'application/json')
        .send(
          JSON.stringify({
            query: 'query GreetingsQuery($name: String!) {greetings(name: $name)}',
            variables: { name: veryLongString },
          }),
        )
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { greetings: `Hello, ${veryLongString}!` } });
    });

    test('will run a query on a POST request with form data', async () => {
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(`query=${encodeURIComponent(`{greetings(name: ${JSON.stringify(shortString)})}`)}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { greetings: `Hello, ${shortString}!` } });
    });

    test("will throw error if there's too much form data", async () => {
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(`query=${encodeURIComponent(`{greetings(name: ${JSON.stringify(veryLongString)})}`)}`)
        .expect(413);
    });

    test("will not throw error if there's lots of form data and a high limit", async () => {
      const server = await createServer({ bodySizeLimit: '1MB' });
      await request(server)
        .post(`${subpath}/graphql`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(`query=${encodeURIComponent(`{greetings(name: ${JSON.stringify(veryLongString)})}`)}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { greetings: `Hello, ${veryLongString}!` } });
    });

    test('will run a query on a POST request with GraphQL data', async () => {
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .set('Content-Type', 'application/graphql')
        .send(`{greetings(name:${JSON.stringify(shortString)})}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { greetings: `Hello, ${shortString}!` } });
    });

    test("will throw error if there's too much GraphQL data", async () => {
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .set('Content-Type', 'application/graphql')
        .send(`{greetings(name:${JSON.stringify(veryLongString)})}`)
        .expect(413);
    });

    test("will not throw error if there's lots of GraphQL data and a high limit", async () => {
      const server = await createServer({ bodySizeLimit: '1MB' });
      await request(server)
        .post(`${subpath}/graphql`)
        .set('Content-Type', 'application/graphql')
        .send(`{greetings(name:${JSON.stringify(veryLongString)})}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { greetings: `Hello, ${veryLongString}!` } });
    });

    test('will error if query parse fails', async () => {
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{' })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({
          errors: [
            {
              message: 'Syntax Error: Expected Name, found <EOF>',
              locations: [{ line: 1, column: 2 }],
            },
          ],
        });
    });

    test('will error if validation fails', async () => {
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{notFound}' })
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({
          errors: [
            {
              message: 'Cannot query field "notFound" on type "Query".',
              locations: [{ line: 1, column: 2 }],
            },
          ],
        });
    });

    test('will allow mutations with POST', async () => {
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: 'mutation {hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } });
    });

    test('will connect and release a Postgres client from the pool on every request', async () => {
      // Note: no BEGIN/END because we don't need it here
      pgPool.connect.mockClear();
      pgClient.query.mockClear();
      pgClient.release.mockClear();
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } });
      expect(pgPool.connect.mock.calls).toEqual([[]]);
      expect(pgClient.query.mock.calls).toEqual([]);
      expect(pgClient.release.mock.calls).toEqual([[]]);
    });

    test('will connect and release a Postgres client with a transaction from the pool on every mutation request', async () => {
      pgPool.connect.mockClear();
      pgClient.query.mockClear();
      pgClient.release.mockClear();
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: 'mutation{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } });
      expect(pgPool.connect.mock.calls).toEqual([[]]);
      expect(pgClient.query.mock.calls).toEqual([['begin'], ['commit']]);
      expect(pgClient.release.mock.calls).toEqual([[]]);
    });

    test('will setup a transaction for requests that use the Postgres client and have config', async () => {
      pgPool.connect.mockClear();
      pgClient.query.mockClear();
      pgClient.release.mockClear();
      const server = await createServer({
        pgDefaultRole: 'bob',
      });
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{query}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { query: null } });
      expect(pgPool.connect.mock.calls).toEqual([[]]);
      expect(pgClient.query.mock.calls).toEqual([
        ['begin'],
        [
          {
            text: 'select set_config($1, $2, true)',
            values: ['role', 'bob'],
          },
        ],
        ['EXECUTE'],
        ['commit'],
      ]);
      expect(pgClient.release.mock.calls).toEqual([[]]);
    });

    test('will setup a transaction and pass down options for requests that use the Postgres client', async () => {
      pgPool.connect.mockClear();
      pgClient.query.mockClear();
      pgClient.release.mockClear();
      const jwtSecret = 'secret';
      const pgDefaultRole = 'pg_default_role';
      const server = await createServer({ jwtSecret, pgDefaultRole });
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{query}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { query: null } });
      expect(pgPool.connect.mock.calls).toEqual([[]]);
      expect(pgClient.query.mock.calls).toEqual([
        ['begin'],
        [
          {
            text: 'select set_config($1, $2, true)',
            values: ['role', 'pg_default_role'],
          },
        ],
        ['EXECUTE'],
        ['commit'],
      ]);
      expect(pgClient.release.mock.calls).toEqual([[]]);
    });

    test('adds properties from the JWT to the session', async () => {
      pgPool.connect.mockClear();
      pgClient.query.mockClear();
      pgClient.release.mockClear();
      const jwtSecret = 'secret';
      const pgDefaultRole = 'pg_default_role';
      const server = await createServer({ jwtSecret, pgDefaultRole });
      await request(server)
        .post(`${subpath}/graphql`)
        /*
          {
            "aud": "postgraphile",
            "role": "johndoe",
            "iat": 1516239022,
            "user_id": 2934085,
            "number": 27,
            "bool_true": true,
            "bool_false": false,
            "null": null,
            "array": {"n": 7, "a":"fred", "c":21}
          }
        */
        .set(
          'Authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJwb3N0Z3JhcGhpbGUiLCJyb2xlIjoiam9obmRvZSIsImlhdCI6MTUxNjIzOTAyMiwidXNlcl9pZCI6MjkzNDA4NSwibnVtYmVyIjoyNywiYm9vbF90cnVlIjp0cnVlLCJib29sX2ZhbHNlIjpmYWxzZSwibnVsbCI6bnVsbCwiYXJyYXkiOnsibiI6NywiYSI6ImZyZWQiLCJjIjoyMX19.MjMRJynCi1ZwiYiLduRxOQeK2FjWtT8IvSVc1_IanEg',
        )
        .send({ query: '{query}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { query: null } });
      expect(pgPool.connect.mock.calls).toEqual([[]]);
      expect(pgClient.query.mock.calls).toEqual([
        ['begin'],
        [
          {
            text:
              'select set_config($1, $2, true), set_config($3, $4, true), set_config($5, $6, true), set_config($7, $8, true), set_config($9, $10, true), set_config($11, $12, true), set_config($13, $14, true), set_config($15, $16, true), set_config($17, $18, true)',
            values: [
              'role',
              'johndoe',
              'jwt.claims.aud',
              'postgraphile',
              'jwt.claims.role',
              'johndoe',
              'jwt.claims.iat',
              '1516239022',
              'jwt.claims.user_id',
              '2934085',
              'jwt.claims.number',
              '27',
              'jwt.claims.bool_true',
              'true',
              'jwt.claims.bool_false',
              'false',
              'jwt.claims.array',
              JSON.stringify({ n: 7, a: 'fred', c: 21 }),
            ],
          },
        ],
        ['EXECUTE'],
        ['commit'],
      ]);
      expect(pgClient.release.mock.calls).toEqual([[]]);
    });

    test('will respect an operation name', async () => {
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .send({
          query: 'query A { a: hello } query B { b: hello }',
          operationName: 'A',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { a: 'world' } });
      await request(server)
        .post(`${subpath}/graphql`)
        .send({
          query: 'query A { a: hello } query B { b: hello }',
          operationName: 'B',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { b: 'world' } });
    });

    test('will use variables', async () => {
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .send({
          query: 'query A($name: String!) { greetings(name: $name) }',
          variables: JSON.stringify({ name: 'Joe' }),
          operationName: 'A',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { greetings: 'Hello, Joe!' } });
      await request(server)
        .post(`${subpath}/graphql`)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(
          `operationName=A&query=${encodeURIComponent(
            'query A($name: String!) { greetings(name: $name) }',
          )}&variables=${encodeURIComponent(JSON.stringify({ name: 'Joe' }))}`,
        )
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { greetings: 'Hello, Joe!' } });
    });

    test('will ignore empty string variables', async () => {
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{hello}', variables: '' })
        .expect(200)
        .expect({ data: { hello: 'world' } });
    });

    test('will error with variables of the incorrect type', async () => {
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{hello}', variables: 2 })
        .expect(400)
        .expect({
          errors: [{ message: "Variables must be an object, not 'number'." }],
        });
    });

    test('will error with an operation name of the incorrect type', async () => {
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{hello}', operationName: 2 })
        .expect(400)
        .expect({
          errors: [{ message: "Operation name must be a string, not 'number'." }],
        });
    });

    test('will report a simple error in the default case', async () => {
      pgPool.connect.mockClear();
      pgClient.query.mockClear();
      pgClient.release.mockClear();
      const server = await createServer();
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{testError}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({
          data: { testError: null },
          errors: [
            {
              message: 'test message',
              locations: [{ line: 1, column: 2 }],
              path: ['testError'],
              extensions: {
                testingExtensions: true,
              },
            },
          ],
        });
    });

    test('will report standard error when extendedErrors is not enabled', async () => {
      pgPool.connect.mockClear();
      pgClient.query.mockClear();
      pgClient.release.mockClear();
      const server = await createServer();
      const res = await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{testError}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({
          data: { testError: null },
          errors: [
            {
              message: 'test message',
              locations: [{ line: 1, column: 2 }],
              path: ['testError'],
              extensions: {
                testingExtensions: true,
              },
            },
          ],
        });
      expect(JSON.parse(res.text).errors).toMatchSnapshot();
    });

    test('will report an extended error when extendedErrors is enabled', async () => {
      pgPool.connect.mockClear();
      pgClient.query.mockClear();
      pgClient.release.mockClear();
      const server = await createServer({
        extendedErrors: ['hint', 'detail', 'errcode'],
      });
      const res = await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{testError}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({
          data: { testError: null },
          errors: [
            {
              message: 'test message',
              locations: [{ line: 1, column: 2 }],
              path: ['testError'],
              extensions: {
                testingExtensions: true,
                exception: {
                  hint: 'test hint',
                  detail: 'test detail',
                  errcode: '12345',
                },
              },

              // TODO:v5: remove next 3 lines
              hint: 'test hint',
              detail: 'test detail',
              errcode: '12345',
            },
          ],
        });
      expect(JSON.parse(res.text).errors).toMatchSnapshot();
    });

    test('will allow user to customize errors when handleErrors is set', async () => {
      pgPool.connect.mockClear();
      pgClient.query.mockClear();
      pgClient.release.mockClear();
      const server = await createServer({
        handleErrors: errors => {
          return errors.map(error => {
            return {
              ...error,
              message: 'my custom error message',
              extensions: {
                ...error.extensions,
                exception: {
                  hint: 'my custom error hint',
                  detail: 'my custom error detail',
                },
              },
            };
          });
        },
      });
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{testError}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({
          data: { testError: null },
          errors: [
            {
              message: 'my custom error message',
              locations: [{ line: 1, column: 2 }],
              path: ['testError'],
              extensions: {
                testingExtensions: true,
                exception: {
                  hint: 'my custom error hint',
                  detail: 'my custom error detail',
                },
              },
            },
          ],
        });
    });

    test('will allow user to send custom responses when handleErrors is set and sends a response', async () => {
      pgPool.connect.mockClear();
      pgClient.query.mockClear();
      pgClient.release.mockClear();
      const server = await createServer({
        handleErrors: (errors, req, res) => {
          res.statusCode = 401;
          return errors;
        },
      });
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{testError}' })
        .expect(401, {
          errors: [
            {
              message: 'test message',
              locations: [{ line: 1, column: 2 }],
              path: ['testError'],
              extensions: {
                testingExtensions: true,
              },
            },
          ],
          data: { testError: null },
        });
    });

    if (!subpath) {
      test('will serve a favicon when graphiql is enabled', async () => {
        const server1 = await createServer({ graphiql: true });
        const server2 = await createServer({
          graphiql: true,
          route: `${subpath}/graphql`,
        });
        await request(server1)
          .get('/favicon.ico')
          .expect(200)
          .expect('Cache-Control', 'public, max-age=86400')
          .expect('Content-Type', 'image/x-icon');
        await request(server2)
          .get('/favicon.ico')
          .expect(200)
          .expect('Cache-Control', 'public, max-age=86400')
          .expect('Content-Type', 'image/x-icon');
      });
    }

    test('will not serve a favicon when graphiql is disabled', async () => {
      const server1 = await createServer({ graphiql: false });
      await request(server1).get(`/favicon.ico`).expect(404);
      if (subpath) {
        await request(server1).get(`${subpath}/favicon.ico`).expect(404);
      }
    });

    test('will not allow if no text/event-stream headers are set', async () => {
      const server = await createServer({ graphiql: true, watchPg: true });
      await request(server).get(`${subpath}/graphql/stream`).expect(405);
    });

    test('will return an event-stream', async () => {
      const server = await createServer({ graphiql: true, watchPg: true });
      const promise = request(server)
        .get(`${subpath}/graphql/stream`)
        .set('Accept', 'text/event-stream')
        .expect(200)
        .expect('event: open\n\nevent: change\ndata: schema\n\n')
        .then(res => res); // Trick superagent into finishing
      await sleep(200);
      server._emitter.emit('schemas:changed');
      await sleep(100);
      server._emitter.emit('test:close');

      return await promise;
    });

    test('will render GraphiQL if enabled', async () => {
      const server1 = await createServer();
      const server2 = await createServer({ graphiql: true });
      await request(server1).get(`${subpath}/graphiql`).expect(404);
      await request(server2)
        .get(`${subpath}/graphiql`)
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8');
    });

    test('will set X-GraphQL-Event-Stream if watch enabled', async () => {
      const server1 = await createServer();
      const server2 = await createServer({ watchPg: true });
      const res1 = await request(server1).post(`${subpath}/graphql`).send({ query: '{hello}' });
      expect(res1.headers['x-graphql-event-stream']).toBeFalsy();
      await request(server2)
        .post(`${subpath}/graphql`)
        .send({ query: '{hello}' })
        .expect(200)
        .expect('X-GraphQL-Event-Stream', `${subpath}/graphql/stream`);
    });

    test('will set domain relative X-GraphQL-Event-Stream if prefix ends with a /', async () => {
      const server = await createServer({ watchPg: true, graphqlRoute: '/' });
      await request(server)
        .post(`${subpath}/`)
        .send({ query: '{hello}' })
        .expect(200)
        .expect('X-GraphQL-Event-Stream', `${subpath}/stream`);
    });

    test('will render GraphiQL on another route if desired', async () => {
      const server1 = await createServer({ graphiqlRoute: `/x` });
      const server2 = await createServer({
        graphiql: true,
        graphiqlRoute: `/x`,
      });
      const server3 = await createServer({
        graphiql: false,
        graphiqlRoute: `/x`,
      });
      await request(server1).get(`${subpath}/x`).expect(404);
      await request(server2)
        .get(`${subpath}/x`)
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8');
      await request(server3).get(`${subpath}/x`).expect(404);
      await request(server3).get(`${subpath}/graphiql`).expect(404);
    });

    test('cannot use a rejected GraphQL schema', async () => {
      const rejectedGraphQLSchema = Promise.reject(new Error('Uh oh!'));
      // We don’t want Jest to complain about uncaught promise rejections.
      rejectedGraphQLSchema.catch(() => {
        /* noop */
      });
      const server = await createServer({
        getGqlSchema: () => rejectedGraphQLSchema,
      });
      // We want to hide `console.error` warnings because we are intentionally
      // generating some here.
      const origConsoleError = console.error;
      console.error = () => {
        /* noop */
      };
      try {
        await request(server).post(`${subpath}/graphql`).send({ query: '{hello}' }).expect(500);
      } finally {
        console.error = origConsoleError;
      }
    });

    test('will correctly hand over pgSettings to the withPostGraphileContext call', async () => {
      pgPool.connect.mockClear();
      pgClient.query.mockClear();
      pgClient.release.mockClear();
      const server = await createServer({
        pgSettings: {
          'foo.string': 'test1',
          'foo.number': 42,
        },
      });
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } });
      expect(pgPool.connect.mock.calls).toEqual([[]]);
      expect(pgClient.query.mock.calls).toEqual([
        ['begin'],
        [
          {
            text: 'select set_config($1, $2, true), set_config($3, $4, true)',
            values: ['foo.string', 'test1', 'foo.number', '42'],
          },
        ],
        ['commit'],
      ]);
      expect(pgClient.release.mock.calls).toEqual([[]]);
    });

    test('will correctly hand over pgSettings function to the withPostGraphileContext call', async () => {
      pgPool.connect.mockClear();
      pgClient.query.mockClear();
      pgClient.release.mockClear();
      const server = await createServer({
        pgSettings: req => ({
          'foo.string': 'test1',
          'foo.number': 42,
        }),
      });
      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'world' } });
      expect(pgPool.connect.mock.calls).toEqual([[]]);
      expect(pgClient.query.mock.calls).toEqual([
        ['begin'],
        [
          {
            text: 'select set_config($1, $2, true), set_config($3, $4, true)',
            values: ['foo.string', 'test1', 'foo.number', '42'],
          },
        ],
        ['commit'],
      ]);
      expect(pgClient.release.mock.calls).toEqual([[]]);
    });

    test('will call additionalGraphQLContextFromRequest if provided and add the response to the context', async () => {
      const helloResolver = jest.fn((source, args, context) => context.additional);
      const contextCheckGqlSchema = new GraphQLSchema({
        query: new GraphQLObjectType({
          name: 'Query',
          fields: {
            hello: {
              type: GraphQLString,
              resolve: helloResolver,
            },
          },
        }),
      });
      const additionalGraphQLContextFromRequest = jest.fn(() => ({
        additional: 'foo',
      }));
      const server = await createServer({
        additionalGraphQLContextFromRequest,
        getGqlSchema: () => Promise.resolve(contextCheckGqlSchema),
      });

      await request(server)
        .post(`${subpath}/graphql`)
        .send({ query: '{hello}' })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ data: { hello: 'foo' } });
      expect(additionalGraphQLContextFromRequest).toHaveBeenCalledTimes(1);
      const [req, res] = additionalGraphQLContextFromRequest.mock.calls[0];
      if (req.httpVersionMajor > 1) {
        expect(req).toBeInstanceOf(http2.Http2ServerRequest);
        expect(res).toBeInstanceOf(http2.Http2ServerResponse);
      } else {
        expect(req).toBeInstanceOf(http.IncomingMessage);
        expect(res).toBeInstanceOf(http.ServerResponse);
      }
    });

    if (name === 'koa') {
      const createKoaCompressionServer = () =>
        createServer(
          { graphiql: true },
          {
            onPreCreate: app => {
              app.use(
                compress({
                  threshold: 0,
                }),
              );
            },
          },
        );
      test('koa serves & compresses graphiql route', async () => {
        const server = await createKoaCompressionServer();
        await request(server)
          .get(`${subpath}/graphiql`)
          .expect(200)
          .expect('Content-Encoding', /gzip/);
      });
    }
  });
}
