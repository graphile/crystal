import "graphile-config";

import type { execute, PromiseOrDirect, SafeError, subscribe } from "grafast";
import type {
  AsyncExecutionResult,
  ExecutionResult,
  GraphQLSchema,
  ValidationRule,
} from "grafast/graphql";
import type { Context, SubscribeMessage } from "graphql-ws";
import type { RuruHTMLParts } from "ruru/server";

import type { GrafservBase } from ".";
import type { makeParseAndValidateFunction } from "./middleware/graphql";
import type { OptionsFromConfig } from "./options";

export type ContextCallback = (
  requestContext: Grafast.RequestContext,
) => Grafast.Context;

export interface GrafservConfig {
  schema: GraphQLSchema | PromiseLike<GraphQLSchema>;
  preset?: GraphileConfig.Preset;
}

export type RequestContentType =
  | "application/json"
  | "application/graphql"
  | "application/x-www-form-urlencoded";

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
export interface InitEvent {
  resolvedPreset: GraphileConfig.ResolvedPreset;
  getExecutionConfig: (
    this: GrafservBase,
    ctx: Partial<Grafast.RequestContext>,
  ) => PromiseOrDirect<ExecutionConfig>;
  validationRules: ValidationRule[];
}
export interface ProcessGraphQLRequestBodyEvent {
  resolvedPreset: GraphileConfig.ResolvedPreset;
  body: ParsedGraphQLBody;
  request?: NormalizedRequestDigest;
  graphqlWsContext?: Context;
}
export interface ProcessRequestEvent {
  resolvedPreset: GraphileConfig.ResolvedPreset;
  requestDigest: RequestDigest;
  instance: GrafservBase;
}

export interface RuruHTMLPartsEvent {
  resolvedPreset: GraphileConfig.ResolvedPreset;
  htmlParts: RuruHTMLParts;
  request: NormalizedRequestDigest;
}

export interface OnSubscribeEvent {
  resolvedPreset: GraphileConfig.ResolvedPreset;
  ctx: Context<Record<string, unknown> | undefined, unknown>;
  message: SubscribeMessage;
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
  /** True if HTTPS was used, false otherwise */
  isSecure: boolean;
  /** The path segment of the URL, not including the query parameters */
  path: string;
  headers: Record<string, string>;
  getQueryParams: () => PromiseOrDirect<Record<string, string | string[]>>;
  getBody(): PromiseOrDirect<GrafservBody>;
  requestContext: Partial<Grafast.RequestContext>;
  /**
   * If your server would prefer to receive the JSON objects in memory rather
   * than having the response written directly out as a string/buffer, set this
   * true. It does not guarantee that you'll receive JSON, but it does state
   * your preference.
   */
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
  error: Error | SafeError;
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
  // TYPES: should this be `ExecutionResult | AsyncExecutionResult` instead?
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

export type DynamicOptions = OptionsFromConfig & InitEvent;

export interface ExecutionConfig {
  schema: GraphQLSchema;
  parseAndValidate: ReturnType<typeof makeParseAndValidateFunction>;
  resolvedPreset: GraphileConfig.ResolvedPreset;
  execute: typeof execute;
  subscribe: typeof subscribe;
  contextValue: Record<string, any>;
}
