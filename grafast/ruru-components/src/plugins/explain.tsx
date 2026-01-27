import type { GraphiQLPlugin } from "@graphiql/react";
import { MagnifyingGlassIcon } from "@graphiql/react";
import type { FC } from "react";
import { useContext } from "react";

import { Explain } from "../components/Explain.tsx";
import { ExplainContext } from "../hooks/useExplain.ts";

const ExplainPanel: FC = () => {
  const { explainHelpers, explain, explainResults, setExplain } =
    useContext(ExplainContext);

  return (
    <div>
      <div className="graphiql-doc-explorer-header">
        <div className="graphiql-doc-explorer-title">Explain</div>
      </div>
      <div className="graphiql-doc-explorer-content">
        <Explain
          explain={explain}
          setExplain={setExplain}
          helpers={explainHelpers}
          results={explainResults}
        />
      </div>
    </div>
  );
};

export const EXPLAIN_PLUGIN: GraphiQLPlugin = {
  title: "Explain",
  icon: MagnifyingGlassIcon,
  content: ExplainPanel,
};
