import "graphile-config";

import type { PromiseOrDirect } from "grafast";
import type {
  AsyncExecutionResult,
  ExecutionResult,
  GraphQLError,
  GraphQLSchema,
} from "graphql";

import type { OptionsFromConfig } from "./options";
import { PluginHook } from "graphile-config";
import { Context } from "graphql-ws";

export type ContextCallback = (
  requestContext: Grafast.RequestContext,
) => Grafast.Context;

export interface GrafservConfig {
  schema: GraphQLSchema | PromiseLike<GraphQLSchema>;
  preset?: GraphileConfig.Preset;
}

/**
 * Represents the core parameters from the GraphQL request, these may not yet
 * be fully validated to allow for things such as persisted operations to kick
 * in later.
 */
export interface ParsedGraphQLBody {
  id: unknown;
  documentId: unknown;
  query: unknown;
  operationName: unknown;
  variableValues: unknown;
  extensions: unknown;
}

/**
 * The validated GraphQL request parameters, after any transforms (such as
 * persisted operations) are applied; ready to be fed to Grafast.
 */
export interface ValidatedGraphQLBody {
  query: string;
  operationName: string | undefined;
  variableValues: Record<string, any> | undefined;
  extensions: Record<string, any> | undefined;
}

export interface GrafservPluginContext {
  resolvedPreset: GraphileConfig.ResolvedPreset;
}
export interface ProcessBodyEvent {
  body: ParsedGraphQLBody;
  request?: NormalizedRequestDigest;
  graphqlWsContext?: Context;
}
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
    }

    interface GrafservHooks {
      init(event: {}): PromiseOrDirect<void>;
      processBody(event: ProcessBodyEvent): PromiseOrDirect<void>;
    }
  }
}

export interface GrafservBodyBuffer {
  type: "buffer";
  buffer: Buffer;
}

export interface GrafservBodyText {
  type: "text";
  text: string;
}

export interface GrafservBodyJSON {
  type: "json";
  json: JSONValue;
}

export type GrafservBody =
  | GrafservBodyBuffer
  | GrafservBodyText
  | GrafservBodyJSON;

export const $$normalizedHeaders = Symbol("normalizedHeaders");
export interface RequestDigest {
  method: "HEAD" | "GET" | "POST" | string;
  httpVersionMajor: number;
  httpVersionMinor: number;
  isSecure: boolean;
  path: string;
  headers: Record<string, string>;
  getQueryParams: () => PromiseOrDirect<Record<string, string | string[]>>;
  getBody(): PromiseOrDirect<GrafservBody>;
  requestContext: Partial<Grafast.RequestContext>;
  // TODO: honour this, for Koa/Fastify/etc that may want to process the JSON sans stringification
  preferJSON?: boolean;
  [$$normalizedHeaders]?: any;
}

export interface NormalizedRequestDigest extends RequestDigest {
  method: "GET" | "POST" | string;
  preferJSON: boolean;
  /**
   * As 'headers', but with the keys lowercased
   * @internal
   */
  [$$normalizedHeaders]: Record<string, string>;
  getHeader(name: string): string | undefined;
  /** @deprecated use getHeader unless the original case is essential. */
  headers: Record<string, string>;
}

interface IHandlerResult {
  type: string;
  request: NormalizedRequestDigest;
  dynamicOptions: OptionsFromConfig;
  statusCode?: number;
}
export interface HTMLHandlerResult extends IHandlerResult {
  type: "html";
  payload: Buffer;
}
export interface TextHandlerResult extends IHandlerResult {
  type: "text";
  payload: Buffer;
}
export interface GraphQLHandlerResult extends IHandlerResult {
  type: "graphql";
  contentType: string;
  payload: ExecutionResult;
  outputDataAsString?: boolean;
}
/** @see {@link https://github.com/glasser/graphql-over-http/blob/dac9638459bb17dd3ade889334fc2fadee9d11e5/rfcs/IncrementalDelivery.md} */
export interface GraphQLIncrementalHandlerResult extends IHandlerResult {
  type: "graphqlIncremental";
  iterator: AsyncGenerator<AsyncExecutionResult, void, undefined>;
  outputDataAsString?: boolean;
}
export interface NoContentHandlerResult extends IHandlerResult {
  type: "noContent";
}
export interface EventStreamEvent {
  /** The name of the event. Use simple names. Don't put newlines in it! */
  event: string;
  /** The data for this event. We'll automatically split this on newlines for you */
  data?: string;
  id?: string;
  /** integer number of milliseconds indicating how long to wait before reconnecting if connection is lost */
  retry?: number;
}
export interface EventStreamHeandlerResult extends IHandlerResult {
  type: "event-stream";
  payload: AsyncIterable<EventStreamEvent>;
}
export type HandlerResult =
  | HTMLHandlerResult
  | GraphQLHandlerResult
  | GraphQLIncrementalHandlerResult
  | TextHandlerResult
  | EventStreamHeandlerResult
  | NoContentHandlerResult;

export type SchemaChangeEvent = {
  event: "change";
  data: "schema";
};

export type JSONValue =
  | null
  | boolean
  | number
  | string
  | JSONValue[]
  | JSONObject;
export interface JSONObject {
  [key: string]: JSONValue;
}

export interface ErrorResult {
  type: "error";
  statusCode: number;
  headers: Record<string, string>;
  error: Error & { statusCode?: number; safeMessage?: boolean };
}

export interface BufferResult {
  type: "buffer";
  statusCode: number;
  headers: Record<string, string>;
  buffer: Buffer;
}

export interface JSONResult {
  type: "json";
  statusCode: number;
  headers: Record<string, string>;
  // TODO: should this be `ExecutionResult | AsyncExecutionResult` instead?
  json: JSONValue;
}

export interface BufferStreamResult {
  type: "bufferStream";
  statusCode: number;
  headers: Record<string, string>;
  /** If true, setNoDelay, etc */
  lowLatency: boolean;
  bufferIterator: AsyncGenerator<Buffer, void, undefined>;
}

export interface NoContentResult {
  type: "noContent";
  statusCode: 204;
  headers: Record<string, string>;
}

/*
export interface JSONStreamResult {
  type: "jsonStream";
  statusCode: number;
  headers: Record<string, string>;
  /** If true, setNoDelay, etc * /
  lowLatency: boolean;
  jsonIterator: AsyncGenerator<JSONValue, void, undefined>;
}
*/

export type Result =
  | ErrorResult
  | BufferResult
  | JSONResult
  | BufferStreamResult
  | NoContentResult;
