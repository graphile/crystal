"use strict";
var interface_1 = require("../../../interface");
var utils_1 = require("../../utils");
var PgCollection_1 = require("../collection/PgCollection");
var PgClassType_1 = require("./PgClassType");
var PgRangeType_1 = require("./PgRangeType");
var pgBooleanType_1 = require("./scalar/pgBooleanType");
var pgIntegerType_1 = require("./scalar/pgIntegerType");
var pgFloatType_1 = require("./scalar/pgFloatType");
var pgStringType_1 = require("./scalar/pgStringType");
var pgJsonType_1 = require("./scalar/pgJsonType");
var pgBigIntType_1 = require("./custom/pgBigIntType");
var pgUuidType_1 = require("./custom/pgUuidType");
var pgDatetimeType_1 = require("./custom/pgDatetimeType");
var pgDateType_1 = require("./custom/pgDateType");
var pgTimeType_1 = require("./custom/pgTimeType");
var pgIntervalType_1 = require("./custom/pgIntervalType");
var PgNullableType_1 = require("./PgNullableType");
var PgAliasType_1 = require("./PgAliasType");
var PgEnumType_1 = require("./PgEnumType");
var PgListType_1 = require("./PgListType");
/**
 * A hardcoded list of PostgreSql type OIDs to interface types. Some types
 * warrant a special type, this is where we grant that. To get all of the types
 * in a database use the following query:
 *
 * ```sql
 * select oid, typname from pg_pgCatalog.pg_type;
 * ```
 *
 * Be careful though, we can rely on type ids that come with PostgreSql, but
 * some ids are database specific.
 *
 * @private
 */
var pgTypeIdToType = new Map([
    ['20', pgBigIntType_1.default],
    ['21', pgIntegerType_1.default],
    ['23', pgIntegerType_1.default],
    ['114', pgJsonType_1.default],
    ['3802', pgJsonType_1.default],
    ['2950', pgUuidType_1.default],
    ['1082', pgDateType_1.default],
    ['1114', pgDatetimeType_1.default],
    ['1184', pgDatetimeType_1.default],
    ['1083', pgTimeType_1.default],
    ['1266', pgTimeType_1.default],
    ['1186', pgIntervalType_1.default],
]);
var _getTypeFromPgType = utils_1.memoize2(createTypeFromPgType);
/**
 * Converts a PostgreSql type into a type object that our interface expects.
 * This function is memoized, so for the same `pgCatalog` and `pgType` pair,
 * returned will be the *exact* same type. This way we can maintain refrential
 * equality.
 */
