exports.defaultPlugins = [
  require("./plugins/PgBasicsPlugin"),
  require("./plugins/PgIntrospectionPlugin"),
  require("./plugins/PgTypesPlugin"),
  require("./plugins/PgJWTPlugin"),
  require("./plugins/PgTablesPlugin"),
  require("./plugins/PgConnectionArgFirstLastBeforeAfter"),
  require("./plugins/PgConnectionArgOrderBy"),
  require("./plugins/PgConnectionArgCondition"),
  require("./plugins/PgAllRows"),
  require("./plugins/PgColumnsPlugin"),
  require("./plugins/PgForwardRelationPlugin"),
  require("./plugins/PgBackwardRelationPlugin"),
  require("./plugins/PgRowByUniqueConstraint"),
  require("./plugins/PgComputedColumnsPlugin"),
  require("./plugins/PgQueryProceduresPlugin"),
  require("./plugins/PgOrderAllColumnsPlugin"),
  require("./plugins/PgOrderByPrimaryKeyPlugin"),
  require("./plugins/PgRowNode"),
  require("./plugins/PgNodeAliasPostGraphQL"),
  require("./plugins/PgScalarFunctionConnectionPlugin"), // For PostGraphQL compatibility
  require("./plugins/PageInfoStartEndCursor"), // For PostGraphQL compatibility
  require("./plugins/PgConnectionTotalCount"),

  // Mutations
  require("./plugins/PgMutationCreatePlugin"),
  require("./plugins/PgMutationUpdateDeletePlugin"),
  require("./plugins/PgMutationProceduresPlugin"),
  require("./plugins/PgMutationPayloadEdgePlugin"),
];
exports.inflections = require("./inflections");
