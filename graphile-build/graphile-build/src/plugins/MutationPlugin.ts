import "graphile-config";

import { __ValueStep } from "grafast";

import { isValidObjectType } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      MutationPlugin: true;
    }
    interface Provides {
      Mutation: true;
    }
  }
}

/**
 * This plugin registers the operation type for the 'mutation' operation, and
 * if that type adds at least one field then it will be added to the GraphQL
 * schema.
 *
 * By default we call this type `Mutation`, but you can rename it using the
 * `builtin` inflector.
 *
 * Removing this plugin will mean that your GraphQL schema will not allow
 * mutation operations.
 */
export const MutationPlugin: GraphileConfig.Plugin = {
  name: "MutationPlugin",
  description: "Adds the 'Mutation' type to the GraphQL schema",
  version: version,
  schema: {
    hooks: {
      init: {
        callback: (_, build, _context) => {
          const { inflection } = build;

          build.registerObjectType(
            inflection.builtin("Mutation"),
            {
              isRootMutation: true,
            },
            () => ({
              assertStep: __ValueStep,
              description:
                "The root mutation type which contains root level fields which mutate data.",
            }),
            `graphile-build built-in (root mutation type)`,
          );

          return _;
        },
      },

      GraphQLSchema: {
        callback: (schema, build, _context) => {
          const { getTypeByName, extend, inflection, handleRecoverableError } =
            build;

          // IIFE to get the mutation type, handling errors occurring during
          // validation.
          const Mutation = (() => {
            try {
              const Type = getTypeByName(inflection.builtin("Mutation"));

              if (isValidObjectType(Type)) {
                return Type;
              }
            } catch (e) {
              handleRecoverableError(e);
            }
            return null;
          })();

          if (Mutation == null) {
            return schema;
          }

          // Errors thrown here (e.g. due to naming conflicts) should be raised,
          // hence this is outside of the IIFE.
          return extend(
            schema,
            { mutation: Mutation },
            "Adding mutation type to schema",
          );
        },
        provides: ["Mutation"],
        before: [],
        after: ["Query"],
      },
    },
  },
};
