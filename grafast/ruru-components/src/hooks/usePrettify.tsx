import { useEditorState, useGraphiQLActions } from "@graphiql/react";
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
export const usePrettify = () => {
  const [queryText, setQueryText] = useEditorState("query");
  const { prettifyEditors: fallbackPrettify } = useGraphiQLActions();
  return useCallback(() => {
    if (
      typeof window.prettier !== "undefined" &&
      typeof window.prettierPlugins !== "undefined"
    ) {
      // TODO: window.prettier.formatWithCursor
      setQueryText(
        window.prettier.format(queryText, {
          parser: "graphql",
          plugins: window.prettierPlugins,
        }),
      );
    } else {
      fallbackPrettify();
    }
  }, [fallbackPrettify]);
};
