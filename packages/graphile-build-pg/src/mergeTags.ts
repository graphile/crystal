import type { PgSmartTagsDict } from "pg-introspection";

export function mergeTags(
  targetTags: Partial<PgSmartTagsDict>,
  sourceTags: Partial<PgSmartTagsDict>,
): void {
  // TODO: make merging smarter
  Object.assign(targetTags, sourceTags);
}
