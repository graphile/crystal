import React, { useEffect } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
  themeVariables: { fontSize: "12px" },
  flowchart: {
    diagramPadding: 8,
    nodeSpacing: 20, // 50
    rankSpacing: 40, // 50
    htmlLabels: true,
  },
});

const Mermaid = ({ chart }) => {
  useEffect(() => {
    mermaid.contentLoaded();
  }, []);
  return <div className="mermaid">{chart}</div>;
};

export default Mermaid;
