import type { Preset } from "graphile-plugin";

import { PgIntrospectionPlugin } from "./plugins/PgIntrospectionPlugin";
import { PgTablesPlugin } from "./plugins/PgTablesPlugin";

export const defaultPreset: Preset = {
  plugins: [PgIntrospectionPlugin, PgTablesPlugin],
};
