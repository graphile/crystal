import type { ExecutionDetails, GrafastResultsList } from "grafast";
import { access, Step } from "grafast";
import type { GraphQLOutputType } from "graphql";
import { GraphQLUnionType, TypeNameMetaFieldDef } from "graphql";

import type { ArgsObject, GraphQLSelection } from "../interfaces.ts";
import type { OperationType } from "./graphqlSchema.ts";
import { GraphQLSelectionSetStep } from "./graphqlSelectionSet.ts";

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
  private selections: GraphQLSelection[];
  private expectedType: GraphQLOutputType;

  argsDeps: { [argName: string]: number };

  constructor(
    $parent: GraphQLSelectionSetStep<TSchema, TOperationType>,
    fieldName: string,
    args?: Record<string, Step>, // ArgsObject,
    options?: { directives?: ArgsObject },
  ) {
    super();
    const parentType = $parent.getExpectedType();
    if (fieldName === "__typename") {
      this.expectedType = TypeNameMetaFieldDef.type;
    } else if (parentType instanceof GraphQLUnionType) {
      throw new Error(`Cannot select fields on a union`);
    } else {
      const fields = parentType.getFields();
      const field = fields[fieldName];
      if (!field) {
        throw new Error(
          `Field ${fieldName} does not exist on type ${parentType.name}`,
        );
      }
      this.expectedType = field.type;
    }
    this.fieldName = fieldName;
    this.selections = [];
    this.addDependency($parent);
    if (args) {
      this.argsDeps = Object.fromEntries(
        Object.entries(args).map(([argName, $dep]) => [
          argName,
          this.addUnaryDependency($dep),
        ]),
      );
    } else {
      this.argsDeps = Object.create(null);
    }
  }

  getSchema() {
    return this.getOperation().getSchema();
  }

  getExpectedType() {
    return this.expectedType;
  }

  getArgs(): Record<string, Step> {
    return Object.fromEntries(
      Object.entries(this.argsDeps).map(([argName, depId]) => [
        argName,
        this.getDep(depId),
      ]),
    );
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

  addSelection(selection: GraphQLSelection) {
    this.selections.push(selection);
  }

  optimize(): Step {
    const $parent = this.getParent();
    const args = this.getArgs();
    const { selections } = this;
    const alias = $parent.selectField(this.fieldName, { args, selections });
    return access($parent, alias);
  }

  execute(details: ExecutionDetails): GrafastResultsList<any> {
    const {
      values: [v],
      indexMap,
    } = details;
    return indexMap((i) => v.at(i));
  }
}
