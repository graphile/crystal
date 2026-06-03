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
  GraphQLSchema,
} from "graphql";

import { GraphQLOperationStep } from "./graphqlOperation.ts";
import type { GraphQLSelectionSetStep } from "./graphqlSelectionSet.ts";

export type OperationType = "query" | "mutation" | "subscription";

/**
 * Client can use any transport (or no transport) that it
 * wants.
 */
export interface GraphQLClient {
  execute(
    args: Pick<
      ExecutionArgs,
      | "document" // TODO: typed document node
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
 * This is your entrypoint to a GraphQL schema: issue queries, mutations and
 * subscriptions from here. The schema will execute these operations via the
 * passed client. During plan optimization, this step will be dropped and
 * replaced with direct reference to the client - it's purely for DX.
 */
export class GraphQLSchemaStep<TSchema = any> extends Step<
  GraphQLClient | null | undefined
> {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLSchemaStep",
  };

  public readonly schema: GraphQLSchema;

  constructor(
    schema: GraphQLSchema,
    $client: Step<GraphQLClient | null | undefined>,
  ) {
    super();
    this.schema = schema;
    this.addUnaryDependency($client);
  }

  getClient() {
    return this.getDep(0) as Step<GraphQLClient | null | undefined>;
  }

  operation<TOperationType extends OperationType>(
    operationType: TOperationType,
  ) {
    return this.cacheStep(
      "operation",
      operationType,
      () =>
        new GraphQLOperationStep<TSchema, TOperationType>(this, operationType),
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

  get(...args: Parameters<GraphQLSelectionSetStep<TSchema, "query">["get"]>) {
    return this.query().get(...args);
  }

  optimize() {
    return this.getClient();
  }

  execute(details: ExecutionDetails): GrafastResultsList<any> {
    const {
      indexMap,
      values: [v],
    } = details;
    return indexMap((i) => v.at(i));
  }
}

export function graphqlSchema(
  schema: GraphQLSchema,
  $client: Step<GraphQLClient | null | undefined>,
) {
  return new GraphQLSchemaStep(schema, $client);
}
