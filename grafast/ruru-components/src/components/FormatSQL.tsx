import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";

export const FormatSQL: FC<{ sql: string }> = ({ sql }) => {
  const [highlitIndex, setHighlitIndex] = useState(null);
  const formattedSQL = useMemo(() => {
    const lines = sql.split("\n");
    const elements: JSX.Element[] = [];
    const knownIdentifiers = new Map<string, JSX.Element>();
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
          const index = identifierCount++;
          const sub = (
            <Highlight
              n={index}
              highlit={index === highlitIndex}
              setHighlitIndex={setHighlitIndex}
            >
              {full}
            </Highlight>
          );
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
      const line = lines[i];
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
  }, [sql, highlitIndex]);
  return <pre className="explain-sql">{formattedSQL}</pre>;
};

const COLORS = [
  "#00bfff",
  "#ffa500",
  "#7fff00",
  "#ff1493",
  "#808000",
  "#dda0dd",
  "#ff0000",
  "#4169e1",
  "#3cb371",
  "#a52a2a",
  "#ff00ff",
];

const Highlight: FC<{
  n: number;
  highlit: boolean;
  setHighlitIndex: any;
  children: string;
}> = ({ n, highlit, setHighlitIndex, children }) => {
  const color = COLORS[n % COLORS.length];
  const style = highlit
    ? {
        color,
        borderRadius: "3px",
        fontWeight: "900",
        backgroundColor:
          "hsla(var(--color-primary),var(--alpha-background-medium))",
      }
    : { color };
  const onMouseEnter = useCallback(() => {
    setHighlitIndex(n);
  }, [setHighlitIndex, n]);
  const onMouseLeave = useCallback(() => {
    setHighlitIndex(null);
  }, [setHighlitIndex]);
  return (
    <strong
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </strong>
  );
};
