import { useCallback, useState } from "react";

import type { GraphileInspectStorage } from "./useStorage.js";

export interface ExplainHelpers {
  showExplain: boolean;
  explainSize: number;
  explainAtBottom: boolean;
  setExplainSize: (newSize: number) => void;
  setExplainAtBottom: (atBottom: boolean) => void;
  setShowExplain: (newShow: boolean) => void;
}

export const useExplain = (storage: GraphileInspectStorage): ExplainHelpers => {
  const [showExplain, _setShowExplain] = useState(
    storage.get("explainIsOpen") === "true",
  );
  const [explainSize, setExplainSize] = useState(300);
  const [explainAtBottom, _setExplainAtBottom] = useState(
    [null, "true"].includes(storage.get("explainAtBottom")),
  );
  const setShowExplain = useCallback(
    (nextShowExplain: boolean) => {
      _setShowExplain(nextShowExplain);
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
  return {
    showExplain,
    explainSize,
    explainAtBottom,
    setExplainSize,
    setExplainAtBottom,
    setShowExplain,
  };
};
