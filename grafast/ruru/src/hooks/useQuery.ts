import { useState } from "react";

import { defaultQuery } from "../defaultQuery.js";
import type { RuruProps } from "../interfaces.js";
import type { RuruStorage } from "./useStorage.js";

export const useQuery = (
  props: RuruProps,
  storage: RuruStorage,
): [string | null, React.Dispatch<React.SetStateAction<string | null>>] => {
  const [query, setQuery] = useState<string | null>(
    storage.get("query") ?? defaultQuery,
  );
  return [query, setQuery];
};
