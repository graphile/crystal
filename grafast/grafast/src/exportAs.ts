import { arraysMatch } from "./utils.js";

/**
 * Marks that `thing` is exported from the `grafast` module as
 * `exportName` so that `graphile-export` can convert references to `thing`
 * into an `import` statement.
 *
 * @internal
 */
export function exportAs<T extends object>(
  moduleName: string,
  thing: T,
  exportName: string | string[],
): T {
  if (!("$$export" in thing)) {
    Object.defineProperty(thing, "$$export", {
      value: { moduleName, exportName },
    });
  } else {
    const e = thing.$$export as {
      moduleName: string;
      exportName: string | string[];
    };
    if (e.moduleName !== moduleName) {
      throw new Error(
        `Attempted to export ${thing} as '${moduleName}.${exportName}', but it's already exported as '${e.moduleName}.${e.exportName}' (module name mismatch)`,
      );
    }
    if (typeof e.exportName === "string" || exportName === "string") {
      if (e.exportName !== exportName) {
        throw new Error(
          `Attempted to export ${thing} as '${moduleName}.${exportName}', but it's already exported as '${e.moduleName}.${e.exportName}' (export name mismatch)`,
        );
      }
    } else {
      // Must be arrays
      if (
        !Array.isArray(e.exportName) ||
        !Array.isArray(exportName) ||
        !arraysMatch(e.exportName, exportName)
      ) {
        throw new Error(
          `Attempted to export ${thing} as '${moduleName}.${exportName}', but it's already exported as '${e.moduleName}.${e.exportName}' (export name path mismatch)`,
        );
      }
    }
  }
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
      value !== null
    ) {
      exportAs(moduleName, all[key], key);
    }
  }
}
