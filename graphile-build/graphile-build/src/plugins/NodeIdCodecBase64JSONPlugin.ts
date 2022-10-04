import "graphile-config";
function encode(value: any): string | null {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
}
encode.isSyncAndSafe = true; // Optimization
function decode(value: string): any {
  return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
}
decode.isSyncAndSafe = true; // Optimization

export const NodeIdCodecBase64JSONPlugin: GraphileConfig.Plugin = {
  name: "NodeIdCodecBase64JSONPlugin",
  version: "1.0.0",
  description: `Adds the 'base64JSON' codec for NodeIDs`,

  schema: {
    hooks: {
      init(_, build) {
        if (!build.registerNodeIdCodec) {
          return _;
        }
        build.registerNodeIdCodec("base64JSON", {
          encode,
          decode,
        });
        return _;
      },
    },
  },
};
