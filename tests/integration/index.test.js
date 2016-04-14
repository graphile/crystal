// TODO: Use the server for this.

import assert from 'assert'
import { once } from 'lodash'
import path from 'path'
import { readFileSync, readdirSync } from 'fs'
import { graphql } from 'graphql'
import { connectClient, setupDatabase } from '../helpers.js'
import getCatalog from '../../src/postgres/getCatalog.js'
import createSchema from '../../src/graphql/createSchema.js'

const TEST_FIXTURES = 'tests/integration/fixtures'

before(setupDatabase(readFileSync('examples/forum/schema.sql', 'utf8')))

describe('integration', () => {
  const getGraphqlSchema = once(async () => {
    const client = await connectClient()
    const catalog = await getCatalog(client)
    const schema = catalog.getSchema('forum_example')
    return createSchema(schema)
  })

  readdirSync(TEST_FIXTURES).forEach(fileName => {
    if (path.extname(fileName) === '.graphql') {
      const name = path.basename(fileName, '.graphql')

      it(name, async () => {
        const graphqlSchema = await getGraphqlSchema()
        const graphQLPath = path.resolve(TEST_FIXTURES, fileName)
        const jsonPath = path.resolve(TEST_FIXTURES, `${name}.json`)
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
