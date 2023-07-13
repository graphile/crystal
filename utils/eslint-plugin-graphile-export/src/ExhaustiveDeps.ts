/*
 * Derived from eslint-plugin-react-hooks which is Copyright (c) Facebook, Inc.
 * and its affiliates and licensed under the MIT license.
 */

import type {
  ArrowFunctionExpression,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  Node,
  OptionalMemberExpression,
  SpreadElement,
  Super,
} from "@babel/types";
import type { AST, Rule, Scope } from "eslint";
import type {
  Expression as ESTreeExpression,
  FunctionDeclaration as ESTreeFunctionDeclaration,
  Node as ESTreeNode,
  Super as ESTreeSuper,
} from "estree";

import { fastFindReferenceWithParent, reportProblem } from "./common.js";

interface CommonOptions {
  disableAutofix: boolean;
  sortExports: boolean;
}

type DependenciesMap = Map<
  string,
  {
    references: Array<Scope.Reference>;
  }
>;

function gatherDependenciesRecursively(
  dependencies: DependenciesMap,
  node: (FunctionDeclaration | FunctionExpression | ArrowFunctionExpression) &
    Rule.NodeParentExtension,
  currentScope: Scope.Scope,
  monitoredScopes: Set<Scope.Scope>,
  rootNode: (
    | FunctionDeclaration
    | FunctionExpression
    | ArrowFunctionExpression
  ) &
    Rule.NodeParentExtension,
) {
  for (const reference of currentScope.references) {
    // If this reference is not resolved or it is not declared in a pure
    // scope then we don't care about this reference.
    if (!reference.resolved) {
      continue;
    }

    // If this reference is _defined_ within the function then we don't care about it.
    if (
      !monitoredScopes.has((reference.resolved as any).scope) &&
      reference.resolved.defs[0].node !== rootNode
    ) {
      continue;
    }

    // Narrow the scope of a dependency if it is, say, a member expression.
    // Then normalize the narrowed dependency.
    const referenceNode = fastFindReferenceWithParent(
      node,
      reference.identifier as unknown as Identifier,
    );
    if (!referenceNode) {
      console.warn("Could not find referenceNode");
      continue;
    }
    const dependencyNode = getDependency(referenceNode);
    const dependency = analyzePropertyChain(dependencyNode);

    if (
      (dependencyNode.parent.type as string) === "TSTypeQuery" ||
      (dependencyNode.parent.type as string) === "TSTypeReference" ||
      (dependencyNode.parent.type as string) === "TSClassImplements"
    ) {
      continue;
    }

    const def = reference.resolved.defs[0];
    if (def == null) {
      continue;
    }
    // Ignore references to the function itself as it's not defined yet.
    if (def.node != null && def.node.init === node.parent) {
      continue;
    }
    // Ignore Flow type parameters
    if ((def.type as string) === "TypeParameter") {
      continue;
    }

    // Add the dependency to a map so we can make sure it is referenced
    // again in our dependencies array.
    const obj = dependencies.get(dependency);
    if (!obj) {
      dependencies.set(dependency, {
        references: [reference],
      });
    } else {
      obj.references.push(reference);
    }
  }

  for (const childScope of currentScope.childScopes) {
    gatherDependenciesRecursively(
      dependencies,
      node,
      childScope,
      monitoredScopes,
      rootNode,
    );
  }
}

function getWarningMessage(
  deps: Set<string>,
  singlePrefix: string,
  label: string,
  fixVerb: string,
) {
  if (deps.size === 0) {
    return null;
  }
  return (
    (deps.size > 1 ? "" : singlePrefix + " ") +
    label +
    " " +
    (deps.size > 1 ? "dependencies" : "dependency") +
    ": " +
    joinEnglish(
      Array.from(deps)
        .sort()
        .map((name) => "'" + name + "'"),
    ) +
    `. You should ${fixVerb} ${deps.size > 1 ? "them" : "it"}.`
  );
}

