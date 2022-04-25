import type { GraphiQL } from "graphiql";
import { useCallback, useRef, useState } from "react";

import type { GraphileInspectProps } from "../interfaces.js";

function up(i: number) {
  return i + 1;
}

export const useGraphiQL = (_props: GraphileInspectProps) => {
  const graphiqlRef = useRef<GraphiQL | null>(null);
  const graphiql = graphiqlRef.current;
  const [, bump] = useState(0);
  const onToggleDocs = useCallback(() => {
    graphiql?.handleToggleDocs();
    setTimeout(() => {
      bump(up);
    }, 0);
  }, [graphiql]);
  const onToggleHistory = useCallback(() => {
    graphiql?.handleToggleHistory();
    setTimeout(() => {
      bump(up);
    }, 0);
  }, [graphiql]);
  return { graphiqlRef, graphiql, onToggleDocs, onToggleHistory };
};
