export function FN<T, TScope extends any[]>(
  factory: (...args: TScope) => T,
  $$scope: [...TScope],
): T {
  const fn: T = factory(...$$scope);
  Object.assign(fn, { $$scope, factory });
  return fn;
}
