import "graphile-config";

import { constant, opPlan } from "dataplanner";
import { EXPORTABLE } from "graphile-export";

export const RegisterQueryNodePlugin: GraphileConfig.Plugin = {
  name: "RegisterQueryNodePlugin",
  version: "1.0.0",
  description: `Registers the 'Query' type as a 'Node' type. You probably don't want this.`,

  schema: {
    hooks: {
      init(_, build) {
        build.registerNodeIdHandler(build.inflection.builtin("Query"), {
          codecName: "raw",
          match: EXPORTABLE(
            () => (specifier) => {
              return specifier === "query";
            },
            [],
          ),
          get: EXPORTABLE(
            (opPlan) => () => {
              return opPlan().rootValueStep;
            },
            [opPlan],
          ),
          plan: EXPORTABLE(
            (constant) => () => {
              return constant`query`;
            },
            [constant],
          ),
        });

        return _;
      },
    },
  },
};
