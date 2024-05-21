export function isPromiseLike<T>(
  value: T | PromiseLike<T>,
): value is PromiseLike<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as any).then === "function"
  );
}
