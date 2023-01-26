import "graphile-config";

import type { PromiseOrDirect } from "grafast";
import type {
  AsyncExecutionResult,
  ExecutionResult,
  GraphQLSchema,
} from "graphql";

import type { OptionsFromConfig } from "./options";

export type ContextCallback = (
  graphqlRequestContext: GraphileConfig.GraphQLRequestContext,
) => object;

export interface GrafservConfig {
  schema: GraphQLSchema | PromiseLike<GraphQLSchema>;
  preset?: GraphileConfig.Preset;
}

export interface ServerOptions {
  /** Port number to listen on */
  port?: number;
  /** Host to listen on */
  host?: string;

  /** The path at which GraphQL will be available; usually /graphql */
  graphqlPath?: string;
  /** The path at which the GraphQL event stream would be made available; usually /graphql/stream */
  eventStreamRoute?: string;

  graphiql?: boolean;
  /** If true, then we will render GraphiQL on GET requests to the /graphql endpoint */
  graphiqlOnGraphQLGET?: boolean;
  /** The path at which GraphiQL will be available; usually / */
  graphiqlPath?: string;

  /** Set true to enable watch mode */
  watch?: boolean;

  /** The length, in bytes, for the largest request body that the server will accept */
  maxRequestLength?: number;

  // FIXME: IMPLEMENT THIS!
  /** How long should we wait for a schema promise to resolve before sending a failure to the client? */
  schemaWaitTime?: number;

  /**
   * Use grafast 'string' optimization - response will be partially stringified
   * already, use `stringifyPayload` before sending to the user
   *
   * @remarks
   *
   * This is a `server` option rather than a `grafast` option because the
   * server is responsible for stringifying the body before sending it to the
   * user, via `stringifyPayload`. If we were to make this a `grafast` option
   * then everything using grafast would be affected by it, and code expecting
   * objects would break.
   */
  outputDataAsString?: boolean;
}

declare global {
  namespace GraphileConfig {
    /**
     * Details about the incoming GraphQL request - e.g. if it was sent over an
     * HTTP request, the request itself so headers can be interrogated.
     *
     * It's anticipated this will be expanded via declaration merging, e.g. if
     * your server is Koa then a `koaCtx` might be added.
     */
    interface GraphQLRequestContext {
      // TODO: add things like operationName, operation, etc?
      request?: RequestDigest;
    }
    interface Preset {
      server?: ServerOptions;
    }
  }
}

declare global {
  namespace Grafserv {
    /** Extend this through declaration merging */
    interface RequestDigestFrameworkMeta {}
  }
}

export interface GrafservBodyBuffer {
  type: "buffer";
  buffer: Buffer;
}

export interface GrafservBodyJSON {
  type: "json";
  json: JSONValue;
}

export type GrafservBody = GrafservBodyBuffer | GrafservBodyJSON;

export interface RequestDigest {
  method: "HEAD" | "GET" | "POST" | string;
  httpVersionMajor: number;
  httpVersionMinor: number;
  path: string;
  headers: Record<string, string>;
  getBody(dynamicOptions: OptionsFromConfig): PromiseOrDirect<GrafservBody>;
  frameworkMeta: Grafserv.RequestDigestFrameworkMeta[keyof Grafserv.RequestDigestFrameworkMeta];
  // FIXME: honour this, for Koa/Fastify/etc that may want to process the JSON sans stringification
  preferJSON?: boolean;
}

interface IHandlerResult {
  type: string;
  request: RequestDigest;
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
  payload: ExecutionResult;
  outputDataAsString?: boolean;
}
/** @see {@link https://github.com/glasser/graphql-over-http/blob/dac9638459bb17dd3ade889334fc2fadee9d11e5/rfcs/IncrementalDelivery.md} */
export interface GraphQLIncrementalHandlerResult extends IHandlerResult {
  type: "graphqlIncremental";
  iterator: AsyncGenerator<AsyncExecutionResult, void, undefined>;
  outputDataAsString?: boolean;
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
  | EventStreamHeandlerResult;

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
  error: Error;
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
  | BufferStreamResult;
