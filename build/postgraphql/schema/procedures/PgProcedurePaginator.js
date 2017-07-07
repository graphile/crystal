"use strict";
var tslib_1 = require("tslib");
var utils_1 = require("../../../postgres/utils");
var PgPaginator_1 = require("../../../postgres/inventory/paginator/PgPaginator");
var PgPaginatorOrderingOffset_1 = require("../../../postgres/inventory/paginator/PgPaginatorOrderingOffset");
var createPgProcedureSqlCall_1 = require("./createPgProcedureSqlCall");
/**
 * A procedure paginator is one in which a Postgres function is the source of
 * all values.
 */
var PgProcedurePaginator = (function (_super) {
    tslib_1.__extends(PgProcedurePaginator, _super);
    function PgProcedurePaginator(_fixtures) {
        var _this = _super.call(this) || this;
        _this._fixtures = _fixtures;
        _this.name = _this._fixtures.pgProcedure.name;
        _this.itemType = _this._fixtures.return.type;
        /**
         * The different ways we can order our procedure. Of course we can order the
         * procedure the natural way, but also we should be able to order by
         * attributes if returned a class.
         */
        // TODO: Add attribute orderings if a class gets returned.
        _this.orderings = (new Map([
            ['natural', new PgPaginatorOrderingOffset_1.default({ pgPaginator: _this })],
        ]));
        /**
         * The default ordering for procedures will always be the natural ordering.
         * This is because the procedure may define an order itself.
         */
        _this.defaultOrdering = _this.orderings.get('natural');
        return _this;
    }
    /**
     * The from entry for this paginator is a Postgres function call where the
     * procedure is the function being called.
     */
    PgProcedurePaginator.prototype.getFromEntrySql = function (input) {
        return createPgProcedureSqlCall_1.default(this._fixtures, input);
    };
    /**
     * The condition when we are using a procedure will always be true.
     */
    PgProcedurePaginator.prototype.getConditionSql = function () {
        return (_a = ["true"], _a.raw = ["true"], utils_1.sql.query(_a));
        var _a;
    };
    return PgProcedurePaginator;
}(PgPaginator_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgProcedurePaginator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdQcm9jZWR1cmVQYWdpbmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvc2NoZW1hL3Byb2NlZHVyZXMvUGdQcm9jZWR1cmVQYWdpbmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpREFBNkM7QUFDN0MsaUZBQTJFO0FBQzNFLDZHQUF1RztBQUd2Ryx1RUFBaUU7QUFVakU7OztHQUdHO0FBQ0g7SUFBK0MsZ0RBQXVDO0lBQ3BGLDhCQUNVLFNBQThCO1FBRHhDLFlBR0UsaUJBQU8sU0FDUjtRQUhTLGVBQVMsR0FBVCxTQUFTLENBQXFCO1FBS2pDLFVBQUksR0FBVyxLQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUE7UUFDOUMsY0FBUSxHQUF1QixLQUFJLENBQUMsU0FBUyxDQUFDLE1BQU8sQ0FBQyxJQUEwQixDQUFBO1FBRXZGOzs7O1dBSUc7UUFDSCwwREFBMEQ7UUFDbkQsZUFBUyxHQUF1RSxDQUNyRixJQUFJLEdBQUcsQ0FBQztZQUNOLENBQUMsU0FBUyxFQUFFLElBQUksbUNBQXlCLENBQUMsRUFBRSxXQUFXLEVBQUUsS0FBSSxFQUFFLENBQUMsQ0FBQztTQUNsRSxDQUFDLENBQ0gsQ0FBQTtRQUVEOzs7V0FHRztRQUNJLHFCQUFlLEdBQTBELEtBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBRSxDQUFBOztJQXJCOUcsQ0FBQztJQXVCRDs7O09BR0c7SUFDSSw4Q0FBZSxHQUF0QixVQUF3QixLQUFxQjtRQUMzQyxNQUFNLENBQUMsa0NBQXdCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUN4RCxDQUFDO0lBRUQ7O09BRUc7SUFDSSw4Q0FBZSxHQUF0QjtRQUNFLE1BQU0sMkJBQVUsTUFBTSxHQUFmLFdBQUcsQ0FBQyxLQUFLLE1BQU07O0lBQ3hCLENBQUM7SUFDSCwyQkFBQztBQUFELENBQUMsQUExQ0QsQ0FBK0MscUJBQVcsR0EwQ3pEOztBQUVELGtCQUFlLG9CQUFvQixDQUFBIn0=