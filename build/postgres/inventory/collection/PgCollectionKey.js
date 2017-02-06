"use strict";
var tslib_1 = require("tslib");
var DataLoader = require("dataloader");
var interface_1 = require("../../../interface");
var utils_1 = require("../../utils");
var pgClientFromContext_1 = require("../pgClientFromContext");
var getTypeFromPgType_1 = require("../type/getTypeFromPgType");
var getSelectFragment_1 = require("../paginator/getSelectFragment");
/**
 * Creates a key from some types of Postgres constraints including primary key
 * constraints and unique constraints.
 */
var PgCollectionKey = (function () {
    function PgCollectionKey(collection, pgConstraint) {
        var _this = this;
        this.collection = collection;
        this.pgConstraint = pgConstraint;
        // Steal the options and catalog reference from our collection ;)
        this._options = this.collection._options;
        this._pgCatalog = this.collection._pgCatalog;
        this._pgClass = this._pgCatalog.assertGetClass(this.pgConstraint.classId);
        this._pgNamespace = this._pgCatalog.assertGetNamespace(this._pgClass.namespaceId);
        this._pgKeyAttributes = this._pgCatalog.getClassAttributes(this.pgConstraint.classId, this.pgConstraint.keyAttributeNums);
        /**
         * Create our key type fields here. We will use these in our definition for
         * the `keyType` and in other places throughout the code.
         *
         * @private
         */
        this._keyTypeFields = (this._pgKeyAttributes.map(function (pgAttribute) {
            var fieldName = _this._options.renameIdToRowId && pgAttribute.name === 'id' ? 'row_id' : pgAttribute.name;
            var type = getTypeFromPgType_1.default(_this._pgCatalog, _this._pgCatalog.assertGetType(pgAttribute.typeId));
            if (pgAttribute.isNotNull)
                type = interface_1.getNonNullableType(type);
            return [fieldName, {
                    description: pgAttribute.description,
                    type: type,
                    externalFieldName: pgAttribute.name,
                    pgAttribute: pgAttribute,
                    getValue: function (value) { return value.get(fieldName); },
                }];
        }));
        /**
         * A type used to represent a key value. Consumers can then use this
         * information to construct intelligent inputs.
         *
         * We can assume that the fields of `keyType` have the same number and order
         * as our Postgres key attributes.
         */
        this.keyType = {
            kind: 'OBJECT',
            // We prefix the name with an underscore because we consider this type to
            // be private. The name could change at any time.
            name: "_" + this.pgConstraint.name,
            fields: new Map(this._keyTypeFields),
            fromFields: function (value) { return value; },
            // TODO: implement? I’m not sure if this code path every really gets used...
            isTypeOf: function (value) {
                if (!(value instanceof Map))
                    return false;
                for (var _i = 0, _a = _this._keyTypeFields; _i < _a.length; _i++) {
                    var _b = _a[_i], field = _b[1];
                    if (!field.type.isTypeOf(field.getValue(value))) {
                        return false;
                    }
                }
                return true;
            },
        };
        /**
         * Creates a name based on combining all of the key attribute names seperated
         * by the word “and”.
         */
        // Note that we define `name` under `keyType`. This is so that we can use the
        // `keyType` field names when making our name instead of the plain Postgres
        // attribute names.
        this.name = Array.from(this.keyType.fields.keys()).join('_and_');
        /**
         * We don’t have a great way to get the description for a key at the moment…
         */
        this.description = undefined;
        /**
         * Reads a value if a user can select from this class. Batches requests to
         * the same client in the background.
         */
        this.read = (!this._pgClass.isSelectable
            ? null
            : function (context, key, resolveInfo, collectionGqlType) {
                return _this._getSelectLoader(pgClientFromContext_1.default(context)).load({ key: key, resolveInfo: resolveInfo, collectionGqlType: collectionGqlType });
            });
        /**
         * Updates a value in our Postgres database using a patch object. If no
         * value could be updated we should throw an error to let the user know.
         *
         * This method, unlike many of the other asynchronous actions in Postgres
         * collections, is not batched.
         */
        this.update = (!this._pgClass.isUpdatable
            ? null
            : function (context, key, patch, resolveInfo, gqlType) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var client, updatedIdentifier, query, result, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            client = pgClientFromContext_1.default(context);
                            updatedIdentifier = Symbol();
                            query = utils_1.sql.compile((_a = ["\n          -- Put our updated rows in a with statement so that we can select\n          -- our result as JSON rows before returning it.\n          with ", " as (\n            update ", "\n\n            -- Using our patch object we construct the fields we want to set and\n            -- the values we want to set them to.\n            set ", "\n\n            where ", "\n            returning *\n          )\n          select ", " as object\n          from ", "\n        "], _a.raw = ["\n          -- Put our updated rows in a with statement so that we can select\n          -- our result as JSON rows before returning it.\n          with ", " as (\n            update ", "\n\n            -- Using our patch object we construct the fields we want to set and\n            -- the values we want to set them to.\n            set ",
                                "\n\n            where ", "\n            returning *\n          )\n          select ", " as object\n          from ", "\n        "], utils_1.sql.query(_a, utils_1.sql.identifier(updatedIdentifier), utils_1.sql.identifier(this._pgNamespace.name, this._pgClass.name), utils_1.sql.join(Array.from(patch).map(function (_a) {
                                var fieldName = _a[0], value = _a[1];
                                var field = _this.collection.type.fields.get(fieldName);
                                if (!field)
                                    throw new Error("Cannot update field named '" + fieldName + "' because it does not exist in collection '" + _this.collection.name + "'.");
                                // Use the actual name of the Postgres attribute when
                                // comparing, not the field name which may be different.
                                return (_b = ["", " = ", ""], _b.raw = ["", " = ", ""], utils_1.sql.query(_b, utils_1.sql.identifier(field.pgAttribute.name), field.type.transformValueIntoPgValue(value)));
                                var _b;
                            }), ', '), this._getSqlSingleKeyCondition(key), getSelectFragment_1.default(resolveInfo, updatedIdentifier, gqlType), utils_1.sql.identifier(updatedIdentifier))));
                            return [4 /*yield*/, client.query(query)];
                        case 1:
                            result = _b.sent();
                            if (result.rowCount < 1)
                                throw new Error("No values were updated in collection '" + this.collection.name + "' using key '" + this.name + "' because no values were found.");
                            return [2 /*return*/, this.collection.type.transformPgValueIntoValue(result.rows[0]['object'])];
                    }
                });
            }); });
        /**
         * Deletes a value in our Postgres database using a given key. If no value
         * could be deleted, an error will be thrown.
         *
         * This method, unlike many others in Postgres collections, is not batched.
         */
        this.delete = (!this._pgClass.isDeletable
            ? null
            : function (context, key, resolveInfo, gqlType) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var client, deletedIdentifier, query, result, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            client = pgClientFromContext_1.default(context);
                            deletedIdentifier = Symbol();
                            query = utils_1.sql.compile((_a = ["\n          with ", " as (\n            delete from ", "\n            where ", "\n            returning *\n          )\n          select ", " as object\n          from ", "\n        "], _a.raw = ["\n          with ", " as (\n            delete from ", "\n            where ", "\n            returning *\n          )\n          select ", " as object\n          from ", "\n        "], utils_1.sql.query(_a, utils_1.sql.identifier(deletedIdentifier), utils_1.sql.identifier(this._pgNamespace.name, this._pgClass.name), this._getSqlSingleKeyCondition(key), getSelectFragment_1.default(resolveInfo, deletedIdentifier, gqlType), utils_1.sql.identifier(deletedIdentifier))));
                            return [4 /*yield*/, client.query(query)];
                        case 1:
                            result = _b.sent();
                            if (result.rowCount < 1)
                                throw new Error("No values were deleted in collection '" + this.collection.name + "' because no values were found.");
                            // tslint:disable-next-line no-any
                            return [2 /*return*/, this.collection.type.transformPgValueIntoValue(result.rows[0]['object'])];
                    }
                });
            }); });
    }
    /**
     * Extracts the key value from an object. In the case of this key, we are
     * just extracting a subset of the value.
     */
    PgCollectionKey.prototype.getKeyFromValue = function (value) {
        return new Map(this._keyTypeFields
            .map(function (_a) {
            var fieldName = _a[0], field = _a[1];
            return [fieldName, field.getValue(value)];
        }));
    };
    /**
     * Takes a key value and transforms it into a Sql condition which can be used
     * in the `where` clause of `select`s, `update`s, and `delete`s.
     *
     * @private
     */
    PgCollectionKey.prototype._getSqlSingleKeyCondition = function (key) {
        return utils_1.sql.join(this._keyTypeFields.map(function (_a) {
            var field = _a[1];
            return (_b = ["", " = ", ""], _b.raw = ["", " = ", ""], utils_1.sql.query(_b, utils_1.sql.identifier(field.pgAttribute.name), field.type.transformValueIntoPgValue(field.getValue(key))));
            var _b;
        }), ' and ');
    };
    /**
     * Gets a loader for the client which will load single values using some
     * keys.
     *
     * @private
     */
    PgCollectionKey.prototype._getSelectLoader = function (client) {
        var _this = this;
        return new DataLoader(function (keysAndStuff) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var aliasIdentifier, keys, fieldses, fields, query, rows, values, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        aliasIdentifier = Symbol();
                        keys = keysAndStuff.map(function (_a) {
                            var key = _a.key;
                            return key;
                        });
                        fieldses = keysAndStuff.map(function (_a) {
                            var resolveInfo = _a.resolveInfo, collectionGqlType = _a.collectionGqlType;
                            return getSelectFragment_1.getFieldsFromResolveInfo(resolveInfo, aliasIdentifier, collectionGqlType);
                        });
                        fields = Object.assign.apply(Object, [{}].concat(fieldses));
                        query = utils_1.sql.compile((_a = ["\n          -- Select our rows as JSON objects.\n          select ", " as object\n          from ", " as ", "\n\n          -- For all of our key attributes we need to test equality with a\n          -- key value. If we only have one key type field, we make anoptimization.\n          where ", "\n\n          -- Throw in a limit for good measure.\n          limit ", "\n        "], _a.raw = ["\n          -- Select our rows as JSON objects.\n          select ", " as object\n          from ", " as ", "\n\n          -- For all of our key attributes we need to test equality with a\n          -- key value. If we only have one key type field, we make anoptimization.\n          where ",
                            "\n\n          -- Throw in a limit for good measure.\n          limit ", "\n        "], utils_1.sql.query(_a, getSelectFragment_1.getSelectFragmentFromFields(fields, aliasIdentifier), utils_1.sql.identifier(this._pgNamespace.name, this._pgClass.name), utils_1.sql.identifier(aliasIdentifier), this._keyTypeFields.length === 1
                            ? (_b = ["", " = any(", ")"], _b.raw = ["", " = any(", ")"], utils_1.sql.query(_b, utils_1.sql.identifier(this._keyTypeFields[0][1].pgAttribute.name), utils_1.sql.value(keys.map(function (key) { return key.get(_this._keyTypeFields[0][0]); })))) : (_c = ["\n              (", ")\n              in (", ")\n            "], _c.raw = ["\n              (", ")\n              in (",
                            ")\n            "], utils_1.sql.query(_c, utils_1.sql.join(this._keyTypeFields.map(function (_a) {
                            var field = _a[1];
                            return utils_1.sql.identifier(field.pgAttribute.name);
                        }), ', '), utils_1.sql.join(keys.map(function (key) {
                            return (_a = ["(", ")"], _a.raw = ["(",
                                ")"], utils_1.sql.query(_a, utils_1.sql.join(_this._keyTypeFields.map(function (_a) {
                                var field = _a[1];
                                return field.type.transformValueIntoPgValue(field.getValue(key));
                            }), ', ')));
                            var _a;
                        }), ', '))), utils_1.sql.value(keys.length))));
                        return [4 /*yield*/, client.query(query)];
                    case 1:
                        rows = (_d.sent()).rows;
                        values = new Map(rows.map(function (_a) {
                            var object = _a.object;
                            var value = _this.collection.type.transformPgValueIntoValue(object);
                            var keyString = _this._keyTypeFields.map(function (_a) {
                                var fieldName = _a[0];
                                return value.get(fieldName);
                            }).join('-');
                            return [keyString, value];
                        }));
                        return [2 /*return*/, keysAndStuff.map(function (_a) {
                                var key = _a.key;
                                var keyString = _this._keyTypeFields.map(function (_a) {
                                    var fieldName = _a[0];
                                    return key.get(fieldName);
                                }).join('-');
                                return values.get(keyString) || null;
                            })];
                }
            });
        }); }, {
            // If we come back later but requesting more fields, we may need to refetch so disable per-key results caching
            cache: false,
        });
    };
    return PgCollectionKey;
}());
tslib_1.__decorate([
    utils_1.memoizeMethod
], PgCollectionKey.prototype, "_getSelectLoader", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgCollectionKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uS2V5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludmVudG9yeS9jb2xsZWN0aW9uL1BnQ29sbGVjdGlvbktleS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUF5QztBQUV6QyxnREFBa0Y7QUFDbEYscUNBQWdEO0FBR2hELDhEQUF3RDtBQUd4RCwrREFBeUQ7QUFFekQsb0VBQXVIO0FBRXZIOzs7R0FHRztBQUNIO0lBQ0UseUJBQ1MsVUFBd0IsRUFDeEIsWUFBdUU7UUFGaEYsaUJBR0k7UUFGSyxlQUFVLEdBQVYsVUFBVSxDQUFjO1FBQ3hCLGlCQUFZLEdBQVosWUFBWSxDQUEyRDtRQUdoRixpRUFBaUU7UUFDekQsYUFBUSxHQUFZLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFBO1FBQzVDLGVBQVUsR0FBYyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQTtRQUNsRCxhQUFRLEdBQW1CLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDcEYsaUJBQVksR0FBdUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ2hHLHFCQUFnQixHQUE4QixJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtRQUV2Sjs7Ozs7V0FLRztRQUNLLG1CQUFjLEdBQThDLENBQ2xFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQXFDLFVBQUEsV0FBVztZQUN2RSxJQUFNLFNBQVMsR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsSUFBSSxXQUFXLENBQUMsSUFBSSxLQUFLLElBQUksR0FB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