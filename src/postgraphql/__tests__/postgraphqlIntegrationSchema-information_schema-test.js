import { printSchema } from 'graphql'
import withPGClient from '../../postgres/__tests__/fixtures/withPGClient'
import createPostGraphQLSchema from '../schema/createPostGraphQLSchema'

test('prints the GraphQL schema for `information_schema`', withPGClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, ['information_schema'])
  expect(printSchema(gqlSchema)).toMatchSnapshot()
}))
