import { isAsyncIterable } from "@graphiql/toolkit";
import type { GraphiQLProps } from "graphiql";
import type { ExecutionResult, GraphQLSchema } from "graphql";
import {
  buildClientSchema,
  getIntrospectionQuery,
  GraphQLError,
} from "graphql";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { RuruProps } from "../interfaces.js";
// import { updateGraphiQLDocExplorerNavStack } from "../updateGraphiQLDocExplorerNavStack.js";
import { useGraphQLChangeStream } from "./useGraphQLChangeStream.js";

function tryParseJson(text: string | undefined): Record<string, unknown> | null {
  if (text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return null
    }
  } else {
    return null
  }
}

export const useSchema = (
  props: RuruProps,
  fetcher: GraphiQLProps["fetcher"],
  setError: Dispatch<SetStateAction<Error | null>>,
  streamEndpoint: string | null,
  headers: string | undefined
) => {
  const [schema, setSchema] = useState<GraphQLSchema | null>(null);
  const refetchStatusRef = useRef({
    inProgress: false,
    fetchAgain: null as null | typeof refetch,
  });
  const refetch = useCallback(() => {
    if (refetchStatusRef.current.inProgress) {
      refetchStatusRef.current.fetchAgain = refetch;
      return;
    }
    refetchStatusRef.current.inProgress = true;
    refetchStatusRef.current.fetchAgain = null;
    (async () => {
      // Fetch the schema using our introspection query and report once that has
      // finished.
      const result = await fetcher({
        query: getIntrospectionQuery(),
        operationName: null,
      }, { headers: tryParseJson(headers) || {} });
      let payload;
      if (isAsyncIterable(result)) {
        // Handle async iterator; we're only expecting a single payload.
        for await (const entry of result) {
          payload = entry;
        }
      } else {
        payload = result;
      }
      const { data, errors } = payload as ExecutionResult;
      if (errors) {
        if (errors[0]) {
          throw new GraphQLError(
            errors[0].message ?? "Error has no message?!",
            null,
            null,
            null,
            errors[0].path,
            null,
            errors[0].extensions,
          );
        } else {
          throw new Error(
            "'errors' was set on the payload, but was empty or contained null? This is forbidden by the GraphQL spec.",
          );
        }
      }

      // Use the data we got back from GraphQL to build a client schema (a
      // schema without resolvers).
      const schema = buildClientSchema(data as any);
      setSchema(schema);
      setError(null);

      console.log("Ruru: Schema updated");
    })()
      .catch((error) => {
        console.error("Error occurred when updating the schema:");
        console.error(error);
        setError(
          new Error(
            `Introspecting the GraphQL schema failed; please check the endpoint and try again.\n${String(
              error,
            )}`,
          ),
        );
      })
      .finally(() => {
        refetchStatusRef.current.inProgress = false;
        if (refetchStatusRef.current.fetchAgain) {
          refetchStatusRef.current.fetchAgain();
        }
      });
  }, [fetcher, setError, headers]);
  useGraphQLChangeStream(props, refetch, streamEndpoint);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { schema };
};
