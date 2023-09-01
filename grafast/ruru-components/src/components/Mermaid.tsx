import { planToMermaid, GrafastPlanJSON } from "grafast/mermaid";
import type { FC } from "react";
import { useEffect, useMemo } from "react";

let initialized = false;

export const Mermaid: FC<{ plan: GrafastPlanJSON }> = ({ plan }) => {
  const diagram = useMemo(() => planToMermaid(plan), [plan]);
  useEffect(() => {
    if (window.mermaid) {
      if (!initialized) {
        initialized = true;
        window.mermaid.initialize({
          startOnLoad: true,
          maxTextSize: 1000000,
        });
      }
      if (diagram) {
        window.mermaid.contentLoaded();
      }
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
