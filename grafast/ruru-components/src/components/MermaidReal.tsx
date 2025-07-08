import type { GrafastPlanJSON } from "grafast/mermaid";
import { planToMermaid } from "grafast/mermaid";
import mermaid from "mermaid";
import type { FC } from "react";
import { useEffect, useMemo } from "react";

let initialized = false;

const MermaidReal: FC<{ plan: GrafastPlanJSON }> = ({ plan }) => {
  const diagram = useMemo(() => planToMermaid(plan), [plan]);
  useEffect(() => {
    if (mermaid) {
      if (!initialized) {
        initialized = true;
        mermaid.initialize({
          startOnLoad: true,
          maxTextSize: 1000000,
          maxEdges: 1000,
        });
      }
      if (diagram) {
        mermaid.contentLoaded();
      }
    }
  }, [diagram]);
  return (
    <div className="mermaid" key={diagram}>
      {diagram}
    </div>
  );
};

export default MermaidReal;
