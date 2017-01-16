import { ObjectType, NullableType, booleanType, BasicObjectType, getNonNullableType } from '../../../interface'
import { sql } from '../../utils'
import { PgCatalog, PgCatalogRangeType } from '../../introspection'
import getTypeFromPgType from './getTypeFromPgType'
import PgType from './PgType'

interface PgRange<T> {
  start?: { value: T, inclusive: boolean } | null
  end?: { value: T, inclusive: boolean } | null
}

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
class PgRangeType extends PgType<PgRange<mixed>> implements ObjectType<PgRange<mixed>> {
  public readonly kind: 'OBJECT' = 'OBJECT'
  public readonly name: string
  public readonly description: string | undefined
  public readonly pgRangeType: PgCatalogRangeType
  public readonly subType: PgType<mixed>
  public readonly fields: Map<string, ObjectType.Field<PgRange<mixed>, mixed>>

  constructor (
    pgCatalog: PgCatalog,
    pgRangeType: PgCatalogRangeType,
  ) {
    super()

    const name = typeOidToName.get(pgRangeType.id) || pgRangeType.name
    const pgSubType = pgCatalog.assertGetType(pgRangeType.rangeSubTypeId)
    const subType = getTypeFromPgType(pgCatalog, pgSubType)

    const boundType = new BasicObjectType({
      name: `${name}-bound`,
      description: 'The value at one end of a range. A range can either include this value, or not.',
      fields: new Map([
        ['value', {
          description: 'The value at one end of our range.',
          type: getNonNullableType(subType),
        }],
        ['inclusive', {
          description: 'Whether or not the value of this bound is included in the range.',
          type: booleanType,
        }],
      ]),
    })

    this.fields = new Map<string, ObjectType.Field<PgRange<mixed>, mixed>>([
      ['start', {
        description: 'The starting bound of our range.',
        type: new NullableType(boundType),
        getValue: (range: PgRange<mixed>) => range.start,
      }],
      ['end', {
        description: 'The ending bound of our range.',
        type: new NullableType(boundType),
        getValue: (range: PgRange<mixed>) => range.end,
      }],
    ])

    this.name = name
    this.description = pgRangeType.description
    this.pgRangeType = pgRangeType
    this.subType = subType
  }

  public isTypeOf (_value: mixed): _value is PgRange<mixed> {
    throw new Error('Unimplemented.')
  }

  public fromFields (fields: Map<string, mixed>): PgRange<mixed> {
    const start = fields.get('start') as { value: mixed, inclusive: boolean } | undefined
    const end = fields.get('end') as { value: mixed, inclusive: boolean } | undefined
    return {
      start,
      end,
    }
  }

  /**
   * Transform a Postgres value into a range value by parsing the range literal
   * and then setting up an object of the correct type.
   */
  public transformPgValueIntoValue (rangeLiteral: string): PgRange<mixed> {
    const range = parseRange(rangeLiteral)
    const rangeValue: PgRange<mixed> = {}

    if (range.start) {
      rangeValue.start = {
        value: this.subType.transformPgValueIntoValue(range.start.value),
        inclusive: range.start.inclusive,
      }
    }

    if (range.end) {
      rangeValue.end = {
        value: this.subType.transformPgValueIntoValue(range.end.value),
        inclusive: range.end.inclusive,
      }
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
  public transformValueIntoPgValue (rangeValue: PgRange<mixed>): sql.Sql {
    const start = rangeValue.start
    const end = rangeValue.end
    const lowerInclusive = start != null && start.inclusive ? '[' : '('
    const upperInclusive = end != null && end.inclusive ? ']' : ')'
    const lowerBound = start != null ? this.subType.transformValueIntoPgValue(start.value) : sql.query`null`
    const upperBound = end != null ? this.subType.transformValueIntoPgValue(end.value) : sql.query`null`
    return sql.query`${sql.identifier(this.pgRangeType.namespaceName, this.pgRangeType.name)}(${lowerBound}, ${upperBound}, ${sql.value(lowerInclusive + upperInclusive)})`
  }
}

export default PgRangeType

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
