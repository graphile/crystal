"use strict";
var tslib_1 = require("tslib");
var pg_1 = require("pg");
var interface_1 = require("../../interface");
var postgres_1 = require("../../postgres");
var introspection_1 = require("../../postgres/introspection");
var getTypeFromPgType_1 = require("../../postgres/inventory/type/getTypeFromPgType");
var PgClassType_1 = require("../../postgres/inventory/type/PgClassType");
var graphql_1 = require("../../graphql");
var createPgProcedureMutationGqlFieldEntry_1 = require("./procedures/createPgProcedureMutationGqlFieldEntry");
var createPgProcedureQueryGqlFieldEntry_1 = require("./procedures/createPgProcedureQueryGqlFieldEntry");
var createPgProcedureObjectTypeGqlFieldEntry_1 = require("./procedures/createPgProcedureObjectTypeGqlFieldEntry");
var getPgProcedureComputedClass_1 = require("./procedures/getPgProcedureComputedClass");
var getPgTokenTypeFromIdentifier_1 = require("./auth/getPgTokenTypeFromIdentifier");
var getJwtGqlType_1 = require("./auth/getJwtGqlType");
/**
 * Creates a PostGraphQL schema by looking at a Postgres client.
 */
function createPostGraphQLSchema(clientOrConfig, schemaOrCatalog, options) {
    if (schemaOrCatalog === void 0) { schemaOrCatalog = 'public'; }
    if (options === void 0) { options = {}; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var inventory, pgCatalog, schemas, pgClient, pgClient, jwtPgType, pgMutationProcedures, pgQueryProcedures, pgObjectTypeProcedures, _i, _a, pgProcedure, pgComputedClass, gqlSchema;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    inventory = new interface_1.Inventory();
                    if (!(schemaOrCatalog instanceof introspection_1.PgCatalog)) return [3 /*break*/, 1];
                    pgCatalog = schemaOrCatalog;
                    return [3 /*break*/, 6];
                case 1:
                    schemas = Array.isArray(schemaOrCatalog) ? schemaOrCatalog : [schemaOrCatalog];
                    if (!(clientOrConfig instanceof pg_1.Client || clientOrConfig instanceof pg_1.Pool)) return [3 /*break*/, 3];
                    pgClient = clientOrConfig;
                    return [4 /*yield*/, postgres_1.introspectPgDatabase(pgClient, schemas)];
                case 2:
                    pgCatalog = _b.sent();
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, pg_1.connect(clientOrConfig || {})];
                case 4:
                    pgClient = _b.sent();
                    return [4 /*yield*/, postgres_1.introspectPgDatabase(pgClient, schemas)];
                case 5:
                    pgCatalog = _b.sent();
                    pgClient.end();
                    _b.label = 6;
                case 6:
                    jwtPgType = options.jwtPgTypeIdentifier
                        ? getPgTokenTypeFromIdentifier_1.default(pgCatalog, options.jwtPgTypeIdentifier)
                        : undefined;
                    // If a token type is defined, but the JWT secret is not. Throw an error.
                    if (jwtPgType && !options.jwtSecret)
                        throw new Error('Postgres token type is defined, but a JWT secret is not defined. Please provide a JWT secret.');
                    // Add all of our Postgres constructs to that inventory.
                    postgres_1.addPgCatalogToInventory(inventory, pgCatalog, {
                        renameIdToRowId: options.classicIds,
                    });
                    pgMutationProcedures = [];
                    pgQueryProcedures = [];
                    pgObjectTypeProcedures = new Map();
                    // For all of the procedures in our catalog, find a place to put each one.
                    for (_i = 0, _a = pgCatalog.getProcedures(); _i < _a.length; _i++) {
                        pgProcedure = _a[_i];
                        // If this procedure is unstable, it is a mutation. Add it to that list.
                        if (!pgProcedure.isStable)
                            pgMutationProcedures.push(pgProcedure);
                        else {
                            pgComputedClass = getPgProcedureComputedClass_1.default(pgCatalog, pgProcedure);
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
                    gqlSchema = graphql_1.createGraphQLSchema(inventory, {
                        nodeIdFieldName: options.classicIds ? 'id' : '__id',
                        dynamicJson: options.dynamicJson,
                        disableDefaultMutations: options.disableDefaultMutations,
                        // If we have a JWT Postgres type, let us override the GraphQL output type
                        // with our own.
                        _typeOverrides: jwtPgType && new Map([
                            [getTypeFromPgType_1.default(pgCatalog, jwtPgType), {
                                    // Throw an error if the user tries to use this as input.
                                    get input() { throw new Error("Using the JWT Token type '" + options.jwtPgTypeIdentifier + "' as input is not yet implemented."); },
                                    // Use our JWT GraphQL type as the output.
                                    output: getJwtGqlType_1.default(interface_1.getNonNullableType(getTypeFromPgType_1.default(pgCatalog, jwtPgType)), options.jwtSecret),
                                }],
                        ]),
                        _hooks: {
                            // Extra field entries to go on the mutation type.
                            mutationFieldEntries: function (_buildToken) {
                                return pgMutationProcedures.map(function (pgProcedure) { return createPgProcedureMutationGqlFieldEntry_1.default(_buildToken, pgCatalog, pgProcedure); });
                            },
                            // Extra field entries to go on the query type.
                            queryFieldEntries: function (_buildToken) {
                                return pgQueryProcedures.map(function (pgProcedure) { return createPgProcedureQueryGqlFieldEntry_1.default(_buildToken, pgCatalog, pgProcedure); });
                            },
                            // Extra field entires to go on object types that also happen to be
                            // classes.
                            objectTypeFieldEntries: function (objectType, _buildToken) {
                                return objectType instanceof PgClassType_1.default
                                    ? (pgObjectTypeProcedures.get(objectType.pgClass) || []).map(function (pgProcedure) { return createPgProcedureObjectTypeGqlFieldEntry_1.default(_buildToken, pgCatalog, pgProcedure); })
                                    : [];
                            },
                        },
                    });
                    return [2 /*return*/, gqlSchema];
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPostGraphQLSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUG9zdEdyYXBoUUxTY2hlbWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvc2NoZW1hL2NyZWF0ZVBvc3RHcmFwaFFMU2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQTJFO0FBRTNFLDZDQUFpRjtBQUNqRiwyQ0FBOEU7QUFDOUUsOERBQTRGO0FBQzVGLHFGQUErRTtBQUMvRSx5RUFBbUU7QUFDbkUseUNBQW1EO0FBRW5ELDhHQUF3RztBQUN4Ryx3R0FBa0c7QUFDbEcsa0hBQTRHO0FBQzVHLHdGQUFrRjtBQUNsRixvRkFBOEU7QUFDOUUsc0RBQWdEO0FBRWhEOztHQUVHO0FBQ0gsaUNBQ0UsY0FBc0QsRUFDdEQsZUFBOEQsRUFDOUQsT0FNTTtJQVBOLGdDQUFBLEVBQUEsMEJBQThEO0lBQzlELHdCQUFBLEVBQUEsWUFNTTs7WUFHQSxTQUFTLEVBQ1gsU0FBUyxFQVFMLE9BQU8sRUFNTCxRQUFRLFlBWVosU0FBUyxFQWtCVCxvQkFBb0IsRUFDcEIsaUJBQWlCLEVBQ2pCLHNCQUFzQixVQUdqQixXQUFXLEVBTVosZUFBZSxFQW9CbkIsU0FBUzs7OztnQ0E1RUcsSUFBSSxxQkFBUyxFQUFFO3lCQUk3QixDQUFBLGVBQWUsWUFBWSx5QkFBUyxDQUFBLEVBQXBDLHdCQUFvQztvQkFDdEMsU0FBUyxHQUFHLGVBQWUsQ0FBQTs7OzhCQUlYLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsZUFBZSxHQUFHLENBQUMsZUFBZSxDQUFDO3lCQUtoRixDQUFBLGNBQWMsWUFBWSxXQUFNLElBQUksY0FBYyxZQUFZLFNBQUksQ0FBQSxFQUFsRSx3QkFBa0U7K0JBQ25ELGNBQWM7b0JBQ25CLHFCQUFNLCtCQUFvQixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBQTs7b0JBQXpELFNBQVMsR0FBRyxTQUE2QyxDQUFBOzt3QkFHeEMscUJBQU0sWUFBZSxDQUFDLGNB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