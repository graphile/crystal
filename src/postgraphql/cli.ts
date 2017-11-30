#!/usr/bin/env node

import { resolve as resolvePath } from 'path'
import { readFileSync } from 'fs'
import { createServer } from 'http'
import chalk = require('chalk')
import program = require('commander')
import { parse as parsePgConnectionString } from 'pg-connection-string'
import postgraphql from './postgraphql'

// tslint:disable no-console

// TODO: Demo Postgres database
const DEMO_PG_URL = null

const manifest = JSON.parse(readFileSync(resolvePath(__dirname, '../../package.json')).toString())

program
  .version(manifest.version)
  .usage('[options...]')
  .description(manifest.description)
  // .option('-d, --demo', 'run PostGraphQL using the demo database connection')
  .option('-c, --connection <string>', 'the Postgres connection. if not provided it will be inferred from your environment, example: postgres://user:password@domain:port/db')
  .option('-s, --schema <string>', 'a Postgres schema to be introspected. Use commas to define multiple schemas', (option: string) => option.split(','))
  .option('-w, --watch', 'watches the Postgres schema for changes and reruns introspection if a change was detected')
  .option('-n, --host <string>', 'the hostname to be used. Defaults to `localhost`')
  .option('-p, --port <number>', 'the port to be used. Defaults to 5000', parseFloat)
  .option('-m, --max-pool-size <number>', 'the maximum number of clients to keep in the Postgres pool. defaults to 10', parseFloat)
  .option('-r, --default-role <string>', 'the default Postgres role to use when a request is made. supercedes the role used to connect to the database')
  .option('-q, --graphql <path>', 'the route to mount the GraphQL server on. defaults to `/graphql`')
  .option('-i, --graphiql <path>', 'the route to mount the GraphiQL interface on. defaults to `/graphiql`')
  .option('-b, --disable-graphiql', 'disables the GraphiQL interface. overrides the GraphiQL route option')
  .option('--token <identifier>', 'DEPRECATED: use --jwt-token-identifier instead')
  .option('-o, --cors', 'enable generous CORS settings. this is disabled by default, if possible use a proxy instead')
  .option('-a, --classic-ids', 'use classic global id field name. required to support Relay 1')
  .option('-j, --dynamic-json', 'enable dynamic JSON in GraphQL inputs and outputs. uses stringified JSON by default')
  .option('-M, --disable-default-mutations', 'disable default mutations, mutation will only be possible through Postgres functions')
  .option('-l, --body-size-limit <string>', 'set the maximum size of JSON bodies that can be parsed (default 100kB) The size can be given as a human-readable string, such as \'200kB\' or \'5MB\' (case insensitive).')
  .option('--secret <string>', 'DEPRECATED: Use jwt-secret instead')
  .option('-e, --jwt-secret <string>', 'the secret to be used when creating and verifying JWTs. if none is provided auth will be disabled')
  .option('-A, --jwt-audiences <string>', 'a comma separated list of audiences your jwt token can contain. If no audience is given the audience defaults to `postgraphql`', (option: string) => option.split(','))
  .option('--jwt-role <string>', 'a comma seperated list of strings that create a path in the jwt from which to extract the postgres role. if none is provided it will use the key `role` on the root of the jwt.', (option: string) => option.split(','))
  .option('-t, --jwt-token-identifier <identifier>', 'the Postgres identifier for a composite type that will be used to create JWT tokens')
  .option('--append-plugins <string>', 'a comma-separated list of plugins to append to the list of GraphQL schema plugins')
  .option('--prepend-plugins <string>', 'a comma-separated list of plugins to prepend to the list of GraphQL schema plugins')
  .option('--export-schema-json [path]', 'enables exporting the detected schema, in JSON format, to the given location. The directories must exist already, if the file exists it will be overwritten.')
  .option('--export-schema-graphql [path]', 'enables exporting the detected schema, in GraphQL schema format, to the given location. The directories must exist already, if the file exists it will be overwritten.')
  .option('--show-error-stack [setting]', 'show JavaScript error stacks in the GraphQL result errors')
  .option('--extended-errors <string>', 'a comma separated list of extended Postgres error fields to display in the GraphQL result. Example: \'hint,detail,errcode\'. Default: none', (option: string) => option.split(',').filter(_ => _))

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
  secret: deprecatedJwtSecret,
  jwtSecret,
  jwtAudiences = ['postgraphql'],
  jwtRole = ['role'],
  token: deprecatedJwtPgTypeIdentifier,
  jwtTokenIdentifier: jwtPgTypeIdentifier,
  cors: enableCors = false,
  classicIds = false,
  dynamicJson = false,
  disableDefaultMutations = false,
  exportSchemaJson: exportJsonSchemaPath,
  exportSchemaGraphql: exportGqlSchemaPath,
  showErrorStack,
  extendedErrors = [],
  bodySizeLimit,
  appendPlugins: appendPluginNames,
  prependPlugins: prependPluginNames,
  // replaceAllPlugins is NOT exposed via the CLI
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

