"use strict";
const utils_1 = require('../../utils');
const conditionToSql_1 = require('../conditionToSql');
const PgPaginator_1 = require('./PgPaginator');
const PgPaginatorOrderingAttributes_1 = require('./PgPaginatorOrderingAttributes');
const PgPaginatorOrderingOffset_1 = require('./PgPaginatorOrderingOffset');
/**
 * The Postgres collection paginator is a paginator explicitly for collections.
 * Collections have a `Condition` as there input and objects as their item
 * values. This implementation leverages that knowledge to create an effective
 * paginator.
 */
class PgCollectionPaginator extends PgPaginator_1.default {
    constructor(collection) {
        super();
        this.collection = collection;
        // Steal some stuff from our collection…
        this._pgCatalog = this.collection._pgCatalog;
        this._pgClass = this.collection.pgClass;
        this._pgNamespace = this._pgCatalog.assertGetNamespace(this._pgClass.namespaceId);
        // Define some of the property stuffs that are easy property copies.
        this.name = this.collection.name;
        this.itemType = this.collection.type;
        /**
         * An array of the orderings a user may choose from to be used with this
         * paginator. Each ordering must have a unique name.
         */
        this.orderings = (() => {
            // Fetch some useful things from our Postgres catalog.
            const pgClassAttributes = this._pgCatalog.getClassAttributes(this._pgClass.id);
            const pgPrimaryKeyConstraint = this._pgCatalog.getConstraints().find(pgConstraint => pgConstraint.type === 'p' && pgConstraint.classId === this._pgClass.id);
            const pgPrimaryKeyAttributes = pgPrimaryKeyConstraint && this._pgCatalog.getClassAttributes(this._pgClass.id, pgPrimaryKeyConstraint.keyAttributeNums);
            return new Map([
                // If this collection has a primary key, we are going to add two
                // orderings. One where all primary key attributes are arranged in
                // ascending order, and the other where all primary key attributes are
                // arranged in descending order.
                //
                // We will only add these orderings if our primary key has two or more
                // attributes.
                ...(pgPrimaryKeyAttributes
                    ? [
                        ['primary_key_asc', new PgPaginatorOrderingAttributes_1.default({
                                pgPaginator: this,
                                descending: false,
                                pgAttributes: pgPrimaryKeyAttributes || [],
                            })],
                        ['primary_key_desc', new PgPaginatorOrderingAttributes_1.default({
                                pgPaginator: this,
                                descending: true,
                                pgAttributes: pgPrimaryKeyAttributes || [],
                            })],
                    ]
                    : []),
                // We include one basic natural ordering which will get whatever order
                // the database gives it.
                ['natural', new PgPaginatorOrderingOffset_1.default({ pgPaginator: this })],
                ...(
                // For all of the Postgres class attributes, create two orderings. One
                // for the ascending ordering of that attribute, and one for the
                // descending order of that attribute.
                //
                // The primary key is also included as attributes (if one exists). This
                // allows us to generate cursors that are truly unique on a row-by-row
                // basis instead of relying on the attribute we are ordering by to be
                // unique.
                //
                // @see https://github.com/calebmer/postgraphql/issues/93
                // @see https://github.com/calebmer/postgraphql/pull/95
                pgClassAttributes
                    .map(pgAttribute => [
                    // Note how we use `Array.from(new Set(…))` here, that will remove
                    // duplicate attributes as the elements in a set must be unique.
                    [`${pgAttribute.name}_asc`, new PgPaginatorOrderingAttributes_1.default({
                            pgPaginator: this,
                            descending: false,
                            pgAttributes: Array.from(new Set([pgAttribute, ...(pgPrimaryKeyAttributes || [])])),
                        })],
                    [`${pgAttribute.name}_desc`, new PgPaginatorOrderingAttributes_1.default({
                            pgPaginator: this,
                            descending: true,
                            pgAttributes: Array.from(new Set([pgAttribute, ...(pgPrimaryKeyAttributes || [])])),
                        })],
                ])
                    .reduce((a, b) => a.concat(b), [])),
            ]);
        })();
        /**
         * The first ordering of our generated orderings array is our default
         * ordering. The first ordering will always be the ascending primary key, or
         * else it will be the natural ordering.
         */
        this.defaultOrdering = Array.from(this.orderings.values())[0];
    }
    /**
     * The `from` entry for a collection paginator is simply the namespaced
     * table name of its collection.
     */
    getFromEntrySql() {
        return utils_1.sql.query `${utils_1.sql.identifier(this._pgNamespace.name, this._pgClass.name)}`;
    }
    /**
     * The condition for this paginator will simply be whatever condition was
     * the input value.
     */
    getConditionSql(condition) {
        return conditionToSql_1.default(condition, [], this.collection.type.getFieldNameFromPgAttributeName('id') === 'row_id');
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgCollectionPaginator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uUGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludmVudG9yeS9wYWdpbmF0b3IvUGdDb2xsZWN0aW9uUGFnaW5hdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSx3QkFBb0IsYUFDcEIsQ0FBQyxDQURnQztBQUVqQyxpQ0FBMkIsbUJBQzNCLENBQUMsQ0FENkM7QUFFOUMsOEJBQXdCLGVBQ3hCLENBQUMsQ0FEc0M7QUFDdkMsZ0RBQTBDLGlDQUMxQyxDQUFDLENBRDBFO0FBQzNFLDRDQUFzQyw2QkFRdEMsQ0FBQyxDQVJrRTtBQUVuRTs7Ozs7R0FLRztBQUNILG9DQUFvQyxxQkFBVztJQUM3QyxZQUNTLFVBQXdCO1FBRS9CLE9BQU8sQ0FBQTtRQUZBLGVBQVUsR0FBVixVQUFVLENBQWM7UUFLakMsd0NBQXdDO1FBQ2hDLGVBQVUsR0FBYyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQTtRQUNsRCxhQUFRLEdBQW1CLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFBO1FBQ2xELGlCQUFZLEdBQXVCLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUV4RyxvRUFBb0U7UUFDN0QsU0FBSSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFBO1FBQ25DLGFBQVEsR0FBaUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUE7UUFrQnBEOzs7V0FHRztRQUNJLGNBQVMsR0FBMEUsQ0FBQztZQUN6RixzREFBc0Q7WUFDdEQsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDOUUsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFB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