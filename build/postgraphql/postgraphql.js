"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const pg_1 = require('pg');
const pg_connection_string_1 = require('pg-connection-string');
const chalk = require('chalk');
const createPostGraphQLSchema_1 = require('./schema/createPostGraphQLSchema');
const createPostGraphQLHttpRequestHandler_1 = require('./http/createPostGraphQLHttpRequestHandler');
const watchPgSchemas_1 = require('./watch/watchPgSchemas');
const ServerSideNetworkLayer_1 = require('./http/ServerSideNetworkLayer');
function postgraphql(poolOrConfig, schemaOrOptions, maybeOptions) {
    const { getGqlSchema, pgPool, options } = _postgraphql(poolOrConfig, schemaOrOptions, maybeOptions);
    // Finally create our Http request handler using our options, the Postgres
    // pool, and GraphQL schema. Return the final result.
    return createPostGraphQLHttpRequestHandler_1.default(Object.assign({}, options, {
        getGqlSchema,
        pgPool,
    }));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = postgraphql;
function postgraphqlServerSideNetworkLayerFactory(poolOrConfig, schemaOrOptions, maybeOptions) {
    const { getGqlSchema, pgPool, options } = _postgraphql(poolOrConfig, schemaOrOptions, maybeOptions);
    return ((jwtToken, done) => __awaiter(this, void 0, void 0, function* () {
        let gqlSchema;
        try {
            gqlSchema = yield getGqlSchema();
        }
        catch (e) {
            done(e);
            return;
        }
        done(undefined, new ServerSideNetworkLayer_1.default(pgPool, gqlSchema, jwtToken, options));
    }));
}
exports.postgraphqlServerSideNetworkLayerFactory = postgraphqlServerSideNetworkLayerFactory;
function _postgraphql(poolOrConfig, schemaOrOptions, maybeOptions) {
    let schema;
    let options;
    // If the second argument is undefined, use defaults for both `schema` and
    // `options`.
    if (typeof schemaOrOptions === 'undefined') {
        schema = 'public';
        options = {};
    }
    else if (typeof schemaOrOptions === 'string' || Array.isArray(schemaOrOptions)) {
        schema = schemaOrOptions;
        options = maybeOptions || {};
    }
    else {
        schema = 'public';
        options = schemaOrOptions;
    }
    // Creates the Postgres schemas array.
    const pgSchemas = Array.isArray(schema) ? schema : [schema];
    // Do some things with `poolOrConfig` so that in the end, we actually get a
    // Postgres pool.
    const pgPool = 
    // If it is already a `Pool`, just use it.
    poolOrConfig instanceof pg_1.Pool
        ? poolOrConfig
        : new pg_1.Pool(typeof poolOrConfig === 'string'
            ? pg_connection_string_1.parse(poolOrConfig)
            : poolOrConfig || {});
    // Creates a promise which will resolve to a GraphQL schema. Connects a
    // client from our pool to introspect the database.
    //
    // This is not a constant because when we are in watch mode, we want to swap
    // out the `gqlSchema`.
    let gqlSchema = createGqlSchema();
    // If the user wants us to watch the schema, execute the following:
    if (options.watchPg) {
        watchPgSchemas_1.default({
            pgPool,
            pgSchemas,
            onChange: ({ commands }) => {
                // tslint:disable-next-line no-console
                console.log(`Restarting PostGraphQL API after Postgres command(s)${options.graphiql ? '. Make sure to reload GraphiQL' : ''}: ️${commands.map(command => chalk.bold.cyan(command)).join(', ')}`);
                // Actually restart the GraphQL schema by creating a new one. Note that
                // `createGqlSchema` returns a promise and we aren’t ‘await’ing it.
                gqlSchema = createGqlSchema();
            },
        })
            .catch(error => {
            // tslint:disable-next-line no-console
            console.error(`${error.stack}\n`);
            process.exit(1);
        });
    }
    return {
        getGqlSchema: () => gqlSchema,
        options,
        pgPool,
    };
    /**
     * Creates a GraphQL schema by connecting a client from our pool which will
     * be used to introspect our Postgres database. If this function fails, we
     * will log the error and exit the process.
     *
     * This may only be executed once, at startup. However, if we are in watch
     * mode this will be updated whenever there is a change in our schema.
     */
    function createGqlSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pgClient = yield pgPool.connect();
                const newGqlSchema = yield createPostGraphQLSchema_1.default(pgClient, pgSchemas, options);
                // If no release function exists, don’t release. This is just for tests.
                if (pgClient && pgClient.release)
                    pgClient.release();
                return newGqlSchema;
            }
            // If we fail to build our schema, log the error and exit the process.
            catch (error) {
                // tslint:disable no-console
                console.error(`${error.stack}\n`);
                process.exit(1);
                // This is just here to make TypeScript type check. `process.exit` will
                // quit our program meaning we never execute this code.
                return null;
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGdyYXBocWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcG9zdGdyYXBocWwvcG9zdGdyYXBocWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEscUJBQWlDLElBQ2pDLENBQUMsQ0FEb0M7QUFDckMsdUNBQWlELHNCQUNqRCxDQUFDLENBRHNFO0FBRXZFLE1BQU8sS0FBSyxXQUFXLE9BQU8sQ0FBQyxDQUFBO0FBQy9CLDBDQUFvQyxrQ0FDcEMsQ0FBQyxDQURxRTtBQUN0RSxzREFBd0UsNENBQ3hFLENBQUMsQ0FEbUg7QUFDcEgsaUNBQTJCLHdCQUMzQixDQUFDLENBRGtEO0FBQ25ELHlDQUFtQywrQkFFbkMsQ0FBQyxDQUZpRTtBQTRCbEUscUJBQ0UsWUFBeUMsRUFDekMsZUFBNkQsRUFDN0QsWUFBaUM7SUFFakMsTUFBTSxFQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFDLEdBQUcsWUFBWSxDQUFDLFlBQVksRUFBRSxlQUFlLEVBQUUsWUFBWSxDQUFDLENBQUE7SUFDakcsMEVBQTBFO0lBQzFFLHFEQUFxRDtJQUNyRCxNQUFNLENBQUMsNkNBQW1DLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFO1FBQ3BFLFlBQVk7UUFDWixNQUFNO0tBQ1AsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDO0FBWkQ7NkJBWUMsQ0FBQTtBQUlELGtEQUNFLFlBQXlDLEVBQ3pDLGVBQTZELEVBQzdELFlBQWlDO0lBRWpDLE1BQU0sRUFBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBQyxHQUFHLFlBQVksQ0FBQyxZQUFZLEVBQUUsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFBO0lBQ2pHLE1BQU0sQ0FBQyxDQUFDLENBQU8sUUFBUSxFQUFFLElBQUk7UUFDM0IsSUFBSSxTQUF3QixDQUFBO1FBQzVCLElBQUksQ0FBQztZQUNILFNBQVMsR0FBRyxNQUFNLFlBQVksRUFB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