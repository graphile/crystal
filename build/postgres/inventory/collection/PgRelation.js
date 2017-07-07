"use strict";
var interface_1 = require("../../../interface");
// TODO: This implementation is sketchy. Implement it better!
// TODO: Tests
var PgRelation = (function () {
    function PgRelation(tailCollection, headCollectionKey, pgConstraint) {
        var _this = this;
        this.tailCollection = tailCollection;
        this.headCollectionKey = headCollectionKey;
        this.pgConstraint = pgConstraint;
        this._pgCatalog = this.tailCollection._pgCatalog;
        this._pgTailAttributes = this._pgCatalog.getClassAttributes(this.pgConstraint.classId, this.pgConstraint.keyAttributeNums);
        this._tailFieldNames = this._pgTailAttributes.map(function (pgAttribute) { return Array.from(_this.tailCollection.type.fields).find(function (_a) {
            var field = _a[1];
            return field.pgAttribute === pgAttribute;
        })[0]; });
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
    PgRelation.prototype.getHeadKeyFromTailValue = function (tailValue) {
        var _this = this;
        return this._tailFieldNames.reduce(function (headKey, tailFieldName, i) {
            headKey.set(_this._headFieldNames[i], tailValue.get(tailFieldName));
            return headKey;
        }, new Map());
    };
    /**
     * Gets a condition from the head value which basically just requires that
     * the fields equal the right things.
     */
    PgRelation.prototype.getTailConditionFromHeadValue = function (headValue) {
        var _this = this;
        return interface_1.conditionHelpers.and.apply(interface_1.conditionHelpers, this._headFieldNames.map(function (headFieldName, i) {
            return interface_1.conditionHelpers.fieldEquals(_this._tailFieldNames[i], headValue.get(headFieldName));
        }));
    };
    return PgRelation;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgRelation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdSZWxhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvY29sbGVjdGlvbi9QZ1JlbGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxnREFBMEU7QUFNMUUsNkRBQTZEO0FBQzdELGNBQWM7QUFDZDtJQUNFLG9CQUNTLGNBQTRCLEVBQzVCLGlCQUFrQyxFQUNsQyxZQUEyQztRQUhwRCxpQkFJSTtRQUhLLG1CQUFjLEdBQWQsY0FBYyxDQUFjO1FBQzVCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBaUI7UUFDbEMsaUJBQVksR0FBWixZQUFZLENBQStCO1FBRzVDLGVBQVUsR0FBYyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQTtRQUN0RCxzQkFBaUIsR0FBOEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFDaEosb0JBQWUsR0FBa0IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxVQUFBLFdBQVcsSUFBSSxPQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsRUFBUztnQkFBTixhQUFLO1lBQU0sT0FBQSxLQUFLLENBQUMsV0FBVyxLQUFLLFdBQVc7UUFBakMsQ0FBaUMsQ0FBRSxDQUFDLENBQUMsQ0FBQyxFQUF0RyxDQUFzRyxDQUFDLENBQUE7UUFDbEwsb0JBQWUsR0FBa0IsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBRWpHOzs7V0FHRztRQUNhLFNBQUksR0FBVyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQVg5RCxDQUFDO0lBYUo7OztPQUdHO0lBQ0ksNENBQXVCLEdBQTlCLFVBQWdDLFNBQTRCO1FBQTVELGlCQUtDO1FBSkMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxDQUFDO1lBQzNELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUE7WUFDbEUsTUFBTSxDQUFDLE9BQU8sQ0FBQTtRQUNoQixDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFBO0lBQ2YsQ0FBQztJQUVEOzs7T0FHRztJQUNJLGtEQUE2QixHQUFwQyxVQUFzQyxTQUE0QjtRQUFsRSxpQkFJQztRQUhDLE1BQU0sQ0FBQyw0QkFBZ0IsQ0FBQyxHQUFHLE9BQXBCLDRCQUFnQixFQUFRLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFVBQUMsYUFBYSxFQUFFLENBQUM7WUFDdkUsT0FBQSw0QkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQW5GLENBQW1GLENBQ3BGLEVBQUM7SUFDSixDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBdENELElBc0NDOztBQUVELGtCQUFlLFVBQVUsQ0FBQSJ9