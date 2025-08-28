export function isNotNullish<T>(input: T | null | undefined): input is T {
  return input != null;
}

export function isImportable(
  thing: unknown,
): thing is { $$export: { moduleName: string; exportName: string } } {
  return (
    (typeof thing === "object" || typeof thing === "function") &&
    thing !== null &&
    "$$export" in thing &&
    typeof thing.$$export === "object" &&
    thing.$$export !== null
  );
}
