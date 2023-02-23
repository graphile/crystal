import { SafeError } from "grafast";

export interface PgBox {
  a: { x: number; y: number };
  b: { x: number; y: number };
}

/**
 * Parses the Postgres box syntax.
 *
 * @see {@link https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-BOX}
 */
export function parseBox(f: string): PgBox {
  if (f[0] === "(" && f[f.length - 1] === ")") {
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
    throw new SafeError(`Failed to parse box ${f}`);
  }
}

/**
 * Stringifies a box to the Postgres box syntax.
 *
 * @see {@link https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-BOX}
 */
export function stringifyBox(box: PgBox): string {
  return `${box.a.x},${box.a.y},${box.b.x},${box.b.y}`;
}
