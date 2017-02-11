jest.mock('fs')

import withPgClient from '../../postgres/__tests__/fixtures/withPgClient'
import createPostGraphQLSchema from '../schema/createPostGraphQLSchema'
import exportPostGraphQLSchema from '../schema/exportPostGraphQLSchema'
import { writeFile } from 'fs'

// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20

beforeEach(() => {
  writeFile.mock.calls = []
})

test('exports a schema as JSON', withPgClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, ['a', 'b', 'c'])
  await exportPostGraphQLSchema(gqlSchema, { exportJsonSchemaPath: '/schema.json' })
  expect(writeFile.mock.calls.length).toBe(1)
  expect(writeFile.mock.calls[0][0]).toBe('/schema.json')
  expect(writeFile.mock.calls[0][1]).toMatchSnapshot()
}))

test('exports a schema as GQL', withPgClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, ['a', 'b', 'c'])
  await exportPostGraphQLSchema(gqlSchema, { exportGqlSchemaPath: '/schema.gql' })
  expect(writeFile.mock.calls.length).toBe(1)
  expect(writeFile.mock.calls[0][0]).toBe('/schema.gql')
  expect(writeFile.mock.calls[0][1]).toMatchSnapshot()
}))

test('does not export a schema when not enabled', withPgClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, ['a', 'b', 'c'])
  await exportPostGraphQLSchema(gqlSchema)
  expect(writeFile.mock.calls.length).toBe(0)
}))
