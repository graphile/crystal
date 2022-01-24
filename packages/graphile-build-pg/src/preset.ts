import type { Preset } from "graphile-plugin";

import { PgAllRowsPlugin } from "./plugins/PgAllRowsPlugin";
import { PgBasicsPlugin } from "./plugins/PgBasicsPlugin";
import { PgCodecsPlugin } from "./plugins/PgCodecsPlugin";
import { PgColumnDeprecationPlugin } from "./plugins/PgColumnDeprecationPlugin";
import { PgColumnsPlugin } from "./plugins/PgColumnsPlugin";
import { PgConnectionTotalCountPlugin } from "./plugins/PgConnectionTotalCountPlugin";
import { PgCustomTypeFieldPlugin } from "./plugins/PgCustomTypeFieldPlugin";
import { PgIntrospectionPlugin } from "./plugins/PgIntrospectionPlugin";
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
  ],
};
