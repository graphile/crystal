import { memoize, fromPairs, camelCase } from 'lodash'
import { GraphQLObjectType, GraphQLID } from 'graphql'
import { NodeType, toID } from './types.js'
import getColumnType from './getColumnType.js'
import resolveTableSingle from './resolveTableSingle.js'
import createConnectionType from './createConnectionType.js'
import createConnectionArgs from './createConnectionArgs.js'
import resolveConnection from './resolveConnection.js'

/**
 * Creates the `GraphQLObjectType` for a table.
 *
 * This function is memoized because it will be called often for the same
 * table. Think that both the single and list fields need an instance of the
 * table type. Instead of passing the table type around as a parameter, it is
 * more functional to just memoize this function.
 *
 * @param {Client} client
 * @param {Table} table
 * @returns {GraphQLObjectType}
 */
const createTableType = memoize(table => {
  // If we have no fields, GraphQL will be sad. Make sure we have meaningful
  // fields by erroring if there are no columns.
  if (table.columns.length === 0) {
    throw new Error(
      `PostgreSQL schema '${table.schema.name}' contains table '${table.name}' ` +
      'which does not have any columns. To generate a GraphQL schema all ' +
      'tables must have at least one column.'
    )
  }

  const { primaryKeys } = table
  const isNode = primaryKeys.length !== 0

  return new GraphQLObjectType({
    // Creates a new type where the name is a PascalCase version of the table
    // name and the description is the associated comment in PostgreSQL.
    name: table.getTypeName(),
    description: table.description,

    // If the table has no primary keys, it shouldn’t implement `Node`.
    interfaces: isNode ? [NodeType] : [],

    isTypeOf: value => value.table === table,

    // Make sure all of our columns have a corresponding field. This is a thunk
    // because `createForeignKeyField` may have a circular dependency.
    fields: () => ({
      // If the table is a node, add the `id` field. Otherwise don’t add
      // anything.
      ...(isNode ? {
        id: {
          type: GraphQLID,
          description: `The globally unique identifier for this ${table.getMarkdownTypeName()}.`,
          resolve: source => toID(table.name, primaryKeys.map(column => source[column.name])),
        },
      } : {}),
      ...fromPairs(
        table.columns
        .map(column => [column.getFieldName(), createColumnField(column)])
      ),
      ...fromPairs(
        table.foreignKeys
        .map(foreignKey => {
          const columnNames = foreignKey.nativeColumns.map(({ name }) => name)
          const name = `${foreignKey.foreignTable.name}_by_${columnNames.join('_and_')}`
          return [camelCase(name), createForeignKeyField(foreignKey)]
        })
      ),
      ...fromPairs(
        table.reverseForeignKeys
        .map(foreignKey => {
          const columnNames = foreignKey.nativeColumns.map(({ name }) => name)
          const name = `${foreignKey.nativeTable.name}_nodes_by_${columnNames.join('_and_')}`
          return [camelCase(name), createForeignKeyReverseField(foreignKey)]
        })
      ),
    }),
  })
})

export default createTableType

/**
 * Creates a field to be used with `GraphQLObjectType` from a column.
 *
 * @param {Column} column
 * @returns {GraphQLFieldConfig}
 */
const createColumnField = column => ({
  type: getColumnType(column),
  description: column.description,
  resolve: source => source[column.name],
})

/**
 * Creates a field for use with a table type to select a single object
 * referenced by a foreign key.
 *
 * @param {ForeignKey} foreignKey
 * @returns {GraphQLFieldConfig}
 */
const createForeignKeyField = ({ nativeTable, nativeColumns, foreignTable, foreignColumns }) => ({
  type: createTableType(foreignTable),
  description:
    `Queries a single ${foreignTable.getMarkdownTypeName()} node related to ` +
    `the ${nativeTable.getMarkdownTypeName()} type.`,

  resolve: resolveTableSingle(
    foreignTable,
    foreignColumns,
    source => nativeColumns.map(({ name }) => source[name])
  ),
})

/**
 * Creates a field to be used for selecting a foreign key in the reverse. This
 * will return a connection.
 *
 * @param {ForeignKey} foreignKey
 * @returns {GraphQLFieldConfig}
 */
const createForeignKeyReverseField = ({ nativeTable, nativeColumns, foreignTable, foreignColumns }) => ({
  type: createConnectionType(nativeTable),
  description:
    `Queries and returns a set of ${nativeTable.getMarkdownTypeName()} ` +
    `nodes that are related to the ${foreignTable.getMarkdownTypeName()} source ` +
    'node.',

  args: createConnectionArgs(nativeTable, nativeColumns),

  resolve: resolveConnection(
    nativeTable,
    source => fromPairs(foreignColumns.map(({ name }, i) => [nativeColumns[i].name, source[name]]))
  ),
})
