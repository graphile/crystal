import { resolve as resolvePath } from 'path'
import { readFile, readdirSync } from 'fs'
import { graphql } from 'graphql'
import withPgClient from '../../postgres/__tests__/fixtures/withPgClient'
import { $$pgClient } from '../../postgres/inventory/pgClientFromContext'
import createPostGraphQLSchema from '../schema/createPostGraphQLSchema'

// This test suite can be flaky in CI. Increase it’s timeout.
if (process.env.CI)
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 10

const kitchenSinkData = new Promise((resolve, reject) => {
  readFile('examples/kitchen-sink/data.sql', (error, data) => {
    if (error) reject(error)
    else resolve(data.toString().replace(/begin;|commit;/g, ''))
  })
})

const queriesDir = resolvePath(__dirname, 'fixtures/queries')

for (const file of readdirSync(queriesDir)) {
  test(`operation ${file}`, withPgClient(async pgClient => {
    const gqlSchema = await createPostGraphQLSchema(pgClient, ['a', 'b', 'c'], {
      classicIds: false,
      dynamicJson: file === 'dynamic-json.graphql',
    })

    const query = await new Promise((resolve, reject) => {
      readFile(resolvePath(queriesDir, file), (error, data) => {
        if (error) reject(error)
        else resolve(data.toString())
      })
    })

    await pgClient.query(await kitchenSinkData)

    const result = await graphql(gqlSchema, query, null, { [$$pgClient]: pgClient })

    expect(result).toMatchSnapshot()
  }))
}
