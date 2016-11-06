"use strict";
const interface_1 = require('../../../interface');
// TODO: This implementation is sketchy. Implement it better!
// TODO: Tests
class PgRelation {
    constructor(tailCollection, headCollectionKey, pgConstraint) {
        this.tailCollection = tailCollection;
        this.headCollectionKey = headCollectionKey;
        this.pgConstraint = pgConstraint;
        this._pgCatalog = this.tailCollection._pgCatalog;
        this._pgTailAttributes = this._pgCatalog.getClassAttributes(this.pgConstraint.classId, this.pgConstraint.keyAttributeNums);
        this._tailFieldNames = this._pgTailAttributes.map(pgAttribute => this.tailCollection.type.getFieldNameFromPgAttributeName(pgAttribute.name));
        this._headFieldNames = Array.from(this.headCollectionKey.keyType.fields.keys());
        /**
         * Construct the name for this relation using the native Postgres foreign key
         * constraint attributes.
         */
        this.name = this._tailFieldNames.join('_and_');
    }
    /**
     * Gets an instance of the head collection’s key type by just extracting some
     * keys from the tail value.
     */
    getHeadKeyFromTailValue(tailValue) {
        return this._tailFieldNames.reduce((headKey, tailFieldName, i) => {
            headKey.set(this._headFieldNames[i], tailValue.get(tailFieldName));
            return headKey;
        }, new Map());
    }
    /**
     * Gets a condition from the head value which basically just requires that
     * the fields equal the right things.
     */
    getTailConditionFromHeadValue(headValue) {
        return interface_1.conditionHelpers.and(...this._headFieldNames.map((headFieldName, i) => interface_1.conditionHelpers.fieldEquals(this._tailFieldNames[i], headValue.get(headFieldName))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgRelation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdSZWxhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvY29sbGVjdGlvbi9QZ1JlbGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0QkFBc0Qsb0JBQ3RELENBQUMsQ0FEeUU7QUFNMUUsNkRBQTZEO0FBQzdELGNBQWM7QUFDZDtJQUNFLFlBQ1MsY0FBNEIsRUFDNUIsaUJBQWtDLEVBQ2xDLFlBQTJDO1FBRjNDLG1CQUFjLEdBQWQsY0FBYyxDQUFjO1FBQzVCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBaUI7UUFDbEMsaUJBQVksR0FBWixZQUFZLENBQStCO1FBRzVDLGVBQVUsR0FBYyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQTtRQUN0RCxzQkFBaUIsR0FBOEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFDaEosb0JBQWUsR0FBa0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUE7UUFDdkosb0JBQWUsR0FBa0IsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBRWpHOzs7V0FHRztRQUNhLFNBQUksR0FBVyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQVg5RCxDQUFDO0lBYUo7OztPQUdHO0lBQ0ksdUJBQXVCLENBQUUsU0FBNkI7UUFDM0QsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFDO1lBQzNELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUE7WUFDbEUsTUFBTSxDQUFDLE9BQU8sQ0FBQTtRQUNoQixDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFBO0lBQ2YsQ0FBQztJQUVEOzs7T0FHRztJQUNJLDZCQUE2QixDQUFFLFNBQTZCO1FBQ2pFLE1BQU0sQ0FBQyw0QkFBZ0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQ3ZFLDRCQUFnQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FDcEYsQ0FBQyxDQUFBO0lBQ0osQ0FBQztBQUNILENBQUM7QUFFRDtrQkFBZSxVQUFVLENBQUEifQ==