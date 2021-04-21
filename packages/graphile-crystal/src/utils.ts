import * as assert from "assert";
import { isDev } from "./dev";

export function assertNullPrototype(object: {}, description: string): void {
  if (isDev) {
    assert.equal(
      Object.getPrototypeOf(object),
      null,
      `Expected ${description} to have a null prototype`,
    );
  }
}
