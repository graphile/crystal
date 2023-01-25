import { stripAnsi } from "grafast";
import { AsyncExecutionResult, ExecutionResult, GraphQLError } from "graphql";

export function handleErrors(
  payload: ExecutionResult | AsyncExecutionResult,
): void {
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
}
