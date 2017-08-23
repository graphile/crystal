// @flow
import PgBasicsPlugin from "./plugins/PgBasicsPlugin";
import PgIntrospectionPlugin from "./plugins/PgIntrospectionPlugin";
import PgTypesPlugin from "./plugins/PgTypesPlugin";
import PgJWTPlugin from "./plugins/PgJWTPlugin";
import PgTablesPlugin from "./plugins/PgTablesPlugin";
import PgConnectionArgFirstLastBeforeAfter from "./plugins/PgConnectionArgFirstLastBeforeAfter";
import PgConnectionArgOrderBy from "./plugins/PgConnectionArgOrderBy";
import PgConnectionArgCondition from "./plugins/PgConnectionArgCondition";
import PgAllRows from "./plugins/PgAllRows";
import PgColumnsPlugin from "./plugins/PgColumnsPlugin";
import PgForwardRelationPlugin from "./plugins/PgForwardRelationPlugin";
import PgBackwardRelationPlugin from "./plugins/PgBackwardRelationPlugin";
import PgRowByUniqueConstraint from "./plugins/PgRowByUniqueConstraint";
import PgComputedColumnsPlugin from "./plugins/PgComputedColumnsPlugin";
import PgQueryProceduresPlugin from "./plugins/PgQueryProceduresPlugin";
import PgOrderAllColumnsPlugin from "./plugins/PgOrderAllColumnsPlugin";
import PgOrderByPrimaryKeyPlugin from "./plugins/PgOrderByPrimaryKeyPlugin";
import PgRowNode from "./plugins/PgRowNode";
import PgNodeAliasPostGraphQL from "./plugins/PgNodeAliasPostGraphQL";
import PgScalarFunctionConnectionPlugin from "./plugins/PgScalarFunctionConnectionPlugin";
import PageInfoStartEndCursor from "./plugins/PageInfoStartEndCursor";
import PgConnectionTotalCount from "./plugins/PgConnectionTotalCount";

// Mutations
import PgMutationCreatePlugin from "./plugins/PgMutationCreatePlugin";
import PgMutationUpdateDeletePlugin from "./plugins/PgMutationUpdateDeletePlugin";
import PgMutationProceduresPlugin from "./plugins/PgMutationProceduresPlugin";
import PgMutationPayloadEdgePlugin from "./plugins/PgMutationPayloadEdgePlugin";

import * as inflections from "./inflections";

export const defaultPlugins = [
  PgBasicsPlugin,
  PgIntrospectionPlugin,
  PgTypesPlugin,
  PgJWTPlugin,
  PgTablesPlugin,
  PgConnectionArgFirstLastBeforeAfter,
  PgConnectionArgOrderBy,
  PgConnectionArgCondition,
  PgAllRows,
  PgColumnsPlugin,
  PgForwardRelationPlugin,
  PgBackwardRelationPlugin,
  PgRowByUniqueConstraint,
  PgComputedColumnsPlugin,
  PgQueryProceduresPlugin,
  PgOrderAllColumnsPlugin,
  PgOrderByPrimaryKeyPlugin,
  PgRowNode,
  PgNodeAliasPostGraphQL,
  PgScalarFunctionConnectionPlugin, // For PostGraphQL compatibility
  PageInfoStartEndCursor, // For PostGraphQL compatibility
  PgConnectionTotalCount,

  // Mutations
  PgMutationCreatePlugin,
  PgMutationUpdateDeletePlugin,
  PgMutationProceduresPlugin,
  PgMutationPayloadEdgePlugin,
];

export { inflections };

export {
  PgBasicsPlugin,
  PgIntrospectionPlugin,
  PgTypesPlugin,
  PgJWTPlugin,
  PgTablesPlugin,
  PgConnectionArgFirstLastBeforeAfter,
  PgConnectionArgOrderBy,
  PgConnectionArgCondition,
  PgAllRows,
  PgColumnsPlugin,
  PgForwardRelationPlugin,
  PgBackwardRelationPlugin,
  PgRowByUniqueConstraint,
  PgComputedColumnsPlugin,
  PgQueryProceduresPlugin,
  PgOrderAllColumnsPlugin,
  PgOrderByPrimaryKeyPlugin,
  PgRowNode,
  PgNodeAliasPostGraphQL,
  PgScalarFunctionConnectionPlugin,
  PageInfoStartEndCursor,
  PgConnectionTotalCount,
  PgMutationCreatePlugin,
  PgMutationUpdateDeletePlugin,
  PgMutationProceduresPlugin,
  PgMutationPayloadEdgePlugin,
};

export { upperFirst, camelCase, constantCase } from "./utils";
