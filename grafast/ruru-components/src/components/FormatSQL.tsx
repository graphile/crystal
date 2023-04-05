import { FC, useMemo } from "react";

export const FormatSQL: FC<{ sql: string }> = ({ sql }) => {
  const formattedSQL = useMemo(() => {
    const lines = sql.split("\n");
    const elements: JSX.Element[] = [];
    let knownIdentifiers = new Map<string, JSX.Element>();
    let identifierCount = 0;
    const makeParts = (line: string) => {
      const parts: JSX.Element[] = [];
      let idx = 0;
      const re = /__([a-zA-Z0-9](_?[a-zA-Z0-9])*)__/g;
      let matches;
      while ((matches = re.exec(line))) {
        const start = matches.index;
        const fin = re.lastIndex;
        if (start > idx) {
          parts.push(<>{line.substring(idx, start)}</>);
        }
        idx = fin;
        const [full] = matches;
        const f = knownIdentifiers.get(full);
        if (f) {
          parts.push(f);
        } else {
          const sub = <Highlight n={identifierCount++}>{full}</Highlight>;
          knownIdentifiers.set(full, sub);
          parts.push(sub);
        }
      }
      if (idx < line.length) {
        parts.push(<>{line.substring(idx)}</>);
      }
      return parts;
    };
    for (let i = 0, l = lines.length; i < l; i++) {
      const line = lines[i].trim();
      const parts = makeParts(line);

      elements.push(
        <code
          style={{
            display: "block",
            marginLeft: "1.8rem",
            textIndent: "-1.8rem",
          }}
          key={i}
        >
          {parts}
        </code>,
      );
    }
    return elements;
  }, [sql]);
  return (
    <pre
      className="explain-sql"
      style={{ fontSize: "0.75rem", whiteSpace: "pre-wrap" }}
    >
      {formattedSQL}
    </pre>
  );
};

const COLORS = [
  "rgb(255, 69, 0)",
  "rgb(64, 135, 0)",
  "rgb(0, 196, 255)",
  "rgb(255, 0, 247)",
];

const Highlight: FC<{ n: number; children: string }> = ({ n, children }) => {
  const color = COLORS[n % COLORS.length];
  return <strong style={{ color }}>{children}</strong>;
};
