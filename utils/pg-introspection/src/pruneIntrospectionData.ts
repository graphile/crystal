import type {
  CollectionEntity,
  IntrospectionDataForEntities,
  IntrospectionOptions,
  IntrospectionPruneDetails,
  PrunableIntrospectionData,
} from "./interfaces.ts";
import {
  ENTITY_TYPES,
  type EntityType,
  type IntrospectionData,
} from "./introspection.ts";
import { defaultEntities } from "./query.ts";

export function pruneIntrospectionData<TEntities extends EntityType>(
  options: IntrospectionOptions<TEntities>,
  result: IntrospectionDataForEntities<TEntities>,
): IntrospectionDataForEntities<TEntities> {
  const { prune, onlyEntities = defaultEntities } = options;
  if (prune) {
    const data = result as Record<string, any>;
    const details: IntrospectionPruneDetails = {
      hide(entity, matches) {
        hideRows(result, entity, matches);
      },
    };
    const countRows = (includeHidden: boolean) =>
      onlyEntities.reduce(
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

/** Move matching rows out of exposed collections, retaining them for navigation. */
export function hideRows<T extends CollectionEntity>(
  result: PrunableIntrospectionData,
  entity: T,
  matches: (row: IntrospectionData[T][number]) => boolean,
): void {
  const data = result as Record<string, any>;
  const collection = data[entity];
  if (!Array.isArray(collection)) {
    return;
  }
  const moved = [];
  const hiddenIndexes = new Set<number>();
  for (let i = collection.length - 1; i >= 0; i--) {
    if (matches(collection[i])) {
      moved.push(collection[i]);
      hiddenIndexes.add(i);
    }
  }
  if (moved.length > 0) {
    let write = 0;
    for (let read = 0; read < collection.length; read++) {
      if (!hiddenIndexes.has(read)) {
        collection[write++] = collection[read];
      }
    }
    collection.length = write;
    const retained = (result.hidden ??= {}) as Record<string, any[]>;
    const target = (retained[entity] ??= []);
    for (const row of moved.reverse()) {
      target.push(row);
    }
  }
}
