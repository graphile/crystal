import type { CallExpression } from "@babel/types";

export function isExportableCall(node: any): node is CallExpression {
  return node.type === "CallExpression" && isEXPORTABLE(node.callee);
}

export function isEXPORTABLE(node: any): boolean {
  switch (node.type) {
    case "Identifier":
      return node.name === "EXPORTABLE";
    case "MemberExpression":
      return isEXPORTABLE(node.property);
    default:
      return false;
  }
}
