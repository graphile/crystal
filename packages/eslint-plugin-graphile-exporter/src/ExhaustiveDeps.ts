/*
 * Heavily inspired by eslint-plugin-react-hoosk which is Copyright (c)
 * Facebook, Inc. and its affiliates and licensed under the MIT license.
 */

import type {
  ArrowFunctionExpression,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  Node,
  ObjectProperty,
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

declare module "eslint" {
  namespace Rule {
    interface RuleMetaData {
      hasSuggestions: boolean;
    }
    interface RuleContext {
      getSource(node: Expression | ESTreeExpression): string;
    }
  }
}

interface CommonOptions {
  enableAutofix: boolean;
}

function reportProblem(
  context: Rule.RuleContext,
  options: CommonOptions,
  problem: Rule.ReportDescriptor,
) {
  if (options.enableAutofix) {
    // Used to enable legacy behavior. Dangerous.
    // Keep this as an option until major IDEs upgrade (including VSCode FB ESLint extension).
    if (Array.isArray(problem.suggest) && problem.suggest.length > 0) {
      problem.fix = problem.suggest[0].fix;
    }
  }
  context.report(problem);
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
) {
  for (const reference of currentScope.references) {
    // If this reference is not resolved or it is not declared in a pure
    // scope then we don't care about this reference.
    if (!reference.resolved) {
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
      dependencyNode.parent.type === "TSTypeQuery" ||
      dependencyNode.parent.type === "TSTypeReference"
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
    gatherDependenciesRecursively(dependencies, node, childScope);
  }
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
        enableDangerousAutofixThisMayCauseInfiniteLoops: false,
        properties: {
          enableDangerousAutofixThisMayCauseInfiniteLoops: {
            type: "boolean",
          },
        },
      },
    ],
  },
  create(context) {
    const enableAutofix =
      context.options?.[0]?.enableDangerousAutofixThisMayCauseInfiniteLoops ??
      false;

    const options: CommonOptions = {
      enableAutofix,
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
          "eslint-plugin-graphile-exporter: could not determine scope",
        );
      }

      const dependencies: DependenciesMap = new Map();
      gatherDependenciesRecursively(dependencies, node, scope);

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
            `Assignments to the '${key}' variable from inside FN ` +
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

      // TODO: change this to a Map/object
      const declaredDependencies: Array<{
        key: string;
        node: ObjectProperty & Rule.NodeParentExtension;
      }> = [];
      if (declaredDependenciesNode.type !== "ObjectExpression") {
        // If the declared dependencies is not an object expression then we
        // can't verify that the user provided the correct dependencies. Tell
        // the user this in an error.
        reportProblem(context, options, {
          node: declaredDependenciesNode as unknown as ESTreeNode,
          message:
            `FN ${context.getSource(fnCall)} was passed a ` +
            "dependency map that is not an object literal. This means we " +
            "can't statically verify whether you've passed the correct " +
            "dependencies.",
        });
      } else {
        declaredDependenciesNode.properties.forEach(
          (declaredDependencyNode) => {
            // Skip elided elements.
            if (declaredDependencyNode === null) {
              return;
            }
            // If we see a spread element then add a special warning.
            if (
              declaredDependencyNode.type === "SpreadElement" ||
              declaredDependencyNode.type === "ObjectMethod"
            ) {
              reportProblem(context, options, {
                node: declaredDependencyNode as unknown as ESTreeNode,
                message:
                  `FN ${context.getSource(
                    fnCall,
                  )} has a spread element or method ` +
                  "in its dependency map. This means we can't " +
                  "statically verify whether you've passed the " +
                  "correct dependencies.",
              });
              return;
            }
            // Try to normalize the declared dependency. If we can't then an error
            // will be thrown. We will catch that error and report an error.
            const { key, value } = declaredDependencyNode;
            const keyString =
              key.type === "Identifier"
                ? key.name
                : key.type === "StringLiteral"
                ? key.value
                : null;
            const valueIdentifierString =
              value.type === "Identifier" ? value.name : null;
            if (typeof keyString !== "string") {
              reportProblem(context, options, {
                node: declaredDependencyNode as unknown as ESTreeNode,
                message: `Could not decode key.`,
              });
              return;
            }
            if (typeof valueIdentifierString !== "string") {
              reportProblem(context, options, {
                node: declaredDependencyNode as unknown as ESTreeNode,
                message: `The value for every entry in the dependencies map should be a simple identifier with the same name as the key; received a complex value.`,
              });
              return;
            }
            if (keyString !== valueIdentifierString) {
              reportProblem(context, options, {
                node: declaredDependencyNode as unknown as ESTreeNode,
                message: `The value for every entry in the dependencies map should be a simple identifier with the same name as the key; ${JSON.stringify(
                  keyString,
                )} !== ${JSON.stringify(valueIdentifierString)}.`,
              });
              return;
            }

            const declaredDependency = keyString;

            // Add the dependency to our declared dependency map.
            declaredDependencies.push({
              key: declaredDependency,
              node: declaredDependencyNode as ObjectProperty &
                Rule.NodeParentExtension,
            });
          },
        );
      }

      const {
        suggestedDependencies,
        unnecessaryDependencies,
        missingDependencies,
        duplicateDependencies,
      } = collectRecommendations({
        dependencies,
        declaredDependencies,
      });

      let suggestedDeps = suggestedDependencies;

      // If we're going to report a missing dependency,
      // we might as well recalculate the list ignoring
      // the currently specified deps. This can result
      // in some extra deduplication.
      if (missingDependencies.size > 0) {
        suggestedDeps = collectRecommendations({
          dependencies,
          declaredDependencies: [], // Pretend we don't know
        }).suggestedDependencies;
      }

      // Alphabetize the suggestions, but only if deps were already alphabetized.
      function areDeclaredDepsAlphabetized() {
        if (declaredDependencies.length === 0) {
          return true;
        }
        const declaredDepKeys = declaredDependencies.map((dep) => dep.key);
        const sortedDeclaredDepKeys = declaredDepKeys.slice().sort();
        return declaredDepKeys.join(",") === sortedDeclaredDepKeys.join(",");
      }
      if (areDeclaredDepsAlphabetized()) {
        suggestedDeps.sort();
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
          `. Either ${fixVerb} ${
            deps.size > 1 ? "them" : "it"
          } or remove the dependency array.`
        );
      }

      reportProblem(context, options, {
        node: declaredDependenciesNode as unknown as ESTreeNode,
        message:
          `FN ${context.getSource(fnCall)} has ` +
          // To avoid a long message, show the next actionable item.
          (getWarningMessage(missingDependencies, "a", "missing", "include") ||
            getWarningMessage(
              unnecessaryDependencies,
              "an",
              "unnecessary",
              "exclude",
            ) ||
            getWarningMessage(duplicateDependencies, "a", "duplicate", "omit")),
        suggest: [
          {
            desc: `Update the dependencies array to be: [${suggestedDeps.join(
              ", ",
            )}]`,
            fix(fixer) {
              // TODO: consider preserving the comments or formatting?
              return fixer.replaceText(
                declaredDependenciesNode as unknown as ESTreeNode | AST.Token,
                `[${suggestedDeps.join(", ")}]`,
              );
            },
          },
        ],
      });
    }

    return {
      CallExpression(node) {
        const callbackIndex = getScopesCallbackIndex(node.callee);
        if (callbackIndex === -1) {
          // Not a FN call that needs deps.
          return;
        }
        const callback = node.arguments[callbackIndex];
        const fnCall = node.callee;
        const declaredDependenciesNode = node.arguments[callbackIndex + 1];

        // Check whether a callback is supplied.
        if (!callback) {
          reportProblem(context, options, {
            node: fnCall as unknown as ESTreeNode,
            message: `FN must wrap a function.`,
          });
          return;
        }

        if (!declaredDependenciesNode) {
          // TODO: Can this have a suggestion?
          reportProblem(context, options, {
            node: fnCall as unknown as ESTreeNode,
            message:
              `FN does nothing when called with ` +
              `only one argument. Did you forget to pass an array of ` +
              `dependencies?`,
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
                `FN received a function whose dependencies ` +
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
    node: ObjectProperty & Rule.NodeParentExtension;
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
 * (props) => (props)
 * props.(foo) => (props.foo)
 * props.foo.(bar) => (props).foo.bar
 * props.foo.bar.(baz) => (props).foo.bar.baz
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
 * Returns 0 if this is a FN call, -1 otherwise.
 */
function getScopesCallbackIndex(
  node: Expression | Super | ESTreeExpression | ESTreeSuper,
) {
  if (node.type === "Identifier" && node.name === "FN") {
    return 0;
  } else {
    return -1;
  }
}

/**
 * ESLint won't assign node.parent to references from context.getScope()
 *
 * So instead we search for the node from an ancestor assigning node.parent
 * as we go. This mutates the AST.
 *
 * This traversal is:
 * - optimized by only searching nodes with a range surrounding our target node
 * - agnostic to AST node types, it looks for `{ type: string, ... }`
 */
function fastFindReferenceWithParent(
  start: Node & Rule.NodeParentExtension,
  target: Node,
) {
  const queue: Array<Node & Rule.NodeParentExtension> = [start];
  let item: (Node & Rule.NodeParentExtension) | null = null;

  while (queue.length) {
    item = queue.shift()!;
    const definitelyItem = item;

    if (isSameIdentifier(definitelyItem, target)) {
      return definitelyItem;
    }

    if (!isAncestorNodeOf(definitelyItem, target)) {
      continue;
    }

    for (const [key, value] of Object.entries(definitelyItem)) {
      if (key === "parent") {
        continue;
      }
      if (isNodeLike(value)) {
        const valueWithParent = Object.assign(value, {
          parent: definitelyItem,
        });
        queue.push(valueWithParent);
      } else if (Array.isArray(value)) {
        value.forEach((val) => {
          if (isNodeLike(val)) {
            const valWithParent = Object.assign(val, {
              parent: definitelyItem,
            });
            queue.push(valWithParent);
          }
        });
      }
    }
  }

  return null;
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

function isNodeLike(val: unknown): val is Node {
  return (
    typeof val === "object" &&
    val !== null &&
    !Array.isArray(val) &&
    typeof (val as any).type === "string"
  );
}

function isSameIdentifier(a: any, b: any): a is typeof b {
  return (
    (a.type === "Identifier" || a.type === "JSXIdentifier") &&
    a.type === b.type &&
    a.name === b.name &&
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1]
  );
}

function isAncestorNodeOf(a: Node & Rule.NodeParentExtension, b: Node) {
  return a.range![0] <= b.range![0] && a.range![1] >= b.range![1];
}
