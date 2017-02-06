"use strict";
var _this = this;
var tslib_1 = require("tslib");
var path_1 = require("path");
var fs_1 = require("fs");
var graphql_1 = require("graphql");
var withPgClient_1 = require("../../postgres/__tests__/fixtures/withPgClient");
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
var _loop_1 = function (file) {
    test("operation " + file, withPgClient_1.default(function (pgClient) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var gqlSchema, query, _a, _b, _c, result, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, createPostGraphQLSchema_1.default(pgClient, ['a', 'b', 'c'], {
                        classicIds: file === 'classic-ids.graphql',
                        dynamicJson: file === 'dynamic-json.graphql',
                    })];
                case 1:
                    gqlSchema = _e.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            fs_1.readFile(path_1.resolve(queriesDir, file), function (error, data) {
                                if (error)
                                    reject(error);
                                else
                                    resolve(data.toString());
                            });
                        })];
                case 2:
                    query = _e.sent();
                    _b = (_a = pgClient).query;
                    return [4 /*yield*/, kitchenSinkData];
                case 3: return [4 /*yield*/, _b.apply(_a, [_e.sent()])];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, graphql_1.graphql(gqlSchema, query, null, (_d = {}, _d[pgClientFromContext_1.$$pgClient] = pgClient, _d))];
                case 5:
                    result = _e.sent();
                    expect(result).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); }));
};
for (var _i = 0, _a = fs_1.readdirSync(queriesDir); _i < _a.length; _i++) {
    var file = _a[_i];
    _loop_1(file);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGdyYXBocWxJbnRlZ3JhdGlvbk9wZXJhdGlvbnMtdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9fX3Rlc3RzX18vcG9zdGdyYXBocWxJbnRlZ3JhdGlvbk9wZXJhdGlvbnMtdGVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUJBd0NBOztBQXhDQSw2QkFBNkM7QUFDN0MseUJBQTBDO0FBQzFDLG1DQUFpQztBQUNqQywrRUFBeUU7QUFDekUsb0ZBQXlFO0FBQ3pFLDZFQUF1RTtBQUV2RSx1REFBdUQ7QUFDdkQsT0FBTyxDQUFDLHdCQUF3QixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFFNUMsSUFBTSxlQUFlLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtJQUNsRCxhQUFRLENBQUMsZ0NBQWdDLEVBQUUsVUFBQyxLQUFLLEVBQUUsSUFBSTtRQUNyRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEIsSUFBSTtZQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDOUQsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTtBQUVGLElBQU0sVUFBVSxHQUFHLGNBQVcsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLENBQUMsQ0FBQTt3QkFFbEQsSUFBSTtJQUNiLElBQUksQ0FBQyxlQUFhLElBQU0sRUFBRSxzQkFBWSxDQUFDLFVBQU0sUUFBUTs7Ozt3QkFDakMscUJBQU0saUNBQXVCLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRTt3QkFDekUsVUFBVSxFQUFFLElBQUksS0FBSyxxQkFBcUI7d0JBQzFDLFdBQVcsRUFBRSxJQUFJLEtBQUssc0JBQXNCO3FCQUM3QyxDQUFDLEVBQUE7O2dDQUhnQixTQUdoQjtvQkFFWSxxQkFBTSxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNOzRCQUM5QyxhQUFRLENBQUMsY0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsRUFBRSxVQUFDLEtBQUssRUFBRSxJQUFJO2dDQUNsRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7b0NBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO2dDQUN4QixJQUFJO29DQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTs0QkFDL0IsQ0FBQyxDQUFDLENBQUE7d0JBQ0osQ0FBQyxDQUFDLEVBQUE7OzRCQUxZLFNBS1o7b0JBRUksS0FBQSxDQUFBLEtBQUEsUUFBUSxDQUFBLENBQUMsS0FBSyxDQUFBO29CQUFDLHFCQUFNLGVBQWUsRUFBQTt3QkFBMUMscUJBQU0sY0FBZSxTQUFxQixFQUFDLEVBQUE7O29CQUEzQyxTQUEyQyxDQUFBO29CQUU1QixxQkFBTSxpQkFBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsSUFBSSxZQUFJLEdBQUMsZ0NBQVUsSUFBRyxRQUFRLE1BQUcsRUFBQTs7NkJBQWpFLFNBQWlFO29CQUVoRixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUE7Ozs7U0FDakMsQ0FBQyxDQUFDLENBQUE7QUFDTCxDQUFDO0FBcEJELEdBQUcsQ0FBQyxDQUFlLFVBQXVCLEVBQXZCLEtBQUEsZ0JBQVcsQ0FBQyxVQUFVLENBQUMsRUFBdkIsY0FBdUIsRUFBdkIsSUFBdUI7SUFBckMsSUFBTSxJQUFJLFNBQUE7WUFBSixJQUFJO0NBb0JkIn0=