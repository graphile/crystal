import { stripAnsi } from "dataplanner";
import { GraphQLError } from "graphql";
import type { IncomingMessage, ServerResponse } from "http";

import type { SchemaResult } from "../interfaces.js";
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

export function postgraphile(schemaResult: SchemaResult) {
  const { contextCallback } = schemaResult;
  const graphqlHandler = makeGraphQLHandler(schemaResult);
  const graphiqlHandler = makeGraphiQLHandler(schemaResult);
  const {
    graphqlPath = "/graphql",

    graphiql = true,
    graphiqlOnGraphQLGET = true,
    graphiqlPath = "/",
  } = schemaResult.config.server ?? {};

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

  return (req: IncomingMessage, res: ServerResponse, next: any): void => {
    const handleError = makeErrorHandler(req, res, next);

    // TODO: consider allowing GraphQL queries over 'GET'
    if (req.url === graphqlPath && req.method === "POST") {
      (async () => {
        const bodyRaw = await getBodyFromRequest(req);
        const body = JSON.parse(bodyRaw);
        const contextValue = contextCallback(req);
        const result = await graphqlHandler(contextValue, body);
        sendResult(res, result);
      })().catch((e) => {
        // Special error handling for GraphQL route
        sendResult(res, {
          type: "graphql",
          payload: { errors: [e] },
          statusCode: 500,
        });
        console.dir(e);
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
        const result = await graphiqlHandler();
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
}
