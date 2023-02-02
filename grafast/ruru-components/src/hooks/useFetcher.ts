import type {
  CreateFetcherOptions,
  Fetcher,
  FetcherParams,
  FetcherReturnType,
} from "@graphiql/toolkit";
import { isPromise, createGraphiQLFetcher } from "@graphiql/toolkit";
import type { AsyncExecutionResult, ExecutionResult } from "graphql";
import { getOperationAST, parse } from "graphql";
import { useEffect, useMemo, useState } from "react";

import type { RuruProps } from "../interfaces.js";

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

const isIntrospectionQuery = (params: FetcherParams) => {
  try {
    if (params.operationName === "IntrospectionQuery") {
      return true;
    }
    if (params.operationName) {
      return false;
    }
    const ast = parse(params.query);
    const def = getOperationAST(ast, params.operationName);
    if (def?.name?.value === "IntrospectionQuery") {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

function makeWsUrl(url: string): string {
  if (url.startsWith("/")) {
    return `ws${window.location.protocol === "https:" ? "s" : ""}://${
      window.location.host
    }${url}`;
  } else {
    return url;
  }
}

function hideProperty(obj: object, property: string) {
  const value = obj[property];
  delete obj[property];
  Object.defineProperty(obj, property, { value, enumerable: false });
}

export const useFetcher = (
  props: RuruProps,
  options: { explain?: boolean; verbose?: boolean } = {},
) => {
  const [streamEndpoint, setStreamEndpoint] = useState<string | null>(null);
  const endpoint = props.endpoint ?? "/graphql";
  const url = endpoint.startsWith("/")
    ? (typeof window !== "undefined" ? window.location.origin : "") + endpoint
    : endpoint;
  const subscriptionUrl = props.subscriptionEndpoint
    ? makeWsUrl(props.subscriptionEndpoint)
    : undefined;
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
  const verbose = !!options.verbose;

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
      subscriptionUrl,
      headers: {
        ...(explain
          ? {
              "X-PostGraphile-Explain": "on",
              "X-GraphQL-Explain": "mermaid-js,sql",
            }
          : null),
      },
      fetch: ourFetch,
    }),
    [explain, url, subscriptionUrl, ourFetch],
  );

  const fetcher = useMemo(
    () => props.fetcher ?? createGraphiQLFetcher(fetcherOptions),
    [fetcherOptions, props.fetcher],
  );

  const wrappedFetcher = useMemo(() => {
    const processPayload = (
      inResult:
        | ExecutionResult
        | AsyncExecutionResult[]
        | AsyncExecutionResult
        | null
        | undefined,
    ):
      | ExecutionResult
      | AsyncExecutionResult[]
      | AsyncExecutionResult
      | null
      | undefined => {
      if (inResult == null) {
        return inResult;
      }
      if (Array.isArray(inResult)) {
        return inResult.map(processPayload) as AsyncExecutionResult[];
      }
      // Mutable result
      const result = {
        ...inResult,
        ...(inResult.extensions
          ? { extensions: { ...inResult.extensions } }
          : null),
      } as ExecutionResult | AsyncExecutionResult;
      // Legacy PostGraphile v4 support
      const legacy = (result as any).explain as
        | Array<{ query: string; plan?: string }>
        | undefined;

      if (result.extensions?.explain) {
        const explain = result.extensions.explain;
        if (typeof explain === "object" && isExplainResultsLike(explain)) {
          setTimeout(() => {
            setExplainResults(explain);
          }, 100);
        } else {
          console.warn(
            "The response had `extensions.explain` set, but in an incompatible format.",
          );
        }
        // Hide it if not verbose
        if (!verbose) {
          if (Object.keys(result.extensions).length === 1) {
            hideProperty(result, "extensions");
          } else {
            hideProperty(result.extensions, "explain");
          }
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
        }, 100);
      }
      return result;
    };
    return async function (
      ...args: Parameters<Fetcher>
    ): Promise<FetcherReturnType> {
      const result = await fetcher(...args);

      // Short circuit the introspection query so as to not confuse people
      if (isIntrospectionQuery(args[0])) {
        return result;
      }

      setTimeout(() => {
        setExplainResults(null);
      }, 100);
      if ("subscribe" in result) {
        // TODO: support wrapping subscriptions
      } else if ("next" in result && typeof result.next === "function") {
        // Return a new iterator, equivalent to the old, but that calls 'processPayload'
        return {
          throw: result.throw?.bind(result),
          return: result.return?.bind(result),
          next(...args) {
            const n = result.next(...args);
            if (typeof n.then === "function") {
              return n.then(({ done, value }: any) => {
                return { done, value: processPayload(value) };
              });
            } else {
              const { done, value } = n;
              return { done, value: processPayload(value) };
            }
          },
          [Symbol.asyncIterator]() {
            return this;
          },
        } as AsyncIterableIterator<any>;
      } else {
        return processPayload(result);
      }
    };
  }, [fetcher, verbose]);

  return { fetcher: wrappedFetcher, explainResults, streamEndpoint };
};
