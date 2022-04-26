import type { FC } from "react";
import { useEffect, useState } from "react";

import type { ExplainHelpers } from "../hooks/useExplain.js";
import type { ExplainResults } from "../hooks/useFetcher.js";

export const formatSQL = (sql: string): string => sql;

export const Explain: FC<{
  helpers: ExplainHelpers;
  results: ExplainResults | null;
}> = ({ helpers, results }) => {
  const { setShowExplain } = helpers;
  return (
    <>
      <div className="doc-explorer-title-bar">
        <div className="doc-explorer-title">Explain</div>
        <div className="doc-explorer-rhs">
          <button
            className="docExplorerHide"
            aria-label="Close Explain"
            onClick={() => setShowExplain(false)}
          >
            ✕
          </button>
        </div>
      </div>
      <div className="doc-explorer-contents">
        {!results ? (
          <p>
            There are no explain results to display - perhaps you have not yet
            ran an operation against a server that supports this feature?
          </p>
        ) : results.operations.length === 0 ? (
          <p>Empty explain results</p>
        ) : (
          <ExplainMain helpers={helpers} results={results} />
        )}
      </div>
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
        return <div>TODO: diagram</div>;
      }
      case undefined: {
        return (
          <div>
            Explain result type '${(selectedResult as any).type}' not yet
            supported.
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
