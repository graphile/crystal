import type { PolymorphicData } from "./interfaces.js";
export declare function isPolymorphicData(data: unknown): data is PolymorphicData;
export declare function assertPolymorphicData(data: unknown): asserts data is PolymorphicData;
/**
 * Returns an object with the given concrete type (and, optionally, associated
 * data)
 */
export declare function polymorphicWrap<TType extends string, TData>(type: TType, data?: TData): PolymorphicData<TType, TData>;
/**
 * All polymorphic objects in Grafast have a $$concreteType property which
 * contains the GraphQL object's type name; we simply return that.
 */
export declare function resolveType(o: unknown): string;
//# sourceMappingURL=polymorphic.d.ts.map