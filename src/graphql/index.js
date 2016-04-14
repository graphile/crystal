import { ary, assign } from 'lodash'
import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import { createTableFields } from './table'

/**
 * Creates a GraphQLSchema from a PostgreSQL schema.
 *
 * @param {Schema} schema
 * @returns {GrpahQLSchema}
 */
export const createGraphqlSchema = schema =>
  new GraphQLSchema({
    query: createQuery(schema),
  })

const createQuery = schema =>
  new GraphQLObjectType({
    name: 'Root',
    description: schema.description || 'The entry type for the GraphQL server.',
    fields:
      schema.tables
      .map(table => createTableFields(table))
      .reduce(ary(assign, 2), {}),
  })
