import { createContext, useCallback, useState } from "react";
export const ExplainContext = createContext({
    explainHelpers: {
        showExplain: false,
        explainSize: 0,
        explainAtBottom: true,
        setExplainSize: () => { },
        setExplainAtBottom: () => { },
        setShowExplain: () => { },
    },
    explain: true,
    setExplain: () => { },
    explainResults: null,
});
export const useExplain = (storage) => {
    const [showExplain, _setShowExplain] = useState(storage.get("explainIsOpen") === "true");
    const [explainSize, _setExplainSize] = useState(parseInt(storage.get("explainSize") ?? "", 10) || 300);
    const [explainAtBottom, _setExplainAtBottom] = useState([null, "true"].includes(storage.get("explainAtBottom")));
    const setShowExplain = useCallback((nextShowExplain) => {
        _setShowExplain(nextShowExplain);
        if (nextShowExplain) {
            storage.set("explain", "true");
        }
        storage.set("explainIsOpen", nextShowExplain ? "true" : "");
    }, [storage]);
    const setExplainAtBottom = useCallback((nextAtBottom) => {
        _setExplainAtBottom(nextAtBottom);
        storage.set("explainAtBottom", nextAtBottom ? "true" : "");
    }, [storage]);
    const setExplainSize = useCallback((nextSize) => {
        _setExplainSize(nextSize);
        storage.set("explainSize", String(nextSize));
    }, [storage]);
    return {
        showExplain,
        explainSize,
        explainAtBottom,
        setExplainSize,
        setExplainAtBottom,
        setShowExplain,
    };
};
//# sourceMappingURL=useExplain.js.map