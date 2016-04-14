import {
  fromPairs,
  camelCase,
  snakeCase,
  upperFirst,
  toUpper,
} from 'lodash'

import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLEnumType,
} from 'graphql'

const coerceToNonNullType = type => (type instanceof GraphQLNonNull ? type : new GraphQLNonNull(type))

/**
 * Creates an argument config to be used with `GraphQLFieldConfig` for the
 * given column.
 *
 * @param {Column} column
 * @returns {GraphQLArgumentConfig}
 */
export const createRequiredColumnArg = column => ({
  description: column.description,
  type: coerceToNonNullType(getColumnGraphqlType(column)),
})

const extendScalarType = (parent, { name, description, serialize, parseValue, parseLiteral }) =>
  new GraphQLScalarType({
    name,
    description,
    serialize: serialize || parent.serialize,
    parseValue: parseValue || parent.parseValue,
    parseLiteral: parseLiteral || parent.parseLiteral,
  })

const BigIntType = extendScalarType(GraphQLString, {
  name: 'BigInt',
  description: 'A signed eight-byte integer represented as a string',
})

const DateType = extendScalarType(GraphQLString, {
  name: 'Date',
  description: 'Some time value',
})

const PointType = new GraphQLObjectType({
  name: 'Point',
  description: 'A geometric point on a plane',
  fields: {
    x: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'The x coordinate of the point',
    },
    y: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'The y coordinate of the point',
    },
  },
})

const CircleType = new GraphQLObjectType({
  name: 'Circle',
  description: 'Some circle on a plane made of a point and a radius',
  fields: {
    x: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'The x coordinate of the circle',
    },
    y: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'The y coordinate of the circle',
    },
    radius: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'The radius of the circle',
    },
  },
})

const IntervalType = new GraphQLObjectType({
  name: 'Interval',
  description: 'Some time span',
  fields: {
    milliseconds: { type: GraphQLInt },
    seconds: { type: GraphQLInt },
    minutes: { type: GraphQLInt },
    hours: { type: GraphQLInt },
    days: { type: GraphQLInt },
    months: { type: GraphQLInt },
    years: { type: GraphQLInt },
  },
})

const JSONType = extendScalarType(GraphQLString, {
  name: 'JSON',
  description: 'An object not queryable by GraphQL',
})

const UUIDType = extendScalarType(GraphQLString, {
  name: 'UUID',
  description: 'A universally unique identifier',
})

/**
 * A map of types where the PostgreSQL type is the key and the GraphQL type is
 * the value.
 *
 * In order to see available PostgreSQL types in your database run the
 * following query:
 *
 * ```sql
 * select typname, oid, typarray from pg_type where typtype = 'b' order by oid;
 * ```
 *
 * Also see the [`pg-types`][1] module’s source code to see what types they
 * are parsing.
 *
 * [1]: https://github.com/brianc/node-pg-types
 */
const postgresToGraphQLTypes = new Map([
  [20, BigIntType],
  [21, GraphQLInt],
  [23, GraphQLInt],
  [26, GraphQLInt],
  [700, GraphQLFloat],
  [701, GraphQLFloat],
  [16, GraphQLBoolean],
  [1082, DateType],
  [1114, DateType],
  [1184, DateType],
  [600, PointType],
  [718, CircleType],
  [1000, new GraphQLList(GraphQLBoolean)],
  [1005, new GraphQLList(GraphQLInt)],
  [1007, new GraphQLList(GraphQLInt)],
  [1028, new GraphQLList(GraphQLInt)],
  [1016, new GraphQLList(BigIntType)],
  [1021, new GraphQLList(GraphQLFloat)],
  [1022, new GraphQLList(GraphQLFloat)],
  [1231, new GraphQLList(GraphQLFloat)],
  [1014, new GraphQLList(GraphQLString)],
  [1015, new GraphQLList(GraphQLString)],
  [1008, new GraphQLList(GraphQLString)],
  [1009, new GraphQLList(GraphQLString)],
  [1115, new GraphQLList(DateType)],
  [1182, new GraphQLList(DateType)],
  [1185, new GraphQLList(DateType)],
  [1186, IntervalType],
  [114, JSONType],
  [3802, JSONType],
  [199, new GraphQLList(JSONType)],
  [3807, new GraphQLList(JSONType)],
  [2951, new GraphQLList(GraphQLString)],
  [791, new GraphQLList(GraphQLString)],
  [1183, new GraphQLList(GraphQLString)],
  [1700, GraphQLFloat],
  [2950, UUIDType],
  [18, GraphQLString],
  [25, GraphQLString],
  [1043, GraphQLString],
])

/**
 * Gets a GraphQL type for a PostgreSQL type.
 *
 * @param {Column} column
 * @returns {GraphQLType}
 */
const getColumnGraphqlType = column => {
  const wrapType = type => (column.isNullable ? type : new GraphQLNonNull(type))
  const internalType = postgresToGraphQLTypes.get(column.type)

  // If our map has a `GraphQLType`, use it.
  if (internalType)
    return wrapType(internalType)

  const enum_ = column.getEnum()

  // If the column has an enum type, we need to create a `GraphQLEnumType`.
  if (enum_) {
    return wrapType(new GraphQLEnumType({
      name: upperFirst(camelCase(enum_.name)),
      description: enum_.description,
      values: fromPairs(
        enum_.variants
        .map(variant => [toUpper(snakeCase(variant)), { value: variant }])
      ),
    }))
  }

  // Otherwise, just return `GraphQLString`.
  return wrapType(GraphQLString)
}

export default getColumnGraphqlType
