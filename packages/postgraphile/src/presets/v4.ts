import "graphile-config";

import { PgV4InflectionPlugin } from "../plugins/PgV4InflectionPlugin.js";
import { PgV4SmartTagsPlugin } from "../plugins/PgV4SmartTagsPlugin.js";

export interface V4Options {
  simpleCollections?: "both" | "only" | "omit";
  classicIds?: boolean;
  pgForbidSetofFunctionsToReturnNull?: boolean;
  dynamicJson?: boolean;
  jwtPgTypeIdentifier?: string;
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
        connectionType(previous, preset, typeName) {
          return this.pluralize(typeName) + `Connection`;
        },
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
      makeV4Plugin(options),
    ].filter(isNotNullish),
    schema: {
      pgV4UseTableNameForNodeIdentifier: true,
      pgForbidSetofFunctionsToReturnNull:
        options.pgForbidSetofFunctionsToReturnNull ?? false,
      jsonScalarAsString: options.dynamicJson !== true,
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
