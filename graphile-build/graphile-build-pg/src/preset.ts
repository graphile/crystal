import "graphile-config";

import * as dataplanPg from "@dataplan/pg";
import { PgContextPlugin } from "@dataplan/pg";
import sql, { version as pgSql2Version } from "pg-sql2";

import { PgAllRowsPlugin } from "./plugins/PgAllRowsPlugin.js";
import { PgAttributeDeprecationPlugin } from "./plugins/PgAttributeDeprecationPlugin.js";
import { PgAttributesPlugin } from "./plugins/PgAttributesPlugin.js";
import { PgBasicsPlugin } from "./plugins/PgBasicsPlugin.js";
import { PgCodecsPlugin } from "./plugins/PgCodecsPlugin.js";
import { PgConditionArgumentPlugin } from "./plugins/PgConditionArgumentPlugin.js";
import { PgConditionCustomFieldsPlugin } from "./plugins/PgConditionCustomFieldsPlugin.js";
import { PgConnectionArgOrderByDefaultValuePlugin } from "./plugins/PgConnectionArgOrderByDefaultValuePlugin.js";
import { PgConnectionArgOrderByPlugin } from "./plugins/PgConnectionArgOrderByPlugin.js";
import { PgConnectionTotalCountPlugin } from "./plugins/PgConnectionTotalCountPlugin.js";
import { PgCustomTypeFieldPlugin } from "./plugins/PgCustomTypeFieldPlugin.js";
import { PgEnumTablesPlugin } from "./plugins/PgEnumTablesPlugin.js";
import { PgFakeConstraintsPlugin } from "./plugins/PgFakeConstraintsPlugin.js";
import { PgFirstLastBeforeAfterArgsPlugin } from "./plugins/PgFirstLastBeforeAfterArgsPlugin.js";
import { PgIndexBehaviorsPlugin } from "./plugins/PgIndexBehaviorsPlugin.js";
import { PgInterfaceModeUnionAllRowsPlugin } from "./plugins/PgInterfaceModeUnionAllRowsPlugin.js";
import { PgIntrospectionPlugin } from "./plugins/PgIntrospectionPlugin.js";
import { PgJWTPlugin } from "./plugins/PgJWTPlugin.js";
import { PgLtreePlugin } from "./plugins/PgLtreePlugin.js";
import { PgMutationCreatePlugin } from "./plugins/PgMutationCreatePlugin.js";
import { PgMutationPayloadEdgePlugin } from "./plugins/PgMutationPayloadEdgePlugin.js";
import { PgMutationUpdateDeletePlugin } from "./plugins/PgMutationUpdateDeletePlugin.js";
import { PgNodeIdAttributesPlugin } from "./plugins/PgNodeIdAttributesPlugin.js";
import { PgOrderAllAttributesPlugin } from "./plugins/PgOrderAllAttributesPlugin.js";
import { PgOrderByPrimaryKeyPlugin } from "./plugins/PgOrderByPrimaryKeyPlugin.js";
import { PgOrderCustomFieldsPlugin } from "./plugins/PgOrderCustomFieldsPlugin.js";
import { PgPolymorphismOnlyArgumentPlugin } from "./plugins/PgPolymorphismOnlyArgumentPlugin.js";
import { PgPolymorphismPlugin } from "./plugins/PgPolymorphismPlugin.js";
import { PgProceduresPlugin } from "./plugins/PgProceduresPlugin.js";
import { PgRBACPlugin } from "./plugins/PgRBACPlugin.js";
import { PgRefsPlugin } from "./plugins/PgRefsPlugin.js";
import { PgRegistryPlugin } from "./plugins/PgRegistryPlugin.js";
import { PgRelationsPlugin } from "./plugins/PgRelationsPlugin.js";
import { PgRemoveExtensionResourcesPlugin } from "./plugins/PgRemoveExtensionResourcesPlugin.js";
import { PgRowByUniquePlugin } from "./plugins/PgRowByUniquePlugin.js";
import { PgTableNodePlugin } from "./plugins/PgTableNodePlugin.js";
import { PgTablesPlugin } from "./plugins/PgTablesPlugin.js";
import { PgTypesPlugin } from "./plugins/PgTypesPlugin.js";
import { version } from "./version.js";

declare global {
  namespace GraphileConfig {
    interface Lib {
      /** The `@dataplan/pg` module */
      dataplanPg: typeof dataplanPg;
      /** The `pg-sql2` module's `sql` export */
      sql: typeof sql;
    }
  }
}

export const GraphileBuildPgLibPreset: GraphileConfig.Preset = {
  lib: {
    versions: {
      "graphile-build-pg": version,
      "@dataplan/pg": dataplanPg.version,
      "pg-sql2": pgSql2Version,
    },
    dataplanPg,
    sql,
  },
};

// TODO: version this.
export const defaultPreset: GraphileConfig.Preset = {
  extends: [GraphileBuildPgLibPreset],
  plugins: [
    PgBasicsPlugin,
    PgLtreePlugin,
    PgCodecsPlugin,
    PgContextPlugin,
    PgTypesPlugin,
    PgRefsPlugin,
    PgIntrospectionPlugin,
    PgTablesPlugin,
    PgMutationCreatePlugin,
    PgProceduresPlugin,
    PgAttributesPlugin,
    PgNodeIdAttributesPlugin,
    PgAllRowsPlugin,
    PgRowByUniquePlugin,
    PgConnectionTotalCountPlugin,
    PgRelationsPlugin,
    PgAttributeDeprecationPlugin,
    PgCustomTypeFieldPlugin,
    PgFirstLastBeforeAfterArgsPlugin,
    PgConnectionArgOrderByPlugin,
    PgConditionArgumentPlugin,
    PgConditionCustomFieldsPlugin,
    PgFakeConstraintsPlugin,
    PgOrderByPrimaryKeyPlugin,
    PgOrderAllAttributesPlugin,
    PgOrderCustomFieldsPlugin,
    PgConnectionArgOrderByDefaultValuePlugin,
    PgTableNodePlugin,
    PgMutationPayloadEdgePlugin,
    PgMutationUpdateDeletePlugin,
    PgJWTPlugin,
    PgRemoveExtensionResourcesPlugin,
    PgEnumTablesPlugin,
    PgPolymorphismPlugin,
    PgInterfaceModeUnionAllRowsPlugin,
    PgRBACPlugin,
    PgIndexBehaviorsPlugin,
    PgRegistryPlugin,
    PgPolymorphismOnlyArgumentPlugin,
  ],
};
