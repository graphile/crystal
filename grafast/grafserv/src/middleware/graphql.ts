import { parse as parseGraphQLQueryString } from "node:querystring";

import { LRU } from "@graphile/lru";
import { createHash } from "crypto";
import type { PromiseOrDirect } from "grafast";
import {
  $$extensions,
  execute as grafastExecute,
  hookArgs,
  isAsyncIterable,
  isPromiseLike,
  SafeError,
} from "grafast";
import type {
  DocumentNode,
  ExecutionArgs,
  GraphQLSchema,
} from "grafast/graphql";
import * as graphql from "grafast/graphql";

import { makeAcceptMatcher } from "../accept.js";
import { getGrafservHooks } from "../hooks.js";
import type {
  GrafservBody,
  HandlerResult,
  NormalizedRequestDigest,
  ParsedGraphQLBody,
  RequestContentType,
  ValidatedGraphQLBody,
} from "../interfaces.js";
import { $$normalizedHeaders } from "../interfaces.js";
import type { OptionsFromConfig } from "../options.js";
import { httpError, parseGraphQLJSONBody } from "../utils.js";

const { getOperationAST, GraphQLError, parse, Source, validate } = graphql;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let lastString: string;
let lastHash: string;
const calculateQueryHash = (queryString: string): string => {
  if (queryString !== lastString) {
    lastString = queryString;
    lastHash = createHash("sha1").update(queryString).digest("base64");
  }
  return lastHash;
};

export function makeParseAndValidateFunction(schema: GraphQLSchema) {
  type ParseAndValidateResult =
    | { document: DocumentNode; errors?: undefined }
    | { document?: undefined; errors: readonly graphql.GraphQLError[] };
  const parseAndValidationCache = new LRU<string, ParseAndValidateResult>({
    maxLength: 500,
  });
  let lastParseAndValidateQuery: string;
  let lastParseAndValidateResult: ParseAndValidateResult;
  function parseAndValidate(query: string): ParseAndValidateResult {
    if (lastParseAndValidateQuery === query) {
      return lastParseAndValidateResult;
    }
    const hash = query.length > 500 ? calculateQueryHash(query) : query;

    const cached = parseAndValidationCache.get(hash);
    if (cached !== undefined) {
      lastParseAndValidateQuery = query;
      lastParseAndValidateResult = cached;
      return cached;
    }

    const source = new Source(query, "GraphQL HTTP Request");
    let document;
    try {
      document = parse(source);
    } catch (e) {
      const result = {
        errors: [
          new GraphQLError(
            e.message,
            null,
            undefined,
            undefined,
            undefined,
            e,
            undefined,
          ),
        ],
      };
      parseAndValidationCache.set(hash, result);
      lastParseAndValidateQuery = query;
      lastParseAndValidateResult = result;
      return result;
    }
    const errors = validate(schema, document);
    const result: ParseAndValidateResult = errors.length
      ? { errors }
      : { document };
    parseAndValidationCache.set(hash, result);
    lastParseAndValidateQuery = query;
    lastParseAndValidateResult = result;
    return result;
  }
  return parseAndValidate;
}

function parseGraphQLQueryParams(
  params: Record<string, string | string[] | undefined>,
): ParsedGraphQLBody {
  const id = params.id;
  const documentId = params.documentId;
  const query = params.query;
  const operationName = params.operationName ?? undefined;
  const variablesString = params.variables ?? undefined;
  const variableValues =
    typeof variablesString === "string"
      ? JSON.parse(variablesString)
      : undefined;
  const extensionsString = params.extensions ?? undefined;
  const extensions =
    typeof extensionsString === "string"
      ? JSON.parse(extensionsString)
      : undefined;
  return {
    id,
    documentId,
    query,
    operationName,
    variableValues,
    extensions,
  };
}

/**
 * The default allowed request content types do not include
 * `application/x-www-form-urlencoded` because that is treated specially by
 * browsers (e.g. it can be submitted cross origins without CORS).
 *
 * If you're using CORS then no media type is CSRF safe - it's up to you to
 * manage your CSRF protection.
 */
