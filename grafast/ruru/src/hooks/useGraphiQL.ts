import type { GraphiQL } from "graphiql";
import { useCallback, useRef, useState } from "react";

import type { RuruProps } from "../interfaces.js";

function up(i: number) {
  return i + 1;
}

export const useGraphiQL = (_props: RuruProps) => {
  const graphiqlRef = useRef<GraphiQL | null>(null);
  const graphiql = graphiqlRef.current;
  const [, bump] = useState(0);
  const onToggleDocs = useCallback(() => {
    graphiql?.handleToggleDocs();
    setTimeout(() => {
      bump(up);
    }, 100);
  }, [graphiql]);
  const onToggleHistory = useCallback(() => {
    graphiql?.handleToggleHistory();
    setTimeout(() => {
      bump(up);
    }, 100);
  }, [graphiql]);
  return { graphiqlRef, graphiql, onToggleDocs, onToggleHistory };
};
