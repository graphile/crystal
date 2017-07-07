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
var queriesDir = path_1.resolve(__dirname, 'fixtures/queries');
var queryFileNames = fs_1.readdirSync(queriesDir);
var queryResults = [];
beforeAll(function () {
    // Get a few GraphQL schema instance that we can query.
    var gqlSchemasPromise = withPgClient_1.default(function (pgClient) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, normal, classicIds, dynamicJson;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        createPostGraphQLSchema_1.default(pgClient, ['a', 'b', 'c']),
                        createPostGraphQLSchema_1.default(pgClient, ['a', 'b', 'c'], { classicIds: true }),
                        createPostGraphQLSchema_1.default(pgClient, ['a', 'b', 'c'], { dynamicJson: true }),
                    ])];
                case 1:
                    _a = _b.sent(), normal = _a[0], classicIds = _a[1], dynamicJson = _a[2];
                    return [2 /*return*/, {
                            normal: normal,
                            classicIds: classicIds,
                            dynamicJson: dynamicJson,
                        }];
            }
        });
    }); })();
    // Execute all of the queries in parallel. We will not wait for them to
    // resolve or reject. The tests will do that.
    //
    // All of our queries share a single client instance.
    var queryResultsPromise = (function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _this = this;
        var gqlSchemas;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, gqlSchemasPromise];
                case 1:
                    gqlSchemas = _a.sent();
                    return [4 /*yield*/, withPgClient_1.default(function (pgClient) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            var _a, _b, _c;
                            return tslib_1.__generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _b = (_a = pgClient).query;
                                        return [4 /*yield*/, kitchenSinkData];
                                    case 1: 
                                    // Add data to the client instance we are using.
                                    return [4 /*yield*/, _b.apply(_a, [_d.sent()])];
                                    case 2:
                                        // Add data to the client instance we are using.
                                        _d.sent();
                                        return [4 /*yield*/, Promise.all(queryFileNames.map(function (fileName) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                var query, gqlSchema, _a;
                                                return tslib_1.__generator(this, function (_b) {
                                                    switch (_b.label) {
                                                        case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                                fs_1.readFile(path_1.resolve(queriesDir, fileName), 'utf8', function (error, data) {
                                                                    if (error)
                                                                        reject(error);
                                                                    else
                                                                        resolve(data);
                                                                });
                                                            })];
                                                        case 1:
                                                            query = _b.sent();
                                                            gqlSchema = fileName === 'classic-ids.graphql' ? gqlSchemas.classicIds :
                                                                fileName === 'dynamic-json.graphql' ? gqlSchemas.dynamicJson :
                                                                    gqlSchemas.normal;
                                                            return [4 /*yield*/, graphql_1.graphql(gqlSchema, query, null, (_a = {}, _a[pgClientFromContext_1.$$pgClient] = pgClient, _a))];
                                                        case 2: 
                                                        // Return the result of our GraphQL query.
                                                        return [2 /*return*/, _b.sent()];
                                                    }
                                                });
                                            }); }))];
                                    case 3: 
                                    // Run all of our queries in parallel.
                                    return [2 /*return*/, _d.sent()];
                                }
                            });
                        }); })()];
                case 2: 
                // Get a new Postgres client instance.
                return [2 /*return*/, _a.sent()];
            }
        });
    }); })();
    // Flatten out the query results promise.
    queryResults = queryFileNames.map(function (_, i) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryResultsPromise];
                case 1: return [4 /*yield*/, (_a.sent())[i]];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); });
});
var _loop_1 = function (i) {
    test(queryFileNames[i], function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, queryResults[i]];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
};
for (var i = 0; i < queryFileNames.length; i++) {
    _loop_1(i);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGdyYXBocWxJbnRlZ3JhdGlvblF1ZXJpZXMtdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9fX3Rlc3RzX18vcG9zdGdyYXBocWxJbnRlZ3JhdGlvblF1ZXJpZXMtdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUJBd0ZBOztBQXhGQSw2QkFBNkM7QUFDN0MseUJBQTBDO0FBQzFDLG1DQUFpQztBQUNqQyxtRUFBNkQ7QUFDN0Qsb0ZBQXlFO0FBQ3pFLDZFQUF1RTtBQUV2RSx1REFBdUQ7QUFDdkQsT0FBTyxDQUFDLHdCQUF3QixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFFNUMsSUFBTSxlQUFlLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtJQUNsRCxhQUFRLENBQUMsZ0NBQWdDLEVBQUUsVUFBQyxLQUFLLEVBQUUsSUFBSTtRQUNyRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEIsSUFBSTtZQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDOUQsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLElBQU0sVUFBVSxHQUFHLGNBQVcsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLENBQUMsQ0FBQTtBQUM3RCxJQUFNLGNBQWMsR0FBRyxnQkFBVyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzlDLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQTtBQUVyQixTQUFTLENBQUM7SUFDUix1REFBdUQ7SUFDdkQsSUFBTSxpQkFBaUIsR0FBRyxzQkFBWSxDQUFDLFVBQU0sUUFBUTs7Ozt3QkFRL0MscUJBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQzt3QkFDcEIsaUNBQXVCLENBQUMs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