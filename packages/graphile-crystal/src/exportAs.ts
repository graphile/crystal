/**
 * @internal
 */
export function exportAs<T>(thing: T, exportName: string): T {
  Object.defineProperty(thing, "$$export", {
    value: { moduleName: "graphile-crystal", exportName },
  });
  return thing;
}

/**
 * @internal
 */
export function exportAsMany(all: { [key: string]: any }): void {
  for (const key of Object.keys(all)) {
    const value = all[key];
    if (
      (typeof value === "object" || typeof value === "function") &&
      value !== null &&
      !("$$export" in value)
    ) {
      exportAs(all[key], key);
    }
  }
}
