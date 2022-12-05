import "graphile-config";

import { PgRBACPlugin } from "graphile-build-pg";
import type { IncomingMessage, ServerResponse } from "http";

import { PgV4BehaviorPlugin } from "../plugins/PgV4BehaviorPlugin.js";
import { PgV4InflectionPlugin } from "../plugins/PgV4InflectionPlugin.js";
import { PgV4NoIgnoreIndexesPlugin } from "../plugins/PgV4NoIgnoreIndexes.js";
import { PgV4SmartTagsPlugin } from "../plugins/PgV4SmartTagsPlugin.js";

type PromiseOrDirect<T> = T | Promise<T>;
type DirectOrCallback<Request, T> = T | ((req: Request) => PromiseOrDirect<T>);

export interface V4GraphileBuildOptions {
  pgUseCustomNetworkScalars?: boolean;
}

export interface V4Options<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse,
> {
  simpleCollections?: "both" | "only" | "omit";
  classicIds?: boolean;
  setofFunctionsContainNulls?: boolean;
  dynamicJson?: boolean;
  jwtPgTypeIdentifier?: string;
  jwtSecret?: string;
  disableDefaultMutations?: boolean;
  ignoreIndexes?: boolean;
  appendPlugins?: GraphileConfig.Plugin[];
  skipPlugins?: GraphileConfig.Plugin[];

  /** @deprecated Please use grafast.context 'pgSettings' key instead */
  pgSettings?: DirectOrCallback<Request, { [key: string]: string | undefined }>;
  allowExplain?: DirectOrCallback<Request, boolean>;
  /** @deprecated Please use grafast.context callback instead */
  additionalGraphQLContextFromRequest?: (
    req: Request,
    res: Response,
  ) => Promise<Record<string, any>>;

  subscriptions?: boolean;
  ignoreRBAC?: boolean;

  graphileBuildOptions?: V4GraphileBuildOptions;
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
                build.behavior.addDefaultBehavior("+connection +list");
                break;
              }
              case "only": {
                build.behavior.addDefaultBehavior("-connection +list");
                break;
              }
              case "omit": {
                build.behavior.addDefaultBehavior("+connection -list");
                break;
              }
            }

            // We could base this on the legacy relations setting; but how to set deprecated?
            build.behavior.addDefaultBehavior(
              "-singularRelation:connection -singularRelation:list",
            );

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
  const { pgUseCustomNetworkScalars, ...otherGraphileBuildOptions } =
    options.graphileBuildOptions ?? {};
  return {
    plugins: [
      ...(options.ignoreRBAC === false ? [PgRBACPlugin] : []),
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
      ...(options.skipPlugins ? options.skipPlugins.map((p) => p.name) : []),
    ],
    schema: {
      ...otherGraphileBuildOptions,
      pgUseCustomNetworkScalars: pgUseCustomNetworkScalars ?? false,
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
    grafast: {
      ...(options.additionalGraphQLContextFromRequest || options.pgSettings
        ? {
            async context(ctx) {
              const context = Object.create(null);

              if (options.additionalGraphQLContextFromRequest) {
                const addl = await options.additionalGraphQLContextFromRequest(
                  ctx.httpRequest as any,
                  (ctx.httpRequest as any)?.res,
                );
                Object.assign(context, addl);
              }

              if (options.pgSettings) {
                const pgSettings =
                  typeof options.pgSettings === "function"
                    ? await options.pgSettings(ctx.httpRequest as any)
                    : options.pgSettings;
                Object.assign(context, { pgSettings });
              }

              return context;
            },
          }
        : null),
    },
  };
};

export default makeV4Preset();
