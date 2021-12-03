import type { Preset } from "graphile-plugin";

import { PgIntrospectionPlugin } from "./plugins/PgIntrospectionPlugin";

export const defaultPreset: Preset = {
  plugins: [PgIntrospectionPlugin],
};
