"use strict";
var graphql_1 = require("graphql");
var forumInventory_1 = require("./fixtures/forumInventory");
var createGqlSchema_1 = require("../schema/createGqlSchema");
test('will generate the correct forum schema', function () {
    var gqlSchema = createGqlSchema_1.default(forumInventory_1.default);
    var printedSchema = graphql_1.printSchema(gqlSchema);
    expect(printedSchema).toMatchSnapshot();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhxbEludGVncmF0aW9uLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZ3JhcGhxbC9fX3Rlc3RzX18vZ3JhcGhxbEludGVncmF0aW9uLXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1DQUFxQztBQUNyQyw0REFBc0Q7QUFDdEQsNkRBQXVEO0FBRXZELElBQUksQ0FBQyx3Q0FBd0MsRUFBRTtJQUM3QyxJQUFNLFNBQVMsR0FBRyx5QkFBZSxDQUFDLHdCQUFjLENBQUMsQ0FBQTtJQUNqRCxJQUFNLGFBQWEsR0FBRyxxQkFBVyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQzVDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUN6QyxDQUFDLENBQUMsQ0FBQSJ9