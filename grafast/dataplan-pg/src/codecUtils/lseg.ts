import { SafeError } from "grafast";

export interface PgLseg {
  a: { x: number; y: number };
  b: { x: number; y: number };
}

/**
 * Parses the Postgres line segment syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LSEG
 */
export function parseLseg(f: string): PgLseg {
  if (f[0] === "[" && f[f.length - 1] === "]") {
    const [x1, y1, x2, y2] = f
      .slice(1, f.length - 1)
      .replace(/[()]/g, "")
      .split(",")
      .map((f) => parseFloat(f));
    return {
      a: { x: x1, y: y1 },
      b: { x: x2, y: y2 },
    };
  } else {
    throw new SafeError(`Failed to parse lseg ${f}`);
  }
}

/**
 * Stringifies to the Postgres line segment syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LSEG
 */
export function stringifyLseg(lseg: PgLseg): string {
  return `${lseg.a.x},${lseg.a.y},${lseg.b.x},${lseg.b.y}`;
}
