"use strict";
/**
 * Checks if a Postgres procedure can be a computed column. That is if the
 * procedure’s first argument is a composite type, and the name starts with
 * that type’s name. So for example:
 *
 * ```sql
 * create function person_full_name(person person) returns text as ...;
 * ```
 *
 * Would be a computed column because it takes a composite type as the first
 * argument (`person`), and the name starts with the composite type’s name
 * (`person_`).
 *
 * If the optional third argument is provided this function will check if this
 * is a computed column *for that class*.
 */
// TODO: test
function getPgProcedureComputedClass(pgCatalog, pgProcedure) {
    // If there are no arguments for this procedure, this is not a computed
    // column.
    if (pgProcedure.argTypeIds.length === 0)
        return null;
    var firstArgTypeId = pgProcedure.argTypeIds[0];
    var pgType = pgCatalog.assertGetType(firstArgTypeId);
    // If the procedure and type are in different namespaces, this is not a
    // computed column.
    if (pgProcedure.namespaceId !== pgType.namespaceId)
        return null;
    // If the first argument type is not a composite type, this is not a
    // computed column.
    if (pgType.type !== 'c')
        return null;
    // If the procedure’s name does not start with the first argument’s
    // composite type name, this is not a computed column.
    if (!pgProcedure.name.startsWith(pgType.name + "_"))
        return null;
    // Return the class for this type.
    return pgCatalog.assertGetClass(pgType.classId);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getPgProcedureComputedClass;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UGdQcm9jZWR1cmVDb21wdXRlZENsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmFwaHFsL3NjaGVtYS9wcm9jZWR1cmVzL2dldFBnUHJvY2VkdXJlQ29tcHV0ZWRDbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUE7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsYUFBYTtBQUNiLHFDQUNFLFNBQW9CLEVBQ3BCLFdBQStCO0lBRS9CLHVFQUF1RTtJQUN2RSxVQUFVO0lBQ1YsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUE7SUFFYixJQUFNLGNBQWMsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2hELElBQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUE7SUFFdEQsdUVBQXVFO0lBQ3ZFLG1CQUFtQjtJQUNuQixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUViLG9FQUFvRTtJQUNwRSxtQkFBbUI7SUFDbkIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxHQUFHLENBQUM7UUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUViLG1FQUFtRTtJQUNuRSxzREFBc0Q7SUFDdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBSSxNQUFNLENBQUMsSUFBSSxNQUFHLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsSUFBSSxDQUFBO0lBRWIsa0NBQWtDO0lBQ2xDLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNqRCxDQUFDOztBQTdCRCw4Q0E2QkMifQ==