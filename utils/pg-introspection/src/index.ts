import type {
  PgAm,
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
} from "./interfaces.ts";
export { introspect, introspectRaw } from "./incremental.ts";
export { makeIntrospectionQuery } from "./query.ts";
import type { AclObject } from "./acl.ts";
import {
  aclContainsRole,
  entityPermissions,
  expandRoles,
  resolvePermissions,
} from "./acl.ts";
import {
  augmentIntrospection,
  augmentIntrospectionData,
} from "./augmentIntrospection.ts";
import type {
  DefaultEntities,
  Introspection,
  IntrospectionDataForEntities,
  IntrospectOptions,
} from "./interfaces.ts";
import type {
  PgSmartTagsAndDescription,
  PgSmartTagsDict,
} from "./smartComments.ts";

export { default as reservedWords } from "./reservedWords.ts";
export { parseSmartComment } from "./smartComments.ts";

export { augmentIntrospectionData };

export type {
  DefaultEntities,
  Introspection,
  IntrospectionDataForEntities,
  IntrospectOptions,
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

/** @deprecated Use introspect or introspectRaw */
export function parseIntrospectionResults(
  introspectionResults: string,
  includeExtensionResources = false,
): Introspection<DefaultEntities> {
  return augmentIntrospection(introspectionResults, includeExtensionResources);
}

export type { PgSmartTagsAndDescription, PgSmartTagsDict };

export type * from "./introspection.ts";
