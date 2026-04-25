import type {
  ExecutionDetails,
  GrafastResultsList,
  PromiseOrDirect,
} from "grafast";
import { Step } from "grafast";
import type {
  AsyncExecutionResult,
  ExecutionArgs,
  ExecutionResult,
} from "graphql";

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

export class GraphQLSchemaStep extends Step {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLSchemaStep",
  };

  constructor($client: Step<GraphQLClient | null | undefined>) {
    super();
    this.addDependency($client);
  }

  optimize() {
    return this.getDep(0);
  }

  execute(details: ExecutionDetails): GrafastResultsList<any> {
    const {
      indexMap,
      values: [v],
    } = details;
    return indexMap((i) => v.at(i));
  }
}

export function graphqlSchema($client: Step<GraphQLClient | null | undefined>) {
  return new GraphQLSchemaStep($client);
}
