#!/usr/bin/env node

import { resolve as resolvePath } from 'path'
import { readFileSync } from 'fs'
import { createServer } from 'http'
import chalk = require('chalk')
import { Command } from 'commander'
import { parse as parsePGConnectionString } from 'pg-connection-string'
import postgraphql from '../postgraphql'
import start from './start'
import demo from './demo'

const manifest = JSON.parse(readFileSync(resolvePath(__dirname, '../../../package.json')).toString())
const program = new Command('postgraphql')

program
  .version(manifest.version)
  .usage('[options]')
  .description(manifest.description)
  .option('-d, --demo', 'run PostGraphQL using the demo database connection')
  .option('-c, --connection <string>', 'the Postgres connection. if not provided it will be inferred from your environment')
  .option('-s, --schema <string>', 'a Postgres schema to be introspected. Use commas to define multiple schemas', option => option.split(','))
  .option('-t, --host <string>', 'the hostname to be used. Defaults to `localhost`')
  .option('-p, --port <number>', 'the port to be used. Defaults to 5000', parseFloat)
  .option('-l, --disable-query-log', 'disables the GraphQL query log')
  .option('-m, --max-pool-size <number>', 'the maximum number of clients to keep in the Postgres pool. defaults to 10', parseFloat)
  .option('-q, --graphql <path>', 'the route to mount the GraphQL server on. defaults to `/graphql`')
  .option('-i, --graphiql <path>', 'the route to mount the GraphiQL interface on. defaults to `/graphiql`')
  .option('-b, --disable-graphiql', 'disables the GraphiQL interface. overrides the GraphiQL route option')
  .option('-r, --cors', 'enable generous CORS settings. this is disabled by default, if possible use a proxy instead')
  .option('-a, --classic-ids', 'use classic global id field name. required to support Relay 1')
  .option('-j, --dynamic-json', 'enable dynamic JSON in GraphQL inputs and outputs. uses stringified JSON by default')

program.on('--help', () => console.log(`
  Get Started:

    $ postgraphql --demo
    $ postgraphql --schema my_schema
`.slice(1)))

program.parse(process.argv)

// If this module was not required, run our main function.
if (!module.parent)
  main()

export default program

function main () {
  const {
    demo: isDemo = false,
    connection: pgConnectionString,
    schema: schemas = ['public'],
    host: hostname = 'localhost',
    port = 5000,
    disableQueryLog,
    maxPoolSize,
    graphql: graphqlRoute = '/graphql',
    graphiql: graphiqlRoute = '/graphiql',
    disableGraphiql = false,
    cors: enableCors = false,
    classicIds = false,
    dynamicJson = false,
  } = program as any

  const pgConfig = Object.assign(
    {},
    pgConnectionString ? parsePGConnectionString(pgConnectionString) : {
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
      database: process.env.PGDATABASE,
    },
    { max: maxPoolSize },
  )

  const server = createServer(postgraphql(pgConfig, schemas, {
    classicIds,
    dynamicJson,
    graphqlRoute,
    graphiqlRoute,
    graphiql: !disableGraphiql,
    enableQueryLog: !disableQueryLog,
    enableCors,
  }))

  server.listen(port, hostname, () => {
    console.log('')
    console.log(`PostGraphQL server listening on port ${chalk.underline(port.toString())} 🚀`)
    console.log('')
    console.log(`  ‣ Connected to Postgres instance ${chalk.underline.blue(`postgres://${pgConfig.host}:${pgConfig.port}${pgConfig.database ? pgConfig.database : ''}`)}`)
    console.log(`  ‣ Introspected Postgres schema(s) ${schemas.map(schema => chalk.magenta(schema)).join(', ')}`)
    console.log(`  ‣ GraphQL endpoint served at ${chalk.underline(`http://${hostname}:${port}${graphqlRoute}`)}`)

    if (!disableGraphiql)
      console.log(`  ‣ GraphiQL endpoint served at ${chalk.underline(`http://${hostname}:${port}${graphiqlRoute}`)}`)

    console.log('')
    console.log(chalk.gray('* * *'))
    console.log('')
  })
}