export const DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES = Object.freeze([
  "application/json",
  "application/graphql",
  // CSRF risk:
  // "application/x-www-form-urlencoded",
  // Not supported, AND CSRF risk:
  // 'multipart/form-data'
]) satisfies readonly RequestContentType[];

function parseGraphQLBody(
  resolvedPreset: GraphileConfig.ResolvedPreset,
  request: NormalizedRequestDigest,
  body: GrafservBody,
): ParsedGraphQLBody {
  const supportedContentTypes =
    resolvedPreset.grafserv?.allowedRequestContentTypes ??
    DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES;
  const contentType = request[$$normalizedHeaders]["content-type"];
  if (!contentType) {
    throw httpError(400, "Could not determine the Content-Type of the request");
  }
  const semi = contentType.indexOf(";");
  const rawContentType =
    semi >= 0 ? contentType.slice(0, semi).trim() : contentType.trim();

  if (!(supportedContentTypes as string[]).includes(rawContentType)) {
    throw httpError(415, `Media type '${rawContentType}' is not allowed`);
  }
  const ct = rawContentType as RequestContentType;

  // FIXME: we should probably at least look at the parameters... e.g. throw if encoding !== utf-8

  switch (ct) {
    case "application/json": {
      switch (body.type) {
        case "buffer": {
          return parseGraphQLJSONBody(JSON.parse(body.buffer.toString("utf8")));
        }
        case "text": {
          return parseGraphQLJSONBody(JSON.parse(body.text));
        }
        case "json": {
          return parseGraphQLJSONBody(body.json);
        }
        default: {
          const never: never = body;
          throw httpError(400, `Do not understand type ${(never as any).type}`);
        }
      }
    }
    case "application/x-www-form-urlencoded": {
      switch (body.type) {
        case "buffer": {
          return parseGraphQLQueryParams(
            parseGraphQLQueryString(body.buffer.toString("utf8")),
          );
        }
        case "text": {
          return parseGraphQLQueryParams(parseGraphQLQueryString(body.text));
        }
        case "json": {
          if (
            body.json == null ||
            typeof body.json !== "object" ||
            Array.isArray(body.json)
          ) {
            throw httpError(400, `Invalid body`);
          }
          return parseGraphQLQueryParams(body.json as Record<string, any>);
        }
        default: {
          const never: never = body;
          throw httpError(400, `Do not understand type ${(never as any).type}`);
        }
      }
    }
    case "application/graphql": {
      // ENHANCE: I have a vague feeling that people that do this pass variables via the query string?
      switch (body.type) {
        case "text": {
          return {
            id: undefined,
            documentId: undefined,
            query: body.text,
            operationName: undefined,
            variableValues: undefined,
            extensions: undefined,
          };
        }
        case "buffer": {
          return {
            id: undefined,
            documentId: undefined,
            query: body.buffer.toString("utf8"),
            operationName: undefined,
            variableValues: undefined,
            extensions: undefined,
          };
        }
        case "json": {
          // ERRORS: non-standard; perhaps raise a warning?
          return parseGraphQLJSONBody(body.json);
        }
        default: {
          const never: never = body;
          throw httpError(400, `Do not understand type ${(never as any).type}`);
        }
      }
    }
    default: {
      const never: never = ct;
      throw httpError(415, `Media type '${never}' is not understood`);
    }
  }
}

export const APPLICATION_JSON = "application/json;charset=utf-8";
export const APPLICATION_GRAPHQL_RESPONSE_JSON =
  "application/graphql-response+json;charset=utf-8";
export const TEXT_HTML = "text/html;charset=utf-8";

/** https://graphql.github.io/graphql-over-http/draft/#sec-Legacy-Watershed */
const isAfterWatershed = Date.now() >= +new Date(2025, 0, 1);
const GRAPHQL_TYPES = isAfterWatershed
  ? [APPLICATION_GRAPHQL_RESPONSE_JSON, APPLICATION_JSON]
  : [APPLICATION_JSON, APPLICATION_GRAPHQL_RESPONSE_JSON];

const graphqlAcceptMatcher = makeAcceptMatcher([...GRAPHQL_TYPES]);

