import "graphile-config";

import { DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES } from "grafserv";
import type { GraphQLError } from "graphql";
import type { IncomingMessage, ServerResponse } from "http";

import { PgV4BehaviorPlugin } from "../plugins/PgV4BehaviorPlugin.js";
import { PgV4InflectionPlugin } from "../plugins/PgV4InflectionPlugin.js";
import { PgV4SmartTagsPlugin } from "../plugins/PgV4SmartTagsPlugin.js";
import { parseDatabaseIdentifier } from "graphile-build-pg";

export { PgV4BehaviorPlugin, PgV4InflectionPlugin, PgV4SmartTagsPlugin };

type PromiseOrDirect<T> = T | Promise<T>;
type DirectOrCallback<Request, T> = T | ((req: Request) => PromiseOrDirect<T>);

export interface V4GraphileBuildOptions {
  pgUseCustomNetworkScalars?: boolean;
  pgStrictFunctions?: boolean;
  orderByNullsLast?: boolean;
}

export interface V4Options<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse,
> extends GraphileBuild.SchemaOptions {
  /**
   * - 'only': connections will be avoided, preferring lists
   * - 'omit': lists will be avoided, preferring connections
   * - 'both': both lists and connections will be generated
   */
  simpleCollections?: "only" | "both" | "omit";
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
    { [key: string]: string | null | undefined }
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

  graphqlRoute?: string;
  graphiqlRoute?: string;
  eventStreamRoute?: string;
  graphiql?: boolean;
  /** Always ignored, ruru is always enhanced. */
  enhanceGraphiql?: boolean;
  allowExplain?: boolean;
  handleErrors?: (error: readonly GraphQLError[]) => readonly GraphQLError[];

  /**
   * As of PostGraphile v5, query batching is no longer supported. Query batching
   * has not been standardized as part of the GraphQL-over-HTTP specification
   * efforts, and the need for it has been significantly reduced with the ubiquity
   * of HTTP2+ servers. Further, with incremental delivery (`@stream`/`@defer`)
   * on the horizon, query batching will develop a lot of unnecessary complexity
   * that handling at the network layer would bypass.
   *
   * @deprecated Use HTTP2+ instead
   */
  enableQueryBatching?: never;

  sortExport?: boolean;
  exportGqlSchemaPath?: string;
  exportJsonSchemaPath?: string;
  watchPg?: boolean;
}

function isNotNullish<T>(arg: T | undefined | null): arg is T {
  return arg != null;
}

const makeV4Plugin = (options: V4Options): GraphileConfig.Plugin => {
  const { classicIds = false } = options;
  const simpleCollectionsBehavior = (() => {
    switch (options.simpleCollections) {
      case "both": {
        return "+connection +resource:connection +list +resource:list";
      }
      case "only": {
        return "-connection -resource:connection +list +resource:list";
      }
      case "omit": {
        return "+connection +resource:connection -list -resource:list";
      }
      default: {
        return "";
      }
    }
  })();
  return {
    name: "PostGraphileV4CompatibilityPlugin",
    version: "0.0.0",
    after: ["PgAttributesPlugin", "PgMutationUpdateDeletePlugin"],
    inflection: {
      ignoreReplaceIfNotExists: ["nodeIdFieldName"],
      replace: {
        ...(classicIds ||
        options.skipPlugins?.some((p) => p.name === "NodePlugin")
          ? null
          : {
              // Rename GraphQL Global Object Identification 'id' to 'nodeId'
              // NOTE: this would be better as `_id` in general, but V4 uses `nodeId`
              nodeIdFieldName() {
                return "nodeId";
              },
            }),
        ...(classicIds
          ? null
          : {
              // Don't rename 'id' to 'rowId'
              attribute(previous, options, details) {
                const attributeFieldName = this.camelCase(
                  this._attributeName(details),
                );
                return attributeFieldName;
              },
            }),
      },
    },
    schema: {
      // We could base this on the legacy relations setting; but how to set deprecated?
      globalBehavior(behavior) {
        return `${behavior} ${simpleCollectionsBehavior} -singularRelation:resource:connection -singularRelation:resource:list +condition:attribute:filterBy +attribute:orderBy`;
      },
      entityBehavior: {
        pgResource: "+delete:resource:select",
        pgCodecAttribute(behavior, [codec, attributeName]) {
          const attribute = codec.attributes[attributeName];
          const underlyingCodec =
            attribute.codec.domainOfCodec ?? attribute.codec;
          const newBehavior = [behavior];
          if (
            underlyingCodec.arrayOfCodec ||
            underlyingCodec.isBinary ||
            underlyingCodec.rangeOfCodec
          ) {
            newBehavior.push("-attribute:orderBy");
          }
          if (
            underlyingCodec.isBinary ||
            underlyingCodec.arrayOfCodec?.isBinary
          ) {
            newBehavior.push("-condition:attribute:filterBy");
          }
          return newBehavior;
        },
      },
    },
  };
};

