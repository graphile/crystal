import type { Rule } from "eslint";
import type { Node as ESTreeNode } from "estree";

import { reportProblem } from "./common";

interface CommonOptions {
  disableAutofix: boolean;
}

const KNOWN_IMPORTS: Array<[string, string]> = [
  ["@dataplan/pg", "PgSource"],
  ["@dataplan/pg", "PgSourceBuilder"],
];

export const ExportInstances: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Looks for 'plan' method on something that looks like a GraphQL definition and ensures it's exportable.",
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
      VariableDeclarator(node) {
        const init = node.init;
        if (!init || init.type !== "NewExpression") {
          return;
        }
        const callee = init.callee;
        const calleeIdentifier = callee.type === "Identifier" ? callee : null;
        if (!calleeIdentifier) {
          return;
        }
        const constructorName = calleeIdentifier?.name;
        const possibles = KNOWN_IMPORTS.filter(
          (tuple) => tuple[1] === constructorName,
        );
        if (possibles.length === 0) {
          return;
        }
        // TODO: determine if the definition for this identifier is an import from any of these `possibles`.
        //const scope = scopeManager.acquire(node);

        reportProblem(context, options, {
          node: node as unknown as ESTreeNode,
          message: `Construction of '${constructorName}' without EXPORTABLE.`,
          suggest: [
            {
              desc: "convert to exportable",
              fix(fixer) {
                return [
                  fixer.replaceTextRange(
                    [init.range![0], init.range![0]],
                    "EXPORTABLE(() => ",
                  ),
                  fixer.replaceTextRange(
                    [init.range![1], init.range![1]],
                    ", [])",
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
