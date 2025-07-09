import { KEY_MAP, useGraphiQL, useGraphiQLActions } from "@graphiql/react";
import type { Plugin } from "prettier";
import type * as PrettierStandalone from "prettier/standalone";
import { useCallback, useEffect, useRef } from "react";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Prettifies with 'prettier' if available, otherwise using GraphiQL's built in
 * prettify.
 */
export const usePrettify = () => {
  const { queryEditor, variableEditor, headerEditor } = useGraphiQL(
    ({ queryEditor, variableEditor, headerEditor }) => ({
      queryEditor,
      variableEditor,
      headerEditor,
    }),
  );
  const { prettifyEditors: fallbackPrettify } = useGraphiQLActions();
  const prettierRef = useRef({
    loaded: false as boolean | Promise<void>,
    prettier: null as null | typeof PrettierStandalone,
    plugins: [] as Plugin[],
  });
  const actualPrettify = useCallback(async () => {
    const { prettier, plugins } = prettierRef.current;
    if (
      !prettier ||
      !plugins ||
      !queryEditor ||
      !variableEditor ||
      !headerEditor
    ) {
      fallbackPrettify();
    } else {
      for (const editor of [queryEditor, variableEditor, headerEditor]) {
        const editorText = editor.getValue();
        if (editorText != null) {
          const position = editor.getPosition();
          const model = editor.getModel();
          const cursorOffset =
            position && model ? (model.getOffsetAt(position) ?? 0) : 0;
          const parser =
            editor === queryEditor
              ? "graphql"
              : editor === variableEditor || editor === headerEditor
                ? "jsonc"
                : "json";
          const result = await prettier.formatWithCursor(editorText, {
            parser,
            plugins,
            cursorOffset,
          });
          editor.setValue(result.formatted);
          if (model && result.cursorOffset > 0) {
            editor.setPosition(model.getPositionAt(result.cursorOffset));
          }
        }
      }
    }
  }, [fallbackPrettify, headerEditor, queryEditor, variableEditor]);
  const prettify = useCallback(() => {
    if (prettierRef.current.loaded === false) {
      const promise = (async () => {
        const [prettier, estree, babel, graphql] = await Promise.all([
          import("prettier/standalone"),
          import("prettier/plugins/estree"),
          import("prettier/plugins/babel"),
          import("prettier/plugins/graphql"),
        ]);
        prettierRef.current.prettier = prettier;
        prettierRef.current.plugins = [estree.default, babel, graphql];
        prettierRef.current.loaded = true;
      })();
      prettierRef.current.loaded = promise;
      // Wait up to 2 seconds for Prettier to load; failing that fall back to normal prettify
      Promise.race([promise, sleep(2000)])
        .catch(() => {})
        .then(actualPrettify);
    } else {
      actualPrettify();
    }
  }, [actualPrettify]);
  useEffect(() => {
    // const action = queryEditor?.getAction('graphql-prettify')
    // Override existing action
    const disposable = queryEditor?.addAction({
      id: "graphql-prettify",
      label: "Prettify Editors",
      contextMenuGroupId: "graphql",
      keybindings: KEY_MAP.prettify.keybindings,
      run: prettify,
    });
    return () => disposable?.dispose();
  }, [prettify, queryEditor]);
  return prettify;
};
