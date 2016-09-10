import { resolve } from 'path'
import { readFileSync } from 'fs'
import { Client } from 'pg'
import { printSchema } from 'graphql'
import introspectDatabase from '../../postgres/introspection/introspectDatabase'
import createInventory from '../../postgres/inventory/createInventory'
import testPGConnection from '../../postgres/__tests__/fixtures/testPGConnection'
import createSchema from '../../graphql/schema/createSchema'

const testSchema = readFileSync(resolve(__dirname, '../../../examples/forum/schema.sql')).toString()

test('forum example', async () => {
  const client = new Client(testPGConnection)

  await client.connect()
  await client.query('drop schema if exists forum_example, forum_example_utils cascade;')
  await client.query(testSchema)

  const catalog = await introspectDatabase(client, ['forum_example'])
  const inventory = createInventory(catalog)
  const schema = createSchema(inventory)

  await client.query('drop schema if exists forum_example, forum_example_utils cascade;')

  expect(printSchema(schema)).toMatchSnapshot()

  client.end()
})
