import { GraphQLError } from 'graphql';
import { PostGraphile } from '../interfaces';
import GraphQLErrorExtended = PostGraphile.GraphQLErrorExtended;
import GraphQLFormattedErrorExtended = PostGraphile.GraphQLFormattedErrorExtended;
import mixed = PostGraphile.mixed;

/**
 * Extracts the requested fields from a pg error object, handling 'code' -> 'errcode' mapping.
 */
function pickPgError(err: mixed, inFields: string | Array<string>): { [s: string]: string | void } {
  const result: mixed = {};
  let fields;
  if (Array.isArray(inFields)) {
    fields = inFields;
  } else if (typeof inFields === 'string') {
    fields = inFields.split(',');
  } else {
    throw new Error('Invalid argument to extendedErrors - expected array of strings');
  }

  if (err && typeof err === 'object') {
    fields.forEach((field: string) => {
      // pg places 'errcode' on the 'code' property
      if (typeof field !== 'string') {
        throw new Error('Invalid argument to extendedErrors - expected array of strings');
      }
      const errField = field === 'errcode' ? 'code' : field;
      result[field] = err[errField] != null ? String(err[errField]) : err[errField];
    });
  }
  return result;
}

/**
 * Given a GraphQLError, format it according to the rules described by the
 * Response Format, Errors section of the GraphQL Specification, plus it can
 * extract additional error codes from the postgres error, such as 'hint',
 * 'detail', 'errcode', 'where', etc. - see `extendedErrors` option.
 */
export function extendedFormatError(
  error: GraphQLError,
  fields: Array<string>,
): GraphQLFormattedErrorExtended {
  if (!error) {
    throw new Error('Received null or undefined error.');
  }
  const originalError = error.originalError as GraphQLErrorExtended;
  return {
    ...(originalError && fields ? pickPgError(originalError, fields) : undefined),
    message: error.message,
    locations: error.locations,
    path: error.path,
  };
}
