import { SafeError } from "grafast";

import type { PgPoint } from "./point.ts";
import { stringifyPoint } from "./point.ts";

export interface PgPolygon {
  points: PgPoint[];
}

/**
 * Parses the Postgres polygon syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9
 */
export function parsePolygon(f: string): PgPolygon {
  if (f[0] === "(" && f[f.length - 1] === ")") {
    const xsAndYs = f
      //.slice(1, f.length - 1)
      .replace(/[()]/g, "")
      .split(",")
      .map((f) => parseFloat(f));
    if (xsAndYs.length % 2 !== 0) {
      throw new SafeError("Invalid polygon representation");
    }
    const points = [];
    for (let i = 0, l = xsAndYs.length; i < l; i += 2) {
      points.push({ x: xsAndYs[i], y: xsAndYs[i + 1] });
    }
    return {
      points,
    };
  } else {
    throw new SafeError(`Failed to parse polygon`);
  }
}

/**
 * Stringifies to the Postgres polygon syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9
 */
export function stringifyPolygon(polygon: PgPolygon): string {
  return polygon.points.map(stringifyPoint).join(",");
}
