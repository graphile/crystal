import { SafeError } from "grafast";

export interface PgLine {
  a: { x: number; y: number };
  b: { x: number; y: number };
}

/**
 * Parses the Postgres line syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LINE
 */
export function parseLine(f: string): PgLine {
  if (f[0] === "{" && f[f.length - 1] === "}") {
    const [A, B, C] = f
      .slice(1, f.length - 1)
      .split(",")
      .map((f) => parseFloat(f));
    // Lines have the form Ax + By + C = 0.
    // So if y = 0, Ax + C = 0; x = -C/A or if A is 0 then C = 0, x can be anything
    // If x = 0, By + C = 0; y = -C/B or if B is 0 then C = 0, y can be anything
    return {
      a: { x: A === 0 ? 1 : -C / A, y: 0 },
      b: { x: 0, y: B === 0 ? 1 : -C / B },
    };
  } else {
    throw new SafeError(`Failed to parse line ${f}`);
  }
}

/**
 * Stringifies to the Postgres line syntax.
 *
 * https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LINE
 */
export function stringifyLine(line: PgLine): string {
  return `${line.a.x},${line.a.y},${line.b.x},${line.b.y}`;
}
