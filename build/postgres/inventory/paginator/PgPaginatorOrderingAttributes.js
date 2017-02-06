"use strict";
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var pgClientFromContext_1 = require("../pgClientFromContext");
var getSelectFragment_1 = require("./getSelectFragment");
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
    PgPaginatorOrderingAttributes.prototype.generateQuery = function (input, config, resolveInfo, gqlType) {
        var _a = this, descending = _a.descending, pgAttributes = _a.pgAttributes;
        var beforeCursor = config.beforeCursor, afterCursor = config.afterCursor, first = config.first, last = config.last, _offset = config._offset;
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
        var aliasIdentifier = Symbol();
        var matchingRowsIdentifier = Symbol();
        var resultsIdentifier = Symbol();
        var jsonIdentifier = Symbol();
        var fromSql = this.pgPaginator.getFromEntrySql(input);
        var conditionSql = this.pgPaginator.getConditionSql(input);
        // Poor-man's WITH clause (because this needs to run in subqueries)
        var matchingRowsSql = (_b = ["\n        (\n        select *\n        from ", " as ", "\n\n        -- Combine our cursors with the condition used for this page to\n        -- implement a where condition which will filter what we want it to.\n        --\n        -- We throw away nulls because there is a lot of wierdness when they\n        -- get included.\n        where\n          ", " and\n          ", "\n        )\n        "], _b.raw = ["\n        (\n        select *\n        from ", " as ", "\n\n        -- Combine our cursors with the condition used for this page to\n        -- implement a where condition which will filter what we want it to.\n        --\n        -- We throw away nulls because there is a lot of wierdness when they\n        -- get included.\n        where\n          ", " and\n          ", "\n        )\n        "], utils_1.sql.query(_b, fromSql, utils_1.sql.identifier(aliasIdentifier), utils_1.sql.join(pgAttributes.map(function (pgAttribute) {
            return (_a = ["", " is not null"], _a.raw = ["", " is not null"], utils_1.sql.query(_a, utils_1.sql.identifier(pgAttribute.name)));
            var _a;
        }), ' and '), conditionSql));
        var hasNextPageSql, hasPreviousPageSql;
        if (first === 0 || last === 0) {
            hasNextPageSql = (_c = ["false"], _c.raw = ["false"], utils_1.sql.query(_c));
            hasPreviousPageSql = (_d = ["false"], _d.raw = ["false"], utils_1.sql.query(_d));
        }
        else {
            hasNextPageSql =
                last != null
                    ? (beforeCursor
                        ? (_e = ["\n              exists(\n                select 1 from ", " as ", "\n                where ", "\n              )\n              "], _e.raw = ["\n              exists(\n                select 1 from ", " as ", "\n                where ", "\n              )\n              "], utils_1.sql.query(_e, matchingRowsSql, utils_1.sql.identifier(Symbol()), this._getCursorCondition(pgAttributes, beforeCursor, descending ? '<=' : '>='))) : (_f = ["false"], _f.raw = ["false"], utils_1.sql.query(_f)))
                    : (_g = ["\n            (\n              select count(*) from ", " as ", "\n              where ", "\n            ) > count(*)\n            "], _g.raw = ["\n            (\n              select count(*) from ", " as ", "\n              where ", "\n            ) > count(*)\n            "], utils_1.sql.query(_g, matchingRowsSql, utils_1.sql.identifier(Symbol()), afterCursor ? this._getCursorCondition(pgAttributes, afterCursor, descending ? '<' : '>') : (_h = ["true"], _h.raw = ["true"], utils_1.sql.query(_h))));
            if (_offset != null && _offset > 0) {
                hasPreviousPageSql = (_j = ["true"], _j.raw = ["true"], utils_1.sql.query(_j));
            }
            else {
                hasPreviousPageSql =
                    last != null
                        ? (_k = ["\n              (\n                select count(*) from ", " as ", "\n                where ", "\n              ) > count(*)\n              "], _k.raw = ["\n              (\n                select count(*) from ", " as ", "\n                where ", "\n              ) > count(*)\n              "], utils_1.sql.query(_k, matchingRowsSql, utils_1.sql.identifier(Symbol()), beforeCursor ? this._getCursorCondition(pgAttributes, beforeCursor, descending ? '>' : '<') : utils_1.sql.raw('true'))) : (afterCursor
                        ? (_l = ["\n                exists(\n                  select 1 from ", " as ", "\n                  where ", "\n                )\n                "], _l.raw = ["\n                exists(\n                  select 1 from ", " as ", "\n                  where ", "\n                )\n                "], utils_1.sql.query(_l, matchingRowsSql, utils_1.sql.identifier(Symbol()), this._getCursorCondition(pgAttributes, afterCursor, descending ? '>=' : '<='))) : (_m = ["false"], _m.raw = ["false"], utils_1.sql.query(_m)));
            }
        }
        var totalCountSql = (_o = ["\n        (\n          select count(*) from ", " as ", "\n        )\n      "], _o.raw = ["\n        (\n          select count(*) from ", " as ", "\n        )\n      "], utils_1.sql.query(_o, matchingRowsSql, utils_1.sql.identifier(Symbol())));
        // XXX: for performance, we should not add totalCountSql/
        // hasNextPageSql/hasPreviousPageSql to the query unless they're requested
        var query = (_p = ["\n      select coalesce(json_agg(", "), '[]'::json) as \"rows\",\n      ", "::integer as \"totalCount\",\n      ", " as \"hasNextPage\",\n      ", " as \"hasPreviousPage\"\n      from (\n        select json_build_object(\n          'value', ", ",\n          'cursor', json_build_array(", ")\n        ) as ", "\n        from ", " as ", "\n\n        where\n          ", " and\n          ", "\n\n        -- Order using the same attributes used to construct the cursors. If\n        -- a last property was defined we need to reverse our ordering so the\n        -- limit will work. We will fix the order in JavaScript.\n        order by ", "\n\n        -- Finally, apply the appropriate limit.\n        limit ", "\n\n        -- If we have an offset, add that as well.\n        ", "\n      ) as ", "\n    "], _p.raw = ["\n      select coalesce(json_agg(", "), '[]'::json) as \"rows\",\n      ", "::integer as \"totalCount\",\n      ", " as \"hasNextPage\",\n      ", " as \"hasPreviousPage\"\n      from (\n        select json_build_object(\n          'value', ", ",\n          'cursor', json_build_array(", ")\n        ) as ", "\n        from ", " as ", "\n\n        where\n          ", " and\n          ", "\n\n        -- Order using the same attributes used to construct the cursors. If\n        -- a last property was defined we need to reverse our ordering so the\n        -- limit will work. We will fix the order in JavaScript.\n        order by ",
            "\n\n        -- Finally, apply the appropriate limit.\n        limit ", "\n\n        -- If we have an offset, add that as well.\n        ", "\n      ) as ", "\n    "], utils_1.sql.query(_p, utils_1.sql.identifier(jsonIdentifier), totalCountSql, hasNextPageSql, hasPreviousPageSql, getSelectFragment_1.default(resolveInfo, matchingRowsIdentifier, gqlType), utils_1.sql.join(pgAttributes.map(function (pgAttribute) { return utils_1.sql.identifier(pgAttribute.name); }), ', '), utils_1.sql.identifier(jsonIdentifier), matchingRowsSql, utils_1.sql.identifier(matchingRowsIdentifier), beforeCursor ? this._getCursorCondition(pgAttributes, beforeCursor, descending ? '>' : '<') : utils_1.sql.raw('true'), afterCursor ? this._getCursorCondition(pgAttributes, afterCursor, descending ? '<' : '>') : utils_1.sql.raw('true'), utils_1.sql.join(pgAttributes.map(function (pgAttribute) {
            return (_a = ["", " using ", ""], _a.raw = ["", " using ", ""], utils_1.sql.query(_a, utils_1.sql.identifier(pgAttribute.name), utils_1.sql.raw((last != null ? !descending : descending) ? '>' : '<')));
            var _a;
        }), ', '), first != null ? utils_1.sql.value(first) : last != null ? utils_1.sql.value(last) : utils_1.sql.raw('all'), _offset != null ? (_q = ["offset ", ""], _q.raw = ["offset ", ""], utils_1.sql.query(_q, utils_1.sql.value(_offset))) : (_r = [""], _r.raw = [""], utils_1.sql.query(_r)), utils_1.sql.identifier(resultsIdentifier)));
        return { query: query, last: last };
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    };
    /**
     * Reads a single page for this ordering.
     */
    PgPaginatorOrderingAttributes.prototype.readPage = function (context, input, config, resolveInfo, gqlType) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var details, query, last, compiledQuery, client, value;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        details = this.generateQuery(input, config, resolveInfo, gqlType);
                        query = details.query, last = details.last;
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
    PgPaginatorOrderingAttributes.prototype.valueToPage = function (value, _a) {
        var _this = this;
        var last = _a.last;
        var rows = value.rows, hasNextPage = value.hasNextPage, hasPreviousPage = value.hasPreviousPage, totalCount = value.totalCount;
        // If `last` was defined we reversed the order in Sql so our limit would
        // work. We need to reverse again when we get here.
        // TODO: We could implement an `O(1)` reverse with iterators. Then we
        // won’t need to reverse in Sql. We could do that given we get `rows`
        // back as an array. We know the final length and we could start
        // returning from the end instead of the beginning.
        if (last != null)
            rows.reverse();
        // Convert our rows into usable values.
        var values = rows.map(function (_a) {
            var value = _a.value, cursor = _a.cursor;
            return ({
                value: _this.pgPaginator.itemType.transformPgValueIntoValue(value),
                cursor: cursor,
            });
        });
        return {
            values: values,
            // Gets whether or not we have more values to paginate through by
            // running a simple, efficient Sql query to test.
            hasNextPage: function () { return Promise.resolve(hasNextPage); },
            hasPreviousPage: function () { return Promise.resolve(hasPreviousPage); },
            totalCount: function () { return Promise.resolve(totalCount); },
        };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdQYWdpbmF0b3JPcmRlcmluZ0F0dHJpYnV0ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3BhZ2luYXRvci9QZ1BhZ2luYXRvck9yZGVyaW5nQXR0cmlidXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHFDQUFpQztBQUNqQyw4REFBd0Q7QUFHeEQseURBQW1EO0FBVW5EOzs7OztHQUtHO0FBQ0g7SUFNRSx1Q0FBYSxNQUlaO1FBQ0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFBO1FBQ3JDLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUE7UUFDdkUsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFBO0lBQ3pDLENBQUM7SUFFTSxxREFBYSxHQUFwQixVQUNFLEtBQWEsRUFDYixNQUE4QyxFQUM5QyxXQUFrQixFQUNsQixPQUFjO1FBRVIsSUFBQSxTQUFtQyxFQUFqQywwQkFBVSxFQUFFLDhCQUFZLENBQVM7UUFDakMsSUFBQSxrQ0FBWSxFQUFFLGdDQUFXLEVBQUUsb0JBQUssRUFBRSxrQkFBSSxFQUFFLHdCQUFPLENBQVc7UUFFbEUsd0VBQXdFO1FBQ3hFLGtCQUFrQjtRQUNsQixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUM7WUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsQ0FBQyxDQUFBO1FBRTVFLG1FQUFtRTtRQUNuRSxxRUFBcUU7UUFDckUsNkRBQTZEO1FBQzdELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQztZQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUE7UUFFMUQs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