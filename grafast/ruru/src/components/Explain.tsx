import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { ExplainHelpers } from "../hooks/useExplain.js";
import type { ExplainResults } from "../hooks/useFetcher.js";
import { Copy } from "./Copy.js";
import { Mermaid } from "./Mermaid.js";

export const formatSQL = (sql: string): string => sql;

export const Explain: FC<{
  explain: boolean;
  setExplain: (newExplain: boolean) => void;
  helpers: ExplainHelpers;
  results: ExplainResults | null;
}> = ({ explain, setExplain, helpers, results }) => {
  return (
    <>
      {!results ? (
        !explain ? (
          <>
            <p>
              WARNING: you&apos;ve not enabled the &apos;explain&apos;
              functionality
            </p>
            <button onClick={() => setExplain(true)}>Enable explain</button>
          </>
        ) : (
          <p>
            There are no explain results to display - perhaps you have not yet
            ran an operation against a server that supports this feature?
          </p>
        )
      ) : results.operations.length === 0 ? (
        <p>Empty explain results</p>
      ) : (
        <ExplainMain helpers={helpers} results={results} />
      )}
    </>
  );
};

export const ExplainMain: FC<{
  helpers: ExplainHelpers;
  results: ExplainResults;
}> = ({ results }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);
  const selectedResult = results.operations[selectedIndex];

  const [expanded, setExpanded] = useState(false);
  const expand = useCallback(() => {
    setExpanded(true);
  }, []);
  const nodeRef = useRef<HTMLDivElement>();
  if (!nodeRef.current) {
    nodeRef.current = document.createElement("div");
  }
  const node = nodeRef.current;
  useEffect(() => {
    document.body.appendChild(node);
    return () => {
      document.body.removeChild(node);
    };
  }, [node]);

  const component = (() => {
    switch (selectedResult?.type) {
      case "sql": {
        return (
          <div>
            {selectedResult.explain ? (
              <>
                <h4>
                  Result from SQL{" "}
                  <a href="https://www.postgresql.org/docs/current/sql-explain.html">
                    EXPLAIN
                  </a>{" "}
                  on executed query:
                </h4>
                <pre className="explain-plan">
                  <code>{selectedResult.explain}</code>
                </pre>
              </>
            ) : null}
            <h4>Executed SQL query:</h4>
            <pre className="explain-sql">
              <code>{formatSQL(selectedResult.query)}</code>
            </pre>
          </div>
        );
      }
      case "mermaid-js": {
        return (
          <>
            <Copy text={selectedResult.diagram}>
              Copy Mermaid.js Definition
            </Copy>
            <div onClick={expand}>
              <Mermaid diagram={selectedResult.diagram} />
            </div>
            {expanded
              ? createPortal(
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      left: "1rem",
                      bottom: "1rem",
                      right: "1rem",
                      borderRadius: "1rem",
                      backgroundColor: "white",
                      border: "1px solid black",
                      boxShadow: "rgba(0,0,0,0.8) 3px 3px 15px",
                      overflow: "hidden",
                      padding: "1rem",
                      zIndex: 6,
                      fontFamily: '"Roboto", sans-serif',
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2rem",
                        textAlign: "center",
                        fontSize: "1.5rem",
                      }}
                    >
                      Operation Plan
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                      }}
                    >
                      <button
                        style={{
                          fontSize: "2rem",
                          padding: 0,
                          margin: 0,
                          background: "transparent",
                          border: "none",
                          outline: "none",
                          width: "2rem",
                          height: "2rem",
                        }}
                        onClick={() => setExpanded(false)}
                      >
                        &times;
                      </button>
                    </div>
                    <div
                      style={{
                        overflow: "auto",
                        position: "absolute",
                        top: "2rem",
                        bottom: 0,
                        left: 0,
                        right: 0,
                      }}
                    >
                      <Mermaid diagram={selectedResult.diagram} />
                    </div>
                  </div>,

                  node,
                )
              : null}
          </>
        );
      }
      case undefined: {
        return (
          <div>
            Explain result type &apos;${(selectedResult as any).type}&apos; not
            yet supported.
          </div>
        );
      }
      default: {
        return <div></div>;
      }
    }
  })();
  return (
    <div>
      <select
        value={String(selectedIndex)}
        onChange={(e) => setSelectedIndex(parseInt(e.target.value, 10))}
      >
        {results.operations.map((o, i) => (
          <option value={String(i)} key={i}>
            {o.title}
          </option>
        ))}
      </select>
      {component}
    </div>
  );
};
