import "graphile-plugin";

import { aether, constant } from "dataplanner";
import { EXPORTABLE } from "graphile-export";

export const RegisterQueryNodePlugin: GraphilePlugin.Plugin = {
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
            (aether) => () => {
              return aether().rootValuePlan;
            },
            [aether],
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
