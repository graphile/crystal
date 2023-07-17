import { inspect } from "./inspect.js";
import type { PolymorphicData } from "./interfaces.js";
import { $$concreteType } from "./interfaces.js";

export function isPolymorphicData(data: unknown): data is PolymorphicData {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  if (typeof (data as any)[$$concreteType] !== "string") {
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

// const EMPTY_OBJECT = Object.freeze(Object.create(null));

/**
 * Returns an object with the given concrete type (and, optionally, associated
 * data)
 */
export function polymorphicWrap<TType extends string, TData>(
  type: TType,
  // TODO: when we stop mutating `data` we can replace this with `EMPTY_OBJECT`
  data: TData = Object.create(null),
): PolymorphicData<TType, TData> {
  // ENHANCE: validate type further, e.g. that it's a valid object type
  if (typeof type !== "string") {
    throw new Error(
      `Expected a GraphQLObjectType name, but received ${inspect(type)}`,
    );
  }
  if (data == null) {
    throw new Error(`polymorphicWrap mustn't receive null-like data`);
  }
  Object.defineProperty(data, $$concreteType, {
    value: type,
    enumerable: false,
    writable: false,
    configurable: false,
  });
  // TODO: should NOT mutate `data`, instead use a wrapper object and rewire
  // through the pipeline.
  return data as unknown as PolymorphicData<TType, TData>;
  /*
  return Object.assign(Object.create(null), {
    [$$concreteType]: type,
    [$$data]: data,
  });
  */
}

/**
 * All polymorphic objects in Grafast have a $$concreteType property which
 * contains the GraphQL object's type name; we simply return that.
 */
export function resolveType(o: unknown): string {
  assertPolymorphicData(o);
  return o[$$concreteType];
}

/* TODO: we should be extracting data from a subproperty when we rewrite how polymorphism works.
/* *
 * All polymorphic objects in Grafast have a $$concreteType property which
 * contains the GraphQL object's type name; we simply return that.
 * /
export function resolveData(o: unknown): string {
  assertPolymorphicData(o);
  return o[$$data];
}
*/
