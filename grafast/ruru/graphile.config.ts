import "graphile-config";

import { defaultHTMLParts } from "ruru/server";

const preset: GraphileConfig.Preset = {
  ruru: {
    enableProxy: true,
    htmlParts: {
      metaTags: defaultHTMLParts.metaTags + "<!-- local override -->",
    },
  },
};
export default preset;
