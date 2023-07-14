import LRU from "@graphile/lru";
import type {
  AsyncExecutionResult,
  DocumentNode,
  ExecutionArgs,
  ExecutionResult,
  GraphQLArgs,
  GraphQLSchema,
} from "graphql";
import * as graphql from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";

import { SafeError } from "./error.js";
import { execute } from "./execute.js";
import { hookArgs } from "./index.js";
import { isPromiseLike } from "./utils.js";

const { GraphQLError, parse, Source, validate, validateSchema } = graphql;

/** Rough average size per query */
const CACHE_MULTIPLIER = 100000;
const MEGABYTE = 1024 * 1024;

const $$queryCache = Symbol("grafastQueryCache");

declare module "graphql" {
  interface GraphQLSchema {
    [$$queryCache]?: LRU<
      string,
      DocumentNode | ReadonlyArray<graphql.GraphQLError>
    >;
  }
}

// TODO: turn this into a setting.
const queryCacheMaxSize = 50 * MEGABYTE;

const cacheSize = Math.max(2, Math.ceil(queryCacheMaxSize / CACHE_MULTIPLIER));

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
  let queryCache = gqlSchema[$$queryCache];
  if (!queryCache) {
    queryCache = new LRU<
      string,
      DocumentNode | ReadonlyArray<graphql.GraphQLError>
    >({ maxLength: cacheSize });
    gqlSchema[$$queryCache] = queryCache;
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
  args: GraphQLArgs,
  resolvedPreset?: GraphileConfig.ResolvedPreset,
  ctx?: Partial<Grafast.RequestContext>,
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, undefined>
> {
  const {
    schema,
    source,
    rootValue,
    contextValue,
    variableValues,
    operationName,
    fieldResolver,
    typeResolver,
  } = args;

  // Validate Schema
  const schemaValidationErrors = validateSchema(schema);
  if (schemaValidationErrors.length > 0) {
    return { errors: schemaValidationErrors };
  }

  // Cached parse and validate
  const documentOrErrors = parseAndValidate(schema, source);
  if (Array.isArray(documentOrErrors)) {
    return { errors: documentOrErrors };
  }
  const document = documentOrErrors as DocumentNode;

  const executionArgs: ExecutionArgs = {
    schema,
    document,
    rootValue,
    contextValue,
    variableValues,
    operationName,
    fieldResolver,
    typeResolver,
  };

  if (resolvedPreset && ctx) {
    const argsOrPromise = hookArgs(executionArgs, resolvedPreset, ctx);
    if (isPromiseLike(argsOrPromise)) {
      return Promise.resolve(argsOrPromise).then((hookedArgs) =>
        execute(hookedArgs, resolvedPreset),
      );
    } else {
      // Execute
      return execute(argsOrPromise, resolvedPreset);
    }
  } else {
    // Execute
    return execute(executionArgs, resolvedPreset);
  }
}

export function grafastSync(
  args: GraphQLArgs,
  resolvedPreset?: GraphileConfig.ResolvedPreset,
  ctx?: Partial<Grafast.RequestContext>,
): ExecutionResult {
  const result = grafast(args, resolvedPreset, ctx);
  if (isPromiseLike(result)) {
    throw new SafeError("Grafast execution failed to complete synchronously.");
  }
  return result as ExecutionResult;
}
