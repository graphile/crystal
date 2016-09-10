import { printSchema } from 'graphql'
import forumCatalog from './fixtures/forumCatalog'
import createSchema from '../schema/createSchema'

test('will generate the correct schema', () => {
  const gqlSchema = createSchema(forumCatalog)
  const printedSchema = printSchema(gqlSchema)
  expect(printedSchema).toMatchSnapshot()
})
