import type { GrafastPlanJSON } from "grafast";
import type { FC } from "react";
import { lazy, Suspense } from "react";
const MermaidReal = lazy(() => import("./MermaidReal.js"));

export const Mermaid: FC<{ plan: GrafastPlanJSON }> = ({ plan }) => {
  return (
    <Suspense
      fallback={
        <div>
          Mermaid hasn&apos;t (yet) loaded, so we cannot render plan diagrams
        </div>
      }
    >
      <MermaidReal plan={plan} />
    </Suspense>
  );
};
