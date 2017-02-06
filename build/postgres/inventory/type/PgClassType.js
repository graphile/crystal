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
                    externalFieldName: pgAttribute.name,
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
        var resultMap = new Map();
        // Initially set all values verbatim
        for (var key in pgValue) {
            if (Object.prototype.hasOwnProperty.call(pgValue, key)) {
                resultMap.set(key, pgValue[key]);
            }
        }
        // Now overwrite the official pg fields with parsed versions
        Array.from(this.fields).filter(function (_a) {
            var fieldName = _a[0], field = _a[1];
            return pgValue.hasOwnProperty(field.pgAttribute.name);
        }).forEach(function (_a) {
            var fieldName = _a[0], field = _a[1];
            resultMap.set(fieldName, field.type.transformPgValueIntoValue(pgValue[field.pgAttribute.name]));
        });
        return resultMap;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDbGFzc1R5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvUGdDbGFzc1R5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnREFBbUU7QUFFbkUscUNBQWlDO0FBQ2pDLHlEQUFtRDtBQUNuRCxtQ0FBNkI7QUFLN0I7SUFBMEIsdUNBQWE7SUFRckMscUJBQ0UsU0FBb0IsRUFDcEIsT0FBdUIsRUFDdkIsTUFBeUQ7UUFBekQsdUJBQUEsRUFBQSxXQUF5RDtRQUgzRCxZQUtFLGlCQUFPLFNBeUNSO1FBckRlLFVBQUksR0FBYSxRQUFRLENBQUE7UUFhdkMsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUEyQixDQUFBO1FBRWhGLEtBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUE7UUFDdEQsS0FBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUE7UUFDNUQsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsS0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFFcEIsS0FBSSxDQUFDLE1BQU0sR0FBRyxDQUNaLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFxQyxVQUFBLFdBQVc7WUFDbEcsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLGVBQWUsSUFBSSxXQUFXLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxRQUFRLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQTtZQUNuRyxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUU7b0JBQ2pCLFdBQVcsRUFBRSxXQUFXLENBQUMsV0FBVztv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