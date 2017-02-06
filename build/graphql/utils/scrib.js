"use strict";
var graphql_1 = require("graphql");
/**
 * Utilities for writing GraphQL descriptions. The name “scrib” is a play on
 * the word “describe.” We didn’t want to call these tools “description”
 * because that may clash with local definitions, and “describe” clashes with
 * many testing frameworks (including Jest). “scrib” is also short which is a
 * bonus.
 *
 * “scrib” has no technical meaning whatsoever.
 */
// TODO: test
var scrib;
(function (scrib) {
    /**
     * Renders a markdown inline code snippet (text inside backticks) for the
     * name of the given type. Will use standard GraphQL syntax like bangs and
     * brackets for non-null and list types appropriately.
     */
    function type(type) {
        return "`" + getTypeName(type) + "`";
    }
    scrib.type = type;
    /**
     * Gets the standard GraphQL type string representation.
     *
     * @private
     */
    function getTypeName(type) {
        // Return an empty string for tests.
        if (type == null)
            return '';
        // If this is a named type, just return the type’s name.
        if (type === graphql_1.getNamedType(type))
            return type.name;
        // If this is non-null return the nullable type’s name.
        if (type instanceof graphql_1.GraphQLNonNull)
            return getTypeName(type.ofType);
        // If this is a list, wrap the name with `[]`.
        if (type instanceof graphql_1.GraphQLList)
            return "[" + getTypeName(type.ofType) + "]";
        throw new Error('Unrecognized unnamed GraphQL type.');
    }
})(scrib || (scrib = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = scrib;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaWIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZ3JhcGhxbC91dGlscy9zY3JpYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbUNBQWdGO0FBRWhGOzs7Ozs7OztHQVFHO0FBQ0gsYUFBYTtBQUNiLElBQVUsS0FBSyxDQTJCZDtBQTNCRCxXQUFVLEtBQUs7SUFDYjs7OztPQUlHO0lBQ0gsY0FBc0IsSUFBaUI7UUFDckMsTUFBTSxDQUFDLE1BQUssV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFJLENBQUE7SUFDbkMsQ0FBQztJQUZlLFVBQUksT0FFbkIsQ0FBQTtJQUVEOzs7O09BSUc7SUFDSCxxQkFBc0IsSUFBaUI7UUFDckMsb0NBQW9DO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUMsRUFBRSxDQUFBO1FBQzNCLHdEQUF3RDtRQUN4RCxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssc0JBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFBO1FBQ2pELHVEQUF1RDtRQUN2RCxFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVksd0JBQWMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ25FLDhDQUE4QztRQUM5QyxFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVkscUJBQVcsQ0FBQztZQUFDLE1BQU0sQ0FBQyxNQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQUcsQ0FBQTtRQUV2RSxNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUE7SUFDdkQsQ0FBQztBQUNILENBQUMsRUEzQlMsS0FBSyxLQUFMLEtBQUssUUEyQmQ7O0FBRUQsa0JBQWUsS0FBSyxDQUFBIn0=