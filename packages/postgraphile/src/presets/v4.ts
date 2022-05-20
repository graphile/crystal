import "graphile-config";

import { PgV4SmartTagsPlugin } from "../plugins/PgV4SmartTagsPlugin.js";
const preset: GraphileConfig.Preset = {
  plugins: [PgV4SmartTagsPlugin],
};
export default preset;
