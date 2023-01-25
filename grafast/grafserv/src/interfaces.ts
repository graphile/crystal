import { PromiseOrDirect } from "grafast";
import "graphile-config";

import type { GraphQLSchema } from "graphql";
import type { IncomingMessage } from "node:http";
import type { Socket } from "node:net";
import type { AsyncExecutionResult, ExecutionResult } from "graphql";

export type ContextCallback = (
  graphqlRequestContext: GraphileConfig.GraphQLRequestContext,
) => object;

// TODO: delete me
export interface ServerParams {
  schema: GraphQLSchema;
  resolvedPreset: GraphileConfig.ResolvedPreset;
}

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

  /** How long should we wait for a schema promise to resolve before sending a failure to the client? */
  schemaWaitTime?: number;
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
      httpRequest?: IncomingMessage;
      socket?: Socket;
    }
    interface Preset {
      server?: ServerOptions;
    }
  }
}

export type SendResult = (result: HandlerResult) => void;
export type SendError = (error: any) => void;

export interface RequestDigest {
  method: "HEAD" | "GET" | "POST" | string;
  path: string;
  headers: Record<string, string>;
  getBody(): PromiseOrDirect<string>;
}

interface IHandlerResult {
  type: string;
  statusCode?: number;
}
export interface HTMLHandlerResult extends IHandlerResult {
  type: "html";
  payload: string;
}
export interface TextHandlerResult extends IHandlerResult {
  type: "text";
  payload: string;
}
export interface GraphQLHandlerResult extends IHandlerResult {
  type: "graphql";
  payload: ExecutionResult;
  asString?: boolean;
}
/** @see {@link https://github.com/glasser/graphql-over-http/blob/dac9638459bb17dd3ade889334fc2fadee9d11e5/rfcs/IncrementalDelivery.md} */
export interface GraphQLIncrementalHandlerResult extends IHandlerResult {
  type: "graphqlIncremental";
  iterator: AsyncGenerator<AsyncExecutionResult, void, undefined>;
  asString?: boolean;
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
