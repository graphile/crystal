import "graphile-config";

import * as dataplanPg from "@dataplan/pg";
import { PgContextPlugin } from "@dataplan/pg";
import sql, { version as pgSql2Version } from "pg-sql2";

import { PgAllRowsPlugin } from "./plugins/PgAllRowsPlugin.ts";
import { PgAttributeDeprecationPlugin } from "./plugins/PgAttributeDeprecationPlugin.ts";
import { PgAttributesPlugin } from "./plugins/PgAttributesPlugin.ts";
import { PgBasicsPlugin } from "./plugins/PgBasicsPlugin.ts";
import { PgCodecsPlugin } from "./plugins/PgCodecsPlugin.ts";
import { PgConditionArgumentPlugin } from "./plugins/PgConditionArgumentPlugin.ts";
import { PgConditionCustomFieldsPlugin } from "./plugins/PgConditionCustomFieldsPlugin.ts";
import { PgConnectionArgOrderByDefaultValuePlugin } from "./plugins/PgConnectionArgOrderByDefaultValuePlugin.ts";
import { PgConnectionArgOrderByPlugin } from "./plugins/PgConnectionArgOrderByPlugin.ts";
import { PgConnectionTotalCountPlugin } from "./plugins/PgConnectionTotalCountPlugin.ts";
import { PgCustomTypeFieldPlugin } from "./plugins/PgCustomTypeFieldPlugin.ts";
import { PgEnumDomainsPlugin } from "./plugins/PgEnumDomainsPlugin.ts";
import { PgEnumTablesPlugin } from "./plugins/PgEnumTablesPlugin.ts";
import { PgFakeConstraintsPlugin } from "./plugins/PgFakeConstraintsPlugin.ts";
import { PgFirstLastBeforeAfterArgsPlugin } from "./plugins/PgFirstLastBeforeAfterArgsPlugin.ts";
import { PgIndexBehaviorsPlugin } from "./plugins/PgIndexBehaviorsPlugin.ts";
import { PgInterfaceModeUnionAllRowsPlugin } from "./plugins/PgInterfaceModeUnionAllRowsPlugin.ts";
import { PgIntrospectionPlugin } from "./plugins/PgIntrospectionPlugin.ts";
import { PgJWTPlugin } from "./plugins/PgJWTPlugin.ts";
import { PgLtreePlugin } from "./plugins/PgLtreePlugin.ts";
import { PgMutationCreatePlugin } from "./plugins/PgMutationCreatePlugin.ts";
import { PgMutationPayloadEdgePlugin } from "./plugins/PgMutationPayloadEdgePlugin.ts";
import { PgMutationUpdateDeletePlugin } from "./plugins/PgMutationUpdateDeletePlugin.ts";
import { PgNodeIdAttributesPlugin } from "./plugins/PgNodeIdAttributesPlugin.ts";
import { PgOrderAllAttributesPlugin } from "./plugins/PgOrderAllAttributesPlugin.ts";
import { PgOrderByPrimaryKeyPlugin } from "./plugins/PgOrderByPrimaryKeyPlugin.ts";
import { PgOrderCustomFieldsPlugin } from "./plugins/PgOrderCustomFieldsPlugin.ts";
import { PgPolymorphismOnlyArgumentPlugin } from "./plugins/PgPolymorphismOnlyArgumentPlugin.ts";
import { PgPolymorphismPlugin } from "./plugins/PgPolymorphismPlugin.ts";
import { PgProceduresPlugin } from "./plugins/PgProceduresPlugin.ts";
import { PgRBACPlugin } from "./plugins/PgRBACPlugin.ts";
import { PgRefsPlugin } from "./plugins/PgRefsPlugin.ts";
import { PgRegistryPlugin } from "./plugins/PgRegistryPlugin.ts";
import { PgRelationsPlugin } from "./plugins/PgRelationsPlugin.ts";
import { PgRemoveExtensionResourcesPlugin } from "./plugins/PgRemoveExtensionResourcesPlugin.ts";
import { PgRowByUniquePlugin } from "./plugins/PgRowByUniquePlugin.ts";
import { PgTableNodePlugin } from "./plugins/PgTableNodePlugin.ts";
import { PgTablesPlugin } from "./plugins/PgTablesPlugin.ts";
import { PgTextSearchPlugin } from "./plugins/PgTextSearchPlugin.ts";
import { PgTypesPlugin } from "./plugins/PgTypesPlugin.ts";
import { version } from "./version.ts";

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
    PgEnumDomainsPlugin,
    PgCodecsPlugin,
    PgContextPlugin,
    PgTypesPlugin,
    PgRefsPlugin,
    PgIntrospectionPlugin,
    PgTablesPlugin,
    PgTextSearchPlugin,
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
