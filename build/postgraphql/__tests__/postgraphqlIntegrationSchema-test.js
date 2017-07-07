// TODO: There may be some excessive waste, if we could somehow filter what
// these guys see, that would be great 👍
"use strict";
var _this = this;
var tslib_1 = require("tslib");
var graphql_1 = require("graphql");
var withPgClient_1 = require("../../__tests__/utils/withPgClient");
var createPostGraphQLSchema_1 = require("../schema/createPostGraphQLSchema");
// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;
var testResults;
var testFixtures = [
    {
        name: 'prints a schema with the default options',
        createSchema: function (client) { return createPostGraphQLSchema_1.default(client, ['a', 'b', 'c']); },
    },
    {
        name: 'prints a schema with Relay 1 style ids',
        createSchema: function (client) { return createPostGraphQLSchema_1.default(client, 'c', { classicIds: true }); },
    },
    {
        name: 'prints a schema with a JWT generating mutation',
        createSchema: function (client) { return createPostGraphQLSchema_1.default(client, 'b', { jwtSecret: 'secret', jwtPgTypeIdentifier: 'b.jwt_token' }); },
    },
    {
        name: 'prints a schema without default mutations',
        createSchema: function (client) { return createPostGraphQLSchema_1.default(client, 'c', { disableDefaultMutations: true }); },
    },
];
beforeAll(function () {
    testResults = testFixtures.map(function (testFixture) { return withPgClient_1.default(function (client) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testFixture.createSchema(client)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); })(); });
});
var _loop_1 = function (i) {
    test(testFixtures[i].name, function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = expect;
                    _c = graphql_1.printSchema;
                    return [4 /*yield*/, testResults[i]];
                case 1:
                    _a.apply(void 0, [_c.apply(void 0, [_e.sent()])]).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
};
for (var i = 0; i < testFixtures.length; i++) {
    _loop_1(i);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGdyYXBocWxJbnRlZ3JhdGlvblNjaGVtYS10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmFwaHFsL19fdGVzdHNfXy9wb3N0Z3JhcGhxbEludGVncmF0aW9uU2NoZW1hLXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkVBQTJFO0FBQzNFLHlDQUF5Qzs7QUFFekMsaUJBdUNBOztBQXZDQSxtQ0FBcUM7QUFDckMsbUVBQTZEO0FBQzdELDZFQUF1RTtBQUV2RSx1REFBdUQ7QUFDdkQsT0FBTyxDQUFDLHdCQUF3QixHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFFNUMsSUFBSSxXQUFXLENBQUE7QUFFZixJQUFNLFlBQVksR0FBRztJQUNuQjtRQUNFLElBQUksRUFBRSwwQ0FBMEM7UUFDaEQsWUFBWSxFQUFFLFVBQUEsTUFBTSxJQUFJLE9BQUEsaUNBQXVCLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFoRCxDQUFnRDtLQUN6RTtJQUNEO1FBQ0UsSUFBSSxFQUFFLHdDQUF3QztRQUM5QyxZQUFZLEVBQUUsVUFBQSxNQUFNLElBQUksT0FBQSxpQ0FBdUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQTFELENBQTBEO0tBQ25GO0lBQ0Q7UUFDRSxJQUFJLEVBQUUsZ0RBQWdEO1FBQ3RELFlBQVksRUFBRSxVQUFBLE1BQU0sSUFBSSxPQUFBLGlDQUF1QixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBRSxDQUFDLEVBQWpHLENBQWlHO0tBQzFIO0lBQ0Q7UUFDRSxJQUFJLEVBQUUsMkNBQTJDO1FBQ2pELFlBQVksRUFBRSxVQUFBLE1BQU0sSUFBSSxPQUFBLGlDQUF1QixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBRSx1QkFBdUIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUF2RSxDQUF1RTtLQUNoRztDQUNGLENBQUE7QUFFRCxTQUFTLENBQUM7SUFDUixXQUFXLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFBLFdBQVcsSUFBSSxPQUFBLHNCQUFZLENBQUMsVUFBTSxNQUFNOzs7d0JBQzlELHFCQUFNLFdBQVcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUE7d0JBQTdDLHNCQUFPLFNBQXNDLEVBQUE7OztTQUM5QyxDQUFDLEVBQUUsRUFGMEMsQ0FFMUMsQ0FBQyxDQUFBO0FBQ1AsQ0FBQyxDQUFDLENBQUE7d0JBRU8sQ0FBQztJQUNSLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFOzs7OztvQkFDekIsS0FBQSxNQUFNLENBQUE7b0JBQUMsS0FBQSxxQkFBVyxDQUFBO29CQUFDLHFCQUFNLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBQTs7b0JBQXZDLGtCQUFPLGtCQUFZLFNBQW9CLEVBQUMsRUFBQyxDQUFDLGVBQWUsRUFBRSxDQUFBOzs7O1NBQzVELENBQUMsQ0FBQTtBQUNKLENBQUM7QUFKRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO1lBQW5DLENBQUM7Q0FJVCJ9