export const $$concreteType = Symbol("concreteType");
export interface PolymorphicData<TType extends string = string, TData = any> {
  [$$concreteType]: TType;
  data: TData;
}

export function isPolymorphicData(data: unknown): data is PolymorphicData {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  if (typeof (data as any)[$$concreteType] !== "string") {
    return false;
  }
  return true;
}

/**
 * Returns an object with the given concrete type (and, optionally, associated
 * data)
 */
export function polymorphicWrap<TType extends string, TData>(
  type: TType,
  data: TData,
): PolymorphicData<TType, TData> {
  if (data == null) {
    throw new Error(`polymorphicWrap mustn't receive null-like data`);
  }
  return { [$$concreteType]: type, data };
}
