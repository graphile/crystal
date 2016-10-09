import { printSchema } from 'graphql'
import withPGClient from '../../postgres/__tests__/fixtures/withPGClient'
import createPostGraphQLSchema from '../schema/createPostGraphQLSchema'

test('prints the GraphQL schema for `pg_catalog`', withPGClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, ['pg_catalog'])
  expect(printSchema(gqlSchema)).toMatchSnapshot()
}))
