/*
 * Due to the following Jest issue, GraphQL's `instanceof Error` test
 * cannot pass for Node assertions. So we have to define our own.
 *
 * https://github.com/facebook/jest/issues/2549
 */

export function ok(val: any, message: string): asserts val {
  if (!val) {
    throw new Error(message);
  }
}

export function strictEqual<T>(
  actual: any,
  expected: T,
  message: string,
): asserts actual is T {
  if (actual !== expected) {
    throw new Error(message);
  }
}
