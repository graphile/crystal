import debugFactory from "debug";
import type { GraphQLSchema } from "graphql";
import { isObjectType } from "graphql";

import {
  $$crystalWrapped,
  crystalWrapResolve,
  makeCrystalSubscriber,
} from "./resolvers";

const debug = debugFactory("crystal:enforce");

/**
 * Ensures that all `resolve` and `subscribe` field methods in `schema` are
 * ✨wrapped in crystals✨.
 */
export function crystalEnforce(schema: GraphQLSchema): GraphQLSchema {
  const subscriptionType = schema.getSubscriptionType();
  const types = Object.values(schema.getTypeMap());
  for (const objectType of types) {
    if (isObjectType(objectType) && !objectType.name.startsWith("__")) {
      const fields = objectType.getFields();
      for (const fieldName in fields) {
        if (
          Object.hasOwnProperty.call(fields, fieldName) &&
          !fieldName.startsWith("__")
        ) {
          const field = fields[fieldName];
          const { resolve, subscribe } = field;

          // Wrap `resolve`
          if (!resolve || !resolve[$$crystalWrapped]) {
            debug(
              `Wrapping ${objectType.name}.${fieldName}'s resolve in crystals`,
            );
            field.resolve = crystalWrapResolve(resolve);
          }

          // Wrap `subscribe` if appropriate
          if (
            objectType === subscriptionType &&
            (field.extensions?.graphile as any)?.subscribePlan
          ) {
            if (subscribe && !subscribe[$$crystalWrapped]) {
              throw new Error(
                "We do not support `subscribe` functions existing for fields with a `subscribePlan` - please supply one or the other.",
              );
            } else if (subscribe) {
              /* noop */
            } else {
              debug(
                `Giving ${objectType.name}.${fieldName} a crystal subscriber`,
              );
              field.subscribe = makeCrystalSubscriber();
            }
          }
        }
      }
    }
  }
  return schema;
}
