import type {
  AsyncExecutionResult,
  ExecutionResult,
  GraphQLArgs,
} from "graphql";
import { parse, validate, validateSchema } from "graphql";
import type { PromiseOrValue } from "graphql/jsutils/PromiseOrValue";

import type { DataPlannerExecuteOptions } from "./execute.js";
import { execute } from "./execute.js";

/**
 * A replacement for GraphQL.js' `graphql` method that calls DataPlanner's
 * execute instead
 */
export function dataplannerGraphql(
  args: GraphQLArgs,
  options: DataPlannerExecuteOptions = {},
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
