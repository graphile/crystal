import JSON5 from "json5";
import type { Plugin } from "pretty-format";

export interface FormattedObject {
  __: string | JSON | null | undefined;
}

function isFormattedObject(val: unknown): val is FormattedObject {
  return (
    (typeof val === "object" &&
      val &&
      Object.keys(val).length === 1 &&
      "__" in val) ||
    false
  );
}

function printFormattedObject(val: FormattedObject): string {
  return typeof val.__ === "string"
    ? String(val.__)
    : typeof val.__ === "undefined"
    ? "undefined"
    : JSON5.stringify(val.__, null, 2);
}

export const test: Plugin["test"] = isFormattedObject;
export const serialize = printFormattedObject;
