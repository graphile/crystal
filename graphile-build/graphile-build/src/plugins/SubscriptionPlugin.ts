import "graphile-config";

import { __ValueStep } from "grafast";

import { isValidObjectType } from "../utils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      SubscriptionPlugin: true;
    }
  }
}

/**
 * This plugin registers the operation type for the 'subscription' operation, and
 * if that type adds at least one field then it will be added to the GraphQL
 * schema.
 *
 * By default we call this type `Subscription`, but you can rename it using the
 * `builtin` inflector.
 *
 * Removing this plugin will mean that your GraphQL schema will not allow
 * subscription operations.
 */
export const SubscriptionPlugin: GraphileConfig.Plugin = {
  name: "SubscriptionPlugin",
  description:
    "Adds the 'Subscription' type to handle 'subscription' operations. Only use this if you want realtime features in your GraphQL API.",
  version: version,
  schema: {
    hooks: {
      init: {
        callback: (_, build, _context) => {
          const { inflection } = build;

          build.registerObjectType(
            inflection.builtin("Subscription"),
            {
              isRootSubscription: true,
            },
            () => ({
              assertStep: __ValueStep,
              description: `The root subscription type: contains realtime events you can subscribe to with the \`subscription\` operation.`,
            }),
            `graphile-build built-in (root subscription type)`,
          );

          return _;
        },
      },
      GraphQLSchema: {
        callback: (schema, build, _context) => {
          const { getTypeByName, extend, inflection, handleRecoverableError } =
            build;

          // IIFE to get the subscription type, handling errors occurring during
          // validation.
          const Subscription = (() => {
            try {
              const Type = getTypeByName(inflection.builtin("Subscription"));

              if (isValidObjectType(Type)) {
                return Type;
              }
            } catch (e) {
              handleRecoverableError(e);
            }
            return null;
          })();

          if (Subscription == null) {
            return schema;
          }

          // Errors thrown here (e.g. due to naming conflicts) should be raised,
          // hence this is outside of the IIFE.
          return extend(
            schema,
            { subscription: Subscription },
            "Adding subscription type to schema",
          );
        },
        provides: ["Subscription"],
        before: [],
        after: ["Query"],
      },
    },
  },
};
