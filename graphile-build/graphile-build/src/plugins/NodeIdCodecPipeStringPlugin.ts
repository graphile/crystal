import "graphile-config";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      NodeIdCodecPipeStringPlugin: true;
    }
  }
}

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
        const {
          EXPORTABLE,
          grafast: { markSyncAndSafe },
        } = build;
        build.registerNodeIdCodec(
          EXPORTABLE(
            (markSyncAndSafe) => ({
              name: "pipeString",
              encode: markSyncAndSafe(function pipeStringEncode(
                value: any,
              ): string | null {
                return Array.isArray(value) ? value.join("|") : null;
              }),
              decode: markSyncAndSafe(function pipeStringDecode(
                value: string,
              ): any {
                return typeof value === "string" ? value.split("|") : null;
              }),
            }),
            [markSyncAndSafe],
            "pipeStringNodeIdCodec",
          ),
        );
        return _;
      },
    },
  },
};
