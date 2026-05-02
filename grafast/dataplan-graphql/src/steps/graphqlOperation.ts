import type { ExecutionDetails, GrafastResultsList } from "grafast";
import { exportAs, flagError, isAsyncIterable, Step } from "grafast";
import type { DocumentNode, SelectionNode } from "graphql";
import { Kind, OperationTypeNode } from "graphql";
import { toe } from "graphql-toe";

import type {
  GraphQLClient,
  GraphQLSchemaStep,
  OperationType,
} from "./graphqlSchema.js";
import { GraphQLSelectionSetStep } from "./graphqlSelectionSet.js";

const OPERATION_TYPE_LOOKUP = {
  query: OperationTypeNode.QUERY,
  mutation: OperationTypeNode.MUTATION,
  subscription: OperationTypeNode.SUBSCRIPTION,
};

/**
 * This step represents a single GraphQL operation (query, mutation,
 * subscription) and is the jumping off point for making selections.
 */
export class GraphQLOperationStep<
  TSchema,
  TOperationType extends OperationType,
> extends Step {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLOperationStep",
  };

  isSyncAndSafe = false;
  public readonly operationType: TOperationType;

  private document: DocumentNode;
  private selections: SelectionNode[];

  constructor(
    $schema: GraphQLSchemaStep<TSchema>,
    operationType: TOperationType,
  ) {
    super();
    this.addUnaryDependency($schema);
    this.operationType = operationType;
    this.selections = [];
    this.document = {
      kind: Kind.DOCUMENT,
      definitions: [
        {
          kind: Kind.OPERATION_DEFINITION,
          operation: OPERATION_TYPE_LOOKUP[this.operationType],
          selectionSet: {
            kind: Kind.SELECTION_SET,
            selections: this.selections,
          },
        },
      ],
    };
  }

  getClient() {
    return this.getDep(0) as Step<GraphQLClient | null | undefined>;
  }

  // Convenience method
  getOperation(): GraphQLOperationStep<TSchema, TOperationType> {
    return this;
  }

  rootSelectionSet() {
    return this.cacheStep(
      "rootSelectionSet",
      "",
      () => new GraphQLSelectionSetStep(this),
    );
  }

  get(
    ...args: Parameters<GraphQLSelectionSetStep<TSchema, TOperationType>["get"]>
  ) {
    return this.rootSelectionSet().get(...args);
  }

  addSelection(selection: SelectionNode) {
    this.selections.push(selection);
  }

  execute(details: ExecutionDetails): GrafastResultsList<any> {
    const { values, indexMap, stream } = details;
    const client = values[0].unaryValue() as GraphQLClient | null | undefined;
    const { document } = this;
    return indexMap(async (i) => {
      if (!client) {
        return flagError(new Error("No GraphQL client passed"));
      }
      if (!document) {
        return flagError(
          new Error("Failed to construct document during optimize?"),
        );
      }
      if (this.operationType === "subscription" && !stream) {
        return flagError(new Error("Must stream subscription operations"));
      }
      const variableValues: Record<string, any> = Object.create(null);
      // TODO: add variables
      const result = await client.execute({ document, variableValues });

      if (isAsyncIterable(result)) {
        throw new Error("Incremental delivery is currently unsupported");
      }

      const data = toe(result);
      console.dir(data);

      return data;
    });
  }

  optimize() {
    // NOTE: It's important that we don't merge with other operations unless
    // their `inhibitOnNull` statuses for each variable match our own. We don't
    // want to inhibit ourself because some other query was inhibited.
    // e.g. `{userById(id: $userId)}` & `{organizationById(id: $orgId)}` can
    // only merge if neither $userId nor $orgId have inhibit on null.
    return this;
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
