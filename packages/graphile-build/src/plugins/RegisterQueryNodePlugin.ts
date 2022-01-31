import { constant, node, NodePlan } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import type { GraphQLInterfaceType } from "graphql";

import { isValidObjectType } from "../utils.js";

export const RegisterQueryNodePlugin: Plugin = {
  name: "RegisterQueryNodePlugin",
  version: "1.0.0",
  description: `Registers the 'Query' type as a 'Node' type`,

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
            (constant) => () => {
              return constant({});
            },
            [constant],
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
