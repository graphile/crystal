import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
} from 'graphql'

import { types } from 'pg'
import { memoize, fromPairs, upperFirst, camelCase, snakeCase, toUpper } from 'lodash'
import createTableType from './createTableType.js'

import {
  DateType,
  BigIntType,
  PointType,
  CircleType,
  IntervalType,
  JSONType,
  UUIDType,
} from './types.js'

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

// Override custom type parsers.
// TODO: This is a temporary solution.
types.setTypeParser(600, String)
types.setTypeParser(718, String)
types.setTypeParser(1186, String)

/**
 * Gets a GraphQL type for a PostgreSQL type.
 *
 * @param {Column} column
 * @returns {GraphQLType}
 */
const getType = memoize(type => {
  // If the type is an enum, let’s create an enum for it.
  if (type.isEnum) {
    return new GraphQLEnumType({
      name: upperFirst(camelCase(type.name)),
      description: type.description,
      values: fromPairs(
        type.variants
        .map(variant => [toUpper(snakeCase(variant)), { value: variant }])
      ),
    })
  }

  // If the type is a domain, return the underlying type
  if (type.isDomain)
    return getType(type.baseType)

  // If this type is a table type, use the PostGraphQL table type.
  if (type.isTableType)
    return createTableType(type.table)

  // Return internal type or a string.
  return postgresToGraphQLTypes.get(type.id) || GraphQLString
})

export default getType
