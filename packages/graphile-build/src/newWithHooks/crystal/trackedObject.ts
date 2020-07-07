/**
 * Gives access to the properties of an object whilst also tracking which keys
 * were accessed.
 *
 * @remarks
 * We could have used an ES6 proxy for this, but performance is terrible, and
 * this more verbose approach encourages you to avoid .get()s where possible.
 */
class TrackedObject<T extends object> {
  public accessedKeys: Set<keyof T>;

  constructor(private obj: T) {
    this.accessedKeys = new Set();
  }

  get<TKey extends keyof T>(key: TKey): T[TKey] {
    this.accessedKeys.add(key);
    return this.obj[key];
  }
}
