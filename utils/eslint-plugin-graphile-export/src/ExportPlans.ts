import type { Expression, Identifier, Method, Property } from "@babel/types";
import type { Rule } from "eslint";
import type { Node as ESTreeNode } from "estree";

import { reportProblem } from "./common.js";
import { hasExportableParent } from "./NoNested.js";

const dev = process.env.GRAPHILE_ENV === "development";

interface CommonOptions {
  disableAutofix: boolean;
}

/**
 * So we don't reach too wide we only want to match objects that look like
 * they're probably plan configurations. For now this is the GraphQLFieldConfig
 * keys, GraphQLArgumentConfig keys, plus plan/type/name for pgSelect.
 */
const ALLOWED_SIBLING_KEYS: string[] = [
  "plans",
  "planType",
  "isTypeOf",
  "assertStep",
  "scope",
];

export const ExportPlans: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Looks for plan functions on something that looks like a Grafast plans object definition and ensures it's exportable.",
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

    const options: CommonOptions = {
      disableAutofix,
    };
    return {
      Property(node) {
        if (
          isPlanFunction(
            options,
            node as unknown as Property & Rule.NodeParentExtension,
          )
        ) {
          processNode(
            context,
            options,
            node as unknown as Property & Rule.NodeParentExtension,
            (node.key as Identifier).name,
          );
        }
      },
      MethodDefinition(node) {
        if (
          isPlanFunction(
            options,
            node as unknown as Method & Rule.NodeParentExtension,
          )
        ) {
          processNode(
            context,
            options,
            node as unknown as Method & Rule.NodeParentExtension,
            (node.key as Identifier).name,
          );
        }
      },
    };
  },
};

function processNode(
  context: Rule.RuleContext,
  options: CommonOptions,
  node:
    | (Property & Rule.NodeParentExtension)
    | (Method & Rule.NodeParentExtension),
  match: string,
) {
  if (hasExportableParent(node)) return;

  // Match
  if (node.type === "ObjectMethod") {
    // replace with property -> EXPORTABLE
    reportProblem(context, options, {
      node: node as unknown as ESTreeNode,
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
  } else if ((node.type as string) === "Property") {
    const value = (node as any).value as Expression & Rule.NodeParentExtension;
    if (
      value &&
      (value.type === "FunctionExpression" ||
        value.type === "ArrowFunctionExpression")
    ) {
      // Wrap with EXPORTABLE
      reportProblem(context, options, {
        node: node as unknown as ESTreeNode,
        message: "Step value is not exportable.",
        suggest: [
          {
            desc: "convert to exportable",
            fix(fixer) {
              if ((node as any).method && node.key.type === "Identifier") {
                const name = node.key.name;
                // This is a method definition `plan(...) {...}`
                return [
                  (node as any).value.async // It starts with 'async '
                    ? fixer.replaceTextRange(
                        [node.range![0], node.range![0] + 6],
                        `${name}: EXPORTABLE(() => async function `,
                      )
                    : fixer.replaceTextRange(
                        [node.range![0], node.range![0]],
                        `${name}: EXPORTABLE(() => function `,
                      ),
                  fixer.replaceTextRange(
                    [node.range![1], node.range![1]],
                    ", [])",
                  ),
                ];
              } else {
                // This is a property definition `plan: (...) => {...}`
                return [
                  fixer.replaceTextRange(
                    [value.range![0], value.range![0]],
                    "EXPORTABLE(() => ",
                  ),
                  fixer.replaceTextRange(
                    [value.range![1], value.range![1]],
                    ", [])",
                  ),
                ];
              }
            },
          },
        ],
      });
    }
  } else {
    console.log(node.type);
  }
}

/**
 * Asserts that this is a property of a `plans: {...}` object.
 */
function isPlanFunction(
  options: CommonOptions,
  node:
    | (Property & Rule.NodeParentExtension)
    | (Method & Rule.NodeParentExtension),
): boolean {
  if (node.key.type !== "Identifier") {
    return false;
  }
  const parentObject = node.parent;
  if (parentObject.type !== "ObjectExpression") {
    return false;
  }
  const grandparent = parentObject.parent;
  if (
    grandparent.type !== "Property" ||
    grandparent.key.type !== "Identifier" ||
    grandparent.key.name !== "plans"
  ) {
    return false;
  }
  const grandparentObject = grandparent.parent;
  if (grandparentObject.type !== "ObjectExpression") {
    return false;
  }

  // Assert sibling keys
  const parentObjectKeys = grandparentObject.properties.map((property) =>
    property.type === "Property" && property.key.type === "Identifier"
      ? property.key.name
      : null,
  );
  const disallowedSiblingKeys = parentObjectKeys.filter(
    (key) => key == null || !ALLOWED_SIBLING_KEYS.includes(key),
  );
  if (disallowedSiblingKeys.length !== 0) {
    return false;
  }
  return true;
}
