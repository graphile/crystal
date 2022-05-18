import type {
  Introspection,
  PgAttribute,
  PgAuthMembers,
  PgClass,
  PgConstraint,
  PgDatabase,
  PgDepend,
  PgDescription,
  PgEnum,
  PgExtension,
  PgIndex,
  PgLanguage,
  PgNamespace,
  PgProc,
  PgRange,
  PgRoles,
  PgType,
} from "./introspection.js";
export { makeIntrospectionQuery } from "./introspection.js";
import { augmentIntrospection } from "./augmentIntrospection.js";
import type { PgSmartTagsAndDescription } from "./smartComments.js";

export {
  Introspection,
  PgAttribute,
  PgAuthMembers,
  PgClass,
  PgConstraint,
  PgDatabase,
  PgDepend,
  PgDescription,
  PgEnum,
  PgExtension,
  PgIndex,
  PgLanguage,
  PgNamespace,
  PgProc,
  PgRange,
  PgRoles,
  PgType,
};

export function parseIntrospectionResults(
  introspectionResults: string,
): Introspection {
  return augmentIntrospection(JSON.parse(introspectionResults));
}

export { PgSmartTagsAndDescription };

declare module "./introspection" {
  interface PgDatabase {
    getDba(): PgRoles | undefined;
  }
  interface PgNamespace {
    getOwner(): PgRoles | undefined;
    getDescription(): string | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
  }
  interface PgClass {
    getNamespace(): PgNamespace | undefined;
    getType(): PgType | undefined;
    getOfType(): PgType | undefined;
    getOwner(): PgRoles | undefined;
    getAttributes(): PgAttribute[];
    getConstraints(): PgConstraint[];
    getForeignConstraints(): PgConstraint[];
    getIndexes(): PgIndex[];
    getDescription(): string | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
  }
  interface PgAttribute {
    getClass(): PgClass | undefined;
    getType(): PgType | undefined;
    getDescription(): string | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
  }
  interface PgConstraint {
    getNamespace(): PgNamespace | undefined;
    getClass(): PgClass | undefined;
    getType(): PgType | undefined;
    getForeignClass(): PgClass | undefined;
    getDescription(): string | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
  }
  interface PgProc {
    getNamespace(): PgNamespace | undefined;
    getOwner(): PgRoles | undefined;
    getReturnType(): PgType | undefined;
    getDescription(): string | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
  }
  interface PgType {
    getNamespace(): PgNamespace | undefined;
    getOwner(): PgRoles | undefined;
    getClass(): PgClass | undefined;
    getElemType(): PgType | undefined;
    getArrayType(): PgType | undefined;
    getEnumValues(): PgEnum[] | undefined;
    getRange(): PgRange | undefined;
    getDescription(): string | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
  }
  interface PgEnum {
    getType(): PgType | undefined;
  }
  interface PgRange {
    getType(): PgType | undefined;
    getSubType(): PgType | undefined;
  }
}
