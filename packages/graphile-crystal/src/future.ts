import { memoize, pick } from "lodash";

/**
 * $-prefixed; represents a value that doesn't exist yet but will in future.
 * Can turn it into intermediary representations that can be used in other
 * plans, e.g. `.toSQL()`?
 */
export abstract class FutureValue<TEntry = unknown> {
  constructor(protected selection: Array<keyof TEntry>) {
    // Eval should only be called once
    this.eval = memoize(this.eval.bind(this));
  }

  keys(): ReadonlyArray<keyof TEntry> {
    return this.selection;
  }

  abstract eval(): Promise<ReadonlyArray<TEntry>>;

  abstract get<TNewKeys extends keyof TEntry>(
    newSelection: Array<TNewKeys>,
  ): FutureValue<Pick<TEntry, TNewKeys>>;
}

export class PlainFutureValue<TEntry = unknown> extends FutureValue<TEntry> {
  constructor(selection: Array<keyof TEntry>, private values: Array<TEntry>) {
    super(selection);
  }

  eval() {
    const formatO = (o: TEntry): TEntry => pick(o, this.selection) as TEntry;
    // Guarantees that the returned value has only the defined keys
    const values = this.values.map(formatO);
    return Promise.resolve(values);
  }

  get<TNewKeys extends keyof TEntry>(
    newSelection: Array<TNewKeys>,
  ): PlainFutureValue<Pick<TEntry, TNewKeys>> {
    return new PlainFutureValue(
      newSelection,
      // Leave it to `.eval()` to actually trim the keys, since that's memoized and evaluated just in time.
      this.values as Pick<TEntry, TNewKeys>[],
    );
  }
}
