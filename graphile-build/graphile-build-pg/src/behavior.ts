import "./interfaces.js";

import type {
  PgCodecExtensions,
  PgCodecRefExtensions,
  PgCodecRelationExtensions,
  PgResourceExtensions,
} from "@dataplan/pg";
import { isDev } from "grafast";
import { inspect } from "util";

// NOTE: 'behaviour' is the correct spelling in UK English; we try and stick to
// US English but this function tries to be a bit forgiving.

type ArrayOrDirect<T> = Array<T> | T;

/**
 * Takes a smart tags object and extracts the 'behavior' (or 'behaviour')
 * property and coerces it to be a string. Returns null if no behavior was
 * specified (in which case the default behavior should be used).
 */
export function getBehavior(
  extensions: ArrayOrDirect<
    | Partial<
        | PgResourceExtensions
        | PgCodecRelationExtensions
        | PgCodecExtensions
        | PgCodecRefExtensions
      >
    | undefined
  >,
): string | null {
  const allExtensions = Array.isArray(extensions) ? extensions : [extensions];
  const behaviors: string[] = [];
  for (const extensions of allExtensions) {
    // TODO: all of these are just for user convenience, users should be guided not to use them.
    add(extensions?.tags?.behaviours);
    add(extensions?.tags?.behaviors);
    add(extensions?.tags?.behaviour);

    // This is the real one
    add(extensions?.tags?.behavior);
  }
  return behaviors.join(" ");

  function add(
    rawBehavior: (string | true)[] | string | true | null | undefined,
  ): void {
    const behavior =
      typeof rawBehavior === "string" ? rawBehavior.trim() : rawBehavior;
    if (!behavior) {
      return;
    }
    if (Array.isArray(behavior)) {
      if (isDev && !behavior.every(isValidBehavior)) {
        throw new Error(
          `Invalid value for behavior; expected a string or string array using simple alphanumeric strings, but found ${inspect(
            behavior,
          )}`,
        );
      }
      behaviors.push(behavior.join(" "));
      return;
    }
    if (isValidBehavior(behavior)) {
      behaviors.push(behavior);
      return;
    }
    throw new Error(
      `Invalid value for behavior; expected a string or string array using simple alphanumeric strings, but found ${inspect(
        behavior,
      )}`,
    );
  }
}

/**
 * We're strict with this because we want to be able to expand this in future.
 * For example I want to allow `@behavior all some` to operate the same as
 * `@behavior all\n@behavior some`. I also want to be able to add
 * `@behavior -all` to remove a previously enabled behavior.
 *
 * @internal
 */
function isValidBehavior(behavior: unknown): behavior is string {
  return (
    typeof behavior === "string" &&
    /^[+-]?([a-zA-Z](?:[_:]?[a-zA-Z0-9])+|\*)(?:\s+[+-]?(?:[a-zA-Z]([_:]?[a-zA-Z0-9])+|\*))*$/.test(
      behavior,
    )
  );
}
