import type {
  DefaultEntities,
  Introspection,
  IntrospectionDataForEntities,
  IntrospectionPolicy,
  IntrospectionPolicyDetails,
  IntrospectionRequest,
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
  PurposeList,
} from "./interfaces.ts";
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
import type { EntityType } from "./introspection.ts";
import { makeIntrospectionQuery as internalMakeIntrospectionQuery } from "./query.ts";
import type {
  PgSmartTagsAndDescription,
  PgSmartTagsDict,
} from "./smartComments.ts";

/** @deprecated Use introspect or introspectRaw */
export function makeIntrospectionQuery(
  options: Pick<IntrospectOptions<EntityType>, "onlyEntities" | "filters"> = {},
) {
  return internalMakeIntrospectionQuery(options);
}

export { default as reservedWords } from "./reservedWords.ts";
export { parseSmartComment } from "./smartComments.ts";

export { augmentIntrospectionData };

export type {
  DefaultEntities,
  Introspection,
  IntrospectionDataForEntities,
  IntrospectionPolicy,
  IntrospectionPolicyDetails,
  IntrospectionRequest,
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
  PurposeList,
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
    }
    type Purpose = keyof PurposeRegistry;
  }
}
