#!/usr/bin/env node
"use strict";
var path_1 = require("path");
var fs_1 = require("fs");
var http_1 = require("http");
var chalk = require("chalk");
var program = require("commander");
var pg_connection_string_1 = require("pg-connection-string");
var postgraphql_1 = require("./postgraphql");
// tslint:disable no-console
// TODO: Demo Postgres database
var DEMO_PG_URL = null;
var manifest = JSON.parse(fs_1.readFileSync(path_1.resolve(__dirname, '../../package.json')).toString());
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
    .option('-t, --token <identifier>', 'the Postgres identifier for a composite type that will be used to create tokens')
    .option('-o, --cors', 'enable generous CORS settings. this is disabled by default, if possible use a proxy instead')
    .option('-a, --classic-ids', 'use classic global id field name. required to support Relay 1')
    .option('-j, --dynamic-json', 'enable dynamic JSON in GraphQL inputs and outputs. uses stringified JSON by default')
    .option('-M, --disable-default-mutations', 'disable default mutations, mutation will only be possible through Postgres functions')
    .option('-l, --body-size-limit <string>', 'set the maximum size of JSON bodies that can be parsed (default 100kB) The size can be given as a human-readable string, such as \'200kB\' or \'5MB\' (case insensitive).')
    .option('--secret <string>', 'DEPRECATED: Use jwt-secret instead')
    .option('-e, --jwt-secret <string>', 'the secret to be used when creating and verifying JWTs. if none is provided auth will be disabled')
    .option('-A, --jwt-audiences <string>', 'a comma separated list of audiences your jwt token can contain. If no audience is given the audience defaults to `postgraphql`', function (option) { return option.split(','); })
    .option('--jwt-role <string>', 'a comma seperated list of strings that create a path in the jwt from which to extract the postgres role. if none is provided it will use the key `role` on the root of the jwt.', function (option) { return option.split(','); })
    .option('--export-schema-json [path]', 'enables exporting the detected schema, in JSON format, to the given location. The directories must exist already, if the file exists it will be overwritten.')
    .option('--export-schema-graphql [path]', 'enables exporting the detected schema, in GraphQL schema format, to the given location. The directories must exist already, if the file exists it will be overwritten.')
    .option('--show-error-stack [setting]', 'show JavaScript error stacks in the GraphQL result errors');
