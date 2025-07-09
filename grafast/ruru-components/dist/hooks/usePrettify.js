import { useEditorContext, usePrettifyEditors } from "@graphiql/react";
import { useCallback } from "react";
/**
 * Prettifies with 'prettier' if available, otherwise using GraphiQL's built in
 * prettify.
 */
export const usePrettify = () => {
    const editorContext = useEditorContext();
    const fallbackPrettify = usePrettifyEditors();
    return useCallback(() => {
        const queryEditor = editorContext?.queryEditor;
        if (!queryEditor) {
            return;
        }
        if (queryEditor &&
            typeof window.prettier !== "undefined" &&
            typeof window.prettierPlugins !== "undefined") {
            // TODO: window.prettier.formatWithCursor
            queryEditor.setValue(window.prettier.format(queryEditor.getValue(), {
                parser: "graphql",
                plugins: window.prettierPlugins,
            }));
        }
        else {
            fallbackPrettify();
        }
    }, [editorContext?.queryEditor, fallbackPrettify]);
};
//# sourceMappingURL=usePrettify.js.map