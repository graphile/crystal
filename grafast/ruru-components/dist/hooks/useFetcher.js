import { createGraphiQLFetcher, isAsyncIterable, isPromise, } from "@graphiql/toolkit";
import { getOperationAST, parse } from "graphql";
import { useEffect, useMemo, useState } from "react";
const isExplainOperationLike = (op) => {
    return (typeof op === "object" &&
        op &&
        typeof op.type === "string" &&
        typeof op.title === "string");
};
const isExplainResultsLike = (explain) => {
    return (explain &&
        Array.isArray(explain.operations) &&
        explain.operations.every(isExplainOperationLike));
};
const isIntrospectionQuery = (params) => {
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
    }
    catch (e) {
        return false;
    }
};
function makeWsUrl(url) {
    if (url.startsWith("/")) {
        return `ws${window.location.protocol === "https:" ? "s" : ""}://${window.location.host}${url}`;
    }
    else if (/^https?:\/\//.test(url)) {
        return `ws${url.substring(4)}`;
    }
    else {
        return url;
    }
}
function hideProperty(obj, property) {
    const value = obj[property];
    delete obj[property];
    Object.defineProperty(obj, property, { value, enumerable: false });
}
export const useFetcher = (props, options = {}) => {
    const [streamEndpoint, setStreamEndpoint] = useState(null);
    const endpoint = props.endpoint ?? "/graphql";
    const url = endpoint.startsWith("/")
        ? (typeof window !== "undefined" ? window.location.origin : "") + endpoint
        : endpoint;
    const subscriptionUrl = props.subscriptionEndpoint
        ? makeWsUrl(props.subscriptionEndpoint)
        : props.endpoint
            ? makeWsUrl(props.endpoint)
            : undefined;
    const [explainResults, setExplainResults] = useState(null);
    // Reset the stream endpoint every time the URL changes.
    useEffect(() => {
        if (url) {
            setStreamEndpoint(null);
        }
    }, [url]);
    const explain = options.explain &&
        (!props.debugTools || props.debugTools.includes("explain"));
    const verbose = !!options.verbose;
    const ourFetch = useMemo(() => {
        return (...args) => {
            const result = fetch(...args);
            result.then((response) => {
                const stream = response.headers.get("X-GraphQL-Event-Stream");
                if (typeof stream === "string") {
                    const streamUrl = new URL(stream, url);
                    setStreamEndpoint(streamUrl.toString());
                }
            }, () => { });
            return result;
        };
    }, [url]);
    const fetcherOptions = useMemo(() => {
        const headers = explain
            ? { "X-PostGraphile-Explain": "on", "X-GraphQL-Explain": "plan,sql" }
            : {};
        return {
            url,
            headers,
            wsConnectionParams: headers,
            fetch: ourFetch,
            subscriptionUrl,
        };
    }, [explain, url, subscriptionUrl, ourFetch]);
    const fetcher = useMemo(() => props.fetcher ?? createGraphiQLFetcher(fetcherOptions), [fetcherOptions, props.fetcher]);
    const wrappedFetcher = useMemo(() => {
        const processPayload = (inResult) => {
            if (inResult == null) {
                return inResult;
            }
            if (Array.isArray(inResult)) {
                return inResult.map(processPayload);
            }
            // Mutable result
            const result = {
                ...inResult,
                ...(inResult.extensions
                    ? { extensions: { ...inResult.extensions } }
                    : null),
            };
            // Legacy PostGraphile v4 support
            const legacy = result.explain;
            if (result.extensions?.explain) {
                const explain = result.extensions.explain;
                if (typeof explain === "object" && isExplainResultsLike(explain)) {
                    setTimeout(() => {
                        setExplainResults(explain);
                    }, 100);
                }
                else {
                    console.warn("The response had `extensions.explain` set, but in an incompatible format.");
                }
                // Hide it if not verbose
                if (!verbose) {
                    if (Object.keys(result.extensions).length === 1) {
                        hideProperty(result, "extensions");
                    }
                    else {
                        hideProperty(result.extensions, "explain");
                    }
                }
            }
            else if (legacy) {
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
        return async function (...args) {
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
                return result;
            }
            else if (isAsyncIterable(result)) {
                const iterator = result[Symbol.asyncIterator]();
                // Return a new iterator, equivalent to the old, but that calls 'processPayload'
                return {
                    throw: iterator.throw?.bind(iterator),
                    return: iterator.return?.bind(iterator),
                    next(...args) {
                        const n = iterator.next(...args);
                        if (isPromise(n)) {
                            return n.then(({ done, value }) => {
                                return { done, value: processPayload(value) };
                            });
                        }
                        else {
                            const { done, value } = n;
                            return { done, value: processPayload(value) };
                        }
                    },
                    [Symbol.asyncIterator]() {
                        return this;
                    },
                };
            }
            else {
                return processPayload(result);
            }
        };
    }, [fetcher, verbose]);
    return { fetcher: wrappedFetcher, explainResults, streamEndpoint };
};
//# sourceMappingURL=useFetcher.js.map