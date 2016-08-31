import { resolve } from 'path'
import { readFileSync } from 'fs'
import test from 'ava'
import { printSchema } from 'graphql'
import forumCatalog from '../../catalog/__mocks__/forumCatalog'
import createSchema from '../createSchema'

const expectedForumCatalogSchema =
  readFileSync(resolve(__dirname, 'fixtures/forum-catalog.graphql')).toString()

test('will generate the correct schema', t => {
  const gqlSchema = createSchema(forumCatalog)
  const printedSchema = printSchema(gqlSchema)

  if (printedSchema !== expectedForumCatalogSchema) {
    console.log('----------------------------------------')
    console.log('Actual')
    console.log('----------------------------------------')
    console.log(printedSchema)
    console.log('----------------------------------------')
    console.log('Expected')
    console.log('----------------------------------------')
    console.log(expectedForumCatalogSchema)
    t.fail('Printed schemas do not match.')
  }
})
