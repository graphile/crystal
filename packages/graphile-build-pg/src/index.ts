import "graphile-build";

import omit from "./omit";
import parseIdentifier from "./parseIdentifier";
import PageInfoStartEndCursor from "./plugins/PageInfoStartEndCursor";
import PgAllRows from "./plugins/PgAllRows";
import PgBackwardRelationPlugin from "./plugins/PgBackwardRelationPlugin";
import PgBasicsPlugin from "./plugins/PgBasicsPlugin";
import PgColumnDeprecationPlugin from "./plugins/PgColumnDeprecationPlugin";
import PgColumnsPlugin from "./plugins/PgColumnsPlugin";
import PgComputedColumnsPlugin from "./plugins/PgComputedColumnsPlugin";
import PgConditionComputedColumnPlugin from "./plugins/PgConditionComputedColumnPlugin";
import PgConnectionArgCondition from "./plugins/PgConnectionArgCondition";
import PgConnectionArgFirstLastBeforeAfter from "./plugins/PgConnectionArgFirstLastBeforeAfter";
import PgConnectionArgOrderBy from "./plugins/PgConnectionArgOrderBy";
import PgConnectionArgOrderByDefaultValue from "./plugins/PgConnectionArgOrderByDefaultValue";
import PgConnectionTotalCount from "./plugins/PgConnectionTotalCount";
import PgForwardRelationPlugin from "./plugins/PgForwardRelationPlugin";
import PgIntrospectionPlugin from "./plugins/PgIntrospectionPlugin";
import PgJWTPlugin from "./plugins/PgJWTPlugin";
import PgMutationCreatePlugin from "./plugins/PgMutationCreatePlugin";
import PgMutationPayloadEdgePlugin from "./plugins/PgMutationPayloadEdgePlugin";
import PgMutationProceduresPlugin from "./plugins/PgMutationProceduresPlugin";
import PgMutationUpdateDeletePlugin from "./plugins/PgMutationUpdateDeletePlugin";
import PgNodeAliasPostGraphile from "./plugins/PgNodeAliasPostGraphile";
import PgOrderAllColumnsPlugin from "./plugins/PgOrderAllColumnsPlugin";
import PgOrderByPrimaryKeyPlugin from "./plugins/PgOrderByPrimaryKeyPlugin";
import PgOrderComputedColumnsPlugin from "./plugins/PgOrderComputedColumnsPlugin";
import PgQueryProceduresPlugin from "./plugins/PgQueryProceduresPlugin";
import PgRecordFunctionConnectionPlugin from "./plugins/PgRecordFunctionConnectionPlugin";
import PgRecordReturnTypesPlugin from "./plugins/PgRecordReturnTypesPlugin";
import PgRowByUniqueConstraint from "./plugins/PgRowByUniqueConstraint";
import PgRowNode from "./plugins/PgRowNode";
import PgScalarFunctionConnectionPlugin from "./plugins/PgScalarFunctionConnectionPlugin";
import PgTablesPlugin from "./plugins/PgTablesPlugin";
import PgTypesPlugin from "./plugins/PgTypesPlugin";
export { formatSQLForDebugging } from "./plugins/debugSql";

export { omit, parseIdentifier };

export const defaultPlugins = [
  PgBasicsPlugin,
  PgIntrospectionPlugin,
  PgTypesPlugin,
  PgJWTPlugin,
  PgTablesPlugin,
  PgConnectionArgFirstLastBeforeAfter,
  PgConnectionArgOrderBy,
  PgConnectionArgOrderByDefaultValue,
  PgConnectionArgCondition,
  PgConditionComputedColumnPlugin,
  PgAllRows,
  PgColumnsPlugin,
  PgColumnDeprecationPlugin,
  PgForwardRelationPlugin,
  PgBackwardRelationPlugin,
  PgRowByUniqueConstraint,
  PgComputedColumnsPlugin,
  PgQueryProceduresPlugin,
  PgOrderAllColumnsPlugin,
  PgOrderComputedColumnsPlugin,
  PgOrderByPrimaryKeyPlugin,
  PgRowNode,
  PgNodeAliasPostGraphile,
  PgRecordReturnTypesPlugin,
  PgRecordFunctionConnectionPlugin,
  PgScalarFunctionConnectionPlugin, // For PostGraphile compatibility
  PageInfoStartEndCursor, // For PostGraphile compatibility
  PgConnectionTotalCount,

  // Mutations
  PgMutationCreatePlugin,
  PgMutationUpdateDeletePlugin,
  PgMutationProceduresPlugin,
  PgMutationPayloadEdgePlugin,
];

// TypeScript compatibility

export {
  PageInfoStartEndCursor,
  PgAllRows,
  PgBackwardRelationPlugin,
  PgBasicsPlugin,
  PgColumnDeprecationPlugin,
  PgColumnsPlugin,
  PgComputedColumnsPlugin,
  PgConditionComputedColumnPlugin,
  PgConnectionArgCondition,
  PgConnectionArgFirstLastBeforeAfter,
  PgConnectionArgOrderBy,
  PgConnectionArgOrderByDefaultValue,
  PgConnectionTotalCount,
  PgForwardRelationPlugin,
  PgIntrospectionPlugin,
  PgJWTPlugin,
  PgMutationCreatePlugin,
  PgMutationPayloadEdgePlugin,
  PgMutationProceduresPlugin,
  PgMutationUpdateDeletePlugin,
  PgNodeAliasPostGraphile,
  PgOrderAllColumnsPlugin,
  PgOrderByPrimaryKeyPlugin,
  PgOrderComputedColumnsPlugin,
  PgQueryProceduresPlugin,
  PgRecordFunctionConnectionPlugin,
  PgRecordReturnTypesPlugin,
  PgRowByUniqueConstraint,
  PgRowNode,
  PgScalarFunctionConnectionPlugin,
  PgTablesPlugin,
  PgTypesPlugin,
};

export { camelCase, constantCase, upperFirst } from "graphile-build";

export type Inflector = never;

export {
  PgAttribute,
  PgAugmentIntrospectionResultsFn,
  PgClass,
  PgConstraint,
  PgEntity,
  PgEntityKind,
  PgExtension,
  PgIndex,
  PgIntrospectionResultsByKind,
  PgNamespace,
  PgProc,
  PgType,
  RawishIntrospectionResults,
  SmartTags,
} from "./plugins/PgIntrospectionPlugin";
export {
  CursorComparator,
  CursorValue,
  Gen,
  GenContext,
  NumberGen,
  default as QueryBuilder,
  RawAlias,
  SQL,
  sql,
  SQLAlias,
  SQLGen,
} from "./QueryBuilder";
export { parseTags } from "./utils";
export {
  getPgClientAndReleaserFromConfig,
  default as withPgClient,
} from "./withPgClient";
