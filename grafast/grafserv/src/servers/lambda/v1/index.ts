import type {
  APIGatewayEvent,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context as LambdaContext,
} from "aws-lambda";

import { GrafservBase } from "../../../core/base.js";
import type {
  GrafservConfig,
  RequestDigest,
  Result,
} from "../../../interfaces.js";
import { processHeaders } from "../../../utils.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Grafast {
    interface RequestContext {
      lambdav1: { event: APIGatewayProxyEvent; context: LambdaContext };
    }
  }
}

/** @experimental */
export class LambdaGrafserv extends GrafservBase {
  protected lambdaRequestToGrafserv(
    event: APIGatewayEvent,
    context: LambdaContext,
  ): RequestDigest {
    const version = event.requestContext.protocol.match(
      /^HTTP\/(?<major>[0-9]+)\.(?<minor>[0-9]+)$/,
    );

    return {
      httpVersionMajor: parseInt(version?.groups?.major ?? "1"),
      httpVersionMinor: parseInt(version?.groups?.minor ?? "0"),
      isSecure: false, // Because we don't trust X-Forwarded-Proto
      method: event.httpMethod,
      path: event.requestContext.path,
      headers: processHeaders(event.multiValueHeaders),
      getQueryParams() {
        return Object.fromEntries(
          Object.entries(event.queryStringParameters ?? {}).filter(
            ([_k, v]) => v !== undefined,
          ),
        ) as Record<string, string>;
      },
      getBody() {
        return {
          type: "text",
          text: event.body ?? "",
        };
      },
      requestContext: {
        lambdav1: { event, context },
      },
      preferJSON: true,
    };
  }

  protected grafservResponseToLambda(response: Result | null) {
    if (response === null) {
      return {
        statusCode: 404,
        body: "¯\\_(ツ)_/¯",
      };
    }

    switch (response.type) {
      case "error": {
        const { statusCode, headers, error } = response;
        return {
          statusCode,
          headers: { ...headers, "Content-Type": "text/plain" },
          body: error.message,
        };
      }

      case "buffer": {
        const { statusCode, headers, buffer } = response;
        return { statusCode, headers, body: buffer.toString("utf8") };
      }

      case "json": {
        const { statusCode, headers, json } = response;
        return { statusCode, headers, body: JSON.stringify(json) };
      }

      default: {
        console.log("Unhandled:");
        console.dir(response);
        return {
          statusCode: 501,
          headers: { "Content-Type": "text/plain" },
          body: "Server hasn't implemented this yet",
        };
      }
    }
  }

  createHandler() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    return async (
      event: APIGatewayEvent,
      context: LambdaContext,
    ): Promise<APIGatewayProxyResult> => {
      return this.grafservResponseToLambda(
        await this.processLambdaRequest(
          event,
          context,
          this.lambdaRequestToGrafserv(event, context),
        ),
      );
    };
  }

  protected processLambdaRequest(
    _event: APIGatewayEvent,
    _context: LambdaContext,
    request: RequestDigest,
  ) {
    return this.processRequest(request);
  }
}

/** @experimental */
export function grafserv(config: GrafservConfig) {
  return new LambdaGrafserv(config);
}
