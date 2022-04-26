import type { CreateFetcherOptions } from "@graphiql/toolkit";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import type { Fetcher, FetcherReturnType } from "graphiql";
import type { ExecutionResult } from "graphql";
import { useEffect, useMemo, useState } from "react";

import type { GraphileInspectProps } from "../interfaces.js";

export interface IExplainedOperation {
  type: string;
  title: string;
}

export interface ExplainedSQLOperation extends IExplainedOperation {
  type: "sql";
  query: string;
  explain?: string;
}

export interface ExplainedMermaidJsOperation extends IExplainedOperation {
  type: "mermaid-js";
  diagram: string;
}

export type ExplainedOperation =
  | ExplainedSQLOperation
  | ExplainedMermaidJsOperation;

export interface ExplainResults {
  operations: Array<ExplainedOperation>;
}

const isExplainOperationLike = (op: any): op is IExplainedOperation => {
  return (
    typeof op === "object" &&
    op &&
    typeof op.type === "string" &&
    typeof op.title === "string"
  );
};

const isExplainResultsLike = (explain: any): explain is ExplainResults => {
  return (
    explain &&
    Array.isArray((explain as any).operations) &&
    (explain as any).operations.every(isExplainOperationLike)
  );
};

export const useFetcher = (
  props: GraphileInspectProps,
  options: { explain: boolean },
) => {
  const [streamEndpoint, setStreamEndpoint] = useState<string | null>(null);
  const url =
    props.endpoint ??
    (typeof window !== "undefined" ? window.location.origin : "") + "/graphql";
  const [explainResults, setExplainResults] = useState<ExplainResults | null>(
    null,
  );

  // Reset the stream endpoint every time the URL changes.
  useEffect(() => {
    if (url) {
      setStreamEndpoint(null);
    }
  }, [url]);

  const explain =
    options.explain &&
    (!props.debugTools || props.debugTools.includes("explain"));

  const ourFetch = useMemo<typeof fetch>(() => {
    return (
      ...args: Parameters<typeof window.fetch>
    ): ReturnType<typeof window.fetch> => {
      const result = fetch(...args);
      result.then(
        (response) => {
          const stream = response.headers.get("X-GraphQL-Event-Stream");
          if (typeof stream === "string") {
            const streamUrl = new URL(stream, url);
            setStreamEndpoint(streamUrl.toString());
          }
        },
        () => {},
      );

      return result;
    };
  }, [url]);

  const fetcherOptions = useMemo<CreateFetcherOptions>(
    () => ({
      url,
      headers: {
        ...(explain ? { "X-PostGraphile-Explain": "on" } : null),
      },
      fetch: ourFetch,
    }),
    [explain, url, ourFetch],
  );

  const fetcher = useMemo(
    () => createGraphiQLFetcher(fetcherOptions),
    [fetcherOptions],
  );

  const wrappedFetcher = useMemo(() => {
    const processPayload = (result: ExecutionResult) => {
      if (!result) {
        return;
      }
      // Legacy PostGraphile v4 support
      const legacy = (result as any).explain as
        | Array<{ query: string; plan?: string }>
        | undefined;

      if (result.extensions?.explain) {
        const explain = result.extensions.explain;
        if (typeof explain === "object" && isExplainResultsLike(explain)) {
          setTimeout(() => {
            setExplainResults(explain);
          }, 0);
        } else {
          console.warn(
            "The response had `extensions.explain` set, but in an incompatible format.",
          );
        }
      } else if (legacy) {
        setTimeout(() => {
          setExplainResults({
            operations: legacy.map((l, i) => ({
              type: "sql",
              title: `Legacy explain ${i + 1}`,
              query: l.query,
              explain: l.plan,
            })),
          });
        }, 0);
      }
    };
    return async function (
      ...args: Parameters<Fetcher>
    ): Promise<FetcherReturnType> {
      const result = await fetcher(...args);
      if ("subscribe" in result) {
        // TODO: support wrapping subscriptions
      } else if ("next" in result && typeof result.next === "function") {
        // Return a new iterator, equivalent to the old, but that calls 'processPayload'
        return {
          throw: result.throw?.bind(result),
          return: result.return?.bind(result),
          next(...args) {
            const n = result.next(...args);
            Promise.resolve(n).then(({ done: _done, value }) => {
              if (value) {
                processPayload(value);
              }
            });
            return n;
          },
          [Symbol.asyncIterator]() {
            return this;
          },
        } as AsyncIterableIterator<any>;
      } else {
        processPayload(result);
      }
      return result;
    };
  }, [fetcher]);

  return { fetcher: wrappedFetcher, explainResults, streamEndpoint };
};
