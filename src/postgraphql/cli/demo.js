import { createServer } from 'http'
import { parse as parseConnectionString } from 'pg-connection-string'
import { Inventory } from '../../interface'
import { addPGToInventory } from '../../postgres'
import { createGraphQLHTTPRequestHandler } from '../../graphql'

const DB_URL = 'postgres://dwsfdtfqjlvuja:wnPLVcwYDO7zgp6-nGcEJMvoRM@ec2-23-21-193-140.compute-1.amazonaws.com:5432/d4gr6sbo3n7iro'
const PORT = 3001

const demo = () => {
  process.on('SIGINT', process.exit) // kill server on exit

  const config = Object.assign(
    parseConnectionString(url),
    { ssl: true, schemas: ['a', 'b', 'c'] }
  )

  async function main () {
    const inventory = new Inventory()
    await addPGToInventory(inventory, config)

    const requestHandler = createGraphQLHTTPRequestHandler(inventory, {
      graphiql: true,
      showErrorStack: 'json'
    })

    const server = createServer(requestHandler)

    server.listen(PORT, () => {
      console.log(`🚀  GraphQL server listening at http://localhost:${PORT}/`)
    })
  }

  main().catch(error => console.error(error.stack || error))
}

export default demo
