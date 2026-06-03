import type { ExecutionDetails } from "grafast";
import { __ItemStep, AccessStep, Step } from "grafast";
import type { GraphQLCompositeType } from "graphql";
import {
  getNamedType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLUnionType,
  isCompositeType,
} from "graphql";

import type { GraphQLArgumentValue, GraphQLSelection } from "../interfaces.ts";
import { GraphQLOperationStep } from "./graphqlOperation.ts";
import type { OperationType } from "./graphqlSchema.ts";
import { GraphQLSelectFieldStep } from "./graphqlSelectField.ts";

type SelectionParent<TSchema, TOperationType extends OperationType> =
  | GraphQLOperationStep<TSchema, TOperationType> // Root selection
  | GraphQLSelectionSetStep<TSchema, TOperationType> // E.g. fragment
  | GraphQLSelectFieldStep<TSchema, TOperationType>; // Field

type SelectionDataParent<TSchema, TOperationType extends OperationType> =
  | SelectionParent<TSchema, TOperationType>
  | __ItemStep<any>
  | AccessStep<any>;

interface FieldDetails {
  args?: Record<string, Step>;
  selections?: GraphQLSelection[];
}

function getExpectedType<TSchema, TOperationType extends OperationType>(
  $parent: SelectionDataParent<TSchema, TOperationType>,
  explicitTypeName?: string,
): GraphQLCompositeType {
  let $underlying = $parent;
  if ($underlying instanceof AccessStep) {
    if ($underlying.path.length !== 1 || $underlying.path[0] !== "data") {
      throw new Error(
        `Didn't understand ${$parent} passed to graphqlSelectionSet()`,
      );
    }
    const $source = $underlying.getParentStep();
    if (!($source instanceof GraphQLOperationStep)) {
      throw new Error(
        `Expected ${$parent} to have a reference to GraphQLOperationStep`,
      );
    }
    $underlying = $source;
  }
  while ($underlying instanceof __ItemStep) {
    $underlying = $underlying.getParentStep() as SelectionDataParent<
      TSchema,
      TOperationType
    >;
  }
  if (
    $underlying instanceof GraphQLOperationStep ||
    $underlying instanceof GraphQLSelectFieldStep ||
    $underlying instanceof GraphQLSelectionSetStep
  ) {
    const expectedType = getNamedType($underlying.getExpectedType());
    const typeName = explicitTypeName ?? expectedType.name;
    if (typeName !== expectedType.name) {
      const schema = $underlying.getSchema();
      const t = schema.getType(typeName);
      if (!t) {
        throw new Error(`Type '${typeName}' does not exist in the schema`);
      }
      if (!isCompositeType(t)) {
        throw new Error(`Type '${typeName}' is not a composite type`);
      }
      if (t instanceof GraphQLUnionType) {
        if (!t.getTypes().some((o) => o.name === typeName)) {
          throw new Error(
            `Union type '${typeName}' is not valid on a selection of type ${expectedType}`,
          );
        } else {
          return t;
        }
      } else if (t instanceof GraphQLInterfaceType) {
        if (
          !schema.getImplementations(t).objects.some((o) => o.name === typeName)
        ) {
          throw new Error(
            `Interface type '${typeName}' is not valid on a selection of type ${expectedType}`,
          );
        } else {
          return t;
        }
      } else {
        throw new Error(
          `Object type '${typeName}' is not valid on a selection of type ${expectedType}`,
        );
      }
    } else if (isCompositeType(expectedType)) {
      return expectedType;
    } else {
      throw new Error(`Selection not permitted on ${typeName}`);
    }
  } else {
    throw new Error(
      `Parent step ${$parent} doesn't seem appropriate for use here`,
    );
  }
}
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

  // selections: GraphQLSelection[] = [];
  public readonly expectedType: GraphQLCompositeType;
  private typeName: string | undefined;
  private selections: GraphQLSelection[];

  constructor(
    $parent: SelectionDataParent<TSchema, TOperationType>,
    typeName?: string,
  ) {
    super();
    this.isRoot = $parent == null;
    this.addDependency($parent);
    this.typeName = typeName;
    this.expectedType = getExpectedType($parent, typeName);
    this.selections = [];
  }

  getParent() {
    return this.getDep(0) as SelectionDataParent<TSchema, TOperationType>;
  }

  getExpectedType() {
    return this.expectedType;
  }

  getSchema() {
    return this.getOperation().getSchema();
  }

  getGraphQLParent() {
    let $parent = this.getDepDeep(0) as SelectionDataParent<
      TSchema,
      TOperationType
    >;
    if ($parent instanceof AccessStep) {
      if ($parent.path.length === 1 && $parent.path[0] === "data") {
        $parent = $parent.getParentStep() as SelectionDataParent<
          TSchema,
          TOperationType
        >;
      }
    }
    if (
      $parent instanceof GraphQLOperationStep ||
      $parent instanceof GraphQLSelectionSetStep ||
      $parent instanceof GraphQLSelectFieldStep
    ) {
      return $parent;
    } else {
      throw new Error(
        `Couldn't find suitable parent for ${this}; found ${$parent}`,
      );
    }
  }

  getOperation(): GraphQLOperationStep<TSchema, TOperationType> {
    return this.getGraphQLParent().getOperation();
  }

  get(
    ...args: ConstructorParameters<typeof GraphQLSelectFieldStep> extends [
      any,
      ...infer U,
    ]
      ? U
      : never
  ) {
    return new GraphQLSelectFieldStep(this, ...args);
  }

  /**
   * Finds the selection set closes to the root without passing through a field
   * selection. Used to ensure field names are uniquely selected.
   */
  owningSelectionSet() {
    let $owning: GraphQLSelectionSetStep<TSchema, TOperationType> = this;
    for (let i = 0; i < 100; i++) {
      const $parent = $owning.getGraphQLParent();
      if ($parent instanceof GraphQLSelectionSetStep) {
        $owning = $parent;
      } else {
        return $owning;
      }
    }
    throw new Error(`Walked too far`);
  }

  selectField(fieldName: string, details: FieldDetails = {}): string {
    const { selections } = details;
    const $op = this.getOperation();
    const $owningSS = this.owningSelectionSet();
    const alias = $owningSS.getFieldAlias(fieldName, details);
    const argTuples = details.args
      ? Object.entries(details.args).map(
          ([argName, $step]): [string, GraphQLArgumentValue] => [
            argName,
            {
              kind: "variable",
              name: $op.getVariableName(
                $step,
                "String!", // TODO: NEED PROPER VARIABLE TYPE!!
                argName,
              ),
            },
          ],
        )
      : [];
    this.selections.push({
      kind: "field",
      alias,
      fieldName,
      args: argTuples.length ? Object.fromEntries(argTuples) : undefined,
      selections,
    });
    return alias;
  }

  usedAliases = new Set<string>();
  fieldAliases = new Map<string, string>();
  protected getFieldAlias(fieldName: string, { args }: FieldDetails) {
    const signature = args
      ? `${fieldName}|${Object.entries(args)
          .map(([argName, $step]) => `${argName}:${$step.id}`)
          .join(",")}`
      : fieldName;
    const existing = this.fieldAliases.get(signature);
    if (existing) {
      return existing;
    }
    let alias = fieldName;
    let counter = 1;
    while (this.usedAliases.has(alias)) {
      alias = `${fieldName}${++counter}`;
    }
    this.usedAliases.add(alias);
    this.fieldAliases.set(signature, alias);
    return alias;
  }

  addSelection(selection: GraphQLSelection) {
    this.selections.push(selection);
  }

  optimize() {
    if (this.typeName) {
      this.getGraphQLParent().addSelection({
        kind: "inlineFragment",
        typeSpecifier: this.typeName,
        selections: this.selections,
      });
    } else {
      for (const selection of this.selections) {
        this.getGraphQLParent().addSelection(selection);
      }
    }
    return this.getParent();
  }

  execute(details: ExecutionDetails) {
    const { values, indexMap } = details;
    const v = values[0];
    return indexMap((i) => v.at(i));
  }
  // TODO: support `stream`
}
