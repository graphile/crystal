import "graphile-config";

import { constant } from "grafast";

import { EXPORTABLE } from "../utils.ts";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      RegisterQueryNodePlugin: true;
    }
  }
}

const EMPTY_OBJECT = Object.freeze({});

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
          codec: build.getNodeIdCodec!("raw"),
          match: EXPORTABLE(
            () => (specifier) => {
              return specifier === "query";
            },
            [],
          ),
          getIdentifiers(_value) {
            return [];
          },
          getSpec: () => "irrelevant",
          get: EXPORTABLE(
            (EMPTY_OBJECT, constant) => () => {
              return constant(EMPTY_OBJECT);
            },
            [EMPTY_OBJECT, constant],
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
