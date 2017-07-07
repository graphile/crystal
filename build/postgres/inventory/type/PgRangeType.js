"use strict";
var tslib_1 = require("tslib");
var interface_1 = require("../../../interface");
var utils_1 = require("../../utils");
var getTypeFromPgType_1 = require("./getTypeFromPgType");
var PgType_1 = require("./PgType");
/**
 * The built in Postgres range types don’t have names that match up with our
 * traditional conventions. Therefore we want to rename them. This is a map of
 * the type oids to their new names.
 *
 * @private
 */
// TODO: Refactor renames.
// TODO: In the future, just return an `integer_range` `PgRangeObjectType` for
// `big_integer_range`.
var typeOidToName = new Map([
    ['3904', 'integer_range'],
    ['3926', 'big_integer_range'],
    ['3906', 'float_range'],
    ['3908', 'timestamp_range'],
    ['3910', 'timezone_timestamp_range'],
    ['3912', 'date_range'],
]);
/**
 * This object type represents a Postgres range. It parses the rough set
 * notation format (looks like `(1,5]`) into an object and serializes that
 * object back down into the range format.
 */
// TODO: test
var PgRangeType = (function (_super) {
    tslib_1.__extends(PgRangeType, _super);
    function PgRangeType(pgCatalog, pgRangeType) {
        var _this = _super.call(this) || this;
        _this.kind = 'OBJECT';
        var name = typeOidToName.get(pgRangeType.id) || pgRangeType.name;
        var pgSubType = pgCatalog.assertGetType(pgRangeType.rangeSubTypeId);
        var subType = getTypeFromPgType_1.default(pgCatalog, pgSubType);
        var boundType = new interface_1.BasicObjectType({
            name: name + "-bound",
            description: 'The value at one end of a range. A range can either include this value, or not.',
            fields: new Map([
                ['value', {
                        description: 'The value at one end of our range.',
                        type: interface_1.getNonNullableType(subType),
                    }],
                ['inclusive', {
                        description: 'Whether or not the value of this bound is included in the range.',
                        type: interface_1.booleanType,
                    }],
            ]),
        });
        _this.fields = new Map([
            ['start', {
                    description: 'The starting bound of our range.',
                    type: new interface_1.NullableType(boundType),
                    getValue: function (range) { return range.start; },
                }],
            ['end', {
                    description: 'The ending bound of our range.',
                    type: new interface_1.NullableType(boundType),
                    getValue: function (range) { return range.end; },
                }],
        ]);
        _this.name = name;
        _this.description = pgRangeType.description;
        _this.pgRangeType = pgRangeType;
        _this.subType = subType;
        return _this;
    }
    PgRangeType.prototype.isTypeOf = function (_value) {
        throw new Error('Unimplemented.');
    };
    PgRangeType.prototype.fromFields = function (fields) {
        var start = fields.get('start');
        var end = fields.get('end');
        return {
            start: start,
            end: end,
        };
    };
    /**
     * Transform a Postgres value into a range value by parsing the range literal
     * and then setting up an object of the correct type.
     */
    PgRangeType.prototype.transformPgValueIntoValue = function (rangeLiteral) {
        var range = parseRange(rangeLiteral);
        var rangeValue = {};
        if (range.start) {
            rangeValue.start = {
                value: this.subType.transformPgValueIntoValue(range.start.value),
                inclusive: range.start.inclusive,
            };
        }
        if (range.end) {
            rangeValue.end = {
                value: this.subType.transformPgValueIntoValue(range.end.value),
                inclusive: range.end.inclusive,
            };
        }
        return rangeValue;
    };
    /**
     * Transform this internal value into a Postgres Sql value. Does this by
     * calling the canonical function that goes with the range type. For example
     * `public.numrange(lowerBound, upperBound, bounds)`.
     */
    // TODO: test
    // TODO: no anys?
    PgRangeType.prototype.transformValueIntoPgValue = function (rangeValue) {
        var start = rangeValue.start;
        var end = rangeValue.end;
        var lowerInclusive = start != null && start.inclusive ? '[' : '(';
        var upperInclusive = end != null && end.inclusive ? ']' : ')';
        var lowerBound = start != null ? this.subType.transformValueIntoPgValue(start.value) : (_a = ["null"], _a.raw = ["null"], utils_1.sql.query(_a));
        var upperBound = end != null ? this.subType.transformValueIntoPgValue(end.value) : (_b = ["null"], _b.raw = ["null"], utils_1.sql.query(_b));
        return (_c = ["", "(", ", ", ", ", ")"], _c.raw = ["", "(", ", ", ", ", ")"], utils_1.sql.query(_c, utils_1.sql.identifier(this.pgRangeType.namespaceName, this.pgRangeType.name), lowerBound, upperBound, utils_1.sql.value(lowerInclusive + upperInclusive)));
        var _a, _b, _c;
    };
    return PgRangeType;
}(PgType_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgRangeType;
/**
 * The following range parser was inspired by [`pg-range`][1],
 * [`pg-range-parser`][2], and the [Postgres docs][3] on the range format.
 *
 * [1]: https://github.com/WhoopInc/node-pg-range/blob/65169aa5b920604571ad0bc9d9ec614490241493/lib/parser.js#L22-L48
 * [2]: https://github.com/goodybag/pg-range-parser/blob/3810f0e1cae95f0e49d9ac914bdfcab07d06551a/index.js
 * [3]: https://www.postgresql.org/docs/9.6/static/rangetypes.html
 */
/**
 * Matches a Postgres range. Taken directly from [`pg-range`][1]. It’s a very
 * well crafted regular expression.
 *
 * [1]: https://github.com/WhoopInc/node-pg-range/blob/65169aa5b920604571ad0bc9d9ec614490241493/lib/parser.js#L4
 *
 * @private
 */
var rangeMatcherRex = /(\[|\()("((?:\\"|[^"])*)"|[^"]*),("((?:\\"|[^"])*)"|[^"]*)(\]|\))/;
/**
 * Parses a range segment into a string or null.
 *
 * @private
 */
function parseRangeSegment(whole, quoted) {
    if (quoted)
        return quoted.replace(/\\(.)/g, '$1');
    if (whole === '')
        return null;
    return whole;
}
/**
 * Parses a range literal into an object. Heavily inspired by `pg-range`.
 *
 * @private
 */
function parseRange(rangeLiteral) {
    var matches = rangeLiteral.match(rangeMatcherRex);
    // If there were no matches, empty range.
    if (!matches)
        throw new Error('Failed to parse range.');
    // Parse our range segments.
    var lower = parseRangeSegment(matches[2], matches[3]);
    var upper = parseRangeSegment(matches[4], matches[5]);
    // Construct our range.
    return {
        start: lower == null ? null : {
            value: lower,
            inclusive: matches[1] === '[',
        },
        end: upper == null ? null : {
            value: upper,
            inclusive: matches[6] === ']',
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdSYW5nZVR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvUGdSYW5nZVR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnREFBK0c7QUFDL0cscUNBQWlDO0FBRWpDLHlEQUFtRDtBQUNuRCxtQ0FBNkI7QUFPN0I7Ozs7OztHQU1HO0FBQ0gsMEJBQTBCO0FBQzFCLDhFQUE4RTtBQUM5RSx1QkFBdUI7QUFDdkIsSUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUM7SUFDNUIsQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDO0lBQ3pCLENBQUMsTUFBTSxFQUFFLG1CQUFtQixDQUFDO0lBQzdCLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQztJQUN2QixDQUFDLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQztJQUMzQixDQUFDLE1BQU0sRUFBRSwwQkFBMEIsQ0FBQztJQUNwQyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUM7Q0FDdkIsQ0FBQyxDQUFBO0FBRUY7Ozs7R0FJRztBQUNILGFBQWE7QUFDYjtJQUEwQix1Q0FBc0I7SUFROUMscUJBQ0UsU0FBb0IsRUFDcEIsV0FBK0I7UUFGakMsWUFJRSxpQkFBTyxTQXNDUjtRQWpEZSxVQUFJLEdBQWEsUUFBUSxDQUFBO1FBYXZDLElBQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUE7UUFDbEUsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDckUsSUFBTSxPQUFPLEdBQUcsMkJBQWlCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBRXZELElBQU0sU0FBUyxHQUFHLElBQUksMkJBQWUsQ0FBQztZQUNwQyxJQUFJLEVBQUssSUFBSSxXQUFRO1lBQ3JCLFdBQVcs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