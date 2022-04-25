import { useMemo } from "react";
import { GraphileInspectProps } from "../interfaces.js";
import { createGraphiQLFetcher, CreateFetcherOptions } from "@graphiql/toolkit";

export const useFetcher = (
  props: GraphileInspectProps,
  options: { explain: boolean },
) => {
  const url =
    props.endpoint ??
    (typeof window !== "undefined" ? window.location.origin : "") + "/graphql";
  const explain =
    options.explain &&
    (!props.debugTools || props.debugTools.includes("explain"));
  const fetcherOptions = useMemo<CreateFetcherOptions>(
    () => ({
      url,
      ...(explain ? { "X-PostGraphile-Explain": "on" } : null),
    }),
    [explain, url],
  );
  const fetcher = useMemo(
    () => props.fetcher ?? createGraphiQLFetcher(fetcherOptions),
    [fetcherOptions, props.fetcher],
  );
  return fetcher;
};
