import "graphile-config";

export const NodeIdCodecBase64JSONPlugin: GraphileConfig.Plugin = {
  name: "NodeIdCodecBase64JSONPlugin",
  version: "1.0.0",
  description: `Adds the 'base64JSON' codec for NodeIDs`,

  schema: {
    hooks: {
      init(_, build) {
        build.registerNodeIdCodec("base64JSON", {
          encode(value) {
            return Buffer.from(JSON.stringify(value), "utf8").toString(
              "base64",
            );
          },
          decode(value) {
            return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
          },
        });
        return _;
      },
    },
  },
};
