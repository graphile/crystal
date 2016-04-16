import { camelCase, upperFirst } from 'lodash'
import createTableType from '../createTableType.js'
import resolveForeignKey from './resolveForeignKey.js'

/**
 * Creates a field for use with a table type to select a single object
 * referenced by a foreign key.
 *
 * @param {Object} foreignKey
 * @returns {GraphQLFieldConfig}
 */
const createForeignKeyField = foreignKey => ({
  type: createTableType(foreignKey.foreignTable),
  description:
    `Queries a \`${upperFirst(camelCase(foreignKey.foreignTable.name))}\` node related to ` +
    `the \`${upperFirst(camelCase(foreignKey.nativeTable.name))}\` type.`,

  resolve: resolveForeignKey(foreignKey),
})

export default createForeignKeyField
