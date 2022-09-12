import type {
  AsyncExecutionResult,
  ExecutionResult,
  GraphQLArgs,
} from "graphql";
import { parse, validate, validateSchema } from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";

import type { GrafastExecuteOptions } from "./execute.js";
import { execute } from "./execute.js";
import { isPromiseLike } from "./utils.js";

/**
 * A replacement for GraphQL.js' `graphql` method that calls Grafast's
 * execute instead
 */
export function grafastGraphql(
  args: GraphQLArgs,
  options: GrafastExecuteOptions = {},
): PromiseOrValue<
  ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, undefined>
> {
  const {
    schema,
    source,
    rootValue,
    contextValue,
    variableValues,
    operationName,
    fieldResolver,
    typeResolver,
  } = args;

  // Validate Schema
  const schemaValidationErrors = validateSchema(schema);
  if (schemaValidationErrors.length > 0) {
    return { errors: schemaValidationErrors };
  }

  // Parse
  let document;
  try {
    document = parse(source);
  } catch (syntaxError) {
    return { errors: [syntaxError] };
  }

  // Validate
  const validationErrors = validate(schema, document);
  if (validationErrors.length > 0) {
    return { errors: validationErrors };
  }

  // Execute
  return execute(
    {
      schema,
      document,
      rootValue,
      contextValue,
      variableValues,
      operationName,
      fieldResolver,
      typeResolver,
    },
    options,
  );
}

export function grafastGraphqlSync(
  args: GraphQLArgs,
  options: GrafastExecuteOptions = {},
): ExecutionResult {
  const result = grafastGraphql(args, options);
  if (isPromiseLike(result)) {
    throw new Error("Grafast execution failed to complete synchronously.");
  }
  return result as ExecutionResult;
}
