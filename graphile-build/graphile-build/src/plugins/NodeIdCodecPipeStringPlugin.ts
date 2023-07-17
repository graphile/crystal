import "graphile-config";

function pipeStringEncode(value: any): string | null {
  return Array.isArray(value) ? value.join("|") : null;
}
pipeStringEncode.isSyncAndSafe = true; // Optimization
function pipeStringDecode(value: string): any {
  return typeof value === "string" ? value.split("|") : null;
}
pipeStringDecode.isSyncAndSafe = true; // Optimization

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
        build.registerNodeIdCodec({
          name: "pipeString",
          encode: pipeStringEncode,
          decode: pipeStringDecode,
        });
        return _;
      },
    },
  },
};
