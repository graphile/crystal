import type { Expression, Node } from "@babel/types";
import type { Rule } from "eslint";
import type { Expression as ESTreeExpression } from "estree";

declare module "eslint" {
  namespace Rule {
    interface RuleMetaData {
      hasSuggestions?: boolean | undefined;
    }
    interface RuleContext {
      getSource(node: Expression | ESTreeExpression): string;
    }
  }
}

export function reportProblem(
  context: Rule.RuleContext,
  options: { disableAutofix: boolean },
  problem: Rule.ReportDescriptor,
) {
  if (options.disableAutofix !== true) {
    // Used to enable legacy behavior. Dangerous.
    // Keep this as an option until major IDEs upgrade (including VSCode FB ESLint extension).
    if (Array.isArray(problem.suggest) && problem.suggest.length > 0) {
      problem.fix = problem.suggest[0].fix;
    }
  }
  context.report(problem);
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
export function fastFindReferenceWithParent(
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

function isSameIdentifier(a: any, b: any): a is typeof b {
  return (
    (a.type === "Identifier" || a.type === "JSXIdentifier") &&
    a.type === b.type &&
    a.name === b.name &&
    a.range[0] === b.range[0] &&
    a.range[1] === b.range[1]
  );
}

function isNodeLike(val: unknown): val is Node {
  return (
    typeof val === "object" &&
    val !== null &&
    !Array.isArray(val) &&
    typeof (val as any).type === "string"
  );
}

function isAncestorNodeOf(a: Node & Rule.NodeParentExtension, b: Node) {
  return a.range![0] <= b.range![0] && a.range![1] >= b.range![1];
}
