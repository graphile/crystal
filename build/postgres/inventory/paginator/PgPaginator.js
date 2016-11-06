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
/**
 * An abstract base paginator class for Postgres. This class also exposes a
 * couple of methods that are helpful for our orderings.
 */
class PgPaginator {
    /**
     * Counts how many values are in our `from` entry total.
     */
    count(context, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = pgClientFromContext_1.default(context);
            const fromSql = this.getFromEntrySql(input);
            const conditionSql = this.getConditionSql(input);
            const aliasIdentifier = Symbol();
            const result = yield client.query(utils_1.sql.compile(utils_1.sql.query `select count(${utils_1.sql.identifier(aliasIdentifier)}) as count from ${fromSql} as ${utils_1.sql.identifier(aliasIdentifier)} where ${conditionSql}`));
            return parseInt(result.rows[0]['count'], 10);
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgPaginator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdQYWdpbmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3BhZ2luYXRvci9QZ1BhZ2luYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQSx3QkFBb0IsYUFDcEIsQ0FBQyxDQURnQztBQUNqQyxzQ0FBZ0Msd0JBTWhDLENBQUMsQ0FOdUQ7QUFFeEQ7OztHQUdHO0FBQ0g7SUFtQkU7O09BRUc7SUFDVSxLQUFLLENBQUUsT0FBYyxFQUFFLEtBQWE7O1lBQy9DLE1BQU0sTUFBTSxHQUFHLDZCQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzNDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDM0MsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNoRCxNQUFNLGVBQWUsR0FBRyxNQUFNLEVBQUUsQ0FBQTtZQUNoQyxNQUFNLE1BQU0sR0FBRyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFHLENBQUMsS0FBSyxDQUFBLGdCQUFnQixXQUFHLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsT0FBTyxPQUFPLFdBQUcsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFVBQVUsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBQ2hNLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUM5QyxDQUFDO0tBQUE7QUFDSCxDQUFDO0FBRUQ7a0JBQWUsV0FBVyxDQUFBIn0=