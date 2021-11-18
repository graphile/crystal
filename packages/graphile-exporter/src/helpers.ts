export function EXPORTABLE<T, TScope extends any[]>(
  factory: (...args: TScope) => T,
  args: [...TScope],
): T {
  const fn: T = factory(...args);
  Object.assign(fn, { $exporter$args: args, $exporter$factory: factory });
  return fn;
}
