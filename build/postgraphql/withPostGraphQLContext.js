"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const pgClientFromContext_1 = require('../postgres/inventory/pgClientFromContext');
const debugPgClient_1 = require('./http/debugPgClient');
const setupPgClientTransaction_1 = require('./setupPgClientTransaction');
/*

This is intended to be called like:

    const result = await withPostGraphQLContext(options, { pgPool, jwtToken }, async context => (
      await graphql(
        schema,
        query,
        null,
        {  ...context },
        variables,
        operationName,
      )
    ))

*/
function withPostGraphQLContext(options, { pgPool, jwtToken }, functionToRun) {
    return __awaiter(this, void 0, void 0, function* () {
        // Connect a new Postgres client and start a transaction.
        const pgClient = yield pgPool.connect();
        // Enhance our Postgres client with debugging stuffs.
        debugPgClient_1.default(pgClient);
        // Begin our transaction and set it up.
        yield pgClient.query('begin');
        yield setupPgClientTransaction_1.default(jwtToken, pgClient, options);
        // Run the function with a context object that can be passed through
        try {
            return yield functionToRun({
                [pgClientFromContext_1.$$pgClient]: pgClient,
            });
        }
        finally {
            yield pgClient.query('commit');
            pgClient.release();
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = withPostGraphQLContext;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l0aFBvc3RHcmFwaFFMQ29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wb3N0Z3JhcGhxbC93aXRoUG9zdEdyYXBoUUxDb250ZXh0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHNDQUEyQiwyQ0FDM0IsQ0FBQyxDQURxRTtBQUN0RSxnQ0FBMEIsc0JBQzFCLENBQUMsQ0FEK0M7QUFDaEQsMkNBQXFDLDRCQW1CckMsQ0FBQyxDQW5CZ0U7QUFFakU7Ozs7Ozs7Ozs7Ozs7OztFQWVFO0FBRUYsZ0NBQXFELE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsRUFBRSxhQUFhOztRQUM3Rix5REFBeUQ7UUFDekQsTUFBTSxRQUFRLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7UUFFdkMscURBQXFEO1FBQ3JELHVCQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7UUFFdkIsdUNBQXVDO1FBQ3ZDLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUM3QixNQUFNLGtDQUF3QixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFFM0Qsb0VBQW9FO1FBQ3BFLElBQUksQ0FBQztZQUNILE1BQU0sQ0FBQyxNQUFNLGFBQWEsQ0FBQztnQkFDekIsQ0FBQyxnQ0FBVSxDQUFDLEVBQUUsUUFBUTthQUN2QixDQUFDLENBQUE7UUFDSixDQUFDO2dCQUdPLENBQUM7WUFDUCxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDOUIsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBQ3BCLENBQUM7SUFDSCxDQUFDOztBQXZCRDt3Q0F1QkMsQ0FBQTtBQUFBLENBQUMifQ==