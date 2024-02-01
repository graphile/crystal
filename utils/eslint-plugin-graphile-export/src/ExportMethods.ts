import type { Expression, Identifier, Method, Property } from "@babel/types";
import type { Rule } from "eslint";
import type { Node as ESTreeNode } from "estree";

import { reportProblem } from "./common.js";
import { hasExportableParent } from "./NoNested.js";

const dev = process.env.GRAPHILE_ENV === "development";

interface CommonOptions {
  disableAutofix: boolean;
  methods: string[];
}

/**
 * So we don't reach too wide we only want to match objects that look like
 * they're probably plan configurations. For now this is the GraphQLFieldConfig
 * keys, GraphQLArgumentConfig keys, plus `match/plan` for pgPolymorphic and
 * plan/type/name for pgSelect.
 */
const ALLOWED_SIBLING_KEYS: string[] = [
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
  "autoApplyAfterParentInputPlan",
  "autoApplyAfterParentApplyPlan",
  "autoApplyAfterParentPlan",
  "autoApplyAfterParentSubscribePlan",
  "idempotent",
  "inputPlan",
  "applyPlan",
];

export const ExportMethods: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Looks for 'resolve'/'subscribe'/'plan'/'subscribePlan' method on something that looks like a GraphQL definition and ensures it's exportable.",
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

    const options: CommonOptions = {
      disableAutofix,
      methods,
    };
    return {
      Property(node) {
        if (isAllowedMethod(options, node.key)) {
          processNode(
            context,
            options,
            node as unknown as Property & Rule.NodeParentExtension,
            node.key.name,
          );
        }
      },
      MethodDefinition(node) {
        if (isAllowedMethod(options, node.key)) {
          processNode(
            context,
            options,
            node as unknown as Method & Rule.NodeParentExtension,
            node.key.name,
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
  const parentObject = node.parent;
  if (parentObject.type === "ObjectExpression") {
    const parentObjectKeys = parentObject.properties.map((property) =>
      property.type === "Property" && property.key.type === "Identifier"
        ? property.key.name
        : null,
    );
    const disallowedSiblingKeys = parentObjectKeys.filter(
      (key) =>
        key == null ||
        (!ALLOWED_SIBLING_KEYS.includes(key) && !options.methods.includes(key)),
    );
    if (disallowedSiblingKeys.length === 0) {
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
        const value = (node as any).value as Expression &
          Rule.NodeParentExtension;
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
    } else {
      if (
        node.type === "ObjectMethod" ||
        ((node.type as string) === "Property" &&
          ((node as any).value?.type === "FunctionExpression" ||
            (node as any).value?.type === "ArrowFunctionExpression"))
      ) {
        if (dev) {
          console.debug(
            `Spotted '${match}' on object defined at ${
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
  }
}

function isAllowedMethod(
  options: CommonOptions,
  node: any,
): node is Identifier {
  return node.type === "Identifier" && options.methods.includes(node.name);
}
