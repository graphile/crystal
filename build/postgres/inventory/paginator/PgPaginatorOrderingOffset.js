"use strict";
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var pgClientFromContext_1 = require("../pgClientFromContext");
var getSelectFragment_1 = require("./getSelectFragment");
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
    PgPaginatorOrderingOffset.prototype.generateQuery = function (input, config, resolveInfo, gqlType, subquery) {
        if (subquery === void 0) { subquery = true; }
        var first = config.first, last = config.last, beforeCursor = config.beforeCursor, afterCursor = config.afterCursor, _offset = config._offset;
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
        var limit;
        // If `last` is not defined (which means `first` might be defined), *or*
        // the `last` variable is unnesecary (this happens when
        // `beforeOffset - afterOffset <= last`). Execute the first method of
        // calculating `offset` and `limit`.
        //
        // If `beforeOffset - afterOffset <= last` is true then we can safely
        // ignore `last` as the range between `afterOffset` and `beforeOffset`
        // is *less* then the range defined in `last`.
        //
        // In this first block we can consider ourselves paginating *forwards*.
        var aliasIdentifier = Symbol();
        var matchingRowsIdentifier = Symbol();
        var resultsIdentifier = Symbol();
        var offsetSql;
        if (last == null || (last != null && beforeCursor != null && beforeCursor - (afterCursor != null ? afterCursor : 0) <= last)) {
            // Start selecting at the offset specified by `after`. If there is no
            // after, we start selecting at the beginning (0).
            //
            // Also add our offset if given one.
            var offset = (afterCursor != null ? afterCursor : 0) + (_offset || 0);
            // Next create our limit (what we will be selecting to relative to our
            // `offset`).
            limit =
                beforeCursor != null ? Math.min((beforeCursor - 1) - offset, first != null ? first : Infinity) :
                    first != null ? first :
                        null;
            offsetSql = utils_1.sql.value(offset);
        }
        else {
            // Calculate the `offset` by doing some maths. We may need to get the
            // count from the database on this one.
            if (beforeCursor != null) {
                var offset = beforeCursor - last - 1;
                offsetSql = utils_1.sql.value(offset);
            }
            else {
                var countSql = (_a = ["(select count(*) from ", ")"], _a.raw = ["(select count(*) from ", ")"], utils_1.sql.query(_a, utils_1.sql.identifier(matchingRowsIdentifier)));
                offsetSql =
                    afterCursor != null
                        ? (_b = ["greatest(", " - ", "::integer, ", ", 0)"], _b.raw = ["greatest(", " - ", "::integer, ", ", 0)"], utils_1.sql.query(_b, countSql, utils_1.sql.value(last), utils_1.sql.value(afterCursor))) : (_c = ["greatest(", " - ", "::integer, 0)"], _c.raw = ["greatest(", " - ", "::integer, 0)"], utils_1.sql.query(_c, countSql, utils_1.sql.value(last)));
            }
            // The limit should always simply be `last`. Except in one case, but
            // that case is handled above.
            limit = last;
        }
        var fromSql = this.pgPaginator.getFromEntrySql(input, subquery);
        var conditionSql = this.pgPaginator.getConditionSql(input);
        var hasNextPageSql = limit != null
            ? (_d = ["", "::integer + ", "::integer < (select count(*) from ", ")"], _d.raw = ["", "::integer + ", "::integer < (select count(*) from ", ")"], utils_1.sql.query(_d, offsetSql, utils_1.sql.value(limit), utils_1.sql.identifier(matchingRowsIdentifier))) : utils_1.sql.value(false);
        var totalCountSql = (_e = ["select count(*) from ", ""], _e.raw = ["select count(*) from ", ""], utils_1.sql.query(_e, utils_1.sql.identifier(matchingRowsIdentifier)));
        var jsonIdentifier = Symbol();
        // Construct our Sql query that will actually do the selecting.
        var query = (_f = ["\n      with ", " as (\n        select *\n        from ", " as ", "\n        where ", "\n      ), ", " as (\n        select json_build_object(\n          'value', ", ",\n          'cursor', ", "::integer + (row_number() over (\n            ", "\n          ))::integer\n        ) as ", "\n        from ", "\n        ", "\n        offset ", "\n        limit ", "\n      )\n      select coalesce((select json_agg(", ") from ", "), '[]'::json) as \"rows\",\n      (", ")::integer as \"totalCount\",\n      (", ")::boolean as \"hasNextPage\",\n      (", ") as \"hasPreviousPage\"\n    "], _f.raw = ["\n      with ", " as (\n        select *\n        from ", " as ", "\n        where ", "\n      ), ", " as (\n        select json_build_object(\n          'value', ", ",\n          'cursor', ", "::integer + (row_number() over (\n            ", "\n          ))::integer\n        ) as ", "\n        from ", "\n        ", "\n        offset ", "\n        limit ", "\n      )\n      select coalesce((select json_agg(", ") from ", "), '[]'::json) as \"rows\",\n      (", ")::integer as \"totalCount\",\n      (", ")::boolean as \"hasNextPage\",\n      (", ") as \"hasPreviousPage\"\n    "], utils_1.sql.query(_f, utils_1.sql.identifier(matchingRowsIdentifier), fromSql, utils_1.sql.identifier(aliasIdentifier), conditionSql, utils_1.sql.identifier(resultsIdentifier), getSelectFragment_1.default(resolveInfo, matchingRowsIdentifier, gqlType), offsetSql, this.orderBy ? (_g = ["order by ", ""], _g.raw = ["order by ", ""], utils_1.sql.query(_g, this.orderBy)) : (_h = ["order by 0"], _h.raw = ["order by 0"], utils_1.sql.query(_h)), utils_1.sql.identifier(jsonIdentifier), utils_1.sql.identifier(matchingRowsIdentifier), this.orderBy ? (_j = ["order by ", ""], _j.raw = ["order by ", ""], utils_1.sql.query(_j, this.orderBy)) : (_k = [""], _k.raw = [""], utils_1.sql.query(_k)), offsetSql, limit != null ? utils_1.sql.value(limit) : (_l = ["all"], _l.raw = ["all"], utils_1.sql.query(_l)), utils_1.sql.identifier(jsonIdentifier), utils_1.sql.identifier(resultsIdentifier), totalCountSql, limit === 0 ? (_m = ["false"], _m.raw = ["false"], utils_1.sql.query(_m)) : hasNextPageSql, limit === 0 ? (_o = ["false"], _o.raw = ["false"], utils_1.sql.query(_o)) : (_p = ["", " > 0"], _p.raw = ["", " > 0"], utils_1.sql.query(_p, offsetSql))));
        return { query: query };
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    };
    /**
     * Reads a single page using the offset ordering strategy.
     */
    PgPaginatorOrderingOffset.prototype.readPage = function (context, input, config, resolveInfo, gqlType) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var details, query, compiledQuery, client, value;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        details = this.generateQuery(input, config, resolveInfo, gqlType, false);
                        query = details.query;
                        compiledQuery = utils_1.sql.compile(query);
                        client = pgClientFromContext_1.default(context);
                        return [4 /*yield*/, client.query(compiledQuery)];
                    case 1:
                        value = (_a.sent()).rows[0];
                        return [2 /*return*/, this.valueToPage(value, details)];
                }
            });
        });
    };
    PgPaginatorOrderingOffset.prototype.valueToPage = function (value, _details) {
        var _this = this;
        var rows = value.rows, hasNextPage = value.hasNextPage, hasPreviousPage = value.hasPreviousPage, totalCount = value.totalCount;
        // Transform our rows into the values our page expects.
        var values = rows.map(function (_a, i) {
            var value = _a.value, cursor = _a.cursor;
            return ({
                value: _this.pgPaginator.itemType.transformPgValueIntoValue(value),
                cursor: cursor,
            });
        });
        return {
            values: values,
            hasNextPage: function () { return Promise.resolve(hasNextPage); },
            hasPreviousPage: function () { return Promise.resolve(hasPreviousPage); },
            totalCount: function () { return Promise.resolve(totalCount); },
        };
    };
    return PgPaginatorOrderingOffset;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgPaginatorOrderingOffset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdQYWdpbmF0b3JPcmRlcmluZ09mZnNldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvcGFnaW5hdG9yL1BnUGFnaW5hdG9yT3JkZXJpbmdPZmZzZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxxQ0FBaUM7QUFDakMsOERBQXdEO0FBRXhELHlEQUFtRDtBQVNuRDs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSDtJQUtFLG1DQUFhLE1BR1o7UUFDQyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUE7UUFDckMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFBO0lBQy9CLENBQUM7SUFFTSxpREFBYSxHQUFwQixVQUNFLEtBQWEsRUFDYixNQUE4QyxFQUM5QyxXQUFrQixFQUNsQixPQUFjLEVBQ2QsUUFBeUI7UUFBekIseUJBQUEsRUFBQSxlQUF5QjtRQUVqQixJQUFBLG9CQUFLLEVBQUUsa0JBQUksRUFBRSxrQ0FBWSxFQUFFLGdDQUFXLEVBQUUsd0JBQU8sQ0FBVztRQUVsRSx3RUFBd0U7UUFDeEUsa0JBQWtCO1FBQ2xCLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQztZQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLHlEQUF5RCxDQUFDLENBQUE7UUFFNUUsbUVBQW1FO1FBQ25FLHFFQUFxRTtRQUNyRSw2REFBNkQ7UUFDN0QsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDO1lBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQTtRQUUxRCx1RUFBdUU7UUFDdkUsRUFBRSxDQUFDLENBQUMsV0FBVyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDeEQs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