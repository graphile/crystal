import type { ExecutionDetails, GrafastResultsList } from "grafast";
import { Step } from "grafast";

import type { GraphQLOperationStep } from "..";
import type { ArgsObject } from "../interfaces";
import type { OperationType } from "./graphqlSchema";
import { GraphQLSelectionSetStep } from "./graphqlSelectionSet";

export class GraphQLSelectFieldStep<
  TSchema,
  TOperationType extends OperationType,
> extends Step {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLSelectFieldStep",
  };

  isSyncAndSafe = true;

  operationStepId: number;

  private readonly fieldName: string;

  constructor(
    $parent: GraphQLSelectionSetStep<TSchema, TOperationType>,
    $data: Step,
    fieldName: string,
    args?: ArgsObject,
    options?: { directives?: ArgsObject },
  ) {
    super();
    this.operationStepId = $operation.id;
    this.addUnaryDependency($parent);
    this.addDependency($data);
    this.fieldName = fieldName;
  }

  getOperation() {
    return this.getStep(this.operationStepId) as GraphQLOperationStep<
      TSchema,
      TOperationType
    >;
  }

  selectionSet() {
    return new GraphQLSelectionSetStep(this.getOperation(), this);
  }

  get(
    ...args: Parameters<GraphQLSelectionSetStep<TSchema, TOperationType>["get"]>
  ) {
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
