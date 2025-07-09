import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { explorerPlugin as makeExplorerPlugin } from "@graphiql/plugin-explorer";
import { CopyIcon, GraphiQLProvider as GP2, MergeIcon, PrettifyIcon, SettingsIcon, ToolbarButton, ToolbarMenu, useCopyQuery, useMergeQuery, useSchemaContext, } from "@graphiql/react";
import { GraphiQL, GraphiQLInterface, GraphiQLProvider } from "graphiql";
import { useCallback, useState } from "react";
import { ErrorPopup } from "./components/ErrorPopup.js";
import { RuruFooter } from "./components/Footer.js";
import { defaultQuery as DEFAULT_QUERY } from "./defaultQuery.js";
import { ExplainContext, useExplain } from "./hooks/useExplain.js";
import { useFetcher } from "./hooks/useFetcher.js";
import { useGraphQLChangeStream } from "./hooks/useGraphQLChangeStream.js";
import { usePrettify } from "./hooks/usePrettify.js";
import { useStorage } from "./hooks/useStorage.js";
import { EXPLAIN_PLUGIN } from "./plugins/explain.js";
if (GP2 !== GraphiQLProvider) {
    throw new Error("PACKAGE MANAGEMENT ERROR! The providers don't match up!");
}
const checkCss = { width: "1.5rem", display: "inline-block" };
const check = _jsx("span", { style: checkCss, children: "\u2714" });
const nocheck = _jsx("span", { style: checkCss });
const explorerPlugin = makeExplorerPlugin({
    showAttribution: false,
});
const plugins = [explorerPlugin, EXPLAIN_PLUGIN];
export const Ruru = (props) => {
    const storage = useStorage();
    const explain = storage.get("explain") === "true";
    const verbose = storage.get("verbose") === "true";
    const saveHeaders = storage.get("saveHeaders") === "true";
    const setExplain = useCallback((newExplain) => {
        storage.set("explain", newExplain ? "true" : "");
    }, [storage]);
    const { fetcher, explainResults, streamEndpoint } = useFetcher(props, {
        explain,
        verbose,
    });
    const [error, setError] = useState(null);
    const explainHelpers = useExplain(storage);
    const defaultQuery = props.defaultQuery ?? DEFAULT_QUERY;
    return (
    //EditorContextProvider
    _jsx(ExplainContext.Provider, { value: {
            explainHelpers,
            explain,
            setExplain,
            explainResults,
        }, children: _jsx(GraphiQLProvider, { inputValueDeprecation: true, schemaDescription: true, fetcher: fetcher, defaultQuery: defaultQuery, query: props.query ?? props.initialQuery, variables: props.variables ?? props.initialVariables, plugins: plugins, shouldPersistHeaders: saveHeaders, children: _jsx(RuruInner, { storage: storage, editorTheme: props.editorTheme, error: error, setError: setError, onEditQuery: props.onEditQuery, onEditVariables: props.onEditVariables, streamEndpoint: streamEndpoint }) }) }));
};
export const RuruInner = (props) => {
    const { storage, editorTheme, error, setError, onEditQuery, onEditVariables, streamEndpoint, } = props;
    const prettify = usePrettify();
    const mergeQuery = useMergeQuery();
    const copyQuery = useCopyQuery();
    const schemaContext = useSchemaContext({ nonNull: true });
    useGraphQLChangeStream(props, schemaContext.introspect, streamEndpoint);
    return (_jsxs("div", { className: "graphiql-container", style: {
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
        }, children: [_jsx("div", { style: {
                    display: "flex",
                    flex: "1 1 100%",
                    overflow: "hidden",
                    position: "relative",
                }, children: _jsxs(GraphiQLInterface, { editorTheme: editorTheme ?? "graphiql", onEditQuery: onEditQuery, onEditVariables: onEditVariables, children: [_jsx(GraphiQL.Logo, { children: _jsx("a", { href: "https://grafast.org/ruru", style: { textDecoration: "none" }, target: "_blank", rel: "noreferrer", children: "Ruru" }) }), _jsxs(GraphiQL.Toolbar, { children: [_jsx(ToolbarButton, { onClick: prettify, label: "Prettify Query (Shift-Ctrl-P)", children: _jsx(PrettifyIcon, { className: "graphiql-toolbar-icon", "aria-hidden": "true" }) }), _jsx(ToolbarButton, { onSelect: mergeQuery, label: "Merge Query (Shift-Ctrl-M)", children: _jsx(MergeIcon, { className: "graphiql-toolbar-icon", "aria-hidden": "true" }) }), _jsx(ToolbarButton, { onClick: copyQuery, label: "Copy query (Shift-Ctrl-C)", children: _jsx(CopyIcon, { className: "graphiql-toolbar-icon", "aria-hidden": "true" }) }), _jsxs(ToolbarMenu, { label: "Options", button: _jsx(ToolbarButton, { label: "Options", children: _jsx(SettingsIcon, { className: "graphiql-toolbar-icon", "aria-hidden": "true" }) }), children: [_jsx(ToolbarMenu.Item, { title: "View the SQL statements that this query invokes", onSelect: () => storage.toggle("explain"), children: _jsxs("span", { children: [storage.get("explain") === "true" ? check : nocheck, "Explain (if supported)"] }) }), _jsx(ToolbarMenu.Item, { title: "Don't hide explain from results", onSelect: () => storage.toggle("verbose"), children: _jsxs("span", { children: [storage.get("verbose") === "true" ? check : nocheck, "Verbose"] }) }), _jsx(ToolbarMenu.Item, { title: "Should we persist the headers to localStorage? Header editor is next to variable editor at the bottom.", onSelect: () => storage.toggle("saveHeaders"), children: _jsxs("span", { children: [storage.get("saveHeaders") === "true" ? check : nocheck, "Save headers"] }) })] })] }), _jsx(GraphiQL.Footer, { children: _jsx(RuruFooter, {}) })] }) }), error ? (_jsx(ErrorPopup, { error: error, onClose: () => setError(null) })) : null] }));
};
//# sourceMappingURL=ruru.js.map