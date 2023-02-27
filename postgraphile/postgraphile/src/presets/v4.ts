import "graphile-config";

import { PgRBACPlugin } from "graphile-build-pg";
import type { IncomingMessage, ServerResponse } from "http";

import { PgV4BehaviorPlugin } from "../plugins/PgV4BehaviorPlugin.js";
import { PgV4InflectionPlugin } from "../plugins/PgV4InflectionPlugin.js";
import { PgV4NoIgnoreIndexesPlugin } from "../plugins/PgV4NoIgnoreIndexesPlugin.js";
import { PgV4SmartTagsPlugin } from "../plugins/PgV4SmartTagsPlugin.js";

export {
  PgV4BehaviorPlugin,
  PgV4InflectionPlugin,
  PgV4NoIgnoreIndexesPlugin,
  PgV4SmartTagsPlugin,
};

type PromiseOrDirect<T> = T | Promise<T>;
type DirectOrCallback<Request, T> = T | ((req: Request) => PromiseOrDirect<T>);

export interface V4GraphileBuildOptions {
  pgUseCustomNetworkScalars?: boolean;
  pgStrictFunctions?: boolean;
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
  pgSettings?: DirectOrCallback<
    Request | undefined,
    { [key: string]: string | undefined }
  >;
  // TODO: allowExplain?: DirectOrCallback<Request | undefined, boolean>;
  /** @deprecated Please use grafast.context callback instead */
  additionalGraphQLContextFromRequest?: (
    req: Request | undefined,
    res: Response | undefined,
  ) => Promise<Record<string, any>>;

  subscriptions?: boolean;
  ignoreRBAC?: boolean;

  graphileBuildOptions?: V4GraphileBuildOptions;

  retryOnInitFail?:
    | boolean
    | ((error: Error, attempts: number) => boolean | Promise<boolean>);
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
        ...(classicIds ||
        options.skipPlugins?.some((p) => p.name === "NodePlugin")
          ? null
          : {
              // Rename GraphQL Global Object Identification 'id' to 'nodeId'
              // TODO: this will be better as `_id` in general, but V4 uses `nodeId`
              nodeIdFieldName() {
                return "nodeId";
              },
            }),
        ...(classicIds
          ? null
          : {
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
              "-singularRelation:source:connection -singularRelation:source:list",
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
  const {
    pgUseCustomNetworkScalars,
    pgStrictFunctions,
    ...otherGraphileBuildOptions
  } = options.graphileBuildOptions ?? {};
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
      ...(options.retryOnInitFail
        ? { retryOnInitFail: options.retryOnInitFail }
        : null),
    },
    gather: {
      pgStrictFunctions,
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
                  ctx.node?.req,
                  ctx.node?.res,
                );
                Object.assign(context, addl);
              }

              if (options.pgSettings) {
                const pgSettings =
                  typeof options.pgSettings === "function"
                    ? await options.pgSettings(ctx.node?.req)
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

export const V4Preset = makeV4Preset();
export default V4Preset;
