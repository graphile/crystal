import type { CallExpression } from "@babel/types";

export function isExportableCall(node: any): node is CallExpression {
  return (
    node.type === "CallExpression" &&
    node.callee.type === "Identifier" &&
    node.callee.name === "EXPORTABLE"
  );
}

