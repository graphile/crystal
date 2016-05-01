import assert from 'assert'
import { once } from 'lodash'
import path from 'path'
import { readFileSync, readdirSync } from 'fs'
import pg from 'pg'
import { graphql } from 'graphql'
import { PG_CONFIG } from '../helpers.js'
import createGraphqlSchema from '#/createGraphqlSchema.js'

const TEST_FIXTURES = 'tests/integration/fixtures'

describe('integration', () => {
  before(async () => {
    const client = await pg.connectAsync(PG_CONFIG)
    await client.queryAsync('drop schema if exists forum_example, forum_example_utils cascade')
    await client.queryAsync(readFileSync('examples/forum/schema.sql', 'utf8'))
    client.end()
  })

  const getGraphqlSchema = once(() => createGraphqlSchema(PG_CONFIG, 'forum_example'))

  readdirSync(TEST_FIXTURES).forEach(fileName => {
    if (path.extname(fileName) === '.graphql') {
      const name = path.basename(fileName, '.graphql')

      it(name, async () => {
        const graphqlSchema = await getGraphqlSchema()
        const graphQLPath = path.resolve(TEST_FIXTURES, fileName)
        const jsonPath = path.resolve(TEST_FIXTURES, `${name}.json`)
        const expectedData = JSON.parse(readFileSync(jsonPath, 'utf8'))
        const client = await pg.connectAsync(PG_CONFIG)

        // Begin a block.
        await client.queryAsync('begin')

        const data = await graphql(
          graphqlSchema,
          readFileSync(graphQLPath),
          null,
          { client }
        )

        // End the block by rolling it back so mutations are not saved.
        await client.queryAsync('rollback')

        // Make sure to release our client!
        client.end()

        /* eslint-disable no-console */
        if (data.errors)
          data.errors.forEach(error => console.error(error.stack))
        /* eslint-enable no-console */

        assert.deepEqual(data, expectedData)
      })
    }
  })
})
