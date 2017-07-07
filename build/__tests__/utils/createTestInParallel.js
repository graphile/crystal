"use strict";
var tslib_1 = require("tslib");
/**
 * Runs all of the tests declared with this funcion in a file in parallel. This
 * breaks any `beforeEach` and `afterEach` functions, but any `beforeAll` and
 * `afterAll` functions should work.
 *
 * This function will break the timing numbers in the Jest console.
 */
function createTestInParallel() {
    var _this = this;
    // All of the test functions. We collect them in a single array so that we can
    // call them all at once.
    var testFns = [];
    // The promised results of calling all of our test functions. The single serial
    // tests will await these values.
    var testResults;
    return function (name, fn) {
        // Add the test function and record its position.
        var index = testFns.length;
        testFns.push(fn);
        test(name, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // If the tests have not yet been run then run all of our tests.
                        if (!testResults) {
                            testResults = testFns.map(function (testFn) { return Promise.resolve(testFn()); });
                        }
                        // Await the result.
                        return [4 /*yield*/, testResults[index]];
                    case 1:
                        // Await the result.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createTestInParallel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVGVzdEluUGFyYWxsZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvX190ZXN0c19fL3V0aWxzL2NyZWF0ZVRlc3RJblBhcmFsbGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0g7SUFBQSxpQkF1QkM7SUF0QkMsOEVBQThFO0lBQzlFLHlCQUF5QjtJQUN6QixJQUFNLE9BQU8sR0FBc0MsRUFBRSxDQUFBO0lBRXJELCtFQUErRTtJQUMvRSxpQ0FBaUM7SUFDakMsSUFBSSxXQUE2QyxDQUFBO0lBRWpELE1BQU0sQ0FBQyxVQUFDLElBQVksRUFBRSxFQUE4QjtRQUNsRCxpREFBaUQ7UUFDakQsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQTtRQUM1QixPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRWhCLElBQUksQ0FBQyxJQUFJLEVBQUU7Ozs7d0JBQ1QsZ0VBQWdFO3dCQUNoRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7NEJBQ2pCLFdBQVcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsTUFBTSxJQUFJLE9BQUEsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUF6QixDQUF5QixDQUFDLENBQUE7d0JBQ2hFLENBQUM7d0JBQ0Qsb0JBQW9CO3dCQUNwQixxQkFBTSxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUE7O3dCQUR4QixvQkFBb0I7d0JBQ3BCLFNBQXdCLENBQUE7Ozs7YUFDekIsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFBO0FBQ0gsQ0FBQzs7QUF2QkQsdUNBdUJDIn0=