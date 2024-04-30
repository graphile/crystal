import type {
  GrafastResultsList,
  GrafastValuesList,
  PromiseOrDirect,
  AccessStep,
} from "grafast";
import { access, ExecutableStep, exportAs } from "grafast";
import { GraphQLSelectionSetStep } from "./graphqlSelectionSet.js";
import { GraphQLSchemaStep } from "./graphqlSchema.js";

export class GraphQLOperationStep extends ExecutableStep {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLOperationStep",
  };

  isSyncAndSafe = false;

  constructor(
    $schema: GraphQLSchemaStep,
    public readonly operationType: "query" | "mutation" | "subscription", // TODO: schema, request, etc
  ) {
    super();
    this.addDependency($schema);
  }

  rootSelectionSet() {
    return new GraphQLSelectionSetStep(this, null);
  }

  get(...args: Parameters<GraphQLSelectionSetStep["get"]>) {
    return this.rootSelectionSet().get(...args);
  }

  execute(count: number, values: never[]): GrafastResultsList<any> {
    const result: Array<PromiseOrDirect<any>> = [];
    for (let i = 0; i < count; i++) {
      result[i] = null as any;
    }
    return result;
  }
}

export function graphqlQuery($schema: GraphQLSchemaStep): GraphQLOperationStep {
  return new GraphQLOperationStep($schema, "query");
}

exportAs("@dataplan/graphql", graphqlQuery, "graphqlQuery");

export function graphqlMutation(
  $schema: GraphQLSchemaStep,
): GraphQLOperationStep {
  return new GraphQLOperationStep($schema, "mutation");
}

exportAs("@dataplan/graphql", graphqlMutation, "graphqlMutation");

export function graphqlSubscription(
  $schema: GraphQLSchemaStep,
): GraphQLOperationStep {
  return new GraphQLOperationStep($schema, "subscription");
}

exportAs("@dataplan/graphql", graphqlSubscription, "graphqlSubscription");
