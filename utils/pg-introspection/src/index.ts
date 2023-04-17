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
  PgInherits,
  PgLanguage,
  PgNamespace,
  PgProc,
  PgProcArgument,
  PgRange,
  PgRoles,
  PgType,
} from "./introspection.js";
export { makeIntrospectionQuery } from "./introspection.js";
import type { AclObject } from "./acl.js";
import { aclContainsRole, expandRoles, resolvePermissions } from "./acl.js";
import { augmentIntrospection } from "./augmentIntrospection.js";
import type {
  PgSmartTagsAndDescription,
  PgSmartTagsDict,
} from "./smartComments.js";

export { parseSmartComment } from "./smartComments.js";

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
  PgInherits,
  PgLanguage,
  PgNamespace,
  PgProc,
  PgProcArgument,
  PgRange,
  PgRoles,
  PgType,
};

export { aclContainsRole, AclObject, expandRoles, resolvePermissions };

export function parseIntrospectionResults(
  introspectionResults: string,
  includeExtensionResources = false,
): Introspection {
  return augmentIntrospection(introspectionResults, includeExtensionResources);
}

export { PgSmartTagsAndDescription, PgSmartTagsDict };

declare module "./introspection" {
  interface Introspection {
    getCurrentUser(): PgRoles | undefined;

    getNamespace(
      by: { id: string } | { name: string },
    ): PgNamespace | undefined;
    getClass(by: { id: string }): PgClass | undefined;
    getConstraint(by: { id: string }): PgConstraint | undefined;
    getProc(by: { id: string }): PgProc | undefined;
    getRoles(by: { id: string }): PgRoles | undefined;
    getType(by: { id: string }): PgType | undefined;
    getEnum(by: { id: string }): PgEnum | undefined;
    getExtension(by: { id: string }): PgExtension | undefined;
    getIndex(by: { id: string }): PgIndex | undefined;
    getLanguage(by: { id: string }): PgLanguage | undefined;
  }

  interface PgProcArgument {
    isIn: boolean;
    isOut: boolean;
    isVariadic: boolean;
    hasDefault: boolean;
    type: PgType;
    name: string | null;
  }

  interface PgDatabase {
    getDba(): PgRoles | undefined;
    getACL(): AclObject[];
  }
  interface PgNamespace {
    getOwner(): PgRoles | undefined;
    getDescription(): string | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
    /** Convenience method for getTagsAndDescription().tags */
    getTags(): PgSmartTagsDict;
    getACL(): AclObject[];

    getClass(by: { name: string }): PgClass | undefined;
    getConstraint(by: { name: string }): PgConstraint | undefined;
    getProcs(by: { name: string }): PgProc[] | undefined;
  }
  interface PgClass {
    getNamespace(): PgNamespace | undefined;
    getType(): PgType | undefined;
    getOfType(): PgType | undefined;
    getOwner(): PgRoles | undefined;
    getAttributes(): PgAttribute[];
    getAttribute(
      by: { number: number } | { name: string },
    ): PgAttribute | undefined;
    getConstraints(): PgConstraint[];
    getForeignConstraints(): PgConstraint[];
    getIndexes(): PgIndex[];
    getDescription(): string | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
    /** Convenience method for getTagsAndDescription().tags */
    getTags(): PgSmartTagsDict;
    getACL(): AclObject[];
    getInherited(): PgInherits[];
  }
  interface PgIndex {
    /**
     * Get the class that represents this index.
     */
    getIndexClass(): PgClass | undefined;
    /**
     * Get the class (typically table) this index is for.
     */
    getClass(): PgClass | undefined;
    /**
     * The PgAttributes that are in this index; a null indicates that the entry
     * is an expression rather than a column.
     */
    getKeys(): Array<PgAttribute | null>;
  }
  interface PgAttribute {
    getClass(): PgClass | undefined;
    getType(): PgType | undefined;
    getDescription(): string | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
    /** Convenience method for getTagsAndDescription().tags */
    getTags(): PgSmartTagsDict;
    getACL(): AclObject[];
  }
  interface PgConstraint {
    getNamespace(): PgNamespace | undefined;
    getClass(): PgClass | undefined;
    getAttributes(): PgAttribute[] | undefined;
    getType(): PgType | undefined;
    getForeignClass(): PgClass | undefined;
    getForeignAttributes(): PgAttribute[] | undefined;
    getDescription(): string | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
    /** Convenience method for getTagsAndDescription().tags */
    getTags(): PgSmartTagsDict;
  }
  interface PgProc {
    getNamespace(): PgNamespace | undefined;
    getOwner(): PgRoles | undefined;
    getReturnType(): PgType | undefined;
    getDescription(): string | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
    /** Convenience method for getTagsAndDescription().tags */
    getTags(): PgSmartTagsDict;
    getArguments(): PgProcArgument[];
    getACL(): AclObject[];
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
    /** Convenience method for getTagsAndDescription().tags */
    getTags(): PgSmartTagsDict;
  }
  interface PgEnum {
    getType(): PgType | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
    /** Convenience method for getTagsAndDescription().tags */
    getTags(): PgSmartTagsDict;
  }
  interface PgRange {
    getType(): PgType | undefined;
    getSubType(): PgType | undefined;
  }
}
