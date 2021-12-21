import type { Preset } from "graphile-plugin";

import { PgAllRowsPlugin } from "./plugins/PgAllRowsPlugin";
import { PgBasicsPlugin } from "./plugins/PgBasicsPlugin";
import { PgColumnsPlugin } from "./plugins/PgColumnsPlugin";
import { PgIntrospectionPlugin } from "./plugins/PgIntrospectionPlugin";
import { PgTablesPlugin } from "./plugins/PgTablesPlugin";
import { PgTypesPlugin } from "./plugins/PgTypesPlugin";

export const defaultPreset: Preset = {
  plugins: [
    PgBasicsPlugin,
    PgTypesPlugin,
    PgIntrospectionPlugin,
    PgTablesPlugin,
    PgColumnsPlugin,
    PgAllRowsPlugin,
  ],
};
