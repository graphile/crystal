import { resolve as resolvePath } from 'path'
import { readFile, readdirSync } from 'fs'
import { graphql } from 'graphql'
import withPGClient from '../../postgres/__tests__/fixtures/withPGClient'
import { $$pgClient } from '../../postgres/inventory/pgClientFromContext'
import createPostGraphQLSchema from '../createPostGraphQLSchema'

const kitchenSinkData = new Promise((resolve, reject) => {
  readFile(resolvePath(__dirname, '../../../resources/kitchen-sink-data.sql'), (error, data) => {
    if (error) reject(error)
    else resolve(data.toString())
  })
})

const queriesDir = resolvePath(__dirname, 'fixtures/queries')

for (const file of readdirSync(queriesDir)) {
  test(`operation ${file}`, withPGClient(async pgClient => {
    const gqlSchema = await createPostGraphQLSchema({
      pgClient,
      pgSchemas: ['a', 'b', 'c'],
      relay1Ids: false,
    })

    const query = await new Promise((resolve, reject) => {
      readFile(resolvePath(queriesDir, file), (error, data) => {
        if (error) reject(error)
        else resolve(data.toString())
      })
    })

    await pgClient.query(await kitchenSinkData)

    const result = await graphql(gqlSchema, query, null, { [$$pgClient]: pgClient })

    // Log the errors in our result.
    if (result.errors)
      for (const e of result.errors)
        console.error(e.stack || e)

    expect(result).toMatchSnapshot()
  }))
}
