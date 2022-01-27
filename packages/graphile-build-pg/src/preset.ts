import type { Preset } from "graphile-plugin";

import { PgAllRowsPlugin } from "./plugins/PgAllRowsPlugin";
import { PgBasicsPlugin } from "./plugins/PgBasicsPlugin";
import { PgCodecsPlugin } from "./plugins/PgCodecsPlugin";
import { PgColumnDeprecationPlugin } from "./plugins/PgColumnDeprecationPlugin";
import { PgColumnsPlugin } from "./plugins/PgColumnsPlugin";
import { PgConditionArgumentPlugin } from "./plugins/PgConditionArgumentPlugin";
import { PgConnectionArgFirstLastBeforeAfterPlugin } from "./plugins/PgConnectionArgFirstLastBeforeAfterPlugin";
import { PgConnectionArgOrderByDefaultValuePlugin } from "./plugins/PgConnectionArgOrderByDefaultValuePlugin";
import { PgConnectionArgOrderByPlugin } from "./plugins/PgConnectionArgOrderByPlugin";
import { PgConnectionTotalCountPlugin } from "./plugins/PgConnectionTotalCountPlugin";
import { PgCustomConditionPlugin } from "./plugins/PgCustomConditionPlugin";
import { PgCustomTypeFieldPlugin } from "./plugins/PgCustomTypeFieldPlugin";
import { PgIntrospectionPlugin } from "./plugins/PgIntrospectionPlugin";
import { PgOrderAllColumnsPlugin } from "./plugins/PgOrderAllColumnsPlugin";
import { PgOrderByPrimaryKeyPlugin } from "./plugins/PgOrderByPrimaryKeyPlugin";
import { PgProceduresPlugin } from "./plugins/PgProceduresPlugin";
import { PgRelationsPlugin } from "./plugins/PgRelationsPlugin";
import { PgTablesPlugin } from "./plugins/PgTablesPlugin";
import { PgTypesPlugin } from "./plugins/PgTypesPlugin";

export const defaultPreset: Preset = {
  plugins: [
    PgBasicsPlugin,
    PgCodecsPlugin,
    PgTypesPlugin,
    PgIntrospectionPlugin,
    PgTablesPlugin,
    PgProceduresPlugin,
    PgColumnsPlugin,
    PgAllRowsPlugin,
    PgConnectionTotalCountPlugin,
    PgRelationsPlugin,
    PgColumnDeprecationPlugin,
    PgCustomTypeFieldPlugin,
    PgConnectionArgFirstLastBeforeAfterPlugin,
    PgConditionArgumentPlugin,
    PgCustomConditionPlugin,
    PgConnectionArgOrderByPlugin,
    PgOrderAllColumnsPlugin,
    PgConnectionArgOrderByDefaultValuePlugin,
    PgOrderByPrimaryKeyPlugin,
  ],
};
