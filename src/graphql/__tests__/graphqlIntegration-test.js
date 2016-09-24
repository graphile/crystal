import { printSchema } from 'graphql'
import forumInventory from './fixtures/forumInventory'
import createGraphqlSchema from '../schema/createGraphqlSchema'

test('will generate the correct forum schema', () => {
  const gqlSchema = createGraphqlSchema(forumInventory)
  const printedSchema = printSchema(gqlSchema)
  expect(printedSchema).toMatchSnapshot()
})
