import dotenv from 'dotenv'
import path from 'path'
import fetch from 'isomorphic-fetch'
import fsp from 'fs-promise'
import { introspectionQuery, printSchema } from 'graphql/utilities'

// load config from .env file
dotenv.load()
const { APP_PORT } = process.env

// introspect the schema from the graphql endpoint
const fetchSchema = url => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({query: introspectionQuery}),
    headers: { 'Content-Type': 'application/json' },
  })
  .then(res => res.text())
}

fetchSchema(`http://localhost:${APP_PORT}/graphql`).then(json => {
  return fsp.writeFile(
    path.join(__dirname, '../schema.json'),
    json
  )
})
.then(() => console.log('The schema.json file was successfully created'))
.catch(err => console.log(`There was an error fetching the GraphQL schema. ${err}`))
