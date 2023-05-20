import "graphile-config";

import { constant, operationPlan } from "grafast";
import { EXPORTABLE } from "../utils.js";

export const RegisterQueryNodePlugin: GraphileConfig.Plugin = {
  name: "RegisterQueryNodePlugin",
  version: "1.0.0",
  description: `Registers the 'Query' type as a 'Node' type. You probably don't want this.`,

  schema: {
    hooks: {
      init(_, build) {
        if (!build.registerNodeIdHandler) {
          return _;
        }
        build.registerNodeIdHandler({
          typeName: build.inflection.builtin("Query"),
          codecName: "raw",
          match: EXPORTABLE(
            () => (specifier) => {
              return specifier === "query";
            },
            [],
          ),
          getSpec: () => "irrelevant",
          get: EXPORTABLE(
            (operationPlan) => () => {
              return operationPlan().rootValueStep;
            },
            [operationPlan],
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
