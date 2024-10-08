import "graphile-config";

import type { GraphQLNamedType } from "graphql";

import { collectReferencedTypes } from "../vendor/collectReferencedTypes.js";
import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      CollectReferencedTypesPlugin: true;
    }
  }
}

export const CollectReferencedTypesPlugin: GraphileConfig.Plugin = {
  name: "CollectReferencedTypesPlugin",
  version,
  description: `Emulates graphql.js' behavior of collecting the types in a particular order`,

  schema: {
    hooks: {
      GraphQLSchema_types(types, build, context) {
        const set = new Set<GraphQLNamedType>(types);
        for (const type of types) {
          set.delete(type);
          collectReferencedTypes(type, set);
        }
        const { config } = context;
        if (config.query) {
          collectReferencedTypes(config.query, set);
        }
        if (config.mutation) {
          collectReferencedTypes(config.mutation, set);
        }
        if (config.subscription) {
          collectReferencedTypes(config.subscription, set);
        }
        return [...set];
      },
    },
  },
};
