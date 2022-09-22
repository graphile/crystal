import {
  useEditorContext,
  usePrettifyEditors as usePrettifyQuery,
} from "@graphiql/react";
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
export const usePrettify = () => {
  const editorContext = useEditorContext();
  const fallbackPrettify = usePrettifyQuery();
  return useCallback(() => {
    const queryEditor = editorContext?.queryEditor;
    if (!queryEditor) {
      return;
    }
    if (
      queryEditor &&
      typeof window.prettier !== "undefined" &&
      typeof window.prettierPlugins !== "undefined"
    ) {
      // TODO: window.prettier.formatWithCursor
      queryEditor.setValue(
        window.prettier.format(queryEditor.getValue(), {
          parser: "graphql",
          plugins: window.prettierPlugins,
        }),
      );
    } else {
      fallbackPrettify();
    }
  }, []);
};
