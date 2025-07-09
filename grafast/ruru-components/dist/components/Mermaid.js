import { jsx as _jsx } from "react/jsx-runtime";
import { planToMermaid } from "grafast/mermaid";
import { useEffect, useMemo } from "react";
let initialized = false;
export const Mermaid = ({ plan }) => {
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
        return (_jsx("div", { className: "mermaid", children: diagram }, diagram));
    }
    else {
        return (_jsx("div", { children: "Mermaid hasn't (yet) loaded, so we cannot render plan diagrams" }));
    }
};
//# sourceMappingURL=Mermaid.js.map