import { useState } from "react";
import { defaultQuery } from "../defaultQuery";
import { GraphileInspectProps } from "../interfaces";
import { GraphileInspectStorage } from "./useStorage";

export const useQuery = (
  props: GraphileInspectProps,
  storage: GraphileInspectStorage,
) => {
  const [query, setQuery] = useState<string | null>(
    storage.get("query") ?? defaultQuery,
  );
  return [query, setQuery];
};
