import type { Preset } from "graphile-plugin";

import { PgAllRowsPlugin } from "./plugins/PgAllRowsPlugin";
import { PgBasicsPlugin } from "./plugins/PgBasicsPlugin";
import { PgColumnsPlugin } from "./plugins/PgColumnsPlugin";
import { PgConnectionTotalCountPlugin } from "./plugins/PgConnectionTotalCountPlugin";
import { PgIntrospectionPlugin } from "./plugins/PgIntrospectionPlugin";
import { PgRelationsPlugin } from "./plugins/PgRelationsPlugin";
import { PgTablesPlugin } from "./plugins/PgTablesPlugin";
import { PgTypesPlugin } from "./plugins/PgTypesPlugin";
import { PgColumnDeprecationPlugin } from "./plugins/PgColumnDeprecationPlugin";
import { PgCustomTypeFieldPlugin } from "./plugins/PgCustomTypeFieldPlugin";

export const defaultPreset: Preset = {
  plugins: [
    PgBasicsPlugin,
    PgTypesPlugin,
    PgIntrospectionPlugin,
    PgTablesPlugin,
    PgColumnsPlugin,
    PgAllRowsPlugin,
    PgConnectionTotalCountPlugin,
    PgRelationsPlugin,
    PgColumnDeprecationPlugin,
    PgCustomTypeFieldPlugin,
  ],
};
