import type { Expression } from "@babel/types";
import type { Rule } from "eslint";
import type { Expression as ESTreeExpression } from "estree";

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
