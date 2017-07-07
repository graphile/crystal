"use strict";
var _this = this;
var tslib_1 = require("tslib");
var path_1 = require("path");
var fs_1 = require("fs");
var graphql_1 = require("graphql");
var withPgClient_1 = require("../../__tests__/utils/withPgClient");
var pgClientFromContext_1 = require("../../postgres/inventory/pgClientFromContext");
var createPostGraphQLSchema_1 = require("../schema/createPostGraphQLSchema");
// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;
var kitchenSinkData = new Promise(function (resolve, reject) {
    fs_1.readFile('examples/kitchen-sink/data.sql', function (error, data) {
        if (error)
            reject(error);
        else
            resolve(data.toString().replace(/begin;|commit;/g, ''));
    });
});
var mutationsDir = path_1.resolve(__dirname, 'fixtures/mutations');
var mutationFileNames = fs_1.readdirSync(mutationsDir);
var mutationResults = [];
beforeAll(function () {
    // Get a GraphQL schema instance that we can query.
    var gqlSchemaPromise = withPgClient_1.default(function (pgClient) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, createPostGraphQLSchema_1.default(pgClient, ['a', 'b', 'c'])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); })();
    // Execute all of the mutations in parallel. We will not wait for them to
    // resolve or reject. The tests will do that.
    //
    // All of our mutations get there own Postgres client instance. Queries share
    // a client instance.
    mutationResults = mutationFileNames.map(function (fileName) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _this = this;
        var gqlSchema;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, gqlSchemaPromise];
                case 1:
                    gqlSchema = _a.sent();
                    return [4 /*yield*/, withPgClient_1.default(function (pgClient) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var mutation, _a, _b, _c, _d;
                            return tslib_1.__generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                            fs_1.readFile(path_1.resolve(mutationsDir, fileName), 'utf8', function (error, data) {
                                                if (error)
                                                    reject(error);
                                                else
                                                    resolve(data);
                                            });
                                        })];
                                    case 1:
                                        mutation = _e.sent();
                                        _b = (_a = pgClient).query;
                                        return [4 /*yield*/, kitchenSinkData];
                                    case 2: 
                                    // Add data to the client instance we are using.
                                    return [4 /*yield*/, _b.apply(_a, [_e.sent()])];
                                    case 3:
                                        // Add data to the client instance we are using.
                                        _e.sent();
                                        return [4 /*yield*/, graphql_1.graphql(gqlSchema, mutation, null, (_d = {}, _d[pgClientFromContext_1.$$pgClient] = pgClient, _d))];
                                    case 4: 
                                    // Return the result of our GraphQL query.
                                    return [2 /*return*/, _e.sent()];
                                }
                            });
                        }); })()];
                case 2: 
                // Get a new Postgres client and run the mutation.
                return [2 /*return*/, _a.sent()];
            }
        });
    }); });
});
var _loop_1 = function (i) {
    test(mutationFileNames[i], function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, mutationResults[i]];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
};
for (var i = 0; i < mutationFileNames.length; i++) {
    _loop_1(i);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGdyYXBocWxJbnRlZ3JhdGlvbk11dGF0aW9ucy10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmFwaHFsL19fdGVzdHNfXy9wb3N0Z3JhcGhxbEludGVncmF0aW9uTXV0YXRpb25zLXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlCQTREQTs7QUE1REEsNkJBQTZDO0FBQzdDLHlCQUEwQztBQUMxQyxtQ0FBaUM7QUFDakMsbUVBQTZEO0FBQzdELG9GQUF5RTtBQUN6RSw2RUFBdUU7QUFFdkUsdURBQXVEO0FBQ3ZELE9BQU8sQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBRTVDLElBQU0sZUFBZSxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07SUFDbEQsYUFBUSxDQUFDLGdDQUFnQyxFQUFFLFVBQUMsS0FBSyxFQUFFLElBQUk7UUFDckQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3hCLElBQUk7WUFBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQzlELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRixJQUFNLFlBQVksR0FBRyxjQUFXLENBQUMsU0FBUyxFQUFFLG9CQUFvQixDQUFDLENBQUE7QUFDakUsSUFBTSxpQkFBaUIsR0FBRyxnQkFBVyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ25ELElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQTtBQUV4QixTQUFTLENBQUM7SUFDUixtREFBbUQ7SUFDbkQsSUFBTSxnQkFBZ0IsR0FBRyxzQkFBWSxDQUFDLFVBQU0sUUFBUTs7O3dCQUMzQyxxQkFBTSxpQ0FBdUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUE7d0JBQS9ELHNCQUFPLFNBQXdELEVBQUE7OztTQUNoRSxDQUFDLEVBQUUsQ0FBQTtJQUVKLHlFQUF5RTtJQUN6RSw2Q0FBNkM7SUFDN0MsRUFBRTtJQUNGLDZFQUE2RTtJQUM3RSxxQkFBcUI7SUFDckIsZUFBZSxHQUFHLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFNLFFBQVE7Ozs7O3dCQUdwQyxxQkFBTSxnQkFBZ0IsRUFBQTs7Z0NBQXRCLFNBQXNCO29CQUUvQixxQkFBTSxzQkFBWSxDQUFDLFVBQU0sUUFBUTs7Ozs0Q0FFckIscUJBQU0sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTs0Q0FDakQsYUFBUSxDQUFDLGNBQVcsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFFLElBQUk7Z0RBQ2hFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztvREFBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7Z0RBQ3hCLElBQUk7b0RBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBOzRDQUNwQixDQUFDLENBQUMsQ0FBQTt3Q0FDSixDQUFDLENBQUMsRUFBQTs7bURBTGUsU0FLZjt3Q0FHSSxLQUFBLENBQUEsS0FBQSxRQUFRLENBQUEsQ0FBQyxLQUFLLENBQUE7d0NBQUMscUJBQU0sZUFBZSxFQUFBOztvQ0FEMUMsZ0RBQWdEO29DQUNoRCxxQkFBTSxjQUFlLFNBQXFCLEVBQUMsRUFBQTs7d0NBRDNDLGdEQUFnRDt3Q0FDaEQsU0FBMkMsQ0FBQTt3Q0FHcEMscUJBQU0saUJBQU8sQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLElBQUksWUFBSSxHQUFDLGdDQUFVLElBQUcsUUFBUSxNQUFHLEVBQUE7O29DQUQzRSwwQ0FBMEM7b0NBQzFDLHNCQUFPLFNBQW9FLEVBQUE7Ozs2QkFDNUUsQ0FBQyxFQUFFLEVBQUE7O2dCQWZKLGtEQUFrRDtnQkFDbEQsc0JBQU8sU0FjSCxFQUFBOzs7U0FDTCxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTt3QkFFTyxDQUFDO0lBQ1IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFOzs7OztvQkFDekIsS0FBQSxNQUFNLENBQUE7b0JBQUMscUJBQU0sZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFBOztvQkFBL0Isa0JBQU8sU0FBd0IsRUFBQyxDQUFDLGVBQWUsRUFBRSxDQUFBOzs7O1NBQ25ELENBQUMsQ0FBQTtBQUNKLENBQUM7QUFKRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7WUFBeEMsQ0FBQztDQUlUIn0=