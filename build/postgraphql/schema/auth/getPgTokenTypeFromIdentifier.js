"use strict";
/**
 * Gets the Postgres token type from a type identifier (namespace name and type
 * name). Also does some checks on the type to make sure it is an acceptable
 * token type.
 */
function getPgTokenTypeFromIdentifier(pgCatalog, jwtPgTypeIdentifier) {
    const { namespaceName, typeName } = parseTypeIdentifier(jwtPgTypeIdentifier);
    // Try to get the type from our catalog by name.
    const pgType = pgCatalog.getTypeByName(namespaceName, typeName);
    // If a type with the provided name does not exist, throw an error.
    if (!pgType)
        throw new Error(`Postgres token type "${namespaceName}"."${typeName}" does not exist in your Postgres schema subset. Perhaps try adding schema "${namespaceName}" to your list of introspected queries.`);
    // If the token type is not a composite type, throw an error.
    if (pgType.type !== 'c')
        throw new Error(`Postgres token type "${namespaceName}"."${typeName}" is not a composite type.`);
    // Get the class, we want to run some checks…
    const pgClass = pgCatalog.assertGetClass(pgType.classId);
    // If the class is insertable, selectable, updatable, or deletable it is
    // likely a table or view. We only want our tokens to be compound types
    // (for now). Therefore, throw an error if we think this class is a table
    // or view.
    if (pgClass.isInsertable || pgClass.isSelectable || pgClass.isUpdatable || pgClass.isDeletable)
        throw new Error(`Postgres token type "${namespaceName}"."${typeName}" is a table or view. Only compound types are allowed to be tokens.`);
    // If we have gotten past all that, here is our type.
    return pgType;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getPgTokenTypeFromIdentifier;
/**
 * Enables the parsing of type identifiers. Type identifiers are a bit tricky,
 * but this function uses a regular expression to do it. Fun.
 *
 * @private
 */
function parseTypeIdentifier(typeIdentifier) {
    const match = typeIdentifier.match(/^(?:([a-zA-Z1-2_]+)|"([^"]*)")\.(?:([a-zA-Z1-2_]+)|"([^"]*)")$/);
    if (!match)
        throw new Error(`Type identifier '${typeIdentifier}' is of the incorrect form.`);
    return {
        namespaceName: match[1] || match[2],
        typeName: match[3] || match[4],
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UGdUb2tlblR5cGVGcm9tSWRlbnRpZmllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9zY2hlbWEvYXV0aC9nZXRQZ1Rva2VuVHlwZUZyb21JZGVudGlmaWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQTs7OztHQUlHO0FBQ0gsc0NBQ0UsU0FBb0IsRUFDcEIsbUJBQTJCO0lBRTNCLE1BQU0sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLEdBQUcsbUJBQW1CLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtJQUU1RSxnREFBZ0Q7SUFDaEQsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFFL0QsbUVBQW1FO0lBQ25FLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsYUFBYSxNQUFNLFFBQVEsK0VBQStFLGFBQWEseUNBQXlDLENBQUMsQ0FBQTtJQUUzTSw2REFBNkQ7SUFDN0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxHQUFHLENBQUM7UUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsYUFBYSxNQUFNLFFBQVEsNEJBQTRCLENBQUMsQ0FBQTtJQUVsRyw2Q0FBNkM7SUFDN0MsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7SUFFeEQsd0VBQXdFO0lBQ3hFLHVFQUF1RTtJQUN2RSx5RUFBeUU7SUFDekUsV0FBVztJQUNYLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsV0FBVyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDN0YsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsYUFBYSxNQUFNLFFBQVEscUVBQXFFLENBQUMsQ0FBQTtJQUUzSSxxREFBcUQ7SUFDckQsTUFBTSxDQUFDLE1BQU0sQ0FBQTtBQUNmLENBQUM7QUE3QkQ7OENBNkJDLENBQUE7QUFFRDs7Ozs7R0FLRztBQUNILDZCQUE4QixjQUFzQjtJQUNsRCxNQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUE7SUFFcEcsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDVCxNQUFNLElBQUksS0FBSyxDQUFDLG9CQUFvQixjQUFjLDZCQUE2QixDQUFDLENBQUE7SUFFbEYsTUFBTSxDQUFDO1FBQ0wsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ25DLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztLQUMvQixDQUFBO0FBQ0gsQ0FBQyJ9