// We need to call promisify the node-postgres
import 'postgraphql/dist/promisify'
import fsp from 'fs-promise'
import path from 'path'
import { graphql } from 'graphql'
import { introspectionQuery, printSchema } from 'graphql/utilities'
import { createGraphqlSchema } from 'postgraphql'

async function updateSchema() {
  console.log('Updating schema.json and schema.graphql …')

  const schema = await createGraphqlSchema('postgres://localhost:5432', 'forum_example')
    .catch(err => console.error('Error creating graphql schema. Details: ', err))

  const result = await graphql(schema, introspectionQuery)
    .catch(err => console.error('Error while introspecting graphql schema. Details: ', err))

  if (result.errors) {
    console.error('Error introspecting schema. Message: ', result.errors)
    return
  }
  
  return Promise.all([
    fsp.writeFile(
      path.join(__dirname, '../schema.json'),
      JSON.stringify(result, null, 2)
    ),
    fsp.writeFile(
      path.join(__dirname, '../schema.graphql'),
      printSchema(schema)
    ),
  ]).catch(err => console.error('Error while writing to the file system. Details: ', err))
}

updateSchema()
  .then(() => console.log('Update successfull!'))
  .catch(err => console.error('Error updating schema: ', err))
