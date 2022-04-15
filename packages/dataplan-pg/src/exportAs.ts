/**
 * Adds the `$$export` property to `thing` so that `graphile-export` will
 * know that this thing can be imported from `@dataplan/pg` rather than having
 * to try and write it out.
 */
export function exportAs<T>(thing: T, exportName: string | string[]): T {
  Object.defineProperty(thing, "$$export", {
    value: { moduleName: "@dataplan/pg", exportName },
  });
  return thing;
}
