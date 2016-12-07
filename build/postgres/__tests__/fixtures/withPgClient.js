"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const pgPool_1 = require('./pgPool');
const kitchenSinkSchemaSql_1 = require('./kitchenSinkSchemaSql');
/**
 * Takes a function implementation of a test, and provides it a Postgres
 * client. The client will be connected from the pool at the start of the test,
 * and released back at the end. All changes will be rolled back.
 */
function withPgClient(fn) {
    return () => __awaiter(this, void 0, void 0, function* () {
        // Connect a client from our pool and begin a transaction.
        const client = yield pgPool_1.default.connect();
        // There’s some wierd behavior with the `pg` module here where an error
        // is resolved correctly.
        //
        // @see https://github.com/brianc/node-postgres/issues/1142
        if (client['errno'])
            throw client;
        yield client.query('begin');
        yield client.query('set local timezone to \'+04:00\'');
        // Run our kichen sink schema Sql, if there is an error we should report it
        try {
            yield client.query(yield kitchenSinkSchemaSql_1.default);
        }
        catch (error) {
            // tslint:disable-next-line no-console
            console.error(error.stack || error);
            throw error;
        }
        // Mock the query function.
        client.query = jest.fn(client.query);
        // Try to run our test, if it fails we still want to cleanup the client.
        try {
            yield fn(client);
        }
        finally {
            yield client.query('rollback');
            client.release();
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = withPgClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l0aFBnQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL19fdGVzdHNfXy9maXh0dXJlcy93aXRoUGdDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EseUJBQW1CLFVBQ25CLENBQUMsQ0FENEI7QUFDN0IsdUNBQWlDLHdCQU9qQyxDQUFDLENBUHdEO0FBRXpEOzs7O0dBSUc7QUFDSCxzQkFBc0MsRUFBNEM7SUFDaEYsTUFBTSxDQUFDO1FBQ0wsMERBQTBEO1FBQzFELE1BQU0sTUFBTSxHQUFHLE1BQU0sZ0JBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUVyQyx1RUFBdUU7UUFDdkUseUJBQXlCO1FBQ3pCLEVBQUU7UUFDRiwyREFBMkQ7UUFDM0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sTUFBTSxDQUFBO1FBRWQsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzNCLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO1FBRXRELDJFQUEyRTtRQUMzRSxJQUFJLENBQUM7WUFDSCxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSw4QkFBb0IsQ0FBQyxDQUFBO1FBQ2hELENBQ0E7UUFBQSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2Isc0NBQXNDO1lBQ3RDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQTtZQUNuQyxNQUFNLEtBQUssQ0FBQTtRQUNiLENBQUM7UUFFRCwyQkFBMkI7UUFDM0IsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUVwQyx3RUFBd0U7UUFDeEUsSUFBSSxDQUFDO1lBQ0gsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbEIsQ0FBQztnQkFHTyxDQUFDO1lBQ1AsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQzlCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtRQUNsQixDQUFDO0lBQ0gsQ0FBQyxDQUFBLENBQUE7QUFDSCxDQUFDO0FBdkNEOzhCQXVDQyxDQUFBIn0=