import debugFactory from "debug";
import type { GraphQLSchema } from "graphql";
import { isObjectType } from "graphql";

import {
  dataplannerResolver,
  dataplannerSubscriber,
  isCrystalWrapped,
} from "./resolvers.js";

const debug = debugFactory("dataplanner:enforce");

/**
 * Ensures that all `resolve` and `subscribe` field methods in `schema` are
 * ✨wrapped in crystals✨.
 */
export function dataplannerEnforce(schema: GraphQLSchema): GraphQLSchema {
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
          if (!resolve || !isCrystalWrapped(resolve)) {
            debug(
              `Wrapping %s.%s's resolve in crystals`,
              objectType.name,
              fieldName,
            );
            field.resolve = dataplannerResolver(resolve);
          }

          // Wrap `subscribe` if appropriate
          if (
            objectType === subscriptionType &&
            (field.extensions?.graphile as any)?.subscribePlan
          ) {
            if (subscribe && !isCrystalWrapped(subscribe)) {
              throw new Error(
                "We do not support `subscribe` functions existing for fields with a `subscribePlan` - please supply one or the other.",
              );
            } else if (subscribe) {
              /* noop */
            } else {
              debug(
                `Giving %s.%s a crystal subscriber`,
                objectType.name,
                fieldName,
              );
              field.subscribe = dataplannerSubscriber();
            }
          }
        }
      }
    }
  }
  return schema;
}
