import { camelCase, upperFirst } from 'lodash'
import createTableType from './createTableType.js'
import resolveTableSingle from './resolveTableSingle.js'

/**
 * Creates a field for use with a table type to select a single object
 * referenced by a foreign key.
 *
 * @param {Object} foreignKey
 * @returns {GraphQLFieldConfig}
 */
const createForeignKeyField = ({ nativeTable, nativeColumns, foreignTable, foreignColumns }) => ({
  type: createTableType(foreignTable),
  description:
    `Queries a \`${upperFirst(camelCase(foreignTable.name))}\` node related to ` +
    `the \`${upperFirst(camelCase(nativeTable.name))}\` type.`,

  resolve: resolveTableSingle(
    foreignTable,
    foreignColumns,
    source => nativeColumns.map(({ name }) => source[name])
  ),
})

export default createForeignKeyField
