import "graphile-config";

import { PgV4InflectionPlugin } from "../plugins/PgV4InflectionPlugin.js";
import { PgV4SmartTagsPlugin } from "../plugins/PgV4SmartTagsPlugin.js";
const preset: GraphileConfig.Preset = {
  plugins: [PgV4InflectionPlugin, PgV4SmartTagsPlugin],
};
export default preset;
