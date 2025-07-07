import { explorerPlugin as makeExplorerPlugin } from "@graphiql/plugin-explorer";
import {
  CopyIcon,
  GraphiQLProvider,
  MergeIcon,
  PrettifyIcon,
  SettingsIcon,
  ToolbarButton,
  ToolbarMenu,
  useGraphiQL,
  useGraphiQLActions,
} from "@graphiql/react";
import type { GraphiQLProps } from "graphiql";
import { GraphiQL } from "graphiql";
import type { FC } from "react";
import { useCallback, useState } from "react";

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
const plugins = [explorerPlugin, EXPLAIN_PLUGIN];

export const Ruru: FC<RuruProps> = (props) => {
  const storage = useStorage();
  const explain = storage.get("explain") === "true";
  const verbose = storage.get("verbose") === "true";
  const saveHeaders = storage.get("saveHeaders") === "true";
  const setExplain = useCallback(
    (newExplain: boolean) => {
      storage.set("explain", newExplain ? "true" : "");
    },
    [storage],
  );
  const { fetcher, explainResults, streamEndpoint } = useFetcher(props, {
    explain,
    verbose,
  });
  const [error, setError] = useState<Error | null>(null);
  const explainHelpers = useExplain(storage);
  const defaultQuery = props.defaultQuery ?? DEFAULT_QUERY;
  return (
    //EditorContextProvider
    <ExplainContext.Provider
      value={{
        explainHelpers,
        explain,
        setExplain,
        explainResults,
      }}
    >
      <GraphiQLProvider
        inputValueDeprecation={true}
        schemaDescription={true}
        fetcher={fetcher}
        defaultQuery={defaultQuery}
        initialQuery={props.query ?? props.initialQuery}
        initialVariables={props.variables ?? props.initialVariables}
        plugins={plugins}
        shouldPersistHeaders={saveHeaders}
      >
        <RuruInner
          storage={storage}
          editorTheme={props.editorTheme}
          defaultTheme={props.defaultTheme}
          forcedTheme={props.forcedTheme}
          error={error}
          setError={setError}
          onEditQuery={props.onEditQuery}
          onEditVariables={props.onEditVariables}
          streamEndpoint={streamEndpoint}
          fetcher={fetcher}
        />
      </GraphiQLProvider>
    </ExplainContext.Provider>
  );
};

export const RuruInner: FC<{
  editorTheme?: GraphiQLProps["editorTheme"];
  forcedTheme?: GraphiQLProps["forcedTheme"];
  defaultTheme?: GraphiQLProps["defaultTheme"];
  storage: RuruStorage;
  error: Error | null;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  onEditQuery?: GraphiQLProps["onEditQuery"];
  onEditVariables?: GraphiQLProps["onEditVariables"];
  streamEndpoint: string | null;
  fetcher: GraphiQLProps["fetcher"];
}> = (props) => {
  const {
    storage,
    editorTheme,
    forcedTheme,
    defaultTheme,
    error,
    setError,
    onEditQuery,
    onEditVariables,
    streamEndpoint,
    fetcher,
  } = props;
  const prettify = usePrettify();
  const { copyQuery, mergeQuery, setSchemaReference, introspect } =
    useGraphiQLActions();
  setSchemaReference;
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
        <GraphiQL
          defaultTheme={defaultTheme}
          forcedTheme={forcedTheme}
          editorTheme={editorTheme}
          onEditQuery={onEditQuery}
          onEditVariables={onEditVariables}
          fetcher={fetcher}
        >
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
            {() => (
              <>
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
                  <MergeIcon
                    className="graphiql-toolbar-icon"
                    aria-hidden="true"
                  />
                </ToolbarButton>
                <ToolbarButton
                  onClick={copyQuery}
                  label="Copy query (Shift-Ctrl-C)"
                >
                  <CopyIcon
                    className="graphiql-toolbar-icon"
                    aria-hidden="true"
                  />
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
                  <ToolbarMenu.Item
                    title="Should we persist the headers to localStorage? Header editor is next to variable editor at the bottom."
                    onSelect={() => storage.toggle("saveHeaders")}
                  >
                    <span>
                      {storage.get("saveHeaders") === "true" ? check : nocheck}
                      Save headers
                    </span>
                  </ToolbarMenu.Item>
                </ToolbarMenu>
              </>
            )}
          </GraphiQL.Toolbar>

          <GraphiQL.Footer>
            <RuruFooter />
          </GraphiQL.Footer>
        </GraphiQL>
      </div>
      {error ? (
        <ErrorPopup error={error} onClose={() => setError(null)} />
      ) : null}
    </div>
  );
};
