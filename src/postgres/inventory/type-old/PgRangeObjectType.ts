import { Type, ObjectType, NullableType, booleanType } from '../../../interface'
import { sql } from '../../utils'
import { PgCatalog, PgCatalogRangeType } from '../../introspection'
import transformPgValueIntoValue, { $$transformPgValueIntoValue } from '../transformPgValueIntoValue'
import transformValueIntoPgValue, { $$transformValueIntoPgValue } from '../transformValueIntoPgValue'
import getTypeFromPgType from './getTypeFromPgType'

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
  ['3904', 'integer_range'],            // `int4range`
  ['3926', 'big_integer_range'],        // `int8range`
  ['3906', 'float_range'],              // `numrange`
  ['3908', 'timestamp_range'],          // `tsrange`
  ['3910', 'timezone_timestamp_range'], // `tstzrange`
  ['3912', 'date_range'],               // `daterange`
])

/**
 * This object type represents a Postgres range. It parses the rough set
 * notation format (looks like `(1,5]`) into an object and serializes that
 * object back down into the range format.
 */
// TODO: test
class PgRangeObjectType extends ObjectType {
  public readonly pgRangeType: PgCatalogRangeType
  public readonly subType: Type<mixed>

  constructor (
    pgCatalog: PgCatalog,
    pgRangeType: PgCatalogRangeType,
  ) {
    const name = typeOidToName.get(pgRangeType.id) || pgRangeType.name
    const pgSubType = pgCatalog.assertGetType(pgRangeType.rangeSubTypeId)
    const subType = getTypeFromPgType(pgCatalog, pgSubType)

    const boundType = new ObjectType({
      name: `${name}-bound`,
      description: 'The value at one end of a range. A range can either include this value, or not.',
      fields: new Map<string, ObjectType.Field<mixed>>([
        ['value', {
          description: 'The value at one end of our range.',
          type: subType instanceof NullableType ? subType.nonNullType : subType,
        }],
        ['inclusive', {
          description: 'Whether or not the value of this bound is included in the range.',
          type: booleanType,
        }],
      ]),
    })

    super({
      name,
      description: pgRangeType.description,
      fields: new Map<string, ObjectType.Field<mixed>>([
        ['start', {
          description: 'The starting bound of our range.',
          type: new NullableType(boundType),
        }],
        ['end', {
          description: 'The ending bound of our range.',
          type: new NullableType(boundType),
        }],
      ]),
    })

    this.pgRangeType = pgRangeType
    this.subType = subType
  }

  /**
   * Transform a Postgres value into a range value by parsing the range literal
   * and then setting up an object of the correct type.
   */
  public [$$transformPgValueIntoValue] (rangeLiteral: string): ObjectType.Value {
    const range = parseRange(rangeLiteral)
    const rangeValue = new Map<string, mixed>()

    if (range.start) {
      rangeValue.set('start', new Map<string, mixed>([
        ['value', transformPgValueIntoValue(this.subType, range.start.value)],
        ['inclusive', range.start.inclusive],
      ]))
    }

    if (range.end) {
      rangeValue.set('end', new Map<string, mixed>([
        ['value', transformPgValueIntoValue(this.subType, range.end.value)],
        ['inclusive', range.end.inclusive],
      ]))
    }

    return rangeValue
  }

  /**
   * Transform this internal value into a Postgres Sql value. Does this by
   * calling the canonical function that goes with the range type. For example
   * `public.numrange(lowerBound, upperBound, bounds)`.
   */
  // TODO: test
  // TODO: no anys?
  public [$$transformValueIntoPgValue] (rangeValue: ObjectType.Value): sql.Sql {
    // tslint:disable-next-line no-any
    const start: Map<string, mixed> | undefined = rangeValue.get('start') as any
    // tslint:disable-next-line no-any
    const end: Map<string, mixed> | undefined = rangeValue.get('end') as any
    const lowerInclusive = start != null && start.get('inclusive') ? '[' : '('
    const upperInclusive = end != null && end.get('inclusive') ? ']' : ')'
    const lowerBound = start != null ? transformValueIntoPgValue(this.subType, start.get('value')) : sql.query`null`
    const upperBound = end != null ? transformValueIntoPgValue(this.subType, end.get('value')) : sql.query`null`
    return sql.query`${sql.identifier(this.pgRangeType.namespaceName, this.pgRangeType.name)}(${lowerBound}, ${upperBound}, ${sql.value(lowerInclusive + upperInclusive)})`
  }
}

export default PgRangeObjectType

/**
 * The following range parser was inspired by [`pg-range`][1],
 * [`pg-range-parser`][2], and the [Postgres docs][3] on the range format.
 *
 * [1]: https://github.com/WhoopInc/node-pg-range/blob/65169aa5b920604571ad0bc9d9ec614490241493/lib/parser.js#L22-L48
 * [2]: https://github.com/goodybag/pg-range-parser/blob/3810f0e1cae95f0e49d9ac914bdfcab07d06551a/index.js
 * [3]: https://www.postgresql.org/docs/9.6/static/rangetypes.html
 */

interface PgRange<T> {
  start?: { value: T, inclusive: boolean } | null
  end?: { value: T, inclusive: boolean } | null
}

/**
 * Matches a Postgres range. Taken directly from [`pg-range`][1]. It’s a very
 * well crafted regular expression.
 *
 * [1]: https://github.com/WhoopInc/node-pg-range/blob/65169aa5b920604571ad0bc9d9ec614490241493/lib/parser.js#L4
 *
 * @private
 */
const rangeMatcherRex = /(\[|\()("((?:\\"|[^"])*)"|[^"]*),("((?:\\"|[^"])*)"|[^"]*)(\]|\))/

/**
 * Parses a range segment into a string or null.
 *
 * @private
 */
function parseRangeSegment (whole: string, quoted: string): string | null {
  if (quoted) return quoted.replace(/\\(.)/g, '$1')
  if (whole === '') return null
  return whole
}

/**
 * Parses a range literal into an object. Heavily inspired by `pg-range`.
 *
 * @private
 */
function parseRange (rangeLiteral: string): PgRange<string> {
  const matches = rangeLiteral.match(rangeMatcherRex)

  // If there were no matches, empty range.
  if (!matches)
    throw new Error('Failed to parse range.')

  // Parse our range segments.
  const lower = parseRangeSegment(matches[2], matches[3])
  const upper = parseRangeSegment(matches[4], matches[5])

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
  }
}
