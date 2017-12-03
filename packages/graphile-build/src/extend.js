// @flow

export default function extend<Obj1: *, Obj2: *>(
  base: Obj1,
  extra: Obj2
): Obj1 & Obj2 {
  const keysA = Object.keys(base);
  const keysB = Object.keys(extra);
  for (const key of keysB) {
    if (keysA.indexOf(key) >= 0) {
      throw new Error(`Overwriting key '${key}' is not allowed!`);
    }
  }
  return Object.assign({}, base, extra);
}
