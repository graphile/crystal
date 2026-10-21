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

/**
 * ESLint 8.40 added `context.filename` and ESLint 10 removed
 * `context.getFilename()`; support both.
 */
export function getFilename(context: {
  filename?: string;
  getFilename?(): string;
}): string {
  return context.filename ?? context.getFilename!();
}

/**
 * ESLint 8.40 added `context.physicalFilename` and ESLint 10 removed
 * `context.getPhysicalFilename()`; support both.
 */
export function getPhysicalFilename(context: {
  physicalFilename?: string;
  getPhysicalFilename?(): string;
}): string {
  return context.physicalFilename ?? context.getPhysicalFilename!();
}
