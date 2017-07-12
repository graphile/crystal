import { Pool, PoolConfig } from 'pg'
import { parse as parsePgConnectionString } from 'pg-connection-string'
import { GraphQLSchema } from 'graphql'
import { EventEmitter } from 'events'
import chalk = require('chalk')
import { createPostGraphQLSchema, watchPostGraphQLSchema } from 'postgraphql-build'
import createPostGraphQLHttpRequestHandler, { HttpRequestHandler } from './http/createPostGraphQLHttpRequestHandler'
import exportPostGraphQLSchema from './schema/exportPostGraphQLSchema'

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
  jwtPgTypeIdentifier?: string,
  watchPg?: boolean,
  showErrorStack?: boolean,
  disableQueryLog?: boolean,
  disableDefaultMutations?: boolean,
  enableCors?: boolean,
  exportJsonSchemaPath?: string,
  exportGqlSchemaPath?: string,
  bodySizeLimit?: string,
  pgSettings?: { [key: string]: mixed },
}

/**
 * Creates a PostGraphQL Http request handler by first introspecting the
 * database to get a GraphQL schema, and then using that to create the Http
 * request handler.
 */
export default function postgraphql (poolOrConfig?: Pool | PoolConfig | string, schema?: string | Array<string>, options?: PostGraphQLOptions): HttpRequestHandler
export default function postgraphql (poolOrConfig?: Pool | PoolConfig | string, options?: PostGraphQLOptions): HttpRequestHandler
export default function postgraphql (
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

  // Check for a jwtSecret without a jwtPgTypeIdentifier
  // a secret without a token identifier prevents JWT creation
  if (options.jwtSecret && !options.jwtPgTypeIdentifier) {
    // tslint:disable-next-line no-console
    console.warn('WARNING: jwtSecret provided, however jwtPgTypeIdentifier (token identifier) not provided.')
  }

  // Creates the Postgres schemas array.
  const pgSchemas: Array<string> = Array.isArray(schema) ? schema : [schema]

  // Do some things with `poolOrConfig` so that in the end, we actually get a
  // Postgres pool.
  const pgPool =
    // If it is already a `Pool`, just use it.
    poolOrConfig instanceof Pool
      ? poolOrConfig
      : new Pool(typeof poolOrConfig === 'string'
        // Otherwise if it is a string, let us parse it to get a config to
        // create a `Pool`.
        ? parsePgConnectionString(poolOrConfig)
        // Finally, it must just be a config itself. If it is undefined, we
        // will just use an empty config and let the defaults take over.
        : poolOrConfig || {},
      )

  const _emitter = new EventEmitter()

  // Creates a promise which will resolve to a GraphQL schema. Connects a
  // client from our pool to introspect the database.
  //
  // This is not a constant because when we are in watch mode, we want to swap
  // out the `gqlSchema`.
  let gqlSchema = createGqlSchema();

  // Finally create our Http request handler using our options, the Postgres
  // pool, and GraphQL schema. Return the final result.
  return createPostGraphQLHttpRequestHandler(Object.assign({}, options, {
    getGqlSchema: () => gqlSchema,
    pgPool,
    _emitter,
  }))

  async function createGqlSchema (): Promise<GraphQLSchema> {
    try {
      if (options.watchPg) {
        let firstSchema = true;
        await watchPostGraphQLSchema(pgPool, pgSchemas, options, schema => {
          gqlSchema = schema
          if (firstSchema) {
            firstSchema = false;
          } else {
            _emitter.emit('schemas:changed')
          }
          exportGqlSchema(gqlSchema)
        });
        if (firstSchema) {
          throw new Error("Consistency error: watchPostGraphQLSchema promises to call the callback before the promise resolves; but this hasn't happened")
        }
      } else {
        gqlSchema = await createPostGraphQLSchema(pgPool, pgSchemas, options)
        exportGqlSchema(gqlSchema)
      }
      return gqlSchema;
    }
    // If we fail to build our schema, log the error and exit the process.
    catch (error) {
      return handleFatalError(error)
    }
  }

  async function exportGqlSchema (newGqlSchema: GraphQLSchema): Promise<void> {
    try {
      await exportPostGraphQLSchema(newGqlSchema, options)
    }
    // If we fail to export our schema, log the error and exit the process.
    catch (error) {
      handleFatalError(error)
    }
  }
}

function handleFatalError (error: Error): never {
  // tslint:disable-next-line no-console
  console.error(`${error.stack}\n`)
  process.exit(1)

  // `process.exit` will mean all code below it will never get called.
  // However, we need to return a value with type `never` here for
  // TypeScript.
  return null as never
}
