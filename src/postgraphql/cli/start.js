import { createServer } from 'http'
import { parse as parseConnectionString } from 'pg-connection-string'
import { Inventory } from '../../interface'
import { addPGToInventory } from '../../postgres'
import { createGraphQLHTTPRequestHandler } from '../../graphql'
import * as logger from './logger'

const start = (url, command) => {
  process.on('SIGINT', process.exit) // kill server on exit

  const {
    anonymousRole,
    cors = false,
    development = false,
    graphqlRoute = '/graphl',
    graphiqlRoute = '/graphiql',
    hostname = 'localhost',
    maxPoolSize = 10,
    port = 3001,
    relayLegacy = false,
    schemas = ['public'],
    secret,
  } = command

  // check env variables?
  if (!url)
    url = 'postgres://localhost:5432'

  const config = Object.assign(
    parseConnectionString(url),
    { renameIdToRowId: relayLegacy },
    { schemas }
  )

  async function main () {
    const inventory = new Inventory()
    await addPGToInventory(inventory, config)

    const requestHandler = createGraphQLHTTPRequestHandler(inventory, {
      enableCORS: cors,
      graphqlRoute,
      graphiqlRoute,
      graphiql: development,
      nodeIdFieldName: relayLegacy ? 'id' : null,
      showErrorStack: development ? 'json' : null,
    })

    const server = createServer(requestHandler)

    server.listen(port, hostname, () => {
      const url = `http://${hostname}:${port}`
      logger.log()
      logger.start(`GraphQL server listening at ${url}${graphqlRoute}`)
      if (development)
        logger.log(`Your are in development mode. You can access graphiql here ${url}${graphiqlRoute}.`)
    })
  }

  main().catch(error => console.error(error.stack || error))
}

export default start
