import {
  DOC_EXPLORER_PLUGIN,
  DocExplorerStore,
} from "@graphiql/plugin-doc-explorer";
import { explorerPlugin as makeExplorerPlugin } from "@graphiql/plugin-explorer";
import { HISTORY_PLUGIN, HistoryStore } from "@graphiql/plugin-history";
import {
  CopyIcon,
  GraphiQLProvider,
  MergeIcon,
  PrettifyIcon,
  SettingsIcon,
  ToolbarButton,
  ToolbarMenu,
  useGraphiQLActions,
} from "@graphiql/react";
import type { GraphiQLInterfaceProps } from "graphiql";
import { GraphiQL, GraphiQLInterface } from "graphiql";
import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";

import { ErrorPopup } from "./components/ErrorPopup.js";
import { RuruFooter } from "./components/Footer.js";
import { defaultQuery as DEFAULT_QUERY } from "./defaultQuery.js";
import { ExplainContext, useExplain } from "./hooks/useExplain.js";
import { useFetcher } from "./hooks/useFetcher.js";
import { useGraphQLChangeStream } from "./hooks/useGraphQLChangeStream.js";
import { usePrettify } from "./hooks/usePrettify.js";
import type { RuruStorage } from "./hooks/useStorage.js";
import { useStorage } from "./hooks/useStorage.js";
import type { RuruProps } from "./interfaces.js";
import { EXPLAIN_PLUGIN } from "./plugins/explain.js";

const checkCss = { width: "1.5rem", display: "inline-block" };
const check = <span style={checkCss}>✔</span>;
const nocheck = <span style={checkCss}></span>;

const explorerPlugin = makeExplorerPlugin({
  showAttribution: false,
});
const plugins = [
  DOC_EXPLORER_PLUGIN,
  HISTORY_PLUGIN,
  explorerPlugin,
  EXPLAIN_PLUGIN,
];

export const Ruru: FC<RuruProps> = (props) => {
  const {
    inputValueDeprecation,
    schemaDescription,
    defaultQuery,

    // Things we're handling elsewhere
    fetcher: _fetcher,
    debugTools: _debugTools,

    // Pass everything else through to GraphiQL
    ...otherProps
  } = props;
  const storage = useStorage();
  const explain = storage.get("explain") === "true";
  const verbose = storage.get("verbose") === "true";
  const setExplain = useCallback(
    (newExplain: boolean) =>
      void storage.set("explain", newExplain ? "true" : ""),
    [storage],
  );
  const { fetcher, explainResults, streamEndpoint } = useFetcher(props, {
    explain,
    verbose,
  });
  const [error, setError] = useState<Error | null>(null);
  const explainHelpers = useExplain(storage);
  const explainContextValue = useMemo(
    () => ({ explain, explainHelpers, explainResults, setExplain }),
    [explain, explainHelpers, explainResults, setExplain],
  );
  return (
    <ExplainContext.Provider value={explainContextValue}>
      <GraphiQLProvider
        {...otherProps}
        inputValueDeprecation={inputValueDeprecation ?? true}
        schemaDescription={schemaDescription ?? true}
        fetcher={fetcher}
        defaultQuery={defaultQuery ?? DEFAULT_QUERY}
        plugins={plugins}
      >
        <HistoryStore maxHistoryLength={props.maxHistoryLength}>
          <DocExplorerStore>
            <RuruInner
              {...otherProps}
              // showPersistHeadersSettings={props.showPersistHeadersSettings}
              // onEditQuery={props.onEditQuery}
              // onEditVariables={props.onEditVariables}
              // onEditHeaders={props.onEditHeaders}
              // responseTooltip={props.responseTooltip}
              // defaultEditorToolsVisibility={props.defaultEditorToolsVisibility}
              // isHeadersEditorEnabled={props.isHeadersEditorEnabled}
              // forcedTheme={props.forcedTheme}
              // confirmCloseTab={props.confirmCloseTab}
              // className={props.className}
              storage={storage}
              error={error}
              setError={setError}
              streamEndpoint={streamEndpoint}
            />
          </DocExplorerStore>
        </HistoryStore>
      </GraphiQLProvider>
    </ExplainContext.Provider>
  );
};

