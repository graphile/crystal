import type { Readable } from "node:stream";

import type { execute, GrafastExecutionArgs, subscribe } from "grafast";
import { hookArgs, SafeError, stripAnsi } from "grafast";
import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
} from "grafast/graphql";
import * as graphql from "grafast/graphql";
import type { ServerOptions, SubscribePayload } from "graphql-ws";
import type { Extra } from "graphql-ws/lib/use/ws";

import type { GrafservBase } from "./index.js";
import type {
  GrafservBody,
  JSONValue,
  NormalizedRequestDigest,
  ParsedGraphQLBody,
  RequestDigest,
} from "./interfaces.js";
import { $$normalizedHeaders } from "./interfaces.js";
import { validateGraphQLBody } from "./middleware/graphql.js";

const { GraphQLError } = graphql;

export const sleep = (ms: number) => {
  let _timeout: NodeJS.Timeout;
  return {
    promise: new Promise<void>(
      (resolve) => void (_timeout = setTimeout(resolve, ms)),
    ),
    release() {
      clearTimeout(_timeout);
    },
  };
};

// TODO: remove this ANSI-removal hack!
export function handleErrors(
  payload: ExecutionResult | AsyncExecutionResult,
): void {
  if (payload.errors !== undefined) {
    (payload.errors as any[]) = payload.errors.map((e) => {
      const obj =
        e instanceof GraphQLError
          ? e.toJSON()
          : { message: (e as any).message, ...(e as object) };
      return {
        ...obj,
        message: stripAnsi(obj.message),
        ...(e instanceof GraphQLError
          ? {
              extensions: {
                ...e.extensions,
                ...(typeof e.extensions.stack === "string"
                  ? { stack: stripAnsi(e.extensions.stack) }
                  : null),
                ...(typeof e.extensions.cause === "string"
                  ? { cause: stripAnsi(e.extensions.cause) }
                  : null),
              },
            }
          : null),
      };
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

/**
 * Using this is a hack, it sniffs the data and tries to determine the type.
 * Really you should ask your framework of choice what type of data it has given
 * you.
 */
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
      `Grafserv adaptor doesn't know how to interpret this request body`,
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

export function httpError(statusCode: number, message: string): SafeError {
  return new SafeError(message, { statusCode });
}

type ExtendedExecutionArgs = GrafastExecutionArgs & {
  execute: typeof execute;
  subscribe: typeof subscribe;
};

export function makeGraphQLWSConfig(instance: GrafservBase): ServerOptions {
  return {
    async onSubscribe(ctx, message) {
      try {
        const grafastCtx: Partial<Grafast.RequestContext> = {
          ws: {
            request: (ctx.extra as Extra).request,
            socket: (ctx.extra as Extra).socket,
            connectionParams: ctx.connectionParams,
          },
        };
        const {
          schema,
          parseAndValidate,
          resolvedPreset,
          execute,
          subscribe,
          contextValue,
        } = await instance.getExecutionConfig(grafastCtx);

        const parsedBody = parseGraphQLJSONBody(message.payload);
        await instance.hooks.process("processGraphQLRequestBody", {
          body: parsedBody,
          graphqlWsContext: ctx,
        });

        const { query, operationName, variableValues } =
          validateGraphQLBody(parsedBody);
        const { errors, document } = parseAndValidate(query);
        if (errors !== undefined) {
          return errors;
        }
        const args: ExtendedExecutionArgs = {
          execute,
          subscribe,
          schema,
          document,
          rootValue: null,
          contextValue,
          variableValues,
          operationName,
          resolvedPreset,
        };

        await hookArgs(args, resolvedPreset, grafastCtx);

        return args;
      } catch (e) {
        return [
          new GraphQLError(
            e.message,
            null,
            undefined,
            undefined,
            undefined,
            e,
            undefined,
          ),
        ];
      }
    },
    // TODO: validate that this actually does mask every error
    onError(_ctx, _message, errors) {
      return errors.map(instance.dynamicOptions.maskError);
    },
    async execute(args: ExecutionArgs) {
      const eargs = args as ExtendedExecutionArgs;
      return eargs.execute(eargs);
    },
    async subscribe(args: ExecutionArgs) {
      const eargs = args as ExtendedExecutionArgs;
      return eargs.subscribe(eargs);
    },
  };
}

export function parseGraphQLJSONBody(
  params: JSONValue | (SubscribePayload & { id?: string; documentId?: string }),
): ParsedGraphQLBody {
  if (!params) {
    throw httpError(400, "No body");
  }
  if (typeof params !== "object" || Array.isArray(params)) {
    throw httpError(400, "Invalid body; expected object");
  }
  const id = params.id;
  const documentId = params.documentId;
  const query = params.query;
  const operationName = params.operationName ?? undefined;
  const variableValues = params.variables ?? undefined;
  const extensions = params.extensions ?? undefined;
  return {
    id,
    documentId,
    query,
    operationName,
    variableValues,
    extensions,
  };
}

export async function concatBufferIterator(
  bufferIterator: AsyncGenerator<Buffer>,
) {
  const buffers = [];
  for await (const buffer of bufferIterator) {
    buffers.push(buffer);
  }
  return Buffer.concat(buffers);
}
