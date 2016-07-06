import { GraphQLSchema } from 'graphql'
import createQueryType from './query/createQueryType.js'
import createMutationType from './mutation/createMutationType.js'

/**
 * Creates a GraphQLSchema from a PostgreSQL schema.
 *
 * @param {Schema} schema
 * @returns {GrpahQLSchema}
 */
const createGraphqlSchema = (schema, options) =>
  new GraphQLSchema({
    query: createQueryType(schema, options),
    mutation: createMutationType(schema, options),
  })

export default createGraphqlSchema
