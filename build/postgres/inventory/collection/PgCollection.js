"use strict";
var tslib_1 = require("tslib");
var pluralize = require("pluralize");
var DataLoader = require("dataloader");
var utils_1 = require("../../utils");
var PgClassType_1 = require("../type/PgClassType");
var pgClientFromContext_1 = require("../pgClientFromContext");
var PgCollectionPaginator_1 = require("../paginator/PgCollectionPaginator");
var PgCollectionKey_1 = require("./PgCollectionKey");
var getSelectFragment_1 = require("../paginator/getSelectFragment");
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
        this._pgAttributes = this._pgCatalog.getClassAttributes(this.pgClass.id);
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
            : function (context, value, resolveInfo, collectionGqlType) {
                return _this._getInsertLoader(pgClientFromContext_1.default(context)).load({ value: value, resolveInfo: resolveInfo, collectionGqlType: collectionGqlType });
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
        return new DataLoader(function (valuesAndStuff) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var insertionIdentifier, values, fieldses, fields, query, rows, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        insertionIdentifier = Symbol();
                        values = valuesAndStuff.map(function (_a) {
                            var value = _a.value;
                            return value;
                        });
                        fieldses = valuesAndStuff.map(function (_a) {
                            var resolveInfo = _a.resolveInfo, collectionGqlType = _a.collectionGqlType;
                            return getSelectFragment_1.getFieldsFromResolveInfo(resolveInfo, insertionIdentifier, collectionGqlType);
                        });
                        fields = Object.assign.apply(Object, [{}].concat(fieldses));
                        query = utils_1.sql.compile((_a = ["\n          with ", " as (\n            -- Start by defining our header which will be the class we are\n            -- inserting into (prefixed by namespace of course).\n            insert into ", "\n\n            -- Add all of our attributes as columns to be inserted into. This is\n            -- helpful in case the columns differ from what we expect.\n            (", ")\n\n            -- Next, add all of our value tuples.\n            values ", "\n\n            -- Finally, return everything.\n            returning *\n          )\n          -- We use a subquery with our insert so we can turn the result into JSON.\n          select ", " as object\n          from ", "\n        "], _a.raw = ["\n          with ", " as (\n            -- Start by defining our header which will be the class we are\n            -- inserting into (prefixed by namespace of course).\n            insert into ", "\n\n            -- Add all of our attributes as columns to be inserted into. This is\n            -- helpful in case the columns differ from what we expect.\n            (", ")\n\n            -- Next, add all of our value tuples.\n            values ",
                            "\n\n            -- Finally, return everything.\n            returning *\n          )\n          -- We use a subquery with our insert so we can turn the result into JSON.\n          select ", " as object\n          from ", "\n        "], utils_1.sql.query(_a, utils_1.sql.identifier(insertionIdentifier), utils_1.sql.identifier(this._pgNamespace.name, this.pgClass.name), utils_1.sql.join(this._pgAttributes.map(function (_a) {
                            var name = _a.name;
                            return utils_1.sql.identifier(name);
                        }), ', '), utils_1.sql.join(values.map(function (value) {
                            // Make sure we have one value for every attribute in the class,
                            // if there was no such value defined, we should just use
                            // `default` and use the user’s default value.
                            return (_a = ["(", ")"], _a.raw = ["(",
                                ")"], utils_1.sql.query(_a, utils_1.sql.join(Array.from(_this.type.fields.values()).map(function (field) {
                                var fieldValue = field.getValue(value);
                                return typeof fieldValue === 'undefined' ? (_a = ["default"], _a.raw = ["default"], utils_1.sql.query(_a)) : field.type.transformValueIntoPgValue(fieldValue);
                                var _a;
                            }), ', ')));
                            var _a;
                        }), ', '), getSelectFragment_1.getSelectFragmentFromFields(fields, insertionIdentifier), utils_1.sql.identifier(insertionIdentifier))));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludmVudG9yeS9jb2xsZWN0aW9uL1BnQ29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUF1QztBQUN2Qyx1Q0FBeUM7QUFHekMscUNBQWdEO0FBRWhELG1EQUE2QztBQUU3Qyw4REFBd0Q7QUFDeEQsNEVBQXNFO0FBQ3RFLHFEQUErQztBQUMvQyxvRUFBb0c7QUFFcEc7Ozs7R0FJRztBQUNIO0lBQ0Usc0JBQ1MsUUFBaUIsRUFDakIsVUFBcUIsRUFDckIsT0FBdUI7UUFIaEMsaUJBSUk7UUFISyxhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQ2pCLGVBQVUsR0FBVixVQUFVLENBQVc7UUFDckIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFHaEM7OztXQUdHO1FBQ0ssaUJBQVksR0FBdUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQy9GLGtCQUFhLEdBQThCLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUV0Rzs7Ozs7O1dBTUc7UUFDSSxTQUFJLEdBQVcsQ0FBQztZQUNyQixJQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUMvQyxJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQTtZQUU1QixHQUFHLENBQUMsQ0FBc0IsVUFBK0IsRUFBL0IsS0FBQSxLQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxFQUEvQixjQUErQixFQUEvQixJQUErQjtnQkFBcEQsSUFBTSxXQUFXLFNBQUE7Z0JBQ3BCLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FB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