const loadPlugins = (rawNames: mixed) => {
  if (!rawNames) {
    return undefined
  }
  const names = String(rawNames).split(',')
  return names.map(rawName => {
    const name = String(rawName)
    const parts = name.split(':')
    let root
    try {
      root = require(String(parts.shift()))
    } catch (e) {
      // tslint:disable-next-line no-console
      console.error(`Failed to load plugin '${name}'`)
      throw e
    }
    let plugin = root
    while (true) {
      const part = parts.shift()
      if (part == null) {
        break
      }
      plugin = root[part]
      if (plugin == null) {
        throw new Error(`No plugin found matching spec '${name}' - failed at '${part}'`)
      }
    }
    if (typeof plugin === 'function') {
      return plugin
    } else if (plugin === root && typeof plugin.default === 'function') {
      return plugin.default // ES6 workaround
    } else {
      throw new Error(`No plugin found matching spec '${name}' - expected function, found '${typeof plugin}'`)
    }
  })
}

// Create’s our PostGraphQL server and provides all the appropriate
// configuration options.
const server = createServer(postgraphql(pgConfig, schemas, {
  classicIds,
  dynamicJson,
  disableDefaultMutations,
  graphqlRoute,
  graphiqlRoute,
  graphiql: !disableGraphiql,
  jwtPgTypeIdentifier: jwtPgTypeIdentifier || deprecatedJwtPgTypeIdentifier,
  jwtSecret: jwtSecret || deprecatedJwtSecret,
  jwtAudiences,
  jwtRole,
  pgDefaultRole,
  watchPg,
  showErrorStack,
  extendedErrors,
  disableQueryLog: false,
  enableCors,
  exportJsonSchemaPath,
  exportGqlSchemaPath,
  bodySizeLimit,
  appendPlugins: loadPlugins(appendPluginNames),
  prependPlugins: loadPlugins(prependPluginNames),
}))

// Start our server by listening to a specific port and host name. Also log
// some instructions and other interesting information.
server.listen(port, hostname, () => {
  console.log('')
  console.log(`PostGraphQL server listening on port ${chalk.underline(server.address().port.toString())} 🚀`)
  console.log('')
  console.log(`  ‣ Connected to Postgres instance ${chalk.underline.blue(isDemo ? 'postgraphql_demo' : `postgres://${pgConfig.host}:${pgConfig.port || 5432}${pgConfig.database != null ? `/${pgConfig.database}` : ''}`)}`)
  console.log(`  ‣ Introspected Postgres schema(s) ${schemas.map(schema => chalk.magenta(schema)).join(', ')}`)
  console.log(`  ‣ GraphQL endpoint served at ${chalk.underline(`http://${hostname}:${port}${graphqlRoute}`)}`)

  if (!disableGraphiql)
    console.log(`  ‣ GraphiQL endpoint served at ${chalk.underline(`http://${hostname}:${port}${graphiqlRoute}`)}`)

  console.log('')
  console.log(chalk.gray('* * *'))
  console.log('')
})
