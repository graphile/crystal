import { memoize, fromPairs, camelCase, assign } from 'lodash'
import { GraphQLObjectType, GraphQLID } from 'graphql'
import { $$rowTable } from '../symbols.js'
import { NodeType, toID } from './types.js'
import getColumnType from './getColumnType.js'
import resolveTableSingle from './resolveTableSingle.js'
import createConnectionType from './createConnectionType.js'
import createConnectionArgs from './createConnectionArgs.js'
import resolveConnection from './resolveConnection.js'
import createProcedureReturnType from './createProcedureReturnType.js'
import createProcedureArgs from './createProcedureArgs.js'
import resolveProcedure from './resolveProcedure.js'

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
// TODO: Reverse foreign keys, and computed columns each run a seperate
// query for each table type causing an O(n + 1) scenario. This could be
// improved, but it requires some real SQL dark magicks… ideas welcome!
//
// Foreign keys (not reverse foreign keys) are optimized using dataloader (see
// `resolveTableSingle`).
const createTableType = memoize(table => {
  const columns = table.getColumns()

  // If we have no fields, GraphQL will be sad. Make sure we have meaningful
  // fields by erroring if there are no columns.
  if (columns.length === 0) {
    throw new Error(
      `PostgreSQL schema '${table.schema.name}' contains table '${table.name}' ` +
      'which does not have any columns. To generate a GraphQL schema all ' +
      'tables must have at least one column.'
    )
  }

  const primaryKeys = table.getPrimaryKeys()
  const isNode = primaryKeys.length !== 0

  return new GraphQLObjectType({
    // Creates a new type where the name is a PascalCase version of the table
    // name and the description is the associated comment in PostgreSQL.
    name: table.getTypeName(),
    description: table.description,

    // If the table has no primary keys, it shouldn’t implement `Node`.
    interfaces: isNode ? [NodeType] : [],

    isTypeOf: value => value[$$rowTable] === table,

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
      // Add the column fields.
      ...fromPairs(
        columns.map(column => [column.getFieldName(), createColumnField(column)])
      ),
      // Add the computed column fields.
      ...fromPairs(
        table.getComputedColumns().map(procedure => [
          procedure.getFieldName(table.name),
          createProcedureField(procedure),
        ])
      ),
      // Add foreign key field references.
      ...fromPairs(
        table.getForeignKeys().map(foreignKey => {
          const columnNames = foreignKey.nativeColumns.map(({ name }) => name)
          const name = `${foreignKey.foreignTable.name}_by_${columnNames.join('_and_')}`
          return [camelCase(name), createForeignKeyField(foreignKey)]
        })
      ),
      // Add reverse foreign key field references.
      ...fromPairs(
        table.getReverseForeignKeys().map(foreignKey => {
          const columnNames = foreignKey.nativeColumns.map(({ name }) => name)
          const name = `${foreignKey.nativeTable.name}_nodes_by_${columnNames.join('_and_')}`
          return [camelCase(name), createForeignKeyReverseField(foreignKey)]
        })
      ),
    }),
  })
})

export default createTableType

const createColumnField = column => ({
  type: getColumnType(column),
  description: column.description,
  resolve: source => source[column.name],
})

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

const createProcedureField = procedure => {
  const [tableArgName, tableArgType] = Array.from(procedure.args)[0]
  return {
    type: createProcedureReturnType(procedure),
    description: procedure.description,

    // Create the arguments and omit the table argument.
    args: createProcedureArgs(
      procedure,
      (argName, argType) => argName === tableArgName && argType === tableArgType,
    ),

    // Resolve the procedure, using the source row as the argument we omit.
    resolve: resolveProcedure(
      procedure,
      (source, args) => assign(args, { [camelCase(tableArgName)]: source }),
    ),
  }
}
