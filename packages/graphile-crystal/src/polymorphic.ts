import { inspect } from "util";

import type { PolymorphicData } from "./interfaces";
import { $$concreteData, $$concreteType } from "./interfaces";

export function isPolymorphicData(data: unknown): data is PolymorphicData {
  if (typeof data !== "object" || !data) {
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

export function polymorphicWrap<TType extends string, TData>(
  type: TType,
  data: TData,
): PolymorphicData<TType, TData> {
  // TODO: validate type further, e.g. that it's a valid object type
  if (typeof type !== "string") {
    throw new Error(
      `Expected a GraphQLObjectType name, but received ${inspect(type)}`,
    );
  }
  return {
    [$$concreteType]: type,
    [$$concreteData]: data,
  };
}

export function resolveType(o: unknown): string {
  assertPolymorphicData(o);
  return o[$$concreteType];
}
