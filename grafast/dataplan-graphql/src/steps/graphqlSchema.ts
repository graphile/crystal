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

import { GraphQLOperationStep } from "./graphqlOperation";
import type { GraphQLSelectionSetStep } from "./graphqlSelectionSet";

/**
 * Client can use any transport (or no transport) that it
 * wants.
 */
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

/**
 * This is your entrypoint to a GraphQL schema: issue
 * queries, mutations and subscriptions from here. The
 * schema will execute these operations via the passed
 * client.
 */
export class GraphQLSchemaStep extends Step {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLSchemaStep",
  };

  constructor($client: Step<GraphQLClient | null | undefined>) {
    super();
    this.addDependency($client);
  }

  operation(operationType: "query" | "mutation" | "subscription") {
    return this.cacheStep(
      "operation",
      operationType,
      () => new GraphQLOperationStep(this, operationType),
    );
  }
  query() {
    return this.operation("query");
  }
  mutation() {
    return this.operation("mutation");
  }
  subscription() {
    return this.operation("subscription");
  }
  get(...args: Parameters<GraphQLSelectionSetStep["get"]>) {
    return this.query().get(...args);
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
