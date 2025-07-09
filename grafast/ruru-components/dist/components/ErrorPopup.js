import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// TODO: this needs proper design and accessibility considerations
export const ErrorPopup = ({ error, onClose, }) => (_jsxs("div", { className: "errorPopup", children: [_jsx("button", { className: "errorPopupClose", onClick: onClose, children: "\uD83D\uDDD9" }), _jsx("div", { className: "errorPopupError", children: String(error) })] }));
//# sourceMappingURL=ErrorPopup.js.map