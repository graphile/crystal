"use strict";
const graphql_1 = require('graphql');
const transformGqlInputValue_1 = require('../transformGqlInputValue');
test('will turn GraphQLInputObjectType values into a map', () => {
    const type = new graphql_1.GraphQLInputObjectType({
        name: 'foo',
        fields: {
            a: { type: graphql_1.GraphQLInt },
            b: { type: graphql_1.GraphQLInt },
            c: { type: graphql_1.GraphQLInt },
        },
    });
    expect(transformGqlInputValue_1.default(type, { a: 1, b: 2, c: 3 })).toEqual(new Map([['a', 1], ['b', 2], ['c', 3]]));
});
test('will just return null for GraphQLInputObjectType if given null', () => {
    const type = new graphql_1.GraphQLInputObjectType({
        name: 'foo',
        fields: {
            a: { type: graphql_1.GraphQLInt },
            b: { type: graphql_1.GraphQLInt },
            c: { type: graphql_1.GraphQLInt },
        },
    });
    expect(transformGqlInputValue_1.default(type, null)).toEqual(null);
});
test('will throw an error for GraphQLInputObjectType if the value is not an object', () => {
    const type = new graphql_1.GraphQLInputObjectType({
        name: 'foo',
        fields: {
            a: { type: graphql_1.GraphQLInt },
            b: { type: graphql_1.GraphQLInt },
            c: { type: graphql_1.GraphQLInt },
        },
    });
    expect(() => transformGqlInputValue_1.default(type, 5)).toThrow('Value of a GraphQL input object type must be an object, not \'number\'.');
});
test('will rename fields in GraphQLInputObjectType to the correct name if provided', () => {
    const type = new graphql_1.GraphQLInputObjectType({
        name: 'foo',
        fields: {
            a: { type: graphql_1.GraphQLInt, [transformGqlInputValue_1.$$gqlInputObjectTypeValueKeyName]: 'x_a' },
            b: { type: graphql_1.GraphQLInt, [transformGqlInputValue_1.$$gqlInputObjectTypeValueKeyName]: 'x_b' },
            c: { type: graphql_1.GraphQLInt, [transformGqlInputValue_1.$$gqlInputObjectTypeValueKeyName]: 'x_c' },
        },
    });
    expect(transformGqlInputValue_1.default(type, { a: 1, b: 2, c: 3 }))
        .toEqual(new Map([['x_a', 1], ['x_b', 2], ['x_c', 3]]));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtR3FsSW5wdXRWYWx1ZS10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL19fdGVzdHNfXy90cmFuc2Zvcm1HcWxJbnB1dFZhbHVlLXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUFtRCxTQUNuRCxDQUFDLENBRDJEO0FBQzVELHlDQUF5RSwyQkFFekUsQ0FBQyxDQUZtRztBQUVwRyxJQUFJLENBQUMsb0RBQW9ELEVBQUU7SUFDekQsTUFBTSxJQUFJLEdBQUcsSUFBSSxnQ0FBc0IsQ0FBQztRQUN0QyxJQUFJLEVBQUUsS0FBSztRQUNYLE1BQU0sRUFBRTtZQUNOLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxvQkFBVSxFQUFFO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxvQkFBVSxFQUFFO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxvQkFBVSxFQUFFO1NBQ3hCO0tBQ0YsQ0FBQyxDQUFBO0lBQ0YsTUFBTSxDQUFDLGdDQUFzQixDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzdHLENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLGdFQUFnRSxFQUFFO0lBQ3JFLE1BQU0sSUFBSSxHQUFHLElBQUksZ0NBQXNCLENBQUM7UUFDdEMsSUFBSSxFQUFFLEtBQUs7UUFDWCxNQUFNLEVBQUU7WUFDTixDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsb0JBQVUsRUFBRTtZQUN2QixDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsb0JBQVUsRUFBRTtZQUN2QixDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsb0JBQVUsRUFBRTtTQUN4QjtLQUNGLENBQUMsQ0FBQTtJQUNGLE1BQU0sQ0FBQyxnQ0FBc0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDMUQsQ0FBQyxDQUFDLENBQUE7QUFFRixJQUFJLENBQUMsOEVBQThFLEVBQUU7SUFDbkYsTUFBTSxJQUFJLEdBQUcsSUFBSSxnQ0FBc0IsQ0FBQztRQUN0QyxJQUFJLEVBQUUsS0FBSztRQUNYLE1BQU0sRUFBRTtZQUNOLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxvQkFBVSxFQUFFO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxvQkFBVSxFQUFFO1lBQ3ZCLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxvQkFBVSxFQUFFO1NBQ3hCO0tBQ0YsQ0FBQyxDQUFBO0lBQ0YsTUFBTSxDQUFDLE1BQU0sZ0NBQXNCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHlFQUF5RSxDQUFDLENBQUE7QUFDbEksQ0FBQyxDQUFDLENBQUE7QUFFRixJQUFJLENBQUMsOEVBQThFLEVBQUU7SUFDbkYsTUFBTSxJQUFJLEdBQUcsSUFBSSxnQ0FBc0IsQ0FBQztRQUN0QyxJQUFJLEVBQUUsS0FBSztRQUNYLE1BQU0sRUFBRTtZQUNOLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxvQkFBVSxFQUFFLENBQUMseURBQWdDLENBQUMsRUFBRSxLQUFLLEVBQUU7WUFDbEUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLG9CQUFVLEVBQUUsQ0FBQyx5REFBZ0MsQ0FBQyxFQUFFLEtBQUssRUFBRTtZQUNsRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsb0JBQVUsRUFBRSxDQUFDLHlEQUFnQyxDQUFDLEVBQUUsS0FBSyxFQUFFO1NBQ25FO0tBQ0YsQ0FBQyxDQUFBO0lBQ0YsTUFBTSxDQUFDLGdDQUFzQixDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN2RCxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMzRCxDQUFDLENBQUMsQ0FBQSJ9