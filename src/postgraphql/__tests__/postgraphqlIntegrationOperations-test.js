import { resolve as resolvePath } from 'path'
import { readFile, readdirSync } from 'fs'
import { graphql } from 'graphql'
import withPgClient from '../../postgres/__tests__/fixtures/withPgClient'
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

for (const file of readdirSync(queriesDir)) {
  test(`operation ${file}`, withPgClient(async pgClient => {
    const gqlSchema = await createPostGraphQLSchema(pgClient, ['a', 'b', 'c'], {
      classicIds: file === 'classic-ids.graphql',
      dynamicJson: file === 'dynamic-json.graphql',
    })

    const query = await new Promise((resolve, reject) => {
      readFile(resolvePath(queriesDir, file), (error, data) => {
        if (error) reject(error)
        else resolve(data.toString())
      })
    })

    await pgClient.query(await kitchenSinkData)

    const result = await graphql(gqlSchema, query, null, { pgClient })

    expect(result).toMatchSnapshot()
  }))
}
