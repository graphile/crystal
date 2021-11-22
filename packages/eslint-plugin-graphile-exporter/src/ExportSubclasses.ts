import type { Rule } from "eslint";
import type { Node as ESTreeNode } from "estree";

import { reportProblem } from "./common";

interface CommonOptions {
  disableAutofix: boolean;
}

const KNOWN_IMPORTS: Array<[string, string]> = [
  ["graphile-crystal", "BasePlan"],
  ["graphile-crystal", "ExecutablePlan"],
  ["graphile-crystal", "ModifierPlan"],
];

export const ExportSubclasses: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Looks for classes that extend BasePlan, ExecutablePlan or ModifierPlan.",
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
        // TODO: determine if the definition for this identifier is an import from any of these `possibles`.
        //const scope = scopeManager.acquire(node);
        const isTypeScript = /\.[mc]?tsx?$/.test(context.getFilename());

        // TODO: don't run this rule if it declares `static $$export`.

        reportProblem(context, options, {
          node: node as unknown as ESTreeNode,
          message: `Class extending '${superClassIdentifier}' without EXPORTABLE.`,
          suggest: [
            {
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
            },
          ],
        });
      },
    };
  },
};
