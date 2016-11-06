"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const debugPgClient_1 = require('./debugPgClient');
const setupRequestPgClientTransaction_1 = require('./setupRequestPgClientTransaction');
const pgClientFromContext_1 = require('../../postgres/inventory/pgClientFromContext');
const graphql_1 = require('graphql');
function default_1(pgPool, options, jwtToken, gqlSchema, queryDocumentAst, variables, operationName) {
    return __awaiter(this, void 0, void 0, function* () {
        // Connect a new Postgres client and start a transaction.
        const pgClient = yield pgPool.connect();
        // Enhance our Postgres client with debugging stuffs.
        debugPgClient_1.default(pgClient);
        // Begin our transaction and set it up.
        yield pgClient.query('begin');
        let pgRole = yield setupRequestPgClientTransaction_1.default(jwtToken, pgClient, {
            jwtSecret: options.jwtSecret,
            pgDefaultRole: options.pgDefaultRole,
        });
        let result;
        try {
            result = yield graphql_1.execute(gqlSchema, queryDocumentAst, null, { [pgClientFromContext_1.$$pgClient]: pgClient }, variables, operationName);
        }
        finally {
            yield pgClient.query('commit');
            pgClient.release();
        }
        return { result, pgRole };
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0ZVF1ZXJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmFwaHFsL2h0dHAvZXhlY3V0ZVF1ZXJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGdDQUEwQixpQkFDMUIsQ0FBQyxDQUQwQztBQUMzQyxrREFBNEMsbUNBQzVDLENBQUMsQ0FEOEU7QUFDL0Usc0NBQTJCLDhDQUMzQixDQUFDLENBRHdFO0FBQ3pFLDBCQVFPLFNBRVAsQ0FBQyxDQUZlO0FBRWhCLG1CQUNFLE1BQU0sRUFDTixPQUFPLEVBQ1AsUUFBUSxFQUNSLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsU0FBUyxFQUNULGFBQWE7O1FBR2IseURBQXlEO1FBQ3pELE1BQU0sUUFBUSxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBRXZDLHFEQUFxRDtRQUNyRCx1QkFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRXZCLHVDQUF1QztRQUN2QyxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDN0IsSUFBSSxNQUFNLEdBQUcsTUFBTSx5Q0FBK0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO1lBQ3JFLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztZQUM1QixhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWE7U0FDckMsQ0FBQyxDQUFBO1FBRUYsSUFBSSxNQUFNLENBQUE7UUFDVixJQUFJLENBQUM7WUFDSCxNQUFNLEdBQUcsTUFBTSxpQkFBYyxDQUMzQixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLElBQUksRUFDSixFQUFFLENBQUMsZ0NBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUMxQixTQUFTLEVBQ1QsYUFBYSxDQUNkLENBQUE7UUFDSCxDQUFDO2dCQUdPLENBQUM7WUFDUCxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDOUIsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO1FBRXBCLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDLENBQUE7SUFDekIsQ0FBQzs7QUExQ0Q7MkJBMENDLENBQUEifQ==