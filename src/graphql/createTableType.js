import { memoize, fromPairs, camelCase, constant, assign } from 'lodash'
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
import createProcedureCall from './createProcedureCall.js'

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

// TODO maybe move these ForeignKey methods to own file ?

export const createForeignKeyField = ({ nativeTable, nativeColumns, foreignTable, foreignColumns }) => ({
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

export const createForeignKeyReverseField = ({ nativeTable, nativeColumns, foreignTable, foreignColumns }) => ({
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
  const [tableArg, ...argEntries] = Array.from(procedure.args)
  const [tableArgName, tableArgType] = tableArg
  const returnTable = procedure.getReturnTable()

  const procedureArgs = createProcedureArgs(
    procedure,
    (argName, argType) => argName === tableArgName && argType === tableArgType,
  )

  // If this is a connection, return a completely different field…
  if (procedure.returnsSet && returnTable) {
    return {
      type: createConnectionType(returnTable),
      description: procedure.description,

      args: {
        // Add the arguments for the procedure…
        ...procedureArgs,
        // Add the arguments for connections…
        ...createConnectionArgs(returnTable, true),
      },

      // Resolve the connection.
      resolve: resolveConnection(
        returnTable,
        constant({}),
        (source, args) => ({
          // Use the text from the procedure call.
          text: createProcedureCall(procedure),
          // Use values from argument entries and the table source value.
          values: [source, ...argEntries.map(([name]) => args[camelCase(name)])],
        }),
      ),
    }
  }

  return {
    type: createProcedureReturnType(procedure),
    description: procedure.description,

    // Create the arguments and omit the table argument.
    args: procedureArgs,

    // Resolve the procedure, using the source row as the argument we omit.
    resolve: resolveProcedure(
      procedure,
      (source, args) => assign(args, { [camelCase(tableArgName)]: source }),
    ),
  }
}
