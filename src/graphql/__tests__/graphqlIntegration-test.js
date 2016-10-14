import { printSchema } from 'graphql'
import forumInventory from './fixtures/forumInventory'
import createGqlSchema from '../schema/createGqlSchema'

test('will generate the correct forum schema', () => {
  const gqlSchema = createGqlSchema(forumInventory)
  const printedSchema = printSchema(gqlSchema)
  expect(printedSchema).toMatchSnapshot()
})
