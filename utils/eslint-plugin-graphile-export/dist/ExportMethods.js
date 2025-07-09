"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportMethods = void 0;
const common_js_1 = require("./common.js");
const NoNested_js_1 = require("./NoNested.js");
const dev = process.env.GRAPHILE_ENV === "development";
/**
 * So we don't reach too wide we only want to match objects that look like
 * they're probably plan configurations. For now this is the GraphQLFieldConfig
 * keys, GraphQLArgumentConfig keys, plus `match/plan` for pgPolymorphic and
 * plan/type/name for pgSelect.
 */
const ALLOWED_SIBLING_KEYS = [
    // GraphQLFieldConfig
    "description",
    "type",
    "args",
    "resolve",
    "subscribe",
    "deprecationReason",
    "extensions",
    "astNode",
    // GraphQLInterfaceType
    "fields",
    // GraphQLArgumentConfig
    "defaultValue",
    // GraphQLScalarConfig
    "serialize",
    "parseValue",
    "parseLiteral",
    // pgPolymorphic
    "match",
    // pgSelect args
    "name",
    "assertStep",
    "idempotent",
    "inputPlan",
    "applyPlan",
];
exports.ExportMethods = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Looks for 'resolve'/'subscribe'/'plan'/'subscribePlan' method on something that looks like a GraphQL definition and ensures it's exportable.",
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
        const methods = context.options?.[0]?.methods ?? [
            "resolve",
            "subscribe",
            "plan",
            "subscribePlan",
            "isTypeOf",
            "resolveType",
            "serialize",
            "parseValue",
            "parseLiteral",
            "inputPlan",
            "applyPlan",
            "assertStep",
        ];
        const options = {
            disableAutofix,
            methods,
        };
        return {
            Property(node) {
                if (isAllowedMethod(options, node.key)) {
                    processNode(context, options, node, node.key.name);
                }
            },
            MethodDefinition(node) {
                if (isAllowedMethod(options, node.key)) {
                    processNode(context, options, node, node.key.name);
                }
            },
        };
    },
};
function processNode(context, options, node, match) {
    const parentObject = node.parent;
    if (parentObject.type === "ObjectExpression") {
        const parentObjectKeys = parentObject.properties.map((property) => property.type === "Property" && property.key.type === "Identifier"
            ? property.key.name
            : null);
        const disallowedSiblingKeys = parentObjectKeys.filter((key) => key == null ||
            (!ALLOWED_SIBLING_KEYS.includes(key) && !options.methods.includes(key)));
        if (disallowedSiblingKeys.length === 0) {
            if ((0, NoNested_js_1.hasExportableParent)(node))
                return;
            // Match
            if (node.type === "ObjectMethod") {
                // replace with property -> EXPORTABLE
                (0, common_js_1.reportProblem)(context, options, {
                    node: node,
                    message: "is not exportable.",
                    // TODO: implement the suggestion
                    /*
                    suggest: [
                      {
                        desc: "convert to exportable",
                        fix(fixer) {
                          return [];
                        },
                      },
                    ],
                    */
                });
            }
            else if (node.type === "Property") {
                const value = node.value;
                if (value &&
                    (value.type === "FunctionExpression" ||
                        value.type === "ArrowFunctionExpression")) {
                    // Wrap with EXPORTABLE
                    (0, common_js_1.reportProblem)(context, options, {
                        node: node,
                        message: "Step value is not exportable.",
                        suggest: [
                            {
                                desc: "convert to exportable",
                                fix(fixer) {
                                    if (node.method && node.key.type === "Identifier") {
                                        const name = node.key.name;
                                        // This is a method definition `plan(...) {...}`
                                        return [
                                            node.value.async // It starts with 'async '
                                                ? fixer.replaceTextRange([node.range[0], node.range[0] + 6], `${name}: EXPORTABLE(() => async function `)
                                                : fixer.replaceTextRange([node.range[0], node.range[0]], `${name}: EXPORTABLE(() => function `),
                                            fixer.replaceTextRange([node.range[1], node.range[1]], ", [])"),
                                        ];
                                    }
                                    else {
                                        // This is a property definition `plan: (...) => {...}`
                                        return [
                                            fixer.replaceTextRange([value.range[0], value.range[0]], "EXPORTABLE(() => "),
                                            fixer.replaceTextRange([value.range[1], value.range[1]], ", [])"),
                                        ];
                                    }
                                },
                            },
                        ],
                    });
                }
            }
            else {
                console.log(node.type);
            }
        }
        else {
            if (node.type === "ObjectMethod" ||
                (node.type === "Property" &&
                    (node.value?.type === "FunctionExpression" ||
                        node.value?.type === "ArrowFunctionExpression"))) {
                if (dev) {
                    console.debug(`Spotted '${match}' on object defined at ${parentObject.loc
                        ? `${context.getPhysicalFilename()}:${parentObject.loc.start.line}:${parentObject.loc.start.column}`
                        : "unknown location"}, but it had disallowed keys: ${disallowedSiblingKeys.join(", ")} (all keys: ${parentObjectKeys.join(", ")})`);
                }
            }
        }
    }
}
function isAllowedMethod(options, node) {
    return node.type === "Identifier" && options.methods.includes(node.name);
}
//# sourceMappingURL=ExportMethods.js.map