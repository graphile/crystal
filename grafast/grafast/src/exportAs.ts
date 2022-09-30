/**
 * Marks that `thing` is exported from the `grafast` module as
 * `exportName` so that `graphile-export` can convert references to `thing`
 * into an `import` statement.
 *
 * @internal
 */
export function exportAs<T>(
  moduleName: string,
  thing: T,
  exportName: string,
): T {
  Object.defineProperty(thing, "$$export", {
    value: { moduleName, exportName },
  });
  return thing;
}

/**
 * Marks that each value in `all` is exported from the `grafast`
 * module as the key in the `all` object so that `graphile-export` can
 * convert references to these values into `import` statements.
 *
 * @internal
 */
export function exportAsMany(
  moduleName: string,
  all: { [key: string]: any },
): void {
  for (const key of Object.keys(all)) {
    const value = all[key];
    if (
      (typeof value === "object" || typeof value === "function") &&
      value !== null &&
      !("$$export" in value)
    ) {
      exportAs(moduleName, all[key], key);
    }
  }
}
