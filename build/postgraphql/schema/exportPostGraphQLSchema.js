"use strict";
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var graphql_1 = require("graphql");
var utilities_1 = require("graphql/utilities");
function writeFileAsync(path, contents) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        fs_1.writeFile(path, contents, function (error) {
                            if (error)
                                reject(error);
                            else
                                resolve();
                        });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Exports a PostGraphQL schema by looking at a Postgres client.
 */
function exportPostGraphQLSchema(schema, options) {
    if (options === void 0) { options = {}; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof options.exportJsonSchemaPath === 'string')) return [3 /*break*/, 3];
                    return [4 /*yield*/, graphql_1.graphql(schema, utilities_1.introspectionQuery)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, writeFileAsync(options.exportJsonSchemaPath, JSON.stringify(result, null, 2))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (!(typeof options.exportGqlSchemaPath === 'string')) return [3 /*break*/, 5];
                    return [4 /*yield*/, writeFileAsync(options.exportGqlSchemaPath, utilities_1.printSchema(schema))];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exportPostGraphQLSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0UG9zdEdyYXBoUUxTY2hlbWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvc2NoZW1hL2V4cG9ydFBvc3RHcmFwaFFMU2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQThCO0FBQzlCLG1DQUFnRDtBQUNoRCwrQ0FBbUU7QUFFbkUsd0JBQ0UsSUFBWSxFQUNaLFFBQWdCOzs7O3dCQUVoQixxQkFBTSxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO3dCQUNoQyxjQUFTLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxVQUFBLEtBQUs7NEJBQzdCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7NEJBQ3hCLElBQUk7Z0NBQUMsT0FBTyxFQUFFLENBQUE7d0JBQ2hCLENBQUMsQ0FBQyxDQUFBO29CQUNKLENBQUMsQ0FBQyxFQUFBOztvQkFMRixTQUtFLENBQUE7Ozs7O0NBQ0g7QUFFRDs7R0FFRztBQUNILGlDQUNFLE1BQXFCLEVBQ3JCLE9BR007SUFITix3QkFBQSxFQUFBLFlBR007Ozs7Ozt5QkFHRixDQUFBLE9BQU8sT0FBTyxDQUFDLG9CQUFvQixLQUFLLFFBQVEsQ0FBQSxFQUFoRCx3QkFBZ0Q7b0JBQ25DLHFCQUFNLGlCQUFPLENBQUMsTUFBTSxFQUFFLDhCQUFrQixDQUFDLEVBQUE7OzZCQUF6QyxTQUF5QztvQkFDeEQscUJBQU0sY0FBYyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBQTs7b0JBQW5GLFNBQW1GLENBQUE7Ozt5QkFJakYsQ0FBQSxPQUFPLE9BQU8sQ0FBQyxtQkFBbUIsS0FBSyxRQUFRLENBQUEsRUFBL0Msd0JBQStDO29CQUNqRCxxQkFBTSxjQUFjLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLHVCQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBQTs7b0JBQXRFLFNBQXNFLENBQUE7Ozs7OztDQUV6RTs7QUFqQkQsMENBaUJDIn0=