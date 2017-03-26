jest.mock('fs')

import withPgClient from '../../__tests__/utils/withPgClient'
import createPostGraphQLSchema from '../schema/createPostGraphQLSchema'
import exportPostGraphQLSchema from '../schema/exportPostGraphQLSchema'
import { writeFile } from 'fs'

// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20

const gqlSchemaPromise = withPgClient(async pgClient => {
  return await createPostGraphQLSchema(pgClient, ['a', 'b', 'c'])
})()

test('exports a schema as JSON', async () => {
  writeFile.mockClear()
  const gqlSchema = await gqlSchemaPromise
  await exportPostGraphQLSchema(gqlSchema, { exportJsonSchemaPath: '/schema.json' })
  expect(writeFile.mock.calls.length).toBe(1)
  expect(writeFile.mock.calls[0][0]).toBe('/schema.json')
  expect(writeFile.mock.calls[0][1]).toMatchSnapshot()
})

test('exports a schema as GQL', async () => {
  writeFile.mockClear()
  const gqlSchema = await gqlSchemaPromise
  await exportPostGraphQLSchema(gqlSchema, { exportGqlSchemaPath: '/schema.gql' })
  expect(writeFile.mock.calls.length).toBe(1)
  expect(writeFile.mock.calls[0][0]).toBe('/schema.gql')
  expect(writeFile.mock.calls[0][1]).toMatchSnapshot()
})

test('does not export a schema when not enabled', async () => {
  writeFile.mockClear()
  const gqlSchema = await gqlSchemaPromise
  await exportPostGraphQLSchema(gqlSchema)
  expect(writeFile.mock.calls.length).toBe(0)
})
