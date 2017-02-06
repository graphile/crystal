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
    ['20', pgIntegerType_1.default],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0VHlwZUZyb21QZ1R5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvZ2V0VHlwZUZyb21QZ1R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGdEQUFrRTtBQUNsRSxxQ0FBc0M7QUFHdEMsMkRBQXFEO0FBQ3JELDZDQUF1QztBQUN2Qyw2Q0FBdUM7QUFDdkMsd0RBQWtEO0FBQ2xELHdEQUFrRDtBQUNsRCxvREFBOEM7QUFDOUMsc0RBQWdEO0FBQ2hELGtEQUE0QztBQUM1QyxrREFBNEM7QUFDNUMsMERBQW9EO0FBQ3BELGtEQUE0QztBQUM1QyxrREFBNEM7QUFDNUMsMERBQW9EO0FBRXBELG1EQUE2QztBQUM3Qyw2Q0FBdUM7QUFDdkMsMkNBQXFDO0FBQ3JDLDJDQUFxQztBQUVyQzs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsSUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQXdCO0lBQ3BELENBQUMsSUFBSSxFQUFFLHVCQUFhLENBQUM7SUFDckIsQ0FBQyxJQUFJLEVBQUUsdUJBQWEsQ0FBQztJQUNyQixDQUFDLElBQUksRUFBRSx1QkFBYSxDQUFDO0lBQ3JCLENBQUMsS0FBSyxFQUFFLG9CQUFVLENBQUM7SUFDbkIsQ0FBQyxNQUFNLEVBQUUsb0JBQVUsQ0FBQztJQUNwQixDQUFDLE1BQU0sRUFBRSxvQkFBVSxDQUFDO0lBQ3BCLENBQUMsTUFBTSxFQUFFLG9CQUFVLENBQUM7SUFDcEIsQ0FBQyxNQUFNLEVBQUUsd0JBQWMsQ0FBQztJQUN4QixDQUFDLE1BQU0sRUFBRSx3QkFBYyxDQUFDO0lBQ3hCLENBQUMsTUFBTSxFQUFFLG9CQUFVLENBQUM7SUFDcEIsQ0FBQyxNQUFNLEVBQUUsb0JBQVUsQ0FBQztJQUNwQixDQUFDLE1BQU0sRUFBRSx3QkFBYyxDQUFDO0NBQ3pCLENBQUMsQ0FBQTtBQUVGLElBQU0sa0JBQWtCLEdBQUcsZ0JBQVEsQ0FBQyxvQkFB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