program.on('--help', function () { return console.log("\n  Get Started:\n\n    $ postgraphql --demo\n    $ postgraphql --schema my_schema\n".slice(1)); });
program.parse(process.argv);
// Kill server on exit.
process.on('SIGINT', process.exit);
// Destruct our command line arguments, use defaults, and rename options to
// something appropriate for JavaScript.
var _a = program, _b = _a.demo, isDemo = _b === void 0 ? false : _b, pgConnectionString = _a.connection, watchPg = _a.watch, _c = _a.host, hostname = _c === void 0 ? 'localhost' : _c, _d = _a.port, port = _d === void 0 ? 5000 : _d, maxPoolSize = _a.maxPoolSize, pgDefaultRole = _a.defaultRole, _e = _a.graphql, graphqlRoute = _e === void 0 ? '/graphql' : _e, _f = _a.graphiql, graphiqlRoute = _f === void 0 ? '/graphiql' : _f, _g = _a.disableGraphiql, disableGraphiql = _g === void 0 ? false : _g, deprecatedJwtSecret = _a.secret, jwtSecret = _a.jwtSecret, _h = _a.jwtAudiences, jwtAudiences = _h === void 0 ? ['postgraphql'] : _h, _j = _a.jwtRole, jwtRole = _j === void 0 ? ['role'] : _j, jwtPgTypeIdentifier = _a.token, _k = _a.cors, enableCors = _k === void 0 ? false : _k, _l = _a.classicIds, classicIds = _l === void 0 ? false : _l, _m = _a.dynamicJson, dynamicJson = _m === void 0 ? false : _m, _o = _a.disableDefaultMutations, disableDefaultMutations = _o === void 0 ? false : _o, exportJsonSchemaPath = _a.exportSchemaJson, exportGqlSchemaPath = _a.exportSchemaGraphql, showErrorStack = _a.showErrorStack, bodySizeLimit = _a.bodySizeLimit;
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
    jwtPgTypeIdentifier: jwtPgTypeIdentifier,
    jwtSecret: jwtSecret || deprecatedJwtSecret,
    jwtAudiences: jwtAudiences,
    jwtRole: jwtRole,
    pgDefaultRole: pgDefaultRole,
    watchPg: watchPg,
    showErrorStack: showErrorStack,
    disableQueryLog: false,
    enableCors: enableCors,
    exportJsonSchemaPath: exportJsonSchemaPath,
    exportGqlSchemaPath: exportGqlSchemaPath,
    bodySizeLimit: bodySizeLimit,
}));
// Start our server by listening to a specific port and host name. Also log
// some instructions and other interesting information.
server.listen(port, hostname, function () {
    console.log('');
    console.log("PostGraphQL server listening on port " + chalk.underline(server.address().port.toString()) + " \uD83D\uDE80");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Bvc3RncmFwaHFsL2NsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDZCQUE2QztBQUM3Qyx5QkFBaUM7QUFDakMsNkJBQW1DO0FBQ25DLDZCQUErQjtBQUMvQixtQ0FBcUM7QUFDckMsNkRBQXVFO0FBQ3ZFLDZDQUF1QztBQUV2Qyw0QkFBNEI7QUFFNUIsK0JBQStCO0FBQy9CLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQTtBQUV4QixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFZLENBQUMsY0FBVyxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtBQUVsRyxPQUFPO0tBQ0osT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7S0FDekIsS0FBSyxDQUFDLGNBQWMsQ0FBQztLQUNyQixXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztLQUVqQyxNQUFNLENBQUMsMkJBQTJCLEVBQUUsc0lBQXNJLENBQUM7S0FDM0ssTUFBTSxDQUFDLHVCQUF1QixFQUFFLDZFQUE2RSxFQUFFLFVBQUMsTUFBYyxJQUFLLE9BQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBakIsQ0FBaUIsQ0FBQztLQUNySixNQUFNLENBQUMsYUFBYSxFQUFFLDJGQUEyRixDQUFDO0tBQ2xILE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxrREFBa0QsQ0FBQztLQUNqRixNQUFNLENBQUMscUJBQXFCLEVBQUUsdUNBQXVDLEVBQUUsVUFBVSxDQUFDO0tBQ2xGLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSw0RUFBNEUsRUFBRSxVQUFVLENBQUM7S0FDaEksTUFBTSxDQUFDLDZCQUE2QixFQUFFLDhHQUE4RyxDQUFDO0tBQ3JKLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxrRUFBa0UsQ0FBQztLQUNsRyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsdUVBQXVFLENBQUM7S0FDeEcsTUFBTSxDQUFDLHdCQUF3QixFQUFFLHNFQUFzRSxDQUFDO0tBQ3hHLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxpRkFBaUYsQ0FBQztLQUNySCxNQUFNLENBQUMsWUFBWSxFQUFFLDZGQUE2RixDQUFDO0tBQ25ILE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSwrREFBK0QsQ0FBQztLQUM1RixNQUFNLENBQUMsb0JBQW9CLEVBQUUscUZBQXFGLENBQUM7S0FDbkgsTUFBTSxDQUFDLGlDQUFpQyxFQUFFLHNGQUFzRixDQUFDO0tBQ2pJLE1BQU0sQ0FBQyxnQ0FBZ0MsRUFBRSwyS0FBMkssQ0FBQztLQUNyTixNQUFNLENBQUMsbUJBQW1CLEVBQUUsb0NBQW9DLENBQUM7S0FDakUsTUFBTSxDQUFDLDJCQUEyQixFQUFFLG1HQUFtRyxDQUFDO0tBQ3hJLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSxnSUFBZ0ksRUFBRSxVQUFDLE1BQWMsSUFBSyxPQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQWpCLENBQWlCLENBQUM7S0FDL00sTUFBTSxDQUFDLHFCQUFxQixFQUFFLGlMQUFpTCxFQUFFLFVBQUMsTUFBYyxJQUFLLE9BQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBakIsQ0FBaUIsQ0FBQztLQUN2UCxNQUFNLENBQUMsNkJBQTZCLEVBQUUsOEpBQThKLENBQUM7S0FDck0sTUFBTSxDQUFDLGdDQUFnQyxFQUFFLHdLQUF3SyxDQUFDO0tBQ2xOLE1BQU0sQ0FBQyw4QkFBOEIsRUFBRSwyREFBMkQsQ0FBQyxDQUFBO0FBRXRHLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLGNBQU0sT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLHNGQUt0QyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUxnQixDQUtoQixDQUFDLENBQUE7QUFFWixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUUzQix1QkFBdUI7QUFDdkIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBRWxDLDJFQUEyRTtBQUMzRSx3Q0FBd0M7QUFDbEMsSUFBQSxZQXlCWSxFQXhCaEIsWUFBb0IsRUFBcEIsbUNBQW9CLEVBQ3BCLGtDQUE4QixFQUM5QixrQkFBYyxFQUNkLFlBQTRCLEVBQTVCLDJDQUE0QixFQUM1QixZQUFXLEVBQVgsZ0NBQVcsRUFDWCw0QkFBVyxFQUNYLDhCQUEwQixFQUMxQixlQUFrQyxFQUFsQyw4Q0FBa0MsRUFDbEMsZ0JBQXFDLEVBQXJDLGdEQUFxQyxFQUNyQyx1QkFBdUIsRUFBdkIsNENBQXVCLEVBQ3ZCLCtCQUEyQixFQUMzQix3QkFBUyxFQUNULG9CQUE4QixFQUE5QixtREFBOEIsRUFDOUIsZUFBa0IsRUFBbEIsdUNBQWtCLEVBQ2xCLDhCQUEwQixFQUMxQixZQUF3QixFQUF4Qix1Q0FBd0IsRUFDeEIsa0JBQWtCLEVBQWxCLHVDQUFrQixFQUNsQixtQkFBbUIsRUFBbkIsd0NBQW1CLEVBQ25CLCtCQUErQixFQUEvQixvREFBK0IsRUFDL0IsMENBQXNDLEVBQ3RDLDRDQUF3QyxFQUN4QyxrQ0FBYyxFQUNkLGdDQUFhLENBRUc7QUFFbEIsMkVBQTJFO0FBQzNFLDBFQUEwRTtBQUMxRSwwQkFBMEI7QUFDMUIsSUFBTSxPQUFPLEdBQWtCLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtBQUU3Riw4QkFBOEI7QUFDOUIsSUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FDNUIsRUFBRTtBQUNGLHdFQUF3RTtBQUN4RSxvRUFBb0U7QUFDcEUscUVBQXFFO0FBQ3JFLDZCQUE2QjtBQUM3QixrQkFBa0IsSUFBSSxNQUFNLEdBQUcsNEJBQXVCLENBQUMsa0JBQWtCLElBQUksV0FBVyxDQUFDLEdBQUc7SUFDMUYsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLFdBQVc7SUFDdkMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLElBQUk7SUFDaEMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVTtDQUNqQztBQUNELHVDQUF1QztBQUN2QyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsQ0FDckIsQ0FBQTtBQUVELG1FQUFtRTtBQUNuRSx5QkFBeUI7QUFDekIsSUFBTSxNQUFNLEdBQUcsbUJBQVksQ0FBQyxxQkFBVyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUU7SUFDekQsVUFBVSxZQUFBO0lBQ1YsV0FBVyxhQUFBO0lBQ1gsdUJBQXVCLHlCQUFBO0lBQ3ZCLFlBQVksY0FBQTtJQUNaLGFBQWEsZUFBQTtJQUNiLFFBQVEsRUFBRSxDQUFDLGVBQWU7SUFDMUIsbUJBQW1CLHFCQUFBO0lBQ25CLFNBQVMsRUFBRSxTQUFTLElBQUksbUJBQW1CO0lBQzNDLFlBQVksY0FBQTtJQUNaLE9BQU8sU0FBQTtJQUNQLGFBQWEsZUFBQTtJQUNiLE9BQU8sU0FBQTtJQUNQLGNBQWMsZ0JBQUE7SUFDZCxlQUFlLEVBQUUsS0FBSztJQUN0QixVQUFVLFlBQUE7SUFDVixvQkFBb0Isc0JBQUE7SUFDcEIsbUJBQW1CLHFCQUFBO0lBQ25CLGFBQWEsZUFBQTtDQUNkLENBQUMsQ0FBQyxDQUFBO0FBRUgsMkVBQTJFO0FBQzNFLHVEQUF1RDtBQUN2RCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7SUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsMENBQXdDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxrQkFBSyxDQUFDLENBQUE7SUFDM0csT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkNBQXNDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxrQkFBa0IsR0FBRyxnQkFBYyxRQUFRLENBQUMsSUFBSSxVQUFJLFFBQVEsQ0FBQyxJQUFJLElBQUksSUFBSSxLQUFHLFFBQVEsQ0FBQyxRQUFRLElBQUksSUFBSSxHQUFHLE1BQUksUUFBUSxDQUFDLFFBQVUsR0FBRyxFQUFFLENBQUUsQ0FBRyxDQUFDLENBQUE7SUFDMU4sT0FBTyxDQUFDLEdBQUcsQ0FBQyw4Q0FBdUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQXJCLENBQXFCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFHLENBQUMsQ0FBQTtJQUM3RyxPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUFrQyxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVUsUUFBUSxTQUFJLElBQUksR0FBRyxZQUFjLENBQUcsQ0FBQyxDQUFBO0lBRTdHLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDO1FBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsMENBQW1DLEtBQUssQ0FBQyxTQUFTLENBQUMsWUFBVSxRQUFRLFNBQUksSUFBSSxHQUFHLGFBQWUsQ0FBRyxDQUFDLENBQUE7SUFFakgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDakIsQ0FBQyxDQUFDLENBQUEifQ==