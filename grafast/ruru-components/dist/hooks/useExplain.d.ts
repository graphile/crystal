import type { ExplainResults } from "./useFetcher.js";
import type { RuruStorage } from "./useStorage.js";
export interface ExplainHelpers {
    showExplain: boolean;
    explainSize: number;
    explainAtBottom: boolean;
    setExplainSize: (newSize: number) => void;
    setExplainAtBottom: (atBottom: boolean) => void;
    setShowExplain: (newShow: boolean) => void;
}
export declare const ExplainContext: import("react").Context<{
    explainHelpers: ExplainHelpers;
    explain: boolean;
    setExplain: (newExplain: boolean) => void;
    explainResults: ExplainResults | null;
}>;
export declare const useExplain: (storage: RuruStorage) => ExplainHelpers;
//# sourceMappingURL=useExplain.d.ts.map