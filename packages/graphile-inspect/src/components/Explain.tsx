import type { FC } from "react";

export const Explain: FC = () => {
  return (
    <>
      <div className="doc-explorer-title-bar">
        <div className="doc-explorer-title">Explain</div>
        <div className="doc-explorer-rhs">
          <button className="docExplorerHide" aria-label="Close Explain">
            ✕
          </button>
        </div>
        <div className="doc-explorer-contents"></div>
      </div>
    </>
  );
};
