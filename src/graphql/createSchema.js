import { ary, assign, camelCase } from 'lodash'
import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import createTableSingleField from './single/createTableSingleField.js'
import createTableListField from './list/createTableListField.js'

/**
 * Creates a GraphQLSchema from a PostgreSQL schema.
 *
 * @param {Schema} schema
 * @returns {GrpahQLSchema}
 */
const createGraphqlSchema = schema =>
  new GraphQLSchema({
    query: createQuery(schema),
  })

export default createGraphqlSchema

const createQuery = schema =>
  new GraphQLObjectType({
    name: 'Root',
    description: schema.description || 'The entry type for the GraphQL server.',
    fields:
      schema.tables
      .map(table => createTableFields(table))
      .reduce(ary(assign, 2), {}),
  })

const createTableFields = table => ({
  [camelCase(table.name)]: createTableSingleField(table),
  [camelCase(`${table.name}_list`)]: createTableListField(table),
})
