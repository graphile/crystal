import { useState } from "react";

export interface ExplainDetails {
  showExplain: boolean;
  explainSize: number;
  explainAtBottom: boolean;
  setExplainSize: (newSize: number) => void;
  setExplainAtBottom: (atBottom: boolean) => void;
}

export const useExplain = (): ExplainDetails => {
  const [showExplain, setShowExplain] = useState(true);
  const [explainSize, setExplainSize] = useState(300);
  const [explainAtBottom, setExplainAtBottom] = useState(false);
  return {
    showExplain,
    explainSize,
    explainAtBottom,
    setExplainSize,
    setExplainAtBottom,
  };
};
