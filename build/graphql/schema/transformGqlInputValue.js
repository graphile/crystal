"use strict";
const graphql_1 = require('graphql');
/**
 * Allows types to define a custom transform function from GraphQL input. If
 * defined, `transformGqlInputValue` will just call this instead of performing
 * its own logic.
 */
// TODO: Use types to express how this works. That would be cool.
exports.$$fromGqlInput = Symbol('fromGqlInput');
/**
 * Sometimes we will have a different field name in GraphQL then the actual
 * internal object key name that we want. When that is the case, use this
 * symbol and `transformGqlInputValue` will rename the field.
 */
exports.$$gqlInputObjectTypeValueKeyName = Symbol('gqlInputObjectTypeValueKeyName');
/**
 * When we receive input values, they may be in any shape and form. We must
 * make sure to transform the input values appropriately so that we can use
 * them with our interface.
 */
function transformGqlInputValue(type, value) {
    // If `$$fromGqlInput` is defined, use it!
    if (type[exports.$$fromGqlInput])
        return type[exports.$$fromGqlInput](value);
    // If this is the value for a scalar type or enum type, it is likely it has
    // already gone through the appropriate transforms. We should just return.
    if (type instanceof graphql_1.GraphQLScalarType || type instanceof graphql_1.GraphQLEnumType)
        return value;
    // If this is the value for a non-null type, just do a quick sanity check
    // that the value is actually non-null and recursively call this function
    // again with the base type.
    if (type instanceof graphql_1.GraphQLNonNull) {
        // Confirm this type is non-null.
        if (value == null)
            throw new Error('Value of a GraphQL non-null type must not be null.');
        return transformGqlInputValue(type.ofType, value);
    }
    // If this is the value for a list type, we need to transform all of the list
    // items recursively.
    if (type instanceof graphql_1.GraphQLList) {
        // If the value is null, just return.
        if (value == null)
            return value;
        // Confirm our list is actually a list.
        if (!Array.isArray(value))
            throw new Error('Value of a GraphQL list type must be an array.');
        return value.map(item => transformGqlInputValue(type.ofType, item));
    }
    // If this is the value for an input object type, we need to turn the value
    // into a map and rename keys where it is appropriate. If when creating an
    // input object type there are keys you want to rename, use the
    // `$$gqlInputObjectTypeValueKeyName` symbol in your fields.
    if (type instanceof graphql_1.GraphQLInputObjectType) {
        // If the value is null, just return.
        if (value == null)
            return value;
        // Make sure we have an object.
        if (typeof value !== 'object')
            throw new Error(`Value of a GraphQL input object type must be an object, not '${typeof value}'.`);
        // Get an array of all our input object’s fields.
        const fields = Object.keys(type.getFields()).map(key => type.getFields()[key]);
        // Map all of our fields to values.
        return new Map(fields
            .map(field => [
            // Use the field’s name, or a custom name.
            field[exports.$$gqlInputObjectTypeValueKeyName] || field.name,
            // Transform the value for this field recursively.
            transformGqlInputValue(field.type, value[field.name]),
        ])
            .filter(([, fieldValue]) => typeof fieldValue !== 'undefined'));
    }
    // Throw an error here. Just in case.
    throw new Error(`Type '${type.toString()}' is not a valid GraphQL input type.`);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformGqlInputValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtR3FsSW5wdXRWYWx1ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS90cmFuc2Zvcm1HcWxJbnB1dFZhbHVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwQkFPTyxTQVFQLENBQUMsQ0FSZTtBQUVoQjs7OztHQUlHO0FBQ0gsaUVBQWlFO0FBQ3BELHNCQUFjLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBRXBEOzs7O0dBSUc7QUFDVSx3Q0FBZ0MsR0FBRyxNQUFNLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtBQUV4Rjs7OztHQUlHO0FBQ0gsZ0NBQWdELElBQTZCLEVBQUUsS0FBWTtJQUN6RiwwQ0FBMEM7SUFDMUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHNCQUFjLENBQUMsQ0FBQztRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVwQywyRUFBMkU7SUFDM0UsMEVBQTBFO0lBQzFFLEVBQUUsQ0FBQyxDQUFDLElBQUksWUFBWSwyQkFBaUIsSUFBSSxJQUFJLFlBQVkseUJBQWUsQ0FBQztRQUN2RSxNQUFNLENBQUMsS0FBSyxDQUFBO0lBRWQseUVBQXlFO0lBQ3pFLHlFQUF5RTtJQUN6RSw0QkFBNEI7SUFDNUIsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLHdCQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ25DLGlDQUFpQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQTtRQUV2RSxNQUFNLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsNkVBQTZFO0lBQzdFLHFCQUFxQjtJQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVkscUJBQVcsQ0FBQyxDQUFDLENBQUM7UUFDaEMscUNBQXFDO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7WUFDaEIsTUFBTSxDQUFDLEtBQUssQ0FBQTtRQUVkLHVDQUF1QztRQUN2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFBO1FBRW5FLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDckUsQ0FBQztJQUVELDJFQUEyRTtJQUMzRSwwRUFBMEU7SUFDMUUsK0RBQStEO0lBQy9ELDREQUE0RDtJQUM1RCxFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVksZ0NBQXNCLENBQUMsQ0FBQyxDQUFDO1FBQzNDLHFDQUFxQztRQUNyQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO1lBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQUE7UUFFZCwrQkFBK0I7UUFDL0IsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDO1lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0VBQWdFLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQTtRQUVuRyxpREFBaUQ7UUFDakQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBRTlFLG1DQUFtQztRQUNuQyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQ1osTUFBTTthQUNILEdBQUcsQ0FBa0IsS0FBSyxJQUFJO1lBQzdCLDBDQUEwQztZQUMxQyxLQUFLLENBQUMsd0NBQWdDLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSTtZQUNyRCxrREFBa0Q7WUFDbEQsc0JBQXNCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3RELENBQUM7YUFFRCxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLEtBQUssT0FBTyxVQUFVLEtBQUssV0FBVyxDQUFDLENBQ2pFLENBQUE7SUFDSCxDQUFDO0lBRUQscUNBQXFDO0lBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLENBQUMsUUFBUSxFQUFFLHNDQUFzQyxDQUFDLENBQUE7QUFDakYsQ0FBQztBQW5FRDt3Q0FtRUMsQ0FBQSJ9