"use strict";
const utils_1 = require('../../../postgres/utils');
const PgPaginator_1 = require('../../../postgres/inventory/paginator/PgPaginator');
const PgPaginatorOrderingOffset_1 = require('../../../postgres/inventory/paginator/PgPaginatorOrderingOffset');
const createPgProcedureSqlCall_1 = require('./createPgProcedureSqlCall');
/**
 * A procedure paginator is one in which a Postgres function is the source of
 * all values.
 */
class PgProcedurePaginator extends PgPaginator_1.default {
    constructor(_fixtures) {
        super();
        this._fixtures = _fixtures;
        this.name = this._fixtures.pgProcedure.name;
        this.itemType = this._fixtures.return.type;
        /**
         * The different ways we can order our procedure. Of course we can order the
         * procedure the natural way, but also we should be able to order by
         * attributes if returned a class.
         */
        // TODO: Add attribute orderings if a class gets returned.
        this.orderings = (new Map([
            ['natural', new PgPaginatorOrderingOffset_1.default({ pgPaginator: this })],
        ]));
        /**
         * The default ordering for procedures will always be the natural ordering.
         * This is because the procedure may define an order itself.
         */
        this.defaultOrdering = this.orderings.get('natural');
    }
    /**
     * The from entry for this paginator is a Postgres function call where the
     * procedure is the function being called.
     */
    getFromEntrySql(input) {
        return createPgProcedureSqlCall_1.default(this._fixtures, input);
    }
    /**
     * The condition when we are using a procedure will always be true.
     */
    getConditionSql() {
        return utils_1.sql.query `true`;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgProcedurePaginator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdQcm9jZWR1cmVQYWdpbmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvc2NoZW1hL3Byb2NlZHVyZXMvUGdQcm9jZWR1cmVQYWdpbmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLHdCQUFvQix5QkFDcEIsQ0FBQyxDQUQ0QztBQUM3Qyw4QkFBd0IsbURBQ3hCLENBQUMsQ0FEMEU7QUFDM0UsNENBQXNDLGlFQUN0QyxDQUFDLENBRHNHO0FBRXZHLDJDQUFxQyw0QkFRckMsQ0FBQyxDQVJnRTtBQVVqRTs7O0dBR0c7QUFDSCxtQ0FBK0MscUJBQVc7SUFDeEQsWUFDVSxTQUE4QjtRQUV0QyxPQUFPLENBQUE7UUFGQyxjQUFTLEdBQVQsU0FBUyxDQUFxQjtRQUtqQyxTQUFJLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFBO1FBQzlDLGFBQVEsR0FBcUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBd0IsQ0FBQTtRQUVsRjs7OztXQUlHO1FBQ0gsMERBQTBEO1FBQ25ELGNBQVMsR0FBdUUsQ0FDckYsSUFBSSxHQUFHLENBQUM7WUFDTixDQUFDLFNBQVMsRUFBRSxJQUFJLG1DQUF5QixDQUFDLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7U0FDbEUsQ0FBQyxDQUNILENBQUE7UUFFRDs7O1dBR0c7UUFDSSxvQkFBZSxHQUEwRCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUUsQ0FBQTtJQXJCOUcsQ0FBQztJQXVCRDs7O09BR0c7SUFDSSxlQUFlLENBQUUsS0FBcUI7UUFDM0MsTUFBTSxDQUFDLGtDQUF3QixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDeEQsQ0FBQztJQUVEOztPQUVHO0lBQ0ksZUFBZTtRQUNwQixNQUFNLENBQUMsV0FBRyxDQUFDLEtBQUssQ0FBQSxNQUFNLENBQUE7SUFDeEIsQ0FBQztBQUNILENBQUM7QUFFRDtrQkFBZSxvQkFBb0IsQ0FBQSJ9