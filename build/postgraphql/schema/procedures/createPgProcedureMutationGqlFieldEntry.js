"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const pluralize = require('pluralize');
const graphql_1 = require('graphql');
const interface_1 = require('../../../interface');
const utils_1 = require('../../../graphql/utils');
const createMutationGqlField_1 = require('../../../graphql/schema/createMutationGqlField');
const transformGqlInputValue_1 = require('../../../graphql/schema/transformGqlInputValue');
const createCollectionRelationTailGqlFieldEntries_1 = require('../../../graphql/schema/collection/createCollectionRelationTailGqlFieldEntries');
const utils_2 = require('../../../postgres/utils');
const PgCollection_1 = require('../../../postgres/inventory/collection/PgCollection');
const pgClientFromContext_1 = require('../../../postgres/inventory/pgClientFromContext');
const transformPgValueIntoValue_1 = require('../../../postgres/inventory/transformPgValueIntoValue');
const createPgProcedureFixtures_1 = require('./createPgProcedureFixtures');
const createPgProcedureSqlCall_1 = require('./createPgProcedureSqlCall');
/**
 * Creates a single mutation GraphQL field entry for our procedure. We use the
 * `createMutationGqlField` utility from the `graphql` package to do so.
 */
// TODO: test
function createPgProcedureMutationGqlFieldEntry(buildToken, pgCatalog, pgProcedure) {
    const { inventory } = buildToken;
    const fixtures = createPgProcedureFixtures_1.default(buildToken, pgCatalog, pgProcedure);
    // See if the output type of this procedure is a single object, try to find a
    // `PgCollection` which has the same type. If it exists we add some extra
    // stuffs.
    const pgCollection = !pgProcedure.returnsSet
        ? inventory.getCollections().find(collection => collection instanceof PgCollection_1.default && collection.pgClass.typeId === fixtures.return.pgType.id)
        : null;
    // Create our GraphQL input fields users will use to input data into our
    // procedure.
    const inputFields = fixtures.args.map(({ name, gqlType }) => [utils_1.formatName.field(name), {
            // No description…
            type: pgProcedure.isStrict ? new graphql_1.GraphQLNonNull(graphql_1.getNullableType(gqlType)) : gqlType,
        }]);
    return [utils_1.formatName.field(pgProcedure.name), createMutationGqlField_1.default(buildToken, {
            name: pgProcedure.name,
            description: pgProcedure.description,
            inputFields,
            outputFields: [
                [utils_1.formatName.field(pgProcedure.returnsSet
                        ? pluralize(getTypeFieldName(fixtures.return.type))
                        : getTypeFieldName(fixtures.return.type)), {
                        // If we are returning a set, we should wrap our type in a GraphQL
                        // list.
                        type: pgProcedure.returnsSet
                            ? new graphql_1.GraphQLList(fixtures.return.gqlType)
                            : fixtures.return.gqlType,
                        resolve: value => value,
                    }],
                // Add related objects if there is an associated `PgCollection`. This
                // helps in Relay 1.
                ...(pgCollection ? createCollectionRelationTailGqlFieldEntries_1.default(buildToken, pgCollection) : []),
            ],
            // Actually execute the procedure here.
            execute(context, gqlInput) {
                return __awaiter(this, void 0, void 0, function* () {
                    const client = pgClientFromContext_1.default(context);
                    // Turn our GraphQL input into an input tuple.
                    const input = inputFields.map(([fieldName, { type }]) => transformGqlInputValue_1.default(type, gqlInput[fieldName]));
                    // Craft our procedure call. A procedure name with arguments, like any
                    // other function call. Input values must be coerced twice however.
                    const procedureCall = createPgProcedureSqlCall_1.default(fixtures, input);
                    const aliasIdentifier = Symbol();
                    const query = utils_2.sql.compile(
                    // If the procedure returns a set, we must select a set of values.
                    pgProcedure.returnsSet
                        ? utils_2.sql.query `select to_json(${utils_2.sql.identifier(aliasIdentifier)}) as value from ${procedureCall} as ${utils_2.sql.identifier(aliasIdentifier)}`
                        : utils_2.sql.query `select to_json(${procedureCall}) as value`);
                    const { rows } = yield client.query(query);
                    const values = rows.map(({ value }) => transformPgValueIntoValue_1.default(fixtures.return.type, value));
                    // If we selected a set of values, return the full set. Otherwise only
                    // return the one we queried.
                    return pgProcedure.returnsSet ? values : values[0];
                });
            },
        })];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPgProcedureMutationGqlFieldEntry;
/**
 * Gets the field name for any given type. Pluralizes the name of for item
 * types in list types.
 */
function getTypeFieldName(type) {
    if (type instanceof interface_1.NullableType)
        return getTypeFieldName(type.nonNullType);
    if (type instanceof interface_1.ListType)
        return pluralize(getTypeFieldName(type.itemType));
    return type.getNamedType().name;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUGdQcm9jZWR1cmVNdXRhdGlvbkdxbEZpZWxkRW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvc2NoZW1hL3Byb2NlZHVyZXMvY3JlYXRlUGdQcm9jZWR1cmVNdXRhdGlvbkdxbEZpZWxkRW50cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsTUFBTyxTQUFTLFdBQVcsV0FBVyxDQUFDLENBQUE7QUFDdkMsMEJBTU8sU0FDUCxDQUFDLENBRGU7QUFDaEIsNEJBQTZDLG9CQUM3QyxDQUFDLENBRGdFO0FBQ2pFLHdCQUEyQix3QkFDM0IsQ0FBQyxDQURrRDtBQUVuRCx5Q0FBbUMsZ0RBQ25DLENBQUMsQ0FEa0Y7QUFDbkYseUNBQW1DLGdEQUNuQyxDQUFDLENBRGtGO0FBQ25GLDhEQUF3RCxnRkFDeEQsQ0FBQyxDQUR1STtBQUN4SSx3QkFBb0IseUJBQ3BCLENBQUMsQ0FENEM7QUFFN0MsK0JBQXlCLHFEQUN6QixDQUFDLENBRDZFO0FBQzlFLHNDQUFnQyxpREFDaEMsQ0FBQyxDQURnRjtBQUNqRiw0Q0FBc0MsdURBQ3RDLENBQUMsQ0FENEY7QUFDN0YsNENBQXNDLDZCQUN0QyxDQUFDLENBRGtFO0FBQ25FLDJDQUFxQyw0QkFPckMsQ0FBQyxDQVBnRTtBQUVqRTs7O0dBR0c7QUFDSCxhQUFhO0FBQ2IsZ0RBQ0UsVUFBc0IsRUFDdEIsU0FBb0IsRUFDcEIsV0FBK0I7SUFFL0IsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLFVBQVUsQ0FBQTtJQUNoQyxNQUFNLFFBQVEsR0FBRyxtQ0FBeUIsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0lBRTlFLDZFQUE2RTtJQUM3RSx5RUFBeUU7SUFDekUsVUFBVTtJQUNWLE1BQU0sWUFBWSxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVU7VUFDeEMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDLElB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