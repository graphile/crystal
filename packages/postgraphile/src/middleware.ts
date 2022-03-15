import LRU from "@graphile/lru";
import { createHash } from "crypto";
import type { CrystalPrepareOptions } from "graphile-crystal";
import {
  $$bypassGraphQL,
  $$data,
  $$setPlanGraph,
  bypassGraphQLExecute,
  crystalPrepare,
  crystalPrint,
  isAsyncIterable,
  stripAnsi,
} from "graphile-crystal";
import type {
  DocumentNode,
  ExecutionArgs,
  ExecutionResult,
  GraphQLSchema,
} from "graphql";
import { execute, GraphQLError, parse, Source, validate } from "graphql";
import type { IncomingMessage, ServerResponse } from "http";

import type { ContextCallback, SchemaResult } from "./interfaces.js";

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

    const cached = parseAndValidationCache.get(query);
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
      parseAndValidationCache.set(query, result);
      lastParseAndValidateQuery = query;
      lastParseAndValidateResult = result;
      return result;
    }
    const errors = validate(schema, document);
    const result: ParseAndValidateResult = errors.length
      ? { errors }
      : { document };
    parseAndValidationCache.set(query, result);
    lastParseAndValidateQuery = query;
    lastParseAndValidateResult = result;
    return result;
  }
  return parseAndValidate;
}

function getBodyFromRequest(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    req.setEncoding("utf8");
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      resolve(data);
    });
    req.on("error", reject);
  });
}

export function postgraphile(schemaResult: SchemaResult) {
  const { schema, config, contextCallback } = schemaResult;

  const parseAndValidate = makeParseAndValidateFunction(schema);

  const prepareOptions: CrystalPrepareOptions = {
    experimentalGraphQLBypass: true,
  };

  const sendResult = (
    res: ServerResponse,
    result: ExecutionResult,
    statusCode = 200,
  ) => {
    if ("errors" in result && result.errors) {
      (result.errors as any[]) = result.errors.map((e) => {
        const obj =
          e instanceof GraphQLError
            ? e.toJSON()
            : { message: (e as any).message, ...(e as object) };
        return Object.assign(obj, {
          message: stripAnsi(obj.message),
          extensions: { stack: stripAnsi(e.stack ?? "").split("\n") },
        });
      });
    }
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  };

  return (req: IncomingMessage, res: ServerResponse, next: any): void => {
    if (req.url !== "/graphql" || req.method !== "POST") {
      if (next) {
        return next();
      } else {
        res.writeHead(400, { "Content-Type": "text/plain; charset=UTF-8" });
        res.end(
          `Could not process ${req.method} request to ${req.url} ─ please POST requests to /graphql`,
        );
        return;
      }
    }
    (async () => {
      // Parse the body
      const bodyRaw = await getBodyFromRequest(req);
      const body = JSON.parse(bodyRaw);
      const { query, variables: variableValues, operationName } = body;
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
        sendResult(res, { errors });
        return;
      }
      const contextValue = contextCallback(req);

      const args: ExecutionArgs = {
        schema,
        document,
        rootValue: null,
        contextValue,
        variableValues,
        operationName,
      };

      args.rootValue = await crystalPrepare(args, prepareOptions);

      if ((args.rootValue as any)?.[$$bypassGraphQL]) {
        sendResult(res, { data: args.rootValue as Record<string, any> });
        return;
      }

      const result = await execute(args);
      if (isAsyncIterable(result)) {
        throw new Error("We don't yet support async iterables");
      }
      sendResult(res, result);
    })().catch((e) => {
      console.dir(e);
      sendResult(res, { errors: [e] }, 500);
    });
  };
}
