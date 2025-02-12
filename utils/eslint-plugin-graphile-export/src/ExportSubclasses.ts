import type { ClassDeclaration, Property } from "@babel/types";
import type { Rule } from "eslint";
import type { Node as ESTreeNode, PropertyDefinition } from "estree";
import { basename } from "path";

import { reportProblem } from "./common.js";
import { hasExportableParent } from "./NoNested.js";

interface CommonOptions {
  disableAutofix: boolean;
}

const KNOWN_IMPORTS: Array<[string, string]> = [
  ["grafast", "BaseStep"],
  ["grafast", "ExecutableStep"],
  ["grafast", "Modifier"],
];

export const ExportSubclasses: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Looks for classes that extend BaseStep, ExecutableStep or Modifier.",
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

    const options: CommonOptions = {
      disableAutofix,
    };
    return {
      ClassDeclaration(node) {
        const superClass = node.superClass;
        if (!superClass) {
          return;
        }
        const superClassIdentifier =
          superClass.type === "Identifier" ? superClass.name : null;
        if (!superClassIdentifier) {
          return;
        }
        const possibles = KNOWN_IMPORTS.filter(
          (tuple) => tuple[1] === superClassIdentifier,
        );
        if (possibles.length === 0) {
          return;
        }
        const className = node.id?.name;
        if (!className) {
          return;
        }

        if (hasExportableParent(node)) return;

        // ENHANCE: if the definition for the `superClass` identifier is not actually an import from any of these `possibles` then we should `return;`. It just happens to share the same name?

        //const scope = scopeManager.acquire(node);

        const isTypeScript = /\.[mc]?tsx?$/.test(context.getFilename());
        const isGeneric = !!(node as unknown as ClassDeclaration)
          .typeParameters;
        const $$export = node.body.body.find(
          (def): def is PropertyDefinition =>
            def.type === "PropertyDefinition" &&
            def.key.type === "Identifier" &&
            def.key.name === "$$export",
        );

        if ($$export) {
          if (!$$export.static) {
            reportProblem(context, options, {
              node: $$export as unknown as ESTreeNode,
              message: `$$export should be a static property; this is probably a mistake?`,
              suggest: [
                {
                  desc: "add 'static' keyword",
                  fix(fixer) {
                    return [
                      fixer.replaceTextRange(
                        [$$export.range![0], $$export.range![0]],
                        `static `,
                      ),
                    ];
                  },
                },
              ],
            });
            return;
          }
          if ($$export.value?.type === "ObjectExpression") {
            // Validate the object
            const moduleName = $$export.value.properties.find(
              (prop) =>
                prop.type === "Property" &&
                prop.key.type === "Identifier" &&
                prop.key.name === "moduleName",
            ) as unknown as Property | null;
            const exportName = $$export.value.properties.find(
              (prop) =>
                prop.type === "Property" &&
                prop.key.type === "Identifier" &&
                prop.key.name === "exportName",
            ) as unknown as Property | null;
            const safe =
              !$$export.value.properties.some(
                (prop) => prop.type === "SpreadElement",
              ) &&
              !$$export.value.properties.some(
                (prop) =>
                  prop.type === "Property" && prop.key.type !== "Identifier",
              );
            if (safe && !moduleName) {
              reportProblem(context, options, {
                node: $$export as unknown as ESTreeNode,
                message: `$$export specifier doesn't explicitly specify 'moduleName'`,
              });
            }
            if (safe && !exportName) {
              reportProblem(context, options, {
                node: $$export as unknown as ESTreeNode,
                message: `$$export specifier doesn't explicitly specify 'exportName'`,
              });
            }
            if (moduleName && exportName) {
              if (
                !moduleName.value ||
                !["StringLiteral", "Literal"].includes(moduleName.value.type)
              ) {
                console.dir(moduleName.value);
                reportProblem(context, options, {
                  node: $$export as unknown as ESTreeNode,
                  message: `$$export has invalid value for 'moduleName' - expected a string literal.`,
                });
              }
              if (
                !exportName.value ||
                !["StringLiteral", "Literal"].includes(exportName.value.type)
              ) {
                reportProblem(context, options, {
                  node: $$export as unknown as ESTreeNode,
                  message: `$$export has invalid value for 'exportName' - expected a string literal.`,
                });
              }
            }
          } else {
            // Assume it's all good.
          }
          return;
        }

        const convertToImportable: Rule.SuggestionReportDescriptor = {
          desc: "convert to importable",
          fix(fixer) {
            return [
              fixer.replaceTextRange(
                [node.body.range![0] + 1, node.body.range![0] + 1],
                `\n  static $$export = { moduleName: /* TODO! */ ${JSON.stringify(
                  `./${basename(context.getFilename())}`,
                )}, exportName: "${className}" };\n`,
              ),
            ];
          },
        };

        const convertToExportable: Rule.SuggestionReportDescriptor = {
          desc: "convert to exportable",
          fix(fixer) {
            return [
              fixer.replaceTextRange(
                [node.range![0], node.range![0]],
                `const ${className} = EXPORTABLE(() => `,
              ),
              fixer.replaceTextRange(
                [node.range![1], node.range![1]],
                ", []);" +
                  (isTypeScript
                    ? `\ntype ${className} = InstanceType<typeof ${className}>;`
                    : ``),
              ),
            ];
          },
        };

        const exportExample = `static $$export = { moduleName: /* TODO */ ".../path/to/module.js", exportName: "${className}" }`;

        if (isGeneric) {
          reportProblem(context, options, {
            node: node as unknown as ESTreeNode,
            message: `Generic class '${className}' extending '${superClassIdentifier}' cannot be safely exported. Because it's generic we cannot make it EXPORTABLE, instead make it importable by putting it in its own module and declaring a '${exportExample}' property.`,
            suggest: [convertToImportable],
          });
        } else {
          reportProblem(context, options, {
            node: node as unknown as ESTreeNode,
            message: `Class '${className}' extends '${superClassIdentifier}' but cannot be safely exported. Either make it EXPORTABLE or make it importable and add a '${exportExample}' property to indicate this.`,
            suggest: [convertToExportable, convertToImportable],
          });
        }
      },
    };
  },
};
