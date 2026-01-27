import { SafeError } from "grafast";

import type { PgPoint } from "./point.ts";
import { stringifyPoint } from "./point.ts";

export interface PgCircle {
  center: PgPoint;
  radius: number;
}

/**
 * Parses the Postgres circle syntax
 *
 * @see {@link https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9}
 */
export function parseCircle(f: string): PgCircle {
  if (f[0] === "<" && f[f.length - 1] === ">") {
    const [x, y, r] = f
      .slice(1, f.length - 1)
      .replace(/[()]/g, "")
      .split(",")
      .map((f) => parseFloat(f));
    return {
      center: { x, y },
      radius: r,
    };
  } else {
    throw new SafeError(`Failed to parse circle ${f}`);
  }
}

/**
 * Stringifies to the Postgres circle syntax
 *
 * @see {@link https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9}
 */
export function stringifyCircle(circle: PgCircle): string {
  return `<${stringifyPoint(circle.center)},${circle.radius}>`;
}
