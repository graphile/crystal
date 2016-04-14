/* eslint-disable no-console */

import './promisify'

import path from 'path'
import { readFileSync } from 'fs'
import { Command } from 'commander'
import { parse as parseConnectionString } from 'pg-connection-string'
import createGraphqlSchema from './createGraphqlSchema.js'
import createExpressServer from './createExpressServer.js'

const manifest = readFileSync(path.resolve(__dirname, '../package.json'))

const main = async () => {
  const program = new Command('postgraphql')

  /* eslint-disable max-len */
  program
  .version(manifest.version)
  .usage('[options] <url>')
  .option('-s, --schema <identifier>', 'the PostgreSQL schema to serve a GraphQL server of. defaults to public')
  .option('-n, --hostname <name>', 'a URL hostname the server will listen to. defaults to localhost')
  .option('-p, --port <integer>', 'a URL port the server will listen to. defaults to 3000', parseInt)
  .option('-r, --route <path>', 'the route to mount the GraphQL server on. defaults to /')
  .option('-d, --development', 'enables a development mode which enables GraphiQL, nicer errors, and JSON pretty printing')
  .option('-m, --max-pool-size', 'the maximum number of connections to keep in the connection pool. defaults to 10')
  .parse(process.argv)
  /* eslint-enable max-len */

  const {
    args: [connection],
    schema: schemaName = 'public',
    hostname = 'localhost',
    port = 3000,
    route = '/',
    development = false,
    maxPoolSize = 10,
  } = program

  if (!connection)
    throw new Error('Must define a PostgreSQL connection string to connect to.')

  // Parse out the connection string into an object and attach a
  // `poolSize` option.
  const pgConfig = {
    ...parseConnectionString(connection),
    poolSize: maxPoolSize,
  }

  // Create the GraphQL schema.
  const graphqlSchema = await createGraphqlSchema(pgConfig, schemaName)

  // Create the GraphQL HTTP server.
  const server = await createExpressServer({
    graphqlSchema,
    route,
    development,
  })

  server.listen(port, hostname, () => {
    console.log(`GraphQL server listening at http://${hostname}:${port}${route} 🚀`)
  })
}

main().catch(error => console.error(error.stack))
