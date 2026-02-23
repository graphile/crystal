import "graphile-config";

declare global {
  namespace GraphileConfig {
    interface Plugins {
      NodeIdCodecBase64JSONPlugin: true;
    }
  }
}

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
        const {
          EXPORTABLE,
          grafast: { markSyncAndSafe },
        } = build;

        build.registerNodeIdCodec(
          EXPORTABLE(
            (markSyncAndSafe) => ({
              name: "base64JSON",
              encode: markSyncAndSafe(function base64JSONEncode(
                value: any,
              ): string | null {
                return Buffer.from(JSON.stringify(value), "utf8").toString(
                  "base64",
                );
              }),
              decode: markSyncAndSafe(function base64JSONDecode(
                value: string,
              ): any {
                return JSON.parse(
                  Buffer.from(value, "base64").toString("utf8"),
                );
              }),
            }),
            [markSyncAndSafe],
            "base64JSONNodeIdCodec",
          ),
        );
        return _;
      },
    },
  },
};