export const ExhaustiveDeps: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "checks the list of scopes for your function align with the variables used in it",
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
        sortExports: false,
        properties: {
          disableAutofix: {
            type: "boolean",
          },
          sortExports: {
            type: "boolean",
          },
        },
      },
    ],
  },
  create(context) {
    const disableAutofix = context.options?.[0]?.disableAutofix ?? false;
    const sortExports = context.options?.[0]?.sortExports ?? false;

    const options: CommonOptions = {
      disableAutofix,
      sortExports,
    };

    const scopeManager = context.getSourceCode().scopeManager;

    /**
     * Visitor for both function expressions and arrow function expressions.
     */
    function visitFunctionWithDependencies(
      node: (
        | FunctionDeclaration
        | ArrowFunctionExpression
        | FunctionExpression
      ) &
        Rule.NodeParentExtension,
      declaredDependenciesNode:
        | Expression
        | ESTreeExpression
        | SpreadElement
        | OptionalMemberExpression,
      fnCall: Expression | Super,
    ) {
      // Get the current scope.
      const scope = scopeManager.acquire(
        node as unknown as ESTreeFunctionDeclaration,
      );
      if (!scope) {
        throw new Error(
          "eslint-plugin-graphile-export: could not determine scope",
        );
      }
      const monitoredScopes = new Set<Scope.Scope>();
      {
        let currentScope: Scope.Scope | null = scope;
        while ((currentScope = currentScope.upper)) {
          monitoredScopes.add(currentScope);
        }
      }

      const dependencies: DependenciesMap = new Map();
      gatherDependenciesRecursively(
        dependencies,
        node,
        scope,
        monitoredScopes,
        node,
      );

      // Warn about assigning to variables in the outer scope since there's no
      // outer scope when exporting.
      const externalAssigns = new Set();
      function reportStaleAssignment(writeExpr: ESTreeNode, key: string) {
        if (externalAssigns.has(key)) {
          return;
        }
        externalAssigns.add(key);
        reportProblem(context, options, {
          node: writeExpr,
          message:
            `Assignments to the '${key}' variable from inside ` +
            `${context.getSource(fnCall)} cannot be safely exported.`,
        });
      }

      // Remember which deps are stable and report bad usage first.
      dependencies.forEach(({ references }, key) => {
        references.forEach((reference) => {
          if (reference.writeExpr) {
            reportStaleAssignment(reference.writeExpr, key);
          }
        });
      });

      const argNames: Array<string | null> = [];
      const invalid = node.params.some((arg) => {
        if (arg.type !== "Identifier") {
          reportProblem(context, options, {
            node: arg as unknown as ESTreeNode,
            message: `${context.getSource(
              fnCall,
            )} has an argument which isn't a plain identifier, we don't support this currently.`,
          });
          argNames.push(null);
          return true;
        }
        argNames.push(arg.name);
        return false;
      });
      if (invalid) {
        return;
      }

      const declaredDependencies: Array<{
        key: string;
        node: Expression & Rule.NodeParentExtension;
      }> = [];
      if (declaredDependenciesNode.type !== "ArrayExpression") {
        // If the declared dependencies is not an object expression then we
        // can't verify that the user provided the correct dependencies. Tell
        // the user this in an error.
        reportProblem(context, options, {
          node: declaredDependenciesNode as unknown as ESTreeNode,
          message:
            `${context.getSource(fnCall)} was passed a ` +
            "dependency map that is not an array. This means we " +
            "can't statically verify whether you've passed the correct " +
            "dependencies.",
        });
      } else {
        declaredDependenciesNode.elements.forEach(
          (declaredDependencyNode, i) => {
            // Skip elided elements.
            if (declaredDependencyNode === null) {
              return;
            }
            // If we see a spread element then add a special warning.
            if (declaredDependencyNode.type === "SpreadElement") {
              reportProblem(context, options, {
                node: declaredDependencyNode as unknown as ESTreeNode,
                message:
                  `${context.getSource(fnCall)} has a spread element ` +
                  "in its dependency map. This means we can't " +
                  "statically verify whether you've passed the " +
                  "correct dependencies.",
              });
              return;
            }

            const argName = argNames[i] || `_unknownArg${i}`;

            // Add the dependency to our declared dependency map.
            declaredDependencies.push({
              key: argName,
              node: declaredDependencyNode as Expression &
                Rule.NodeParentExtension,
            });
          },
        );
        if (node.params.length !== declaredDependenciesNode.elements.length) {
          reportProblem(context, options, {
            node: declaredDependenciesNode as unknown as ESTreeNode,
            message: `${context.getSource(
              fnCall,
            )} has different arguments count (${
              node.params.length
            }) versus dependencies count (${
              declaredDependenciesNode.elements.length
            }); this is invalid.`,
          });
        }
      }

      const {
        unnecessaryDependencies,
        missingDependencies,
        duplicateDependencies,
      } = collectRecommendations({
        dependencies,
        declaredDependencies,
      });

      const suggestedDeps = [
        ...collectRecommendations({
          dependencies,
          declaredDependencies: [], // Pretend we don't know
        }).suggestedDependencies,
      ].sort();

      const declaredDependencyNames = declaredDependencies.map((d) => d.key);
      const isSorted =
        suggestedDeps.length === declaredDependencyNames.length &&
        suggestedDeps.every((name, i) => name === declaredDependencyNames[i]);

      if (
        missingDependencies.size === 0 &&
        unnecessaryDependencies.size === 0 &&
        duplicateDependencies.size === 0 &&
        (isSorted || !options.sortExports)
      ) {
        return;
      }

      reportProblem(context, options, {
        node: declaredDependenciesNode as unknown as ESTreeNode,
        message:
          `${context.getSource(fnCall)} has ` +
          // To avoid a long message, show the next actionable item.
          (getWarningMessage(missingDependencies, "a", "missing", "include") ||
            getWarningMessage(
              unnecessaryDependencies,
              "an",
              "unnecessary",
              "exclude",
            ) ||
            getWarningMessage(
              duplicateDependencies,
              "a",
              "duplicate",
              "omit",
            ) ||
            "incorrectly ordered dependencies."),
        suggest: [
          {
            desc: `Update the dependencies array to be: [${suggestedDeps.join(
              ", ",
            )}]`,
            fix(fixer) {
              // ENHANCE: preserve the comments and optionally the formatting
              const fixArgs = [];

              const range: [number, number] | null =
                node.range != null && node.body.range != null
                  ? [node.range[0], node.body.range[0]]
                  : node.start != null && node.body.start != null
                  ? [node.start, node.body.start]
                  : null;
              if (range != null) {
                const preferredArgs = `(${suggestedDeps.join(", ")})`;
                if (node.type === "ArrowFunctionExpression") {
                  let prefix = "";
                  let suffix = " => ";
                  if (node.async) {
                    prefix = "async " + prefix;
                  }
                  if (node.generator) {
                    prefix = "generator " + prefix;
                  }
                  if (node.body.type === "ObjectExpression") {
                    suffix = suffix + "(";
                  }
                  fixArgs.push(
                    fixer.replaceTextRange(
                      range,
                      prefix + preferredArgs + suffix,
                    ),
                  );
                } else if (node.type === "FunctionExpression") {
                  let prefix = "function ";
                  const suffix = " ";
                  if (node.generator) {
                    prefix = prefix + "*";
                  }
                  if (node.id) {
                    prefix = prefix + `${node.id.name}`;
                  }
                  if (node.async) {
                    prefix = "async " + prefix;
                  }
                  fixArgs.push(
                    fixer.replaceTextRange(
                      range,
                      prefix + preferredArgs + suffix,
                    ),
                  );
                }
              }

              return [
                ...fixArgs,
                fixer.replaceText(
                  declaredDependenciesNode as unknown as ESTreeNode | AST.Token,
                  `[${suggestedDeps.join(", ")}]`,
                ),
              ];
            },
          },
        ],
      });
    }

    return {
      CallExpression(node) {
        const callbackIndex = getScopesCallbackIndex(node.callee);
        if (callbackIndex === -1) {
          // Not a EXPORTABLE call that needs deps.
          return;
        }
        const callback = node.arguments[callbackIndex];
        const fnCall = node.callee;
        const declaredDependenciesNode = node.arguments[callbackIndex + 1];

        // Check whether a callback is supplied.
        if (!callback) {
          reportProblem(context, options, {
            node: fnCall as unknown as ESTreeNode,
            message: `EXPORTABLE must wrap a function.`,
          });
          return;
        }

        if (!declaredDependenciesNode) {
          reportProblem(context, options, {
            node: fnCall as unknown as ESTreeNode,
            message:
              `EXPORTABLE does nothing when called with ` +
              `only one argument. Did you forget to pass an array of ` +
              `dependencies?`,
            suggest: [
              {
                desc: "Add dependencies array",

                fix(fixer) {
                  // Add `, []` just before the `)` for the call.
                  const sourceCode = context.getSourceCode();
                  const nextToken = sourceCode.getTokenAfter(callback);
                  const hasComma =
                    nextToken &&
                    nextToken.value === "," &&
                    nextToken.type === "Punctuator";
                  return fixer.replaceTextRange(
                    [node.range![1] - 1, node.range![1] - 1],
                    `${hasComma ? `` : `, `}[]`,
                  );
                },
              },
            ],
          });
          return;
        }

        switch (callback.type) {
          case "FunctionExpression":
          case "ArrowFunctionExpression":
            visitFunctionWithDependencies(
              callback as unknown as (
                | FunctionExpression
                | ArrowFunctionExpression
              ) &
                Rule.NodeParentExtension,
              declaredDependenciesNode as unknown as Expression | SpreadElement,
              fnCall as unknown as Expression | Super,
            );
            return; // Handled
          case "Identifier":
          default:
            reportProblem(context, options, {
              node: fnCall as unknown as ESTreeNode,
              message:
                `EXPORTABLE received a function whose dependencies ` +
                `are unknown. Pass an inline function instead.`,
            });
            return; // Handled
        }
      },
    };
  },
};

