"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const utils_1 = require('../../utils');
const pgClientFromContext_1 = require('../pgClientFromContext');
const transformPgValueIntoValue_1 = require('../transformPgValueIntoValue');
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
class PgPaginatorOrderingOffset {
    constructor(config) {
        this.pgPaginator = config.pgPaginator;
        this.orderBy = config.orderBy;
    }
    /**
     * Reads a single page using the offset ordering strategy.
     */
    readPage(context, input, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = pgClientFromContext_1.default(context);
            const { first, last, beforeCursor, afterCursor, _offset } = config;
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
            // A private variable where we store the value returned by `getCount`.
            let _count;
            // A local memoized implementation that gets the count of *all* values in
            // the set we are paginating.
            const getCount = () => __awaiter(this, void 0, void 0, function* () {
                if (_count == null)
                    _count = yield this.pgPaginator.count(context, input);
                return _count;
            });
            let offset;
            let limit;
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
            if (last == null || (last != null && beforeCursor != null && beforeCursor - (afterCursor != null ? afterCursor : 0) <= last)) {
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
            }
            else {
                // Calculate the `offset` by doing some maths. We may need to get the
                // count from the database on this one.
                offset =
                    beforeCursor != null
                        ? beforeCursor - last - 1
                        : Math.max((yield getCount()) - last, afterCursor != null ? afterCursor : -Infinity);
                // The limit should always simply be `last`. Except in one case, but
                // that case is handled above.
                limit = last;
            }
            const aliasIdentifier = Symbol();
            const fromSql = this.pgPaginator.getFromEntrySql(input);
            const conditionSql = this.pgPaginator.getConditionSql(input);
            // Construct our Sql query that will actually do the selecting.
            const query = utils_1.sql.compile(utils_1.sql.query `
      select to_json(${utils_1.sql.identifier(aliasIdentifier)}) as value
      from ${fromSql} as ${utils_1.sql.identifier(aliasIdentifier)}
      where ${conditionSql}
      ${this.orderBy ? utils_1.sql.query `order by ${this.orderBy}` : utils_1.sql.query ``}
      offset ${utils_1.sql.value(offset)}
      limit ${limit != null ? utils_1.sql.value(limit) : utils_1.sql.query `all`}
    `);
            // Send our query to Postgres.
            const { rows } = yield client.query(query);
            // Transform our rows into the values our page expects.
            const values = rows.map(({ value }, i) => ({
                // tslint:disable-next-line no-any
                value: transformPgValueIntoValue_1.default(this.pgPaginator.itemType, value),
                cursor: offset + 1 + i,
            }));
            // TODO: We get the count in this function (see `getCount`) to paginate
            // correctly. We should create an optimization that allows us to share
            // what the count is instead of calling for the count again.
            return {
                values,
                // We have super simple implementations for `hasNextPage` and
                // `hasPreviousPage` thanks to the algebraic nature of ordering by
                // offset.
                hasNextPage: () => __awaiter(this, void 0, void 0, function* () { return offset + (limit != null ? limit : Infinity) < (yield getCount()); }),
                hasPreviousPage: () => Promise.resolve(offset > 0),
            };
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgPaginatorOrderingOffset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdQYWdpbmF0b3JPcmRlcmluZ09mZnNldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3Jlcy9pbnZlbnRvcnkvcGFnaW5hdG9yL1BnUGFnaW5hdG9yT3JkZXJpbmdPZmZzZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0Esd0JBQW9CLGFBQ3BCLENBQUMsQ0FEZ0M7QUFDakMsc0NBQWdDLHdCQUNoQyxDQUFDLENBRHVEO0FBQ3hELDRDQUFzQyw4QkFDdEMsQ0FBQyxDQURtRTtBQVVwRTs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSDtJQUtFLFlBQWEsTUFHWjtRQUNDLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQTtRQUNyQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUE7SUFDL0IsQ0FBQztJQUVEOztPQUVHO0lBQ1UsUUFBUSxDQUNuQixPQUFjLEVBQ2QsS0FBYSxFQUNiLE1BQTBDOztZQUUxQyxNQUFNLE1BQU0sR0FBRyw2QkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUMzQyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQTtZQUVsRSx3RUFBd0U7WUFDeEUsa0JBQWtCO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQztnQkFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsQ0FBQyxDQUFBO1lBRTVFLG1FQUFtRTtZQUNuRSxxRUFBcUU7WUFDckUsNkRBQTZEO1lBQzdELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQztnQkFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFBO1lBRTFELHVFQUF1RTtZQUN2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