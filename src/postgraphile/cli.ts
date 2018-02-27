#!/usr/bin/env node

import { resolve as resolvePath } from 'path'
import { readFileSync } from 'fs'
import { createServer } from 'http'
import chalk = require('chalk')
import program = require('commander')
import jwt = require('jsonwebtoken')
import { parse as parsePgConnectionString } from 'pg-connection-string'
import postgraphile, { getPostgraphileSchemaBuilder } from './postgraphile'
import { Pool } from 'pg'
import cluster = require('cluster')

// tslint:disable no-console

let config = {}
try {
  config = require(process.cwd() + '/.postgraphilerc') // tslint:disable-line no-var-requires
  if (!config.hasOwnProperty('options')) {
    console.warn('WARNING: Your configuration file does not export any options')
  }
} catch (error) {
  // Use command line options
}
// TODO: Demo Postgres database
const DEMO_PG_URL = null

const manifest = JSON.parse(readFileSync(resolvePath(__dirname, '../../package.json')).toString())

program
  .version(manifest.version)
  .usage('[options...]')
  .description(manifest.description)
  // .option('-d, --demo', 'run PostGraphile using the demo database connection')
  // Standard options
  .option('-c, --connection <string>', 'the Postgres connection. if not provided it will be inferred from your environment, example: postgres://user:password@domain:port/db')
  .option('-s, --schema <string>', 'a Postgres schema to be introspected. Use commas to define multiple schemas', (option: string) => option.split(','))
  .option('-w, --watch', 'watches the Postgres schema for changes and reruns introspection if a change was detected')
  .option('-n, --host <string>', 'the hostname to be used. Defaults to `localhost`')
  .option('-p, --port <number>', 'the port to be used. Defaults to 5000', parseFloat)
  .option('-m, --max-pool-size <number>', 'the maximum number of clients to keep in the Postgres pool. defaults to 10', parseFloat)
  .option('-r, --default-role <string>', 'the default Postgres role to use when a request is made. supercedes the role used to connect to the database')
  // Schema configuration
  .option('-a, --classic-ids', 'use classic global id field name. required to support Relay 1')
  .option('-j, --dynamic-json', 'enable dynamic JSON in GraphQL inputs and outputs. uses stringified JSON by default')
  .option('-M, --disable-default-mutations', 'disable default mutations, mutation will only be possible through Postgres functions')
  // Error enhancements
  .option('--show-error-stack', 'show JavaScript error stacks in the GraphQL result errors')
  .option('--extended-errors <string>', 'a comma separated list of extended Postgres error fields to display in the GraphQL result. Example: \'hint,detail,errcode\'. Default: none', (option: string) => option.split(',').filter(_ => _))
  // Plugin-related options
  .option('--append-plugins <string>', 'a comma-separated list of plugins to append to the list of GraphQL schema plugins')
  .option('--prepend-plugins <string>', 'a comma-separated list of plugins to prepend to the list of GraphQL schema plugins')
  // Things that relate to -X
  .option('--read-cache <path>', '[experimental] reads cached values from local cache file to improve startup time (you may want to do this in production)')
  .option('--write-cache <path>', '[experimental] writes computed values to local cache file so startup can be faster (do this during the build phase)')
  .option('--export-schema-json <path>', 'enables exporting the detected schema, in JSON format, to the given location. The directories must exist already, if the file exists it will be overwritten.')
  .option('--export-schema-graphql <path>', 'enables exporting the detected schema, in GraphQL schema format, to the given location. The directories must exist already, if the file exists it will be overwritten.')
  .option('-X, --no-server', '[experimental] for when you just want to use --write-cache or --export-schema-* and not actually run a server (e.g. CI)')
  // Webserver configuration
  .option('-q, --graphql <path>', 'the route to mount the GraphQL server on. defaults to `/graphql`')
  .option('-i, --graphiql <path>', 'the route to mount the GraphiQL interface on. defaults to `/graphiql`')
  .option('-b, --disable-graphiql', 'disables the GraphiQL interface. overrides the GraphiQL route option')
  .option('-o, --cors', 'enable generous CORS settings. this is disabled by default, if possible use a proxy instead')
  .option('-l, --body-size-limit <string>', 'set the maximum size of JSON bodies that can be parsed (default 100kB) The size can be given as a human-readable string, such as \'200kB\' or \'5MB\' (case insensitive).')
  .option('--cluster-workers <count>', '[experimental] spawn <count> workers to increase throughput', parseFloat)
  // JSON-related options
  .option('-e, --jwt-secret <string>', 'the secret to be used when creating and verifying JWTs. if none is provided auth will be disabled')
  .option('--jwt-verify-algorithms <string>', 'a comma separated list of the names of the allowed jwt token algorithms', (option: string) => option.split(','))
  .option('-A, --jwt-verify-audience <string>', 'a comma separated list of audiences your jwt token can contain. If no audience is given the audience defaults to `postgraphile`', (option: string) => option.split(','))
  .option('--jwt-verify-clock-tolerance <number>', 'number of seconds to tolerate when checking the nbf and exp claims, to deal with small clock differences among different servers', parseFloat)
  .option('--jwt-verify-id <string>', 'the name of the allowed jwt token id')
  .option('--jwt-verify-ignore-expiration', 'if `true` do not validate the expiration of the token defaults to `false`')
  .option('--jwt-verify-ignore-not-before', 'if `true` do not validate the notBefore of the token defaults to `false`')
  .option('--jwt-verify-issuer <string>', 'a comma separated list of the names of the allowed jwt token issuer', (option: string) => option.split(','))
  .option('--jwt-verify-subject <string>', 'the name of the allowed jwt token subject')
  .option('--jwt-role <string>', 'a comma seperated list of strings that create a path in the jwt from which to extract the postgres role. if none is provided it will use the key `role` on the root of the jwt.', (option: string) => option.split(','))
  .option('-t, --jwt-token-identifier <identifier>', 'the Postgres identifier for a composite type that will be used to create JWT tokens')
  // Deprecated
  .option('--token <identifier>', 'DEPRECATED: use --jwt-token-identifier instead')
  .option('--secret <string>', 'DEPRECATED: Use jwt-secret instead')
  .option('--jwt-audiences <string>', 'DEPRECATED Use jwt-verify-audience instead', (option: string) => option.split(','))
  // Awkward application workarounds / legacy support
  .option('--badly-behaved-functions', 'if you have any functions that return setof a compound type (such as a table) and you want to return null for some of the results in the set you must enable this')
  .option('--legacy-relations <omit|deprecated|only>', 'some one-to-one relations were previously detected as one-to-many - should we export \'only\' the old relation shapes, both new and old but mark the old ones as \'deprecated\', or \'omit\' the old relation shapes entirely')
  .option('--legacy-json-uuid', `ONLY use this option if you require the v3 typenames 'Json' and 'Uuid' over 'JSON' and 'UUID'`)

