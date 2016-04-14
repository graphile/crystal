// TODO: Use the server for this.

import assert from 'assert'
import { once } from 'lodash'
import path from 'path'
import { readFileSync, readdirSync } from 'fs'
import { graphql } from 'graphql'
import { connectClient, setupDatabase } from './helpers'
import { getCatalog } from '../src/postgres/catalog'
import { createGraphqlSchema } from '../src/graphql/index'

before(setupDatabase(readFileSync('tests/integration/schema.sql', 'utf8')))

describe('integration tests', () => {
  const getGraphqlSchema = once(async () => {
    const client = await connectClient()
    const catalog = await getCatalog(client)
    const schema = catalog.getSchema('postgraphql_integration_tests')
    return createGraphqlSchema(schema)
  })

  readdirSync('tests/integration').forEach(name => {
    if (path.extname(name) === '.graphql') {
      it(name, async () => {
        const graphqlSchema = await getGraphqlSchema()
        const graphQLPath = path.resolve('tests/integration', name)
        const jsonPath = path.resolve('tests/integration', `${path.basename(name, '.graphql')}.json`)
        const expectedData = JSON.parse(readFileSync(jsonPath, 'utf8'))

        const data = await graphql(
          graphqlSchema,
          readFileSync(graphQLPath),
          null,
          { client: await connectClient() }
        )

        /* eslint-disable no-console */
        if (data.errors)
          data.errors.forEach(error => console.error(error.stack))
        /* eslint-enable no-console */

        assert.deepEqual(data, expectedData)
      })
    }
  })
})
