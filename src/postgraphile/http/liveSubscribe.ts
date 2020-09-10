/**
 * This file contains code that is derived from code copyright (c) Facebook,
 * Inc. and its affiliates; released under the MIT license.
 *
 * The original code can be seen at the following URL, which includes a
 * reference to the original license:
 *
 *   https://github.com/graphql/graphql-js/blob/f56905bd6b030d5912092a1239ed21f73fbdd408/src/subscription/subscribe.js
 */

import {
  createSourceEventStream,
  execute,
  GraphQLError,
  ExecutionResult,
  ExecutionArgs,
} from 'graphql';
import mapAsyncIterator from './mapAsyncIterator';
import { isAsyncIterable } from 'iterall';

export default function liveSubscribe<T = unknown>({
  schema,
  document,
  rootValue,
  contextValue,
  variableValues,
  operationName,
  fieldResolver,
}: ExecutionArgs): Promise<AsyncIterableIterator<ExecutionResult<T>> | ExecutionResult<T>> {
  const sourcePromise = createSourceEventStream<T>(
    schema,
    document,
    rootValue,
    contextValue,
    variableValues || undefined,
    operationName,
    fieldResolver,
  );

  // For each payload yielded from a subscription, map it over the normal
  // GraphQL `execute` function, with `payload` as the rootValue.
  // This implements the "MapSourceToResponseEvent" algorithm described in
  // the GraphQL specification. The `execute` function provides the
  // "ExecuteSubscriptionEvent" algorithm, as it is nearly identical to the
  // "ExecuteQuery" algorithm, for which `execute` is also used.
  const mapSourceToResponse = async (payload: T & { release?: () => void }) => {
    /*
     * GRAPHILE FORK
     *
     * We need to tell Graphile Engine when the execution has completed
     * (because we cannot detect this from inside the GraphQL execution) so
     * that it can clean up old listeners; we do this with the `finally` block.
     */
    try {
      return await execute<T>(
        schema,
        document,
        payload,
        contextValue,
        variableValues,
        operationName,
        fieldResolver,
      );
    } finally {
      if (payload && typeof payload.release === 'function') {
        payload.release();
      }
    }
  };

  // Resolve the Source Stream, then map every source value to a
  // ExecutionResult value as described above.
  return sourcePromise.then(resultOrStream => {
    if (isAsyncIterable(resultOrStream)) {
      return mapAsyncIterator(
        resultOrStream as AsyncIterable<T>,
        mapSourceToResponse,
        reportGraphQLError,
      );
    } else {
      return resultOrStream;
    }
  });
}

/**
 * This function checks if the error is a GraphQLError. If it is, report it as
 * an ExecutionResult, containing only errors and no data. Otherwise treat the
 * error as a system-class error and re-throw it.
 */
function reportGraphQLError(error: unknown) {
  if (error instanceof GraphQLError) {
    return { errors: [error] };
  }
  throw error;
}
