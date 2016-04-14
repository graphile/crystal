// TODO: Use the server for this.

import assert from 'assert'
import { once } from 'lodash'
import path from 'path'
import { readFileSync, readdirSync } from 'fs'
import { graphql } from 'graphql'
import { PG_CONFIG, getClient } from '../helpers.js'
import createGraphqlSchema from '../../src/createGraphqlSchema.js'

const TEST_FIXTURES = 'tests/integration/fixtures'

before(() => getClient().then(client =>
  client.queryAsync(readFileSync('examples/forum/schema.sql', 'utf8'))
))

describe('integration', () => {
  const getGraphqlSchema = once(() => createGraphqlSchema(PG_CONFIG, 'forum_example'))

  readdirSync(TEST_FIXTURES).forEach(fileName => {
    if (path.extname(fileName) === '.graphql') {
      const name = path.basename(fileName, '.graphql')

      it(name, async () => {
        const graphqlSchema = await getGraphqlSchema()
        const graphQLPath = path.resolve(TEST_FIXTURES, fileName)
        const jsonPath = path.resolve(TEST_FIXTURES, `${name}.json`)
        const expectedData = JSON.parse(readFileSync(jsonPath, 'utf8'))
        const client = await getClient()

        const data = await graphql(
          graphqlSchema,
          readFileSync(graphQLPath),
          null,
          { client }
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
