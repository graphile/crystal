import type {
  ExecutionDetails,
  GrafastResultsList,
  PromiseOrDirect,
} from "grafast";
import { exportAs, Step } from "grafast";

import type { GraphQLSchemaStep } from "./graphqlSchema.js";
import { GraphQLSelectionSetStep } from "./graphqlSelectionSet.js";

export class GraphQLOperationStep extends Step {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLOperationStep",
  };

  isSyncAndSafe = false;
  public readonly operationType: "query" | "mutation" | "subscription";

  constructor(
    $schema: GraphQLSchemaStep,
    operationType: "query" | "mutation" | "subscription", // TODO: schema, request, etc
  ) {
    super();
    this.addDependency($schema);
    this.operationType = operationType;
  }

  rootSelectionSet() {
    return this.cacheStep(
      "rootSelectionSet",
      "",
      () => new GraphQLSelectionSetStep(this, null),
    );
  }

  get(...args: Parameters<GraphQLSelectionSetStep["get"]>) {
    return this.rootSelectionSet().get(...args);
  }

  execute(details: ExecutionDetails): GrafastResultsList<any> {
    const { count, values } = details;
    const result: Array<PromiseOrDirect<any>> = [];
    for (let i = 0; i < count; i++) {
      result[i] = null as any;
    }
    return result;
  }
}

export function graphqlQuery($schema: GraphQLSchemaStep) {
  return new GraphQLOperationStep($schema, "query");
}
exportAs("@dataplan/graphql", graphqlQuery, "graphqlQuery");

export function graphqlMutation($schema: GraphQLSchemaStep) {
  return new GraphQLOperationStep($schema, "mutation");
}
exportAs("@dataplan/graphql", graphqlMutation, "graphqlMutation");

export function graphqlSubscription($schema: GraphQLSchemaStep) {
  return new GraphQLOperationStep($schema, "subscription");
}
exportAs("@dataplan/graphql", graphqlSubscription, "graphqlSubscription");
