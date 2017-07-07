"use strict";
var tslib_1 = require("tslib");
var pluralize = require("pluralize");
var DataLoader = require("dataloader");
var utils_1 = require("../../utils");
var PgClassType_1 = require("../type/PgClassType");
var pgClientFromContext_1 = require("../pgClientFromContext");
var PgCollectionPaginator_1 = require("../paginator/PgCollectionPaginator");
var PgCollectionKey_1 = require("./PgCollectionKey");
/**
 * Creates a collection object for Postgres that can be used to access the
 * data. A collection aligns fairly well with a Postgres “class” that is
 * selectable. Non-selectable classes are generally compound types.
 */
var PgCollection = (function () {
    function PgCollection(_options, _pgCatalog, pgClass) {
        var _this = this;
        this._options = _options;
        this._pgCatalog = _pgCatalog;
        this.pgClass = pgClass;
        /**
         * Instantiate some private dependencies of our collection using our instance
         * of `PgCatalog`.
         */
        this._pgNamespace = this._pgCatalog.assertGetNamespace(this.pgClass.namespaceId);
        /**
         * The name of this collection. A pluralized version of the class name. We
         * expect class names to be singular.
         *
         * If a class with the pluralized version of the name exists, we won’t
         * pluralize the class name.
         */
        this.name = (function () {
            var pluralName = pluralize(_this.pgClass.name);
            var pluralNameExists = false;
            for (var _i = 0, _a = _this._pgCatalog.getNamespaces(); _i < _a.length; _i++) {
                var pgNamespace = _a[_i];
                if (_this._pgCatalog.getClassByName(pgNamespace.name, pluralName))
                    pluralNameExists = true;
            }
            return pluralNameExists ? _this.pgClass.name : pluralName;
        })();
        /**
         * The description of this collection taken from the Postgres class’s
         * comment.
         */
        this.description = this.pgClass.description;
        /**
         * Gets the type for our collection using the composite type for this class.
         * We can depend on this type having the exact same number of fields as there
         * are Postgres attributes and in the exact same order.
         */
        this.type = new PgClassType_1.default(this._pgCatalog, this.pgClass, {
            // Singularize the name of our type, *unless* a class already exists in our
            // catalog with that name. If a class already has the name we will just
            // cause a conflict.
            name: (function () {
                var singularName = pluralize(_this.pgClass.name, 1);
                var singularNameExists = false;
                for (var _i = 0, _a = _this._pgCatalog.getNamespaces(); _i < _a.length; _i++) {
                    var pgNamespace = _a[_i];
                    if (_this._pgCatalog.getClassByName(pgNamespace.name, singularName))
                        singularNameExists = true;
                }
                return singularNameExists ? _this.pgClass.name : singularName;
            })(),
            renameIdToRowId: this._options.renameIdToRowId,
        });
        /**
         * An array of all the keys which can be used to uniquely identify a value
         * in our collection.
         *
         * The keys are a representation of the primary key constraints and unique
         * constraints in Postgres on the table.
         */
        this.keys = (this._pgCatalog.getConstraints()
            .filter(function (pgConstraint) { return pgConstraint.classId === _this.pgClass.id; })
            .map(function (pgConstraint) {
            // We also only want primary key constraints and unique constraints.
            return pgConstraint.type === 'p' || pgConstraint.type === 'u'
                ? new PgCollectionKey_1.default(_this, pgConstraint)
                : null;
        })
            .filter(Boolean));
        /**
         * The primary key for our collection is just an instance of `CollectionKey`
         * representing the single primary key constraint in Postgres. We choose one
         * key to be our primary key so that consumers have a clear choice in what id
         * should be used.
         */
        this.primaryKey = this.keys.find(function (key) { return key.pgConstraint.type === 'p'; });
        this.paginator = new PgCollectionPaginator_1.default(this);
        // If we can’t insert into this class, there should be no `create`
        // function. Otherwise our `create` method is pretty basic.
        this.create = (!this.pgClass.isInsertable
            ? null
            : function (context, value) {
                return _this._getInsertLoader(pgClientFromContext_1.default(context)).load(value);
            });
    }
    /**
     * Gets a loader for inserting rows into the database. We create a
     * memoized version of this function to ensure we get consistent data
     * loaders.
     *
     * @private
     */
    PgCollection.prototype._getInsertLoader = function (client) {
        var _this = this;
        return new DataLoader(function (values) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var insertionIdentifier, fields, query, rows, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        insertionIdentifier = Symbol();
                        fields = new Map();
                        values.forEach(function (map) {
                            map.forEach(function (value, key) {
                                if (typeof value !== 'undefined') {
                                    fields.set(key, _this.type.fields.get(key));
                                }
                            });
                        });
                        query = utils_1.sql.compile((_a = ["\n          with ", " as (\n            -- Start by defining our header which will be the class we are\n            -- inserting into (prefixed by namespace of course).\n            insert into ", "\n\n            -- Add all of the attributes that we're going to use as columns to be inserted into.\n            -- This is helpful in case the columns differ from what we expect.\n            (", ")\n\n            -- Next, add all of our value tuples.\n            values ", "\n\n            -- Finally, return everything.\n            returning *\n          )\n          -- We use a subquery with our insert so we can turn the result into JSON.\n          select row_to_json(", ") as object from ", "\n        "], _a.raw = ["\n          with ", " as (\n            -- Start by defining our header which will be the class we are\n            -- inserting into (prefixed by namespace of course).\n            insert into ", "\n\n            -- Add all of the attributes that we're going to use as columns to be inserted into.\n            -- This is helpful in case the columns differ from what we expect.\n            (", ")\n\n            -- Next, add all of our value tuples.\n            values ",
                            "\n\n            -- Finally, return everything.\n            returning *\n          )\n          -- We use a subquery with our insert so we can turn the result into JSON.\n          select row_to_json(", ") as object from ", "\n        "], utils_1.sql.query(_a, utils_1.sql.identifier(insertionIdentifier), utils_1.sql.identifier(this._pgNamespace.name, this.pgClass.name), utils_1.sql.join(Array.from(fields.values()).map(function (_a) {
                            var pgAttribute = _a.pgAttribute;
                            return utils_1.sql.identifier(pgAttribute.name);
                        }), ', '), utils_1.sql.join(values.map(function (value) {
                            // Make sure we have one value for every attribute in the class,
                            // if there was no such value defined, we should just use
                            // `default` and use the user’s default value.
                            return (_a = ["(", ")"], _a.raw = ["(",
                                ")"], utils_1.sql.query(_a, utils_1.sql.join(Array.from(fields.values()).map(function (field) {
                                var fieldValue = field.getValue(value);
                                return typeof fieldValue === 'undefined' ? (_a = ["default"], _a.raw = ["default"], utils_1.sql.query(_a)) : field.type.transformValueIntoPgValue(fieldValue);
                                var _a;
                            }), ', ')));
                            var _a;
                        }), ', '), utils_1.sql.identifier(insertionIdentifier), utils_1.sql.identifier(insertionIdentifier))));
                        return [4 /*yield*/, client.query(query)];
                    case 1:
                        rows = (_b.sent()).rows;
                        return [2 /*return*/, rows.map(function (_a) {
                                var object = _a.object;
                                return _this.type.transformPgValueIntoValue(object);
                            })];
                }
            });
        }); });
    };
    return PgCollection;
}());
tslib_1.__decorate([
    utils_1.memoizeMethod
], PgCollection.prototype, "_getInsertLoader", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgCollection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludmVudG9yeS9jb2xsZWN0aW9uL1BnQ29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUF1QztBQUN2Qyx1Q0FBeUM7QUFHekMscUNBQWdEO0FBRWhELG1EQUE2QztBQUU3Qyw4REFBd0Q7QUFDeEQsNEVBQXNFO0FBQ3RFLHFEQUErQztBQUUvQzs7OztHQUlHO0FBQ0g7SUFDRSxzQkFDUyxRQUFpQixFQUNqQixVQUFxQixFQUNyQixPQUF1QjtRQUhoQyxpQkFJSTtRQUhLLGFBQVEsR0FBUixRQUFRLENBQVM7UUFDakIsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUNyQixZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUdoQzs7O1dBR0c7UUFDSyxpQkFBWSxHQUF1QixJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7UUFFdkc7Ozs7OztXQU1HO1FBQ0ksU0FBSSxHQUFXLENBQUM7WUFDckIsSUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDL0MsSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUE7WUFFNUIsR0FBRyxDQUFDLENBQXNCLFVBQStCLEVBQS9CLEtBQUEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsRUFBL0IsY0FBK0IsRUFBL0IsSUFBK0I7Z0JBQXBELElBQU0sV0FBVyxTQUFBO2dCQUNwQixFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO29CQUMvRCxnQkFBZ0IsR0FBRyxJQUFJLENBQUE7YUFBQTtZQUUzQixNQUFNLENBQUMsZ0JBQWdCLEdBQUcsS0FBSSxDQUFD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