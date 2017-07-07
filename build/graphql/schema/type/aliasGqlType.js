"use strict";
var graphql_1 = require("graphql");
function aliasGqlType(gqlType, name, description) {
    if (gqlType instanceof graphql_1.GraphQLNonNull)
        return new graphql_1.GraphQLNonNull(aliasGqlType(gqlType.ofType, name, description));
    if (gqlType instanceof graphql_1.GraphQLList)
        return new graphql_1.GraphQLList(aliasGqlType(gqlType.ofType, name, description));
    // Use prototypes to inherit all of the methods from the type we are
    // aliasing, then set the `name` and `description` properties to the aliased
    // properties.
    return Object.assign(Object.create(gqlType), { name: name, description: description });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = aliasGqlType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxpYXNHcWxUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dyYXBocWwvc2NoZW1hL3R5cGUvYWxpYXNHcWxUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxtQ0FBdUc7QUFLdkcsc0JBQXNDLE9BQW9CLEVBQUUsSUFBWSxFQUFFLFdBQWdDO0lBQ3hHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sWUFBWSx3QkFBYyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLHdCQUFjLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUE7SUFFNUUsRUFBRSxDQUFDLENBQUMsT0FBTyxZQUFZLHFCQUFXLENBQUM7UUFDakMsTUFBTSxDQUFDLElBQUkscUJBQVcsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQTtJQUV6RSxvRUFBb0U7SUFDcEUsNEVBQTRFO0lBQzVFLGNBQWM7SUFDZCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsSUFBSSxNQUFBLEVBQUUsV0FBVyxhQUFBLEVBQUUsQ0FBQyxDQUFBO0FBQ3JFLENBQUM7O0FBWEQsK0JBV0MifQ==