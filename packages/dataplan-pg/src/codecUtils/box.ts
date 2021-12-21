import { inspect } from "util";

// https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-BOX

export interface PgBox {
  a: { x: number; y: number };
  b: { x: number; y: number };
}

export function parseBox(f: string): PgBox {
  if (f[0] === "(" && f[f.length - 1] === ")") {
    const [x1, y1, x2, y2] = f
      .substring(1, f.length - 1)
      .replace(/[()]/g, "")
      .split(",")
      .map((f) => parseFloat(f));
    return {
      a: { x: x1, y: y1 },
      b: { x: x2, y: y2 },
    };
  } else {
    throw new Error(`Failed to parse box ${inspect(f)}`);
  }
}

export function stringifyBox(box: PgBox): string {
  return `${box.a.x},${box.a.y},${box.b.x},${box.b.y}`;
}