program.on('--help', () => console.log(`
  Get started:

    $ postgraphile
    $ postgraphile -c postgres://localhost/my_db
    $ postgraphile --connection postgres://user:pass@localhost/my_db --schema my_schema --watch --dynamic-json
`.slice(1)))

program.parse(process.argv)

// Kill server on exit.
process.on('SIGINT', process.exit)

// Destruct our configuration file and command line arguments, use defaults, and rename options to
// something appropriate for JavaScript.
const {
  demo: isDemo = false,
  connection: pgConnectionString,
  watch: watchPg,
  schema: dbSchema,
  host: hostname = 'localhost',
  port = 5000,
  maxPoolSize,
  defaultRole: pgDefaultRole,
  graphql: graphqlRoute = '/graphql',
  graphiql: graphiqlRoute = '/graphiql',
  disableGraphiql = false,
  secret: deprecatedJwtSecret,
  jwtSecret,
  jwtAudiences,
  jwtVerifyAlgorithms,
  jwtVerifyAudience,
  jwtVerifyClockTolerance,
  jwtVerifyId,
  jwtVerifyIgnoreExpiration,
  jwtVerifyIgnoreNotBefore,
  jwtVerifyIssuer,
  jwtVerifySubject,
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
  readCache,
  writeCache,
  legacyRelations: rawLegacyRelations = 'deprecated',
  server: yesServer,
  clusterWorkers,
  badlyBehavedFunctions,
  legacyJsonUuid,
// tslint:disable-next-line no-any
} = Object.assign({}, config['options'], program) as any

let legacyRelations: 'omit' | 'deprecated' | 'only'
if (['omit', 'only', 'deprecated'].indexOf(rawLegacyRelations) < 0) {
  throw new Error(`Invalid argument to '--legacy-relations' - expected on of 'omit', 'deprecated', 'only'; but received '${rawLegacyRelations}'`)
} else {
  legacyRelations = rawLegacyRelations
}

const noServer = !yesServer

// Add custom logic for getting the schemas from our CLI. If we are in demo
// mode, we want to use the `forum_example` schema. Otherwise the `public`
// schema is what we want.
const schemas: Array<string> = dbSchema || (isDemo ? ['forum_example'] : ['public'])

