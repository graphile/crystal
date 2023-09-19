import { ExecutableStep, GrafastValuesList, PromiseOrDirect } from "grafast";
import { AsyncExecutionResult, ExecutionArgs, ExecutionResult } from "graphql";

export interface GraphQLClient {
  execute(
    args: Pick<
      ExecutionArgs,
      | "document"
      | "rootValue"
      | "contextValue"
      | "variableValues"
      | "operationName"
    >,
  ): PromiseOrDirect<
    ExecutionResult | AsyncGenerator<AsyncExecutionResult, void, void>
  >;
}

export class GraphQLSchema extends ExecutableStep {
  constructor($client: ExecutableStep<GraphQLClient | null | undefined>) {
    super();
    this.addDependency($client);
  }

  optimize() {
    return this.getDep(0);
  }

  execute(count: number, values: [any[]]): GrafastValuesList<any> {
    return values[0];
  }
}

export function graphqlSchema(
  $client: ExecutableStep<GraphQLClient | null | undefined>,
) {
  return new GraphQLSchema($client);
}
