"use strict";
const graphql_1 = require('graphql');
const forumInventory_1 = require('./fixtures/forumInventory');
const createGqlSchema_1 = require('../schema/createGqlSchema');
test('will generate the correct forum schema', () => {
    const gqlSchema = createGqlSchema_1.default(forumInventory_1.default);
    const printedSchema = graphql_1.printSchema(gqlSchema);
    expect(printedSchema).toMatchSnapshot();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhxbEludGVncmF0aW9uLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZ3JhcGhxbC9fX3Rlc3RzX18vZ3JhcGhxbEludGVncmF0aW9uLXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUE0QixTQUM1QixDQUFDLENBRG9DO0FBQ3JDLGlDQUEyQiwyQkFDM0IsQ0FBQyxDQURxRDtBQUN0RCxrQ0FBNEIsMkJBRTVCLENBQUMsQ0FGc0Q7QUFFdkQsSUFBSSxDQUFDLHdDQUF3QyxFQUFFO0lBQzdDLE1BQU0sU0FBUyxHQUFHLHlCQUFlLENBQUMsd0JBQWMsQ0FBQyxDQUFBO0lBQ2pELE1BQU0sYUFBYSxHQUFHLHFCQUFXLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDNUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFBO0FBQ3pDLENBQUMsQ0FBQyxDQUFBIn0=