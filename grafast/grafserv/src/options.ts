import { isAsyncIterable, isSafeError } from "grafast";
import type { AsyncExecutionResult, ExecutionResult } from "graphql";
import * as graphql from "graphql";
import { createHash } from "node:crypto";

const { GraphQLError } = graphql;
// Only the non-ambiguous characters
const RANDOM_STRING_LETTERS = "ABCDEFGHJKLMNPQRTUVWXYZ2346789";
const RANDOM_STRING_LETTERS_LENGTH = RANDOM_STRING_LETTERS.length;

const sha1 = (text: string) =>
  createHash("sha1").update(text).digest("base64url");

const randomString = (length = 10) => {
  let str = "";
  for (let i = 0; i < length; i++) {
    str +=
      RANDOM_STRING_LETTERS[
        Math.floor(Math.random() * RANDOM_STRING_LETTERS_LENGTH)
      ];
  }
  return str;
};

export function defaultMaskError(
  error: graphql.GraphQLError,
): graphql.GraphQLError {
  if (error.originalError instanceof GraphQLError) {
    return error;
  } else if (error.originalError != null && isSafeError(error.originalError)) {
    return new GraphQLError(
      error.originalError.message,
      error.nodes,
      error.source,
      error.positions,
      error.path,
      error.originalError,
      error.originalError.extensions ?? null,
    );
  } else {
    // Hash so similar errors can easily be grouped
    const hash = sha1(String(error));
    const errorId = randomString();
    console.error(
      `Masked GraphQL error (hash: '${hash}', id: '${errorId}')`,
      error,
    );
    return new GraphQLError(
      `An error occurred (logged with hash: '${hash}', id: '${errorId}')`,
      error.nodes,
      error.source,
      error.positions,
      error.path,
      error.originalError,
      // Deliberately wipe the extensions
      {
        errorId,
      },
    );
  }
}

export function makeMaskError(
  callback: (error: graphql.GraphQLError) => graphql.GraphQLError,
): (error: graphql.GraphQLError) => graphql.GraphQLError {
  let warnedAboutMaskErrorCallback = false;
  return (error) => {
    const path = error.path;
    const replacement = callback(error);
    if (!warnedAboutMaskErrorCallback && replacement.path !== path) {
      warnedAboutMaskErrorCallback = true;
      console.warn(
        `[WARNING] Your maskError callback is changing the error path; please reuse the path of the original error to ensure compliance with the GraphQL specification. We will not issue this warning again until the server is restarted or another maskError function is provided.`,
      );
    }
    return replacement;
  };
}

export function optionsFromConfig(config: GraphileConfig.ResolvedPreset) {
  const {
    graphqlPath = "/graphql",
    graphqlOverGET = false,
    graphiql = true,
    graphiqlOnGraphQLGET = true,
    graphiqlPath = "/",
    watch = false,
    eventStreamPath = "/graphql/stream",
    maxRequestLength = 100_000,
    outputDataAsString = false,
    schemaWaitTime = 15000,
    maskError: rawMaskError,
  } = config.grafserv ?? {};
  const { explain } = config.grafast ?? {};
  const maskError = rawMaskError
    ? makeMaskError(rawMaskError)
    : defaultMaskError;
  const maskPayload = (payload: any) => {
    if (payload.errors !== undefined) {
      payload.errors = payload.errors.map(maskError);
    }
    return payload;
  };
  const maskIterator = (
    result: AsyncGenerator<AsyncExecutionResult>,
  ): AsyncGenerator<AsyncExecutionResult> => {
    return {
      [Symbol.asyncIterator]() {
        return this;
      },
      return(value) {
        return result.return(value);
      },
      throw(e) {
        return result.throw(e);
      },
      async next(...args: any) {
        const ir = await result.next(...args);
        if (ir.value != null) {
          return {
            done: ir.done,
            value: maskPayload(ir.value),
          };
        } else {
          return ir;
        }
      },
    };
  };
  const maskExecutionResult = (
    result: ExecutionResult | AsyncGenerator<AsyncExecutionResult>,
  ) => {
    if (isAsyncIterable(result)) {
      return maskIterator(result);
    } else {
      return maskPayload(result);
    }
  };
  return {
    outputDataAsString,
    graphqlPath,
    graphqlOverGET,
    graphiql,
    graphiqlOnGraphQLGET,
    graphiqlPath,
    watch,
    eventStreamPath,
    maxRequestLength,
    explain,
    schemaWaitTime,
    maskError,
    maskPayload,
    maskIterator,
    maskExecutionResult,
  };
}
export type OptionsFromConfig = ReturnType<typeof optionsFromConfig>;
