import { planToMermaid, GrafastPlanJSON } from "grafast/mermaid";
import mermaid from "mermaid";
import type { FC } from "react";
import { useEffect, useMemo } from "react";

mermaid.initialize({
  startOnLoad: true,
  maxTextSize: 1000000,
});

export const Mermaid: FC<{ plan: GrafastPlanJSON }> = ({ plan }) => {
  const diagram = useMemo(() => planToMermaid(plan), [plan]);
  useEffect(() => {
    if (diagram) {
      mermaid.contentLoaded();
    }
  }, [diagram]);
  if (window.mermaid) {
    return (
      <div className="mermaid" key={diagram}>
        {diagram}
      </div>
    );
  } else {
    return (
      <div>Mermaid hasn't (yet) loaded, so we cannot render plan diagrams</div>
    );
  }
};
