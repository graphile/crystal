// TODO: This is a temporary main file for testing.

import { createServer } from 'http'
import { Inventory } from '../interface'
import { addPGToInventory } from '../postgres'
import { createGraphQLHTTPRequestHandler } from '../graphql'

const pgConfig = {}

async function main () {
  const inventory = new Inventory()
  await addPGToInventory(inventory, { schemas: ['a', 'b', 'c'] })
  const requestHandler = createGraphQLHTTPRequestHandler(inventory, { graphiql: true })
  const server = createServer(requestHandler)

  server.listen(3000, () => {
    console.log(`GraphQL server listening at http://localhost:3000/ 🚀`)
  })
}

main().catch(error => console.error(error.stack || error))
