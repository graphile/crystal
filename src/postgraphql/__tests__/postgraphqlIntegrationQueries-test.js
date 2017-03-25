import { resolve as resolvePath } from 'path'
import { readFile, readdirSync } from 'fs'
import { graphql } from 'graphql'
import withPgClient from '../../postgres/__tests__/fixtures/withPgClient'
import { $$pgClient } from '../../postgres/inventory/pgClientFromContext'
import createPostGraphQLSchema from '../schema/createPostGraphQLSchema'

// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20

const kitchenSinkData = new Promise((resolve, reject) => {
  readFile('examples/kitchen-sink/data.sql', (error, data) => {
    if (error) reject(error)
    else resolve(data.toString().replace(/begin;|commit;/g, ''))
  })
})

const queriesDir = resolvePath(__dirname, 'fixtures/queries')
const queryFileNames = readdirSync(queriesDir)
let queryResults = []

beforeAll(() => {
  // Get a GraphQL schema instance that we can query.
  const gqlSchemaPromise = withPgClient(async pgClient => {
    return await createPostGraphQLSchema(pgClient, ['a', 'b', 'c'])
  })()

  // Execute all of the queries in parallel. We will not wait for them to
  // resolve or reject. The tests will do that.
  //
  // All of our queries share a single client instance.
  const queryResultsPromise = (async () => {
    // Wait for the schema to resolve. We need the schema to be introspected
    // before we can do anything else!
    const gqlSchema = await gqlSchemaPromise
    // Get a new Postgres client instance.
    return await withPgClient(async pgClient => {
      // Add data to the client instance we are using.
      await pgClient.query(await kitchenSinkData)
      // Run all of our queries in parallel.
      return await Promise.all(queryFileNames.map(async fileName => {
        // Read the query from the file system.
        const query = await new Promise((resolve, reject) => {
          readFile(resolvePath(queriesDir, fileName), 'utf8', (error, data) => {
            if (error) reject(error)
            else resolve(data)
          })
        })
        // Return the result of our GraphQL query.
        return await graphql(gqlSchema, query, null, { [$$pgClient]: pgClient })
      }))
    })()
  })()

  // Flatten out the query results promise.
  queryResults = queryFileNames.map(async (_, i) => {
    return await (await queryResultsPromise)[i]
  })
})

for (let i = 0; i < queryFileNames.length; i++) {
  test(queryFileNames[i], async () => {
    expect(await queryResults[i]).toMatchSnapshot()
  })
}
