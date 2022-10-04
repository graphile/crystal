import "graphile-config";

function encode(value: any): string | null {
  return Array.isArray(value) ? value.join("|") : null;
}
encode.isSyncAndSafe = true; // Optimization
function decode(value: string): any {
  return typeof value === "string" ? value.split("|") : null;
}
decode.isSyncAndSafe = true; // Optimization

export const NodeIdCodecPipeStringPlugin: GraphileConfig.Plugin = {
  name: "NodeIdCodecPipeStringPlugin",
  version: "1.0.0",
  description: `Adds the 'pipeString' codec for NodeIDs`,

  schema: {
    hooks: {
      init(_, build) {
        if (!build.registerNodeIdCodec) {
          return _;
        }
        build.registerNodeIdCodec("pipeString", {
          encode,
          decode,
        });
        return _;
      },
    },
  },
};
