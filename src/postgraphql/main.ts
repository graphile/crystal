// TODO: This is a temporary main file for testing.

import { createServer } from 'http'
import { Pool, PoolConfig } from 'pg'
import createPostGraphQLSchema from './schema/createPostGraphQLSchema'
import createPostGraphQLHTTPRequestHandler from './http/createPostGraphQLHTTPRequestHandler'

// The default Postgres config.
const pgConfig: PoolConfig = {
  max: 10,
}

async function main () {
  const pgPool = new Pool(pgConfig)
  const pgClient = await pgPool.connect()

  const graphqlSchema = await createPostGraphQLSchema({
    pgClient,
    pgSchemas: ['a', 'b', 'c'],
  })

  pgClient.release()

  const requestHandler = createPostGraphQLHTTPRequestHandler({
    graphqlSchema,
    pgPool,
    graphiql: true,
    showErrorStack: 'json',
  })

  const server = createServer(requestHandler)

  server.listen(3000, () => {
    console.log(`GraphQL server listening at http://localhost:3000/ 🚀`)
  })
}

main().catch(error => console.error(error.stack || error))
