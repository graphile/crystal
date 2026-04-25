import type { ExecutionDetails, GrafastResultsList } from "grafast";
import { Step } from "grafast";

import type { GraphQLOperationStep } from "..";
import type { ArgsObject } from "../interfaces";
import { GraphQLSelectionSetStep } from "./graphqlSelectionSet";

export class GraphQLSelectFieldStep extends Step {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLSelectFieldStep",
  };

  isSyncAndSafe = true;

  operationStepId: number;

  constructor(
    $operation: GraphQLOperationStep,
    $parent: Step,
    private fieldName: string,
    args?: ArgsObject,
    options?: { directives?: ArgsObject },
  ) {
    super();
    this.operationStepId = $operation.id;
    this.addDependency($parent);
  }

  getOperation() {
    return this.getStep(this.operationStepId) as GraphQLOperationStep;
  }

  selectionSet() {
    return new GraphQLSelectionSetStep(this.getOperation(), this);
  }

  get(...args: Parameters<GraphQLSelectionSetStep["get"]>) {
    return this.selectionSet().get(...args);
  }
  ofType(typeName: string) {
    return new GraphQLSelectionSetStep(this.getOperation(), this, typeName);
  }

  execute(details: ExecutionDetails): GrafastResultsList<any> {
    const {
      values: [v],
      indexMap,
    } = details;
    return indexMap((i) => v.at(i));
  }
}