// Create our Postgres config.
const pgConfig = Object.assign(
  {},
  // If we have a Postgres connection string, parse it and use that as our
  // config. If we don’t have a connection string use some environment
  // variables or final defaults. Other environment variables should be
  // detected and used by `pg`.
  pgConnectionString || process.env.DATABASE_URL || isDemo ?
    parsePgConnectionString(pgConnectionString || process.env.DATABASE_URL || DEMO_PG_URL) : {
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
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

if (jwtAudiences && jwtVerifyAudience) {
  throw new Error(`Provide either '--jwt-audiences' or '-A, --jwt-verify-audience' but not both`)
}

const jwtVerifyOptions: jwt.VerifyOptions = {
  algorithms: jwtVerifyAlgorithms,
  audience: jwtVerifyAudience,
  clockTolerance: jwtVerifyClockTolerance,
  jwtId: jwtVerifyId,
  ignoreExpiration: jwtVerifyIgnoreExpiration,
  ignoreNotBefore: jwtVerifyIgnoreNotBefore,
  issuer: jwtVerifyIssuer,
  subject: jwtVerifySubject,
}

// The options to pass through to the schema builder, or the middleware
const postgraphileOptions = {
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
  jwtVerifyOptions,
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
  readCache,
  writeCache,
  legacyRelations,
  badlyBehavedFunctions,
  legacyJsonUuid,
}

if (noServer) {
  // No need for a server, let's just spin up the schema builder
  (async () => {
    const pgPool = new Pool(pgConfig)
    const { getGraphQLSchema } = getPostgraphileSchemaBuilder(pgPool, schemas, postgraphileOptions)
    await getGraphQLSchema()
    if (!watchPg) {
      await pgPool.end()
    }
  })().then(
    null,
    e => {
      console.error('Error occurred!')
      console.error(e)
      process.exit(1)
    },
  )
} else {
  function killAllWorkers(signal = 'SIGTERM'): void {
    for (const id in cluster.workers) {
      if (cluster.workers.hasOwnProperty(id)) {
        cluster.workers[id].kill(signal)
      }
    }
  }

  if (clusterWorkers >= 2 && cluster.isMaster) {
    let shuttingDown = false
    const shutdown = () => {
      if (!shuttingDown) {
        shuttingDown = true
        process.exitCode = 1
        const fallbackTimeout = setTimeout(() => {
          const remainingCount = Object.keys(cluster.workers).length
          if (remainingCount > 0) {
            console.log(`  [cluster] ${remainingCount} workers did not die fast enough, sending SIGKILL`)
            killAllWorkers('SIGKILL')
            const ultraFallbackTimeout = setTimeout(() => {
              console.log(`  [cluster] really should have exited automatically, but haven't - exiting`)
              process.exit(3)
            }, 5000)
            ultraFallbackTimeout.unref()
          } else {
            console.log(`  [cluster] should have exited automatically, but haven't - exiting`)
            process.exit(2)
          }
        }, 5000)
        fallbackTimeout.unref()
        console.log(`  [cluster] killing other workers with SIGTERM`)
        killAllWorkers('SIGTERM')
      }
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`  [cluster] worker pid=${worker.process.pid} exited (code=${code}, signal=${signal})`)
      shutdown()
    })

    for (let i = 0; i < clusterWorkers; i++) {
      const worker = cluster.fork({
        POSTGRAPHILE_WORKER_NUMBER: String(i + 1),
      })
      console.log(`  [cluster] started worker ${i + 1} (pid=${worker.process.pid})`)
    }
  } else {
    // Create’s our PostGraphile server
    const server = createServer(postgraphile(pgConfig, schemas, postgraphileOptions))

    // Start our server by listening to a specific port and host name. Also log
    // some instructions and other interesting information.
    server.listen(port, hostname, () => {
      const self = cluster.isMaster ? 'server' : `worker ${process.env.POSTGRAPHILE_WORKER_NUMBER} (pid=${process.pid})`
      if (cluster.isMaster || process.env.POSTGRAPHILE_WORKER_NUMBER === '1') {
        console.log('')
        console.log(`PostGraphile ${self} listening on port ${chalk.underline(server.address().port.toString())} 🚀`)
        console.log('')
        console.log(`  ‣ Connected to Postgres instance ${chalk.underline.blue(isDemo ? 'postgraphile_demo' : `postgres://${pgConfig.host}:${pgConfig.port || 5432}${pgConfig.database != null ? `/${pgConfig.database}` : ''}`)}`)
        console.log(`  ‣ Introspected Postgres schema(s) ${schemas.map(schema => chalk.magenta(schema)).join(', ')}`)
        console.log(`  ‣ GraphQL endpoint served at ${chalk.underline(`http://${hostname}:${port}${graphqlRoute}`)}`)

        if (!disableGraphiql)
          console.log(`  ‣ GraphiQL endpoint served at ${chalk.underline(`http://${hostname}:${port}${graphiqlRoute}`)}`)

        console.log('')
        console.log(chalk.gray('* * *'))
      } else {
        console.log(`PostGraphile ${self} listening on port ${chalk.underline(server.address().port.toString())} 🚀`)
      }
      console.log('')
    })
  }
}
