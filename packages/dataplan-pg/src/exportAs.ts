export function exportAs<T>(thing: T, exportName: string | string[]): T {
  Object.defineProperty(thing, "$$export", {
    value: { moduleName: "@dataplan/pg", exportName },
  });
  return thing;
}
