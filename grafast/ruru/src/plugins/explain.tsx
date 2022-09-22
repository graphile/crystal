import type { GraphiQLPlugin } from "@graphiql/react";
import { MagnifyingGlassIcon } from "@graphiql/react";
import type { FC} from "react";
import { useContext } from "react";

import { Explain } from "../components/Explain.js";
import { ExplainContext } from "../hooks/useExplain.js";

const ExplainPanel: FC = () => {
  const { explainHelpers, explain, setExplain, explainResults } =
    useContext(ExplainContext);
  return (
    <div>
      <h1>Explain</h1>
      <Explain
        explain={explain}
        setExplain={setExplain}
        helpers={explainHelpers}
        results={explainResults}
      />
    </div>
  );
};

export const EXPLAIN_PLUGIN: GraphiQLPlugin = {
  title: "Explain",
  icon: MagnifyingGlassIcon,
  content: ExplainPanel,
};
