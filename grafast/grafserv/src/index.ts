import type { PromiseOrDirect } from "grafast";
import type { GraphQLError } from "grafast/graphql";
import type { AsyncHookResultHandler, PluginHook } from "graphile-config";
import type { RuruHTMLParts } from "ruru/server";

import type {
  GrafservPluginContext,
  InitEvent,
  NormalizedRequestDigest,
  ProcessGraphQLRequestBodyEvent,
  ProcessRequestEvent,
  RequestContentType,
  Result,
} from "./interfaces.js";

export {
  convertErrorToErrorResult,
  convertHandlerResultToResult,
  GrafservBase,
} from "./core/base.js";
export type {
  BufferResult,
  BufferStreamResult,
  ErrorResult,
  EventStreamHeandlerResult,
  GrafservBody,
  GrafservBodyBuffer,
  GrafservBodyJSON,
  GrafservBodyText,
  GrafservConfig,
  GraphQLHandlerResult,
  GraphQLIncrementalHandlerResult,
  HandlerResult,
  HTMLHandlerResult,
  JSONObject,
  JSONResult,
  JSONValue,
  NoContentHandlerResult,
  NoContentResult,
  NormalizedRequestDigest,
  ParsedGraphQLBody,
  ProcessGraphQLRequestBodyEvent,
  RequestDigest,
  Result,
  TextHandlerResult,
  ValidatedGraphQLBody,
} from "./interfaces.js";
export { DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES } from "./middleware/graphql.js";
export { defaultMaskError } from "./options.js";
export {
  getBodyFromFrameworkBody,
  getBodyFromRequest,
  handleErrors,
  httpError,
  makeGraphQLWSConfig,
  memo,
  normalizeRequest,
  parseGraphQLJSONBody,
  processHeaders,
} from "./utils.js";

declare global {
  namespace Grafast {
    interface RequestContext {
      http?: NormalizedRequestDigest;
    }
  }

  namespace GraphileConfig {
    interface Preset {
      /**
       * Configuration options for Grafserv
       */
      grafserv?: GrafservOptions;
    }
    interface Plugin {
      grafserv?: {
        hooks?: {
          [key in keyof GrafservHooks]?: PluginHook<
            GrafservHooks[key] extends (...args: infer UArgs) => infer UResult
              ? (info: GrafservPluginContext, ...args: UArgs) => UResult
              : never
          >;
        };
      };
    }
    interface GrafservOptions {
      /** Port number to listen on */
      port?: number;
      /** Host to listen on */
      host?: string;

      /** The path at which GraphQL will be available; usually /graphql */
      graphqlPath?: string;
      /** The path at which the GraphQL event stream would be made available; usually /graphql/stream */
      eventStreamPath?: string;

      /** If true, allow GraphQL over GET requests. This has security ramifications, exercise caution. */
      graphqlOverGET?: boolean;

      graphiql?: boolean;
      /** If true, then we will render GraphiQL on GET requests to the /graphql endpoint */
      graphiqlOnGraphQLGET?: boolean;
      /** The path at which GraphiQL will be available; usually / */
      graphiqlPath?: string;

      /** Set true to enable watch mode */
      watch?: boolean;

      /** The length, in bytes, for the largest request body that grafserv will accept */
      maxRequestLength?: number;

      /** How long (in milliseconds) should we wait for a schema promise to resolve before sending a failure to the client? */
      schemaWaitTime?: number;

      /**
       * Use grafast 'string' optimization - response will be partially stringified
       * already, use `stringifyPayload` before sending to the user
       *
       * @remarks
       *
       * This is a `grafserv` option rather than a `grafast` option because the
       * server is responsible for stringifying the body before sending it to the
       * user, via `stringifyPayload`. If we were to make this a `grafast` option
       * then everything using grafast would be affected by it, and code expecting
       * objects would break.
       */
      outputDataAsString?: boolean;

      /**
       * Temporary hack to allow easy testing with graphql-http.com
       */
      dangerouslyAllowAllCORSRequests?: boolean;

      /**
       * Should we enable a websockets transport if available?
       */
      websockets?: boolean;

      /**
       * If you would like to customize the way in which errors are masked, you may
       * pass your own error masking function here. You can also import
       * `defaultMaskError` from `grafserv`.
       */
      maskError?: (error: GraphQLError) => GraphQLError;

      /**
       * By default `application/json` and `application/graphql` are supported
       * (`DEFAULT_ALLOWED_REQUEST_CONTENT_TYPES`). You may add
       * `application/x-www-form-urlencoded` to the list, but be aware that
       * doing so potentially opens you to CSRF issues even if you're not using
       * CORS since this media type is handled specially by browsers - ensure
       * that you have CSRF protections in place.
       *
       * Note further that if you're using CORS the other media types are not
       * safe, and you should still use CSRF protection.
       */
      allowedRequestContentTypes?: readonly RequestContentType[];

      /**
       * How many documents should we cache the parse and validate result for?
       *
       * @defaultValue `500`
       */
      parseAndValidateCacheSize?: number;
    }

    interface GrafservHooks {
      init(event: InitEvent): PromiseOrDirect<void>;
      processRequest(
        event: ProcessRequestEvent,
      ): PromiseOrDirect<void | AsyncHookResultHandler<Result | null>>;
      processGraphQLRequestBody(
        event: ProcessGraphQLRequestBodyEvent,
      ): PromiseOrDirect<void>;
      ruruHTMLParts(
        parts: RuruHTMLParts,
        extra: {
          request: NormalizedRequestDigest;
        },
      ): PromiseOrDirect<void>;
    }
  }
}
