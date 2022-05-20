import "graphile-config";

import { PgV4SmartTagsOmitPlugin } from "../plugins/PgV4SmartTagsOmitPlugin.js";
const preset: GraphileConfig.Preset = {
  plugins: [PgV4SmartTagsOmitPlugin],
};
export default preset;
