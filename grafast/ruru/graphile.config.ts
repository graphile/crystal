import "graphile-config";
import { baseHTMLParts } from "ruru/server";

const preset: GraphileConfig.Preset = {
  ruru: {
    enableProxy: true,
    htmlParts: {
      metaTags: baseHTMLParts.metaTags + '<!-- local override -->',
    }
  }
}
export default preset;
