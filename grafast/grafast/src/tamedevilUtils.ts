// If we add tamedevil back, we should move back to using its utils. In the
// mean time, I've copied them here.

/**
 * A 'short string' has a length less than or equal to this, and can
 * potentially have JSON.stringify skipped on it if it doesn't contain any of
 * the forbiddenCharacters. To prevent the forbiddenCharacters regexp running
 * for a long time, we cap the length of string we test.
 */
const MAX_SHORT_STRING_LENGTH = 200; // TODO: what should this be?

const BACKSLASH_CODE = "\\".charCodeAt(0);
const QUOTE_CODE = '"'.charCodeAt(0);

/**
 * Similar to `JSON.stringify(string)`, but faster. Bizarrely this seems to be
 * faster than the regexp approach
 */
export function stringifyString(value: string): string {
  const l = value.length;
  if (l > MAX_SHORT_STRING_LENGTH) {
    return JSON.stringify(value);
  }
  // Scan through for disallowed charcodes
  for (let i = 0; i < l; i++) {
    const code = value.charCodeAt(i);
    if (
      code === BACKSLASH_CODE ||
      code === QUOTE_CODE ||
      (code & 0xffe0) === 0 || // equivalent to `code <= 0x001f`
      (code & 0xc000) !== 0 // Not quite equivalent to `code >= 0xd800`, but good enough for our purposes
    ) {
      // Backslash, quote, control character or surrogate
      return JSON.stringify(value);
    }
  }
  return `"${value}"`;
}

// PERF: more optimal stringifier
/**
 * Equivalent to JSON.stringify, but typically faster.
 */
export const stringifyJSON = (value: any): string => {
  if (value == null) return "null";
  if (value === true) return "true";
  if (value === false) return "false";
  const t = typeof value;
  if (t === "number") return "" + value;
  if (t === "string") {
    return stringifyString(value as string);
  }
  return JSON.stringify(value);
};

/**
 * Values that cannot safely be used as the keys on a POJO (`{}`) due to
 * security or similar concerns. For example `__proto__` is disallowed.
 */
const disallowedKeys: Array<string | symbol | number> = [
  ...Object.getOwnPropertyNames(Object.prototype),
  ...Object.getOwnPropertySymbols(Object.prototype),
];
if (!disallowedKeys.includes("__proto__")) {
  // If you're running with `--disable-proto=delete` we still want to check
  // you're not trying to set __proto__.
  disallowedKeys.push("__proto__");
}

/**
 * Returns true if the given key is safe to set as the key of a POJO (without a
 * null prototype), false otherwise.
 */
export const isSafeObjectPropertyName = (key: string | symbol | number) =>
  (typeof key === "number" ||
    typeof key === "symbol" ||
    (typeof key === "string" &&
      /^(?:[0-9a-z$]|_[a-z0-9$])[a-z0-9_$]*$/i.test(key))) &&
  !disallowedKeys.includes(key);
