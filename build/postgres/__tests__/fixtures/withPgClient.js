"use strict";
var tslib_1 = require("tslib");
var pgPool_1 = require("./pgPool");
var kitchenSinkSchemaSql_1 = require("./kitchenSinkSchemaSql");
/**
 * Takes a function implementation of a test, and provides it a Postgres
 * client. The client will be connected from the pool at the start of the test,
 * and released back at the end. All changes will be rolled back.
 */
function withPgClient(fn) {
    var _this = this;
    return function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var client, _a, _b, _c, error_1;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, pgPool_1.default.connect()];
                case 1:
                    client = _d.sent();
                    // There’s some wierd behavior with the `pg` module here where an error
                    // is resolved correctly.
                    //
                    // @see https://github.com/brianc/node-postgres/issues/1142
                    if (client['errno'])
                        throw client;
                    return [4 /*yield*/, client.query('begin')];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, client.query('set local timezone to \'+04:00\'')];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 7, , 8]);
                    _b = (_a = client).query;
                    return [4 /*yield*/, kitchenSinkSchemaSql_1.default];
                case 5: return [4 /*yield*/, _b.apply(_a, [_d.sent()])];
                case 6:
                    _d.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _d.sent();
                    // tslint:disable-next-line no-console
                    console.error(error_1.stack || error_1);
                    throw error_1;
                case 8:
                    // Mock the query function.
                    client.query = jest.fn(client.query);
                    _d.label = 9;
                case 9:
                    _d.trys.push([9, , 11, 13]);
                    return [4 /*yield*/, fn(client)];
                case 10:
                    _d.sent();
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, client.query('rollback')];
                case 12:
                    _d.sent();
                    client.release();
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = withPgClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l0aFBnQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL19fdGVzdHNfXy9maXh0dXJlcy93aXRoUGdDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxtQ0FBNkI7QUFDN0IsK0RBQXlEO0FBRXpEOzs7O0dBSUc7QUFDSCxzQkFBc0MsRUFBNEM7SUFBbEYsaUJBdUNDO0lBdENDLE1BQU0sQ0FBQzs7Ozt3QkFFVSxxQkFBTSxnQkFBTSxDQUFDLE9BQU8sRUFBRSxFQUFBOzs2QkFBdEIsU0FBc0I7b0JBRXJDLHVFQUF1RTtvQkFDdkUseUJBQXlCO29CQUN6QixFQUFFO29CQUNGLDJEQUEyRDtvQkFDM0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUNsQixNQUFNLE1BQU0sQ0FBQTtvQkFFZCxxQkFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFBOztvQkFBM0IsU0FBMkIsQ0FBQTtvQkFDM0IscUJBQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxFQUFBOztvQkFBdEQsU0FBc0QsQ0FBQTs7OztvQkFJOUMsS0FBQSxDQUFBLEtBQUEsTUFBTSxDQUFBLENBQUMsS0FBSyxDQUFBO29CQUFDLHFCQUFNLDhCQUFvQixFQUFBO3dCQUE3QyxxQkFBTSxjQUFhLFNBQTBCLEVBQUMsRUFBQTs7b0JBQTlDLFNBQThDLENBQUE7Ozs7b0JBRzlDLHNDQUFzQztvQkFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFLLENBQUMsS0FBSyxJQUFJLE9BQUssQ0FBQyxDQUFBO29CQUNuQyxNQUFNLE9BQUssQ0FBQTs7b0JBR2IsMkJBQTJCO29CQUMzQixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBOzs7O29CQUlsQyxxQkFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUE7O29CQUFoQixTQUFnQixDQUFBOzt5QkFLaEIscUJBQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBQTs7b0JBQTlCLFNBQThCLENBQUE7b0JBQzlCLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTs7Ozs7U0FFbkIsQ0FBQTtBQUNILENBQUM7O0FBdkNELCtCQXVDQyJ9