import { GraphQLError } from 'graphql/error'

/**
 * Given a GraphQLError, format it according to the rules described by the
 * Response Format, Errors section of the GraphQL Specification, plus a few
 * additional fields relevant to postgres errors, including HINT, DETAIL,
 * and ERRCODE.
 */
export function extendedFormatError(error: GraphQLError, fields: Array<String>): GraphQLFormattedErrorExtended {
  if (!error) {
    throw new Error('Received null or undefined error.')
  }
  const originalError = error.originalError as GraphQLErrorExtended
  fields = fields.map(field => field.toLowerCase())
  return {
    message: error.message,
    locations: error.locations,
    path: error.path,
    hint: originalError && fields.indexOf('hint') > -1 ? originalError.hint : undefined,
    detail: originalError && fields.indexOf('detail') > -1 ? originalError.detail : undefined,
    errcode: originalError && fields.indexOf('errcode') > -1 ? originalError.code : undefined,
  }
}

export type GraphQLFormattedErrorExtended = {
  message: string,
  locations: Array<GraphQLErrorLocation> | void,
  path: Array<string | number> | void,
  hint: string | void,
  detail: string | void,
  errcode: string | void,
}

export type GraphQLErrorLocation = {
  line: number,
  column: number,
}

export type GraphQLErrorExtended = GraphQLError & {
  hint: string,
  detail: string,
  code: string,
}
