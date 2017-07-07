"use strict";
var tslib_1 = require("tslib");
var DataLoader = require("dataloader");
var interface_1 = require("../../../interface");
var utils_1 = require("../../utils");
var pgClientFromContext_1 = require("../pgClientFromContext");
var getTypeFromPgType_1 = require("../type/getTypeFromPgType");
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
            : function (context, key) {
                return _this._getSelectLoader(pgClientFromContext_1.default(context)).load(key);
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
            : function (context, key, patch) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var client, updatedIdentifier, query, result, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            client = pgClientFromContext_1.default(context);
                            updatedIdentifier = Symbol();
                            query = utils_1.sql.compile((_a = ["\n          -- Put our updated rows in a with statement so that we can select\n          -- our result as JSON rows before returning it.\n          with ", " as (\n            update ", "\n\n            -- Using our patch object we construct the fields we want to set and\n            -- the values we want to set them to.\n            set ", "\n\n            where ", "\n            returning *\n          )\n          select row_to_json(", ") as object from ", "\n        "], _a.raw = ["\n          -- Put our updated rows in a with statement so that we can select\n          -- our result as JSON rows before returning it.\n          with ", " as (\n            update ", "\n\n            -- Using our patch object we construct the fields we want to set and\n            -- the values we want to set them to.\n            set ",
                                "\n\n            where ", "\n            returning *\n          )\n          select row_to_json(", ") as object from ", "\n        "], utils_1.sql.query(_a, utils_1.sql.identifier(updatedIdentifier), utils_1.sql.identifier(this._pgNamespace.name, this._pgClass.name), utils_1.sql.join(Array.from(patch).map(function (_a) {
                                var fieldName = _a[0], value = _a[1];
                                var field = _this.collection.type.fields.get(fieldName);
                                if (!field)
                                    throw new Error("Cannot update field named '" + fieldName + "' because it does not exist in collection '" + _this.collection.name + "'.");
                                // Use the actual name of the Postgres attribute when
                                // comparing, not the field name which may be different.
                                return (_b = ["", " = ", ""], _b.raw = ["", " = ", ""], utils_1.sql.query(_b, utils_1.sql.identifier(field.pgAttribute.name), field.type.transformValueIntoPgValue(value)));
                                var _b;
                            }), ', '), this._getSqlSingleKeyCondition(key), utils_1.sql.identifier(updatedIdentifier), utils_1.sql.identifier(updatedIdentifier))));
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
            : function (context, key) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                var client, deletedIdentifier, query, result, _a;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            client = pgClientFromContext_1.default(context);
                            deletedIdentifier = Symbol();
                            query = utils_1.sql.compile((_a = ["\n          with ", " as (\n            delete from ", "\n            where ", "\n            returning *\n          )\n          select row_to_json(", ") as object from ", "\n        "], _a.raw = ["\n          with ", " as (\n            delete from ", "\n            where ", "\n            returning *\n          )\n          select row_to_json(", ") as object from ", "\n        "], utils_1.sql.query(_a, utils_1.sql.identifier(deletedIdentifier), utils_1.sql.identifier(this._pgNamespace.name, this._pgClass.name), this._getSqlSingleKeyCondition(key), utils_1.sql.identifier(deletedIdentifier), utils_1.sql.identifier(deletedIdentifier))));
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
        return new DataLoader(function (keys) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var aliasIdentifier, query, rows, values, _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        aliasIdentifier = Symbol();
                        query = utils_1.sql.compile((_a = ["\n          -- Select our rows as JSON objects.\n          select row_to_json(", ") as object\n          from ", " as ", "\n\n          -- For all of our key attributes we need to test equality with a\n          -- key value. If we only have one key type field, we make anoptimization.\n          where ", "\n\n          -- Throw in a limit for good measure.\n          limit ", "\n        "], _a.raw = ["\n          -- Select our rows as JSON objects.\n          select row_to_json(", ") as object\n          from ", " as ", "\n\n          -- For all of our key attributes we need to test equality with a\n          -- key value. If we only have one key type field, we make anoptimization.\n          where ",
                            "\n\n          -- Throw in a limit for good measure.\n          limit ", "\n        "], utils_1.sql.query(_a, utils_1.sql.identifier(aliasIdentifier), utils_1.sql.identifier(this._pgNamespace.name, this._pgClass.name), utils_1.sql.identifier(aliasIdentifier), this._keyTypeFields.length === 1
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
                        return [2 /*return*/, keys.map(function (key) {
                                var keyString = _this._keyTypeFields.map(function (_a) {
                                    var fieldName = _a[0];
                                    return key.get(fieldName);
                                }).join('-');
                                return values.get(keyString) || null;
                            })];
                }
            });
        }); });
    };
    return PgCollectionKey;
}());
tslib_1.__decorate([
    utils_1.memoizeMethod
], PgCollectionKey.prototype, "_getSelectLoader", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgCollectionKey;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDb2xsZWN0aW9uS2V5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludmVudG9yeS9jb2xsZWN0aW9uL1BnQ29sbGVjdGlvbktleS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUF5QztBQUV6QyxnREFBa0Y7QUFDbEYscUNBQWdEO0FBR2hELDhEQUF3RDtBQUd4RCwrREFBeUQ7QUFHekQ7OztHQUdHO0FBQ0g7SUFDRSx5QkFDUyxVQUF3QixFQUN4QixZQUF1RTtRQUZoRixpQkFHSTtRQUZLLGVBQVUsR0FBVixVQUFVLENBQWM7UUFDeEIsaUJBQVksR0FBWixZQUFZLENBQTJEO1FBR2hGLGlFQUFpRTtRQUN6RCxhQUFRLEdBQVksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUE7UUFDNUMsZUFBVSxHQUFjLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFBO1FBQ2xELGFBQVEsR0FBbUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNwRixpQkFBWSxHQUF1QixJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDaEcscUJBQWdCLEdBQThCLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1FBRXZKOzs7OztXQUtHO1FBQ0ssbUJBQWMsR0FBOEMsQ0FDbEUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBcUMsVUFBQSxXQUFXO1lBQ3ZFLElBQU0sU0FBUyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxJQUFJLFdBQVcsQ0FBQyxJQUFJLEtBQUssSUFBSSxHQUFHLFFBQVEsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFBO1lBQzFHLElBQUksSUFBSSxHQUFHLDJCQUFpQixDQUFDLEtBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7WUFFaEcsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQztnQkFDeEIsSUFBSSxHQUFHLDhCQUFrQixDQUFDLElBQUksQ0FBa0IsQ0FBQTtZQUVsRCxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUU7b0JBQ2pCLFdBQVcsRUFBRSxXQUFXLENBQUMsV0FBVztvQkFDcEMsSUFBSSxNQUFBO29CQUNKLFdBQVcsYUFBQTtvQkFDWCxRQUFRLEVBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFwQixDQUFvQjtpQkFDeEMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQ0gsQ0FBQTtRQUVEOzs7Ozs7V0FNRztRQUNJLFlBQU8sR0FBc0M7WUFDbEQsSUFBSSxFQUFFLFFBQVE7WUFDZCx5RUFBeUU7WUFDekUsaURBQWlEO1lBQ2pELElBQUksRUFBRSxNQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBTTtZQUNsQyxNQUFNLEVBQUUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUNwQyxVQUFVLEVBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLEVBQUwsQ0FBSztZQUMxQiw0RUFBNEU7WUFDNUUsUUFBUSxFQUFFLFVBQUMsS0FBWTtnQkFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssWUFBWSxHQUFHLENBQUMsQ0FBQztvQkFDMUIsTUFBTSxDQUFDLEtBQUssQ0FBQTtnQkFFZCxHQUFHLENBQUMsQ0FBb0IsVUFBbUIsRUFBbkIsS0FBQSxLQUFJLENBQUMsY0FBYyxFQUFuQixjQUFtQixFQUFuQixJQUFtQjtvQkFBaEMsSUFBQSxXQUFTLEVBQU4sYUFBSztvQkFDakIsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNoRCxNQUFNLENBQUMsS0FBSyxDQUFBO29CQUNkLENBQUM7aUJBQ0Y7Z0JBRUQsTUFBTSxDQUFDLElBQUksQ0FBQTtZQUNiLENBQUM7U0FDRixDQUFBO1FBRUQ7OztXQUdHO1FBQ0gsNkVBQTZFO1FBQzdFLDJFQUEyRTtRQUMzRSxtQkFBbUI7UUFDWixTQUFJLEdBQVcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUUxRTs7V0FFRztRQUNJLGdCQUFXLEdBQWMsU0FBUyxDQUFBO1FBeUJ6Qzs7O1dBR0c7UUFDSSxTQUFJLEdBQTJGLENBQ3BHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZO2NBQ3ZCLElBQUk7Y0FDSixVQUFDLE9BQWMsRUFBRSxHQUFzQjtnQkFDdkMsT0FBQSxLQUFJLENBQUMsZ0JBQWdCLENBQUMsNkJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQTdELENBQTZELENBQ2xFLENBQUE7UUE4RUQ7Ozs7OztXQU1HO1FBQ0ksV0FBTSxHQUFzSCxDQUNqSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVztjQUN0QixJQUFJO2NBQ0osVUFBTyxPQUFjLEVBQUUsR0FBc0IsRUFBRSxLQUF5Qjs7b0JBQ2xFLE1BQU0sRUFFTixpQkFBaUIsRUFFakIsS0FBSzs7OztxQ0FKSSw2QkFBbUIsQ0FBQyxPQUFPLENBQUM7Z0RBRWpCLE1BQU0sRUFBRTtvQ0FFcEIsV0FBRyxDQUFDLE9BQU8saWZBQVUsMkpBRzFCLEVBQWlDLDRCQUM3QixFQUEwRCwySkFJN0Q7Z0NBU0csd0JBRUQsRUFBbUMsdUVBR3hCLEVBQWlDLG1CQUFvQixFQUFpQyxZQUM1RyxHQXZCeUIsV0FBRyxDQUFDLEtBQUssS0FHMUIsV0FBRyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUM3QixXQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBSTdELFdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUFrQjtvQ0FBakIsaUJBQVMsRUFBRSxhQUFLO2dDQUNyRCxJQUFNLEtBQUssR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO2dDQUV4RCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQ0FDVCxNQUFNLElBQUksS0FBSyxDQUFDLGdDQUE4QixTQUFTLG1EQUE4QyxLQUFJLENBQUMsVUFBVSxDQUFDLElBQUksT0FBSSxDQUFDLENBQUE7Z0NBRWhJLHFEQUFxRDtnQ0FDckQsd0RBQXdEO2dDQUN4RCxNQUFNLGtDQUFVLEVBQUcsRUFBc0MsS0FBTSxFQUEyQyxFQUFFLEdBQXJHLFdBQUcsQ0FBQyxLQUFLLEtBQUcsV0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLEdBQUU7OzRCQUM5RyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFFRCxJQUFJLENBQUMseUJBQXlCLENBQUMsR0FBRyxDQUFDLEVBR3hCLFdBQUcsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsRUFBb0IsV0FBRyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUMzRzs0QkFFYSxxQkFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFBOztxQ0FBekIsU0FBeUI7NEJBRXhDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO2dDQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLDJDQUF5QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUkscUJBQWdCLElBQUksQ0FBQyxJQUFJLG9DQUFpQyxDQUFDLENBQUE7NEJBRTFJLHNCQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQTs7O2lCQUNoRixDQUNKLENBQUE7UUFFRDs7Ozs7V0FLRztRQUNJLFdBQU0sR0FBMkYsQ0FDdEcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVc7Y0FDdEIsSUFBSTtjQUNKLFVBQU8sT0FBYyxFQUFFLEdBQXNCO29CQUN2QyxNQUFNLEVBRU4saUJBQWlCLEVBSWpCLEtBQUs7Ozs7cUNBTkksNkJBQW1CLENBQUMsT0FBTyxDQUFDO2dEQUVqQixNQUFNLEVBQUU7b0NBSXBCLFdBQUcsQ0FBQyxPQUFPLCtNQUFVLG1CQUMxQixFQUFpQyxpQ0FDeEIsRUFBMEQsc0JBQ2hFLEVBQW1DLHVFQUd4QixFQUFpQyxtQkFBb0IsRUFBaUMsWUFDNUcsR0FQeUIsV0FBRyxDQUFDLEtBQUssS0FDMUIsV0FBRyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUN4QixXQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQ2hFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsRUFHeEIsV0FBRyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFvQixXQUFHLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEdBQzNHOzRCQUVhLHFCQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUE7O3FDQUF6QixTQUF5Qjs0QkFFeEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7Z0NBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkNBQXlDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxvQ0FBaUMsQ0FBQyxDQUFBOzRCQUVqSCxrQ0FBa0M7NEJBQ2xDLHNCQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQTs7O2lCQUNoRixDQUNKLENBQUE7SUEzUUUsQ0FBQztJQTJFSjs7O09BR0c7SUFDSSx5Q0FBZSxHQUF0QixVQUF3QixLQUF3QjtRQUM5QyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQ1osSUFBSSxDQUFDLGNBQWM7YUFDaEIsR0FBRyxDQUFrQixVQUFDLEVBQWtCO2dCQUFqQixpQkFBUyxFQUFFLGFBQUs7WUFBTSxPQUFBLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFBbEMsQ0FBa0MsQ0FBQyxDQUNwRixDQUFBO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssbURBQXlCLEdBQWpDLFVBQW1DLEdBQXNCO1FBQ3ZELE1BQU0sQ0FBQyxXQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBUztnQkFBTixhQUFLO1lBQy9DLHdDQUFTLEVBQUcsRUFBc0MsS0FBTSxFQUF5RCxFQUFFLEdBQW5ILFdBQUcsQ0FBQyxLQUFLLEtBQUcsV0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7UUFBakgsQ0FBbUgsQ0FDcEgsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUNiLENBQUM7SUFhRDs7Ozs7T0FLRztJQUVLLDBDQUFnQixHQUF4QixVQUEwQixNQUFjO1FBRHhDLGlCQW9FQztRQWxFQyxNQUFNLENBQUMsSUFBSSxVQUFVLENBQ25CLFVBQU8sSUFBOEI7O2dCQUM3QixlQUFlLEVBb0JmLEtBQUssUUFnQ0wsTUFBTTs7OzswQ0FwRFksTUFBTSxFQUFFO2dDQW9CbEIsV0FBRyxDQUFDLE9BQU8sNlpBQVUsZ0ZBRVosRUFBK0IsOEJBQzdDLEVBQTBELE1BQU8sRUFBK0IsdUxBSS9GOzRCQWlCUix1RUFHUSxFQUFzQixZQUMvQixHQTVCeUIsV0FBRyxDQUFDLEtBQUssS0FFWixXQUFHLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxFQUM3QyxXQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQU8sV0FBRyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsRUFJL0YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQztvRUFLM0IsRUFBRyxFQUEwRCxTQUFVLEVBQThELEdBQUcsR0FBakosV0FBRyxDQUFDLEtBQUssS0FBRyxXQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFVLFdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFsQyxDQUFrQyxDQUFDLENBQUMsd0ZBSXJJLG1CQUNOLEVBQThGLHVCQUMzRjs0QkFJRSxpQkFDVCxHQVBDLFdBQUcsQ0FBQyxLQUFLLEtBQ04sV0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQVM7Z0NBQU4sYUFBSzs0QkFBTSxPQUFBLFdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7d0JBQXRDLENBQXNDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFDM0YsV0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRzs0QkFDekIsbUNBQVMsR0FBSTtnQ0FFTCxHQUFHLEdBRlgsV0FBRyxDQUFDLEtBQUssS0FBSSxXQUFHLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBUztvQ0FBTixhQUFLO2dDQUNyRCxPQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFBekQsQ0FBeUQsQ0FDMUQsRUFBRSxJQUFJLENBQUM7O3dCQUZSLENBRVcsQ0FDWixFQUFFLElBQUksQ0FBQyxFQUNULEVBSUssV0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQzlCO3dCQUVlLHFCQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUE7OytCQUF6QixDQUFBLFNBQXlCLENBQUE7aUNBRTNCLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQThCLFVBQUMsRUFBVTtnQ0FBUixrQkFBTTs0QkFDcEUsSUFBTSxLQUFLLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7NEJBQ3BFLElBQU0sU0FBUyxHQUFHLEtBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBVztvQ0FBVixpQkFBUztnQ0FBTSxPQUFBLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDOzRCQUFwQixDQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBOzRCQUMxRixNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7d0JBQzNCLENBQUMsQ0FBQyxDQUFDO3dCQUVILHNCQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHO2dDQUNqQixJQUFNLFNBQVMsR0FBRyxLQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQVc7d0NBQVYsaUJBQVM7b0NBQU0sT0FBQSxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztnQ0FBbEIsQ0FBa0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQ0FDeEYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFBOzRCQUN0QyxDQUFDLENBQUMsRUFBQTs7O2FBQ0gsQ0FDRixDQUFBO0lBQ0gsQ0FBQztJQXFGSCxzQkFBQztBQUFELENBQUMsQUFoUkQsSUFnUkM7QUF4SkM7SUFEQyxxQkFBYTt1REFvRWI7O0FBMkZILGtCQUFlLGVBQWUsQ0FBQSJ9