"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportSubclasses = void 0;
const path_1 = require("path");
const common_js_1 = require("./common.js");
const NoNested_js_1 = require("./NoNested.js");
const KNOWN_IMPORTS = [
    ["grafast", "Step"],
    ["grafast", "Modifier"],
];
exports.ExportSubclasses = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Looks for classes that extend Step or Modifier.",
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
        return {
            ClassDeclaration(node) {
                const superClass = node.superClass;
                if (!superClass) {
                    return;
                }
                const superClassIdentifier = superClass.type === "Identifier" ? superClass.name : null;
                if (!superClassIdentifier) {
                    return;
                }
                const possibles = KNOWN_IMPORTS.filter((tuple) => tuple[1] === superClassIdentifier);
                if (possibles.length === 0) {
                    return;
                }
                const className = node.id?.name;
                if (!className) {
                    return;
                }
                if ((0, NoNested_js_1.hasExportableParent)(node))
                    return;
                // ENHANCE: if the definition for the `superClass` identifier is not actually an import from any of these `possibles` then we should `return;`. It just happens to share the same name?
                //const scope = scopeManager.acquire(node);
                const isTypeScript = /\.[mc]?tsx?$/.test(context.getFilename());
                const isGeneric = !!node
                    .typeParameters;
                const $$export = node.body.body.find((def) => def.type === "PropertyDefinition" &&
                    def.key.type === "Identifier" &&
                    def.key.name === "$$export");
                if ($$export) {
                    if (!$$export.static) {
                        (0, common_js_1.reportProblem)(context, options, {
                            node: $$export,
                            message: `$$export should be a static property; this is probably a mistake?`,
                            suggest: [
                                {
                                    desc: "add 'static' keyword",
                                    fix(fixer) {
                                        return [
                                            fixer.replaceTextRange([$$export.range[0], $$export.range[0]], `static `),
                                        ];
                                    },
                                },
                            ],
                        });
                        return;
                    }
                    if ($$export.value?.type === "ObjectExpression") {
                        // Validate the object
                        const moduleName = $$export.value.properties.find((prop) => prop.type === "Property" &&
                            prop.key.type === "Identifier" &&
                            prop.key.name === "moduleName");
                        const exportName = $$export.value.properties.find((prop) => prop.type === "Property" &&
                            prop.key.type === "Identifier" &&
                            prop.key.name === "exportName");
                        const safe = !$$export.value.properties.some((prop) => prop.type === "SpreadElement") &&
                            !$$export.value.properties.some((prop) => prop.type === "Property" && prop.key.type !== "Identifier");
                        if (safe && !moduleName) {
                            (0, common_js_1.reportProblem)(context, options, {
                                node: $$export,
                                message: `$$export specifier doesn't explicitly specify 'moduleName'`,
                            });
                        }
                        if (safe && !exportName) {
                            (0, common_js_1.reportProblem)(context, options, {
                                node: $$export,
                                message: `$$export specifier doesn't explicitly specify 'exportName'`,
                            });
                        }
                        if (moduleName && exportName) {
                            if (!moduleName.value ||
                                !["StringLiteral", "Literal"].includes(moduleName.value.type)) {
                                console.dir(moduleName.value);
                                (0, common_js_1.reportProblem)(context, options, {
                                    node: $$export,
                                    message: `$$export has invalid value for 'moduleName' - expected a string literal.`,
                                });
                            }
                            if (!exportName.value ||
                                !["StringLiteral", "Literal"].includes(exportName.value.type)) {
                                (0, common_js_1.reportProblem)(context, options, {
                                    node: $$export,
                                    message: `$$export has invalid value for 'exportName' - expected a string literal.`,
                                });
                            }
                        }
                    }
                    else {
                        // Assume it's all good.
                    }
                    return;
                }
                const convertToImportable = {
                    desc: "convert to importable",
                    fix(fixer) {
                        return [
                            fixer.replaceTextRange([node.body.range[0] + 1, node.body.range[0] + 1], `\n  static $$export = { moduleName: /* TODO! */ ${JSON.stringify(`./${(0, path_1.basename)(context.getFilename())}`)}, exportName: "${className}" };\n`),
                        ];
                    },
                };
                const convertToExportable = {
                    desc: "convert to exportable",
                    fix(fixer) {
                        return [
                            fixer.replaceTextRange([node.range[0], node.range[0]], `const ${className} = EXPORTABLE(() => `),
                            fixer.replaceTextRange([node.range[1], node.range[1]], ", []);" +
                                (isTypeScript
                                    ? `\ntype ${className} = InstanceType<typeof ${className}>;`
                                    : ``)),
                        ];
                    },
                };
                const exportExample = `static $$export = { moduleName: /* TODO */ ".../path/to/module.js", exportName: "${className}" }`;
                if (isGeneric) {
                    (0, common_js_1.reportProblem)(context, options, {
                        node: node,
                        message: `Generic class '${className}' extending '${superClassIdentifier}' cannot be safely exported. Because it's generic we cannot make it EXPORTABLE, instead make it importable by putting it in its own module and declaring a '${exportExample}' property.`,
                        suggest: [convertToImportable],
                    });
                }
                else {
                    (0, common_js_1.reportProblem)(context, options, {
                        node: node,
                        message: `Class '${className}' extends '${superClassIdentifier}' but cannot be safely exported. Either make it EXPORTABLE or make it importable and add a '${exportExample}' property to indicate this.`,
                        suggest: [convertToExportable, convertToImportable],
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=ExportSubclasses.js.map