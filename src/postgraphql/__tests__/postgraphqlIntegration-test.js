import { printSchema } from 'graphql'
import { Inventory } from '../../interface'
import getTestPGClient from '../../postgres/__tests__/fixtures/getTestPGClient'
import { introspectDatabase } from '../../postgres/introspection'
import addPGToInventory from '../../postgres/inventory/addPGToInventory'
import createSchema from '../../graphql/schema/createSchema'

test('forum example', async () => {
  const client = await getTestPGClient()
  const catalog = await introspectDatabase(client, ['a', 'b', 'c'])
  const inventory = new Inventory()
  addPGToInventory(inventory, catalog)
  const schema = createSchema(inventory)

  expect(printSchema(schema)).toMatchSnapshot()
})
