import type {
  PgCodecExtensions,
  PgCodecRefExtensions,
  PgCodecRelationExtensions,
  PgResourceExtensions,
} from "@dataplan/pg";
import { isDev } from "grafast";
import { isValidBehaviorString } from "graphile-build";
import { inspect } from "util";

// NOTE: 'behaviour' is the correct spelling in UK English; we try and stick to
// US English but this function tries to be a bit forgiving.

type ArrayOrDirect<T> = Array<T> | T;

/**
 * Takes a smart tags object and extracts the 'behavior' (or 'behaviour')
 * property and coerces it to be a string.
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
): GraphileBuild.BehaviorString {
  const allExtensions = Array.isArray(extensions) ? extensions : [extensions];
  const behaviors: GraphileBuild.BehaviorString[] = [];
  for (const extensions of allExtensions) {
    // LOGGING: all of these are just for user convenience, users should be guided not to use them.
    add(extensions?.tags?.behaviours);
    add(extensions?.tags?.behaviors);
    add(extensions?.tags?.behaviour);

    // This is the real one
    add(extensions?.tags?.behavior);
  }
  return behaviors.join(" ") as GraphileBuild.BehaviorString;

  function add(
    rawBehavior: (string | true)[] | string | true | null | undefined,
  ): void {
    const behavior =
      typeof rawBehavior === "string" ? rawBehavior.trim() : rawBehavior;
    if (!behavior) {
      return;
    }
    if (Array.isArray(behavior)) {
      if (isDev && !behavior.every(isValidBehaviorString)) {
        throw new Error(
          `Invalid value for behavior; expected a string or string array using simple alphanumeric strings, but found ${inspect(
            behavior,
          )}`,
        );
      }
      for (const b of behavior) {
        behaviors.push(b as GraphileBuild.BehaviorString);
      }
      return;
    }
    if (isValidBehaviorString(behavior)) {
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
