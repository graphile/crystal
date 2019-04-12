import { Pool, PoolConfig } from 'pg';
import { IncomingMessage, ServerResponse } from 'http';
import { GraphQLSchema } from 'graphql';
import { EventEmitter } from 'events';
import { createPostGraphileSchema, watchPostGraphileSchema } from 'postgraphile-core';
import createPostGraphileHttpRequestHandler from './http/createPostGraphileHttpRequestHandler';
import exportPostGraphileSchema from './schema/exportPostGraphileSchema';
import { pluginHookFromOptions } from './pluginHook';
import { PostGraphileOptions, mixed, HttpRequestHandler } from '../interfaces';
import chalk = require('chalk');

// tslint:disable-next-line no-any
function isPlainObject(obj: any) {
  if (!obj || typeof obj !== 'object' || String(obj) !== '[object Object]') return false;
  const proto = Object.getPrototypeOf(obj);
  if (proto === null || proto === Object.prototype) {
    return true;
  }
  return false;
}

export interface PostgraphileSchemaBuilder<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
> {
  _emitter: EventEmitter;
  getGraphQLSchema: () => Promise<GraphQLSchema>;
  options: PostGraphileOptions<Request, Response>;
}

/**
 * Creates a PostGraphile Http request handler by first introspecting the
 * database to get a GraphQL schema, and then using that to create the Http
 * request handler.
 */
export function getPostgraphileSchemaBuilder<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
>(
  pgPool: Pool,
  schema: string | Array<string>,
  incomingOptions: PostGraphileOptions<Request, Response>,
): PostgraphileSchemaBuilder {
  if (incomingOptions.live && incomingOptions.subscriptions == null) {
    // live implies subscriptions
    incomingOptions.subscriptions = true;
  }
  const pluginHook = pluginHookFromOptions(incomingOptions);
  const options = pluginHook('postgraphile:options', incomingOptions, {
    pgPool,
    schema,
  });
  // Check for a jwtSecret without a jwtPgTypeIdentifier
  // a secret without a token identifier prevents JWT creation
  if (options.jwtSecret && !options.jwtPgTypeIdentifier) {
    // tslint:disable-next-line no-console
    console.warn(
      'WARNING: jwtSecret provided, however jwtPgTypeIdentifier (token identifier) not provided.',
    );
  }

  if (options.handleErrors && (options.extendedErrors || options.showErrorStack)) {
    throw new Error(`You cannot combine 'handleErrors' with the other error options`);
  }

  // Creates the Postgres schemas array.
  const pgSchemas: Array<string> = Array.isArray(schema) ? schema : [schema];

  const _emitter: EventEmitter = options['_emitter'] || new EventEmitter();

  // Creates a promise which will resolve to a GraphQL schema. Connects a
  // client from our pool to introspect the database.
  //
  // This is not a constant because when we are in watch mode, we want to swap
  // out the `gqlSchema`.
  let gqlSchema: GraphQLSchema;
  const gqlSchemaPromise: Promise<GraphQLSchema> = createGqlSchema();

  return {
    _emitter,
    getGraphQLSchema: () => Promise.resolve(gqlSchema || gqlSchemaPromise),
    options,
  };

  async function createGqlSchema(): Promise<GraphQLSchema> {
    try {
      if (options.watchPg) {
        await watchPostGraphileSchema(pgPool, pgSchemas, options, newSchema => {
          gqlSchema = newSchema;
          _emitter.emit('schemas:changed');
          exportGqlSchema(gqlSchema);
        });
        if (!gqlSchema) {
          throw new Error(
            "Consistency error: watchPostGraphileSchema promises to call the callback before the promise resolves; but this hasn't happened",
          );
        }
      } else {
        gqlSchema = await createPostGraphileSchema(pgPool, pgSchemas, options);
        exportGqlSchema(gqlSchema);
      }
      return gqlSchema;
    } catch (error) {
      // If we fail to build our schema, log the error and exit the process.
      return handleFatalError(error, 'building the initial schema');
    }
  }

  async function exportGqlSchema(newGqlSchema: GraphQLSchema): Promise<void> {
    try {
      await exportPostGraphileSchema(newGqlSchema, options);
    } catch (error) {
      // If we fail to export our schema, log the error and exit the process.
      handleFatalError(error, 'exporting the schema');
    }
  }
}
export default function postgraphile<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
>(
  poolOrConfig?: Pool | PoolConfig | string,
  schema?: string | Array<string>,
  options?: PostGraphileOptions<Request, Response>,
): HttpRequestHandler;
export default function postgraphile<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
>(
  poolOrConfig?: Pool | PoolConfig | string,
  options?: PostGraphileOptions<Request, Response>,
): HttpRequestHandler;
export default function postgraphile<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse
>(
  poolOrConfig?: Pool | PoolConfig | string,
  schemaOrOptions?: string | Array<string> | PostGraphileOptions<Request, Response>,
  maybeOptions?: PostGraphileOptions<Request, Response>,
): HttpRequestHandler {
  let schema: string | Array<string>;
  // These are the raw options we're passed in; getPostgraphileSchemaBuilder
  // must process them with `pluginHook` before we can rely on them.
  let incomingOptions: PostGraphileOptions<Request, Response>;

  // If the second argument is a string or array, it is the schemas so set the
  // `schema` value and try to use the third argument (or a default) for
  // `incomingOptions`.
  if (typeof schemaOrOptions === 'string' || Array.isArray(schemaOrOptions)) {
    schema = schemaOrOptions;
    incomingOptions = maybeOptions || {};
  }
  // If the second argument is null or an object then use default `schema`
  // and set incomingOptions to second or third argument (or default).
  else if (typeof schemaOrOptions === 'object') {
    schema = 'public';
    incomingOptions = schemaOrOptions || maybeOptions || {};
  }
  // Otherwise if the second argument is present it's invalid: throw an error.
  else if (arguments.length > 1) {
    throw new Error(
      'The second argument to postgraphile was invalid... did you mean to set a schema?',
    );
  }
  // No schema or options specified, use defaults.
  else {
    schema = 'public';
    incomingOptions = {};
  }

  if (typeof poolOrConfig === 'undefined' && arguments.length >= 1) {
    throw new Error(
      'The first argument to postgraphile was `undefined`... did you mean to set pool options?',
    );
  }

  // Do some things with `poolOrConfig` so that in the end, we actually get a
  // Postgres pool.
  const pgPool = toPgPool(poolOrConfig);

  pgPool.on('error', err => {
    /*
     * This handler is required so that client connection errors don't bring
     * the server down (via `unhandledError`).
     *
     * `pg` will automatically terminate the client and remove it from the
     * pool, so we don't actually need to take any action here, just ensure
     * that the event listener is registered.
     */
    // tslint:disable-next-line no-console
    console.error('PostgreSQL client generated error: ', err.message);
  });

  const { getGraphQLSchema, options, _emitter } = getPostgraphileSchemaBuilder<Request, Response>(
    pgPool,
    schema,
    incomingOptions,
  );
  return createPostGraphileHttpRequestHandler({
    ...(typeof poolOrConfig === 'string' ? { ownerConnectionString: poolOrConfig } : {}),
    ...options,
    getGqlSchema: getGraphQLSchema,
    pgPool,
    _emitter,
  });
}

