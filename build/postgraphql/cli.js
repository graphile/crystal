#!/usr/bin/env node
"use strict";
const path_1 = require('path');
const fs_1 = require('fs');
const http_1 = require('http');
const chalk = require('chalk');
const commander_1 = require('commander');
const pg_connection_string_1 = require('pg-connection-string');
const postgraphql_1 = require('./postgraphql');
// TODO: Demo Postgres database
const DEMO_PG_URL = null;
const manifest = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, '../../package.json')).toString());
const program = new commander_1.Command('postgraphql');
program
    .version(manifest.version)
    .usage('[options...]')
    .description(manifest.description)
    .option('-c, --connection <string>', 'the Postgres connection. if not provided it will be inferred from your environment')
    .option('-s, --schema <string>', 'a Postgres schema to be introspected. Use commas to define multiple schemas', (option) => option.split(','))
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
    .option('--show-error-stack [setting]', 'show JavaScript error stacks in the GraphQL result errors');
program.on('--help', () => console.log(`
  Get Started:

    $ postgraphql --demo
    $ postgraphql --schema my_schema
`.slice(1)));
program.parse(process.argv);
// Kill server on exit.
process.on('SIGINT', process.exit);
// Destruct our command line arguments, use defaults, and rename options to
// something appropriate for JavaScript.
const { demo: isDemo = false, connection: pgConnectionString, watch: watchPg, host: hostname = 'localhost', port = 5000, maxPoolSize, defaultRole: pgDefaultRole, graphql: graphqlRoute = '/graphql', graphiql: graphiqlRoute = '/graphiql', disableGraphiql = false, secret: jwtSecret, token: jwtPgTypeIdentifier, cors: enableCors = false, classicIds = false, dynamicJson = false, disableDefaultMutations = false, showErrorStack, } = program;
// Add custom logic for getting the schemas from our CLI. If we are in demo
// mode, we want to use the `forum_example` schema. Otherwise the `public`
// schema is what we want.
const schemas = program['schema'] || (isDemo ? ['forum_example'] : ['public']);
// Create our Postgres config.
const pgConfig = Object.assign({}, 
// If we have a Postgres connection string, parse it and use that as our
// config. If we don’t have a connection string use some environment
// variables or final defaults. Other environment variables should be
// detected and used by `pg`.
pgConnectionString || isDemo ? pg_connection_string_1.parse(pgConnectionString || DEMO_PG_URL) : {
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE,
}, 
// Add the max pool size to our config.
{ max: maxPoolSize });
// Create’s our PostGraphQL server and provides all the appropriate
// configuration options.
const server = http_1.createServer(postgraphql_1.default(pgConfig, schemas, {
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
}));
// Start our server by listening to a specific port and host name. Also log
// some instructions and other interesting information.
server.listen(port, hostname, () => {
    console.log('');
    console.log(`PostGraphQL server listening on port ${chalk.underline(port.toString())} 🚀`);
    console.log('');
    console.log(`  ‣ Connected to Postgres instance ${chalk.underline.blue(isDemo ? 'postgraphql_demo' : `postgres://${pgConfig.host}:${pgConfig.port}${pgConfig.database != null ? `/${pgConfig.database}` : ''}`)}`);
    console.log(`  ‣ Introspected Postgres schema(s) ${schemas.map(schema => chalk.magenta(schema)).join(', ')}`);
    console.log(`  ‣ GraphQL endpoint served at ${chalk.underline(`http://${hostname}:${port}${graphqlRoute}`)}`);
    if (!disableGraphiql)
        console.log(`  ‣ GraphiQL endpoint served at ${chalk.underline(`http://${hostname}:${port}${graphiqlRoute}`)}`);
    console.log('');
    console.log(chalk.gray('* * *'));
    console.log('');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Bvc3RncmFwaHFsL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLHVCQUF1QyxNQUN2QyxDQUFDLENBRDRDO0FBQzdDLHFCQUE2QixJQUM3QixDQUFDLENBRGdDO0FBQ2pDLHVCQUE2QixNQUM3QixDQUFDLENBRGtDO0FBQ25DLE1BQU8sS0FBSyxXQUFXLE9BQU8sQ0FBQyxDQUFBO0FBQy9CLDRCQUF3QixXQUN4QixDQUFDLENBRGtDO0FBQ25DLHVDQUFpRCxzQkFDakQsQ0FBQyxDQURzRTtBQUN2RSw4QkFBd0IsZUFHeEIsQ0FBQyxDQUhzQztBQUV2QywrQkFBK0I7QUFDL0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFBO0FBRXhCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQVksQ0FBQyxjQUFXLENBQUMsU0FBUyxFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0FBQ2xHLE1BQU0sT0FBTyxHQUFHLElBQUksbUJBQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUUxQyxPQUFPO0tBQ0osT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7S0FDekIsS0FBSyxDQUFDLGNBQWMsQ0FBQztLQUNyQixXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztLQUVqQyxNQUFNLENBQUMsMkJBQTJCLEVBQUUsb0ZBQW9GLENBQUM7S0FDekgsTUFBTSxDQUFDLHVCQUF1QixFQUFFLDZFQUE2RSxFQUFFLENBQUMsTUFBYyxLQUFLLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDckosTUFBTSxDQUFDLGFBQWEsRUFBRSwyRkFBMkYsQ0FBQztLQUNsSCxNQUFNLENBQUMscUJBQXFCLEVBQUUsa0RBQWtELENBQUM7S0FDakYsTUFBTSxDQUFDLHFCQUFxQixFQUFFLHVDQUF1QyxFQUFFLFVBQVUs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