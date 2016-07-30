import {
  Kind,
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLInterfaceType,
} from 'graphql'

/* ============================================================================
 * Utilities
 * ========================================================================= */

const toBase64 = value => new Buffer(value.toString()).toString('base64')
const fromBase64 = value => new Buffer(value.toString(), 'base64').toString()

const createStringScalarType = ({ name, description }) =>
  new GraphQLScalarType({
    name,
    description,
    serialize: String,
    parseValue: String,
    parseLiteral: ast => (ast.kind === Kind.STRING ? ast.value : null),
  })

/* ============================================================================
 * Node Types
 * ========================================================================= */

export const toID = (tableName, values) => toBase64(`${tableName}:${values.join(',')}`)

export const fromID = encodedString => {
  const string = fromBase64(encodedString)
  if (!string) throw new Error(`Invalid ID '${encodedString}'.`)
  const [tableName, valueString] = string.split(':', 2)
  if (!valueString) throw new Error(`Invalid ID '${encodedString}'.`)
  const values = valueString.split(',')
  return { tableName, values }
}

export const NodeType =
  new GraphQLInterfaceType({
    name: 'Node',
    description: 'A single node object in the graph with a globally unique identifier.',
    fields: {
      id: {
        type: GraphQLID,
        description: 'The `Node`’s globally unique identifier used to refetch the node.',
      },
    },
  })

/* ============================================================================
 * Connection Types
 * ========================================================================= */

export const CursorType =
  new GraphQLScalarType({
    name: 'Cursor',
    description: 'An opaque base64 encoded string describing a location in a list of items.',
    serialize: toBase64,
    parseValue: fromBase64,
    parseLiteral: ast => (ast.kind === Kind.STRING ? fromBase64(ast.value) : null),
  })

export const PageInfoType =
  new GraphQLObjectType({
    name: 'PageInfo',
    description: 'Information about pagination in a connection.',
    fields: {
      hasNextPage: {
        type: new GraphQLNonNull(GraphQLBoolean),
        description: 'Are there items after our result set to be queried?',
        resolve: ({ hasNextPage }) => hasNextPage,
      },
      hasPreviousPage: {
        type: new GraphQLNonNull(GraphQLBoolean),
        description: 'Are there items before our result set to be queried?',
        resolve: ({ hasPreviousPage }) => hasPreviousPage,
      },
      startCursor: {
        type: CursorType,
        description: 'The cursor for the first item in the list.',
        resolve: ({ startCursor }) => startCursor,
      },
      endCursor: {
        type: CursorType,
        description: 'The cursor for the last item in the list.',
        resolve: ({ endCursor }) => endCursor,
      },
    },
  })

/* ============================================================================
 * PostgreSQL Types
 * ========================================================================= */

export const BigIntType = createStringScalarType({
  name: 'BigInt',
  description: 'A signed eight-byte integer represented as a string',
})

export const DateType = createStringScalarType({
  name: 'Date',
  description: 'Some time value',
})

export const PointType = createStringScalarType({
  name: 'Point',
  description: 'A geometric point on a plane',
})

export const CircleType = createStringScalarType({
  name: 'Circle',
  description: 'Some circle on a plane made of a point and a radius',
})

export const IntervalType = createStringScalarType({
  name: 'Interval',
  description: 'Some time span',
})

export const JSONType = createStringScalarType({
  name: 'JSON',
  description: 'An object not queryable by GraphQL',
})

export const UUIDType = createStringScalarType({
  name: 'UUID',
  description: 'A universally unique identifier',
})
