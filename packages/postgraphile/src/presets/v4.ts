import "graphile-config";

import { PgV4InflectionPlugin } from "../plugins/PgV4InflectionPlugin.js";
import { PgV4SmartTagsPlugin } from "../plugins/PgV4SmartTagsPlugin.js";

export interface V4Options {
  simpleCollections?: "both" | "only" | "omit";
  classicIds?: boolean;
  pgForbidSetofFunctionsToReturnNull?: boolean;
}

function isNotNullish<T>(arg: T | undefined | null): arg is T {
  return arg != null;
}

const makeV4Plugin = (options: V4Options): GraphileConfig.Plugin => {
  const { classicIds = false } = options;
  return {
    name: "PostGraphileV4CompatibilityPlugin",
    version: "0.0.0",
    inflection: {
      replace: {
        ...(classicIds
          ? null
          : {
              // Rename GraphQL Global Object Identification 'id' to 'nodeId'
              // TODO: this will be better as `_id` in general, but V4 uses `nodeId`
              nodeIdFieldName() {
                return "nodeId";
              },
              // Don't rename 'id' to 'rowId'
              column(previous, options, details) {
                const columnFieldName = this.camelCase(
                  this._columnName(details),
                );
                return columnFieldName;
              },
            }),
      },
    },
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

export const makeV4Preset = (
  options: V4Options = {},
): GraphileConfig.Preset => {
  return {
    plugins: [
      PgV4InflectionPlugin,
      PgV4SmartTagsPlugin,
      makeV4Plugin(options),
    ].filter(isNotNullish),
    schema: {
      pgForbidSetofFunctionsToReturnNull:
        options.pgForbidSetofFunctionsToReturnNull ?? false,
    },
  };
};

export default makeV4Preset();
