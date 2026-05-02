import type { ExecutionDetails, GrafastResultsList } from "grafast";
import { access, Step } from "grafast";
import type { FieldNode, SelectionNode } from "graphql";
import { Kind } from "graphql";

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
  private selections: SelectionNode[];

  constructor(
    $parent: GraphQLSelectionSetStep<TSchema, TOperationType>,
    fieldName: string,
    args?: ArgsObject,
    options?: { directives?: ArgsObject },
  ) {
    super();
    this.addDependency($parent);
    this.fieldName = fieldName;
    this.selections = [];
  }

  getParent() {
    const $parent = this.getDep(0);
    if (!($parent instanceof GraphQLSelectionSetStep)) {
      throw new Error(`Expected ${$parent} to be a GraphQLSelectionSetStep`);
    }
    return $parent as GraphQLSelectionSetStep<TSchema, TOperationType>;
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

  addSelection(selection: SelectionNode) {
    this.selections.push(selection);
  }

  optimize(): Step {
    const selection: FieldNode = {
      kind: Kind.FIELD,
      name: {
        kind: Kind.NAME,
        value: this.fieldName,
      },
      alias: undefined, // TODO
      selectionSet: {
        kind: Kind.SELECTION_SET,
        selections: this.selections,
      },
    };
    // TODO: const alias = this.getParent().addField(this.fieldName, ...)
    this.getParent().addSelection(selection);
    const alias = this.fieldName;
    return access(this.getParent(), alias);
  }

  execute(details: ExecutionDetails): GrafastResultsList<any> {
    const {
      values: [v],
      indexMap,
    } = details;
    return indexMap((i) => v.at(i));
  }
}
