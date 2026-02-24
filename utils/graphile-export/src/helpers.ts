export function EXPORTABLE<T, TScope extends readonly any[]>(
  factory: (...args: TScope) => T,
  args: readonly [...TScope],
  nameHint?: string,
): T {
  const forbiddenIndex = args.findIndex(isForbidden);
  if (forbiddenIndex >= 0) {
    throw new Error(
      `${nameHint ?? "Anonymous"} EXPORTABLE call's args[${forbiddenIndex}] is not allowed to be exported.`,
    );
  }
  const fn: T = factory(...args);
  if (
    ((typeof fn === "object" && fn !== null) || typeof fn === "function") &&
    !("$exporter$factory" in fn)
  ) {
    Object.defineProperties(fn, {
      $exporter$args: { value: args },
      $exporter$factory: { value: factory },
      $exporter$name: { writable: true, value: nameHint },
    });
  }
  return fn;
}

export function isForbidden(thing: unknown): thing is { $$export: false } {
  return (
    (typeof thing === "object" || typeof thing === "function") &&
    thing !== null &&
    "$$export" in thing &&
    thing.$$export === false
  );
}
