import { useMemo } from "react";
import { GraphileInspectProps } from "../interfaces";
import { createGraphiQLFetcher } from "@graphiql/toolkit";

export const useFetcher = (props: GraphileInspectProps) => {
  const url =
    props.url ??
    (typeof window !== "undefined" ? window.location.origin : "") + "/graphql";
  const fetcher = useMemo(
    () =>
      props.fetcher ??
      createGraphiQLFetcher({
        url,
      }),
    [url, props.fetcher],
  );
  return fetcher;
};
