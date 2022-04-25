import { GraphiQL } from "graphiql";
import { useRef } from "react";
import { GraphileInspectProps } from "../interfaces.js";

export const useGraphiQL = (props: GraphileInspectProps) => {
  const graphiqlRef = useRef<GraphiQL | null>(null);
  const graphiql = graphiqlRef.current;
  return { graphiqlRef, graphiql };
};
