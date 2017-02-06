#!/usr/bin/env node
"use strict";
var path_1 = require("path");
var fs_1 = require("fs");
var http_1 = require("http");
var chalk = require("chalk");
var commander_1 = require("commander");
var pg_connection_string_1 = require("pg-connection-string");
var postgraphql_1 = require("./postgraphql");
// tslint:disable no-console
// TODO: Demo Postgres database
var DEMO_PG_URL = null;
var manifest = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, '../../package.json')).toString());
var program = new commander_1.Command('postgraphql');
program
    .version(manifest.version)
    .usage('[options...]')
    .description(manifest.description)
    .option('-c, --connection <string>', 'the Postgres connection. if not provided it will be inferred from your environment, example: postgres://user:password@domain:port/db')
    .option('-s, --schema <string>', 'a Postgres schema to be introspected. Use commas to define multiple schemas', function (option) { return option.split(','); })
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
program.on('--help', function () { return console.log("\n  Get Started:\n\n    $ postgraphql --demo\n    $ postgraphql --schema my_schema\n".slice(1)); });
program.parse(process.argv);
// Kill server on exit.
process.on('SIGINT', process.exit);
// Destruct our command line arguments, use defaults, and rename options to
// something appropriate for JavaScript.
var _a = program, _b = _a.demo, isDemo = _b === void 0 ? false : _b, pgConnectionString = _a.connection, watchPg = _a.watch, _c = _a.host, hostname = _c === void 0 ? 'localhost' : _c, _d = _a.port, port = _d === void 0 ? 5000 : _d, maxPoolSize = _a.maxPoolSize, pgDefaultRole = _a.defaultRole, _e = _a.graphql, graphqlRoute = _e === void 0 ? '/graphql' : _e, _f = _a.graphiql, graphiqlRoute = _f === void 0 ? '/graphiql' : _f, _g = _a.disableGraphiql, disableGraphiql = _g === void 0 ? false : _g, jwtSecret = _a.secret, jwtPgTypeIdentifier = _a.token, _h = _a.cors, enableCors = _h === void 0 ? false : _h, _j = _a.classicIds, classicIds = _j === void 0 ? false : _j, _k = _a.dynamicJson, dynamicJson = _k === void 0 ? false : _k, _l = _a.disableDefaultMutations, disableDefaultMutations = _l === void 0 ? false : _l, showErrorStack = _a.showErrorStack;
// Add custom logic for getting the schemas from our CLI. If we are in demo
// mode, we want to use the `forum_example` schema. Otherwise the `public`
// schema is what we want.
var schemas = program['schema'] || (isDemo ? ['forum_example'] : ['public']);
// Create our Postgres config.
var pgConfig = Object.assign({}, 
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
var server = http_1.createServer(postgraphql_1.default(pgConfig, schemas, {
    classicIds: classicIds,
    dynamicJson: dynamicJson,
    disableDefaultMutations: disableDefaultMutations,
    graphqlRoute: graphqlRoute,
    graphiqlRoute: graphiqlRoute,
    graphiql: !disableGraphiql,
    jwtSecret: jwtSecret,
    jwtPgTypeIdentifier: jwtPgTypeIdentifier,
    pgDefaultRole: pgDefaultRole,
    watchPg: watchPg,
    showErrorStack: showErrorStack,
    disableQueryLog: false,
    enableCors: enableCors,
}));
// Start our server by listening to a specific port and host name. Also log
// some instructions and other interesting information.
server.listen(port, hostname, function () {
    console.log('');
    console.log("PostGraphQL server listening on port " + chalk.underline(port.toString()) + " \uD83D\uDE80");
    console.log('');
    console.log("  \u2023 Connected to Postgres instance " + chalk.underline.blue(isDemo ? 'postgraphql_demo' : "postgres://" + pgConfig.host + ":" + (pgConfig.port || 5432) + (pgConfig.database != null ? "/" + pgConfig.database : '')));
    console.log("  \u2023 Introspected Postgres schema(s) " + schemas.map(function (schema) { return chalk.magenta(schema); }).join(', '));
    console.log("  \u2023 GraphQL endpoint served at " + chalk.underline("http://" + hostname + ":" + port + graphqlRoute));
    if (!disableGraphiql)
        console.log("  \u2023 GraphiQL endpoint served at " + chalk.underline("http://" + hostname + ":" + port + graphiqlRoute));
    console.log('');
    console.log(chalk.gray('* * *'));
    console.log('');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Bvc3RncmFwaHFsL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDZCQUE2QztBQUM3Qyx5QkFBaUM7QUFDakMsNkJBQW1DO0FBQ25DLDZCQUErQjtBQUMvQix1Q0FBbUM7QUFDbkMsNkRBQXVFO0FBQ3ZFLDZDQUF1QztBQUV2Qyw0QkFBNEI7QUFFNUIsK0JBQStCO0FBQy9CLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQTtBQUV4QixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFZLENBQUMsY0FBVyxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtBQUNsRyxJQUFNLE9BQU8sR0FBRyxJQUFJLG1CQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7QUFFMUMsT0FBTztLQUNKLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0tBQ3pCLEtBQUssQ0FBQyxjQUFjLENBQUM7S0FDckIsV0FBVyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7S0FFakMsTUFBTSxDQUFDLDJCQUEyQixFQUFFLHNJQUFzSSxDQUFDO0tBQzNLLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSw2RUFBNkUsRUFBRSxVQUFDLE1BQWMsSUFBSyxPQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQWpCLENBQWlCLENBQUM7S0FDckosTUFBTSxDQUFDLGFBQWEsRUFBRSwyRkFBMkYsQ0FBQztLQUNsSCxNQUFNLENBQUMscUJBQXFCLEVBQUUsa0RBQWtELENBQUM7S0FDakYsTUFBTSxDQUFDLHFCQUFxQixFQUFFLHVDQUF1QyxFQUFFLFVBQVUsQ0FBQztLQUNsRixNQUFNLENBQUMsOEJBQThCLEVBQUUsNEVBQTRFLEVBQUUsVUFBVSxDQUFDO0tBQ2hJLE1BQU0sQ0FBQyw2QkFBNkIsRUFBRSw4R0FBOEcsQ0FBQztL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