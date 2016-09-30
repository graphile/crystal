import { resolve as resolvePath } from 'path'
import { readFile, readdirSync } from 'fs'
import { GraphQLSchema, printSchema, graphql } from 'graphql'
import { Inventory, Context } from '../../interface'
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

/**
 * @type {GraphQLSchema}
 */
let schema1, schema2

beforeAll(withPGClient(async client => {
  try {
    const catalog = await introspectDatabase(client, ['a', 'b', 'c'])

    const inventory1 = new Inventory()
    addPGCatalogToInventory(inventory1, catalog)
    schema1 = createGraphqlSchema(inventory1)

    const inventory2 = new Inventory()
    addPGCatalogToInventory(inventory2, catalog, { renameIdToRowId: true })
    schema2 = createGraphqlSchema(inventory2, { nodeIdFieldName: 'id' })
  }
  catch (error) {
    console.error(error.stack)
    throw error
  }
}))

test('schema', async () => {
  expect(printSchema(schema1)).toMatchSnapshot()
  expect(printSchema(schema2)).toMatchSnapshot()
})

const queriesDir = resolvePath(__dirname, 'fixtures/queries')

for (const file of readdirSync(queriesDir)) {
  test(`query ${file}`, withPGClient(async client => {
    const query = await new Promise((resolve, reject) => {
      readFile(resolvePath(queriesDir, file), (error, data) => {
        if (error) reject(error)
        else resolve(data.toString())
      })
    })

    await client.query(await kitchenSinkData)
    const context = createPGContext(client)

    const result = await graphql(schema1, query, null, context)

    // Log the errors in our result.
    if (result.errors)
      for (const e of result.errors)
        console.error(e.stack || e)

    expect(result).toMatchSnapshot()
  }))
}
