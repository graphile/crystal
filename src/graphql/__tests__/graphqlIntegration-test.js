import { printSchema } from 'graphql'
import forumInventory from './fixtures/forumInventory'
import createGQLSchema from '../schema/createGQLSchema'

test('will generate the correct forum schema', () => {
  const gqlSchema = createGQLSchema(forumInventory)
  const printedSchema = printSchema(gqlSchema)
  expect(printedSchema).toMatchSnapshot()
})
