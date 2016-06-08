const dotenv = require('dotenv')
const fetch = require('isomorphic-fetch')
const getbabelRelayPlugin = require('babel-relay-plugin')
const { introspectionQuery } = require('graphql/utilities')

// load config from .env file
dotenv.load()
const { GRAPHQL_URL } = process.env

// introspect the schema from the graphql endpoint
const fetchSchema = url => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({query: introspectionQuery}),
    headers: { 'Content-Type': 'application/json' },
  })
  .then(res => res.json())
}

fetchSchema(GRAPHQL_URL).then(json => {
  module.exports = getbabelRelayPlugin(json.data)
})
.catch(err => console.log(err))
