import type { AsyncExecutionResult, ExecutionResult } from "graphql";

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
