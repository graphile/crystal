import type { Editor as CodeMirrorEditor, Position } from "codemirror";
import type { GraphiQL } from "graphiql";
import { parse } from "graphql";
import { useCallback, useEffect, useRef } from "react";

import type { GraphileInspectProps } from "../interfaces.js";

export const useExtraKeys = (
  props: GraphileInspectProps,
  graphiql: GraphiQL | null,
  query: string | null,
) => {
  const editor = graphiql?.getQueryEditor();

  const handleInspectOperation = useCallback(
    (cm: CodeMirrorEditor, mousePos: Position) => {
      const parsedQuery = parse(query || "");

      if (!parsedQuery) {
        console.error("Couldn't parse query document");
        return null;
      }

      const token = cm.getTokenAt(mousePos);
      const start = { line: mousePos.line, ch: token.start };
      const end = { line: mousePos.line, ch: token.end };
      const relevantMousePos = {
        start: cm.indexFromPos(start),
        end: cm.indexFromPos(end),
      };

      const position = relevantMousePos;

      const def = parsedQuery.definitions.find((definition) => {
        if (!definition.loc) {
          console.log("Missing location information for definition");
          return false;
        }

        const { start, end } = definition.loc;
        return start <= position.start && end >= position.end;
      });

      if (!def) {
        console.error(
          "Unable to find definition corresponding to mouse position",
        );
        return null;
      }

      const operationKind =
        def.kind === "OperationDefinition"
          ? def.operation
          : def.kind === "FragmentDefinition"
          ? "fragment"
          : "unknown";

      const operationName =
        def.kind === "OperationDefinition" && !!def.name
          ? def.name.value
          : def.kind === "FragmentDefinition" && !!def.name
          ? def.name.value
          : "unknown";

      const selector = `.graphiql-explorer-root #${operationKind}-${operationName}`;

      const el = document.querySelector(selector);
      if (el) {
        el.scrollIntoView();
      }
    },
    [query],
  );

  useEffect(() => {
    if (editor) {
      editor.setOption("extraKeys", {
        ...((editor as any).options.extraKeys || {}),
        "Shift-Alt-LeftClick": handleInspectOperation,
      });
    }
  }, [editor, handleInspectOperation]);
};
