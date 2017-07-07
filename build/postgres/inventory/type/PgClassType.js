"use strict";
var tslib_1 = require("tslib");
var interface_1 = require("../../../interface");
var utils_1 = require("../../utils");
var getTypeFromPgType_1 = require("./getTypeFromPgType");
var PgType_1 = require("./PgType");
var PgClassType = (function (_super) {
    tslib_1.__extends(PgClassType, _super);
    function PgClassType(pgCatalog, pgClass, config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this) || this;
        _this.kind = 'OBJECT';
        var pgType = pgCatalog.assertGetType(pgClass.typeId);
        _this.name = config.name || pgClass.name || pgType.name;
        _this.description = pgClass.description || pgType.description;
        _this.pgClass = pgClass;
        _this.pgType = pgType;
        _this.fields = (new Map(pgCatalog.getClassAttributes(pgClass.id).map(function (pgAttribute) {
            var fieldName = config.renameIdToRowId && pgAttribute.name === 'id' ? 'row_id' : pgAttribute.name;
            return [fieldName, {
                    description: pgAttribute.description,
                    // Make sure that if our attribute specifies that it is non-null,
                    // that we remove the types nullable wrapper if it exists.
                    type: (function () {
                        var pgAttributeType = pgCatalog.assertGetType(pgAttribute.typeId);
                        var type = getTypeFromPgType_1.default(pgCatalog, pgAttributeType);
                        // If the attribute is not null, but the type we got was
                        // nullable, extract the non null variant and return that.
                        if (pgAttribute.isNotNull)
                            return interface_1.getNonNullableType(type);
                        return type;
                    })(),
                    // // Pass along the `hasDefault` information.
                    hasDefault: pgAttribute.hasDefault,
                    // Notice how we add an extra `pgAttribute` property here as per
                    // our custom field type.
                    pgAttribute: pgAttribute,
                    // Get the value from our Postgres row.
                    getValue: function (value) { return value.get(fieldName); },
                }];
        })));
        return _this;
    }
    PgClassType.prototype.isTypeOf = function (_value) {
        throw new Error('Unimplemented');
    };
    PgClassType.prototype.fromFields = function (fields) {
        return fields;
    };
    /**
     * Transforms a Postgres value into an internal value for this type.
     */
    PgClassType.prototype.transformPgValueIntoValue = function (pgValue) {
        if (pgValue == null)
            throw new Error('Postgres value of object type may not be nullish.');
        if (typeof pgValue !== 'object')
            throw new Error("Postgres value of object type must be an object, not '" + typeof pgValue + "'.");
        return new Map(Array.from(this.fields).map(function (_a) {
            var fieldName = _a[0], field = _a[1];
            return [fieldName, field.type.transformPgValueIntoValue(pgValue[field.pgAttribute.name])];
        }));
    };
    /**
     * Transforms our internal value into a Postgres SQL query.
     */
    PgClassType.prototype.transformValueIntoPgValue = function (value) {
        // We can depend on fields being in the correct tuple order for
        // `PgObjectType`, so we just build a tuple using our fields.
        return (_a = ["(", ")::", ""], _a.raw = ["(",
            ")::", ""], utils_1.sql.query(_a, utils_1.sql.join(Array.from(this.fields).map(function (_a) {
            var fieldName = _a[0], field = _a[1];
            return field.type.transformValueIntoPgValue(value.get(fieldName));
        }), ', '), utils_1.sql.identifier(this.pgType.namespaceName, this.pgType.name)));
        var _a;
    };
    return PgClassType;
}(PgType_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgClassType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDbGFzc1R5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvUGdDbGFzc1R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnREFBbUU7QUFFbkUscUNBQWlDO0FBQ2pDLHlEQUFtRDtBQUNuRCxtQ0FBNkI7QUFLN0I7SUFBMEIsdUNBQWE7SUFRckMscUJBQ0UsU0FBb0IsRUFDcEIsT0FBdUIsRUFDdkIsTUFBeUQ7UUFBekQsdUJBQUEsRUFBQSxXQUF5RDtRQUgzRCxZQUtFLGlCQUFPLFNBd0NSO1FBcERlLFVBQUksR0FBYSxRQUFRLENBQUE7UUFhdkMsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUEyQixDQUFBO1FBRWhGLEtBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUE7UUFDdEQsS0FBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUE7UUFDNUQsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsS0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFFcEIsS0FBSSxDQUFDLE1BQU0sR0FBRyxDQUNaLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFxQyxVQUFBLFdBQVc7WUFDbEcsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLGVBQWUsSUFBSSxXQUFXLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxRQUFRLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQTtZQUNuRyxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUU7b0JBQ2pCLFdBQVcsRUFBRSxXQUFXLENBQUMsV0FBVztv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