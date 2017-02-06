"use strict";
var tslib_1 = require("tslib");
var PgType_1 = require("./PgType");
var PgAliasType = (function (_super) {
    tslib_1.__extends(PgAliasType, _super);
    function PgAliasType(_a) {
        var name = _a.name, description = _a.description, baseType = _a.baseType;
        var _this = _super.call(this) || this;
        _this.kind = 'ALIAS';
        _this.name = name;
        _this.description = description;
        _this.baseType = baseType;
        return _this;
    }
    PgAliasType.prototype.isTypeOf = function (value) {
        return this.baseType.isTypeOf(value);
    };
    PgAliasType.prototype.transformPgValueIntoValue = function (pgValue) {
        return this.baseType.transformPgValueIntoValue(pgValue);
    };
    PgAliasType.prototype.transformValueIntoPgValue = function (value) {
        return this.baseType.transformValueIntoPgValue(value);
    };
    return PgAliasType;
}(PgType_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgAliasType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdBbGlhc1R5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvUGdBbGlhc1R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxtQ0FBNkI7QUFFN0I7SUFBa0MsdUNBQWM7SUFNOUMscUJBQWEsRUFBNEc7WUFBMUcsY0FBSSxFQUFFLDRCQUFXLEVBQUUsc0JBQVE7UUFBMUMsWUFDRSxpQkFBTyxTQUlSO1FBVmUsVUFBSSxHQUFZLE9BQU8sQ0FBQTtRQU9yQyxLQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixLQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtRQUM5QixLQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTs7SUFDMUIsQ0FBQztJQUVNLDhCQUFRLEdBQWYsVUFBaUIsS0FBWTtRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDdEMsQ0FBQztJQUVNLCtDQUF5QixHQUFoQyxVQUFrQyxPQUFjO1FBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3pELENBQUM7SUFFTSwrQ0FBeUIsR0FBaEMsVUFBa0MsS0FBYTtRQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUN2RCxDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBeEJELENBQWtDLGdCQUFNLEdBd0J2Qzs7QUFFRCxrQkFBZSxXQUFXLENBQUEifQ==