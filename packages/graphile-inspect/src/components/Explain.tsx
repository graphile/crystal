import type { FC } from "react";

import type { ExplainHelpers } from "../hooks/useExplain.js";
import type { ExplainResults } from "../hooks/useFetcher.js";

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
  return (
    <div>
      <select>
        {results.operations.map((o, i) => (
          <option value={i}>{o.title}</option>
        ))}
      </select>
    </div>
  );
};
