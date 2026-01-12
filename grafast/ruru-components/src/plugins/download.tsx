import type { GraphiQLPlugin } from "@graphiql/react";
import { ChevronDownIcon } from "@graphiql/react";
import type { FC } from "react";
import { useCallback, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Download } from "../components/Download.js";

const DownloadPanel: FC = () => {
  const [counter, setCounter] = useState(0);
  const retry = useCallback(() => {
    setCounter((counter) => counter + 1);
  }, []);
  return (
    <div>
      <div className="graphiql-doc-explorer-header">
        <div className="graphiql-doc-explorer-title">Download SDL</div>
      </div>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div>
            <p>{error?.message ?? "Something went wrong"}</p>
            <button onSubmit={retry}>Retry</button>
          </div>
        )}
      >
        <div className="graphiql-doc-explorer-content">
          <Download key={counter} />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export const DOWNLOAD_PLUGIN: GraphiQLPlugin = {
  title: "Download",
  icon: ChevronDownIcon,
  content: DownloadPanel,
};