const graphqlOrHTMLAcceptMatcher = makeAcceptMatcher([
  ...GRAPHQL_TYPES,
  // Must be lowest priority, otherwise GraphiQL may override GraphQL in some
  // situations
  TEXT_HTML,
]);

export function validateGraphQLBody(
  parsed: ParsedGraphQLBody,
): ValidatedGraphQLBody {
  const { query, operationName, variableValues, extensions } = parsed;

  if (typeof query !== "string") {
    throw httpError(400, "query must be a string");
  }
  if (operationName != null && typeof operationName !== "string") {
    throw httpError(400, "operationName, if given, must be a string");
  }
  if (
    variableValues != null &&
    (typeof variableValues !== "object" || Array.isArray(variableValues))
  ) {
    throw httpError(400, "Invalid variables; expected JSON-encoded object");
  }
  if (
    extensions != null &&
    (typeof extensions !== "object" || Array.isArray(extensions))
  ) {
    throw httpError(400, "Invalid extensions; expected JSON-encoded object");
  }
  return parsed as ValidatedGraphQLBody;
}

export const makeGraphQLHandler = (
  resolvedPreset: GraphileConfig.ResolvedPreset,
  dynamicOptions: OptionsFromConfig,
  schemaOrPromise: PromiseOrDirect<GraphQLSchema> | null,
) => {
  if (schemaOrPromise == null) {
    const err = Promise.reject(
      new GraphQLError(
        "The schema is currently unavailable",
        null,
        null,
        null,
        null,
        null,
        {
          statusCode: 503,
        },
      ),
    );
    return () => err;
  }

  let latestSchema: GraphQLSchema;
  let latestParseAndValidate: ReturnType<typeof makeParseAndValidateFunction>;
  let wait: PromiseLike<void> | null;

  if (isPromiseLike(schemaOrPromise)) {
    wait = schemaOrPromise.then((_schema) => {
      if (_schema == null) {
        throw new GraphQLError(
          "The schema is current unavailable.",
          null,
          null,
          null,
          null,
          null,
          {
            statusCode: 503,
          },
        );
      }
      latestSchema = _schema;
      latestParseAndValidate = makeParseAndValidateFunction(latestSchema);
      wait = null;
    });
  } else {
    latestSchema = schemaOrPromise;
    latestParseAndValidate = makeParseAndValidateFunction(latestSchema);
  }

  const outputDataAsString = dynamicOptions.outputDataAsString;
  const { maskIterator, maskPayload, maskError } = dynamicOptions;

  const hooks = getGrafservHooks(resolvedPreset);

  return async (
    request: NormalizedRequestDigest,
    graphiqlHandler?: (
      request: NormalizedRequestDigest,
    ) => Promise<HandlerResult | null>,
  ): Promise<HandlerResult | null> => {
    const accept = request[$$normalizedHeaders].accept;
    // Do they want HTML, or do they want GraphQL?
    const chosenContentType =
      request.method === "GET" &&
      dynamicOptions.graphiqlOnGraphQLGET &&
      graphiqlHandler
        ? graphqlOrHTMLAcceptMatcher(accept)
        : graphqlAcceptMatcher(accept);

    if (chosenContentType === TEXT_HTML) {
      // They want HTML -> Ruru
      return graphiqlHandler!(request);
    } else if (
      chosenContentType === APPLICATION_JSON ||
      chosenContentType === APPLICATION_GRAPHQL_RESPONSE_JSON
    ) {
      // They want GraphQL
      if (
        request.method === "POST" ||
        (dynamicOptions.graphqlOverGET && request.method === "GET")
      ) {
        /* continue */
      } else {
        return {
          type: "graphql",
          request,
          dynamicOptions,
          statusCode: 405,
          contentType: "application/json",
          payload: {
            errors: [new GraphQLError("Method not supported, please use POST")],
          },
        };
      }
    } else {
      // > Respond with a 406 Not Acceptable status code and stop processing the request.
      // https://graphql.github.io/graphql-over-http/draft/#sel-DANHELDAACNA4rR

      return {
        type: "graphql",
        request,
        dynamicOptions,
        statusCode: 406,
        contentType: "application/json",
        payload: {
          errors: [
            new GraphQLError(
              "Could not find a supported media type; consider adding 'application/json' or 'application/graphql-response+json' to your Accept header.",
            ),
          ],
        },
      };
    }

    // If we get here, we're handling a GraphQL request
    const isLegacy = chosenContentType === APPLICATION_JSON;

    if (wait !== null) {
      await Promise.race([wait, sleep(dynamicOptions.schemaWaitTime)]);
      if (!latestSchema) {
        // Handle missing schema
        throw httpError(502, `Schema isn't ready`);
      }
    }
    // Get a reference to the latest versions to use for this entire operation
    const schema = latestSchema;
    const parseAndValidate = latestParseAndValidate;

    let body: ValidatedGraphQLBody;
    try {
      // Read the body
      const parsedBody =
        request.method === "POST"
          ? parseGraphQLBody(resolvedPreset, request, await request.getBody())
          : parseGraphQLQueryParams(await request.getQueryParams());

      // Apply our hooks (if any) to the body (they will mutate the body in place)
      const hookResult =
        hooks.callbacks.processGraphQLRequestBody != null
          ? hooks.process("processGraphQLRequestBody", {
              body: parsedBody,
              request,
            })
          : undefined;
      if (hookResult != null) {
        await hookResult;
      }

      // Validate that the body is of the right shape
      body = validateGraphQLBody(parsedBody);
    } catch (e) {
      if (e instanceof SafeError) {
        throw e;
      } else if (
        typeof e.statusCode === "number" &&
        e.statusCode >= 400 &&
        e.statusCode < 600
      ) {
        throw e;
      } else {
        // ENHANCE: should maybe handle more specific issues here. See examples:
        // https://graphql.github.io/graphql-over-http/draft/#sec-application-json.Examples
        throw httpError(
          400,
          `Parsing failed, please check that the data you're sending to the server is correct`,
        );
      }
    }

    const { query, operationName, variableValues } = body;
    const { errors, document } = parseAndValidate(query);

    if (errors !== undefined) {
      return {
        type: "graphql",
        request,
        dynamicOptions,
        statusCode: isLegacy ? 200 : 400,
        contentType: chosenContentType,
        payload: { errors },
      };
    }

    if (request.method !== "POST") {
      // Forbid mutation
      const operation = getOperationAST(document, operationName);
      if (!operation || operation.operation !== "query") {
        const error = new GraphQLError(
          "Only queries may take place over non-POST requests.",
          operation,
        );
        return {
          type: "graphql",
          request,
          dynamicOptions,
          // Note: the GraphQL-over-HTTP spec currently mandates 405, even for legacy clients:
          // https://graphql.github.io/graphql-over-http/draft/#sel-FALJRPCE2BCGoBitR
          statusCode: 405,
          contentType: chosenContentType,
          payload: {
            errors: [error],
          },
        };
      }
    }

    const args: ExecutionArgs = {
      schema,
      document,
      rootValue: null,
      contextValue: Object.create(null),
      variableValues,
      operationName,
    };

    await hookArgs(args, resolvedPreset, {
      ...request.requestContext,
      http: request,
    });

    try {
      const result = await grafastExecute(args, resolvedPreset);
      if (isAsyncIterable(result)) {
        return {
          type: "graphqlIncremental",
          request,
          dynamicOptions,
          statusCode: 200,
          iterator: maskIterator(result),
          outputDataAsString,
        };
      }
      return {
        type: "graphql",
        request,
        dynamicOptions,
        statusCode:
          isLegacy || !result.errors
            ? 200
            : result.data === undefined
            ? 400
            : 200,
        contentType: chosenContentType,
        payload: maskPayload(result),
        outputDataAsString,
      };
    } catch (e) {
      console.error(e);
      return {
        type: "graphql",
        request,
        dynamicOptions,
        // e.g. We should always return 400 on no Content-Type header:
        // https://graphql.github.io/graphql-over-http/draft/#sel-DALLDJAADLCA8tb
        statusCode: e.statusCode ?? (isLegacy ? 200 : 500),
        contentType: chosenContentType,
        payload: {
          errors: [maskError(new GraphQLError(e.message))],
          extensions: (args.rootValue as any)?.[$$extensions],
        },
      };
    }
  };
};
