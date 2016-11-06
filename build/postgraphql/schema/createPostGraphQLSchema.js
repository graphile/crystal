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
const interface_1 = require('../../interface');
const postgres_1 = require('../../postgres');
const getTypeFromPgType_1 = require('../../postgres/inventory/type/getTypeFromPgType');
const PgClassObjectType_1 = require('../../postgres/inventory/type/PgClassObjectType');
const graphql_1 = require('../../graphql');
const createPgProcedureMutationGqlFieldEntry_1 = require('./procedures/createPgProcedureMutationGqlFieldEntry');
const createPgProcedureQueryGqlFieldEntry_1 = require('./procedures/createPgProcedureQueryGqlFieldEntry');
const createPgProcedureObjectTypeGqlFieldEntry_1 = require('./procedures/createPgProcedureObjectTypeGqlFieldEntry');
const getPgProcedureComputedClass_1 = require('./procedures/getPgProcedureComputedClass');
const getPgTokenTypeFromIdentifier_1 = require('./auth/getPgTokenTypeFromIdentifier');
const getJwtGqlType_1 = require('./auth/getJwtGqlType');
/**
 * Creates a PostGraphQL schema by looking at a Postgres client.
 */
function createPostGraphQLSchema(clientOrConfig, schema = 'public', options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        // If our argument was not an array, make it one.
        const schemas = Array.isArray(schema) ? schema : [schema];
        // Create our inventory.
        const inventory = new interface_1.Inventory();
        let pgCatalog;
        // Introspect our Postgres database to get a catalog. If we weren’t given a
        // client, we will just connect a default client from the `pg` module.
        // TODO: test
        if (clientOrConfig instanceof pg_1.Client) {
            const pgClient = clientOrConfig;
            pgCatalog = yield postgres_1.introspectPgDatabase(pgClient, schemas);
        }
        else {
            const pgClient = yield pg_1.connect(clientOrConfig || {});
            pgCatalog = yield postgres_1.introspectPgDatabase(pgClient, schemas);
            pgClient.end();
        }
        // Gets the Postgres token type from our provided identifier. Just null if
        // we don’t have a token type identifier.
        const jwtPgType = options.jwtPgTypeIdentifier
            ? getPgTokenTypeFromIdentifier_1.default(pgCatalog, options.jwtPgTypeIdentifier)
            : undefined;
        // If a token type is defined, but the JWT secret is not. Throw an error.
        if (jwtPgType && !options.jwtSecret)
            throw new Error('Postgres token type is defined, but a JWT secret is not defined. Please provide a JWT secret.');
        // Add all of our Postgres constructs to that inventory.
        postgres_1.addPgCatalogToInventory(inventory, pgCatalog, {
            renameIdToRowId: options.classicIds,
        });
        // TODO: Move all procedure and procedure hook code somewhere else…
        // Create “sinks,” or places that our Postgres procedures will go. Each
        // “sink” represents a different location in our GraphQL schema where the
        // procedure may be exposed.
        const pgMutationProcedures = [];
        const pgQueryProcedures = [];
        const pgObjectTypeProcedures = new Map();
        // For all of the procedures in our catalog, find a place to put each one.
        for (const pgProcedure of pgCatalog.getProcedures()) {
            // If this procedure is unstable, it is a mutation. Add it to that list.
            if (!pgProcedure.isStable)
                pgMutationProcedures.push(pgProcedure);
            else {
                // Detect if this procedure is a computed procedure.
                const pgComputedClass = getPgProcedureComputedClass_1.default(pgCatalog, pgProcedure);
                // If it is not a computed procedure, add it to the normal query
                // procedure list.
                if (!pgComputedClass)
                    pgQueryProcedures.push(pgProcedure);
                else {
                    // If this class does not yet have an array of procedures, create one.
                    if (!pgObjectTypeProcedures.has(pgComputedClass))
                        pgObjectTypeProcedures.set(pgComputedClass, []);
                    // Actually add the procedure.
                    pgObjectTypeProcedures.get(pgComputedClass).push(pgProcedure);
                }
            }
        }
        // Actually create our GraphQL schema.
        const gqlSchema = graphql_1.createGraphQLSchema(inventory, {
            nodeIdFieldName: options.classicIds ? 'id' : '__id',
            dynamicJson: options.dynamicJson,
            disableDefaultMutations: options.disableDefaultMutations,
            // If we have a JWT Postgres type, let us override the GraphQL output type
            // with our own.
            _typeOverrides: jwtPgType && new Map([
                [getTypeFromPgType_1.default(pgCatalog, jwtPgType), {
                        // Throw an error if the user tries to use this as input.
                        get input() { throw new Error(`Using the JWT Token type '${options.jwtPgTypeIdentifier}' as input is not yet implemented.`); },
                        // Use our JWT GraphQL type as the output.
                        output: getJwtGqlType_1.default(getTypeFromPgType_1.default(pgCatalog, jwtPgType), options.jwtSecret),
                    }],
            ]),
            _hooks: {
                // Extra field entries to go on the mutation type.
                mutationFieldEntries: _buildToken => pgMutationProcedures.map(pgProcedure => createPgProcedureMutationGqlFieldEntry_1.default(_buildToken, pgCatalog, pgProcedure)),
                // Extra field entries to go on the query type.
                queryFieldEntries: _buildToken => pgQueryProcedures.map(pgProcedure => createPgProcedureQueryGqlFieldEntry_1.default(_buildToken, pgCatalog, pgProcedure)),
                // Extra field entires to go on object types that also happen to be
                // classes.
                objectTypeFieldEntries: (objectType, _buildToken) => objectType instanceof PgClassObjectType_1.default
                    ? (pgObjectTypeProcedures.get(objectType.pgClass) || []).map(pgProcedure => createPgProcedureObjectTypeGqlFieldEntry_1.default(_buildToken, pgCatalog, pgProcedure))
                    : [],
            },
        });
        return gqlSchema;
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPostGraphQLSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUG9zdEdyYXBoUUxTY2hlbWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvc2NoZW1hL2NyZWF0ZVBvc3RHcmFwaFFMU2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHFCQUFpRSxJQUNqRSxDQUFDLENBRG9FO0FBRXJFLDRCQUFnQyxpQkFDaEMsQ0FBQyxDQURnRDtBQUNqRCwyQkFBOEQsZ0JBQzlELENBQUMsQ0FENkU7QUFFOUUsb0NBQThCLGlEQUM5QixDQUFDLENBRDhFO0FBQy9FLG9DQUE4QixpREFDOUIsQ0FBQyxDQUQ4RTtBQUMvRSwwQkFBb0MsZUFDcEMsQ0FBQyxDQURrRDtBQUNuRCx5REFBbUQscURBQ25ELENBQUMsQ0FEdUc7QUFDeEcsc0RBQWdELGtEQUNoRCxDQUFDLENBRGlHO0FBQ2xHLDJEQUFxRCx1REFDckQsQ0FBQyxDQUQyRztBQUM1Ryw4Q0FBd0MsMENBQ3hDLENBQUMsQ0FEaUY7QUFDbEYsK0NBQXlDLHFDQUN6QyxDQUFDLENBRDZFO0FBQzlFLGdDQUEwQixzQkFLMUIsQ0FBQyxDQUwrQztBQUVoRDs7R0FFRztBQUNILGlDQUNFLGNBQStDLEVBQy9DLE1BQU0sR0FBMkIsUUFBUSxFQUN6QyxPQUFPLEdBTUgsRUFBRTs7UUFFTixpREFBaUQ7UUFDakQsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUV6RCx3QkFBd0I7UUFDeEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUE7UUFDakMsSUFBSSxTQUFvQixDQUFBO1FBRXhCLDJFQUEyRTtRQUMzRSxzRUFBc0U7UUFDdEUsYUFBYTtRQUNiLEVBQUUsQ0FBQyxDQUFDLGNBQWMsWUFBWSxXQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sUUFBUSxHQUFHLGNBQWMs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