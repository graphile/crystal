import { resolve as resolvePath } from 'path'
import { readFile, readdirSync } from 'fs'
import { graphql } from 'graphql'
import { Inventory } from '../../interface'
import withPGClient from '../../postgres/__tests__/fixtures/withPGClient'
import { introspectDatabase } from '../../postgres/introspection'
import addPGCatalogToInventory from '../../postgres/inventory/addPGCatalogToInventory'
import { createPGContext } from '../../postgres/inventory/pgContext'
import createGraphqlSchema from '../../graphql/schema/createGraphqlSchema'

const kitchenSinkData = new Promise((resolve, reject) => {
  readFile(resolvePath(__dirname, '../../../resources/kitchen-sink-data.sql'), (error, data) => {
    if (error) reject(error)
    else resolve(data.toString())
  })
})

const queriesDir = resolvePath(__dirname, 'fixtures/queries')

for (const file of readdirSync(queriesDir)) {
  test(`operation ${file}`, withPGClient(async client => {
    const catalog = await introspectDatabase(client, ['a', 'b', 'c'])
    const inventory = new Inventory()
    addPGCatalogToInventory(inventory, catalog)
    const schema = createGraphqlSchema(inventory)

    const query = await new Promise((resolve, reject) => {
      readFile(resolvePath(queriesDir, file), (error, data) => {
        if (error) reject(error)
        else resolve(data.toString())
      })
    })

    await client.query(await kitchenSinkData)
    const context = createPGContext(client)

    const result = await graphql(schema, query, null, context)

    // Log the errors in our result.
    if (result.errors)
      for (const e of result.errors)
        console.error(e.stack || e)

    expect(result).toMatchSnapshot()
  }))
}
