jest.mock('fs')

import withPgClient from '../../postgres/__tests__/fixtures/withPgClient'
import createPostGraphQLSchema from '../schema/createPostGraphQLSchema'
import exportPostGraphQLSchema from '../schema/exportPostGraphQLSchema'
import { writeFileSync } from 'fs'

test('exports a schema as JSON', withPgClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, ['a', 'b', 'c'])
  await exportPostGraphQLSchema(gqlSchema, { exportPathJSON: '/schema.json' })
  // expect(writeFileSync.mock.calls.length).toBe(1);
  // expect(writeFileSync.mock.calls[0][0]).toBe('/schema.json')
  // expect(writeFileSync.mock.calls[0][1]).toMatchSnapshot()
}))

test('exports a schema as GQL', withPgClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, ['a', 'b', 'c'])
  await exportPostGraphQLSchema(gqlSchema, { exportPathSchema: '/schema.gql' })
  // expect(writeFileSync.mock.calls.length).toBe(1);
  // expect(writeFileSync.mock.calls[0][0]).toBe('/schema.gql')
  // expect(writeFileSync.mock.calls[0][1]).toMatchSnapshot()
}))

test('does not export a schema when not enabled', withPgClient(async pgClient => {
  const gqlSchema = await createPostGraphQLSchema(pgClient, ['a', 'b', 'c'])
  await exportPostGraphQLSchema(gqlSchema)
  // expect(writeFileSync.mock.calls.length).toBe(0)
}))
