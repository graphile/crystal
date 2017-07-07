"use strict";
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var pgClientFromContext_1 = require("../pgClientFromContext");
/**
 * The `PgPaginatorOrderingOffset` implements an ordering strategy based solely
 * off of integer Sql offsets. This strategy is faster in some respects than
 * `PgPaginatorOrderingAttribute`, however it can easily be less correct.
 * Whenever an item is inserted into a set anywhere but at the end, all of the
 * offsets change making cursors previously queried now inconsistent with the
 * data.
 *
 * This ordering is available to be used with procedures and views (which will
 * often have a natural ordering), as well as indexes which define a custom
 * ordering. However, the cursors still won’t be super consistent.
 *
 * Also, note that there is no implementation for `getCursorForValue`. In the
 * future, we may add an implementation in the future but there it is hard
 * to get an offset from a lone value.
 */
var PgPaginatorOrderingOffset = (function () {
    function PgPaginatorOrderingOffset(config) {
        this.pgPaginator = config.pgPaginator;
        this.orderBy = config.orderBy;
    }
    /**
     * Reads a single page using the offset ordering strategy.
     */
    PgPaginatorOrderingOffset.prototype.readPage = function (context, input, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var client, first, last, beforeCursor, afterCursor, _offset, _count, getCount, offset, limit, _a, _b, _c, _d, aliasIdentifier, fromSql, conditionSql, query, rows, values, _e, _f, _g, _h;
            return tslib_1.__generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        client = pgClientFromContext_1.default(context);
                        first = config.first, last = config.last, beforeCursor = config.beforeCursor, afterCursor = config.afterCursor, _offset = config._offset;
                        // Do not allow `first` and `last` to be defined at the same time. THERE
                        // MAY ONLY BE 1!!
                        if (first != null && last != null)
                            throw new Error('`first` and `last` may not be defined at the same time.');
                        // Disallow the use of `offset` with `last`. We are currently still
                        // evaluating how best to implement paginators and offsets, trying to
                        // support `last` and `offset` adds complexity we don’t need.
                        if (_offset != null && last != null)
                            throw new Error('`offset` may not be used with `last`.');
                        // Check that the types of our cursors is exactly what we would expect.
                        if (afterCursor != null && !Number.isInteger(afterCursor))
                            throw new Error('The after cursor must be an integer.');
                        if (beforeCursor != null && !Number.isInteger(beforeCursor))
                            throw new Error('The before cursor must be an integer.');
                        getCount = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(_count == null)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.pgPaginator.count(context, input)];
                                    case 1:
                                        _count = _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/, _count];
                                }
                            });
                        }); };
                        if (!(last == null || (last != null && beforeCursor != null && beforeCursor - (afterCursor != null ? afterCursor : 0) <= last))) return [3 /*break*/, 1];
                        // Start selecting at the offset specified by `after`. If there is no
                        // after, we start selecting at the beginning (0).
                        //
                        // Also add our offset if given one.
                        offset = (afterCursor != null ? afterCursor : 0) + (_offset || 0);
                        // Next create our limit (what we will be selecting to relative to our
                        // `offset`).
                        limit =
                            beforeCursor != null ? Math.min((beforeCursor - 1) - offset, first != null ? first : Infinity) :
                                first != null ? first :
                                    null;
                        return [3 /*break*/, 5];
                    case 1:
                        if (!(beforeCursor != null)) return [3 /*break*/, 2];
                        _a = beforeCursor - last - 1;
                        return [3 /*break*/, 4];
                    case 2:
                        _c = (_b = Math).max;
                        return [4 /*yield*/, getCount()];
                    case 3:
                        _a = _c.apply(_b, [(_j.sent()) - last, afterCursor != null ? afterCursor : -Infinity]);
                        _j.label = 4;
                    case 4:
                        // Calculate the `offset` by doing some maths. We may need to get the
                        // count from the database on this one.
                        offset = _a;
                        // The limit should always simply be `last`. Except in one case, but
                        // that case is handled above.
                        limit = last;
                        _j.label = 5;
                    case 5:
                        aliasIdentifier = Symbol();
                        fromSql = this.pgPaginator.getFromEntrySql(input);
                        conditionSql = this.pgPaginator.getConditionSql(input);
                        query = utils_1.sql.compile((_e = ["\n      select to_json(", ") as value\n      from ", " as ", "\n      where ", "\n      ", "\n      offset ", "\n      limit ", "\n    "], _e.raw = ["\n      select to_json(", ") as value\n      from ", " as ", "\n      where ", "\n      ", "\n      offset ", "\n      limit ", "\n    "], utils_1.sql.query(_e, utils_1.sql.identifier(aliasIdentifier), fromSql, utils_1.sql.identifier(aliasIdentifier), conditionSql, this.orderBy ? (_f = ["order by ", ""], _f.raw = ["order by ", ""], utils_1.sql.query(_f, this.orderBy)) : (_g = [""], _g.raw = [""], utils_1.sql.query(_g)), utils_1.sql.value(offset), limit != null ? utils_1.sql.value(limit) : (_h = ["all"], _h.raw = ["all"], utils_1.sql.query(_h)))));
                        return [4 /*yield*/, client.query(query)];
                    case 6:
                        rows = (_j.sent()).rows;
                        values = rows.map(function (_a, i) {
                            var value = _a.value;
                            return ({
                                value: _this.pgPaginator.itemType.transformPgValueIntoValue(value),
                                cursor: offset + 1 + i,
                            });
                        });
                        // TODO: We get the count in this function (see `getCount`) to paginate
                        // correctly. We should create an optimization that allows us to share
                        // what the count is instead of calling for the count again.
                        return [2 /*return*/, {
                                values: values,
                                // We have super simple implementations for `hasNextPage` and
                                // `hasPreviousPage` thanks to the algebraic nature of ordering by
                                // offset.
                                hasNextPage: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () { var _a; return tslib_1.__generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _a = offset + (limit != null ? limit : Infinity);
                                            return [4 /*yield*/, getCount()];
                                        case 1: return [2 /*return*/, _a < (_b.sent())];
                                    }
                                }); }); },
                                hasPreviousPage: function () { return Promise.resolve(offset > 0); },
                            }];
                }
            });
        });
    };
    return PgPaginatorOrderingOffset;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgPaginatorOrderingOffset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdQYWdpbmF0b3JPcmRlcmluZ09mZnNldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvcGFnaW5hdG9yL1BnUGFnaW5hdG9yT3JkZXJpbmdPZmZzZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxxQ0FBaUM7QUFDakMsOERBQXdEO0FBVXhEOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNIO0lBS0UsbUNBQWEsTUFHWjtRQUNDLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQTtRQUNyQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUE7SUFDL0IsQ0FBQztJQUVEOztPQUVHO0lBQ1UsNENBQVEsR0FBckIsVUFDRSxPQUFjLEVBQ2QsS0FBYSxFQUNiLE1BQTBDOzs7Z0JBRXBDLE1BQU0sRUFDSixLQUFLLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsT0FBTyxFQW9CbkQsTUFBTSxFQUlKLFFBQVEsRUFPVixNQUFNLEVBQ04sS0FBSyxrQkF3Q0gsZUFBZSxFQUNmLE9BQU8sRUFDUCxZQUFZLEVBR1osS0FBSyxRQWFMLE1BQU07Ozs7aUNBM0ZHLDZCQUFtQixDQUFDLE9BQU8sQ0FBQztnQ0FDaUIsTUFBTSxlQUFOLE1BQU0sc0JBQU4sTUFBTSw2QkFBTixNQUFNLHdCQUFOLE1BQU07d0JBRWxFLHdFQUF3RTt3QkFDeEUsa0JBQWtCO3dCQUNsQixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUM7NEJBQ2hDLE1BQU0sSUFBSSxLQUFLLENBQUMseURBQXlELENBQUMsQ0FBQTt3QkFFNUUsbUVBQW1FO3dCQUNuRSxxRUFBcUU7d0JBQ3JFLDZEQUE2RDt3QkFDN0QsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDOzRCQUNs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