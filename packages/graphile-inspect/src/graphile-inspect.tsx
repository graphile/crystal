import React, { FC, useCallback, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { GraphiQL, GraphiQLProps } from "graphiql";
// @ts-ignore
import GraphiQLExplorer from "graphiql-explorer";
import { useStorage } from "./hooks/useStorage.js";
import { useFetcher } from "./hooks/useFetcher.js";
import { useSchema } from "./hooks/useSchema.js";
import { GraphileInspectProps } from "./interfaces.js";
import { defaultQuery } from "./defaultQuery.js";
import { GraphileInspectFooter } from "./components/Footer.js";
import { ErrorPopup } from "./components/ErrorPopup.js";
import { useExplorer } from "./hooks/useExplorer.js";
import { usePrettify } from "./hooks/usePrettify.js";
import { useQuery } from "./hooks/useQuery.js";
import { useGraphiQL } from "./hooks/useGraphiQL.js";
import { useExtraKeys } from "./hooks/useExtraKeys.js";

const GraphiQLAny = GraphiQL as any;

function noop() {}

export const GraphileInspect: FC<GraphileInspectProps> = (props) => {
  const fetcher = useFetcher(props);
  const storage = useStorage();
  const [error, setError] = useState<Error | null>(null);
  const { schema } = useSchema(props, fetcher, setError);
  const [query, setQuery] = useQuery(props, storage);
  const { graphiqlRef, graphiql } = useGraphiQL(props);
  useExtraKeys(props, graphiql, query);
  const { onRunOperation, explorerIsOpen, onToggleExplorer } =
    useExplorer(graphiql);
  const prettify = usePrettify(graphiqlRef);

  return (
    <div
      className="graphiql-container"
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      <GraphiQLExplorer
        schema={schema}
        query={query}
        onEdit={setQuery}
        onRunOperation={onRunOperation}
        explorerIsOpen={explorerIsOpen}
        onToggleExplorer={onToggleExplorer}
      />
      <GraphiQLAny
        ref={graphiqlRef}
        fetcher={fetcher}
        schema={schema}
        query={query}
        onEditQuery={setQuery}
        editorTheme={props.editorTheme ?? "dracula"}
      >
        <GraphiQL.Logo>Graphile Inspect</GraphiQL.Logo>
        <GraphiQL.Toolbar>
          <GraphiQL.Button
            onClick={prettify}
            title="Prettify Query (Shift-Ctrl-P)"
            label="Prettify"
          />
          <GraphiQL.Button
            onClick={graphiql?.handleToggleHistory ?? noop}
            title="Show History"
            label="History"
          />
          <GraphiQL.Button
            label="Explorer"
            title="Construct a query with the GraphiQL explorer"
            onClick={onToggleExplorer}
          />
          <GraphiQL.Button
            onClick={graphiql?.handleMergeQuery ?? noop}
            title="Merge Query (Shift-Ctrl-M)"
            label="Merge"
          />
          <GraphiQL.Button
            onClick={graphiql?.handleCopyQuery ?? noop}
            title="Copy Query (Shift-Ctrl-C)"
            label="Copy"
          />

          <GraphiQL.Button
            label={
              storage.get("explain") === "true"
                ? "Explain ON"
                : "Explain disabled"
            }
            title="View the SQL statements that this query invokes"
            onClick={() => storage.toggle("explain")}
          />
          <GraphiQL.Button
            label={
              "Headers " +
              (storage.get("saveHeaders") === "true" ? "SAVED" : "unsaved")
            }
            title="Should we persist the headers to localStorage? Header editor is next to variable editor at the bottom."
            onClick={() => storage.toggle("saveHeaders")}
          />
        </GraphiQL.Toolbar>
        <GraphiQL.Footer>
          <GraphileInspectFooter />
        </GraphiQL.Footer>
      </GraphiQLAny>
      {error ? (
        <ErrorPopup error={error} onClose={() => setError(null)} />
      ) : null}
    </div>
  );
};
