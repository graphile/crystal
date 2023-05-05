import mermaid from "mermaid";
import type { FC } from "react";
import { useEffect } from "react";

mermaid.initialize({
  startOnLoad: true,
  maxTextSize: 1000000,
});

export const Mermaid: FC<{ diagram: string }> = ({ diagram }) => {
  useEffect(() => {
    if (diagram) {
      mermaid.contentLoaded();
    }
  }, [diagram]);
  return (
    <div className="mermaid" key={diagram}>
      {diagram}
    </div>
  );
};
