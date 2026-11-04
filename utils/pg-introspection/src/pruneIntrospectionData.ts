import type {
  IntrospectionDataForEntities,
  IntrospectionPruneDetails,
  IntrospectOptions,
} from "./interfaces.ts";
import { ENTITY_TYPES, type EntityType } from "./introspection.ts";
import { defaultEntities } from "./query.ts";

export function pruneIntrospectionData<TEntities extends EntityType>(
  options: IntrospectOptions<TEntities>,
  result: IntrospectionDataForEntities<TEntities>,
): IntrospectionDataForEntities<TEntities> {
  const { prune } = options;
  if (prune) {
    const selected = options.onlyEntities ?? defaultEntities;
    const data = result as Record<string, any>;
    const details: IntrospectionPruneDetails = {
      hide(entity, matches) {
        const collection = data[entity];
        if (!Array.isArray(collection)) {
          return;
        }
        const moved = [];
        for (let i = collection.length - 1; i >= 0; i--) {
          if (matches(collection[i])) {
            moved.push(collection[i]);
            collection.splice(i, 1);
          }
        }
        if (moved.length > 0) {
          const retained = (result.hidden ??= {}) as Record<string, any[]>;
          const target = (retained[entity] ??= []);
          for (const row of moved.reverse()) {
            target.push(row);
          }
        }
      },
    };
    const countRows = (includeHidden: boolean) =>
      selected.reduce(
        (count, entity) =>
          count +
          (Array.isArray(data[entity])
            ? data[entity].length
            : ENTITY_TYPES[entity].singular && data[entity]
              ? 1
              : 0) +
          (includeHidden ? (data.hidden?.[entity]?.length ?? 0) : 0),
        0,
      );
    let before: number;
    let after = countRows(false);
    do {
      before = after;
      const totalBefore = countRows(true);
      prune(result, details);
      after = countRows(false);
      if (countRows(true) > totalBefore) {
        throw new Error("Introspection pruning must not add entities");
      }
    } while (after < before);
  }
  return result;
}
