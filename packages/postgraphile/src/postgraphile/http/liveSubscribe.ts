/**
 * This file contains code that is derived from code copyright (c) Facebook,
 * Inc. and its affiliates; released under the MIT license.
 *
 * The original code can be seen at the following URL, which includes a
 * reference to the original license:
 *
 *   https://github.com/graphql/graphql-js/blob/f56905bd6b030d5912092a1239ed21f73fbdd408/src/subscription/subscribe.js
 */

/* tslint:disable no-any */
import {
  DocumentNode,
  GraphQLSchema,
  GraphQLFieldResolver,
  createSourceEventStream,
  execute,
  GraphQLError,
  ExecutionResult,
} from "graphql";
import mapAsyncIterator from "./mapAsyncIterator";
import { isAsyncIterable } from "iterall";

type mixed = any;

export default function liveSubscribe(
  argsOrSchema: any | GraphQLSchema,
  document: DocumentNode,
  rootValue?: any,
  contextValue?: GraphileEngine.GraphileResolverContext,
  variableValues?: { [key: string]: any },
  operationName?: string,
  fieldResolver?: GraphQLFieldResolver<any, any>,
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>,
) {
  /* eslint-enable no-redeclare */
  // Extract arguments from object args if provided.
  return arguments.length === 1
    ? liveSubscribeImpl(
        argsOrSchema.schema,
        argsOrSchema.document,
        argsOrSchema.rootValue,
        argsOrSchema.contextValue,
        argsOrSchema.variableValues,
        argsOrSchema.operationName,
        argsOrSchema.fieldResolver,
        argsOrSchema.subscribeFieldResolver,
      )
    : liveSubscribeImpl(
        argsOrSchema,
        document,
        rootValue,
        contextValue,
        variableValues,
        operationName,
        fieldResolver,
        subscribeFieldResolver,
      );
}

function liveSubscribeImpl(
  schema: GraphQLSchema,
  document: DocumentNode,
  rootValue?: any,
  contextValue?: GraphileEngine.GraphileResolverContext,
  variableValues?: { [key: string]: any },
  operationName?: string,
  fieldResolver?: GraphQLFieldResolver<any, any>,
  subscribeFieldResolver?: GraphQLFieldResolver<any, any>,
) {
  const sourcePromise = createSourceEventStream(
    schema,
    document,
    rootValue,
    contextValue,
    variableValues,
    operationName,
    subscribeFieldResolver,
  );

  // For each payload yielded from a subscription, map it over the normal
  // GraphQL `execute` function, with `payload` as the rootValue.
  // This implements the "MapSourceToResponseEvent" algorithm described in
  // the GraphQL specification. The `execute` function provides the
  // "ExecuteSubscriptionEvent" algorithm, as it is nearly identical to the
  // "ExecuteQuery" algorithm, for which `execute` is also used.
  const mapSourceToResponse = async (payload: any) => {
    /*
     * GRAPHILE FORK
     *
     * We need to tell Graphile Engine when the execution has completed
     * (because we cannot detect this from inside the GraphQL execution) so
     * that it can clean up old listeners; we do this with the `finally` block.
     */
    try {
      return await execute(
        schema,
        document,
        payload,
        contextValue,
        variableValues,
        operationName,
        fieldResolver,
      );
    } finally {
      if (payload && typeof payload.release === "function") {
        payload.release();
      }
    }
  };

  // Resolve the Source Stream, then map every source value to a
  // ExecutionResult value as described above.
  return sourcePromise.then(
    (resultOrStream) =>
      // Note: Flow can't refine isAsyncIterable, so explicit casts are used.
      isAsyncIterable(resultOrStream)
        ? mapAsyncIterator(
            (resultOrStream as any) as AsyncIterable<mixed>,
            mapSourceToResponse,
            reportGraphQLError,
          )
        : ((resultOrStream as any) as ExecutionResult),
    reportGraphQLError,
  );
}

/**
 * This function checks if the error is a GraphQLError. If it is, report it as
 * an ExecutionResult, containing only errors and no data. Otherwise treat the
 * error as a system-class error and re-throw it.
 */
function reportGraphQLError(error: any) {
  if (error instanceof GraphQLError) {
    return { errors: [error] };
  }
  throw error;
}
