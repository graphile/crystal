// @flow

const aExtendedB = new WeakMap();

export default function extend<Obj1: *, Obj2: *>(
  base: Obj1,
  extra: Obj2,
  hint?: string
): Obj1 & Obj2 {
  const keysA = Object.keys(base);
  const keysB = Object.keys(extra);
  for (const key of keysB) {
    const newValue = extra[key];
    const oldValue = base[key];
    if (aExtendedB.get(newValue) !== oldValue && keysA.indexOf(key) >= 0) {
      throw new Error(`Overwriting key '${key}' is not allowed! ${hint || ""}`);
    }
  }
  const obj = Object.assign({}, base, extra);
  aExtendedB.set(obj, base);
  return obj;
}
