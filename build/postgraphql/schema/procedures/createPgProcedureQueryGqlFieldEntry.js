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
 * Creates the fields for query procedures. Query procedures that return
 * a set will expose a GraphQL connection.
 */
function createPgProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure) {
    return (pgProcedure.returnsSet
        ? createPgSetProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure)
        : createPgSingleProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPgProcedureQueryGqlFieldEntry;
/**
 * Creates a standard query field entry for a procedure. Will execute the
 * procedure with the provided arguments.
 */
function createPgSingleProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure) {
    const fixtures = createPgProcedureFixtures_1.default(buildToken, pgCatalog, pgProcedure);
    // Create our GraphQL input fields users will use to input data into our
    // procedure.
    const argEntries = fixtures.args.map(({ name, gqlType }) => [utils_1.formatName.arg(name), {
            // No description…
            type: pgProcedure.isStrict ? new graphql_1.GraphQLNonNull(graphql_1.getNullableType(gqlType)) : gqlType,
        }]);
    return [utils_1.formatName.field(pgProcedure.name), {
            description: pgProcedure.description,
            type: fixtures.return.gqlType,
            args: utils_1.buildObject(argEntries),
            resolve(_source, args, context) {
                return __awaiter(this, void 0, void 0, function* () {
                    const client = pgClientFromContext_1.default(context);
                    const input = argEntries.map(([argName, { type }]) => transformGqlInputValue_1.default(type, args[argName]));
                    const query = utils_2.sql.compile(utils_2.sql.query `select to_json(${createPgProcedureSqlCall_1.default(fixtures, input)}) as value`);
                    const { rows: [row] } = yield client.query(query);
                    return row ? transformPgValueIntoValue_1.default(fixtures.return.type, row['value']) : null;
                });
            },
        }];
}
/**
 * Creates a field for procedures that return a set of values. For these
 * procedures we create a connection field to allow for pagination.
 */
function createPgSetProcedureQueryGqlFieldEntry(buildToken, pgCatalog, pgProcedure) {
    const fixtures = createPgProcedureFixtures_1.default(buildToken, pgCatalog, pgProcedure);
    const paginator = new PgProcedurePaginator_1.default(fixtures);
    // Create our GraphQL input fields users will use to input data into our
    // procedure.
    const inputArgEntries = fixtures.args.map(({ name, gqlType }) => [utils_1.formatName.arg(name), {
            // No description…
            type: pgProcedure.isStrict ? new graphql_1.GraphQLNonNull(graphql_1.getNullableType(gqlType)) : gqlType,
        }]);
    return [
        utils_1.formatName.field(pgProcedure.name),
        createConnectionGqlField_1.default(buildToken, paginator, {
            description: pgProcedure.description,
            inputArgEntries,
            getPaginatorInput: (_source, args) => inputArgEntries.map(([argName, { type }]) => transformGqlInputValue_1.default(type, args[argName])),
        }),
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUGdQcm9jZWR1cmVRdWVyeUdxbEZpZWxkRW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvc2NoZW1hL3Byb2NlZHVyZXMvY3JlYXRlUGdQcm9jZWR1cmVRdWVyeUdxbEZpZWxkRW50cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsMEJBQTJGLFNBQzNGLENBQUMsQ0FEbUc7QUFDcEcsd0JBQXdDLHdCQUN4QyxDQUFDLENBRCtEO0FBRWhFLDJDQUFxQyw2REFDckMsQ0FBQyxDQURpRztBQUNsRyx5Q0FBbUMsZ0RBQ25DLENBQUMsQ0FEa0Y7QUFDbkYsd0JBQW9CLHlCQUNwQixDQUFDLENBRDRDO0FBRTdDLHNDQUFnQyxpREFDaEMsQ0FBQyxDQURnRjtBQUNqRiw0Q0FBc0MsdURBQ3RDLENBQUMsQ0FENEY7QUFDN0YsNENBQXNDLDZCQUN0QyxDQUFDLENBRGtFO0FBQ25FLDJDQUFxQyw0QkFDckMsQ0FBQyxDQURnRTtBQUNqRSx1Q0FBaUMsd0JBTWpDLENBQUMsQ0FOd0Q7QUFFekQ7OztHQUdHO0FBQ0gsNkNBQ0UsVUFBc0IsRUFDdEIsU0FBb0IsRUFDcEIsV0FBK0I7SUFFL0IsTUFBTSxDQUFDLENBQ0wsV0FBVyxDQUFDLFVBQVU7VUFDbEIsc0NBQXNDLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUM7VUFDMUUseUNBQXlDLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FDbEYsQ0FBQTtBQUNILENBQUM7QUFWRDtxREFVQyxDQUFBO0FBRUQ7OztHQUdHO0FBQ0gsbURBQ0UsVUFBc0IsRUFDdEIsU0FBb0IsRUFDcEIsV0FBK0I7SUFFL0IsTUFBTSxRQUFRLEdBQUcsbUNBQXlCLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQTtJQUU5RSx3RUFBd0U7SUFDeEUsYUFBYTtJQUNiLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUNsQyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUNoQixDQUFDLGtCQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3JCLGtCQUFrQjtZQUNsQixJQUFJLEVBQUUsV0FBVyxDQUFDLFFBQVEsR0FBRyxJQUFJLHdCQUFjLENBQUMseUJBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLE9BQU87U0FDcEYsQ0FBQyxDQUNMLENBQUE7SUFFRCxNQUFNLENBQUMsQ0FBQyxrQkFBVSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDMUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxXQUFXO1lBQ3BDLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU87WUFDN0IsSUFBSSxFQUFFLG1CQUFXLENBQUMsVUFBVSxDQUFDO1lBRXZCLE9BQU8sQ0FBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU87O29CQUNuQyxNQUFNLE1BQU0sR0FBRyw2QkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtvQkFDM0MsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsS0FBSyxnQ0FBc0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDbEcsTUFBTSxLQUFLLEdBQUcsV0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFHLENBQUMsS0FBSyxDQUFBLGtCQUFrQixrQ0FBd0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFBO29CQUMzRyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7b0JBQ2pELE1BQU0sQ0FBQyxHQUFHLEdBQUcsbUNBQXlCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFBO2dCQUNuRixDQUFDO2FBQUE7U0FDRixDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsZ0RBQ0UsVUFBc0IsRUFDdEIsU0FBb0IsRUFDcEIsV0FBK0I7SUFFL0IsTUFBTSxRQUFRLEdBQUcsbUNBQXlCLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQTtJQUM5RSxNQUFNLFNBQVMsR0FBRyxJQUFJLDhCQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBRXBELHdFQUF3RTtJQUN4RSxhQUFhO0lBQ2IsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQ3ZDLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQ2hCLENBQUMsa0JBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDckIsa0JBQWtCO1lBQ2xCLElBQUksRUFBRSxXQUFXLENBQUMsUUFBUSxHQUFHLElBQUksd0JBQWMsQ0FBQyx5QkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsT0FBTztTQUNwRixDQUFDLENBQ0wsQ0FBQTtJQUVELE1BQU0sQ0FBQztRQUNMLGtCQUFVLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFDbEMsa0NBQXdCLENBQTZCLFVBQVUsRUFBRSxTQUFTLEVBQUU7WUFDMUUsV0FBVyxFQUFFLFdBQVcsQ0FBQyxXQUFXO1lBQ3BDLGVBQWU7WUFDZixpQkFBaUIsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLEtBQy9CLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEtBQUssZ0NBQXNCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQzVGLENBQUM7S0FDSCxDQUFBO0FBQ0gsQ0FBQyJ9