import type { ExecutionDetails } from "grafast";
import { Step } from "grafast";

import type { GraphQLSelection } from "../interfaces.js";
import type { GraphQLOperationStep } from "./graphqlOperation.js";
import { GraphQLSelectFieldStep } from "./graphqlSelectField.js";

export class GraphQLSelectionSetStep extends Step {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLSelectionSetStep",
  };

  isSyncAndSafe = true;

  isRoot: boolean;

  selections: GraphQLSelection[] = [];
  operationStepId: number;
  private typeName: string | undefined;

  constructor(
    $operation: GraphQLOperationStep,
    // Could be an __ItemStep for lists
    $parent: Step | null,
    typeName?: string,
  ) {
    super();
    this.operationStepId = $operation.id;
    this.isRoot = $parent == null;
    this.addDependency($parent ?? $operation);
    this.typeName = typeName;
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

  execute(details: ExecutionDetails) {
    const { values, indexMap } = details;
    const v = values[0];
    return indexMap((i) => v.at(i));
  }

  // TODO: support `stream`
}
