import { camelCase } from 'change-case'
import { createTableSingleField } from './single'
import { createTableListField } from './list'

/**
 * Creates an object of fields to be used in a `GraphQLObjectType`’s `fields`
 * property. Represents all of the fields we want to expose for each table.
 *
 * @param {Table} table
 * @returns {Object}
 */
export const createTableFields = table => ({
  [camelCase(table.name)]: createTableSingleField(table),
  [camelCase(`${table.name}_list`)]: createTableListField(table),
})
