import "graphile-config";

import type { GraphQLError, GraphQLFormattedError } from "grafast/graphql";
import { formatError as defaultFormatError } from "grafast/graphql";
import { DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES } from "grafserv";
import type { IncomingMessage, ServerResponse } from "http";

import { PgV4BehaviorPlugin } from "../plugins/PgV4BehaviorPlugin.js";
import { PgV4InflectionPlugin } from "../plugins/PgV4InflectionPlugin.js";
import { PgV4SimpleSubscriptionsPlugin } from "../plugins/PgV4SimpleSubscriptionsPlugin.js";
import { PgV4SmartTagsPlugin } from "../plugins/PgV4SmartTagsPlugin.js";
import PostGraphileAmberPreset from "./amber.js";

export {
  PgV4BehaviorPlugin,
  PgV4InflectionPlugin,
  PgV4SimpleSubscriptionsPlugin,
  PgV4SmartTagsPlugin,
};

type PromiseOrDirect<T> = T | Promise<T>;
type DirectOrCallback<Request, T> = T | ((req: Request) => PromiseOrDirect<T>);

export interface V4GraphileBuildOptions {
  pgUseCustomNetworkScalars?: boolean;
  pgStrictFunctions?: boolean;
  orderByNullsLast?: boolean;
}

export interface V4ErrorOutputOptions {
  handleErrors?: (error: readonly GraphQLError[]) => readonly GraphQLError[];
  extendedErrors?: string[];
  showErrorStack?: boolean | "json";
}

export interface V4Options<
  Request extends IncomingMessage = IncomingMessage,
  Response extends ServerResponse = ServerResponse,
> extends GraphileBuild.SchemaOptions,
    V4ErrorOutputOptions {
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
  /**
   * preset.grafserv.maxRequestLength: the length, in bytes, for the largest
   * request body that grafserv will accept. String values no longer supported.
   */
  bodySizeLimit?: number;
  /** Always ignored, ruru is always enhanced. */
  enhanceGraphiql?: boolean;
  allowExplain?: boolean;

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
  /** @deprecated Use 'preset.grafast.context' callback instead */
  defaultRole?: never;

  simpleSubscriptions?: boolean;
}

function isNotNullish<T>(arg: T | undefined | null): arg is T {
  return arg != null;
}

