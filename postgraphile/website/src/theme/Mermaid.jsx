import mermaid from "mermaid";
import React, { useEffect } from "react";

mermaid.initialize({
  startOnLoad: true,
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
