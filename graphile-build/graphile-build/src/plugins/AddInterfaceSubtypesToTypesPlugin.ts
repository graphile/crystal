import "graphile-config";

import { GraphQLNamedType } from "graphql";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      AddInterfaceSubtypesToTypesPlugin: true;
    }
  }
}

export const AddInterfaceSubtypesToTypesPlugin: GraphileConfig.Plugin = {
  name: "AddInterfaceSubtypesToTypesPlugin",
  version,
  description: `Ensures that subtypes of an interface are added to the schema even if they're not directly referenced`,

  schema: {
    hooks: {
      GraphQLSchema_types: {
        after: ["CollectReferencedTypesPlugin"],
        callback(types, build) {
          const {
            graphql: { GraphQLObjectType },
          } = build;
          const allTypes = Object.values(build.getAllTypes());
          for (const t of allTypes) {
            if (
              t != null &&
              t instanceof GraphQLObjectType &&
              t.getInterfaces().length !== 0
            ) {
              types.push(t);
            }
          }
          return types;
        },
      },
    },
  },
};