export const makeV4Preset = (
  options: V4Options = {},
): GraphileConfig.Preset => {
  const {
    pgUseCustomNetworkScalars,
    pgStrictFunctions,
    orderByNullsLast,
    ...otherGraphileBuildOptions
  } = options.graphileBuildOptions ?? {};
  if (options.enableQueryBatching) {
    throw new Error(
      `As of PostGraphile v5, query batching is no longer supported. Query batching has not been standardized as part of the GraphQL-over-HTTP specification efforts, and the need for it has been significantly reduced with the ubiquity of HTTP2+ servers. Further, with incremental delivery (@stream/@defer) on the horizon, query batching will develop a lot of unnecessary complexity that handling at the network layer would bypass.`,
    );
  }
  const graphqlPath = options.graphqlRoute ?? "/graphql";
  const graphiqlPath = options.graphiqlRoute ?? "/graphiql";
  const eventStreamPath = options.eventStreamRoute ?? `${graphqlPath}/stream`;
  return {
    plugins: [
      PgV4InflectionPlugin,
      PgV4SmartTagsPlugin,
      PgV4BehaviorPlugin,
      makeV4Plugin(options),
      ...(options.appendPlugins ? options.appendPlugins : []),
    ].filter(isNotNullish),
    disablePlugins: [
      ...(options.disableDefaultMutations
        ? ["PgMutationCreatePlugin", "PgMutationUpdateDeletePlugin"]
        : []),
      ...(options.skipPlugins ? options.skipPlugins.map((p) => p.name) : []),
      ...(options.ignoreRBAC !== false ? ["PgRBACPlugin"] : []),
      ...(options.ignoreIndexes === false ? [] : ["PgIndexBehaviorsPlugin"]),
    ],
    schema: {
      pgMutationPayloadRelations: true,
      ...otherGraphileBuildOptions,
      ...({ simpleCollections: options.simpleCollections } as any),
      pgUseCustomNetworkScalars: pgUseCustomNetworkScalars ?? false,
      pgOrderByNullsLast: orderByNullsLast,
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
      exportSchemaSDLPath: options.exportGqlSchemaPath,
      exportSchemaIntrospectionResultPath: options.exportJsonSchemaPath,
      sortExport: options.sortExport,
    },
    gather: {
      pgFakeConstraintsAutofixForeignKeyUniqueness: true,
      pgStrictFunctions,
      ...(options.jwtPgTypeIdentifier
        ? {
            pgJwtType: parseDatabaseIdentifier(options.jwtPgTypeIdentifier, 2),
          }
        : null),
    },
    grafast: {
      ...(options.additionalGraphQLContextFromRequest || options.pgSettings
        ? {
            async context(ctx) {
              const context = Object.create(null);

              const req = ctx.node?.req ?? ctx.ws?.request;
              const res = ctx.node?.res ?? (ctx.ws?.request as any)?.res;
              if (options.additionalGraphQLContextFromRequest) {
                if (!req || !res) {
                  console.warn(
                    `Could not determine req/res to use for additionalGraphQLContextFromRequest call.`,
                  );
                  console.warn(ctx);
                }
                const addl = await options.additionalGraphQLContextFromRequest(
                  req,
                  res,
                );
                Object.assign(context, addl);
              }

              if (options.pgSettings) {
                if (!req && typeof options.pgSettings === "function") {
                  console.warn(
                    `Could not determine req to use for pgSettings call.`,
                  );
                  console.warn(ctx);
                }
                const pgSettings =
                  typeof options.pgSettings === "function"
                    ? await options.pgSettings(req)
                    : options.pgSettings;
                Object.assign(context, { pgSettings });
              }

              return context;
            },
          }
        : null),
      ...(options.allowExplain
        ? {
            explain: true,
          }
        : null),
    },
    grafserv: {
      graphqlPath,
      graphiqlPath,
      eventStreamPath,
      graphiql: options.graphiql ?? false,
      ...(options.handleErrors
        ? {
            maskError(error) {
              return options.handleErrors!([error])[0];
            },
          }
        : null),
      watch: options.watchPg,
      websockets: options.subscriptions,
      allowedRequestContentTypes: [
        ...DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES,
        "application/x-www-form-urlencoded",
      ],
    },
  };
};

export const V4Preset = makeV4Preset();
export default V4Preset;
