/** Throws if an introspection collection needed by a helper was omitted. */
export function assertExists<T>(
  value: T,
  entity: string,
): asserts value is NonNullable<T> {
  if (value == null) {
    throw new Error(
      `Introspection collection '${entity}' is required but was not included`,
    );
  }
}
