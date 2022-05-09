import "graphile-plugin";

import { PgAllRowsPlugin } from "./plugins/PgAllRowsPlugin";
import { PgBasicsPlugin } from "./plugins/PgBasicsPlugin";
import { PgCodecsPlugin } from "./plugins/PgCodecsPlugin";
import { PgColumnDeprecationPlugin } from "./plugins/PgColumnDeprecationPlugin";
import { PgColumnsPlugin } from "./plugins/PgColumnsPlugin";
import { PgConditionArgumentPlugin } from "./plugins/PgConditionArgumentPlugin";
import { PgConditionCustomFieldsPlugin } from "./plugins/PgConditionCustomFieldsPlugin";
import { PgConnectionArgFirstLastBeforeAfterPlugin } from "./plugins/PgConnectionArgFirstLastBeforeAfterPlugin";
import { PgConnectionArgOrderByDefaultValuePlugin } from "./plugins/PgConnectionArgOrderByDefaultValuePlugin";
import { PgConnectionArgOrderByPlugin } from "./plugins/PgConnectionArgOrderByPlugin";
import { PgConnectionTotalCountPlugin } from "./plugins/PgConnectionTotalCountPlugin";
import { PgCustomTypeFieldPlugin } from "./plugins/PgCustomTypeFieldPlugin";
import { PgIntrospectionPlugin } from "./plugins/PgIntrospectionPlugin";
import { PgJWTPlugin } from "./plugins/PgJWTPlugin";
import { PgMutationCreatePlugin } from "./plugins/PgMutationCreatePlugin";
import { PgMutationPayloadEdgePlugin } from "./plugins/PgMutationPayloadEdgePlugin";
import { PgMutationUpdateDeletePlugin } from "./plugins/PgMutationUpdateDeletePlugin";
import { PgOrderAllColumnsPlugin } from "./plugins/PgOrderAllColumnsPlugin";
import { PgOrderByPrimaryKeyPlugin } from "./plugins/PgOrderByPrimaryKeyPlugin";
import { PgOrderCustomFieldsPlugin } from "./plugins/PgOrderCustomFieldsPlugin";
import { PgProceduresPlugin } from "./plugins/PgProceduresPlugin";
import { PgRelationsPlugin } from "./plugins/PgRelationsPlugin";
import { PgRowByUniquePlugin } from "./plugins/PgRowByUniquePlugin";
import { PgTableNodePlugin } from "./plugins/PgTableNodePlugin";
import { PgTablesPlugin } from "./plugins/PgTablesPlugin";
import { PgTypesPlugin } from "./plugins/PgTypesPlugin";

// TODO: version this.
export const defaultPreset: GraphilePlugin.Preset = {
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
