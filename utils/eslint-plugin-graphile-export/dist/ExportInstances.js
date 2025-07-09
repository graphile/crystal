"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportInstances = void 0;
const common_js_1 = require("./common.js");
const NoNested_js_1 = require("./NoNested.js");
const KNOWN_IMPORTS = [
    ["@dataplan/pg", "PgResource"],
    ["@dataplan/pg", "PgExecutor"],
    ["@dataplan/pg", "recordCodec"],
    ["@dataplan/pg", "makeRegistry"],
    ["@dataplan/pg", "makeRegistryBuilder"],
];
exports.ExportInstances = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Looks for 'plan' method on something that looks like a GraphQL definition and ensures it's exportable.",
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
                },
            },
        ],
    },
    create(context) {
        const disableAutofix = context.options?.[0]?.disableAutofix ?? false;
        // const scopeManager = context.getSourceCode().scopeManager;
        const options = {
            disableAutofix,
        };
        function process(node) {
            if (node.type === "NewExpression" || node.type === "CallExpression") {
                const callee = node.callee;
                const calleeIdentifier = callee.type === "Identifier" ? callee : null;
                if (!calleeIdentifier) {
                    return;
                }
                const constructorName = calleeIdentifier?.name;
                const possibles = KNOWN_IMPORTS.filter((tuple) => tuple[1] === constructorName);
                if (possibles.length === 0) {
                    return;
                }
                // TODO: determine if the definition for this `callee` identifier is an import from any of these `possibles` (and if not, `return;`).
                //const scope = scopeManager.acquire(node);
                if ((0, NoNested_js_1.hasExportableParent)(node))
                    return;
                (0, common_js_1.reportProblem)(context, options, {
                    node: node,
                    message: `${node.type === "NewExpression" ? "Construction" : "Call"} of '${constructorName}' without EXPORTABLE.`,
                    suggest: [
                        {
                            desc: "convert to exportable",
                            fix(fixer) {
                                return [
                                    fixer.replaceTextRange([node.range[0], node.range[0]], "EXPORTABLE(() => "),
                                    fixer.replaceTextRange([node.range[1], node.range[1]], ", [])"),
                                ];
                            },
                        },
                    ],
                });
            }
        }
        return {
            NewExpression(node) {
                process(node);
            },
            CallExpression(node) {
                process(node);
            },
        };
    },
};
//# sourceMappingURL=ExportInstances.js.map