"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const path_1 = require('path');
const fs_1 = require('fs');
const graphql_1 = require('graphql');
const withPgClient_1 = require('../../postgres/__tests__/fixtures/withPgClient');
const pgClientFromContext_1 = require('../../postgres/inventory/pgClientFromContext');
const createPostGraphQLSchema_1 = require('../schema/createPostGraphQLSchema');
// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;
const kitchenSinkData = new Promise((resolve, reject) => {
    fs_1.readFile('examples/kitchen-sink/data.sql', (error, data) => {
        if (error)
            reject(error);
        else
            resolve(data.toString().replace(/begin;|commit;/g, ''));
    });
});
const queriesDir = path_1.resolve(__dirname, 'fixtures/queries');
for (const file of fs_1.readdirSync(queriesDir)) {
    test(`operation ${file}`, withPgClient_1.default((pgClient) => __awaiter(this, void 0, void 0, function* () {
        const gqlSchema = yield createPostGraphQLSchema_1.default(pgClient, ['a', 'b', 'c'], {
            classicIds: file === 'classic-ids.graphql',
            dynamicJson: file === 'dynamic-json.graphql',
        });
        const query = yield new Promise((resolve, reject) => {
            fs_1.readFile(path_1.resolve(queriesDir, file), (error, data) => {
                if (error)
                    reject(error);
                else
                    resolve(data.toString());
            });
        });
        yield pgClient.query(yield kitchenSinkData);
        const result = yield graphql_1.graphql(gqlSchema, query, null, { [pgClientFromContext_1.$$pgClient]: pgClient });
        expect(result).toMatchSnapshot();
    })));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGdyYXBocWxJbnRlZ3JhdGlvbk9wZXJhdGlvbnMtdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9fX3Rlc3RzX18vcG9zdGdyYXBocWxJbnRlZ3JhdGlvbk9wZXJhdGlvbnMtdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSx1QkFBdUMsTUFDdkMsQ0FBQyxDQUQ0QztBQUM3QyxxQkFBc0MsSUFDdEMsQ0FBQyxDQUR5QztBQUMxQywwQkFBd0IsU0FDeEIsQ0FBQyxDQURnQztBQUNqQywrQkFBeUIsZ0RBQ3pCLENBQUMsQ0FEd0U7QUFDekUsc0NBQTJCLDhDQUMzQixDQUFDLENBRHdFO0FBQ3pFLDBDQUFvQyxtQ0FHcEMsQ0FBQyxDQUhzRTtBQUV2RSx1REFBdUQ7QUFDdkQsT0FBTyxDQUFDLHdCQUF3QixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFFNUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtJQUNsRCxhQUFRLENBQUMsZ0NBQWdDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSTtRQUNyRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEIsSUFBSTtZQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDOUQsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLE1BQU0sVUFBVSxHQUFHLGNBQVcsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLENBQUMsQ0FBQTtBQUU3RCxHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxnQkFBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzQyxJQUFJLENBQUMsYUFBYSxJQUFJLEVBQUUsRUFBRSxzQkFBWSxDQUFDLENBQU0sUUFBUTtRQUNuRCxNQUFNLFNBQVMsR0FBRyxNQUFNLGlDQUF1QixDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDekUsVUFBVSxFQUFFLElBQUksS0FBSyxxQkFBcUI7WUFDMUMsV0FBVyxFQUFFLElBQUksS0FBSyxzQkFBc0I7U0FDN0MsQ0FBQyxDQUFBO1FBRUYsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQzlDLGFBQVEsQ0FBQyxjQUFXLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUk7Z0JBQ2xELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQ3hCLElBQUk7b0JBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQy9CLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxlQUFlLENBQUMsQ0FBQTtRQUUzQyxNQUFNLE1BQU0sR0FBRyxNQUFNLGlCQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLGdDQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBRWhGLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtJQUNsQyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDIn0=