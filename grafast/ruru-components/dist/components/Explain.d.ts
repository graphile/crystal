import type { FC } from "react";
import type { ExplainHelpers } from "../hooks/useExplain.js";
import type { ExplainResults } from "../hooks/useFetcher.js";
declare global {
    interface Window {
        mermaid?: any;
    }
}
export declare const Explain: FC<{
    explain: boolean;
    setExplain: (newExplain: boolean) => void;
    helpers: ExplainHelpers;
    results: ExplainResults | null;
}>;
export declare const ExplainMain: FC<{
    helpers: ExplainHelpers;
    results: ExplainResults;
}>;
//# sourceMappingURL=Explain.d.ts.map