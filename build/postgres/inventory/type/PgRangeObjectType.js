"use strict";
const interface_1 = require('../../../interface');
const utils_1 = require('../../utils');
const transformPgValueIntoValue_1 = require('../transformPgValueIntoValue');
const transformValueIntoPgValue_1 = require('../transformValueIntoPgValue');
const getTypeFromPgType_1 = require('./getTypeFromPgType');
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
const typeOidToName = new Map([
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
class PgRangeObjectType extends interface_1.ObjectType {
    constructor(pgCatalog, pgRangeType) {
        const name = typeOidToName.get(pgRangeType.id) || pgRangeType.name;
        const pgSubType = pgCatalog.assertGetType(pgRangeType.rangeSubTypeId);
        const subType = getTypeFromPgType_1.default(pgCatalog, pgSubType);
        const boundType = new interface_1.ObjectType({
            name: `${name}-bound`,
            description: 'The value at one end of a range. A range can either include this value, or not.',
            fields: new Map([
                ['value', {
                        description: 'The value at one end of our range.',
                        type: subType instanceof interface_1.NullableType ? subType.nonNullType : subType,
                    }],
                ['inclusive', {
                        description: 'Whether or not the value of this bound is included in the range.',
                        type: interface_1.booleanType,
                    }],
            ]),
        });
        super({
            name,
            description: pgRangeType.description,
            fields: new Map([
                ['start', {
                        description: 'The starting bound of our range.',
                        type: new interface_1.NullableType(boundType),
                    }],
                ['end', {
                        description: 'The ending bound of our range.',
                        type: new interface_1.NullableType(boundType),
                    }],
            ]),
        });
        this.pgRangeType = pgRangeType;
        this.subType = subType;
    }
    /**
     * Transform a Postgres value into a range value by parsing the range literal
     * and then setting up an object of the correct type.
     */
    [transformPgValueIntoValue_1.$$transformPgValueIntoValue](rangeLiteral) {
        const range = parseRange(rangeLiteral);
        const rangeValue = new Map();
        if (range.start) {
            rangeValue.set('start', new Map([
                ['value', transformPgValueIntoValue_1.default(this.subType, range.start.value)],
                ['inclusive', range.start.inclusive],
            ]));
        }
        if (range.end) {
            rangeValue.set('end', new Map([
                ['value', transformPgValueIntoValue_1.default(this.subType, range.end.value)],
                ['inclusive', range.end.inclusive],
            ]));
        }
        return rangeValue;
    }
    /**
     * Transform this internal value into a Postgres Sql value. Does this by
     * calling the canonical function that goes with the range type. For example
     * `public.numrange(lowerBound, upperBound, bounds)`.
     */
    // TODO: test
    // TODO: no anys?
    [transformValueIntoPgValue_1.$$transformValueIntoPgValue](rangeValue) {
        // tslint:disable-next-line no-any
        const start = rangeValue.get('start');
        // tslint:disable-next-line no-any
        const end = rangeValue.get('end');
        const lowerInclusive = start != null && start.get('inclusive') ? '[' : '(';
        const upperInclusive = end != null && end.get('inclusive') ? ']' : ')';
        const lowerBound = start != null ? transformValueIntoPgValue_1.default(this.subType, start.get('value')) : utils_1.sql.query `null`;
        const upperBound = end != null ? transformValueIntoPgValue_1.default(this.subType, end.get('value')) : utils_1.sql.query `null`;
        return utils_1.sql.query `${utils_1.sql.identifier(this.pgRangeType.namespaceName, this.pgRangeType.name)}(${lowerBound}, ${upperBound}, ${utils_1.sql.value(lowerInclusive + upperInclusive)})`;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgRangeObjectType;
/**
 * Matches a Postgres range. Taken directly from [`pg-range`][1]. It’s a very
 * well crafted regular expression.
 *
 * [1]: https://github.com/WhoopInc/node-pg-range/blob/65169aa5b920604571ad0bc9d9ec614490241493/lib/parser.js#L4
 *
 * @private
 */
const rangeMatcherRex = /(\[|\()("((?:\\"|[^"])*)"|[^"]*),("((?:\\"|[^"])*)"|[^"]*)(\]|\))/;
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
    const matches = rangeLiteral.match(rangeMatcherRex);
    // If there were no matches, empty range.
    if (!matches)
        throw new Error('Failed to parse range.');
    // Parse our range segments.
    const lower = parseRangeSegment(matches[2], matches[3]);
    const upper = parseRangeSegment(matches[4], matches[5]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdSYW5nZU9iamVjdFR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvUGdSYW5nZU9iamVjdFR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRCQUE0RCxvQkFDNUQsQ0FBQyxDQUQrRTtBQUNoRix3QkFBb0IsYUFDcEIsQ0FBQyxDQURnQztBQUVqQyw0Q0FBdUUsOEJBQ3ZFLENBQUMsQ0FEb0c7QUFDckcsNENBQXVFLDhCQUN2RSxDQUFDLENBRG9HO0FBQ3JHLG9DQUE4QixxQkFZOUIsQ0FBQyxDQVprRDtBQUVuRDs7Ozs7O0dBTUc7QUFDSCwwQkFBMEI7QUFDMUIsOEVBQThFO0FBQzlFLHVCQUF1QjtBQUN2QixNQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsQ0FBQztJQUM1QixDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUM7SUFDekIsQ0FBQyxNQUFNLEVBQUUsbUJBQW1CLENBQUM7SUFDN0IsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDO0lBQ3ZCLENBQUMsTUFBTSxFQUFFLGlCQUFpQixDQUFDO0lBQzNCLENBQUMsTUFBTSxFQUFFLDBCQUEwQixDQUFDO0lBQ3BDLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQztDQUN2QixDQUFDLENBQUE7QUFFRjs7OztHQUlHO0FBQ0gsYUFBYTtBQUNiLGdDQUFnQyxzQkFBVTtJQUl4QyxZQUNFLFNBQW9CLEVBQ3BCLFdBQStCO1FBRS9CLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUE7UUFDbEUsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDckUsTUFBTSxPQUFPLEdBQUcsMkJBQWlCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBRXZELE1BQU0s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