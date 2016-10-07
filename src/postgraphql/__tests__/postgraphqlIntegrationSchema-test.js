import { printSchema } from 'graphql'
import withPGClient from '../../postgres/__tests__/fixtures/withPGClient'
import createPostGraphQLSchema from '../schema/createPostGraphQLSchema'

test('prints a schema with the default options', withPGClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, ['a', 'b', 'c'])
  expect(printSchema(gqlSchema)).toMatchSnapshot()
}))

test('prints a schema with Relay 1 style ids', withPGClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, ['a', 'b', 'c'], { legacyIds: true })
  expect(printSchema(gqlSchema)).toMatchSnapshot()
}))
