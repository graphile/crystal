import { Plugin } from "graphile-build";
import {
  PgNamespace,
  PgProc,
  PgClass,
  PgType,
  PgAttribute,
  PgConstraint,
  PgExtension,
} from "./plugins/PgIntrospectionPlugin";

export {
  PgNamespace,
  PgProc,
  PgClass,
  PgType,
  PgAttribute,
  PgConstraint,
  PgExtension,
};

export function formatSQLForDebugging(sql: string): string;

export function parseIdentifier(
  typeIdentifier: string
): {
  namespaceName: string;
  entityName: string;
};

export function omit(
  entity: PgProc | PgClass | PgAttribute | PgConstraint,
  permission:
    | "create"
    | "read"
    | "update"
    | "delete"
    | "filter"
    | "order"
    | "all"
    | "many"
    | "execute"
    | "base"
): boolean;

export const defaultPlugins: Array<Plugin>;

export const PgBasicsPlugin: Plugin;
export const PgIntrospectionPlugin: Plugin;
export const PgTypesPlugin: Plugin;
export const PgJWTPlugin: Plugin;
export const PgTablesPlugin: Plugin;
export const PgConnectionArgFirstLastBeforeAfter: Plugin;
export const PgConnectionArgOrderBy: Plugin;
export const PgConnectionArgOrderByDefaultValue: Plugin;
export const PgConnectionArgCondition: Plugin;
export const PgConditionComputedColumnPlugin: Plugin;
export const PgAllRows: Plugin;
export const PgColumnsPlugin: Plugin;
export const PgColumnDeprecationPlugin: Plugin;
export const PgForwardRelationPlugin: Plugin;
export const PgBackwardRelationPlugin: Plugin;
export const PgRowByUniqueConstraint: Plugin;
export const PgComputedColumnsPlugin: Plugin;
export const PgQueryProceduresPlugin: Plugin;
export const PgOrderAllColumnsPlugin: Plugin;
export const PgOrderComputedColumnsPlugin: Plugin;
export const PgOrderByPrimaryKeyPlugin: Plugin;
export const PgRowNode: Plugin;
export const PgNodeAliasPostGraphile: Plugin;
export const PgRecordReturnTypesPlugin: Plugin;
export const PgRecordFunctionConnectionPlugin: Plugin;
export const PgScalarFunctionConnectionPlugin: Plugin;
export const PageInfoStartEndCursor: Plugin;
export const PgConnectionTotalCount: Plugin;
export const PgMutationCreatePlugin: Plugin;
export const PgMutationUpdateDeletePlugin: Plugin;
export const PgMutationProceduresPlugin: Plugin;
export const PgMutationPayloadEdgePlugin: Plugin;

export { upperFirst, camelCase, constantCase } from "graphile-build";

// DEPRECATED, DO NOT USE!
export const inflections: any;
export type Inflector = any;

import QueryBuilder from "./QueryBuilder";
export { QueryBuilder };
export {
  sql,
  SQL,
  GraphQLContext,
  GenContext,
  Gen,
  RawAlias,
  SQLAlias,
  SQLGen,
  NumberGen,
  CursorValue,
  CursorComparator,
} from "./QueryBuilder";
