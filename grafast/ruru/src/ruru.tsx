import {
  DOC_EXPLORER_PLUGIN,
  GraphiQLProvider,
  HISTORY_PLUGIN,
  Menu,
  ToolbarMenu,
  useCopyQuery,
  useEditorContext,
  useMergeQuery,
  usePluginContext,
} from "@graphiql/react";
import { GraphiQLInterface, GraphiQL } from "graphiql";
import type { FC } from "react";
import { useCallback, useState } from "react";

import { ErrorPopup } from "./components/ErrorPopup.js";
import { Explain } from "./components/Explain.js";
import { DRAG_WIDTH, ExplainDragBar } from "./components/ExplainDragBar.js";
import { RuruFooter } from "./components/Footer.js";
import { ExplainHelpers, useExplain } from "./hooks/useExplain.js";
import { ExplainResults, useFetcher } from "./hooks/useFetcher.js";
import { usePrettify } from "./hooks/usePrettify.js";
import { useQuery } from "./hooks/useQuery.js";
import { useSchema } from "./hooks/useSchema.js";
import { RuruStorage, useStorage } from "./hooks/useStorage.js";
import type { RuruProps } from "./interfaces.js";
import "graphiql/graphiql.css";

const checkCss = { width: "1.5rem", display: "inline-block" };
const check = <span style={checkCss}>✔</span>;
const nocheck = <span style={checkCss}></span>;

function noop() {}

export const Ruru: FC<RuruProps> = (props) => {
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
  const [error, setError] = useState<Error | null>(null);
  const explainHelpers = useExplain(storage);
  const { schema } = useSchema(props, fetcher, setError, streamEndpoint);
  return (
    <GraphiQLProvider fetcher={fetcher} schema={schema}>
      <RuruInner
        storage={storage}
        editorTheme={props.editorTheme}
        explainHelpers={explainHelpers}
        explain={explain}
        setExplain={setExplain}
        explainResults={explainResults}
        error={error}
        setError={setError}
      />
    </GraphiQLProvider>
  );
};

export const RuruInner: FC<{
  explainHelpers: ExplainHelpers;
  editorTheme?: string;
  storage: RuruStorage;
  explain: boolean;
  setExplain: (newExplain: boolean) => void;
  explainResults: ExplainResults | null;
  error: Error | null;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
}> = (props) => {
  const {
    explainHelpers,
    storage,
    editorTheme,
    explain,
    setExplain,
    explainResults,
    error,
    setError,
  } = props;
  const { showExplain, explainSize, explainAtBottom, setShowExplain } =
    explainHelpers;
  const editorContext = useEditorContext();
  const pluginContext = usePluginContext();
  const queryEditor = editorContext?.queryEditor;
  const query = queryEditor?.getValue();
  const prettify = usePrettify();
  const mergeQuery = useMergeQuery();
  const copyQuery = useCopyQuery();

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
          position: "relative",
        }}
      >
        <GraphiQLInterface editorTheme={editorTheme ?? "dracula"}>
          <GraphiQL.Logo>Ruru</GraphiQL.Logo>
          <GraphiQL.Toolbar>
            <Menu title="Utils" label="Utilities">
              <ToolbarMenu.Item
                onSelect={prettify}
                title="Prettify Query (Shift-Ctrl-P)"
              >
                Prettify
              </ToolbarMenu.Item>
              <ToolbarMenu.Item
                onSelect={mergeQuery}
                title="Merge Query (Shift-Ctrl-M)"
              >
                Merge
              </ToolbarMenu.Item>
              <ToolbarMenu.Item
                onSelect={copyQuery}
                title="Copy Query (Shift-Ctrl-C)"
              >
                Copy
              </ToolbarMenu.Item>
            </Menu>
            <Menu title="Panels" label="Panels">
              <ToolbarMenu.Item
                onSelect={() =>
                  pluginContext?.setVisiblePlugin(DOC_EXPLORER_PLUGIN)
                }
                title="Docs"
              >
                <span>
                  {pluginContext?.visiblePlugin === DOC_EXPLORER_PLUGIN
                    ? check
                    : nocheck}
                  Docs
                </span>
              </ToolbarMenu.Item>
              <ToolbarMenu.Item
                onSelect={() => pluginContext?.setVisiblePlugin(HISTORY_PLUGIN)}
                title="History"
              >
                <span>
                  {pluginContext?.visiblePlugin === HISTORY_PLUGIN
                    ? check
                    : nocheck}
                  History
                </span>
              </ToolbarMenu.Item>
              <ToolbarMenu.Item
                title="Show details of what went on inside your GraphQL operation (if the server supports this)"
                onSelect={() => setShowExplain(!showExplain)}
              >
                <span>{showExplain ? check : nocheck}Explain</span>
              </ToolbarMenu.Item>
            </Menu>
            <Menu title="Options" label="Options">
              <ToolbarMenu.Item
                title="View the SQL statements that this query invokes"
                onSelect={() => storage.toggle("explain")}
              >
                <span>
                  {storage.get("explain") === "true" ? check : nocheck}
                  Explain (show execution details if available)
                </span>
              </ToolbarMenu.Item>
              <ToolbarMenu.Item
                title="Should we persist the headers to localStorage? Header editor is next to variable editor at the bottom."
                onSelect={() => storage.toggle("saveHeaders")}
              >
                <span>
                  {storage.get("saveHeaders") === "true" ? check : nocheck}
                  Save headers
                </span>
              </ToolbarMenu.Item>
            </Menu>
          </GraphiQL.Toolbar>
          <GraphiQL.Footer>
            <RuruFooter />
          </GraphiQL.Footer>
        </GraphiQLInterface>
      </div>
      {showExplain ? <ExplainDragBar helpers={explainHelpers} /> : null}
      {showExplain ? (
        <div
          style={{
            flex: `0 0 ${explainSize - DRAG_WIDTH}px`,
            position: "relative",
            minWidth: 300,
            ...(explainAtBottom
              ? { maxWidth: "none", maxHeight: "calc(100vh - 8rem)" }
              : { maxWidth: "calc(100vw - 500px)", maxHeight: "none" }),
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
