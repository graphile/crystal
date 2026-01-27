import type { GraphiQLPlugin } from "@graphiql/react";
import { RootTypeIcon } from "@graphiql/react";
import type { FC } from "react";
import { useCallback, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { Download } from "../components/Download.tsx";

const DownloadPanel: FC = () => {
  const [counter, setCounter] = useState(0);
  const retry = useCallback(() => {
    setCounter((counter) => counter + 1);
  }, []);
  return (
    <div>
      <div className="graphiql-doc-explorer-header">
        <div className="graphiql-doc-explorer-title">SDL</div>
      </div>
      <p>
        The Schema Definition Language (SDL, aka Interface Definition Language -
        IDL) is the language used to describe the type system of a GraphQL
        schema. It can be useful for discussion, and also as input to tooling
        such as code generators.
      </p>
      <p>
        Below you will find the SDL for the current schema along with the
        ability to download it or copy it to your clipboard. You may customize
        the SDL output with the options below.
      </p>
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
  title: "SDL",
  icon: RootTypeIcon,
  content: DownloadPanel,
};
