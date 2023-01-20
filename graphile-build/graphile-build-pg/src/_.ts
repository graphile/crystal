// PERF: benchmark this; might be faster to use `Array.from()` or an explicit
// for loop with set existance check
/**
 * Returns a new array containing only the unique elements of `list`.
 */
export function uniq<T>(list: T[]): T[] {
  return [...new Set(list)];
}
