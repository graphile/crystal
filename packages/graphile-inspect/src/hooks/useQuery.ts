import { useState } from "react";
import { defaultQuery } from "../defaultQuery.js";
import { GraphileInspectProps } from "../interfaces.js";
import { GraphileInspectStorage } from "./useStorage.js";

export const useQuery = (
  props: GraphileInspectProps,
  storage: GraphileInspectStorage,
): [string | null, React.Dispatch<React.SetStateAction<string | null>>] => {
  const [query, setQuery] = useState<string | null>(
    storage.get("query") ?? defaultQuery,
  );
  return [query, setQuery];
};
