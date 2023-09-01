import mermaid from "mermaid";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { ExplainHelpers } from "../hooks/useExplain.js";
import type { ExplainResults } from "../hooks/useFetcher.js";
import { Copy } from "./Copy.js";
import { FormatSQL } from "./FormatSQL.js";
import { Mermaid } from "./Mermaid.js";

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
            <p>
              <button onClick={() => setExplain(true)}>Enable explain</button>
            </p>
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
        <div>
          <ExplainMain helpers={helpers} results={results} />
        </div>
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

  const [saving, setSaving] = useState(false);
  const saveSVG = useCallback(() => {
    if (!selectedResult || selectedResult.type !== "plan") return;
    setSaving(true);
    setTimeout(() => {
      /*
      const diagram = planToMermaid(selectedResult.plan);
      mermaid.mermaidAPI.render("id1", diagram).then(({ svg }) => {
        const file = new File([svg], "grafast-plan.svg");

        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = file.name;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        setSaving(false);

        setTimeout(() => {
          URL.revokeObjectURL(a.href);
          a.parentNode!.removeChild(a);
        }, 0);
      });
      */
      alert("TODO: trigger SVG download for the plan diagram");
    }, 0);
  }, [selectedResult]);

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
                <Copy text={selectedResult.explain}>Copy plan</Copy>
              </>
            ) : null}
            <h4>Executed SQL query:</h4>
            <FormatSQL sql={selectedResult.query} />
            <Copy text={selectedResult.query}>Copy SQL</Copy>
          </div>
        );
      }
      case "plan": {
        return (
          <>
            <Copy text={JSON.stringify(selectedResult.plan)}>
              Copy plan JSON
            </Copy>
            <button onClick={saveSVG} disabled={saving}>
              Save Mermaid Diagram (TODO!)
            </button>
            <div onClick={expand}>
              {/*<Mermaid diagram={selectedResult.diagram} />*/ "TODO"}
            </div>
            {expanded
              ? createPortal(
                  <div className="explainExpandedContainer">
                    <div className="explainExpandedTitle">Operation Plan</div>
                    <div className="explainExpandedCloseContainer">
                      <button
                        className="explainExpandedCloseButton"
                        onClick={() => setExpanded(false)}
                      >
                        &times;
                      </button>
                    </div>
                    <div className="explainExpandedMain">
                      {/*<Mermaid diagram={selectedResult.diagram} />*/ "TODO"}
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
