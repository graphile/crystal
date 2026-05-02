import type { ExecutionDetails, GrafastResultsList } from "grafast";
import { Step } from "grafast";

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

  private readonly fieldName: string;

  constructor(
    $parent: GraphQLSelectionSetStep<TSchema, TOperationType>,
    fieldName: string,
    args?: ArgsObject,
    options?: { directives?: ArgsObject },
  ) {
    super();
    this.addDependency($parent);
    this.fieldName = fieldName;
  }

  getParent() {
    return this.getDep(0) as GraphQLSelectionSetStep<TSchema, TOperationType>;
  }
  getOperation() {
    return this.getParent().getOperation();
  }

  selectionSet() {
    return new GraphQLSelectionSetStep(this);
  }

  get(
    ...args: Parameters<GraphQLSelectionSetStep<TSchema, TOperationType>["get"]>
  ) {
    return this.selectionSet().get(...args);
  }
  ofType(typeName: string) {
    return new GraphQLSelectionSetStep(this, typeName);
  }

  execute(details: ExecutionDetails): GrafastResultsList<any> {
    const {
      values: [v],
      indexMap,
    } = details;
    return indexMap((i) => v.at(i));
  }
}
