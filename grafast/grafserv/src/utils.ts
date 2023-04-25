import { execute, hookArgs, stripAnsi, subscribe } from "grafast";
import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
  GraphQLSchema,
} from "graphql";
import { GraphQLError } from "graphql";
import type { ServerOptions } from "graphql-ws";
import type { Extra } from "graphql-ws/lib/use/ws";
import type { Readable } from "node:stream";

import { getGrafservHooks } from "./hooks.js";
import type { GrafservBase } from "./index.js";
import type {
  GrafservBody,
  JSONValue,
  NormalizedRequestDigest,
  ParsedGraphQLBody,
  RequestDigest,
} from "./interfaces.js";
import { $$normalizedHeaders } from "./interfaces.js";
import {
  makeParseAndValidateFunction,
  validateGraphQLBody,
} from "./middleware/graphql.js";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export function handleErrors(
  payload: ExecutionResult | AsyncExecutionResult,
): void {
  if ("errors" in payload && payload.errors) {
    (payload.errors as any[]) = payload.errors.map((e) => {
      const obj =
        e instanceof GraphQLError
          ? e.toJSON()
          : { message: (e as any).message, ...(e as object) };
      return Object.assign(obj, {
        message: stripAnsi(obj.message),
        extensions: {
          ...(e.stack
            ? {
                stack: stripAnsi(e.stack).split("\n"),
              }
            : null),
          ...(e.cause
            ? {
                cause: stripAnsi(String(e.cause)),
              }
            : null),
        },
      });
    });
  }
}

// Designed to be equivalent to `import('node:http').IncomingHttpHeaders` but without the import
type IncomingHttpHeaders = Record<string, string | string[] | undefined>;

export function processHeaders(
  headers: IncomingHttpHeaders,
): Record<string, string> {
  const headerDigest: Record<string, string> = Object.create(null);
  for (const key in headers) {
    const val = headers[key];
    if (val == null) {
      continue;
    }
    if (typeof val === "string") {
      headerDigest[key] = val;
    } else {
      headerDigest[key] = val.join("\n");
    }
  }
  return headerDigest;
}

export function getBodyFromRequest(
  req: Readable /* IncomingMessage */,
  maxLength: number,
): Promise<GrafservBody> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let len = 0;
    const handleData = (chunk: Buffer) => {
      chunks.push(chunk);
      len += chunk.length;
      if (len > maxLength) {
        req.off("end", done);
        req.off("error", reject);
        req.off("data", handleData);
        reject(httpError(413, "Too much data"));
      }
    };
    const done = () => {
      resolve({ type: "buffer", buffer: Buffer.concat(chunks) });
    };
    req.on("end", done);
    req.on("error", reject);
    req.on("data", handleData);
  });
}

export function getBodyFromFrameworkBody(body: unknown): GrafservBody {
  if (typeof body === "string") {
    return {
      type: "text",
      text: body,
    };
  } else if (Buffer.isBuffer(body)) {
    return {
      type: "buffer",
      buffer: body,
    };
  } else if (typeof body === "object" && body != null) {
    return {
      type: "json",
      json: body as JSONValue,
    };
  } else {
    throw new Error(
      `Grafserv Express adaptor doesn't know how to interpret this request body`,
    );
  }
}

export function memo<T>(fn: () => T): () => T {
  let cache: T;
  let called = false;
  return function memoized(this: any) {
    if (called) {
      return cache;
    } else {
      called = true;
      cache = fn.call(this);
      return cache;
    }
  };
}

export function normalizeRequest(
  request: RequestDigest | NormalizedRequestDigest,
): NormalizedRequestDigest {
  if (!request[$$normalizedHeaders]) {
    const r = request as NormalizedRequestDigest;
    const normalized = Object.create(null);
    for (const key in r.headers) {
      normalized[key.toLowerCase()] = r.headers[key];
    }
    r[$$normalizedHeaders] = normalized;
    r.preferJSON = Boolean(r.preferJSON);
    r.getHeader = (key) => normalized[key.toLowerCase()];
    r.getBody = memo(r.getBody);
    r.getQueryParams = memo(r.getQueryParams);

    if (r.method === "HEAD") {
      // Pretend that 'HEAD' requests are actually 'GET' requests; Node will
      // take care of stripping the response body for us.
      r.method = "GET";
    }
  }
  return request as NormalizedRequestDigest;
}

export function httpError(
  statusCode: number,
  message: string,
): Error & { statusCode: number } {
  return Object.assign(new Error(message), { statusCode, safeMessage: true });
}

export function makeGraphQLWSConfig(instance: GrafservBase): ServerOptions {
  const {
    resolvedPreset,
    dynamicOptions: { maskExecutionResult },
  } = instance;

  const hooks = getGrafservHooks(resolvedPreset);

  let latestSchema: GraphQLSchema;
  let latestSchemaPromise: PromiseLike<GraphQLSchema> | GraphQLSchema;
  let latestParseAndValidate: ReturnType<typeof makeParseAndValidateFunction>;

  return {
    async onSubscribe(ctx, message) {
      // Get up to date schema, in case we're in watch mode
      const schemaPromise = instance.getSchema();
      if (schemaPromise !== latestSchemaPromise) {
        const result = await Promise.race([
          schemaPromise,
          sleep(instance.dynamicOptions.schemaWaitTime),
        ]);
        if (result) {
          latestSchema = result;
          latestParseAndValidate = makeParseAndValidateFunction(latestSchema);
        } else {
          // Handle missing schema
          throw new Error(`Schema isn't ready`);
        }
      }
      const schema = latestSchema;
      const parseAndValidate = latestParseAndValidate;

      const parsedBody = { ...message.payload } as ParsedGraphQLBody;
      await hooks.process("processBody", {
        body: parsedBody,
        graphqlWsContext: ctx,
      });

      const { query, operationName, variableValues } =
        validateGraphQLBody(parsedBody);
      const { errors, document } = parseAndValidate(query);
      if (errors) {
        return errors;
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
        ws: {
          request: (ctx.extra as Extra).request,
          socket: (ctx.extra as Extra).socket,
          connectionParams: ctx.connectionParams,
        },
      });

      return args;
    },
    async execute(args: ExecutionArgs) {
      return maskExecutionResult(await execute(args, resolvedPreset));
    },
    async subscribe(args: ExecutionArgs) {
      return maskExecutionResult(await subscribe(args, resolvedPreset));
    },
  };
}
