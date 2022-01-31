import type { Plugin } from "graphile-plugin";

export const NodeIdCodecPipeStringPlugin: Plugin = {
  name: "NodeIdCodecPipeStringPlugin",
  version: "1.0.0",
  description: `Adds the 'pipeString' codec for NodeIDs`,

  schema: {
    hooks: {
      init(_, build) {
        build.registerNodeIdCodec("pipeString", {
          encode(value) {
            return Array.isArray(value) ? value.join("|") : null;
          },
          decode(value) {
            return typeof value === "string" ? value.split("|") : null;
          },
        });
        return _;
      },
    },
  },
};
