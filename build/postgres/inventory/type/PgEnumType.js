"use strict";
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var PgType_1 = require("./PgType");
var PgEnumType = (function (_super) {
    tslib_1.__extends(PgEnumType, _super);
    function PgEnumType(_a) {
        var name = _a.name, description = _a.description, variants = _a.variants;
        var _this = _super.call(this) || this;
        _this.kind = 'ENUM';
        _this.name = name;
        _this.description = description;
        _this.variants = new Map(variants.entries());
        return _this;
    }
    PgEnumType.prototype.isTypeOf = function (value) {
        if (typeof value !== 'string')
            return false;
        return this.variants.has(value);
    };
    PgEnumType.prototype.transformPgValueIntoValue = function (pgValue) {
        if (!this.isTypeOf(pgValue))
            throw new Error("Invalid enum value '" + typeof pgValue + "'.");
        return pgValue;
    };
    PgEnumType.prototype.transformValueIntoPgValue = function (value) {
        return (_a = ["", ""], _a.raw = ["", ""], utils_1.sql.query(_a, utils_1.sql.value(value)));
        var _a;
    };
    return PgEnumType;
}(PgType_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgEnumType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdFbnVtVHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvdHlwZS9QZ0VudW1UeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscUNBQWlDO0FBQ2pDLG1DQUE2QjtBQUU3QjtJQUF5QixzQ0FBYztJQU1yQyxvQkFBYSxFQUF5RztZQUF2RyxjQUFJLEVBQUUsNEJBQVcsRUFBRSxzQkFBUTtRQUExQyxZQUNFLGlCQUFPLFNBSVI7UUFWZSxVQUFJLEdBQVcsTUFBTSxDQUFBO1FBT25DLEtBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLEtBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO1FBQzlCLEtBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7O0lBQzdDLENBQUM7SUFFTSw2QkFBUSxHQUFmLFVBQWlCLEtBQVk7UUFDM0IsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUE7UUFFZCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDakMsQ0FBQztJQUVNLDhDQUF5QixHQUFoQyxVQUFrQyxPQUFjO1FBQzlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF1QixPQUFPLE9BQU8sT0FBSSxDQUFDLENBQUE7UUFFNUQsTUFBTSxDQUFDLE9BQU8sQ0FBQTtJQUNoQixDQUFDO0lBRU0sOENBQXlCLEdBQWhDLFVBQWtDLEtBQWE7UUFDN0MsTUFBTSwyQkFBVSxFQUFHLEVBQWdCLEVBQUUsR0FBOUIsV0FBRyxDQUFDLEtBQUssS0FBRyxXQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFFOztJQUN2QyxDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLEFBOUJELENBQXlCLGdCQUFNLEdBOEI5Qjs7QUFFRCxrQkFBZSxVQUFVLENBQUEifQ==