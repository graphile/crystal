import { GraphQLError } from "graphql";
import { buildExecutionContext } from "graphql/execution/execute.js";

import { $$extensions, type GrafastExecutionArgs } from ".";
import { type OperationPlan } from "./engine/OperationPlan";
import { establishOperationPlan } from "./establishOperationPlan.ts";
import type {
  ErrorBehavior,
  EstablishOperationPlanEvent,
  GrafastInternalExecutionArgs,
} from "./interfaces";
import { establishMiddleware } from "./middleware";

type PlanResult =
  | { errors: readonly GraphQLError[] }
  | {
      errors?: never;
      operationPlan: OperationPlan;
      onError: ErrorBehavior;
    };

export function establishInternalExecutionArgs(
  args: GrafastExecutionArgs,
): GrafastInternalExecutionArgs {
  const middleware = establishMiddleware(args);
  const options = args.resolvedPreset?.grafast;
  return {
    ...args,
    middleware,
    explain: options?.explain,
    timeouts: options?.timeouts,
    maxPlanningDepth: options?.maxPlanningDepth,
    // TODO: Delete this
    outputDataAsString: args.outputDataAsString,
  };
}

/**
 * Plan the given execution arguments but do not execute them. Useful for
 * pre-warming the operation cache.
 *
 * @experimental
 */
export function prepare(inArgs: GrafastExecutionArgs): PlanResult {
  const args = establishInternalExecutionArgs(inArgs);
  const result = _plan(args);
  if (result.errors != null) {
    return result;
  } else {
    const { operationPlan, onError } = result;
    return { operationPlan, onError };
  }
}

/** @internal */
export function _plan(args: GrafastInternalExecutionArgs) {
  const { schema, contextValue: context, rootValue, middleware } = args;
  const exeContext = buildExecutionContext(args);

  // If a list of errors was returned, abort
  if (Array.isArray(exeContext) || "length" in exeContext) {
    return Object.assign(Object.create(null), {
      errors: exeContext,
      extensions: args[$$extensions],
    });
  }

  const { operation, fragments, variableValues } = exeContext;
  // TODO: update this when GraphQL.js gets support for onError
  const onError = args.onError ?? "PROPAGATE";

  let operationPlan!: OperationPlan;
  try {
    if (middleware != null) {
      operationPlan = middleware.runSync(
        "establishOperationPlan",
        {
          schema,
          operation,
          fragments,
          variableValues,
          context: context as any,
          rootValue,
          onError,
          args,
          options: args, // Only GrafastOperationOptions are public on these, we're passing the whole thing to avoid unnecessary GC but it's still internal
        },
        establishOperationPlanFromEvent,
      );
    } else {
      operationPlan = establishOperationPlan(
        schema,
        operation,
        fragments,
        variableValues,
        context as any,
        rootValue,
        onError,
        args,
      );
    }
    return { operationPlan, variableValues, onError };
  } catch (error) {
    const graphqlError =
      error instanceof GraphQLError
        ? error
        : new GraphQLError(error.message, {
            originalError: error,
            extensions: error.extensions ?? null,
          });
    return { errors: [graphqlError] };
  }
}

function establishOperationPlanFromEvent(event: EstablishOperationPlanEvent) {
  return establishOperationPlan(
    event.schema,
    event.operation,
    event.fragments,
    event.variableValues,
    event.context as any,
    event.rootValue,
    event.onError,
    event.options,
  );
}
