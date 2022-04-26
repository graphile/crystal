import mermaid from "mermaid";
import { FC, useEffect } from "react";

export const Mermaid: FC<{ diagram: string }> = ({ diagram }) => {
  useEffect(() => {
    if (diagram) {
      (mermaid as any).contentLoaded();
    }
  }, [diagram]);
  return (
    <div className="mermaid" key={diagram}>
      {diagram}
    </div>
  );
};
