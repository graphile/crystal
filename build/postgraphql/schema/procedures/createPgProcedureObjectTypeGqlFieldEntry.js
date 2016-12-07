"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const graphql_1 = require('graphql');
const utils_1 = require('../../../graphql/utils');
const createConnectionGqlField_1 = require('../../../graphql/schema/connection/createConnectionGqlField');
const transformGqlInputValue_1 = require('../../../graphql/schema/transformGqlInputValue');
const utils_2 = require('../../../postgres/utils');
const pgClientFromContext_1 = require('../../../postgres/inventory/pgClientFromContext');
const transformPgValueIntoValue_1 = require('../../../postgres/inventory/transformPgValueIntoValue');
const createPgProcedureFixtures_1 = require('./createPgProcedureFixtures');
const createPgProcedureSqlCall_1 = require('./createPgProcedureSqlCall');
const PgProcedurePaginator_1 = require('./PgProcedurePaginator');
/**
 * Creates a procedure field for a given object type. We assume that the type
 * of the source is the correct type.
 */
// TODO: This is almost a straight copy/paste of
// `createPgProcedureQueryGqlFieldEntries`. Refactor these hooks man!
function createPgProcedureObjectTypeGqlFieldEntry(buildToken, pgCatalog, pgProcedure) {
    return (pgProcedure.returnsSet
        ? createPgSetProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure)
        : createPgSingleProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPgProcedureObjectTypeGqlFieldEntry;
/**
 * Creates a standard query field entry for a procedure. Will execute the
 * procedure with the provided arguments, and the source object as the first
 * argument.
 */
function createPgSingleProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure) {
    const fixtures = createPgProcedureFixtures_1.default(buildToken, pgCatalog, pgProcedure);
    // Create our GraphQL input fields users will use to input data into our
    // procedure.
    const argEntries = fixtures.args.slice(1).map(({ name, gqlType }) => [utils_1.formatName.arg(name), {
            // No description…
            type: pgProcedure.isStrict ? new graphql_1.GraphQLNonNull(graphql_1.getNullableType(gqlType)) : gqlType,
        }]);
    return [utils_1.formatName.field(pgProcedure.name.substring(fixtures.args[0].pgType.name.length + 1)), {
            description: pgProcedure.description,
            type: fixtures.return.gqlType,
            args: utils_1.buildObject(argEntries),
            resolve(source, args, context) {
                return __awaiter(this, void 0, void 0, function* () {
                    const client = pgClientFromContext_1.default(context);
                    const input = [source, ...argEntries.map(([argName, { type }]) => transformGqlInputValue_1.default(type, args[argName]))];
                    const query = utils_2.sql.compile(utils_2.sql.query `select to_json(${createPgProcedureSqlCall_1.default(fixtures, input)}) as value`);
                    const { rows: [row] } = yield client.query(query);
                    return row ? transformPgValueIntoValue_1.default(fixtures.return.type, row['value']) : null;
                });
            },
        }];
}
/**
 * Creates a field for procedures that return a set of values. For these
 * procedures we create a connection field to allow for pagination with the
 * source argument as the first argument.
 */
function createPgSetProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure) {
    const fixtures = createPgProcedureFixtures_1.default(buildToken, pgCatalog, pgProcedure);
    const paginator = new PgProcedurePaginator_1.default(fixtures);
    // Create our GraphQL input fields users will use to input data into our
    // procedure.
    const inputArgEntries = fixtures.args.slice(1).map(({ name, gqlType }) => [utils_1.formatName.arg(name), {
            // No description…
            type: pgProcedure.isStrict ? new graphql_1.GraphQLNonNull(graphql_1.getNullableType(gqlType)) : gqlType,
        }]);
    return [utils_1.formatName.field(pgProcedure.name.substring(fixtures.args[0].pgType.name.length + 1)), createConnectionGqlField_1.default(buildToken, paginator, {
            description: pgProcedure.description,
            inputArgEntries,
            getPaginatorInput: (source, args) => [source, ...inputArgEntries.map(([argName, { type }]) => transformGqlInputValue_1.default(type, args[argName]))],
        })];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUGdQcm9jZWR1cmVPYmplY3RUeXBlR3FsRmllbGRFbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9zY2hlbWEvcHJvY2VkdXJlcy9jcmVhdGVQZ1Byb2NlZHVyZU9iamVjdFR5cGVHcWxGaWVsZEVudHJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDBCQUEyRixTQUMzRixDQUFDLENBRG1HO0FBRXBHLHdCQUF3Qyx3QkFDeEMsQ0FBQyxDQUQrRDtBQUVoRSwyQ0FBcUMsNkRBQ3JDLENBQUMsQ0FEaUc7QUFDbEcseUNBQW1DLGdEQUNuQyxDQUFDLENBRGtGO0FBQ25GLHdCQUFvQix5QkFDcEIsQ0FBQyxDQUQ0QztBQUU3QyxzQ0FBZ0MsaURBQ2hDLENBQUMsQ0FEZ0Y7QUFDakYsNENBQXNDLHVEQUN0QyxDQUFDLENBRDRGO0FBQzdGLDRDQUFzQyw2QkFDdEMsQ0FBQyxDQURrRTtBQUNuRSwyQ0FBcUMsNEJBQ3JDLENBQUMsQ0FEZ0U7QUFDakUsdUNBQWlDLHdCQVFqQyxDQUFDLENBUndEO0FBRXpEOzs7R0FHRztBQUNILGdEQUFnRDtBQUNoRCxxRUFBcUU7QUFDckUsa0RBQ0UsVUFBc0IsRUFDdEIsU0FBb0IsRUFDcEIsV0FBK0I7SUFFL0IsTUFBTSxDQUFDLENBQ0wsV0FBVyxDQUFDLFVBQVU7VUFDbEIsc0NBQXNDLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUM7VUFDMUUseUNBQXlDLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FDbEYsQ0FBQTtBQUNILENBQUM7QUFWRDswREFVQyxDQUFBO0FBRUQ7Ozs7R0FJRztBQUNILG1EQUNFLFVBQXNCLEVBQ3RCLFNBQW9CLEVBQ3BCLFdBQStCO0lBRS9CLE1BQU0sUUFBUSxHQUFHLG1DQUF5QixDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFFOUUsd0VBQXdFO0lBQ3hFLGFBQWE7SUFDYixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQzNDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQ2hCLENBQUMsa0JBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDckIsa0JBQWtCO1lBQ2xCLElBQUksRUFBRSxXQUFXLENBQUMsUUFBUSxHQUFHLElBQUksd0JBQWMsQ0FBQyx5QkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsT0FBTztTQUNwRixDQUFDLENBQ0wsQ0FBQTtJQUVELE1BQU0sQ0FBQyxDQUFDLGtCQUFVLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM3RixXQUFXLEVBQUUsV0FBVyxDQUFDLFdBQVc7WUFDcEMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTztZQUM3QixJQUFJLEVBQUUsbUJBQVcsQ0FBQyxVQUFVLENBQUM7WUFFdkIsT0FBTyxDQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTzs7b0JBQ2xDLE1BQU0sTUFBTSxHQUFHLDZCQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFBO29CQUMzQyxNQUFNLEtBQUssR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEtBQUssZ0NBQXNCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDL0csTUFBTSxLQUFLLEdBQUcsV0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFHLENBQUMsS0FBSyxDQUFBLGtCQUFrQixrQ0FBd0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFBO29CQUMzRyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7b0JBQ2pELE1BQU0sQ0FBQyxHQUFHLEdBQUcsbUNBQXlCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFBO2dCQUNuRixDQUFDO2FBQUE7U0FDRixDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQ7Ozs7R0FJRztBQUNILGdEQUNFLFVBQXNCLEVBQ3RCLFNBQW9CLEVBQ3BCLFdBQStCO0lBRS9CLE1BQU0sUUFBUSxHQUFHLG1DQUF5QixDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFDOUUsTUFBTSxTQUFTLEdBQUcsSUFBSSw4QkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUVwRCx3RUFBd0U7SUFDeEUsYUFBYTtJQUNiLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FDaEQsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FDaEIsQ0FBQyxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNyQixrQkFBa0I7WUFDbEIsSUFBSSxFQUFFLFdBQVcsQ0FBQyxRQUFRLEdBQUcsSUFBSSx3QkFBYyxDQUFDLHlCQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxPQUFPO1NBQ3BGLENBQUMsQ0FDTCxDQUFBO0lBRUQsTUFBTSxDQUFDLENBQUMsa0JBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLGtDQUF3QixDQUE2QixVQUFVLEVBQUUsU0FBUyxFQUFFO1lBQ3pLLFdBQVcsRUFBRSxXQUFXLENBQUMsV0FBVztZQUNwQyxlQUFlO1lBQ2YsaUJBQWlCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxLQUM5QixDQUFDLE1BQU0sRUFBRSxHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEtBQUssZ0NBQXNCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDekcsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDIn0=