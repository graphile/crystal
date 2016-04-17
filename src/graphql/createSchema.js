import { GraphQLSchema } from 'graphql'
import createQueryType from './query/createQueryType.js'
import createMutationType from './mutation/createMutationType.js'

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
