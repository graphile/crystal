// performance.now() is supported in most modern browsers, plus node.
export const timeSource =
  typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance
    : Date;
