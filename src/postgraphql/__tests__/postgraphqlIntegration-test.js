import { printSchema } from 'graphql'
import { Inventory } from '../../interface'
import getTestPGClient from '../../postgres/__tests__/fixtures/getTestPGClient'
import { introspectDatabase } from '../../postgres/introspection'
import addPGToInventory from '../../postgres/inventory/addPGToInventory'
import createSchema from '../../graphql/schema/createSchema'

test('forum example', async () => {
  const client = await getTestPGClient()
  const catalog = await introspectDatabase(client, ['a', 'b', 'c'])

  const inventory1 = new Inventory()
  addPGToInventory(inventory1, catalog)
  const schema1 = createSchema(inventory1)

  const inventory2 = new Inventory()
  addPGToInventory(inventory2, catalog, { renameIdToRowId: true })
  const schema2 = createSchema(inventory2, { nodeIdFieldName: 'id' })

  expect(printSchema(schema1)).toMatchSnapshot()
  expect(printSchema(schema2)).toMatchSnapshot()
})
