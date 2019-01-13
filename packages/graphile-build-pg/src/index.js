// @flow
import PgBasicsPlugin from "./plugins/PgBasicsPlugin";
import PgIntrospectionPlugin from "./plugins/PgIntrospectionPlugin";
import PgTypesPlugin from "./plugins/PgTypesPlugin";
import PgJWTPlugin from "./plugins/PgJWTPlugin";
import PgTablesPlugin from "./plugins/PgTablesPlugin";
import PgConnectionArgFirstLastBeforeAfter from "./plugins/PgConnectionArgFirstLastBeforeAfter";
import PgConnectionArgOrderBy from "./plugins/PgConnectionArgOrderBy";
import PgConnectionArgOrderByDefaultValue from "./plugins/PgConnectionArgOrderByDefaultValue";
import PgConnectionArgCondition from "./plugins/PgConnectionArgCondition";
import PgConditionComputedColumnPlugin from "./plugins/PgConditionComputedColumnPlugin";
import PgAllRows from "./plugins/PgAllRows";
import PgColumnsPlugin from "./plugins/PgColumnsPlugin";
import PgColumnDeprecationPlugin from "./plugins/PgColumnDeprecationPlugin";
import PgForwardRelationPlugin from "./plugins/PgForwardRelationPlugin";
import PgBackwardRelationPlugin from "./plugins/PgBackwardRelationPlugin";
import PgRowByUniqueConstraint from "./plugins/PgRowByUniqueConstraint";
import PgComputedColumnsPlugin from "./plugins/PgComputedColumnsPlugin";
import PgQueryProceduresPlugin from "./plugins/PgQueryProceduresPlugin";
import PgOrderAllColumnsPlugin from "./plugins/PgOrderAllColumnsPlugin";
import PgOrderComputedColumnsPlugin from "./plugins/PgOrderComputedColumnsPlugin";
import PgOrderByPrimaryKeyPlugin from "./plugins/PgOrderByPrimaryKeyPlugin";
import PgRowNode from "./plugins/PgRowNode";
import PgNodeAliasPostGraphile from "./plugins/PgNodeAliasPostGraphile";
import PgRecordReturnTypesPlugin from "./plugins/PgRecordReturnTypesPlugin";
import PgRecordFunctionConnectionPlugin from "./plugins/PgRecordFunctionConnectionPlugin";
import PgScalarFunctionConnectionPlugin from "./plugins/PgScalarFunctionConnectionPlugin";
import PageInfoStartEndCursor from "./plugins/PageInfoStartEndCursor";
import PgConnectionTotalCount from "./plugins/PgConnectionTotalCount";

// Mutations
import PgMutationCreatePlugin from "./plugins/PgMutationCreatePlugin";
import PgMutationUpdateDeletePlugin from "./plugins/PgMutationUpdateDeletePlugin";
import PgMutationProceduresPlugin from "./plugins/PgMutationProceduresPlugin";
import PgMutationPayloadEdgePlugin from "./plugins/PgMutationPayloadEdgePlugin";

import parseIdentifier from "./parseIdentifier";
import omit from "./omit";
export { formatSQLForDebugging } from "./plugins/debugSql";

export { parseIdentifier, omit };

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

export {
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
  PgNodeAliasPostGraphile as PgNodeAliasPostGraphQL,
  PgRecordReturnTypesPlugin,
  PgRecordFunctionConnectionPlugin,
  PgScalarFunctionConnectionPlugin,
  PageInfoStartEndCursor,
  PgConnectionTotalCount,
  PgMutationCreatePlugin,
  PgMutationUpdateDeletePlugin,
  PgMutationProceduresPlugin,
  PgMutationPayloadEdgePlugin,
};

export { upperFirst, camelCase, constantCase } from "graphile-build";
