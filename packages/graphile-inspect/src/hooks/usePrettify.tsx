import type { GraphiQL } from "graphiql";
import { useCallback } from "react";

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
export const usePrettify = (
  graphiqlRef: React.MutableRefObject<GraphiQL | null>,
) => {
  return useCallback(() => {
    const graphiql = graphiqlRef.current;
    if (!graphiql) {
      return;
    }
    const editor = graphiql.getQueryEditor();
    if (
      editor &&
      typeof window.prettier !== "undefined" &&
      typeof window.prettierPlugins !== "undefined"
    ) {
      // TODO: window.prettier.formatWithCursor
      editor.setValue(
        window.prettier.format(editor.getValue(), {
          parser: "graphql",
          plugins: window.prettierPlugins,
        }),
      );
    } else {
      return graphiql.handlePrettifyQuery();
    }
  }, [graphiqlRef]);
};
