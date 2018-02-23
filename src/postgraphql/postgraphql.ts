import { Pool, PoolConfig } from 'pg'
import { parse as parsePgConnectionString } from 'pg-connection-string'
import { GraphQLSchema } from 'graphql'
import { EventEmitter } from 'events'
import { createPostGraphileSchema, watchPostGraphileSchema } from 'postgraphile-core'
import createPostGraphQLHttpRequestHandler, { HttpRequestHandler } from './http/createPostGraphQLHttpRequestHandler'
import exportPostGraphQLSchema from './schema/exportPostGraphQLSchema'
import { IncomingMessage, ServerResponse } from 'http'
import jwt = require('jsonwebtoken')

type PostGraphQLOptions = {
  classicIds?: boolean,
  dynamicJson?: boolean,
  graphqlRoute?: string,
  graphiqlRoute?: string,
  graphiql?: boolean,
  pgDefaultRole?: string,
  jwtSecret?: string,
  jwtAudiences?: Array<string>,
  jwtRole?: Array<string>,
  jwtVerifyOptions?: jwt.VerifyOptions,
  jwtPgTypeIdentifier?: string,
  watchPg?: boolean,
  showErrorStack?: boolean,
  extendedErrors?: Array<string>,
  disableQueryLog?: boolean,
  disableDefaultMutations?: boolean,
  enableCors?: boolean,
  exportJsonSchemaPath?: string,
  exportGqlSchemaPath?: string,
  bodySizeLimit?: string,
  pgSettings?: { [key: string]: mixed } | ((req: IncomingMessage) => Promise<{[key: string]: mixed }>),
  appendPlugins?: Array<(builder: mixed) => {}>,
  prependPlugins?: Array<(builder: mixed) => {}>,
  replaceAllPlugins?: Array<(builder: mixed) => {}>,
  additionalGraphQLContextFromRequest?: (req: IncomingMessage, res: ServerResponse) => Promise<{}>,
  readCache?: string,
  writeCache?: string,
  legacyRelations?: 'only' | 'deprecated' | 'omit',
}

type PostgraphileSchemaBuilder = {
  _emitter: EventEmitter,
  getGraphQLSchema: () => Promise<GraphQLSchema>,
}

/**
 * Creates a PostGraphQL Http request handler by first introspecting the
 * database to get a GraphQL schema, and then using that to create the Http
 * request handler.
 */
