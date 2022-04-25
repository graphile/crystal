import type { GraphiQL } from "graphiql";
import { useCallback, useState } from "react";

import type { GraphileInspectStorage } from "./useStorage.js";

function noop() {}

export const useExplorer = (
  graphiql: GraphiQL | null,
  storage: GraphileInspectStorage,
) => {
  const onRunOperation = graphiql?.handleRunQuery ?? noop;
  const [explorerIsOpen, setExplorerIsOpen] = useState(
    [null, "true"].includes(storage.get("explorerIsOpen")),
  );
  const onToggleExplorer = useCallback(() => {
    const nowOpen = !explorerIsOpen;
    setExplorerIsOpen(nowOpen);
    storage.set("explorerIsOpen", nowOpen ? "true" : "");
  }, [storage, explorerIsOpen]);
  return { onRunOperation, explorerIsOpen, onToggleExplorer };
};
