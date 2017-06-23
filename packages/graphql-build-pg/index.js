exports.defaultPlugins = [
  require("./plugins/PgIntrospectionPlugin"),
  require("./plugins/PgTypesPlugin"),
  require("./plugins/PgTablesPlugin"),
  require("./plugins/PgAllRows"),
  //require("./plugins/PgRowByUniqueConstraint"),
  //require("./plugins/PgColumnsPlugin"),
  //require("./plugins/PgComputedColumnsPlugin"),
  //require("./plugins/PgForwardRelationPlugin"),
  //require("./plugins/PgBackwardRelationPlugin"),
  //require("./plugins/PgConnectionArgs"),
];
exports.inflections = require("./inflections");
