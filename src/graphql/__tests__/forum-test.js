import { printSchema } from 'graphql'
import forumInventory from './fixtures/forumInventory'
import createSchema from '../schema/createSchema'

test('will generate the correct schema', () => {
  const gqlSchema = createSchema(forumInventory)
  const printedSchema = printSchema(gqlSchema)
  expect(printedSchema).toMatchSnapshot()
})
