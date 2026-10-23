import type { BaseGraphQLArguments } from "grafast";

/** Converts generated field argument metadata into its runtime argument type. */
export type GeneratedFieldArgs<TArgs> = {
  [TArgName in keyof TArgs as TArgs[TArgName] extends {
    optional: true;
  }
    ? never
    : TArgName]: TArgs[TArgName] extends { type: infer TType } ? TType : never;
} & {
  [TArgName in keyof TArgs as TArgs[TArgName] extends {
    optional: true;
  }
    ? TArgName
    : never]?: TArgs[TArgName] extends { type: infer TType } ? TType : never;
} extends infer TGeneratedArgs extends BaseGraphQLArguments
  ? TGeneratedArgs
  : never;

export type KeysOfUnion<T> = T extends T ? keyof T : never;

/** The keys shared by every member of a union. */
export type CommonKeys<T> = {
  [TKey in KeysOfUnion<T>]: [T] extends [Record<TKey, unknown>] ? TKey : never;
}[KeysOfUnion<T>];

export type ValueForKey<T, TKey extends PropertyKey> =
  T extends Record<TKey, infer TValue> ? TValue : never;
