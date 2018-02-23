import { postgraphile, createPostGraphileSchema, watchPostGraphileSchema, withPostGraphileContext } from './postgraphile'

export default postgraphile

export {
  postgraphile,
  createPostGraphileSchema,
  watchPostGraphileSchema,
  withPostGraphileContext,

  // Backwards compatability
  postgraphile as postgraphql,
  createPostGraphileSchema as createPostGraphQLSchema,
  watchPostGraphileSchema as watchPostGraphQLSchema,
  withPostGraphileContext as withPostGraphQLContext,
}
