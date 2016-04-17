import { ary, assign, camelCase } from 'lodash'
import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import createTableSingleField from './createTableSingleField.js'
import createTableListField from './createTableListField.js'
import createTableInsertField from './createTableInsertField.js'

/**
 * Creates a GraphQLSchema from a PostgreSQL schema.
 *
 * @param {Schema} schema
 * @returns {GrpahQLSchema}
 */
const createGraphqlSchema = schema =>
  new GraphQLSchema({
    query: createQueryType(schema),
    mutation: createMutationType(schema),
  })

export default createGraphqlSchema

const createQueryType = schema =>
  new GraphQLObjectType({
    name: 'RootQuery',
    description: schema.description || 'The entry type for GraphQL queries.',
    fields:
      schema.tables
      .map(table => createTableQueryFields(table))
      .reduce(ary(assign, 2), {}),
  })

const createMutationType = schema =>
  new GraphQLObjectType({
    name: 'RootMutation',
    description: 'The entry type for GraphQL mutations.',
    fields:
      schema.tables
      .map(table => createTableMutationFields(table))
      .reduce(ary(assign, 2), {}),
  })

const createTableQueryFields = table => ({
  [camelCase(table.name)]: createTableSingleField(table),
  [camelCase(`${table.name}_list`)]: createTableListField(table),
})

const createTableMutationFields = table => ({
  [camelCase(`insert_${table.name}`)]: createTableInsertField(table),
})
