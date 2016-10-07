import { Pool, PoolConfig } from 'pg'
import { parse as parsePGConnectionString } from 'pg-connection-string'
import createPostGraphQLSchema from './schema/createPostGraphQLSchema'
import createPostGraphQLHTTPRequestHandler, { HTTPRequestHandler } from './http/createPostGraphQLHTTPRequestHandler'

/**
 * Creates a PostGraphQL HTTP request handler by first introspecting the
 * database to get a GraphQL schema, and then using that to create the HTTP
 * request handler.
 */
export default function postgraphql (
  poolOrConfig?: Pool | PoolConfig | string,
  schemas: Array<string> = ['public'],
  options: {
    legacyIds?: boolean,
    graphqlRoute?: string,
    graphiqlRoute?: string,
    graphiql?: boolean,
    showErrorStack?: boolean,
    enableCORS?: boolean,
  } = {},
): HTTPRequestHandler {
  // Do some things with `poolOrConfig` so that in the end, we actually get a
  // Postgres pool.
  const pgPool =
    // If it is already a `Pool`, just use it.
    poolOrConfig instanceof Pool
      ? poolOrConfig
      : new Pool(typeof poolOrConfig === 'string'
        // Otherwise if it is a string, let us parse it to get a config to
        // create a `Pool`.
        ? parsePGConnectionString(poolOrConfig)
        // Finally, it must just be a config itself. If it is undefined, we
        // will just use an empty config and let the defaults take over.
        : poolOrConfig || {}
      )

  // Creates a promise which will resolve to a GraphQL schema. Connects a
  // client from our pool to introspect the database.
  const graphqlSchema = (async () => {
    const pgClient = await pgPool.connect()
    const graphqlSchema = await createPostGraphQLSchema(pgClient, schemas, options)

    // If no release function exists, don’t release. This is just for tests.
    if (pgClient && pgClient.release)
      pgClient.release()

    return graphqlSchema
  })()

  // Finally create our HTTP request handler using our options, the Postgres
  // pool, and GraphQL schema. Return the final result.
  return createPostGraphQLHTTPRequestHandler(Object.assign({}, options, {
    graphqlSchema,
    pgPool,
  }))
}
