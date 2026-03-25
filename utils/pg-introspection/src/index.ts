import type {
  Introspection,
  PgAttribute,
  PgAuthMembers,
  PgClass,
  PgConstraint,
  PgDatabase,
  PgDepend,
  PgDescription,
  PgEntity,
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
} from "./introspection.ts";
export { makeIntrospectionQuery } from "./introspection.ts";
import type { AclObject } from "./acl.ts";
import {
  aclContainsRole,
  entityPermissions,
  expandRoles,
  resolvePermissions,
} from "./acl.ts";
import { augmentIntrospection } from "./augmentIntrospection.ts";
import type {
  PgSmartTagsAndDescription,
  PgSmartTagsDict,
} from "./smartComments.ts";

export { default as reservedWords } from "./reservedWords.ts";
export { parseSmartComment } from "./smartComments.ts";

export type {
  Introspection,
  PgAttribute,
  PgAuthMembers,
  PgClass,
  PgConstraint,
  PgDatabase,
  PgDepend,
  PgDescription,
  PgEntity,
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

export type { AclObject };
export { aclContainsRole, entityPermissions, expandRoles, resolvePermissions };

export function parseIntrospectionResults(
  introspectionResults: string,
  includeExtensionResources = false,
): Introspection {
  return augmentIntrospection(introspectionResults, includeExtensionResources);
}

export type { PgSmartTagsAndDescription, PgSmartTagsDict };

interface IntrospectionLookups {
  oidByCatalog: Record<string, string>;
  roleById: Map<string, PgRoles>;
  roleByName: Record<string, PgRoles>;
  authMembersByMemberId: Map<string, Set<PgAuthMembers>>;
  namespaceById: Map<string, PgNamespace>;
  namespaceByName: Map<string, PgNamespace>;
  typeById: Map<string, PgType>;
  classById: Map<string, PgClass>;
  rangeByTypid: Map<string, PgRange>;
  attributesByRelId: Map<string, PgAttribute[]>;
  constraintById: Map<string, PgConstraint>;
  constraintsByRelid: Map<string, PgConstraint[]>;
  foreignConstraintsByRelid: Map<string, PgConstraint[]>;
  enumById: Map<string, PgEnum>;
  enumsByTypid: Map<string, PgEnum[]>;
  indexesByRelid: Map<string, PgIndex[]>;
  descriptionByDescriptionKey: Map<string, PgDescription>;
  procById: Map<string, PgProc>;
  extensionById: Map<string, PgExtension>;
}
interface IntrospectionCaches {
  expandRoles: Map<string, PgRoles[]>;
}

declare module "./introspection.js" {
  interface Introspection {
    /**
     * Use Record/Map to turn O(N) lookups into O(1) lookups. Populated at
     * startup.
     *
     * @internal
     */
    _lookups: IntrospectionLookups;

    /**
     * For calculated values that should not be pre-computed (since they may
     * not be needed), add caches here to avoid needing WeakMap.
     *
     * @internal
     */
    _caches: IntrospectionCaches;

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
    _type: "PgDatabase";
    /** @deprecated Use getOwner instead */
    getDba(): PgRoles | undefined;
    getOwner(): PgRoles | undefined;
    getACL(): AclObject[];
  }
  interface PgNamespace {
    _type: "PgNamespace";
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
    _type: "PgClass";
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
    getAccessMethod(): PgAm | undefined;
  }
  interface PgIndex {
    _type: "PgIndex";
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
    getDescription(): string | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
    /** Convenience method for getTagsAndDescription().tags */
    getTags(): PgSmartTagsDict;
  }
  interface PgAttribute {
    _type: "PgAttribute";
    getClass(): PgClass | undefined;
    getType(): PgType | undefined;
    getDescription(): string | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
    /** Convenience method for getTagsAndDescription().tags */
    getTags(): PgSmartTagsDict;
    getACL(): AclObject[];
  }
  interface PgConstraint {
    _type: "PgConstraint";
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
    _type: "PgProc";
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
    _type: "PgType";
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
    _type: "PgEnum";
    getType(): PgType | undefined;
    getTagsAndDescription(): PgSmartTagsAndDescription;
    /** Convenience method for getTagsAndDescription().tags */
    getTags(): PgSmartTagsDict;
  }
  interface PgRange {
    _type: "PgRange";
    getType(): PgType | undefined;
    getSubType(): PgType | undefined;
  }
  interface PgInherits {
    getParent(): PgClass | undefined;
    getChild(): PgClass | undefined;
  }
}
