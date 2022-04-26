import { GraphiQL } from "graphiql";
// @ts-ignore
import GraphiQLExplorer from "graphiql-explorer";
import type { FC } from "react";
import { useCallback, useState } from "react";

import { ErrorPopup } from "./components/ErrorPopup.js";
import { Explain } from "./components/Explain.js";
import { DRAG_WIDTH, ExplainDragBar } from "./components/ExplainDragBar.js";
import { GraphileInspectFooter } from "./components/Footer.js";
import { useExplain } from "./hooks/useExplain.js";
import { useExplorer } from "./hooks/useExplorer.js";
import { useExtraKeys } from "./hooks/useExtraKeys.js";
import { useFetcher } from "./hooks/useFetcher.js";
import { useGraphiQL } from "./hooks/useGraphiQL.js";
import { usePrettify } from "./hooks/usePrettify.js";
import { useQuery } from "./hooks/useQuery.js";
import { useSchema } from "./hooks/useSchema.js";
import { useStorage } from "./hooks/useStorage.js";
import type { GraphileInspectProps } from "./interfaces.js";

const GraphiQLAny = GraphiQL as any;
const GraphiQLMenuAny = GraphiQL.Menu as any;
const checkCss = { width: "1.5rem", display: "inline-block" };
const check = <span style={checkCss}>✔</span>;
const nocheck = <span style={checkCss}></span>;

function noop() {}

export const GraphileInspect: FC<GraphileInspectProps> = (props) => {
  const storage = useStorage();
  const explain = storage.get("explain") === "true";
  const setExplain = useCallback(
    (newExplain: boolean) => {
      storage.set("explain", newExplain ? "true" : "");
    },
    [storage],
  );
  const { fetcher, explainResults, streamEndpoint } = useFetcher(props, {
    explain,
  });
  const explainHelpers = useExplain(storage);
  const { showExplain, explainSize, explainAtBottom, setShowExplain } =
    explainHelpers;
  const [error, setError] = useState<Error | null>(null);
  const [query, setQuery] = useQuery(props, storage);
  const { graphiqlRef, graphiql, onToggleDocs, onToggleHistory } =
    useGraphiQL(props);
  const { schema } = useSchema(
    props,
    fetcher,
    setError,
    streamEndpoint,
    graphiqlRef,
  );
  useExtraKeys(props, graphiql, query);
  const { onRunOperation, explorerIsOpen, onToggleExplorer } = useExplorer(
    graphiql,
    storage,
  );
  const prettify = usePrettify(graphiqlRef);

  return (
    <div
      className="graphiql-container"
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: explainAtBottom ? "column" : "row",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: "1 1 100%",
          overflow: "hidden",
        }}
      >
        <style>
          {`\
/* Work around a bug in GraphiQL where you can't click the down arrow. */
.toolbar-menu.toolbar-button > svg { pointer-events: none; }
`}
        </style>
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
            <GraphiQLMenuAny title="Utils" label="Utilities">
              <GraphiQL.MenuItem
                onSelect={prettify}
                title="Prettify Query (Shift-Ctrl-P)"
                label="Prettify"
              />
              <GraphiQL.MenuItem
                onSelect={graphiql?.handleMergeQuery ?? noop}
                title="Merge Query (Shift-Ctrl-M)"
                label="Merge"
              />
              <GraphiQL.MenuItem
                onSelect={graphiql?.handleCopyQuery ?? noop}
                title="Copy Query (Shift-Ctrl-C)"
                label="Copy"
              />
            </GraphiQLMenuAny>
            <GraphiQLMenuAny title="Panels" label="Panels">
              <GraphiQL.MenuItem
                onSelect={onToggleDocs}
                title="Docs"
                label={
                  (
                    <span>
                      {graphiql?.state.docExplorerOpen ? check : nocheck}
                      Docs
                    </span>
                  ) as any
                }
              />
              <GraphiQL.MenuItem
                onSelect={onToggleHistory}
                title="History"
                label={
                  (
                    <span>
                      {graphiql?.state.historyPaneOpen ? check : nocheck}
                      History
                    </span>
                  ) as any
                }
              />
              <GraphiQL.MenuItem
                label={
                  (
                    <span>{explorerIsOpen ? check : nocheck}Explorer</span>
                  ) as any
                }
                title="Construct a query with the GraphiQL explorer"
                onSelect={onToggleExplorer}
              />
              <GraphiQL.MenuItem
                label={
                  (<span>{showExplain ? check : nocheck}Explain</span>) as any
                }
                title="Show details of what went on inside your GraphQL operation (if the server supports this)"
                onSelect={() => setShowExplain(!showExplain)}
              />
            </GraphiQLMenuAny>
            <GraphiQLMenuAny title="Options" label="Options">
              <GraphiQL.MenuItem
                label={
                  (
                    <span>
                      {storage.get("explain") === "true" ? check : nocheck}
                      Explain (show execution details if available)
                    </span>
                  ) as any
                }
                title="View the SQL statements that this query invokes"
                onSelect={() => storage.toggle("explain")}
              />
              <GraphiQL.MenuItem
                label={
                  (
                    <span>
                      {storage.get("saveHeaders") === "true" ? check : nocheck}
                      Save headers
                    </span>
                  ) as any
                }
                title="Should we persist the headers to localStorage? Header editor is next to variable editor at the bottom."
                onSelect={() => storage.toggle("saveHeaders")}
              />
            </GraphiQLMenuAny>
          </GraphiQL.Toolbar>
          <GraphiQL.Footer>
            <GraphileInspectFooter />
          </GraphiQL.Footer>
        </GraphiQLAny>
      </div>
      {showExplain ? <ExplainDragBar helpers={explainHelpers} /> : null}
      {showExplain ? (
        <div
          style={{
            flex: `0 0 ${explainSize - DRAG_WIDTH}px`,
            position: "relative",
            minWidth: 300,
            ...(explainAtBottom
              ? { maxWidth: "none", maxHeight: "80%" }
              : { maxWidth: "60%", maxHeight: "none" }),
          }}
        >
          <Explain
            explain={explain}
            setExplain={setExplain}
            helpers={explainHelpers}
            results={explainResults}
          />
        </div>
      ) : null}
      {error ? (
        <ErrorPopup error={error} onClose={() => setError(null)} />
      ) : null}
    </div>
  );
};
