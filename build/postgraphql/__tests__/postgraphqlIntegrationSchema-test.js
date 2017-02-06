// TODO: There may be some excessive waste, if we could somehow filter what
// these guys see, that would be great 👍
"use strict";
var _this = this;
var tslib_1 = require("tslib");
var graphql_1 = require("graphql");
var withPgClient_1 = require("../../postgres/__tests__/fixtures/withPgClient");
var createPostGraphQLSchema_1 = require("../schema/createPostGraphQLSchema");
// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;
test('prints a schema with the default options', withPgClient_1.default(function (pgClient) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var gqlSchema;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createPostGraphQLSchema_1.default(pgClient, ['a', 'b', 'c'])];
            case 1:
                gqlSchema = _a.sent();
                expect(graphql_1.printSchema(gqlSchema)).toMatchSnapshot();
                return [2 /*return*/];
        }
    });
}); }));
test('prints a schema with Relay 1 style ids', withPgClient_1.default(function (pgClient) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var gqlSchema;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createPostGraphQLSchema_1.default(pgClient, 'c', { classicIds: true })];
            case 1:
                gqlSchema = _a.sent();
                expect(graphql_1.printSchema(gqlSchema)).toMatchSnapshot();
                return [2 /*return*/];
        }
    });
}); }));
test('prints a schema with a JWT generating mutation', withPgClient_1.default(function (pgClient) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var gqlSchema;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createPostGraphQLSchema_1.default(pgClient, 'b', { jwtSecret: 'secret', jwtPgTypeIdentifier: 'b.jwt_token' })];
            case 1:
                gqlSchema = _a.sent();
                expect(graphql_1.printSchema(gqlSchema)).toMatchSnapshot();
                return [2 /*return*/];
        }
    });
}); }));
test('prints a schema without default mutations', withPgClient_1.default(function (pgClient) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var gqlSchema;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createPostGraphQLSchema_1.default(pgClient, 'c', { disableDefaultMutations: true })];
            case 1:
                gqlSchema = _a.sent();
                expect(graphql_1.printSchema(gqlSchema)).toMatchSnapshot();
                return [2 /*return*/];
        }
    });
}); }));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGdyYXBocWxJbnRlZ3JhdGlvblNjaGVtYS10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmFwaHFsL19fdGVzdHNfXy9wb3N0Z3JhcGhxbEludGVncmF0aW9uU2NoZW1hLXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkVBQTJFO0FBQzNFLHlDQUF5Qzs7QUFFekMsaUJBMEJBOztBQTFCQSxtQ0FBcUM7QUFDckMsK0VBQXlFO0FBQ3pFLDZFQUF1RTtBQUV2RSx1REFBdUQ7QUFDdkQsT0FBTyxDQUFDLHdCQUF3QixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFFNUMsSUFBSSxDQUFDLDBDQUEwQyxFQUFFLHNCQUFZLENBQUMsVUFBTSxRQUFROzs7O29CQUN4RCxxQkFBTSxpQ0FBdUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUE7OzRCQUF4RCxTQUF3RDtnQkFDMUUsTUFBTSxDQUFDLHFCQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTs7OztLQUNqRCxDQUFDLENBQUMsQ0FBQTtBQUVILElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxzQkFBWSxDQUFDLFVBQU0sUUFBUTs7OztvQkFDdEQscUJBQU0saUNBQXVCLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFBOzs0QkFBbEUsU0FBa0U7Z0JBQ3BGLE1BQU0sQ0FBQyxxQkFBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUE7Ozs7S0FDakQsQ0FBQyxDQUFDLENBQUE7QUFFSCxJQUFJLENBQUMsZ0RBQWdELEVBQUUsc0JBQVksQ0FBQyxVQUFNLFFBQVE7Ozs7b0JBQzlELHFCQUFNLGlDQUF1QixDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQUE7OzRCQUF6RyxTQUF5RztnQkFDM0gsTUFBTSxDQUFDLHFCQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTs7OztLQUNqRCxDQUFDLENBQUMsQ0FBQTtBQUVILElBQUksQ0FBQywyQ0FBMkMsRUFBRSxzQkFBWSxDQUFDLFVBQU0sUUFBUTs7OztvQkFDekQscUJBQU0saUNBQXVCLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxFQUFFLHVCQUF1QixFQUFFLElBQUksRUFBRSxDQUFDLEVBQUE7OzRCQUEvRSxTQUErRTtnQkFDakcsTUFBTSxDQUFDLHFCQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTs7OztLQUNqRCxDQUFDLENBQUMsQ0FBQSJ9