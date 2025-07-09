import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useRef } from "react";
export const Copy = ({ text: rawText, json, children }) => {
    const text = useMemo(() => rawText ?? (json !== undefined ? JSON.stringify(json) : undefined), [rawText, json]);
    const ref = useRef(null);
    const copy = useCallback(() => {
        const el = ref.current;
        if (el) {
            /* Select the text field */
            el.select();
            el.setSelectionRange(0, 99999); /* For mobile devices */
            /* Copy the text inside the text field */
            navigator.clipboard.writeText(el.value);
        }
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx("textarea", { ref: (el) => {
                    ref.current = el;
                }, value: text, readOnly: true, style: { display: "none" } }), _jsx("button", { onClick: copy, children: children })] }));
};
//# sourceMappingURL=Copy.js.map