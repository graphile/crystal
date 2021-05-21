import debugFactory from "debug";
import { GraphQLSchema, isObjectType } from "graphql";

import {
  $$crystalWrapped,
  crystalWrapResolve,
  crystalWrapSubscribe,
} from "./resolvers";

const debug = debugFactory("crystal:enforce");

/**
 * Ensures that all `resolve` and `subscribe` field methods in `schema` are
 * ✨wrapped in crystals✨.
 */
export function crystalEnforce(schema: GraphQLSchema): GraphQLSchema {
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
          if (subscribe && !subscribe[$$crystalWrapped]) {
            debug(
              `Wrapping ${objectType.name}.${fieldName}'s subscribe in crystals`,
            );
            field.subscribe = crystalWrapSubscribe(subscribe);
          }
        }
      }
    }
  }
  return schema;
}