export function getPostgraphileSchemaBuilder(pgPool: Pool, schema: string | Array<string>, options: PostGraphQLOptions): PostgraphileSchemaBuilder {
  // Check for a jwtSecret without a jwtPgTypeIdentifier
  // a secret without a token identifier prevents JWT creation
  if (options.jwtSecret && !options.jwtPgTypeIdentifier) {
    // tslint:disable-next-line no-console
    console.warn('WARNING: jwtSecret provided, however jwtPgTypeIdentifier (token identifier) not provided.')
  }

  // Creates the Postgres schemas array.
  const pgSchemas: Array<string> = Array.isArray(schema) ? schema : [schema]

  const _emitter = new EventEmitter()

  // Creates a promise which will resolve to a GraphQL schema. Connects a
  // client from our pool to introspect the database.
  //
  // This is not a constant because when we are in watch mode, we want to swap
  // out the `gqlSchema`.
  let gqlSchema: GraphQLSchema
  let gqlSchemaPromise: Promise<GraphQLSchema> = createGqlSchema()

  return {
    _emitter,
    getGraphQLSchema: () => Promise.resolve(gqlSchema || gqlSchemaPromise),
  }

  async function createGqlSchema(): Promise<GraphQLSchema> {
    try {
      if (options.watchPg) {
        await watchPostGraphileSchema(pgPool, pgSchemas, options, (newSchema: GraphQLSchema) => {
          gqlSchema = newSchema
          _emitter.emit('schemas:changed')
          exportGqlSchema(gqlSchema)
        })
        if (!gqlSchema) {
          throw new Error('Consistency error: watchPostGraphQLSchema promises to call the callback before the promise resolves; but this hasn\'t happened')
        }
      } else {
        gqlSchema = await createPostGraphileSchema(pgPool, pgSchemas, options)
        exportGqlSchema(gqlSchema)
      }
      return gqlSchema
    }
    // If we fail to build our schema, log the error and exit the process.
    catch (error) {
      return handleFatalError(error)
    }
  }

  async function exportGqlSchema(newGqlSchema: GraphQLSchema): Promise<void> {
    try {
      await exportPostGraphQLSchema(newGqlSchema, options)
    }
    // If we fail to export our schema, log the error and exit the process.
    catch (error) {
      handleFatalError(error)
    }
  }
}
export default function postgraphile(poolOrConfig?: Pool | PoolConfig | string, schema?: string | Array<string>, options?: PostGraphQLOptions): HttpRequestHandler
export default function postgraphile(poolOrConfig?: Pool | PoolConfig | string, options?: PostGraphQLOptions): HttpRequestHandler
export default function postgraphile(
  poolOrConfig?: Pool | PoolConfig | string,
  schemaOrOptions?: string | Array<string> | PostGraphQLOptions,
  maybeOptions?: PostGraphQLOptions,
): HttpRequestHandler {
  let schema: string | Array<string>
  let options: PostGraphQLOptions

  // If the second argument is undefined, use defaults for both `schema` and
  // `options`.
  if (typeof schemaOrOptions === 'undefined') {
    schema = 'public'
    options = {}
  }
  // If the second argument is a string or array, it is the schemas so set the
  // `schema` value and try to use the third argument (or a default) for
  // `options`.
  else if (typeof schemaOrOptions === 'string' || Array.isArray(schemaOrOptions)) {
    schema = schemaOrOptions
    options = maybeOptions || {}
  }
  // Otherwise the second argument is the options so set `schema` to the
  // default and `options` to the second argument.
  else {
    schema = 'public'
    options = schemaOrOptions
  }

  // Do some things with `poolOrConfig` so that in the end, we actually get a
  // Postgres pool.
  const pgPool: Pool =
    // If it is already a `Pool`, just use it.
    poolOrConfig instanceof Pool || quacksLikePgPool(poolOrConfig)
      ? (poolOrConfig as Pool)
      : new Pool(typeof poolOrConfig === 'string'
        // Otherwise if it is a string, let us parse it to get a config to
        // create a `Pool`.
        ? parsePgConnectionString(poolOrConfig)
        // Finally, it must just be a config itself. If it is undefined, we
        // will just use an empty config and let the defaults take over.
        : poolOrConfig || {},
      )

  const { getGraphQLSchema, _emitter } = getPostgraphileSchemaBuilder(pgPool, schema, options)
  return createPostGraphQLHttpRequestHandler(Object.assign({}, options, {
    getGqlSchema: getGraphQLSchema,
    pgPool,
    _emitter,
  }))
}

function handleFatalError(error: Error): never {
  process.stderr.write(`${error.stack}\n`) // console.error fails under the tests
  process.exit(1)

  // `process.exit` will mean all code below it will never get called.
  // However, we need to return a value with type `never` here for
  // TypeScript.
  return null as never
}

function constructorName(obj: mixed): string | null {
  return obj && typeof obj.constructor === 'function' && obj.constructor.name && String(obj.constructor.name) || null
}

// tslint:disable-next-line no-any
function quacksLikePgPool(pgConfig: any): boolean {
  // A diagnosis of exclusion
  if (!pgConfig || typeof pgConfig !== 'object') return false
  if (constructorName(pgConfig) !== 'Pool' && constructorName(pgConfig) !== 'BoundPool') return false
  if (!pgConfig['Client']) return false
  if (!pgConfig['options']) return false
  if (typeof pgConfig['connect'] !== 'function') return false
  if (typeof pgConfig['end'] !== 'function') return false
  if (typeof pgConfig['query'] !== 'function') return false
  return true
}
