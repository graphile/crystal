"use strict";
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var PgType_1 = require("./PgType");
var PgNullableType = (function (_super) {
    tslib_1.__extends(PgNullableType, _super);
    function PgNullableType(nonNullType) {
        var _this = _super.call(this) || this;
        // The unique type kind.
        _this.kind = 'NULLABLE';
        _this.nonNullType = nonNullType;
        return _this;
    }
    /**
     * Determines if the value passed in is the non-null variant.
     */
    PgNullableType.prototype.isNonNull = function (value) {
        return value != null;
    };
    /**
     * Checks if the value is null, if so returns true. Otherwise we run
     * `nonNullType.isTypeOf` on the value.
     */
    PgNullableType.prototype.isTypeOf = function (value) {
        return value == null || this.nonNullType.isTypeOf(value);
    };
    /**
     * Transforms a Postgres value into an internal value for this type.
     */
    PgNullableType.prototype.transformPgValueIntoValue = function (pgValue) {
        return pgValue == null ? null : this.nonNullType.transformPgValueIntoValue(pgValue);
    };
    /**
     * Transforms our internal value into a Postgres SQL query.
     */
    PgNullableType.prototype.transformValueIntoPgValue = function (value) {
        return value == null ? (_a = ["null"], _a.raw = ["null"], utils_1.sql.query(_a)) : this.nonNullType.transformValueIntoPgValue(value);
        var _a;
    };
    return PgNullableType;
}(PgType_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgNullableType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdOdWxsYWJsZVR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvUGdOdWxsYWJsZVR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxxQ0FBaUM7QUFDakMsbUNBQTZCO0FBRTdCO0lBQTRDLDBDQUF3QztJQVNsRix3QkFBYSxXQUFrQztRQUEvQyxZQUNFLGlCQUFPLFNBRVI7UUFYRCx3QkFBd0I7UUFDUixVQUFJLEdBQWUsVUFBVSxDQUFBO1FBUzNDLEtBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBOztJQUNoQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxrQ0FBUyxHQUFoQixVQUFrQixLQUF1QztRQUN2RCxNQUFNLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQTtJQUN0QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksaUNBQVEsR0FBZixVQUFpQixLQUFZO1FBQzNCLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzFELENBQUM7SUFFRDs7T0FFRztJQUNJLGtEQUF5QixHQUFoQyxVQUFrQyxPQUFjO1FBQzlDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3JGLENBQUM7SUFFRDs7T0FFRztJQUNJLGtEQUF5QixHQUFoQyxVQUFrQyxLQUF1QztRQUN2RSxNQUFNLENBQUMsS0FBSyxJQUFJLElBQUksNkJBQVksTUFBTSxHQUFmLFdBQUcsQ0FBQyxLQUFLLFFBQVMsSUFBSSxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTs7SUFDNUYsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQTFDRCxDQUE0QyxnQkFBTSxHQTBDakQ7O0FBRUQsa0JBQWUsY0FBYyxDQUFBIn0=