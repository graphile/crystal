"use strict";
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var conditionToSql_1 = require("../conditionToSql");
var PgPaginator_1 = require("./PgPaginator");
var PgPaginatorOrderingAttributes_1 = require("./PgPaginatorOrderingAttributes");
var PgPaginatorOrderingOffset_1 = require("./PgPaginatorOrderingOffset");
/**
 * The Postgres collection paginator is a paginator explicitly for collections.
 * Collections have a `Condition` as there input and objects as their item
 * values. This implementation leverages that knowledge to create an effective
 * paginator.
 */
var PgCollectionPaginator = (function (_super) {
    tslib_1.__extends(PgCollectionPaginator, _super);
    function PgCollectionPaginator(collection) {
        var _this = _super.call(this) || this;
        _this.collection = collection;
        // Steal some stuff from our collection…
        _this._pgCatalog = _this.collection._pgCatalog;
        _this._pgClass = _this.collection.pgClass;
        _this._pgNamespace = _this._pgCatalog.assertGetNamespace(_this._pgClass.namespaceId);
        // Define some of the property stuffs that are easy property copies.
        _this.name = _this.collection.name;
        _this.itemType = _this.collection.type;
        /**
         * An array of the orderings a user may choose from to be used with this
         * paginator. Each ordering must have a unique name.
         */
        _this.orderings = (function () {
            // Fetch some useful things from our Postgres catalog.
            var pgClassAttributes = _this._pgCatalog.getClassAttributes(_this._pgClass.id);
            var pgPrimaryKeyConstraint = _this._pgCatalog.getConstraints().find(function (pgConstraint) { return pgConstraint.type === 'p' && pgConstraint.classId === _this._pgClass.id; });
            var pgPrimaryKeyAttributes = pgPrimaryKeyConstraint && _this._pgCatalog.getClassAttributes(_this._pgClass.id, pgPrimaryKeyConstraint.keyAttributeNums);
            return new Map((pgPrimaryKeyAttributes
                ? [
                    ['primary_key_asc', new PgPaginatorOrderingAttributes_1.default({
                            pgPaginator: _this,
                            descending: false,
                            pgAttributes: pgPrimaryKeyAttributes || [],
                        })],
                    ['primary_key_desc', new PgPaginatorOrderingAttributes_1.default({
                            pgPaginator: _this,
                            descending: true,
                            pgAttributes: pgPrimaryKeyAttributes || [],
                        })],
                ]
                : []).concat([
                // We include one basic natural ordering which will get whatever order
                // the database gives it.
                ['natural', new PgPaginatorOrderingOffset_1.default({ pgPaginator: _this })]
            ], (
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
                .map(function (pgAttribute) { return [
                // Note how we use `Array.from(new Set(…))` here, that will remove
                // duplicate attributes as the elements in a set must be unique.
                [pgAttribute.name + "_asc", new PgPaginatorOrderingAttributes_1.default({
                        pgPaginator: _this,
                        descending: false,
                        pgAttributes: Array.from(new Set([pgAttribute].concat((pgPrimaryKeyAttributes || [])))),
                    })],
                [pgAttribute.name + "_desc", new PgPaginatorOrderingAttributes_1.default({
                        pgPaginator: _this,
                        descending: true,
                        pgAttributes: Array.from(new Set([pgAttribute].concat((pgPrimaryKeyAttributes || [])))),
                    })],
            ]; })
                .reduce(function (a, b) { return a.concat(b); }, []))));
        })();
        /**
         * The first ordering of our generated orderings array is our default
         * ordering. The first ordering will always be the ascending primary key, or
         * else it will be the natural ordering.
         */
        _this.defaultOrdering = Array.from(_this.orderings.values())[0];
        return _this;
    }
    /**
     * The `from` entry for a collection paginator is simply the namespaced
     * table name of its collection.
     */
    PgCollectionPaginator.prototype.getFromEntrySql = function () {
        return (_a = ["", ""], _a.raw = ["", ""], utils_1.sql.query(_a, utils_1.sql.identifier(this._pgNamespace.name, this._pgClass.name)));
        var _a;
    };
    /**
     * The condition for this paginator will simply be whatever condition was
     * the input value.
     */
    PgCollectionPaginator.prototype.getConditionSql = function (condition) {
        return conditionToSql_1.default(condition, [], Boolean(this.collection._options.renameIdToRowId && this.collection.primaryKey));
    };
    return PgCollectionPaginator;
}(PgPaginator_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgCollectionPaginator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uUGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludmVudG9yeS9wYWdpbmF0b3IvUGdDb2xsZWN0aW9uUGFnaW5hdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEscUNBQWlDO0FBRWpDLG9EQUE4QztBQUU5Qyw2Q0FBdUM7QUFDdkMsaUZBQTJFO0FBQzNFLHlFQUFtRTtBQUVuRTs7Ozs7R0FLRztBQUNIO0lBQW9DLGlEQUF5QztJQUMzRSwrQkFDUyxVQUF3QjtRQURqQyxZQUdFLGlCQUFPLFNBQ1I7UUFIUSxnQkFBVSxHQUFWLFVBQVUsQ0FBYztRQUtqQyx3Q0FBd0M7UUFDaEMsZ0JBQVUsR0FBYyxLQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQTtRQUNsRCxjQUFRLEdBQW1CLEtBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFBO1FBQ2xELGtCQUFZLEdBQXVCLEtBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUV4RyxvRUFBb0U7UUFDN0QsVUFBSSxHQUFXLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFBO1FBQ25DLGNBQVEsR0FBZ0IsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUE7UUFrQm5EOzs7V0FHRztRQUNJLGVBQVMsR0FBeUUsQ0FBQztZQUN4RixzREFBc0Q7WUFDdEQsSUFBTSxpQkFBaUIsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDOUUsSUFBTSxzQkFBc0IsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLFlBQVksSUFBSSxPQUFBLFlBQVksQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLFlBQVksQ0FBQyxP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