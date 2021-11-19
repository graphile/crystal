import type { Expression, Method, Property } from "@babel/types";
import type { Rule } from "eslint";
import type {
  Expression as ESTreeExpression,
  Node as ESTreeNode,
  PrivateIdentifier,
} from "estree";

import { reportProblem } from "./common";

interface CommonOptions {
  disableAutofix: boolean;
}

/**
 * So we don't reach too wide we only want to match objects that look like
 * they're probably plan configurations. For now this is the GraphQLFieldConfig
 * keys, GraphQLArgumentConfig keys, plus `match/plan` for pgPolymorphic and
 * plan/type/name for pgSelect.
 */
const ALLOWED_SIBLING_KEYS: string[] = [
  // Plan itself
  "plan",
  "subscribePlan",

  // GraphQLFieldConfig
  "description",
  "type",
  "args",
  "resolve",
  "subscribe",
  "deprecationReason",
  "extensions",
  "astNode",

  // GraphQLArgumentConfig
  "defaultValue",

  // pgPolymorphic
  "match",

  // pgSelect args
  "name",
];

export const ExportPlanMethod: Rule.RuleModule = {
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

    const options: CommonOptions = {
      disableAutofix,
    };
    return {
      Property(node) {
        if (isPlan(node.key)) {
          processNode(
            context,
            options,
            node as unknown as Property & Rule.NodeParentExtension,
          );
        }
      },
      MethodDefinition(node) {
        if (isPlan(node.key)) {
          processNode(
            context,
            options,
            node as unknown as Method & Rule.NodeParentExtension,
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
) {
  const parentObject = node.parent;
  if (parentObject.type === "ObjectExpression") {
    const parentObjectKeys = parentObject.properties.map((property) =>
      property.type === "Property" && property.key.type === "Identifier"
        ? property.key.name
        : null,
    );
    const disallowedSiblingKeys = parentObjectKeys.filter(
      (key) => key == null || !ALLOWED_SIBLING_KEYS.includes(key),
    );
    if (disallowedSiblingKeys.length === 0) {
      // Match
      if (node.type === "ObjectMethod") {
        // replace with property -> EXPORTABLE
        reportProblem(context, options, {
          node: node as unknown as ESTreeNode,
          message: "is not exportable.",
          // TODO:
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
        const value = (node as any).value as Expression &
          Rule.NodeParentExtension;
        if (
          value.type === "FunctionExpression" ||
          value.type === "ArrowFunctionExpression"
        ) {
          // Wrap with EXPORTABLE
          reportProblem(context, options, {
            node: node as unknown as ESTreeNode,
            message: "Plan value is not exportable.",
            suggest: [
              {
                desc: "convert to exportable",
                fix(fixer) {
                  if ((node as any).method && node.key.type === "Identifier") {
                    const name = node.key.name;
                    // This is a method definition `plan(...) {...}`
                    return [
                      fixer.replaceTextRange(
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
    } else {
      console.debug(
        `Spotted 'plan' on object defined at ${
          parentObject.loc
            ? `${context.getPhysicalFilename()}:${
                parentObject.loc.start.line
              }:${parentObject.loc.start.column}`
            : "unknown location"
        }, but it had disallowed keys: ${disallowedSiblingKeys.join(
          ", ",
        )} (all keys: ${parentObjectKeys.join(", ")})`,
      );
    }
  }
}

function isPlan(node: ESTreeExpression | PrivateIdentifier): boolean {
  return (
    node.type === "Identifier" &&
    (node.name === "plan" || node.name === "subscribePlan")
  );
}
