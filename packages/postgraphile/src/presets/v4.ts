import "graphile-config";

import { PgV4InflectionPlugin } from "../plugins/PgV4InflectionPlugin.js";
import { PgV4SmartTagsPlugin } from "../plugins/PgV4SmartTagsPlugin.js";

export interface V4Options {
  simpleCollections?: "both" | "only" | "omit";
}

function isNotNullish<T>(arg: T | undefined | null): arg is T {
  return arg != null;
}

const makeV4Plugin = (options: V4Options): GraphileConfig.Plugin => {
  return {
    name: "PostGraphileV4CompatibilityPlugin",
    version: "0.0.0",
    schema: {
      hooks: {
        build: {
          callback(input) {
            switch (options.simpleCollections) {
              case "both": {
                input.behavior.addDefaultBehavior("+collection +list");
                break;
              }
              case "only": {
                input.behavior.addDefaultBehavior("-collection +list");
                break;
              }
              case "omit": {
                input.behavior.addDefaultBehavior("+collection -list");
                break;
              }
            }
            return input;
          },
        },
      },
    },
  };
};

export const makeV4Preset = (options?: V4Options): GraphileConfig.Preset => {
  return {
    plugins: [
      PgV4InflectionPlugin,
      PgV4SmartTagsPlugin,
      options ? makeV4Plugin(options) : null,
    ].filter(isNotNullish),
  };
};

export default makeV4Preset();
