import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { planToMermaid } from "grafast/mermaid";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Copy } from "./Copy.js";
import { FormatSQL } from "./FormatSQL.js";
import { Mermaid } from "./Mermaid.js";
export const Explain = ({ explain, setExplain, helpers, results }) => {
    return (_jsx(_Fragment, { children: !results ? (!explain ? (_jsxs(_Fragment, { children: [_jsx("p", { children: "WARNING: you've not enabled the 'explain' functionality" }), _jsx("p", { children: _jsx("button", { onClick: () => setExplain(true), children: "Enable explain" }) })] })) : (_jsx("p", { children: "There are no explain results to display - perhaps you have not yet ran an operation against a server that supports this feature?" }))) : results.operations.length === 0 ? (_jsx("p", { children: "Empty explain results" })) : (_jsx("div", { children: _jsx(ExplainMain, { helpers: helpers, results: results }) })) }));
};
export const ExplainMain = ({ results }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    useEffect(() => {
        setSelectedIndex(0);
    }, [results]);
    const selectedResult = results.operations[selectedIndex];
    const [expanded, setExpanded] = useState(false);
    const expand = useCallback(() => {
        setExpanded(true);
    }, []);
    const nodeRef = useRef();
    if (!nodeRef.current) {
        nodeRef.current = document.createElement("div");
    }
    const node = nodeRef.current;
    useEffect(() => {
        document.body.appendChild(node);
        return () => {
            document.body.removeChild(node);
        };
    }, [node]);
    const [saving, setSaving] = useState(false);
    const saveSVG = useCallback(() => {
        if (!selectedResult || selectedResult.type !== "plan")
            return;
        setSaving(true);
        setTimeout(() => {
            if (window.mermaid) {
                const diagram = planToMermaid(selectedResult.plan);
                window.mermaid.mermaidAPI
                    .render("id1", diagram)
                    .then(({ svg }) => {
                    const file = new File([svg.replace(/<br>/g, "<br/>")], "grafast-plan.svg");
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(file);
                    a.download = file.name;
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click();
                    setSaving(false);
                    setTimeout(() => {
                        URL.revokeObjectURL(a.href);
                        a.parentNode.removeChild(a);
                    }, 0);
                });
            }
            else {
                alert("Mermaid hasn't loaded (yet)");
            }
        }, 0);
    }, [selectedResult]);
    const component = (() => {
        switch (selectedResult?.type) {
            case "sql": {
                return (_jsxs("div", { children: [selectedResult.explain ? (_jsxs(_Fragment, { children: [_jsxs("h4", { children: ["Result from SQL", " ", _jsx("a", { href: "https://www.postgresql.org/docs/current/sql-explain.html", children: "EXPLAIN" }), " ", "on executed query:"] }), _jsx("pre", { className: "explain-plan", children: _jsx("code", { children: selectedResult.explain }) }), _jsx(Copy, { text: selectedResult.explain, children: "Copy plan" })] })) : null, _jsx("h4", { children: "Executed SQL query:" }), _jsx(FormatSQL, { sql: selectedResult.query }), _jsx(Copy, { text: selectedResult.query, children: "Copy SQL" })] }));
            }
            case "plan": {
                return (_jsxs(_Fragment, { children: [_jsx(Copy, { json: selectedResult.plan, children: "Copy plan JSON" }), _jsx("button", { onClick: saveSVG, disabled: saving, children: "Save Mermaid Diagram" }), _jsx("div", { onClick: expand, children: _jsx(Mermaid, { plan: selectedResult.plan }) }), expanded
                            ? createPortal(_jsxs("div", { className: "explainExpandedContainer", children: [_jsx("div", { className: "explainExpandedTitle", children: "Operation Plan" }), _jsx("div", { className: "explainExpandedCloseContainer", children: _jsx("button", { className: "explainExpandedCloseButton", onClick: () => setExpanded(false), children: "\u00D7" }) }), _jsx("div", { className: "explainExpandedMain", children: _jsx(Mermaid, { plan: selectedResult.plan }) })] }), node)
                            : null] }));
            }
            case undefined: {
                return (_jsxs("div", { children: ["Explain result type '$", selectedResult.type, "' not yet supported."] }));
            }
            default: {
                return _jsx("div", {});
            }
        }
    })();
    return (_jsxs("div", { children: [_jsx("select", { value: String(selectedIndex), onChange: (e) => setSelectedIndex(parseInt(e.target.value, 10)), children: results.operations.map((o, i) => (_jsx("option", { value: String(i), children: o.title }, i))) }), component] }));
};
//# sourceMappingURL=Explain.js.map