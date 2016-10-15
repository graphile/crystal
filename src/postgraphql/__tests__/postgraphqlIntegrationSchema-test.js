// TODO: There may be some excessive waste, if we could somehow filter what
// these guys see, that would be great 👍

import { readFileSync } from 'fs'
import { printSchema } from 'graphql'
import withPgClient from '../../postgres/__tests__/fixtures/withPgClient'
import createPostGraphQLSchema from '../schema/createPostGraphQLSchema'

// This test suite can be flaky in CI. Increase it’s timeout.
if (process.env.CI)
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 10

test('prints a schema with the default options', withPgClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, ['a', 'b', 'c'])
  expect(printSchema(gqlSchema)).toMatchSnapshot()
}))

test('prints a schema with Relay 1 style ids', withPgClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, 'c', { classicIds: true })
  expect(printSchema(gqlSchema)).toMatchSnapshot()
}))

test('prints a schema with a JWT generating mutation', withPgClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, 'b', { jwtSecret: 'secret', jwtPgTypeIdentifier: 'b.jwt_token' })
  expect(printSchema(gqlSchema)).toMatchSnapshot()
}))

test('prints the forum example schema', withPgClient(async pgClient => {
  await pgClient.query(readFileSync('examples/forum/schema-drop.sql', 'utf8').replace(/begin;|commit;/g, ''))
  await pgClient.query(readFileSync('examples/forum/schema.sql', 'utf8').replace(/begin;|commit;/g, ''))
  const gqlSchema = await createPostGraphQLSchema(pgClient, 'forum_example')
  expect(printSchema(gqlSchema)).toMatchSnapshot()
}))
