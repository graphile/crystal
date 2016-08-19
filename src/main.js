#!/usr/bin/env node

/* eslint-disable no-console */

import './promisify'

import path from 'path'
import { readFileSync } from 'fs'
import http from 'http'
import { Command } from 'commander'
import { parse as parseConnectionString } from 'pg-connection-string'
import postgraphql from './postgraphql.js'

const manifest = JSON.parse(readFileSync(path.resolve(__dirname, '../package.json')))

const main = () => {
  const program = new Command('postgraphql')

  /* eslint-disable max-len */
  program
  .version(manifest.version)
  .usage('[options] <url>')
  .option('-s, --schema <identifier>', 'the PostgreSQL schema to serve a GraphQL server of. defaults to public')
  .option('-a, --anonymous-role <name>', 'the PostgreSQL role to use for requests that are non-authenticated. no role is set by default')
  .option('-n, --hostname <name>', 'a URL hostname the server will listen to. defaults to localhost')
  .option('-p, --port <integer>', 'a URL port the server will listen to. defaults to 3000', parseInt)
  .option('-d, --development', 'enables a development mode which enables GraphiQL, nicer errors, and JSON pretty printing')
  .option('-r, --route <path>', 'the route to mount the GraphQL server on. defaults to /')
  .option('-e, --secret <string>', 'the secret to be used to encrypt tokens. token authentication disabled if this is not set')
  .option('-m, --max-pool-size <integer>', 'the maximum number of connections to keep in the connection pool. defaults to 10')
  .parse(process.argv)
  /* eslint-enable max-len */

  const {
    args: [connection],
    schema: schemaName,
    anonymousRole,
    hostname = 'localhost',
    port = 3000,
    development = false,
    route = '/',
    secret,
    maxPoolSize = 10,
  } = program

  if (!connection)
    throw new Error('Must define a PostgreSQL connection string to connect to.')

  // Parse out the connection string into an object and attach a
  // `poolSize` option.
  const pgConfig = {
    ...parseConnectionString(connection),
    poolSize: maxPoolSize,
  }

  // Create the GraphQL HTTP server.
  const handler = postgraphql(pgConfig, schemaName, {
    anonymousRole,
    route,
    secret,
    development,
  })

  http.createServer(handler).listen(port, hostname, () => {
    console.log(`GraphQL server listening at http://${hostname}:${port}${route} 🚀`)
  })
}

try {
  main()
}
catch (error) {
  console.error(error.stack)
}
