import { inspect } from "util";

import type { PolymorphicData } from "./interfaces.js";
import { $$concreteType } from "./interfaces.js";

export function isPolymorphicData(data: unknown): data is PolymorphicData {
  if (typeof data !== "object" || data == null) {
    return false;
  }
  if (typeof data[$$concreteType] !== "string") {
    return false;
  }
  return true;
}

export function assertPolymorphicData(
  data: unknown,
): asserts data is PolymorphicData {
  if (!isPolymorphicData(data)) {
    throw new Error(`Expected a polymorphic object, received ${inspect(data)}`);
  }
}

// TODO: this doesn't really wrap any more... rename it.
/**
 * Returns an object with the given concrete type.
 */
export function polymorphicWrap<TType extends string>(
  type: TType,
): PolymorphicData<TType> {
  // TODO: validate type further, e.g. that it's a valid object type
  if (typeof type !== "string") {
    throw new Error(
      `Expected a GraphQLObjectType name, but received ${inspect(type)}`,
    );
  }
  return Object.assign(Object.create(null), {
    [$$concreteType]: type,
  });
}

/**
 * All polymorphic objects in Graphile Crystal have a $$concreteType property
 * which contains the GraphQL object's type name; we simply return that.
 */
export function resolveType(o: unknown): string {
  assertPolymorphicData(o);
  return o[$$concreteType];
}
