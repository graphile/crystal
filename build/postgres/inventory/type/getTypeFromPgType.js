"use strict";
const interface_1 = require('../../../interface');
const utils_1 = require('../../utils');
const PgCollection_1 = require('../collection/PgCollection');
const PgClassObjectType_1 = require('./PgClassObjectType');
const PgRangeObjectType_1 = require('./PgRangeObjectType');
const pgUuidType_1 = require('./individual/pgUuidType');
const pgDatetimeType_1 = require('./individual/pgDatetimeType');
const pgDateType_1 = require('./individual/pgDateType');
const pgTimeType_1 = require('./individual/pgTimeType');
const pgIntervalType_1 = require('./individual/pgIntervalType');
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
const pgTypeIdToType = new Map([
    ['20', interface_1.integerType],
    ['21', interface_1.integerType],
    ['23', interface_1.integerType],
    ['114', interface_1.jsonType],
    ['3802', interface_1.jsonType],
    ['2950', pgUuidType_1.default],
    ['1082', pgDateType_1.default],
    ['1114', pgDatetimeType_1.default],
    ['1184', pgDatetimeType_1.default],
    ['1083', pgTimeType_1.default],
    ['1266', pgTimeType_1.default],
    ['1186', pgIntervalType_1.default],
]);
const _getTypeFromPgType = utils_1.memoize2(createTypeFromPgType);
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
        const collection = _inventory.getCollections().find(collection => collection instanceof PgCollection_1.default && collection.pgClass.typeId === pgType.id);
        if (collection)
            return new interface_1.NullableType(collection.type);
    }
    return _getTypeFromPgType(pgCatalog, pgType);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getTypeFromPgType;
function createTypeFromPgType(pgCatalog, pgType) {
    if (!pgCatalog.hasType(pgType))
        throw new Error(`Postgres type of name '${pgType.name}' and id '${pgType.id}' does not exist.`);
    // If our type id was hardcoded to have a certain type, use it.
    if (pgTypeIdToType.has(pgType.id))
        return new interface_1.NullableType(pgTypeIdToType.get(pgType.id));
    // If the type is one of these kinds, it is a special case and should be
    // treated as such.
    switch (pgType.type) {
        // If this type is a composite type…
        case 'c': {
            const pgClass = pgCatalog.assertGetClass(pgType.classId);
            const objectType = new PgClassObjectType_1.default(pgCatalog, pgClass);
            return new interface_1.NullableType(objectType);
        }
        // If this type is a domain type…
        case 'd': {
            const pgBaseType = pgCatalog.assertGetType(pgType.domainBaseTypeId);
            const baseType = getTypeFromPgType(pgCatalog, pgBaseType);
            const aliasType = new interface_1.AliasType({
                name: pgType.name,
                description: pgType.description,
                baseType: baseType instanceof interface_1.NullableType ? baseType.nonNullType : baseType,
            });
            return pgType.domainIsNotNull ? aliasType : new interface_1.NullableType(aliasType);
        }
        // If this type is an enum type…
        case 'e': {
            return new interface_1.NullableType(new interface_1.EnumType({
                name: pgType.name,
                description: pgType.description,
                variants: new Set(pgType.enumVariants),
            }));
        }
        // If this type is a range type…
        // TODO: test
        case 'r':
            return new PgRangeObjectType_1.default(pgCatalog, pgType);
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
            const itemType = pgCatalog.assertGetType(pgType.arrayItemTypeId);
            return new interface_1.NullableType(new interface_1.ListType(getTypeFromPgType(pgCatalog, itemType)));
        }
        case 'B':
            return new interface_1.NullableType(interface_1.booleanType);
        // If our type is of the number category, return a float type. We check
        // for integers with `pgTypeIdToType`.
        case 'N':
            return new interface_1.NullableType(interface_1.floatType);
        default: {
        }
    }
    // If all else fails, we just return a nullable string :)
    return new interface_1.NullableType(interface_1.stringType);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0VHlwZUZyb21QZ1R5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvZ2V0VHlwZUZyb21QZ1R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRCQVlPLG9CQUNQLENBQUMsQ0FEMEI7QUFDM0Isd0JBQXlCLGFBQ3pCLENBQUMsQ0FEcUM7QUFHdEMsK0JBQXlCLDRCQUN6QixDQUFDLENBRG9EO0FBQ3JELG9DQUE4QixxQkFDOUIsQ0FBQyxDQURrRDtBQUNuRCxvQ0FBOEIscUJBQzlCLENBQUMsQ0FEa0Q7QUFDbkQsNkJBQXVCLHlCQUN2QixDQUFDLENBRCtDO0FBQ2hELGlDQUEyQiw2QkFDM0IsQ0FBQyxDQUR1RDtBQUN4RCw2QkFBdUIseUJBQ3ZCLENBQUMsQ0FEK0M7QUFDaEQsNkJBQXVCLHlCQUN2QixDQUFDLENBRCtDO0FBQ2hELGlDQUEyQiw2QkFnQjNCLENBQUMsQ0FoQnVEO0FBRXhEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBc0I7SUFDbEQsQ0FBQyxJQUFJLEVBQUUsdUJBQVcsQ0FBQztJQUNuQixDQUFDLElBQUksRUFBRSx1QkFBVyxDQUFDO0lBQ25CLENBQUMsSUFBSSxFQUFFLHVCQUFXLENBQUM7SUFDbkIsQ0FBQyxLQUFLLEVBQUUsb0JBQVEsQ0FBQztJQUNqQixDQUFDLE1BQU0sRUFBRSxvQkFBUSxDQUFDO0lBQ2xCLENBQUMsTUFBTSxFQUFFLG9CQUFVLENBQUM7SUFDcEIsQ0FBQyxNQUFNLEVBQUUsb0JBQVUsQ0FBQztJQUNwQixDQUFDLE1BQU0sRUFBRSx3QkFBYyxDQUFDO0lBQ3hCLENBQUMsTUFBTSxFQUFFLHdCQUFjLENBQUM7SUFDeEIsQ0FBQyxNQUFNLEVBQUUsb0JBQVUsQ0FBQztJQUNwQixDQUFDLE1BQU0sRUFBRSxvQkFBVSxDQUFDO0lBQ3BCLENBQUMsTUFBTSxFQUFFLHdC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