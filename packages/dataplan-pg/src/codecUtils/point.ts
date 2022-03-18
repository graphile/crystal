import { inspect } from "util";

// https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.5

export interface PgPoint {
  x: number;
  y: number;
}

export function parsePoint(f: string): PgPoint {
  if (f[0] === "(" && f[f.length - 1] === ")") {
    const [x, y] = f
      .slice(1, f.length - 1)
      .split(",")
      .map((f) => parseFloat(f));
    return { x, y };
  } else {
    throw new Error(`Failed to parse point ${inspect(f)}`);
  }
}

export function stringifyPoint(point: PgPoint): string {
  return `(${point.x},${point.y})`;
}
