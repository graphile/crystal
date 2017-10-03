import { postgraphql, createPostGraphQLSchema, watchPostGraphQLSchema, withPostGraphQLContext } from './postgraphql'

export default postgraphql

export {
  postgraphql,
  createPostGraphQLSchema,
  watchPostGraphQLSchema,
  withPostGraphQLContext,

  postgraphql as postgraphile,
  createPostGraphQLSchema as createPostGraphileSchema,
  watchPostGraphQLSchema as watchPostGraphileSchema,
  withPostGraphQLContext as withPostGraphileContext,
}
