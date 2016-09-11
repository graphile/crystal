import { printSchema } from 'graphql'
import { Inventory } from '../../interface'
import getTestPGCatalog from '../../postgres/__tests__/fixtures/getTestPGCatalog'
import addPGToInventory from '../../postgres/inventory/addPGToInventory'
import createSchema from '../../graphql/schema/createSchema'

test('forum example', async () => {
  const catalog = await getTestPGCatalog()
  const inventory = new Inventory()
  addPGToInventory(inventory, catalog)
  const schema = createSchema(inventory)

  expect(printSchema(schema)).toMatchSnapshot()
})
