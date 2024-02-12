export function EXPORTABLE<T, TScope extends any[]>(
  factory: (...args: TScope) => T,
  args: [...TScope],
  nameHint?: string,
): T {
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