function handleFatalError(error: Error, when: string): never {
  process.stderr.write(
    `A fatal error occurred when ${chalk.bold(
      when,
    )}, so the process will now exit. Error details:\n\n`,
  );
  process.stderr.write(`${error.stack}\n`); // console.error fails under the tests
  process.exit(1);

  // `process.exit` will mean all code below it will never get called.
  // However, we need to return a value with type `never` here for
  // TypeScript.
  return null as never;
}

function hasPoolConstructor(obj: mixed): boolean {
  return (
    // tslint:disable-next-line no-any
    (obj && typeof obj.constructor === 'function' && obj.constructor === (Pool as any).super_) ||
    false
  );
}

function constructorName(obj: mixed): string | null {
  return (
    (obj &&
      typeof obj.constructor === 'function' &&
      obj.constructor.name &&
      String(obj.constructor.name)) ||
    null
  );
}

// tslint:disable-next-line no-any
function toPgPool(poolOrConfig: any): Pool {
  if (quacksLikePgPool(poolOrConfig)) {
    // If it is already a `Pool`, just use it.
    return poolOrConfig;
  }

  if (typeof poolOrConfig === 'string') {
    // If it is a string, let us parse it to get a config to create a `Pool`.
    return new Pool({ connectionString: poolOrConfig });
  } else if (!poolOrConfig) {
    // Use an empty config and let the defaults take over.
    return new Pool({});
  } else if (isPlainObject(poolOrConfig)) {
    // The user handed over a configuration object, pass it through
    return new Pool(poolOrConfig);
  } else {
    throw new Error('Invalid connection string / Pool ');
  }
}

// tslint:disable-next-line no-any
function quacksLikePgPool(pgConfig: any): pgConfig is Pool {
  if (pgConfig instanceof Pool) return true;
  if (hasPoolConstructor(pgConfig)) return true;

  // A diagnosis of exclusion
  if (!pgConfig || typeof pgConfig !== 'object') return false;
  if (constructorName(pgConfig) !== 'Pool' && constructorName(pgConfig) !== 'BoundPool')
    return false;
  if (!pgConfig['Client']) return false;
  if (!pgConfig['options']) return false;
  if (typeof pgConfig['connect'] !== 'function') return false;
  if (typeof pgConfig['end'] !== 'function') return false;
  if (typeof pgConfig['query'] !== 'function') return false;
  return true;
}
