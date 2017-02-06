"use strict";
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var PgType_1 = require("./PgType");
var PgListType = (function (_super) {
    tslib_1.__extends(PgListType, _super);
    function PgListType(itemType) {
        var _this = _super.call(this) || this;
        _this.kind = 'LIST';
        _this.itemType = itemType;
        return _this;
    }
    PgListType.prototype.isTypeOf = function (value) {
        var _this = this;
        if (!Array.isArray(value))
            return false;
        return value.reduce(function (same, item) { return same && _this.itemType.isTypeOf(item); }, true);
    };
    PgListType.prototype.intoArray = function (value) {
        return value;
    };
    PgListType.prototype.fromArray = function (value) {
        return value;
    };
    PgListType.prototype.transformPgValueIntoValue = function (pgValue) {
        var _this = this;
        if (!Array.isArray(pgValue))
            throw new Error("Expected array value from Postgres. Not '" + typeof pgValue + "'.");
        return pgValue.map(function (item) { return _this.itemType.transformPgValueIntoValue(item); });
    };
    PgListType.prototype.transformValueIntoPgValue = function (value) {
        var _this = this;
        return (_a = ["array[", "]"], _a.raw = ["array[", "]"], utils_1.sql.query(_a, utils_1.sql.join(value.map(function (item) { return _this.itemType.transformValueIntoPgValue(item); }), ', ')));
        var _a;
    };
    return PgListType;
}(PgType_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgListType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdMaXN0VHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvdHlwZS9QZ0xpc3RUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscUNBQWlDO0FBQ2pDLG1DQUE2QjtBQUU3QjtJQUFxQyxzQ0FBeUI7SUFJNUQsb0JBQWEsUUFBNEI7UUFBekMsWUFDRSxpQkFBTyxTQUVSO1FBTmUsVUFBSSxHQUFXLE1BQU0sQ0FBQTtRQUtuQyxLQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTs7SUFDMUIsQ0FBQztJQUVNLDZCQUFRLEdBQWYsVUFBaUIsS0FBWTtRQUE3QixpQkFLQztRQUpDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixNQUFNLENBQUMsS0FBSyxDQUFBO1FBRWQsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUUsSUFBSSxJQUFLLE9BQUEsSUFBSSxJQUFJLEtBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFwQyxDQUFvQyxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ2pGLENBQUM7SUFFTSw4QkFBUyxHQUFoQixVQUFrQixLQUF3QjtRQUN4QyxNQUFNLENBQUMsS0FBSyxDQUFBO0lBQ2QsQ0FBQztJQUVNLDhCQUFTLEdBQWhCLFVBQWtCLEtBQXdCO1FBQ3hDLE1BQU0sQ0FBQyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBRU0sOENBQXlCLEdBQWhDLFVBQWtDLE9BQWM7UUFBaEQsaUJBS0M7UUFKQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBNEMsT0FBTyxPQUFPLE9BQUksQ0FBQyxDQUFBO1FBRWpGLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsS0FBSSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsRUFBN0MsQ0FBNkMsQ0FBQyxDQUFBO0lBQzNFLENBQUM7SUFFTSw4Q0FBeUIsR0FBaEMsVUFBa0MsS0FBd0I7UUFBMUQsaUJBRUM7UUFEQyxNQUFNLGtDQUFVLFFBQVMsRUFBZ0YsR0FBRyxHQUFyRyxXQUFHLENBQUMsS0FBSyxLQUFTLFdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLEtBQUksQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLEVBQTdDLENBQTZDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRzs7SUFDOUcsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQWxDRCxDQUFxQyxnQkFBTSxHQWtDMUM7O0FBRUQsa0JBQWUsVUFBVSxDQUFBIn0=