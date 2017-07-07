"use strict";
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var pgClientFromContext_1 = require("../pgClientFromContext");
/**
 * The `PgPaginatorOrderingAttributes` paginator ordering implements an
 * ordering strategy that involves sorting on the attributes of a given
 * `PgObjectType`. We use the `<` and `>` operators in Postgres to implement
 * the before/after cursors and we also ordering using those operators.
 */
var PgPaginatorOrderingAttributes = (function () {
    function PgPaginatorOrderingAttributes(config) {
        this.pgPaginator = config.pgPaginator;
        this.descending = config.descending != null ? config.descending : false;
        this.pgAttributes = config.pgAttributes;
    }
    /**
     * Reads a single page for this ordering.
     */
    PgPaginatorOrderingAttributes.prototype.readPage = function (context, input, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var client, _a, descending, pgAttributes, beforeCursor, afterCursor, first, last, _offset, aliasIdentifier, fromSql, conditionSql, query, rows, values, _b, _c, _d;
            return tslib_1.__generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        client = pgClientFromContext_1.default(context);
                        _a = this, descending = _a.descending, pgAttributes = _a.pgAttributes;
                        beforeCursor = config.beforeCursor, afterCursor = config.afterCursor, first = config.first, last = config.last, _offset = config._offset;
                        // Do not allow `first` and `last` to be defined at the same time. THERE
                        // MAY ONLY BE 1!!
                        if (first != null && last != null)
                            throw new Error('`first` and `last` may not be defined at the same time.');
                        // Disallow the use of `offset` with `last`. We are currently still
                        // evaluating how best to implement paginators and offsets, trying to
                        // support `last` and `offset` adds complexity we don’t need.
                        if (_offset != null && last != null)
                            throw new Error('`offset` may not be used with `last`.');
                        // Perform some validations on our cursors. If they do not pass these
                        // conditions, we should not proceed.
                        if (afterCursor != null && afterCursor.length !== pgAttributes.length)
                            throw new Error('After cursor must be a value tuple of the correct length.');
                        if (beforeCursor != null && beforeCursor.length !== pgAttributes.length)
                            throw new Error('Before cursor must be a value tuple of the correct length.');
                        aliasIdentifier = Symbol();
                        fromSql = this.pgPaginator.getFromEntrySql(input);
                        conditionSql = this.pgPaginator.getConditionSql(input);
                        query = utils_1.sql.compile((_b = ["\n      -- The standard select/from clauses up top.\n      select to_json(", ") as value\n      from ", " as ", "\n\n      -- Combine our cursors with the condition used for this page to\n      -- implement a where condition which will filter what we want it to.\n      --\n      -- We throw away nulls because there is a lot of wierdness when they\n      -- get included.\n      where\n        ", " and\n        ", " and\n        ", " and\n        ", "\n\n      -- Order using the same attributes used to construct the cursors. If\n      -- a last property was defined we need to reverse our ordering so the\n      -- limit will work. We will fix the order in JavaScript.\n      order by ", "\n\n      -- Finally, apply the appropriate limit.\n      limit ", "\n\n      -- If we have an offset, add that as well.\n      ", "\n    "], _b.raw = ["\n      -- The standard select/from clauses up top.\n      select to_json(", ") as value\n      from ", " as ", "\n\n      -- Combine our cursors with the condition used for this page to\n      -- implement a where condition which will filter what we want it to.\n      --\n      -- We throw away nulls because there is a lot of wierdness when they\n      -- get included.\n      where\n        ", " and\n        ", " and\n        ", " and\n        ", "\n\n      -- Order using the same attributes used to construct the cursors. If\n      -- a last property was defined we need to reverse our ordering so the\n      -- limit will work. We will fix the order in JavaScript.\n      order by ",
                            "\n\n      -- Finally, apply the appropriate limit.\n      limit ", "\n\n      -- If we have an offset, add that as well.\n      ", "\n    "], utils_1.sql.query(_b, utils_1.sql.identifier(aliasIdentifier), fromSql, utils_1.sql.identifier(aliasIdentifier), utils_1.sql.join(pgAttributes.map(function (pgAttribute) {
                            return (_a = ["", " is not null"], _a.raw = ["", " is not null"], utils_1.sql.query(_a, utils_1.sql.identifier(pgAttribute.name)));
                            var _a;
                        }), ' and '), beforeCursor ? this._getCursorCondition(pgAttributes, beforeCursor, descending ? '>' : '<') : utils_1.sql.raw('true'), afterCursor ? this._getCursorCondition(pgAttributes, afterCursor, descending ? '<' : '>') : utils_1.sql.raw('true'), conditionSql, utils_1.sql.join(pgAttributes.map(function (pgAttribute) {
                            return (_a = ["", " using ", ""], _a.raw = ["", " using ", ""], utils_1.sql.query(_a, utils_1.sql.identifier(pgAttribute.name), utils_1.sql.raw((last != null ? !descending : descending) ? '>' : '<')));
                            var _a;
                        }), ', '), first != null ? utils_1.sql.value(first) : last != null ? utils_1.sql.value(last) : utils_1.sql.raw('all'), _offset != null ? (_c = ["offset ", ""], _c.raw = ["offset ", ""], utils_1.sql.query(_c, utils_1.sql.value(_offset))) : (_d = [""], _d.raw = [""], utils_1.sql.query(_d)))));
                        return [4 /*yield*/, client.query(query)];
                    case 1:
                        rows = (_e.sent()).rows;
                        // If `last` was defined we reversed the order in Sql so our limit would
                        // work. We need to reverse again when we get here.
                        // TODO: We could implement an `O(1)` reverse with iterators. Then we
                        // won’t need to reverse in Sql. We could do that given we get `rows`
                        // back as an array. We know the final length and we could start
                        // returning from the end instead of the beginning.
                        if (last != null)
                            rows = rows.reverse();
                        values = rows.map(function (_a) {
                            var value = _a.value;
                            return ({
                                value: _this.pgPaginator.itemType.transformPgValueIntoValue(value),
                                cursor: pgAttributes.map(function (pgAttribute) { return value[pgAttribute.name]; }),
                            });
                        });
                        return [2 /*return*/, {
                                values: values,
                                // Gets whether or not we have more values to paginate through by
                                // running a simple, efficient Sql query to test.
                                hasNextPage: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    var lastValue, lastCursor, rowCount, _a;
                                    return tslib_1.__generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                lastValue = values[values.length - 1];
                                                lastCursor = lastValue ? lastValue.cursor : beforeCursor;
                                                if (lastCursor == null)
                                                    return [2 /*return*/, false];
                                                return [4 /*yield*/, client.query(utils_1.sql.compile((_a = ["\n          select null\n          from ", "\n          where ", " and ", "\n          limit 1\n        "], _a.raw = ["\n          select null\n          from ", "\n          where ", " and ", "\n          limit 1\n        "], utils_1.sql.query(_a, fromSql, this._getCursorCondition(pgAttributes, lastCursor, descending ? '<' : '>'), conditionSql))))];
                                            case 1:
                                                rowCount = (_b.sent()).rowCount;
                                                return [2 /*return*/, rowCount !== 0];
                                        }
                                    });
                                }); },
                                // Gets whether or not we have more values to paginate through by
                                // running a simple, efficient Sql query to test.
                                hasPreviousPage: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    var firstValue, firstCursor, rowCount, _a;
                                    return tslib_1.__generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                firstValue = values[0];
                                                firstCursor = firstValue ? firstValue.cursor : afterCursor;
                                                if (firstCursor == null)
                                                    return [2 /*return*/, false];
                                                return [4 /*yield*/, client.query(utils_1.sql.compile((_a = ["\n          select null\n          from ", "\n          where ", " and ", "\n          limit 1\n        "], _a.raw = ["\n          select null\n          from ", "\n          where ", " and ", "\n          limit 1\n        "], utils_1.sql.query(_a, fromSql, this._getCursorCondition(pgAttributes, firstCursor, descending ? '>' : '<'), conditionSql))))];
                                            case 1:
                                                rowCount = (_b.sent()).rowCount;
                                                return [2 /*return*/, rowCount !== 0];
                                        }
                                    });
                                }); },
                            }];
                }
            });
        });
    };
    /**
     * Gets the condition used to filter our result set using a cursor.
     *
     * @private
     */
    PgPaginatorOrderingAttributes.prototype._getCursorCondition = function (pgAttributes, cursor, operator) {
        return (_a = ["\n      (", ")\n      ", "\n      (", ")\n    "], _a.raw = ["\n      (", ")\n      ", "\n      (", ")\n    "], utils_1.sql.query(_a, utils_1.sql.join(pgAttributes.map(function (pgAttribute) { return utils_1.sql.identifier(pgAttribute.name); }), ', '), utils_1.sql.raw(operator), utils_1.sql.join(cursor.map(utils_1.sql.value), ', ')));
        var _a;
    };
    return PgPaginatorOrderingAttributes;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgPaginatorOrderingAttributes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdQYWdpbmF0b3JPcmRlcmluZ0F0dHJpYnV0ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3BhZ2luYXRvci9QZ1BhZ2luYXRvck9yZGVyaW5nQXR0cmlidXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHFDQUFpQztBQUNqQyw4REFBd0Q7QUFZeEQ7Ozs7O0dBS0c7QUFDSDtJQU1FLHVDQUFhLE1BSVo7UUFDQyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUE7UUFDckMsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQTtRQUN2RSxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUE7SUFDekMsQ0FBQztJQUVEOztPQUVHO0lBQ1UsZ0RBQVEsR0FBckIsVUFDRSxPQUFjLEVBQ2QsS0FBYSxFQUNiLE1BQThDOzs7Z0JBRXhDLE1BQU0sTUFDSixVQUFVLEVBQUUsWUFBWSxFQUN4QixZQUFZLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQW9CakQsZUFBZSxFQUNmLE9BQU8sRUFDUCxZQUFZLEVBRVosS0FBSyxRQTBDTCxNQUFNOzs7O2lDQXBFRyw2QkFBbUIsQ0FBQyxPQUFPLENBQUM7NkJBQ04sSUFBSTt1Q0FDbUIsTUFBTSw2QkFBTixNQUFNLHNCQUFOLE1BQU0sZUFBTixNQUFNLGlCQUFOLE1BQU07d0JBRWxFLHdFQUF3RTt3QkFDeEUsa0JBQWtCO3dCQUNsQixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUM7NEJBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMseURBQXlELENBQUMsQ0FBQTt3QkFFNUUsbUVBQW1FO3dCQUNuRSxxRUFBcUU7d0JBQ3JF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