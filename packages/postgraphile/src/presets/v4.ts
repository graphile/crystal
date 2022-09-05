import "graphile-config";

import { PgV4BehaviorPlugin } from "../plugins/PgV4BehaviorPlugin.js";
import { PgV4InflectionPlugin } from "../plugins/PgV4InflectionPlugin.js";
import { PgV4NoIgnoreIndexesPlugin } from "../plugins/PgV4NoIgnoreIndexes.js";
import { PgV4NonNullableEdgesPlugin } from "../plugins/PgV4NonNullableEdgesPlugin.js";
import { PgV4SmartTagsPlugin } from "../plugins/PgV4SmartTagsPlugin.js";

export interface V4Options {
  simpleCollections?: "both" | "only" | "omit";
  classicIds?: boolean;
  setofFunctionsContainNulls?: boolean;
  dynamicJson?: boolean;
  jwtPgTypeIdentifier?: string;
  jwtSecret?: string;
  disableDefaultMutations?: boolean;
  ignoreIndexes?: boolean;
  appendPlugins?: GraphileConfig.Plugin[];
  graphileBuildOptions?: {
    pgUseCustomNetworkScalars?: boolean;
  };
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
          callback(build) {
            switch (options.simpleCollections) {
              case "both": {
                build.behavior.addDefaultBehavior("+collection +list");
                break;
              }
              case "only": {
                build.behavior.addDefaultBehavior("-collection +list");
                break;
              }
              case "omit": {
                build.behavior.addDefaultBehavior("+collection -list");
                break;
              }
            }

            return build;
          },
        },
      },
    },
  };
};

function parseJWTType(type: string): [string, string] {
  const parts = type.split(".");
  // TODO: parse this better!
  if (parts.length !== 2) {
    throw new Error(
      "Cannot parse JWT type - it must have schema and type name separated by a period",
    );
  }
  return parts.map((part) => {
    if (part[0] === '"') {
      if (part[part.length - 1] !== '"') {
        throw new Error(`Cannot parse JWT type; invalid quoting '${part}'`);
      }
      return part.slice(1, part.length - 1);
    } else {
      return part;
    }
  }) as [string, string];
}

export const makeV4Preset = (
  options: V4Options = {},
): GraphileConfig.Preset => {
  return {
    plugins: [
      PgV4InflectionPlugin,
      PgV4SmartTagsPlugin,
      PgV4BehaviorPlugin,
      ...(options.ignoreIndexes === false ? [PgV4NoIgnoreIndexesPlugin] : []),
      makeV4Plugin(options),
      ...(options.appendPlugins ? options.appendPlugins : []),
    ].filter(isNotNullish),
    disablePlugins: [
      ...(options.disableDefaultMutations
        ? ["PgMutationCreatePlugin", "PgMutationUpdateDeletePlugin"]
        : []),
    ],
    schema: {
      pgUseCustomNetworkScalars:
        options.graphileBuildOptions?.pgUseCustomNetworkScalars ?? false,
      pgV4UseTableNameForNodeIdentifier: true,
      pgForbidSetofFunctionsToReturnNull:
        options.setofFunctionsContainNulls === false,
      jsonScalarAsString: options.dynamicJson !== true,
      ...(options.jwtSecret != null
        ? {
            pgJwtSecret: options.jwtSecret,
          }
        : null),
    },
    gather: {
      ...(options.jwtPgTypeIdentifier
        ? {
            pgJwtType: parseJWTType(options.jwtPgTypeIdentifier),
          }
        : null),
    },
  };
};

export default makeV4Preset();
