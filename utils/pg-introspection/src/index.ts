import type {
  DefaultEntities,
  Introspection,
  IntrospectionDataForEntities,
  IntrospectionMatch,
  IntrospectionOptions,
  IntrospectionPolicy,
  IntrospectionPolicyDetails,
  IntrospectionPreviewDetails,
  IntrospectionPruneDetails,
  IntrospectionRequest,
  IntrospectionRow,
  IntrospectOptions,
  MultipassOptions,
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
  PrunableIntrospectionData,
  PurposeList,
  RunQuery,
  TaggedEntity,
} from "./interfaces.ts";
export { includePolicy } from "./includePolicy.ts";
export { defineIntrospectionPolicy } from "./interfaces.ts";
export { introspect, introspectRaw } from "./multipass.ts";
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
import { makeIntrospectionQuery as internalMakeIntrospectionQuery } from "./query.ts";
import type {
  PgSmartTagsAndDescription,
  PgSmartTagsDict,
} from "./smartComments.ts";

/** @deprecated Use introspect or introspectRaw */
export function makeIntrospectionQuery() {
  return internalMakeIntrospectionQuery();
}

export { default as reservedWords } from "./reservedWords.ts";
export { parseSmartComment } from "./smartComments.ts";

export { augmentIntrospectionData };
export { pruneExtensionResources } from "./pruneExtensionResources.ts";

export type {
  DefaultEntities,
  Introspection,
  IntrospectionDataForEntities,
  IntrospectionMatch,
  IntrospectionOptions,
  IntrospectionPolicy,
  IntrospectionPolicyDetails,
  IntrospectionPreviewDetails,
  IntrospectionPruneDetails,
  IntrospectionRequest,
  IntrospectionRow,
  IntrospectOptions,
  MultipassOptions,
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
  PrunableIntrospectionData,
  PurposeList,
  RunQuery,
  TaggedEntity,
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

declare global {
  namespace PgIntrospection {
    interface PurposeRegistry {
      initial: true;
      /** Fetched only to resolve the identity given to `requestByName`. */
      _resolveName: true;
      /** Fetched to read a row's smart tags with `getTagsAndDescription`. */
      _smartTags: true;
    }
    type Purpose = keyof PurposeRegistry;
  }
}
