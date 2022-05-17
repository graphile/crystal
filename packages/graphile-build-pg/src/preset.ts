import "graphile-config";

import { PgAllRowsPlugin } from "./plugins/PgAllRowsPlugin.js";
import { PgBasicsPlugin } from "./plugins/PgBasicsPlugin.js";
import { PgCodecsPlugin } from "./plugins/PgCodecsPlugin.js";
import { PgColumnDeprecationPlugin } from "./plugins/PgColumnDeprecationPlugin.js";
import { PgColumnsPlugin } from "./plugins/PgColumnsPlugin.js";
import { PgConditionArgumentPlugin } from "./plugins/PgConditionArgumentPlugin.js";
import { PgConditionCustomFieldsPlugin } from "./plugins/PgConditionCustomFieldsPlugin.js";
import { PgConnectionArgFirstLastBeforeAfterPlugin } from "./plugins/PgConnectionArgFirstLastBeforeAfterPlugin.js";
import { PgConnectionArgOrderByDefaultValuePlugin } from "./plugins/PgConnectionArgOrderByDefaultValuePlugin.js";
import { PgConnectionArgOrderByPlugin } from "./plugins/PgConnectionArgOrderByPlugin.js";
import { PgConnectionTotalCountPlugin } from "./plugins/PgConnectionTotalCountPlugin.js";
import { PgCustomTypeFieldPlugin } from "./plugins/PgCustomTypeFieldPlugin.js";
import { PgIntrospectionPlugin } from "./plugins/PgIntrospectionPlugin.js";
import { PgJWTPlugin } from "./plugins/PgJWTPlugin.js";
import { PgMutationCreatePlugin } from "./plugins/PgMutationCreatePlugin.js";
import { PgMutationPayloadEdgePlugin } from "./plugins/PgMutationPayloadEdgePlugin.js";
import { PgMutationUpdateDeletePlugin } from "./plugins/PgMutationUpdateDeletePlugin.js";
import { PgOrderAllColumnsPlugin } from "./plugins/PgOrderAllColumnsPlugin.js";
import { PgOrderByPrimaryKeyPlugin } from "./plugins/PgOrderByPrimaryKeyPlugin.js";
import { PgOrderCustomFieldsPlugin } from "./plugins/PgOrderCustomFieldsPlugin.js";
import { PgProceduresPlugin } from "./plugins/PgProceduresPlugin.js";
import { PgRelationsPlugin } from "./plugins/PgRelationsPlugin.js";
import { PgRowByUniquePlugin } from "./plugins/PgRowByUniquePlugin.js";
import { PgTableNodePlugin } from "./plugins/PgTableNodePlugin.js";
import { PgTablesPlugin } from "./plugins/PgTablesPlugin.js";
import { PgTypesPlugin } from "./plugins/PgTypesPlugin.js";

// TODO: version this.
export const defaultPreset: GraphileConfig.Preset = {
  plugins: [
    PgBasicsPlugin,
    PgCodecsPlugin,
    PgTypesPlugin,
    PgIntrospectionPlugin,
    PgTablesPlugin,
    PgMutationCreatePlugin,
    PgProceduresPlugin,
    PgColumnsPlugin,
    PgAllRowsPlugin,
    PgRowByUniquePlugin,
    PgConnectionTotalCountPlugin,
    PgRelationsPlugin,
    PgColumnDeprecationPlugin,
    PgCustomTypeFieldPlugin,
    PgConnectionArgFirstLastBeforeAfterPlugin,
    PgConditionArgumentPlugin,
    PgConditionCustomFieldsPlugin,
    PgConnectionArgOrderByPlugin,
    PgOrderByPrimaryKeyPlugin,
    PgOrderAllColumnsPlugin,
    PgOrderCustomFieldsPlugin,
    PgConnectionArgOrderByDefaultValuePlugin,
    PgTableNodePlugin,
    PgMutationPayloadEdgePlugin,
    PgMutationUpdateDeletePlugin,
    PgJWTPlugin,
  ],
};
