import type { Expression, Node } from "@babel/types";
import type { Rule } from "eslint";
import type { Expression as ESTreeExpression } from "estree";
declare module "eslint" {
    namespace Rule {
        interface RuleContext {
            getSource(node: Expression | ESTreeExpression): string;
        }
    }
}
export declare function reportProblem(context: Rule.RuleContext, options: {
    disableAutofix: boolean;
}, problem: Rule.ReportDescriptor): void;
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
export declare function fastFindReferenceWithParent(start: Node & Rule.NodeParentExtension, target: Node): (Node & Rule.NodeParentExtension) | null;
//# sourceMappingURL=common.d.ts.map