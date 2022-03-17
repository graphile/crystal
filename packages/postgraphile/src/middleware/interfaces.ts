import type { ExecutionResult } from "graphql";

interface IHandlerResult {
  type: string;
  payload: any;
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
}
export type HandlerResult =
  | HTMLHandlerResult
  | GraphQLHandlerResult
  | TextHandlerResult;
