import type { PgSmartTagsDict } from "pg-introspection";

export function tagToString(
  str: undefined | null | boolean | string | (string | boolean)[],
): string | undefined {
  if (!str || (Array.isArray(str) && str.length === 0)) {
    return undefined;
  }
  return Array.isArray(str) ? str.join("\n") : str === true ? " " : str;
}

export function addBehaviorToTags(
  tags: PgSmartTagsDict,
  behavior: string,
  prepend = false,
): void {
  if (Array.isArray(tags.behavior)) {
    if (prepend) {
      tags.behavior.unshift(behavior);
    } else {
      tags.behavior.push(behavior);
    }
  } else if (typeof tags.behavior === "string") {
    tags.behavior = prepend
      ? [behavior, tags.behavior]
      : [tags.behavior, behavior];
  } else {
    tags.behavior = behavior;
  }
}
