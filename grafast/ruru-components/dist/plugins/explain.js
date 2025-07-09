import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MagnifyingGlassIcon } from "@graphiql/react";
import { useContext } from "react";
import { Explain } from "../components/Explain.js";
import { ExplainContext } from "../hooks/useExplain.js";
const ExplainPanel = () => {
    const { explainHelpers, explain, explainResults, setExplain } = useContext(ExplainContext);
    return (_jsxs("div", { children: [_jsx("div", { className: "graphiql-doc-explorer-header", children: _jsx("div", { className: "graphiql-doc-explorer-title", children: "Explain" }) }), _jsx("div", { className: "graphiql-doc-explorer-content", children: _jsx(Explain, { explain: explain, setExplain: setExplain, helpers: explainHelpers, results: explainResults }) })] }));
};
export const EXPLAIN_PLUGIN = {
    title: "Explain",
    icon: MagnifyingGlassIcon,
    content: ExplainPanel,
};
//# sourceMappingURL=explain.js.map