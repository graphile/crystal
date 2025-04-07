import LRU from "@graphile/lru";
import type {
  AsyncExecutionResult,
  DocumentNode,
  ExecutionResult,
  GraphQLSchema,
} from "graphql";
import * as graphql from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";

import { SafeError } from "./error.js";
import { execute } from "./execute.js";
import { hookArgs } from "./index.js";
import type {
  GrafastArgs,
  GrafastExecutionArgs,
  ParseAndValidateEvent,
  ValidateSchemaEvent,
} from "./interfaces.js";
import { $$queryCache } from "./interfaces.js";
import { getGrafastMiddleware } from "./middleware.js";
import { isPromiseLike } from "./utils.js";

const { GraphQLError, parse, Source, validate, validateSchema } = graphql;

/** Rough average size per query */
const CACHE_MULTIPLIER = 100000;
const MEGABYTE = 1024 * 1024;

const queryCacheMaxSizeInBytes = 50 * MEGABYTE;
const defaultQueryCacheMaxSize = Math.max(
  2,
  Math.ceil(queryCacheMaxSizeInBytes / CACHE_MULTIPLIER),
);

// If we can use crypto to create a hash, great. Otherwise just use the string.
let calculateQueryHash: (queryString: string) => string;
try {
  let lastString: string;
  let lastHash: string;
  const createHash = require("crypto").createHash;
  if (typeof createHash !== "function") {
    throw new Error("Failed to load createHash");
  }
  calculateQueryHash = (queryString: string): string => {
    if (queryString !== lastString) {
      lastString = queryString;
      lastHash = createHash("sha1").update(queryString).digest("base64");
    }
    return lastHash;
  };
} catch {
  calculateQueryHash = (str) => str;
}

const parseAndValidate = (
  gqlSchema: GraphQLSchema,
  stringOrSource: string | graphql.Source,
): DocumentNode | ReadonlyArray<graphql.GraphQLError> => {
  let queryCache = gqlSchema.extensions.grafast?.[$$queryCache];
  if (!queryCache) {
    const cacheSize =
      gqlSchema.extensions.grafast?.queryCacheMaxLength ??
      defaultQueryCacheMaxSize;
    queryCache = new LRU<
      string,
      DocumentNode | ReadonlyArray<graphql.GraphQLError>
    >({ maxLength: cacheSize });
    if (!gqlSchema.extensions.grafast) {
      (gqlSchema.extensions as any).grafast = Object.create(null);
    }
    gqlSchema.extensions.grafast![$$queryCache] = queryCache;
  }

  // Only cache queries that are less than 100kB, we don't want DOS attacks
  // attempting to exhaust our memory.

  const hash = calculateQueryHash(
    typeof stringOrSource === "string" ? stringOrSource : stringOrSource.body,
  );
  const result = queryCache.get(hash);
  if (result !== undefined) {
    return result;
  } else {
    const source =
      typeof stringOrSource === "string"
        ? new Source(stringOrSource, "GraphQL Http Request")
        : stringOrSource;
    let queryDocumentAst: DocumentNode | void;

    // Catch an errors while parsing so that we can set the `statusCode` to
    // 400. Otherwise we don’t need to parse this way.
    try {
      queryDocumentAst = parse(source);
      // Validate our GraphQL query using given rules.
      const validationErrors = validate(gqlSchema, queryDocumentAst);
      const cacheResult =
        validationErrors.length > 0 ? validationErrors : queryDocumentAst;
      queryCache.set(hash, cacheResult);
      return cacheResult;
    } catch (error) {
      const cacheResult = [
        error instanceof GraphQLError
          ? error
          : new GraphQLError(
              "Validation error occurred",
              undefined,
              undefined,
              undefined,
              undefined,
              error,
            ),
      ];
      queryCache.set(hash, cacheResult);
      return cacheResult;
    }
  }
};

/**
 * A replacement for GraphQL.js' `graphql` method that calls Grafast's
 * execute instead
 */
export function grafast(
  args: GrafastArgs,
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, undefined>
>;
/**
 * @deprecated Second and third parameters should be passed as part of args,
 * specifically `resolvedPreset` and `requestContext`.
 */
export function grafast(
  args: GrafastArgs,
  legacyResolvedPreset?: GraphileConfig.ResolvedPreset | undefined,
  legacyCtx?: Partial<Grafast.RequestContext> | undefined,
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, undefined>
>;
export function grafast(
  args: GrafastArgs,
  legacyResolvedPreset?: GraphileConfig.ResolvedPreset,
  legacyCtx?: Partial<Grafast.RequestContext>,
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, undefined>
> {
  // Convert legacy args to properties on `args`:
  if (legacyResolvedPreset !== undefined) {
    args.resolvedPreset = args.resolvedPreset ?? legacyResolvedPreset;
  }
  if (legacyCtx !== undefined) {
    args.requestContext = args.requestContext ?? legacyCtx;
  }

  const {
    schema,
    source,
    rootValue,
    contextValue,
    variableValues,
    operationName,
    fieldResolver,
    typeResolver,
    resolvedPreset,
    requestContext,
    middleware: rawMiddleware,
  } = args;
  const middleware =
    rawMiddleware !== undefined
      ? rawMiddleware
      : resolvedPreset != null
        ? getGrafastMiddleware(resolvedPreset)
        : null;

  // Validate Schema
  const schemaValidationErrors =
    middleware != null && resolvedPreset != null
      ? middleware.runSync(
          "validateSchema",
          { schema, resolvedPreset },
          validateSchemaWithEvent,
        )
      : validateSchema(schema);
  if (schemaValidationErrors.length > 0) {
    return { errors: schemaValidationErrors };
  }

  // Cached parse and validate
  const documentOrErrors =
    middleware != null && resolvedPreset != null
      ? middleware.runSync(
          "parseAndValidate",
          { resolvedPreset, schema, source },
          parseAndValidateWithEvent,
        )
      : parseAndValidate(schema, source);
  if (Array.isArray(documentOrErrors)) {
    return { errors: documentOrErrors };
  }
  const document = documentOrErrors as DocumentNode;

  const executionArgs: GrafastExecutionArgs = {
    schema,
    document,
    rootValue,
    contextValue,
    variableValues,
    operationName,
    fieldResolver,
    typeResolver,
    middleware,
    resolvedPreset,
    requestContext,
  };

  if (resolvedPreset && requestContext) {
    const argsOrPromise = hookArgs(executionArgs);
    if (isPromiseLike(argsOrPromise)) {
      return Promise.resolve(argsOrPromise).then(execute);
    } else {
      return execute(argsOrPromise);
    }
  } else {
    return execute(executionArgs);
  }
}

export function grafastSync(
  args: GrafastArgs,
  legacyResolvedPreset?: GraphileConfig.ResolvedPreset,
  legacyRequestContext?: Partial<Grafast.RequestContext>,
): ExecutionResult {
  const result = grafast(args, legacyResolvedPreset, legacyRequestContext);
  if (isPromiseLike(result)) {
    throw new SafeError("Grafast execution failed to complete synchronously.");
  }
  return result as ExecutionResult;
}

function validateSchemaWithEvent(event: ValidateSchemaEvent) {
  return validateSchema(event.schema);
}

function parseAndValidateWithEvent(event: ParseAndValidateEvent) {
  return parseAndValidate(event.schema, event.source);
}