interface DepTree {
  isUsed: boolean; // True if used in code
  isSatisfiedRecursively: boolean; // True if specified in deps
  isSubtreeUsed: boolean; // True if something deeper is used by code
  children: Map<string, DepTree>; // Nodes for properties
}

// The meat of the logic.
function collectRecommendations({
  dependencies,
  declaredDependencies,
}: {
  dependencies: DependenciesMap;
  declaredDependencies: Array<{
    key: string;
    node: Expression & Rule.NodeParentExtension;
  }>;
}) {
  // Our primary data structure.
  // It is a logical representation of property chains:
  // `props` -> `props.foo` -> `props.foo.bar` -> `props.foo.bar.baz`
  //         -> `props.lol`
  //         -> `props.huh` -> `props.huh.okay`
  //         -> `props.wow`
  // We'll use it to mark nodes that are *used* by the programmer,
  // and the nodes that were *declared* as deps. Then we will
  // traverse it to learn which deps are missing or unnecessary.
  const depTree = createDepTree();
  function createDepTree(): DepTree {
    return {
      isUsed: false, // True if used in code
      isSatisfiedRecursively: false, // True if specified in deps
      isSubtreeUsed: false, // True if something deeper is used by code
      children: new Map(), // Nodes for properties
    };
  }

  // Mark all required nodes first.
  // Imagine exclamation marks next to each used deep property.
  dependencies.forEach((_, key) => {
    const node = getOrCreateNodeByPath(depTree, key);
    node.isUsed = true;
    markAllParentsByPath(depTree, key, (parent) => {
      parent.isSubtreeUsed = true;
    });
  });

  // Mark all satisfied nodes.
  // Imagine checkmarks next to each declared dependency.
  declaredDependencies.forEach(({ key }) => {
    const node = getOrCreateNodeByPath(depTree, key);
    node.isSatisfiedRecursively = true;
  });

  // Tree manipulation helpers.
  function getOrCreateNodeByPath(rootNode: DepTree, path: string) {
    const keys = path.split(".");
    let node = rootNode;
    for (const key of keys) {
      let child = node.children.get(key);
      if (!child) {
        child = createDepTree();
        node.children.set(key, child);
      }
      node = child;
    }
    return node;
  }
  function markAllParentsByPath(
    rootNode: DepTree,
    path: string,
    fn: (child: DepTree) => void,
  ) {
    const keys = path.split(".");
    let node = rootNode;
    for (const key of keys) {
      const child = node.children.get(key);
      if (!child) {
        return;
      }
      fn(child);
      node = child;
    }
  }

  // Now we can learn which dependencies are missing or necessary.
  const missingDependencies = new Set<string>();
  const satisfyingDependencies = new Set<string>();
  scanTreeRecursively(
    depTree,
    missingDependencies,
    satisfyingDependencies,
    (key) => key,
  );
  function scanTreeRecursively(
    node: DepTree,
    missingPaths: Set<string>,
    satisfyingPaths: Set<string>,
    keyToPath: (key: string) => string,
  ): void {
    node.children.forEach((child, key) => {
      const path = keyToPath(key);
      if (child.isSatisfiedRecursively) {
        if (child.isSubtreeUsed) {
          // Remember this dep actually satisfied something.
          satisfyingPaths.add(path);
        }
        // It doesn't matter if there's something deeper.
        // It would be transitively satisfied since we assume immutability.
        // `props.foo` is enough if you read `props.foo.id`.
        return;
      }
      if (child.isUsed) {
        // Remember that no declared deps satisfied this node.
        missingPaths.add(path);
        // If we got here, nothing in its subtree was satisfied.
        // No need to search further.
        return;
      }
      scanTreeRecursively(
        child,
        missingPaths,
        satisfyingPaths,
        (childKey) => path + "." + childKey,
      );
    });
  }

  // Collect suggestions in the order they were originally specified.
  const suggestedDependencies: string[] = [];
  const unnecessaryDependencies = new Set<string>();
  const duplicateDependencies = new Set<string>();
  declaredDependencies.forEach(({ key }) => {
    // Does this declared dep satisfy a real need?
    if (satisfyingDependencies.has(key)) {
      if (suggestedDependencies.indexOf(key) === -1) {
        // Good one.
        suggestedDependencies.push(key);
      } else {
        // Duplicate.
        duplicateDependencies.add(key);
      }
    } else {
      // It's definitely not needed.
      unnecessaryDependencies.add(key);
    }
  });

  // Then add the missing ones at the end.
  missingDependencies.forEach((key) => {
    suggestedDependencies.push(key);
  });

  return {
    suggestedDependencies,
    unnecessaryDependencies,
    duplicateDependencies,
    missingDependencies,
  };
}

