#!/usr/bin/env node

import { resolve } from 'path'
import { readFileSync } from 'fs'
import { Command } from 'commander'
import start from './start'
import demo from './demo'

const manifest = JSON.parse(readFileSync(resolve(__dirname, '../../../package.json')))
const list = (val) => val.split(',')
const program = new Command('postgraphql')

program
  .usage('[cmd]')
  .description('To get help for the individual commands type `postgraphql <cmd> -h`')
  .version(manifest.version)

program
  .command('start')
  .arguments('[url]')
  .option('-a, --anonymous-role <name>', 'The PostgreSQL role to use for requests that are non-authenticated. No role is set by default.')
  .option('-c, --cors', 'Enables CORS headers. This is disabled by default.')
  .option('-d, --development', 'Enables a development mode which enables GraphiQL, nicer errors, and JSON pretty printing.')
  .option('-e, --secret <string>', 'The secret to be used to encrypt tokens. Token authentication disabled if this is not set.')
  .option('-l, --relay-legacy', 'Enable this to work with Relay v1.')
  .option('-m, --max-pool-size <integer>', 'The maximum number of connections to keep in the connection pool. Defaults to 10.')
  .option('-n, --hostname <name>', 'A URL hostname the server will listen to. defaults to localhost.')
  .option('-p, --port <integer>', 'A URL port the server will listen to. defaults to 3000.', parseInt)
  .option('-q, --graphql-route <path>', 'The route to mount the GraphQL server on. Defaults to /graphql.')
  .option('-i, --graphiql-route <path>', 'The route to mount the GraphiQL interface on. Defaults to /graphiql.')
  .option('-s, --schemas <schemas>', 'The PostgreSQL schema to serve a GraphQL server of. Defaults to public.', list)
  .description(`Starts an postgraphql server.`)
  .action(start)

program
  .command('demo')
  .description(`Starts a demo with a remote heroku database.`)
  .on('--help', () => {
    console.log('You can find the db schema for demo here https://github.com/calebmer/postgraphql/blob/next/resources/kitchen-sink-schema.sql')
  })
  .action(demo)

program
  .parse(process.argv)
