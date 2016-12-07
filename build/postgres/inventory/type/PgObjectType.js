"use strict";
const interface_1 = require('../../../interface');
const transformPgValueIntoValue_1 = require('../transformPgValueIntoValue');
const getTypeFromPgType_1 = require('./getTypeFromPgType');
/**
 * `PgObjectType` is very much like `ObjectType` except it does a few extra
 * Postgres related things. First it takes a set of `PgCatalogAttribute`s and
 * uses that to setup the type’s fields instead of expecting the fields to be
 * manually defined every time.
 *
 * This type also adds a custom field type which contains a few extra
 * properties. Such as the `PgCatalogAttribute` that was used to make the
 * field.
 *
 * Users of this type are still expected to provide their own name and
 * description.
 */
// TODO: Refactor this and `PgClassObjectType`
class PgObjectType extends interface_1.ObjectType {
    constructor(config) {
        super({
            name: config.name,
            description: config.description,
            fields: new Map(
            // Creates fields using the provided `pgAttributes` array.
            Array.from(Array.isArray(config.pgAttributes)
                ? new Map(config.pgAttributes.map(pgAttribute => [pgAttribute.name, pgAttribute]))
                : config.pgAttributes).map(([fieldName, pgAttribute]) => [fieldName, {
                    description: pgAttribute.description,
                    // Make sure that if our attribute specifies that it is non-null,
                    // that we remove the types nullable wrapper if it exists.
                    type: (() => {
                        const pgType = config.pgCatalog.assertGetType(pgAttribute.typeId);
                        const type = getTypeFromPgType_1.default(config.pgCatalog, pgType);
                        // If the attribute is not null, but the type we got was
                        // nullable, extract the non null variant and return that.
                        if (pgAttribute.isNotNull && type instanceof interface_1.NullableType)
                            return type.nonNullType;
                        return type;
                    })(),
                    // Pass along the `hasDefault` information.
                    hasDefault: pgAttribute.hasDefault,
                    // Notice how we add an extra `pgAttribute` property here as per
                    // our custom field type.
                    pgAttribute,
                }])),
        });
        /**
         * Private maps which act as indexes of the relationship between field names
         * and Postgres attribute names.
         *
         * @private
         */
        this._fieldNameToPgAttributeName = new Map();
        this._pgAttributeNameToFieldName = new Map();
        // Create our indexes of `fieldName` to `pgAttribute.name`. We can use
        // these indexes to rename keys where appropriate.
        for (const [fieldName, { pgAttribute }] of this.fields) {
            if (this._pgAttributeNameToFieldName.has(pgAttribute.name))
                throw new Error('Cannot use a Postgres attribute with the same name twice in a single object type.');
            this._fieldNameToPgAttributeName.set(fieldName, pgAttribute.name);
            this._pgAttributeNameToFieldName.set(pgAttribute.name, fieldName);
        }
    }
    /**
     * Converts a row returned by Postgres into the correct value object.
     */
    [transformPgValueIntoValue_1.$$transformPgValueIntoValue](row) {
        const value = new Map();
        for (const [fieldName, { type: fieldType, pgAttribute }] of this.fields)
            value.set(fieldName, transformPgValueIntoValue_1.default(fieldType, row[pgAttribute.name]));
        return value;
    }
    /**
     * Converts a field name into the appropriate Postgres attribute name.
     */
    getPgAttributeNameFromFieldName(fieldName) {
        return this._fieldNameToPgAttributeName.get(fieldName);
    }
    /**
     * Converts a Postgres attribute name to the appropriate field name.
     */
    getFieldNameFromPgAttributeName(pgAttributeName) {
        return this._pgAttributeNameToFieldName.get(pgAttributeName);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgObjectType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdPYmplY3RUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludmVudG9yeS90eXBlL1BnT2JqZWN0VHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNEJBQXlDLG9CQUN6QyxDQUFDLENBRDREO0FBRTdELDRDQUF1RSw4QkFDdkUsQ0FBQyxDQURvRztBQUNyRyxvQ0FBOEIscUJBZ0I5QixDQUFDLENBaEJrRDtBQUVuRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCw4Q0FBOEM7QUFDOUMsMkJBQTJCLHNCQUFVO0lBYW5DLFlBQWEsTUFLWjtRQUNDLE1BQU07WUFDSixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7WUFDakIsV0FBVyxFQUFFLE1BQU0sQ0FBQyxXQUFXO1lBQy9CLE1BQU0sRUFBRSxJQUFJLEdBQUc7WUFDYiwwREFBMEQ7WUFDMUQsS0FBSyxDQUFDLElBQUksQ0FDUixLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUM7a0JBQzlCLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUErQixXQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7a0JBQzlHLE1BQU0sQ0FBQyxZQUFZLENBQ3hCLENBQUMsR0FBRyxDQUFzQyxDQUFDLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxLQUNsRSxDQUFDLFNBQVMsRUFBRTtvQkFDVixXQUFXLEVBQUUsV0FBVyxDQUFDLFdBQVc7b0JBRXBDLGlFQUFpRTtvQkFDakUsMERBQTBEO29CQUMxRCxJQUFJLEVBQUUsQ0FBQzt3QkFDTCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7d0JBQ2pFLE1BQU0sSUFBSSxHQUFHLDJCQUFpQixDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUE7d0JBRXhELHdEQUF3RDt3QkFDeEQsMERBQTBEO3dCQUMxRCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsU0FBUyxJQUFJLElBQUksWUFBWSx3QkFBWSxDQUFDOzRCQUN4RCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQTt3QkFFekIsTUFBTSxDQUFDLElBQUksQ0FBQTtvQkFDYixDQUFDLENBQUMsRUFBRTtvQkFFSiwyQ0FBMkM7b0JBQzNDLFVBQVUsRUFBRSxXQUFXLENBQUMsVUFBVTtvQkFFbEMsZ0VBQWdFO29CQUNoRSx5QkFBeUI7b0JBQ3pCLFdBQVc7aUJBQ1osQ0FBQyxDQUNILENBQ0Y7U0FDRixDQUFDLENBQUE7UUFuREo7Ozs7O1dBS0c7UUFDSyxnQ0FBMkIsR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUM1RCxnQ0FBMkIsR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQThDbEUsc0VBQXNFO1FBQ3RFLGtEQUFrRDtRQUNsRCxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN2RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDekQsTUFBTSxJQUFJLEtBQUssQ0FBQyxtRkFBbUYsQ0FBQyxDQUFBO1lBRXRHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNqRSxJQUFJLENBQUMsMkJBQTJCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUE7UUFDbkUsQ0FBQztJQUNILENBQUM7SUFFRDs7T0FFRztJQUNJLENBQUMsdURBQTJCLENBQUMsQ0FBRSxHQUE2QjtRQUNqRSxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsRUFBaUIsQ0FBQTtRQUV0QyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDdEUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsbUNBQXlCLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRW5GLE1BQU0sQ0FBQyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBRUQ7O09BRUc7SUFDSSwrQkFBK0IsQ0FBRSxTQUFpQjtRQUN2RCxNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUN4RCxDQUFDO0lBRUQ7O09BRUc7SUFDSSwrQkFBK0IsQ0FBRSxlQUF1QjtRQUM3RCxNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQTtJQUM5RCxDQUFDO0FBQ0gsQ0FBQztBQWVEO2tCQUFlLFlBQVksQ0FBQSJ9