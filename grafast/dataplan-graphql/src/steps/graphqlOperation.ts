import type { ExecutionDetails, GrafastResultsList } from "grafast";
import { access, exportAs, flagError, isAsyncIterable, Step } from "grafast";
import type {
  DocumentNode,
  OperationDefinitionNode,
  SelectionNode,
  VariableDefinitionNode,
} from "graphql";
import { Kind, OperationTypeNode, print } from "graphql";
import { toe } from "graphql-toe";

import type {
  GraphQLClient,
  GraphQLSchemaStep,
  OperationType,
} from "./graphqlSchema.ts";
import { GraphQLSelectionSetStep } from "./graphqlSelectionSet.ts";

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
  private operation: Omit<OperationDefinitionNode, "variableDefinitions"> & {
    variableDefinitions?: VariableDefinitionNode[];
  };
  private selections: SelectionNode[];

  constructor(
    $schema: GraphQLSchemaStep<TSchema>,
    operationType: TOperationType,
  ) {
    super();
    this.addUnaryDependency($schema);
    this.operationType = operationType;
    this.selections = [];
    this.operation = {
      kind: Kind.OPERATION_DEFINITION,
      operation: OPERATION_TYPE_LOOKUP[this.operationType],
      selectionSet: {
        kind: Kind.SELECTION_SET,
        selections: this.selections,
      },
    };
    this.document = {
      kind: Kind.DOCUMENT,
      definitions: [this.operation],
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
      () => new GraphQLSelectionSetStep(this.data()),
    );
  }

  usedVariableNames = new Set<string>();
  variableNameByDepId = new Map<number, string>();
  getVariableName($step: Step, hint: string) {
    if (!this.canAddDependency($step)) {
      throw new Error(
        `Invalid dependency chain: ${this} is not allowed to depend on ${$step}`,
      );
    }
    // TODO: it is unreasonable to assume this can be unary. We're going to
    // have to do variable batching or similar. Potentially we could do
    // excessive selection sets (one field per arg value) but that's more
    // complex.
    const depId = this.addUnaryDependency($step);
    const existing = this.variableNameByDepId.get(depId);
    if (existing) {
      return existing;
    }
    let name = hint;
    let counter = 1;
    while (this.usedVariableNames.has(name)) {
      name = `${hint}${++counter}`;
    }
    this.usedVariableNames.add(name);
    this.variableNameByDepId.set(depId, name);
    if (!this.operation.variableDefinitions) {
      this.operation.variableDefinitions = [];
    }
    this.operation.variableDefinitions!.push({
      kind: Kind.VARIABLE_DEFINITION,
      type: {
        kind: Kind.NON_NULL_TYPE,
        type: {
          kind: Kind.NAMED_TYPE,
          name: {
            kind: Kind.NAME,
            value: "String",
          },
        },
      }, // TODO: NEED PROPER VARIABLE TYPE!!
      variable: {
        kind: Kind.VARIABLE,
        name: {
          kind: Kind.NAME,
          value: name,
        },
      },
    });
    return name;
  }

  data() {
    return access(this, "data");
  }

  get(
    ...args: Parameters<GraphQLSelectionSetStep<TSchema, TOperationType>["get"]>
  ) {
    return this.rootSelectionSet().get(...args);
  }

  addSelection(selection: SelectionNode) {
    this.selections.push(selection);
  }

  async execute(details: ExecutionDetails): Promise<GrafastResultsList<any>> {
    const { values, indexMap, stream } = details;
    const client = values[0].unaryValue() as GraphQLClient | null | undefined;
    const { document, variableNameByDepId } = this;
    if (!client) {
      return indexMap((i) => flagError(new Error("No GraphQL client passed")));
    }
    if (!document) {
      return indexMap((i) =>
        flagError(new Error("Failed to construct document during optimize?")),
      );
    }
    console.log(print(document));
    if (this.operationType === "subscription" && !stream) {
      return indexMap(() =>
        flagError(new Error("Must stream subscription operations")),
      );
    }

    const variableDepIdAndNames = [...variableNameByDepId.entries()];

    async function getResult(index: number) {
      const variableValues = Object.fromEntries(
        variableDepIdAndNames.map(([depId, name]) => [
          name,
          values[depId].at(index),
        ]),
      );

      const result = await client!.execute({ document, variableValues });

      if (isAsyncIterable(result)) {
        throw new Error("Incremental delivery is currently unsupported");
      }

      const data = toe(result);
      console.dir(data);

      return { data };
    }

    if (variableDepIdAndNames.every(([depId]) => !values[depId].isBatch)) {
      // All unary - execute once, use result for everything
      const result = getResult(0);
      return indexMap(() => result);
    }
    return indexMap(getResult);
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
