import { ExecutableStep, GrafastResultsList, GrafastValuesList } from "grafast";
import { GraphQLOperationStep } from "..";
import { ArgsObject } from "../interfaces";
import { GraphQLSelectionSetStep } from "./graphqlSelectionSet";

export class GraphQLSelectFieldStep extends ExecutableStep {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLSelectFieldStep",
  };

  isSyncAndSafe = true;

  operationStepId: number;

  constructor(
    $operation: GraphQLOperationStep,
    $parent: ExecutableStep,
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

  execute(
    count: number,
    values: [GrafastValuesList<any>],
  ): GrafastResultsList<any> {
    return values[0];
  }
}
