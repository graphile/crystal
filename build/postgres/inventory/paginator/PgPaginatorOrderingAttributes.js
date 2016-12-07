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
 * The `PgPaginatorOrderingAttributes` paginator ordering implements an
 * ordering strategy that involves sorting on the attributes of a given
 * `PgObjectType`. We use the `<` and `>` operators in Postgres to implement
 * the before/after cursors and we also ordering using those operators.
 */
class PgPaginatorOrderingAttributes {
    constructor(config) {
        this.pgPaginator = config.pgPaginator;
        this.descending = config.descending != null ? config.descending : false;
        this.pgAttributes = config.pgAttributes;
    }
    /**
     * Reads a single page for this ordering.
     */
    readPage(context, input, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = pgClientFromContext_1.default(context);
            const { descending, pgAttributes } = this;
            const { beforeCursor, afterCursor, first, last, _offset } = config;
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
            const aliasIdentifier = Symbol();
            const fromSql = this.pgPaginator.getFromEntrySql(input);
            const conditionSql = this.pgPaginator.getConditionSql(input);
            const query = utils_1.sql.compile(utils_1.sql.query `
      -- The standard select/from clauses up top.
      select to_json(${utils_1.sql.identifier(aliasIdentifier)}) as value
      from ${fromSql} as ${utils_1.sql.identifier(aliasIdentifier)}

      -- Combine our cursors with the condition used for this page to
      -- implement a where condition which will filter what we want it to.
      --
      -- We throw away nulls because there is a lot of wierdness when they
      -- get included.
      where
        ${utils_1.sql.join(pgAttributes.map(pgAttribute => utils_1.sql.query `${utils_1.sql.identifier(pgAttribute.name)} is not null`), ' and ')} and
        ${beforeCursor ? this._getCursorCondition(pgAttributes, beforeCursor, descending ? '>' : '<') : utils_1.sql.raw('true')} and
        ${afterCursor ? this._getCursorCondition(pgAttributes, afterCursor, descending ? '<' : '>') : utils_1.sql.raw('true')} and
        ${conditionSql}

      -- Order using the same attributes used to construct the cursors. If
      -- a last property was defined we need to reverse our ordering so the
      -- limit will work. We will fix the order in JavaScript.
      order by ${utils_1.sql.join(pgAttributes.map(pgAttribute => utils_1.sql.query `${utils_1.sql.identifier(pgAttribute.name)} using ${utils_1.sql.raw((last != null ? !descending : descending) ? '>' : '<')}`), ', ')}

      -- Finally, apply the appropriate limit.
      limit ${first != null ? utils_1.sql.value(first) : last != null ? utils_1.sql.value(last) : utils_1.sql.raw('all')}

      -- If we have an offset, add that as well.
      ${_offset != null ? utils_1.sql.query `offset ${utils_1.sql.value(_offset)}` : utils_1.sql.query ``}
    `);
            let { rows } = yield client.query(query);
            // If `last` was defined we reversed the order in Sql so our limit would
            // work. We need to reverse again when we get here.
            // TODO: We could implement an `O(1)` reverse with iterators. Then we
            // won’t need to reverse in Sql. We could do that given we get `rows`
            // back as an array. We know the final length and we could start
            // returning from the end instead of the beginning.
            if (last != null)
                rows = rows.reverse();
            // Convert our rows into usable values.
            const values = rows.map(({ value }) => ({
                // tslint:disable-next-line no-any
                value: transformPgValueIntoValue_1.default(this.pgPaginator.itemType, value),
                cursor: pgAttributes.map(pgAttribute => value[pgAttribute.name]),
            }));
            return {
                values,
                // Gets whether or not we have more values to paginate through by
                // running a simple, efficient Sql query to test.
                hasNextPage: () => __awaiter(this, void 0, void 0, function* () {
                    const lastValue = values[values.length - 1];
                    const lastCursor = lastValue ? lastValue.cursor : beforeCursor;
                    if (lastCursor == null)
                        return false;
                    const { rowCount } = yield client.query(utils_1.sql.compile(utils_1.sql.query `
          select null
          from ${fromSql}
          where ${this._getCursorCondition(pgAttributes, lastCursor, descending ? '<' : '>')} and ${conditionSql}
          limit 1
        `));
                    return rowCount !== 0;
                }),
                // Gets whether or not we have more values to paginate through by
                // running a simple, efficient Sql query to test.
                hasPreviousPage: () => __awaiter(this, void 0, void 0, function* () {
                    const firstValue = values[0];
                    const firstCursor = firstValue ? firstValue.cursor : afterCursor;
                    if (firstCursor == null)
                        return false;
                    const { rowCount } = yield client.query(utils_1.sql.compile(utils_1.sql.query `
          select null
          from ${fromSql}
          where ${this._getCursorCondition(pgAttributes, firstCursor, descending ? '>' : '<')} and ${conditionSql}
          limit 1
        `));
                    return rowCount !== 0;
                }),
            };
        });
    }
    /**
     * Gets the condition used to filter our result set using a cursor.
     *
     * @private
     */
    _getCursorCondition(pgAttributes, cursor, operator) {
        return utils_1.sql.query `
      (${utils_1.sql.join(pgAttributes.map(pgAttribute => utils_1.sql.identifier(pgAttribute.name)), ', ')})
      ${utils_1.sql.raw(operator)}
      (${utils_1.sql.join(cursor.map(utils_1.sql.value), ', ')})
    `;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgPaginatorOrderingAttributes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdQYWdpbmF0b3JPcmRlcmluZ0F0dHJpYnV0ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3BhZ2luYXRvci9QZ1BhZ2luYXRvck9yZGVyaW5nQXR0cmlidXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFFQSx3QkFBb0IsYUFDcEIsQ0FBQyxDQURnQztBQUNqQyxzQ0FBZ0Msd0JBQ2hDLENBQUMsQ0FEdUQ7QUFDeEQsNENBQXNDLDhCQUN0QyxDQUFDLENBRG1FO0FBWXBFOzs7OztHQUtHO0FBQ0g7SUFNRSxZQUFhLE1BSVo7UUFDQyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUE7UUFDckMsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQTtRQUN2RSxJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUE7SUFDekMsQ0FBQztJQUVEOztPQUVHO0lBQ1UsUUFBUSxDQUNuQixPQUFjLEVBQ2QsS0FBYSxFQUNiLE1BQThDOztZQUU5QyxNQUFNLE1BQU0sR0FBRyw2QkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUMzQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxHQUFHLElBQUksQ0FBQTtZQUN6QyxNQUFNLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQTtZQUVsRSx3RUFBd0U7WUFDeEUsa0JBQWtCO1lBQ2xCLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQztnQkFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsQ0FBQyxDQUFBO1lBRTVFLG1FQUFtRTtZQUNuRSxxRUFBcUU7WUFDckUsNkRBQTZEO1lBQzdELEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQztnQkFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFBO1lBRTFELHFFQUFxRTtZQUNyRSxxQ0FBcUM7WUFDckMsRUFBRSxDQUFDLENBQUMsV0FBVyxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLFlBQVksQ0FBQyxNQUFNLENBQUM7Z0JBQ3BFLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQTtZQUM5RSxFQUFFLENBQUMsQ0FBQyxZQUFZLElBQUksSUFBSSxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFDLE1BQU0sQ0FBQztnQkFDdEUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0REFBNEQsQ0FBQyxDQUFBO1lBRS9FLE1BQU0sZUFBZSxHQUFHLE1BQU0sRUFBRSxDQUFBO1lBQ2hDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQ3ZELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBRTVELE1BQU0sS0FBSyxHQUFHLFdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBRyxDQUFDLEtBQUssQ0FBQTs7dUJBRWhCLFdBQUcsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDO2FBQ3pDLE9BQU8sT0FBTyxXQUFHLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQzs7Ozs7Ozs7VUFRaEQsV0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxXQUFHLENBQUMsS0FBSyxDQUFBLEdBQUcsV0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLE9BQU8sQ0FBQztVQUM5RyxZQUFZLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsVUFBVSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxXQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztVQUM3RyxXQUFXLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsVUFBVSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxXQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztVQUMzRyxZQUFZOzs7OztpQkFLTCxXQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxJQUM5QyxXQUFHLENBQUMsS0FBSyxDQUFBLEdBQUcsV0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsV0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQ3ZILEVBQUUsSUFBSSxDQUFDOzs7Y0FHQSxLQUFLLElBQUksSUFBSSxHQUFHLFdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLElBQUksR0FBRyxXQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLFdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDOzs7UUFHeEYsT0FBTyxJQUFJLElBQUksR0FBRyxXQUFHLENBQUMsS0FBSyxDQUFBLFVBQVUsV0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLFdBQUcsQ0FBQyxLQUFLLENBQUEsRUFBRTtLQUMxRSxDQUFDLENBQUE7WUFFRixJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBRXhDLHdFQUF3RTtZQUN4RSxtREFBbUQ7WUFDbkQscUVBQXFFO1lBQ3JFLHFFQUFxRTtZQUNyRSxnRUFBZ0U7WUFDaEUsbURBQW1EO1lBQ25ELEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7Z0JBQ2YsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUV2Qix1Q0FBdUM7WUFDdkMsTUFBTSxNQUFNLEdBQ1YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztnQkFDdkIsa0NBQWtDO2dCQUNsQyxLQUFLLEVBQUUsbUNBQXlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFRO2dCQUN6RSxNQUFNLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqRSxDQUFDLENBQUMsQ0FBQTtZQUVMLE1BQU0sQ0FBQztnQkFDTCxNQUFNO2dCQUVOLGlFQUFpRTtnQkFDakUsaURBQWlEO2dCQUNqRCxXQUFXLEVBQUU7b0JBQ1gsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUE7b0JBQzNDLE1BQU0sVUFBVSxHQUFHLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQTtvQkFDOUQsRUFBRSxDQUFDLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQzt3QkFBQyxNQUFNLENBQUMsS0FBSyxDQUFBO29CQUVwQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBRyxDQUFDLEtBQUssQ0FBQTs7aUJBRXBELE9BQU87a0JBQ04sSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxVQUFVLEVBQUUsVUFBVSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsUUFBUSxZQUFZOztTQUV2RyxDQUFDLENBQUMsQ0FBQTtvQkFFSCxNQUFNLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQTtnQkFDdkIsQ0FBQyxDQUFBO2dCQUVELGlFQUFpRTtnQkFDakUsaURBQWlEO2dCQUNqRCxlQUFlLEVBQUU7b0JBQ2YsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUM1QixNQUFNLFdBQVcsR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUE7b0JBQ2hFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUM7d0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQTtvQkFFckMsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFHLENBQUMsT0FBTyxDQUFDLFdBQUcsQ0FBQyxLQUFLLENBQUE7O2lCQUVwRCxPQUFPO2tCQUNOLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLFVBQVUsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsWUFBWTs7U0FFeEcsQ0FBQyxDQUFDLENBQUE7b0JBRUgsTUFBTSxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUE7Z0JBQ3ZCLENBQUMsQ0FBQTthQUNGLENBQUE7UUFDSCxDQUFDO0tBQUE7SUFFRDs7OztPQUlHO0lBQ0ssbUJBQW1CLENBQUUsWUFBdUMsRUFBRSxNQUFvQixFQUFFLFFBQWdCO1FBQzFHLE1BQU0sQ0FBQyxXQUFHLENBQUMsS0FBSyxDQUFBO1NBQ1gsV0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxXQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztRQUNsRixXQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztTQUNoQixXQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQztLQUN6QyxDQUFBO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFRDtrQkFBZSw2QkFBNkIsQ0FBQSJ9