/**
 * Assuming () means the passed/returned node:
 * `(props) => (props)`
 * `props.(foo) => (props.foo)`
 * `props.foo.(bar) => (props).foo.bar`
 * `props.foo.bar.(baz) => (props).foo.bar.baz`
 */
function getDependency(
  node: (Node | ESTreeNode) & Rule.NodeParentExtension,
): Node & Rule.NodeParentExtension {
  if (
    (node.parent.type === "MemberExpression" ||
      (node.parent.type as string) === "OptionalMemberExpression") &&
    "object" in node.parent &&
    "property" in node.parent &&
    node.parent.object === node &&
    "name" in node.parent.property &&
    node.parent.property.name !== "current" &&
    !node.parent.computed &&
    !(
      node.parent.parent != null &&
      (node.parent.parent.type === "CallExpression" ||
        (node.parent.parent.type as string) === "OptionalCallExpression") &&
      "callee" in node.parent.parent &&
      node.parent.parent.callee === node.parent
    )
  ) {
    return getDependency(node.parent);
  } else if (
    // Note: we don't check OptionalMemberExpression because it can't be LHS.
    node.type === "MemberExpression" &&
    node.parent &&
    node.parent.type === "AssignmentExpression" &&
    node.parent.left === node
  ) {
    return node.object as unknown as (Expression | Super) &
      Rule.NodeParentExtension;
  } else {
    return node as (Expression | Super) & Rule.NodeParentExtension;
  }
}

