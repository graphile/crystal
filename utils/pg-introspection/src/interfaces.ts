import type { EntityType } from "./introspection.ts";

export interface Options<TEntities extends EntityType = EntityType> {
  onlyEntities?: TEntities[];
}
