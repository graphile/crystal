"use strict";
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var pgClientFromContext_1 = require("../pgClientFromContext");
/**
 * An abstract base paginator class for Postgres. This class also exposes a
 * couple of methods that are helpful for our orderings.
 */
var PgPaginator = (function () {
    function PgPaginator() {
    }
    /**
     * Counts how many values are in our `from` entry total.
     */
    PgPaginator.prototype.count = function (context, input) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var client, fromSql, conditionSql, aliasIdentifier, result, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        client = pgClientFromContext_1.default(context);
                        fromSql = this.getFromEntrySql(input);
                        conditionSql = this.getConditionSql(input);
                        aliasIdentifier = Symbol();
                        return [4 /*yield*/, client.query(utils_1.sql.compile((_a = ["select count(", ") as count from ", " as ", " where ", ""], _a.raw = ["select count(", ") as count from ", " as ", " where ", ""], utils_1.sql.query(_a, utils_1.sql.identifier(aliasIdentifier), fromSql, utils_1.sql.identifier(aliasIdentifier), conditionSql))))];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, parseInt(result.rows[0]['count'], 10)];
                }
            });
        });
    };
    return PgPaginator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgPaginator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdQYWdpbmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3BhZ2luYXRvci9QZ1BhZ2luYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFDQUFpQztBQUVqQyw4REFBd0Q7QUFFeEQ7OztHQUdHO0FBQ0g7SUFBQTtJQThCQSxDQUFDO0lBWEM7O09BRUc7SUFDVSwyQkFBSyxHQUFsQixVQUFvQixPQUFjLEVBQUUsS0FBYTs7Z0JBQ3pDLE1BQU0sRUFDTixPQUFPLEVBQ1AsWUFBWSxFQUNaLGVBQWU7Ozs7aUNBSE4sNkJBQW1CLENBQUMsT0FBTyxDQUFDO2tDQUMzQixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQzt1Q0FDdEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUM7MENBQ3hCLE1BQU0sRUFBRTt3QkFDakIscUJBQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFHLENBQUMsT0FBTywrRUFBVSxlQUFnQixFQUErQixrQkFBbUIsRUFBTyxNQUFPLEVBQStCLFNBQVUsRUFBWSxFQUFFLEdBQWhKLFdBQUcsQ0FBQyxLQUFLLEtBQWdCLFdBQUcsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEVBQW1CLE9BQU8sRUFBTyxXQUFHLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxFQUFVLFlBQVksR0FBRyxDQUFDLEVBQUE7O2lDQUFqTCxTQUFpTDt3QkFDaE0sc0JBQU8sUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUE7Ozs7S0FDN0M7SUFDSCxrQkFBQztBQUFELENBQUMsQUE5QkQsSUE4QkM7O0FBRUQsa0JBQWUsV0FBVyxDQUFBIn0=