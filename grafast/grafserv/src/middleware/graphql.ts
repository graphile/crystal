import { LRU } from "@graphile/lru";
import { createHash } from "crypto";
import type { PromiseOrDirect } from "grafast";
import {
  $$extensions,
  execute as grafastExecute,
  hookArgs,
  isAsyncIterable,
  isPromiseLike,
} from "grafast";
import type { DocumentNode, ExecutionArgs, GraphQLSchema } from "graphql";
import { GraphQLError, parse, Source, validate } from "graphql";

import {
  GrafservBody,
  HandlerResult,
  JSONValue,
  RequestDigest,
} from "../interfaces.js";
import type { OptionsFromConfig } from "../options.js";

let lastString: string;
let lastHash: string;
const calculateQueryHash = (queryString: string): string => {
  if (queryString !== lastString) {
    lastString = queryString;
    lastHash = createHash("sha1").update(queryString).digest("base64");
  }
  return lastHash;
};

function makeParseAndValidateFunction(schema: GraphQLSchema) {
  type ParseAndValidateResult =
    | { document: DocumentNode; errors?: undefined }
    | { document?: undefined; errors: readonly GraphQLError[] };
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
    if (cached) {
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

function processBody(body: GrafservBody): JSONValue | null {
  switch (body.type) {
    case "buffer": {
      return JSON.parse(body.buffer.toString("utf8"));
    }
    case "json": {
      return body.json;
    }
    default: {
      const never: never = body;
      throw new Error(`Do not understand type ${(never as any).type}`);
    }
  }
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

  let schema: GraphQLSchema;
  let parseAndValidate: ReturnType<typeof makeParseAndValidateFunction>;
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
      schema = _schema;
      parseAndValidate = makeParseAndValidateFunction(schema);
      wait = null;
    });
  } else {
    schema = schemaOrPromise;
    parseAndValidate = makeParseAndValidateFunction(schema);
  }

  const outputDataAsString = dynamicOptions.outputDataAsString;

  return async (request: RequestDigest): Promise<HandlerResult> => {
    if (wait) {
      await wait;
    }
    // FIXME: if method === POST...
    const bodyRaw = await request.getBody(dynamicOptions);
    // FIXME: this parsing is unsafe (it doesn't even check the
    // content-type!) - replace it with V4's behaviour
    const body = processBody(bodyRaw);
    // Parse the body
    if (typeof body !== "object" || body == null) {
      throw new Error("Invalid body in request");
    }
    const {
      query,
      variables: variableValues,
      operationName,
    } = body as Record<string, any>;
    if (typeof query !== "string") {
      throw new Error("Invalid query");
    }
    if (typeof operationName !== "string" && operationName != null) {
      throw new Error("Invalid operationName");
    }
    if (variableValues != null && typeof variableValues !== "object") {
      throw new Error("Invalid variables");
    }

    const { errors, document } = parseAndValidate(query);

    if (errors) {
      return {
        type: "graphql",
        request,
        dynamicOptions,
        statusCode: 200,
        payload: { errors },
      };
    }

    const args: ExecutionArgs = {
      schema,
      document,
      rootValue: null,
      contextValue: Object.create(null),
      variableValues,
      operationName,
    };

    await hookArgs(
      args,
      {
        request,
      },
      resolvedPreset,
    );

    try {
      const result = await grafastExecute(args, resolvedPreset);
      if (isAsyncIterable(result)) {
        return {
          type: "graphqlIncremental",
          request,
          dynamicOptions,
          statusCode: 200,
          iterator: result,
          outputDataAsString,
        };
      }
      return {
        type: "graphql",
        request,
        dynamicOptions,
        statusCode: 200,
        payload: result,
        outputDataAsString,
      };
    } catch (e) {
      console.error(e);
      return {
        type: "graphql",
        request,
        dynamicOptions,
        statusCode: 500,
        payload: {
          errors: [new GraphQLError(e.message)],
          extensions: (args.rootValue as any)?.[$$extensions],
        },
      };
    }
  };
};
