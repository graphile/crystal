"use strict";
var interface_1 = require("../../../interface");
var utils_1 = require("../../utils");
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
    PgRelation.prototype.getTailConditionFromHeadAlias = function (aliasIdentifier) {
        var _this = this;
        return interface_1.conditionHelpers.and.apply(interface_1.conditionHelpers, this._headFieldNames.map(function (headFieldName, i) {
            return interface_1.conditionHelpers.fieldEqualsQuery(_this._tailFieldNames[i], (_a = ["", ".", ""], _a.raw = ["", ".", ""], utils_1.sql.query(_a, utils_1.sql.identifier(aliasIdentifier), utils_1.sql.identifier(headFieldName))));
            var _a;
        }));
    };
    return PgRelation;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgRelation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdSZWxhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvY29sbGVjdGlvbi9QZ1JlbGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxnREFBMEU7QUFLMUUscUNBQWlDO0FBRWpDLDZEQUE2RDtBQUM3RCxjQUFjO0FBQ2Q7SUFDRSxvQkFDUyxjQUE0QixFQUM1QixpQkFBa0MsRUFDbEMsWUFBMkM7UUFIcEQsaUJBSUk7UUFISyxtQkFBYyxHQUFkLGNBQWMsQ0FBYztRQUM1QixzQkFBaUIsR0FBakIsaUJBQWlCLENBQWlCO1FBQ2xDLGlCQUFZLEdBQVosWUFBWSxDQUErQjtRQUc1QyxlQUFVLEdBQWMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUE7UUFDdEQsc0JBQWlCLEdBQThCLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1FBQ2hKLG9CQUFlLEdBQWtCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsVUFBQSxXQUFXLElBQUksT0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEVBQVM7Z0JBQU4sYUFBSztZQUFNLE9BQUEsS0FBSyxDQUFDLFdBQVcsS0FBSyxXQUFXO1FBQWpDLENBQWlDLENBQUUsQ0FBQyxDQUFDLENBQUMsRUFBdEcsQ0FBc0csQ0FBQyxDQUFBO1FBQ2xMLG9CQUFlLEdBQWtCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtRQUVqRzs7O1dBR0c7UUFDYSxTQUFJLEdBQVcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFYOUQsQ0FBQztJQWFKOzs7T0FHRztJQUNJLDRDQUF1QixHQUE5QixVQUFnQyxTQUE0QjtRQUE1RCxpQkFLQztRQUpDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxVQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsQ0FBQztZQUMzRCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBO1lBQ2xFLE1BQU0sQ0FBQyxPQUFPLENBQUE7UUFDaEIsQ0FBQyxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQTtJQUNmLENBQUM7SUFFRDs7O09BR0c7SUFDSSxrREFBNkIsR0FBcEMsVUFBc0MsU0FBNEI7UUFBbEUsaUJBSUM7UUFIQyxNQUFNLENBQUMsNEJBQWdCLENBQUMsR0FBRyxPQUFwQiw0QkFBZ0IsRUFBUSxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3ZFLE9BQUEsNEJBQWdCLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUFuRixDQUFtRixDQUNwRixFQUFDO0lBQ0osQ0FBQztJQUVNLGtEQUE2QixHQUFwQyxVQUFzQyxlQUFlO1FBQXJELGlCQUlDO1FBSEMsTUFBTSxDQUFDLDRCQUFnQixDQUFDLEdBQUcsT0FBcEIsNEJBQWdCLEVBQVEsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsVUFBQyxhQUFhLEVBQUUsQ0FBQztZQUN2RSxPQUFBLDRCQUFnQixDQUFDLGdCQUFnQixDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGlDQUFXLEVBQUcsRUFBK0IsR0FBSSxFQUE2QixFQUFFLEdBQTlFLFdBQUcsQ0FBQyxLQUFLLEtBQUcsV0FBRyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsRUFBSSxXQUFHLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHOztRQUExSSxDQUEwSSxDQUMzSSxFQUFDO0lBQ0osQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQTVDRCxJQTRDQzs7QUFFRCxrQkFBZSxVQUFVLENBQUEifQ==