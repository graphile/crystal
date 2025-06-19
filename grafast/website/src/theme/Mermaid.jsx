import mermaid from "mermaid";
import React, { useCallback, useMemo } from "react";

mermaid.initialize({
  startOnLoad: false,
  flowchart: {
    diagramPadding: 8,
    nodeSpacing: 20, // 50
    rankSpacing: 40, // 50
    htmlLabels: true,
  },
});

let counter = 0;
const Mermaid = ({ chart }) => {
  const key = useMemo(() => `mermaid-${++counter}`);
  const render = useCallback(
    (el) => {
      if (!el) return;
      mermaid
        .render(key, chart)
        .then(({ svg }) => void (el.innerHTML = svg))
        .catch((e) => void console.error(e));
    },
    [chart, key],
  );
  return <div key={key} ref={render} />;
};

export default Mermaid;
