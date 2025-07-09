import "graphile-config";

const preset: GraphileConfig.Preset = {
  ruru: {
    enableProxy: true,
    htmlParts: {
      metaTags(original) {
        return original + "<!-- local override -->";
      },
    },
  },
};
export default preset;