const makeV4Plugin = (options: V4Options): GraphileConfig.Plugin => {
  const { classicIds = false, defaultRole } = options;
  if (defaultRole) {
    throw new Error(
      `The 'defaultRole' V4 option is not currently supported in V5; please use the \`preset.grafast.context\` callback instead.`,
    );
  }
  const simpleCollectionsBehavior = ((): GraphileBuild.BehaviorString[] => {
    switch (options.simpleCollections) {
      case "both": {
        return ["connection", "resource:connection", "list", "resource:list"];
      }
      case "only": {
        return ["-connection", "-resource:connection", "list", "resource:list"];
      }
      case "omit": {
        return ["connection", "resource:connection", "-list", "-resource:list"];
      }
      default: {
        return [];
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
        ...(classicIds
          ? null
          : {
              // Undo rename of 'id' to 'rowId'
              _attributeName(previous, options, details) {
                const name = previous!(details);
                if (!details.skipRowId && name === "row_id") {
                  const { codec, attributeName } = details;
                  const attribute = codec.attributes[attributeName];
                  const baseName =
                    attribute.extensions?.tags?.name || attributeName;
                  if (baseName === "id" && !codec.isAnonymous) {
                    return "id";
                  }
                }
                return name;
              },
            }),
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
      },
    },
    schema: {
      // We could base this on the legacy relations setting; but how to set deprecated?
      globalBehavior(behavior) {
        return [
          behavior,
          ...simpleCollectionsBehavior,
          "-singularRelation:resource:connection",
          "-singularRelation:resource:list",
          "condition:attribute:filterBy",
          "attribute:orderBy",
          "resource:connection:backwards",
        ];
      },
      entityBehavior: {
        pgResource: "delete:resource:select",
        pgCodecAttribute: {
          inferred(behavior, [codec, attributeName]) {
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
    },
  };
};

/** bodySizeLimit to maxRequestLength */
function bsl2mrl(bsl: number | string) {
  if (typeof bsl !== "number") {
    throw new Error(
      `bodySizeLimit must now be a number of bytes, string formats are no longer supported`,
    );
  } else {
    return bsl;
  }
}

export type GraphQLErrorExtended = GraphQLError & {
  extensions: {
    exception: {
      hint?: string;
      detail?: string;
      code: string;
    };
  };
};

/**
 * Extracts the requested fields from a pg error object, handling 'code' to
 * 'errcode' mapping.
 */
function pickPgError(
  err: Record<string, unknown>,
  inFields: string | Array<string>,
): Record<string, string | null | undefined> {
  const result: Record<string, string | null | undefined> = Object.create(null);
  let fields;
  if (Array.isArray(inFields)) {
    fields = inFields;
  } else if (typeof inFields === "string") {
    fields = inFields.split(",");
  } else {
    throw new Error(
      "Invalid argument to extendedErrors - expected array of strings",
    );
  }

  if (err && typeof err === "object") {
    fields.forEach((field: string) => {
      // pg places 'errcode' on the 'code' property
      if (typeof field !== "string") {
        throw new Error(
          "Invalid argument to extendedErrors - expected array of strings",
        );
      }
      const errField = field === "errcode" ? "code" : field;
      result[field] =
        err[errField] != null
          ? String(err[errField])
          : (err[errField] as null | undefined);
    });
  }
  return result;
}

/**
 * Given a GraphQLError, format it according to the rules described by the
 * Response Format, Errors section of the GraphQL Specification, plus it can
 * extract additional error codes from the postgres error, such as 'hint',
 * 'detail', 'errcode', 'where', etc. - see `extendedErrors` option.
 */
function extendedFormatError(
  error: GraphQLError,
  fields: Array<string>,
): GraphQLFormattedError {
  if (!error) {
    throw new Error("Received null or undefined error.");
  }
  const originalError = error.originalError as
    | Record<string, unknown>
    | undefined;
  const exceptionDetails =
    originalError && fields ? pickPgError(originalError, fields) : undefined;
  return {
    message: error.message,
    locations: error.locations,
    path: error.path,
    ...(exceptionDetails
      ? {
          // Reference: https://facebook.github.io/graphql/draft/#sec-Errors
          extensions: {
            ...(originalError?.extensions as
              | Record<string, any>
              | null
              | undefined),
            exception: exceptionDetails,
          },
        }
      : null),
  };
}

export function makeV4ErrorOutputPreset(options: V4ErrorOutputOptions): {
  grafserv: {
    maskError?: GraphileConfig.GrafservOptions["maskError"];
  };
} {
  const { extendedErrors, showErrorStack, handleErrors } = options;
  if (handleErrors) {
    if (extendedErrors || showErrorStack) {
      throw new Error(
        `handleErrors cannot be combined with extendedErrors / showErrorStack`,
      );
    }
    return {
      grafserv: {
        maskError(error) {
          return handleErrors!([error])[0];
        },
      },
    };
  } else if (extendedErrors || showErrorStack) {
    return {
      grafserv: {
        maskError(error) {
          const formattedError =
            extendedErrors && extendedErrors.length
              ? extendedFormatError(error, extendedErrors)
              : defaultFormatError(error);
          // If the user wants to see the error’s stack, let’s add it to the
          // formatted error.
          if (showErrorStack) {
            (formattedError as Record<string, any>)["stack"] =
              error.stack != null && showErrorStack === "json"
                ? error.stack.split("\n")
                : error.stack;
          }

          return formattedError;
        },
      },
    };
  } else {
    return { grafserv: {} };
  }
}

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
  const bodySizeLimit = options.bodySizeLimit;
  return {
    extends: [PostGraphileAmberPreset, makeV4ErrorOutputPreset(options)],
    plugins: [
      PgV4InflectionPlugin,
      PgV4SmartTagsPlugin,
      PgV4BehaviorPlugin,
      options.simpleSubscriptions ? PgV4SimpleSubscriptionsPlugin : null,
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
            pgJwtTypes: [options.jwtPgTypeIdentifier],
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
      watch: options.watchPg,
      websockets: options.subscriptions,
      allowedRequestContentTypes: [
        ...DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES,
        "application/x-www-form-urlencoded",
      ],
      ...(bodySizeLimit != null
        ? { maxRequestLength: bsl2mrl(bodySizeLimit) }
        : null),
    },
  };
};

export const V4Preset = makeV4Preset();
export default V4Preset;
