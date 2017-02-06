"use strict";
/**
 * Gets the Postgres token type from a type identifier (namespace name and type
 * name). Also does some checks on the type to make sure it is an acceptable
 * token type.
 */
function getPgTokenTypeFromIdentifier(pgCatalog, jwtPgTypeIdentifier) {
    var _a = parseTypeIdentifier(jwtPgTypeIdentifier), namespaceName = _a.namespaceName, typeName = _a.typeName;
    // Try to get the type from our catalog by name.
    var pgType = pgCatalog.getTypeByName(namespaceName, typeName);
    // If a type with the provided name does not exist, throw an error.
    if (!pgType)
        throw new Error("Postgres token type \"" + namespaceName + "\".\"" + typeName + "\" does not exist in your Postgres schema subset. Perhaps try adding schema \"" + namespaceName + "\" to your list of introspected queries.");
    // If the token type is not a composite type, throw an error.
    if (pgType.type !== 'c')
        throw new Error("Postgres token type \"" + namespaceName + "\".\"" + typeName + "\" is not a composite type.");
    // Get the class, we want to run some checks…
    var pgClass = pgCatalog.assertGetClass(pgType.classId);
    // If the class is insertable, selectable, updatable, or deletable it is
    // likely a table or view. We only want our tokens to be compound types
    // (for now). Therefore, throw an error if we think this class is a table
    // or view.
    if (pgClass.isInsertable || pgClass.isSelectable || pgClass.isUpdatable || pgClass.isDeletable)
        throw new Error("Postgres token type \"" + namespaceName + "\".\"" + typeName + "\" is a table or view. Only compound types are allowed to be tokens.");
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
    var match = typeIdentifier.match(/^(?:([a-zA-Z1-2_]+)|"([^"]*)")\.(?:([a-zA-Z1-2_]+)|"([^"]*)")$/);
    if (!match)
        throw new Error("Type identifier '" + typeIdentifier + "' is of the incorrect form.");
    return {
        namespaceName: match[1] || match[2],
        typeName: match[3] || match[4],
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UGdUb2tlblR5cGVGcm9tSWRlbnRpZmllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9zY2hlbWEvYXV0aC9nZXRQZ1Rva2VuVHlwZUZyb21JZGVudGlmaWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQTs7OztHQUlHO0FBQ0gsc0NBQ0UsU0FBb0IsRUFDcEIsbUJBQTJCO0lBRXJCLElBQUEsNkNBQXNFLEVBQXBFLGdDQUFhLEVBQUUsc0JBQVEsQ0FBNkM7SUFFNUUsZ0RBQWdEO0lBQ2hELElBQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBRS9ELG1FQUFtRTtJQUNuRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQXdCLGFBQWEsYUFBTSxRQUFRLHNGQUErRSxhQUFhLDZDQUF5QyxDQUFDLENBQUE7SUFFM00sNkRBQTZEO0lBQzdELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDO1FBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQXdCLGFBQWEsYUFBTSxRQUFRLGdDQUE0QixDQUFDLENBQUE7SUFFbEcsNkNBQTZDO0lBQzdDLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRXhELHdFQUF3RTtJQUN4RSx1RUFBdUU7SUFDdkUseUVBQXlFO0lBQ3pFLFdBQVc7SUFDWCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLE9BQU8sQ0FBQyxZQUFZLElBQUksT0FBTyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQzdGLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQXdCLGFBQWEsYUFBTSxRQUFRLHlFQUFxRSxDQUFDLENBQUE7SUFFM0kscURBQXFEO0lBQ3JELE1BQU0sQ0FBQyxNQUFNLENBQUE7QUFDZixDQUFDOztBQTdCRCwrQ0E2QkM7QUFFRDs7Ozs7R0FLRztBQUNILDZCQUE4QixjQUFzQjtJQUNsRCxJQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLGdFQUFnRSxDQUFDLENBQUE7SUFFcEcsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDVCxNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFvQixjQUFjLGdDQUE2QixDQUFDLENBQUE7SUFFbEYsTUFBTSxDQUFDO1FBQ0wsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ25DLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztLQUMvQixDQUFBO0FBQ0gsQ0FBQyJ9