import type { FC } from "react";

import type { ExplainHelpers } from "../hooks/useExplain.js";

export const Explain: FC<{ helpers: ExplainHelpers }> = ({
  helpers: { setShowExplain },
}) => {
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
        <div className="doc-explorer-contents"></div>
      </div>
    </>
  );
};
