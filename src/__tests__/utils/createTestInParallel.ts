/**
 * Runs all of the tests declared with this funcion in a file in parallel. This
 * breaks any `beforeEach` and `afterEach` functions, but any `beforeAll` and
 * `afterAll` functions should work.
 *
 * This function will break the timing numbers in the Jest console.
 */
export default function createTestInParallel(): (
  name: string,
  fn: () => void | Promise<void>,
) => void {
  // All of the test functions. We collect them in a single array so that we can
  // call them all at once.
  const testFns: Array<() => void | Promise<void>> = []

  // The promised results of calling all of our test functions. The single serial
  // tests will await these values.
  let testResults: Array<Promise<void>> | undefined

  return (name: string, fn: () => void | Promise<void>): void => {
    // Add the test function and record its position.
    const index = testFns.length
    testFns.push(fn)

    test(name, async () => {
      // If the tests have not yet been run then run all of our tests.
      if (!testResults) {
        testResults = testFns.map(testFn => Promise.resolve(testFn()))
      }
      // Await the result.
      await testResults[index]
    })
  }
}
