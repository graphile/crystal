"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoNested = void 0;
exports.hasExportableParent = hasExportableParent;
const common_js_1 = require("./common.js");
exports.NoNested = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Looks for nested EXPORTABLE calls and suggests removing them",
            recommended: true,
            url: "TODO",
        },
        fixable: "code",
        hasSuggestions: true,
        schema: [
            {
                type: "object",
                additionalProperties: false,
                disableAutofix: false,
                properties: {
                    disableAutofix: {
                        type: "boolean",
                    },
                    methods: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                    },
                },
            },
        ],
    },
    create(context) {
        const disableAutofix = context.options?.[0]?.disableAutofix ?? false;
        const options = {
            disableAutofix,
        };
        return {
            CallExpression(node) {
                if (isExportableCall(node)) {
                    if (hasExportableParent(node)) {
                        const callback = node.arguments[0];
                        if (callback.type === "ArrowFunctionExpression") {
                            const body = callback.body;
                            (0, common_js_1.reportProblem)(context, options, {
                                node: node,
                                message: "Nested EXPORTABLE found",
                                suggest: [
                                    {
                                        desc: "remove exportable",
                                        fix(fixer) {
                                            return [
                                                fixer.replaceTextRange([node.range[0], body.range[0]], ""),
                                                fixer.replaceTextRange([body.range[1], node.range[1]], ""),
                                            ];
                                        },
                                    },
                                ],
                            });
                        }
                    }
                }
            },
        };
    },
};
function hasExportableParent(node) {
    let parent = node;
    while ((parent = parent.parent)) {
        if (isExportableCall(parent)) {
            return true;
        }
    }
    return false;
}
function isExportableCall(node) {
    return (node.type === "CallExpression" &&
        node.callee.type === "Identifier" &&
        node.callee.name === "EXPORTABLE");
}
//# sourceMappingURL=NoNested.js.map