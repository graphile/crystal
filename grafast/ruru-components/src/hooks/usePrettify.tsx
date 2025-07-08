import { useGraphiQL, useGraphiQLActions } from "@graphiql/react";
import type { Plugin } from "prettier";
import type * as PrettierStandalone from "prettier/standalone";
import { useCallback, useEffect, useRef } from "react";

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
  const prettify = useCallback(async () => {
    const { prettier, prettierPlugins } = prettierRef.current;
    if (!prettier || !prettierPlugins) {
      fallbackPrettify();
    } else {
      const queryText = queryEditor?.getValue();
      if (queryText != null) {
        queryEditor?.setValue(
          // TODO: prettier.formatWithCursor
          await prettier.format(queryText, {
            parser: "graphql",
            plugins: prettierPlugins,
          }),
        );
      }
    }
  }, [fallbackPrettify, queryEditor]);
  return useCallback(() => {
    if (prettierRef.current.loaded === false) {
      prettierRef.current.loaded = (async () => {
        const [prettier, estree, graphql] = await Promise.all([
          import("prettier/standalone"),
          import("prettier/plugins/estree"),
          import("prettier/plugins/graphql"),
        ]);
        prettierRef.current.prettier = prettier;
        prettierRef.current.prettierPlugins = [estree as Plugin, graphql];
        prettierRef.current.loaded = true;
        prettify();
      })();
    }
    prettify();
  }, [prettify]);
};
