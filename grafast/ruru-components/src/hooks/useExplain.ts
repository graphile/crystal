import { createContext, useCallback, useState } from "react";

import type { ExplainResults } from "./useFetcher.ts";
import type { RuruStorage } from "./useStorage.ts";

export interface ExplainHelpers {
  showExplain: boolean;
  explainSize: number;
  explainAtBottom: boolean;
  setExplainSize: (newSize: number) => void;
  setExplainAtBottom: (atBottom: boolean) => void;
  setShowExplain: (newShow: boolean) => void;
}

export const ExplainContext = createContext<{
  explainHelpers: ExplainHelpers;
  explain: boolean;
  setExplain: (newExplain: boolean) => void;
  explainResults: ExplainResults | null;
}>({
  explainHelpers: {
    showExplain: false,
    explainSize: 0,
    explainAtBottom: true,
    setExplainSize: () => {},
    setExplainAtBottom: () => {},
    setShowExplain: () => {},
  },
  explain: true,
  setExplain: () => {},
  explainResults: null,
});

export const useExplain = (storage: RuruStorage): ExplainHelpers => {
  const [showExplain, _setShowExplain] = useState(
    storage.get("explainIsOpen") === "true",
  );
  const [explainSize, _setExplainSize] = useState(
    parseInt(storage.get("explainSize") ?? "", 10) || 300,
  );
  const [explainAtBottom, _setExplainAtBottom] = useState(
    [null, "true"].includes(storage.get("explainAtBottom")),
  );
  const setShowExplain = useCallback(
    (nextShowExplain: boolean) => {
      _setShowExplain(nextShowExplain);
      if (nextShowExplain) {
        storage.set("explain", "true");
      }
      storage.set("explainIsOpen", nextShowExplain ? "true" : "");
    },
    [storage],
  );
  const setExplainAtBottom = useCallback(
    (nextAtBottom: boolean) => {
      _setExplainAtBottom(nextAtBottom);
      storage.set("explainAtBottom", nextAtBottom ? "true" : "");
    },
    [storage],
  );
  const setExplainSize = useCallback(
    (nextSize: number) => {
      _setExplainSize(nextSize);
      storage.set("explainSize", String(nextSize));
    },
    [storage],
  );
  return {
    showExplain,
    explainSize,
    explainAtBottom,
    setExplainSize,
    setExplainAtBottom,
    setShowExplain,
  };
};