function analyzePropertyChain(node: Node | ESTreeNode): string {
  if (node.type === "Identifier" || (node.type as string) === "JSXIdentifier") {
    const result = (node as Identifier).name;
    return result;
  } else if (node.type === "MemberExpression" && !node.computed) {
    const object = analyzePropertyChain(node.object);
    const result = `${object}`;
    return result;
  } else if (node.type === "OptionalMemberExpression" && !node.computed) {
    const object = analyzePropertyChain(node.object);
    const result = `${object}`;
    return result;
  } else if (node.type === "ChainExpression" && !(node as any).computed) {
    const expression = node.expression;

    if (expression.type === "CallExpression") {
      throw new Error(`Unsupported node type: ${expression.type}`);
    }

    const object = analyzePropertyChain(expression.object);
    const result = `${object}`;
    return result;
  } else {
    throw new Error(`Unsupported node type: ${node.type}`);
  }
}

/**
 * Returns 0 if this is a EXPORTABLE call, -1 otherwise.
 */
function getScopesCallbackIndex(
  node: Expression | Super | ESTreeExpression | ESTreeSuper,
) {
  if (node.type === "Identifier" && node.name === "EXPORTABLE") {
    return 0;
  } else {
    return -1;
  }
}

function joinEnglish(arr: string[]) {
  let s = "";
  for (let i = 0; i < arr.length; i++) {
    s += arr[i];
    if (i === 0 && arr.length === 2) {
      s += " and ";
    } else if (i === arr.length - 2 && arr.length > 2) {
      s += ", and ";
    } else if (i < arr.length - 1) {
      s += ", ";
    }
  }
  return s;
}
