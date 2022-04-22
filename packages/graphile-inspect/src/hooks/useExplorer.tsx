import GraphiQL from "graphiql";
import { useCallback, useState } from "react";

function noop() {}

export const useExplorer = (graphiql: GraphiQL | null) => {
  const onRunOperation = graphiql?.handleRunQuery ?? noop;
  const [explorerIsOpen, setExplorerIsOpen] = useState(true);
  const onToggleExplorer = useCallback(
    () => setExplorerIsOpen((open) => !open),
    [],
  );
  return { onRunOperation, explorerIsOpen, onToggleExplorer };
};
