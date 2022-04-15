export function EXPORTABLE<T, TScope extends any[]>(
  factory: (...args: TScope) => T,
  args: [...TScope],
): T {
  const fn: T = factory(...args);
  Object.defineProperties(fn, {
    $exporter$args: { value: args },
    $exporter$factory: { value: factory },
  });
  return fn;
}
