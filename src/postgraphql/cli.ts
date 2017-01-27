#!/usr/bin/env node

/* tslint:disable no-console */

import { resolve as resolvePath } from 'path'
import { readFileSync } from 'fs'
import { createServer } from 'http'
import chalk = require('chalk')
import { Command } from 'commander'
import { parse as parsePgConnectionString } from 'pg-connection-string'
import postgraphql from './postgraphql'

// TODO: Demo Postgres database
const DEMO_PG_URL = null

const manifest = JSON.parse(readFileSync(resolvePath(__dirname, '../../package.json')).toString())
const program = new Command('postgraphql')

program
  .version(manifest.version)
  .usage('[options...]')
  .description(manifest.description)
  // .option('-d, --demo', 'run PostGraphQL using the demo database connection')
  .option('-c, --connection <string>', 'the Postgres connection. if not provided it will be inferred from your environment')
  .option('-s, --schema <string>', 'a Postgres schema to be introspected. Use commas to define multiple schemas', (option: string) => option.split(','))
  .option('-w, --watch', 'watches the Postgres schema for changes and reruns introspection if a change was detected')
  .option('-n, --host <string>', 'the hostname to be used. Defaults to `localhost`')
  .option('-p, --port <number>', 'the port to be used. Defaults to 5000', parseFloat)
  .option('-m, --max-pool-size <number>', 'the maximum number of clients to keep in the Postgres pool. defaults to 10', parseFloat)
  .option('-r, --default-role <string>', 'the default Postgres role to use when a request is made. supercedes the role used to connect to the database')
  .option('-q, --graphql <path>', 'the route to mount the GraphQL server on. defaults to `/graphql`')
  .option('-i, --graphiql <path>', 'the route to mount the GraphiQL interface on. defaults to `/graphiql`')
  .option('-b, --disable-graphiql', 'disables the GraphiQL interface. overrides the GraphiQL route option')
  .option('-e, --secret <string>', 'the secret to be used when creating and verifying JWTs. if none is provided auth will be disabled')
  .option('-t, --token <identifier>', 'the Postgres identifier for a composite type that will be used to create tokens')
  .option('-o, --cors', 'enable generous CORS settings. this is disabled by default, if possible use a proxy instead')
  .option('-a, --classic-ids', 'use classic global id field name. required to support Relay 1')
  .option('-j, --dynamic-json', 'enable dynamic JSON in GraphQL inputs and outputs. uses stringified JSON by default')
  .option('-M, --disable-default-mutations', 'disable default mutations, mutation will only be possible through Postgres functions')
  .option('-f, --matcher <string>', 'name of custom Postgres function for row matching in connections. Disabled by default')
  .option('--show-error-stack [setting]', 'show JavaScript error stacks in the GraphQL result errors')

program.on('--help', () => console.log(`
  Get Started:

    $ postgraphql --demo
    $ postgraphql --schema my_schema
`.slice(1)))

program.parse(process.argv)

// Kill server on exit.
process.on('SIGINT', process.exit)

// Destruct our command line arguments, use defaults, and rename options to
// something appropriate for JavaScript.
const {
  demo: isDemo = false,
  connection: pgConnectionString,
  watch: watchPg,
  host: hostname = 'localhost',
  port = 5000,
  maxPoolSize,
  defaultRole: pgDefaultRole,
  graphql: graphqlRoute = '/graphql',
  graphiql: graphiqlRoute = '/graphiql',
  disableGraphiql = false,
  secret: jwtSecret,
  token: jwtPgTypeIdentifier,
  cors: enableCors = false,
  classicIds = false,
  dynamicJson = false,
  disableDefaultMutations = false,
  matcher: pgRowMatcher,
  showErrorStack,
// tslint:disable-next-line no-any
} = program as any

// Add custom logic for getting the schemas from our CLI. If we are in demo
// mode, we want to use the `forum_example` schema. Otherwise the `public`
// schema is what we want.
const schemas: Array<string> = program['schema'] || (isDemo ? ['forum_example'] : ['public'])

// Create our Postgres config.
const pgConfig = Object.assign(
  {},
  // If we have a Postgres connection string, parse it and use that as our
  // config. If we don’t have a connection string use some environment
  // variables or final defaults. Other environment variables should be
  // detected and used by `pg`.
  pgConnectionString || isDemo ? parsePgConnectionString(pgConnectionString || DEMO_PG_URL) : {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE,
  },
  // Add the max pool size to our config.
  { max: maxPoolSize },
)

// Create’s our PostGraphQL server and provides all the appropriate
// configuration options.
const server = createServer(postgraphql(pgConfig, schemas, {
  classicIds,
  dynamicJson,
  disableDefaultMutations,
  graphqlRoute,
  graphiqlRoute,
  graphiql: !disableGraphiql,
  jwtSecret,
  jwtPgTypeIdentifier,
  pgDefaultRole,
  watchPg,
  showErrorStack,
  disableQueryLog: false,
  enableCors,
  pgRowMatcher,
}))

// Start our server by listening to a specific port and host name. Also log
// some instructions and other interesting information.
server.listen(port, hostname, () => {
  console.log('')
  console.log(`PostGraphQL server listening on port ${chalk.underline(port.toString())} 🚀`)
  console.log('')
  console.log(`  ‣ Connected to Postgres instance ${chalk.underline.blue(isDemo ? 'postgraphql_demo' : `postgres://${pgConfig.host}:${pgConfig.port}${pgConfig.database != null ? `/${pgConfig.database}` : ''}`)}`)
  console.log(`  ‣ Introspected Postgres schema(s) ${schemas.map(schema => chalk.magenta(schema)).join(', ')}`)
  console.log(`  ‣ GraphQL endpoint served at ${chalk.underline(`http://${hostname}:${port}${graphqlRoute}`)}`)

  if (!disableGraphiql)
    console.log(`  ‣ GraphiQL endpoint served at ${chalk.underline(`http://${hostname}:${port}${graphiqlRoute}`)}`)

  console.log('')
  console.log(chalk.gray('* * *'))
  console.log('')
})
