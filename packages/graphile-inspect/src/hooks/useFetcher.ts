import type { CreateFetcherOptions } from "@graphiql/toolkit";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import type { Fetcher, FetcherReturnType } from "graphiql";
import type { ExecutionResult } from "graphql";
import { useMemo, useState } from "react";

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
  const url =
    props.endpoint ??
    (typeof window !== "undefined" ? window.location.origin : "") + "/graphql";
  const [explainResults, setExplainResults] = useState<ExplainResults | null>(
    null,
  );
  const explain =
    options.explain &&
    (!props.debugTools || props.debugTools.includes("explain"));
  const fetcherOptions = useMemo<CreateFetcherOptions>(
    () => ({
      url,
      headers: {
        ...(explain ? { "X-PostGraphile-Explain": "on" } : null),
      },
    }),
    [explain, url],
  );
  const fetcher = useMemo(
    () => props.fetcher ?? createGraphiQLFetcher(fetcherOptions),
    [fetcherOptions, props.fetcher],
  );

  const wrappedFetcher = useMemo(() => {
    const processPayload = (result: ExecutionResult) => {
      if (!result) {
        return;
      }
      // Legacy PostGraphile v4 support
      const legacy = (result as any).explain;

      if (result.extensions?.explain) {
        const explain = result.extensions.explain;
        if (typeof explain === "object" && isExplainResultsLike(explain)) {
          setExplainResults(explain);
        } else {
          console.warn(
            "The response had `extensions.explain` set, but in an incompatible format.",
          );
        }
      } else if (legacy) {
        setExplainResults({
          operations: [
            {
              type: "sql",
              title: "PostGraphile v4-style explain",
              query: legacy.query,
              explain: legacy.plan,
            },
          ],
        });
      }
    };
    return async function (
      ...args: Parameters<Fetcher>
    ): Promise<FetcherReturnType> {
      const result = await fetcher(...args);
      if ("subscribe" in result) {
        // TODO: support wrapping subscriptions
      } else if ("next" in result && typeof result.next === "function") {
        return {
          ...result,
          next(...args) {
            const n = result.next(...args);
            Promise.resolve(n).then(({ done: _done, value }) => {
              if (value) {
                processPayload(value);
              }
            });
            return n;
          },
        } as AsyncIterator<any, any, any>;
      } else {
        processPayload(result);
      }
      return result;
    };
  }, [fetcher]);

  return { fetcher: wrappedFetcher, explainResults };
};
