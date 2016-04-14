import { memoize, fromPairs } from 'lodash'
import { GraphQLObjectType } from 'graphql'
import { camelCase, pascalCase } from 'change-case'
import { createColumnField } from '../column'

/**
 * Creates the `GraphQLObjectType` for a table.
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

  return new GraphQLObjectType({
    // Creates a new type where the name is a PascalCase version of the table
    // name and the description is the associated comment in PostgreSQL.
    name: pascalCase(table.name),
    description: table.description,

    // Make sure all of our columns have a corresponding field.
    fields: fromPairs(
      table.columns
      .map(column => [camelCase(column.name), createColumnField(column)])
    ),
  })
})

export default createTableType
