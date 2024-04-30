import { ExecutableStep } from "grafast";
import { GraphQLOperationStep } from "./graphqlOperation.js";
import { GraphQLSelectFieldStep } from "./graphqlSelectField.js";
import { ArgsObject, GraphQLSelection } from "../interfaces.js";

export class GraphQLSelectionSetStep extends ExecutableStep {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLSelectionSetStep",
  };

  isSyncAndSafe = true;

  isRoot: boolean;

  selections: GraphQLSelection[] = [];
  operationStepId: number;

  constructor(
    $operation: GraphQLOperationStep,
    // Could be an __ItemStep for lists
    $parent: ExecutableStep | null,
    private typeName?: string,
  ) {
    super();
    this.operationStepId = $operation.id;
    this.isRoot = $parent == null;
    this.addDependency($parent ?? $operation);
  }

  getOperation() {
    return this.getStep(this.operationStepId) as GraphQLOperationStep;
  }

  get(
    ...args: ConstructorParameters<typeof GraphQLSelectFieldStep> extends [
      any,
      any,
      ...infer U,
    ]
      ? U
      : never
  ) {
    return new GraphQLSelectFieldStep(this.getOperation(), this, ...args);
  }

  optimize() {
    return this.getDep(0);
  }

  execute(count: number, values: [any]) {
    return values[0];
  }

  // TODO: support `stream`
}
