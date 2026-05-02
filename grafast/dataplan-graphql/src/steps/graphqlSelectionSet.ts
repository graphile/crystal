import type { ExecutionDetails } from "grafast";
import { Step } from "grafast";

import type { GraphQLSelection } from "../interfaces.js";
import type { GraphQLOperationStep } from "./graphqlOperation.js";
import type { OperationType } from "./graphqlSchema.js";
import { GraphQLSelectFieldStep } from "./graphqlSelectField.js";

type SelectionParent<TSchema, TOperationType extends OperationType> =
  | GraphQLOperationStep<TSchema, TOperationType> // Root selection
  | GraphQLSelectionSetStep<TSchema, TOperationType> // E.g. fragment
  | GraphQLSelectFieldStep<TSchema, TOperationType>; // Field

export class GraphQLSelectionSetStep<
  TSchema,
  TOperationType extends OperationType,
> extends Step {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLSelectionSetStep",
  };

  isSyncAndSafe = true;

  isRoot: boolean;

  selections: GraphQLSelection[] = [];
  private typeName: string | undefined;

  constructor(
    $parent: SelectionParent<TSchema, TOperationType>,
    $data: Step, // Could be an __ItemStep for lists
    typeName?: string,
  ) {
    super();
    this.isRoot = $parent == null;
    this.addUnaryDependency($parent);
    this.addDependency($data);
    this.typeName = typeName;
  }

  getParent() {
    return this.getDep(0) as SelectionParent<TSchema, TOperationType>;
  }

  getOperation(): GraphQLOperationStep<TSchema, TOperationType> {
    return this.getParent().getOperation();
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
    return new GraphQLSelectFieldStep(this, ...args);
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
