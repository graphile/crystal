import { printSchema } from 'graphql'
import { Inventory } from '../../interface'
import withPGClient from '../../postgres/__tests__/fixtures/withPGClient'
import { introspectDatabase } from '../../postgres/introspection'
import addPGCatalogToInventory from '../../postgres/inventory/addPGCatalogToInventory'
import createGraphqlSchema from '../../graphql/schema/createGraphqlSchema'

test('prints a schema with the default options', withPGClient(async client => {
  const catalog = await introspectDatabase(client, ['a', 'b', 'c'])
  const inventory = new Inventory()
  addPGCatalogToInventory(inventory, catalog)
  const schema = createGraphqlSchema(inventory)
  expect(printSchema(schema)).toMatchSnapshot()
}))

test('prints a schema with Relay 1 style ids', withPGClient(async client => {
  const catalog = await introspectDatabase(client, ['a', 'b', 'c'])
  const inventory = new Inventory()
  addPGCatalogToInventory(inventory, catalog, { renameIdToRowId: true })
  const schema = createGraphqlSchema(inventory, { nodeIdFieldName: 'id' })
  expect(printSchema(schema)).toMatchSnapshot()
}))
