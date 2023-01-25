export function mapIterator<T, U>(
  iterable: AsyncIterable<T>,
  cb: (payload: T) => U,
  end?: () => U,
  initial?: () => U,
): AsyncGenerator<U> {
  const iterator = iterable[Symbol.asyncIterator]();
  /**
   * -1 - starting
   * 0 - normal
   * 1 - ending
   * 2 - ended
   */
  let status = -1;
  const mappedIterator: AsyncGenerator<U> = {
    next() {
      if (status === -1) {
        status = 0;
        if (typeof initial === "function") {
          return Promise.resolve({ value: initial(), done: false });
        }
      }
      if (status === 1) {
        status = 2;
      }
      // NO 'else' here!
      if (status === 2) {
        return Promise.resolve({ value: undefined, done: true });
      }
      const next = iterator.next();
      return next.then((v) => {
        let done = false;
        let value = cb(v.value);
        if (v.done) {
          if (end) {
            status = 1;
            if (value !== undefined) {
              throw new Error("Invalid assumption; tell Benjie he did bad.");
            }
            value = end();
          } else {
            status = 2;
            done = true;
          }
        }
        return { done, value };
      });
    },
    return(value) {
      status = 2;
      iterator.return?.(value);
      return Promise.resolve({ value: undefined, done: true });
    },
    throw(error) {
      status = 2;
      iterator.throw?.(error);
      return Promise.reject(error);
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  };

  return mappedIterator;
}
