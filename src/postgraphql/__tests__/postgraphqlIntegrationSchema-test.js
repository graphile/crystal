// TODO: There may be some excessive waste, if we could somehow filter what
// these guys see, that would be great 👍

import { printSchema } from 'graphql'
import withPGClient from '../../postgres/__tests__/fixtures/withPGClient'
import createPostGraphQLSchema from '../schema/createPostGraphQLSchema'

// This test suite can be flaky in CI. Increase it’s timeout.
if (process.env.CI)
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 10

test('prints a schema with the default options', withPGClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, ['a', 'b', 'c'])
  expect(printSchema(gqlSchema)).toMatchSnapshot()
}))

test('prints a schema with Relay 1 style ids', withPGClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, ['c'], { classicIds: true })
  expect(printSchema(gqlSchema)).toMatchSnapshot()
}))

test('prints a schema with a JWT generating mutation', withPGClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, ['b'], { jwtSecret: 'secret', jwtPgTypeIdentifier: 'b.jwt_token' })
  expect(printSchema(gqlSchema)).toMatchSnapshot()
}))
