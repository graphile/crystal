import type { CreateFetcherOptions } from "@graphiql/toolkit";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { useMemo } from "react";

import type { GraphileInspectProps } from "../interfaces.js";

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
  return fetcher;
};
