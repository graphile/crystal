import type { Deferred } from "dataplanner";
import { defer, isPromiseLike, stripAnsi } from "dataplanner";
import { resolvePresets } from "graphile-config";
import { GraphQLError } from "graphql";
import type { IncomingMessage, RequestListener, ServerResponse } from "http";

import type { SchemaResult } from "../interfaces.js";
import { makeSchema, watchSchema } from "../schema.js";
import { makeGraphiQLHandler } from "./graphiql.js";
import { makeGraphQLHandler } from "./graphql.js";
import type { HandlerResult } from "./interfaces.js";

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

export function postgraphile(preset: GraphileConfig.Preset): RequestListener & {
  release(): Promise<void>;
} {
  const config = resolvePresets([preset]);
  const {
    graphqlPath = "/graphql",
    graphiql = true,
    graphiqlOnGraphQLGET = true,
    graphiqlPath = "/",
  } = config.server ?? {};

  const sendResult = (res: ServerResponse, handlerResult: HandlerResult) => {
    switch (handlerResult.type) {
      case "graphql": {
        const { payload, statusCode = 200 } = handlerResult;

        if ("errors" in payload && payload.errors) {
          (payload.errors as any[]) = payload.errors.map((e) => {
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
        res.end(JSON.stringify(payload));
        break;
      }
      case "text":
      case "html": {
        const { payload, statusCode = 200 } = handlerResult;
        res.writeHead(statusCode, {
          "Content-Type":
            handlerResult.type === "html"
              ? "text/html; charset=utf-8"
              : "text/plain; charset=utf-8",
        });
        res.end(payload);
        break;
      }
      default: {
        const never: never = handlerResult;
        console.error(`Did not understand '${never}' passed to sendResult`);
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Unexpected input to sendResult");
      }
    }
  };

  const makeErrorHandler = (
    req: IncomingMessage,
    res: ServerResponse,
    next: any,
  ) => {
    if (typeof next === "function") {
      return next;
    }

    return (e: Error) => {
      console.error(e);
      sendResult(res, {
        statusCode: 500,
        type: "text",
        payload: "Internal server error",
      });
    };
  };

  type SchemaResultAndHandlers = SchemaResult & {
    graphqlHandler: Awaited<ReturnType<typeof makeGraphQLHandler>>;
    graphiqlHandler: Awaited<ReturnType<typeof makeGraphiQLHandler>>;
  };
  function addHandlers(r: SchemaResult): SchemaResultAndHandlers {
    return {
      ...r,
      graphqlHandler: makeGraphQLHandler(r),
      graphiqlHandler: makeGraphiQLHandler(r),
    };
  }

  let schemaResult:
    | Promise<SchemaResultAndHandlers>
    | Deferred<SchemaResultAndHandlers>
    | SchemaResultAndHandlers;
  let stopWatchingPromise: Promise<() => void> | null = null;
  if (config.server?.watch) {
    schemaResult = defer<SchemaResultAndHandlers>();
    stopWatchingPromise = watchSchema(preset, (error, result) => {
      if (error) {
        console.error("Watch error: ", error);
        return;
      }
      const resultWithHandlers = addHandlers(result!);
      if (
        schemaResult !== null &&
        "resolve" in schemaResult &&
        typeof schemaResult.resolve === "function"
      ) {
        schemaResult.resolve(resultWithHandlers);
      }
      schemaResult = resultWithHandlers;
    });
  } else {
    schemaResult = makeSchema(preset).then(addHandlers);
  }

  const middleware: RequestListener = (req, res, next?: any): void => {
    const handleError = makeErrorHandler(req, res, next);

    // TODO: consider allowing GraphQL queries over 'GET'
    if (req.url === graphqlPath && req.method === "POST") {
      (async () => {
        const bodyRaw = await getBodyFromRequest(req);
        const body = JSON.parse(bodyRaw);
        const sR = isPromiseLike(schemaResult)
          ? await schemaResult
          : schemaResult;
        const contextValue = sR.contextCallback(req);
        const result = await sR.graphqlHandler(contextValue, body);
        sendResult(res, result);
      })().catch((e) => {
        // Special error handling for GraphQL route
        try {
          console.error(
            "An error occurred whilst attempting to handle the GraphQL request:",
          );
          console.dir(e);
          sendResult(res, {
            type: "graphql",
            payload: { errors: [e] },
            statusCode: 500,
          });
        } catch (e2) {
          console.error(
            "An error occurred whilst telling the user than an error occurred:",
            e2,
          );
        }
      });
      return;
    }

    // TODO: handle 'HEAD' requests
    if (
      graphiql &&
      (req.url === graphiqlPath ||
        (graphiqlOnGraphQLGET && req.url === graphqlPath)) &&
      req.method === "GET"
    ) {
      (async () => {
        const sR = isPromiseLike(schemaResult)
          ? await schemaResult
          : schemaResult;
        const result = await sR.graphiqlHandler();
        sendResult(res, result);
      })().catch(handleError);
      return;
    }

    // Not handled
    if (next) {
      return next();
    } else {
      console.log(`Unhandled ${req.method} to ${req.url}`);
      sendResult(res, {
        type: "text",
        payload: `Could not process ${req.method} request to ${req.url} ─ please POST requests to /graphql`,
        statusCode: 404,
      });
      return;
    }
  };

  return Object.assign(middleware, {
    async release() {
      if (stopWatchingPromise) {
        const cb = await stopWatchingPromise;
        cb();
      }
      // TODO: there's almost certainly more things that need releasing?
    },
  });
}