// TODO: The third `Inventory` argument is hacky and should be refactored.
function getTypeFromPgType(pgCatalog, pgType, _inventory) {
    // If this is a composite type, then it may be the type for a row. Search our
    // collections (if an `Inventory` was provided) to see if this type
    // truly is a row type. If we find a collection, just return the collection’s
    // type instead of deferring to our own selection mechanisms.
    //
    // Note that this check is not memoized.
    if (_inventory && pgType.type === 'c') {
        var collection = _inventory.getCollections().find(function (aCollection) { return aCollection instanceof PgCollection_1.default && aCollection.pgClass.typeId === pgType.id; });
        if (collection)
            return new PgNullableType_1.default(collection.type);
    }
    return _getTypeFromPgType(pgCatalog, pgType);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getTypeFromPgType;
function createTypeFromPgType(pgCatalog, pgType) {
    if (!pgCatalog.hasType(pgType))
        throw new Error("Postgres type of name '" + pgType.name + "' and id '" + pgType.id + "' does not exist.");
    // If our type id was hardcoded to have a certain type, use it.
    if (pgTypeIdToType.has(pgType.id))
        return new PgNullableType_1.default(pgTypeIdToType.get(pgType.id));
    // If the type is one of these kinds, it is a special case and should be
    // treated as such.
    switch (pgType.type) {
        // If this type is a composite type…
        case 'c': {
            var pgClass = pgCatalog.assertGetClass(pgType.classId);
            var objectType = new PgClassType_1.default(pgCatalog, pgClass);
            return new PgNullableType_1.default(objectType);
        }
        // If this type is a domain type…
        case 'd': {
            var pgBaseType = pgCatalog.assertGetType(pgType.domainBaseTypeId);
            var baseType = getTypeFromPgType(pgCatalog, pgBaseType);
            var aliasType = new PgAliasType_1.default({
                name: pgType.name,
                description: pgType.description,
                baseType: interface_1.getNonNullableType(baseType),
            });
            return pgType.domainIsNotNull ? aliasType : new PgNullableType_1.default(aliasType);
        }
        // If this type is an enum type…
        case 'e': {
            return new PgNullableType_1.default(new PgEnumType_1.default({
                name: pgType.name,
                description: pgType.description,
                variants: new Set(pgType.enumVariants),
            }));
        }
        // If this type is a range type…
        // TODO: test
        case 'r':
            return new PgNullableType_1.default(new PgRangeType_1.default(pgCatalog, pgType));
        default: {
        }
    }
    // If the type isn’t of a certain kind, let’s use the category which is used
    // for coercion in the parser.
    switch (pgType.category) {
        // If our type is of the array category, return a list type.
        case 'A': {
            if (!pgType.arrayItemTypeId)
                throw new Error('PostgreSql array type does not have an associated element type.');
            var itemType = pgCatalog.assertGetType(pgType.arrayItemTypeId);
            return new PgNullableType_1.default(new PgListType_1.default(getTypeFromPgType(pgCatalog, itemType)));
        }
        case 'B':
            return new PgNullableType_1.default(pgBooleanType_1.default);
        // If our type is of the number category, return a float type. We check
        // for integers with `pgTypeIdToType`.
        case 'N':
            return new PgNullableType_1.default(pgFloatType_1.default);
        default: {
        }
    }
    // If all else fails, we just return a nullable string :)
    return new PgNullableType_1.default(pgStringType_1.default);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0VHlwZUZyb21QZ1R5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvZ2V0VHlwZUZyb21QZ1R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGdEQUFrRTtBQUNsRSxxQ0FBc0M7QUFHdEMsMkRBQXFEO0FBQ3JELDZDQUF1QztBQUN2Qyw2Q0FBdUM7QUFDdkMsd0RBQWtEO0FBQ2xELHdEQUFrRDtBQUNsRCxvREFBOEM7QUFDOUMsc0RBQWdEO0FBQ2hELGtEQUE0QztBQUM1QyxzREFBZ0Q7QUFDaEQsa0RBQTRDO0FBQzVDLDBEQUFvRDtBQUNwRCxrREFBNEM7QUFDNUMsa0RBQTRDO0FBQzVDLDBEQUFvRDtBQUVwRCxtREFBNkM7QUFDN0MsNkNBQXVDO0FBQ3ZDLDJDQUFxQztBQUNyQywyQ0FBcUM7QUFFckM7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILElBQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUF3QjtJQUNwRCxDQUFDLElBQUksRUFBRSxzQkFBWSxDQUFDO0lBQ3BCLENBQUMsSUFBSSxFQUFFLHVCQUFhLENBQUM7SUFDckIsQ0FBQyxJQUFJLEVBQUUsdUJBQWEsQ0FBQztJQUNyQixDQUFDLEtBQUssRUFBRSxvQkFBVSxDQUFDO0lBQ25CLENBQUMsTUFBTSxFQUFFLG9CQUFVLENBQUM7SUFDcEIsQ0FBQyxNQUFNLEVBQUUsb0JBQVUsQ0FBQztJQUNwQixDQUFDLE1BQU0sRUFBRSxvQkFBVSxDQUFDO0lBQ3BCLENBQUMsTUFBTSxFQUFFLHdCQUFjLENBQUM7SUFDeEIsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQztJQUN4QixDQUFDLE1BQU0sRUFBRSxvQkFBVSxDQUFDO0lBQ3BCLENBQUMsTUFBTSxFQUFFLG9CQUFVLENBQUM7SUFDcEIsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQztDQUN6QixDQUFDLENBQUE7QUFFRixJQUFNLGtCQUFrQixHQUFHLGdC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