export const RuruInner: FC<{
  // RuruInner props
  storage: RuruStorage;
  error: Error | null;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  streamEndpoint: string | null;

  // GraphiQLInterfaceProps
  showPersistHeadersSettings?: GraphiQLInterfaceProps["showPersistHeadersSettings"];
  onEditQuery?: GraphiQLInterfaceProps["onEditQuery"];
  onEditVariables?: GraphiQLInterfaceProps["onEditVariables"];
  onEditHeaders?: GraphiQLInterfaceProps["onEditHeaders"];
  responseTooltip?: GraphiQLInterfaceProps["responseTooltip"];
  defaultEditorToolsVisibility?: GraphiQLInterfaceProps["defaultEditorToolsVisibility"];
  isHeadersEditorEnabled?: GraphiQLInterfaceProps["isHeadersEditorEnabled"];
  forcedTheme?: GraphiQLInterfaceProps["forcedTheme"];
  confirmCloseTab?: GraphiQLInterfaceProps["confirmCloseTab"];
  className?: GraphiQLInterfaceProps["className"];
}> = (props) => {
  const {
    storage,
    error,
    setError,
    streamEndpoint,
    ...graphiqlInterfaceProps
  } = props;
  const prettify = usePrettify();
  const { copyQuery, mergeQuery, introspect } = useGraphiQLActions();
  useGraphQLChangeStream(props, introspect, streamEndpoint);

  return (
    <div
      className="graphiql-container"
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
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
        <GraphiQLInterface {...graphiqlInterfaceProps}>
          <GraphiQL.Logo>
            <a
              href="https://grafast.org/ruru"
              style={{ textDecoration: "none" }}
              target="_blank"
              rel="noreferrer"
            >
              Ruru
            </a>
          </GraphiQL.Logo>
          <GraphiQL.Toolbar>
            <ToolbarButton
              onClick={prettify}
              label="Prettify Query (Shift-Ctrl-P)"
            >
              <PrettifyIcon
                className="graphiql-toolbar-icon"
                aria-hidden="true"
              />
            </ToolbarButton>
            <ToolbarButton
              onSelect={mergeQuery}
              label="Merge Query (Shift-Ctrl-M)"
            >
              <MergeIcon className="graphiql-toolbar-icon" aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton
              onClick={copyQuery}
              label="Copy query (Shift-Ctrl-C)"
            >
              <CopyIcon className="graphiql-toolbar-icon" aria-hidden="true" />
            </ToolbarButton>
            <ToolbarMenu
              button={
                <ToolbarButton label="Options">
                  <SettingsIcon
                    className="graphiql-toolbar-icon"
                    aria-hidden="true"
                  />
                </ToolbarButton>
              }
            >
              <ToolbarMenu.Item
                title="View the SQL statements that this query invokes"
                onSelect={() => storage.toggle("explain")}
              >
                <span>
                  {storage.get("explain") === "true" ? check : nocheck}
                  Explain (if supported)
                </span>
              </ToolbarMenu.Item>
              <ToolbarMenu.Item
                title="Don't hide explain from results"
                onSelect={() => storage.toggle("verbose")}
              >
                <span>
                  {storage.get("verbose") === "true" ? check : nocheck}
                  Verbose
                </span>
              </ToolbarMenu.Item>
            </ToolbarMenu>
          </GraphiQL.Toolbar>

          <GraphiQL.Footer>
            <RuruFooter />
          </GraphiQL.Footer>
        </GraphiQLInterface>
      </div>
      {error ? (
        <ErrorPopup error={error} onClose={() => setError(null)} />
      ) : null}
    </div>
  );
};
