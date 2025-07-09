import "graphile-config";

const preset: GraphileConfig.Preset = {
  ruru: {
    enableProxy: true,
    htmlParts: {
      metaTags: (base) => base + "<!-- local override -->",
    },
  },
};
export default preset;
