import React, { FC, useMemo } from "react";
import ReactDOM from "react-dom";

import GraphiQL, { GraphiQLProps } from "graphiql";
import { createGraphiQLFetcher } from "@graphiql/toolkit";

export interface GraphileInspectProps {
  /**
   * The URL to the GraphQL endpoint.
   */
  url?: string;

  /**
   * The fetcher function to issue GraphQL requests.
   */
  fetcher?: GraphiQLProps["fetcher"];
  editorTheme?: GraphiQLProps["editorTheme"];
}

export const GraphileInspect: FC<GraphileInspectProps> = (props) => {
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
  return (
    <GraphiQL fetcher={fetcher} editorTheme={props.editorTheme ?? "dracula"} />
  );
};
