import { SafeError } from "grafast";

import type { PgPoint } from "./point.ts";
import { stringifyPoint } from "./point.ts";

export interface PgPath {
  isOpen: boolean;
  points: PgPoint[];
}

/**
 * Parses the Postgres path syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9
 */
export function parsePath(f: string): PgPath {
  let isOpen = null;
  if (f[0] === "(" && f[f.length - 1] === ")") {
    isOpen = false;
  } else if (f[0] === "[" && f[f.length - 1] === "]") {
    isOpen = true;
  }
  if (isOpen !== null) {
    const xsAndYs = f
      .slice(1, f.length - 1)
      .replace(/[()]/g, "")
      .split(",")
      .map((f) => parseFloat(f));
    if (xsAndYs.length % 2 !== 0) {
      throw new SafeError("Invalid path representation");
    }
    const points = [];
    for (let i = 0, l = xsAndYs.length; i < l; i += 2) {
      points.push({ x: xsAndYs[i], y: xsAndYs[i + 1] });
    }
    return {
      isOpen,
      points,
    };
  } else {
    throw new SafeError(`Failed to parse path ${f}`);
  }
}

/**
 * Stringifies to the Postgres path syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9
 */
export function stringifyPath(path: PgPath): string {
  const openParen = path.isOpen ? "[" : "(";
  const closeParen = path.isOpen ? "]" : ")";
  return `${openParen}${path.points
    .map(stringifyPoint)
    .join(",")}${closeParen}`;
}
