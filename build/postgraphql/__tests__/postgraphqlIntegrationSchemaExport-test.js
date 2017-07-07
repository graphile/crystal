"use strict";
var _this = this;
var tslib_1 = require("tslib");
jest.mock('fs');
var withPgClient_1 = require("../../__tests__/utils/withPgClient");
var createPostGraphQLSchema_1 = require("../schema/createPostGraphQLSchema");
var exportPostGraphQLSchema_1 = require("../schema/exportPostGraphQLSchema");
var fs_1 = require("fs");
// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;
var gqlSchemaPromise = withPgClient_1.default(function (pgClient) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, createPostGraphQLSchema_1.default(pgClient, ['a', 'b', 'c'])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); })();
test('exports a schema as JSON', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var gqlSchema;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fs_1.writeFile.mockClear();
                return [4 /*yield*/, gqlSchemaPromise];
            case 1:
                gqlSchema = _a.sent();
                return [4 /*yield*/, exportPostGraphQLSchema_1.default(gqlSchema, { exportJsonSchemaPath: '/schema.json' })];
            case 2:
                _a.sent();
                expect(fs_1.writeFile.mock.calls.length).toBe(1);
                expect(fs_1.writeFile.mock.calls[0][0]).toBe('/schema.json');
                expect(fs_1.writeFile.mock.calls[0][1]).toMatchSnapshot();
                return [2 /*return*/];
        }
    });
}); });
test('exports a schema as GQL', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var gqlSchema;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fs_1.writeFile.mockClear();
                return [4 /*yield*/, gqlSchemaPromise];
            case 1:
                gqlSchema = _a.sent();
                return [4 /*yield*/, exportPostGraphQLSchema_1.default(gqlSchema, { exportGqlSchemaPath: '/schema.gql' })];
            case 2:
                _a.sent();
                expect(fs_1.writeFile.mock.calls.length).toBe(1);
                expect(fs_1.writeFile.mock.calls[0][0]).toBe('/schema.gql');
                expect(fs_1.writeFile.mock.calls[0][1]).toMatchSnapshot();
                return [2 /*return*/];
        }
    });
}); });
test('does not export a schema when not enabled', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var gqlSchema;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fs_1.writeFile.mockClear();
                return [4 /*yield*/, gqlSchemaPromise];
            case 1:
                gqlSchema = _a.sent();
                return [4 /*yield*/, exportPostGraphQLSchema_1.default(gqlSchema)];
            case 2:
                _a.sent();
                expect(fs_1.writeFile.mock.calls.length).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGdyYXBocWxJbnRlZ3JhdGlvblNjaGVtYUV4cG9ydC10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmFwaHFsL19fdGVzdHNfXy9wb3N0Z3JhcGhxbEludGVncmF0aW9uU2NoZW1hRXhwb3J0LXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlCQXNDQTs7QUF0Q0EsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUVmLG1FQUE2RDtBQUM3RCw2RUFBdUU7QUFDdkUsNkVBQXVFO0FBQ3ZFLHlCQUE4QjtBQUU5Qix1REFBdUQ7QUFDdkQsT0FBTyxDQUFDLHdCQUF3QixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFFNUMsSUFBTSxnQkFBZ0IsR0FBRyxzQkFBWSxDQUFDLFVBQU0sUUFBUTs7O29CQUMzQyxxQkFBTSxpQ0FBdUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUE7b0JBQS9ELHNCQUFPLFNBQXdELEVBQUE7OztLQUNoRSxDQUFDLEVBQUUsQ0FBQTtBQUVKLElBQUksQ0FBQywwQkFBMEIsRUFBRTs7Ozs7Z0JBQy9CLGNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtnQkFDSCxxQkFBTSxnQkFBZ0IsRUFBQTs7NEJBQXRCLFNBQXNCO2dCQUN4QyxxQkFBTSxpQ0FBdUIsQ0FBQyxTQUFTLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSxjQUFjLEVBQUUsQ0FBQyxFQUFBOztnQkFBbEYsU0FBa0YsQ0FBQTtnQkFDbEYsTUFBTSxDQUFDLGNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDM0MsTUFBTSxDQUFDLGNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO2dCQUN2RCxNQUFNLENBQUMsY0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTs7OztLQUNyRCxDQUFDLENBQUE7QUFFRixJQUFJLENBQUMseUJBQXlCLEVBQUU7Ozs7O2dCQUM5QixjQUFTLENBQUMsU0FBUyxFQUFFLENBQUE7Z0JBQ0gscUJBQU0sZ0JBQWdCLEVBQUE7OzRCQUF0QixTQUFzQjtnQkFDeEMscUJBQU0saUNBQXVCLENBQUMsU0FBUyxFQUFFLEVBQUUsbUJBQW1CLEVBQUUsYUFBYSxFQUFFLENBQUMsRUFBQTs7Z0JBQWhGLFNBQWdGLENBQUE7Z0JBQ2hGLE1BQU0sQ0FBQyxjQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBQzNDLE1BQU0sQ0FBQyxjQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtnQkFDdEQsTUFBTSxDQUFDLGNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUE7Ozs7S0FDckQsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLDJDQUEyQyxFQUFFOzs7OztnQkFDaEQsY0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFBO2dCQUNILHFCQUFNLGdCQUFnQixFQUFBOzs0QkFBdEIsU0FBc0I7Z0JBQ3hDLHFCQUFNLGlDQUF1QixDQUFDLFNBQVMsQ0FBQyxFQUFBOztnQkFBeEMsU0FBd0MsQ0FBQTtnQkFDeEMsTUFBTSxDQUFDLGNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTs7OztLQUM1QyxDQUFDLENBQUEifQ==