import type { Rule } from "eslint";
import type { Node as ESTreeNode } from "estree";

import { reportProblem } from "./common.ts";
import { isExportableCall } from "./utils.ts";

interface CommonOptions {
  disableAutofix: boolean;
}

export const NoNested: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Looks for nested EXPORTABLE calls and suggests removing them",
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
    const options: CommonOptions = {
      disableAutofix,
    };
    return {
      CallExpression(node) {
        if (isExportableCall(node)) {
          if (hasExportableParent(node)) {
            const callback = node.arguments[0];
            if (callback.type === "ArrowFunctionExpression") {
              const body = callback.body;
              reportProblem(context, options, {
                node: node as unknown as ESTreeNode,
                message: "Nested EXPORTABLE found",
                suggest: [
                  {
                    desc: "remove exportable",
                    fix(fixer) {
                      return [
                        fixer.replaceTextRange(
                          [node.range![0], body.range![0]],
                          "",
                        ),
                        fixer.replaceTextRange(
                          [body.range![1], node.range![1]],
                          "",
                        ),
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

export function hasExportableParent(node: any): boolean {
  let parent: any = node;
  while ((parent = parent.parent)) {
    if (isExportableCall(parent)) {
      return true;
    }
  }
  return false;
}
