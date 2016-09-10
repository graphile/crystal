/**
 * Takes an asynchronous test (using promises), and turns it into an
 * asynchronous test supported by the Jasmine format.
 */
export default function jasmineAsync (test: () => Promise<void>): any {
  return (done: (error?: any) => void) => {
    test()
      .then(() => done())
      .catch(error => done(error || new Error('An unknown error occurred.')))
  }
}
