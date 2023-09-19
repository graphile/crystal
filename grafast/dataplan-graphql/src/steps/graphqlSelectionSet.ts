import { ExecutableStep } from "grafast";
import { GraphQLOperationStep } from "./graphqlOperation.js";

export interface GraphQLDirective {
  name: string;
  arguments?: { [key: string]: any };
}

export interface GraphQLSelectionField {
  kind: "field";
  fieldName: string;
  alias?: string;
  directives: GraphQLDirective[];
  // TODO: CCN
  selections: GraphQLSelection[];
}

export interface GraphQLSelectionInlineFragment {
  kind: "inlineFragment";
  typeSpecifier: string | null;
  directives: GraphQLDirective[];
  // TODO: alias?
  selections: GraphQLSelection[];
}

export type GraphQLSelection =
  | GraphQLSelectionField
  | GraphQLSelectionInlineFragment;

type ArgsObject = { [key: string]: ExecutableStep | ArgsObject | ArgsList };
type ArgsList = ReadonlyArray<ExecutableStep | ArgsObject | ArgsList>;

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
  ) {
    super();
    this.operationStepId = $operation.id;
    this.isRoot = $parent == null;
    this.addDependency($parent ?? $operation);
  }

  getOperation() {
    return this.getStep(this.operationStepId);
  }

  get(
    key: name,
    args?: ArgsObject | null,
    options?: { alias?: string; directives?: ArgsObject },
  ) {
    return new GraphQLSelectFieldStep(this.getOperation(), this);
  }

  optimize() {
    return this.getDep(0);
  }

  execute(count: number, values: [any]) {
    return values[0];
  }

  // TODO: support `stream`
}
