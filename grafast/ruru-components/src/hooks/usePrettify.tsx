import { KEY_MAP, useGraphiQL, useGraphiQLActions } from "@graphiql/react";
import type { Plugin } from "prettier";
import type * as PrettierStandalone from "prettier/standalone";
import { useCallback, useEffect, useRef } from "react";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

declare global {
  interface Window {
    prettier: any;
    prettierPlugins: any;
  }
}

/**
 * Prettifies with 'prettier' if available, otherwise using GraphiQL's built in
 * prettify.
 */
export const usePrettify = () => {
  const queryEditor = useGraphiQL((s) => s.queryEditor);
  const { prettifyEditors: fallbackPrettify } = useGraphiQLActions();
  const prettierRef = useRef({
    loaded: false as boolean | Promise<void>,
    prettier: null as null | typeof PrettierStandalone,
    prettierPlugins: [] as Plugin[],
  });
  const actualPrettify = useCallback(async () => {
    const { prettier, prettierPlugins } = prettierRef.current;
    if (!prettier || !prettierPlugins || !queryEditor) {
      fallbackPrettify();
    } else {
      const queryText = queryEditor.getValue();
      if (queryText != null) {
        const position = queryEditor.getPosition();
        const model = queryEditor.getModel();
        const cursorOffset =
          position && model ? model.getOffsetAt(position) : undefined;
        const result = await prettier.formatWithCursor(queryText, {
          parser: "graphql",
          plugins: prettierPlugins,
          cursorOffset: cursorOffset ?? 0,
        });
        queryEditor?.setValue(result.formatted);
        if (model && result.cursorOffset > 0) {
          queryEditor.setPosition(model.getPositionAt(result.cursorOffset));
        }
      }
    }
  }, [fallbackPrettify, queryEditor]);
  const prettify = useCallback(() => {
    if (prettierRef.current.loaded === false) {
      const promise = (async () => {
        const [prettier, estree, graphql] = await Promise.all([
          import("prettier/standalone"),
          import("prettier/plugins/estree"),
          import("prettier/plugins/graphql"),
        ]);
        prettierRef.current.prettier = prettier;
        prettierRef.current.prettierPlugins = [estree as Plugin, graphql];
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
