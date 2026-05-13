import type { ExecutionDetails, GrafastResultsList } from "grafast";
import {
  access,
  exportAs,
  flagError,
  inspect,
  isAsyncIterable,
  Step,
} from "grafast";
import type {
  ArgumentNode,
  DirectiveNode,
  DocumentNode,
  ListTypeNode,
  NamedTypeNode,
  OperationDefinitionNode,
  SelectionNode,
  TypeNode,
  ValueNode,
  VariableDefinitionNode,
} from "graphql";
import { Kind, OperationTypeNode, print } from "graphql";
import { toe } from "graphql-toe";

import type {
  GraphQLArgumentValue,
  GraphQLDirective,
  GraphQLSelection,
} from "../interfaces.ts";
import type {
  GraphQLClient,
  GraphQLSchemaStep,
  OperationType,
} from "./graphqlSchema.ts";
import { GraphQLSelectionSetStep } from "./graphqlSelectionSet.ts";

const OPERATION_TYPE_LOOKUP = {
  query: OperationTypeNode.QUERY,
  mutation: OperationTypeNode.MUTATION,
  subscription: OperationTypeNode.SUBSCRIPTION,
};

interface GraphQLOperationVariable {
  name: string;
  typeString: string;
  depId: number;
}

/**
 * This step represents a single GraphQL operation (query, mutation,
 * subscription) and is the jumping off point for making selections.
 */
export class GraphQLOperationStep<
  TSchema,
  TOperationType extends OperationType,
> extends Step {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLOperationStep",
  };

  isSyncAndSafe = false;
  public readonly operationType: TOperationType;
  private variables: Record<string, GraphQLOperationVariable>;
  private selections: GraphQLSelection[];

  constructor(
    $schema: GraphQLSchemaStep<TSchema>,
    operationType: TOperationType,
  ) {
    super();
    this.addUnaryDependency($schema);
    this.operationType = operationType;
    this.variables = Object.create(null);
    this.selections = [];
  }

  getClient() {
    return this.getDep(0) as Step<GraphQLClient | null | undefined>;
  }

  // Convenience method
  getOperation(): GraphQLOperationStep<TSchema, TOperationType> {
    return this;
  }

  rootSelectionSet() {
    return this.cacheStep(
      "rootSelectionSet",
      "",
      () => new GraphQLSelectionSetStep(this.data()),
    );
  }

  variableNameByDepId = new Map<number, string>();
  public getVariableName($step: Step, typeString: string, hint: string) {
    if (!this.canAddDependency($step)) {
      throw new Error(
        `Invalid dependency chain: ${this} is not allowed to depend on ${$step}`,
      );
    }
    // TODO: it is unreasonable to assume this can be unary. We're going to
    // have to do variable batching or similar. Potentially we could do
    // excessive selection sets (one field per arg value) but that's more
    // complex.
    const depId = this.addUnaryDependency($step);
    const existing = this.variableNameByDepId.get(depId);
    if (existing) {
      return existing;
    }
    let name = hint;
    let counter = 1;
    while (this.variables[name]) {
      name = `${hint}${++counter}`;
    }
    this.variables[name] = {
      name,
      typeString,
      depId,
    };
    this.variableNameByDepId.set(depId, name);
    return name;
  }

  data() {
    return access(this, "data");
  }

  get(
    ...args: Parameters<GraphQLSelectionSetStep<TSchema, TOperationType>["get"]>
  ) {
    return this.rootSelectionSet().get(...args);
  }

  addSelection(selection: GraphQLSelection) {
    this.selections.push(selection);
  }

  async execute(details: ExecutionDetails): Promise<GrafastResultsList<any>> {
    const { values, indexMap, stream } = details;
    const client = values[0].unaryValue() as GraphQLClient | null | undefined;
    const { compiledDocument, variableNameByDepId } = this;
    if (!client) {
      return indexMap((i) => flagError(new Error("No GraphQL client passed")));
    }
    if (!compiledDocument) {
      return indexMap((i) =>
        flagError(new Error("Failed to construct document during optimize?")),
      );
    }
    // TypeScript alias to assert existence
    const document = compiledDocument;
    console.log(print(document));
    if (this.operationType === "subscription" && !stream) {
      return indexMap(() =>
        flagError(new Error("Must stream subscription operations")),
      );
    }

    const variableDepIdAndNames = [...variableNameByDepId.entries()];

    async function getResult(index: number) {
      const variableValues = Object.fromEntries(
        variableDepIdAndNames.map(([depId, name]) => [
          name,
          values[depId].at(index),
        ]),
      );

      const result = await client!.execute({ document, variableValues });

      if (isAsyncIterable(result)) {
        throw new Error("Incremental delivery is currently unsupported");
      }

      const data = toe(result);
      console.dir(data);

      return { data };
    }

    if (variableDepIdAndNames.every(([depId]) => !values[depId].isBatch)) {
      // All unary - execute once, use result for everything
      const result = getResult(0);
      return indexMap(() => result);
    }
    return indexMap(getResult);
  }

  private compiledDocument: DocumentNode | undefined;

  optimize() {
    // NOTE: It's important that we don't merge with other operations unless
    // their `inhibitOnNull` statuses for each variable match our own. We don't
    // want to inhibit ourself because some other query was inhibited.
    // e.g. `{userById(id: $userId)}` & `{organizationById(id: $orgId)}` can
    // only merge if neither $userId nor $orgId have inhibit on null.
    function makeType(typeString: string): TypeNode {
      if (typeString.endsWith("!")) {
        return {
          kind: Kind.NON_NULL_TYPE,
          type: makeType(typeString.substring(0, typeString.length - 1)) as
            | ListTypeNode
            | NamedTypeNode,
        };
      } else if (typeString.endsWith("]")) {
        if (!typeString.startsWith("[")) {
          throw new Error("Unexpected type");
        }
        return {
          kind: Kind.LIST_TYPE,
          type: makeType(typeString.substring(1, typeString.length - 1)),
        };
      } else {
        return {
          kind: Kind.NAMED_TYPE,
          name: {
            kind: Kind.NAME,
            value: typeString,
          },
        };
      }
    }
    function makeVariableDefinition(
      v: GraphQLOperationVariable,
    ): VariableDefinitionNode {
      return {
        kind: Kind.VARIABLE_DEFINITION,
        variable: {
          kind: Kind.VARIABLE,
          name: {
            kind: Kind.NAME,
            value: v.name,
          },
        },
        type: makeType(v.typeString),
      };
    }

    function makeArgumentValue(argument: GraphQLArgumentValue): ValueNode {
      if (argument.kind === "variable") {
        return {
          kind: Kind.VARIABLE,
          name: {
            kind: Kind.NAME,
            value: argument.name,
          },
        };
      } else {
        const never: never = argument;
        throw new Error(`Unsupported argument kind ${inspect(never)}`);
      }
    }
    function makeDirective(dir: GraphQLDirective): DirectiveNode {
      return {
        kind: Kind.DIRECTIVE,
        name: {
          kind: Kind.NAME,
          value: dir.name,
        },
        arguments: dir.args ? dir.args.map(makeArgumentValue) : undefined,
      };
    }
    function makeSelection(sel: GraphQLSelection): SelectionNode {
      if (sel.kind === "inlineFragment") {
        return {
          kind: Kind.INLINE_FRAGMENT,
          typeCondition: sel.typeSpecifier
            ? {
                kind: Kind.NAMED_TYPE,
                name: {
                  kind: Kind.NAME,
                  value: sel.typeSpecifier,
                },
              }
            : undefined,
          selectionSet: {
            kind: Kind.SELECTION_SET,
            selections: sel.selections.map(makeSelection),
          },
        };
      } else if (sel.kind === "field") {
        const { selections, fieldName, directives, alias, args } = sel;
        return {
          kind: Kind.FIELD,
          alias:
            alias == null || alias === fieldName
              ? undefined
              : { kind: Kind.NAME, value: alias },
          name: { kind: Kind.NAME, value: fieldName },
          arguments:
            args && Object.keys(args).length > 0
              ? Object.entries(args).map(
                  ([argName, value]): ArgumentNode => ({
                    kind: Kind.ARGUMENT,
                    name: {
                      kind: Kind.NAME,
                      value: argName,
                    },
                    value: makeArgumentValue(value),
                  }),
                )
              : undefined,
          selectionSet: selections
            ? {
                kind: Kind.SELECTION_SET,
                selections: selections.map(makeSelection),
              }
            : undefined,
          directives: directives ? directives.map(makeDirective) : undefined,
        };
      } else {
        throw new Error(`Unsupported selection type '${inspect(sel)}'`);
      }
    }
    const selections = this.selections.map(makeSelection);
    const vars = Object.values(this.variables);
    const operation: OperationDefinitionNode = {
      kind: Kind.OPERATION_DEFINITION,
      operation: OPERATION_TYPE_LOOKUP[this.operationType],
      selectionSet: {
        kind: Kind.SELECTION_SET,
        selections,
      },
      variableDefinitions: vars ? vars.map(makeVariableDefinition) : undefined,
    };
    this.compiledDocument = {
      kind: Kind.DOCUMENT,
      definitions: [operation],
    };
    return this;
  }
}

export function graphqlQuery($schema: GraphQLSchemaStep) {
  return new GraphQLOperationStep($schema, "query");
}
exportAs("@dataplan/graphql", graphqlQuery, "graphqlQuery");

export function graphqlMutation($schema: GraphQLSchemaStep) {
  return new GraphQLOperationStep($schema, "mutation");
}
exportAs("@dataplan/graphql", graphqlMutation, "graphqlMutation");
export function graphqlSubscription($schema: GraphQLSchemaStep) {
  return new GraphQLOperationStep($schema, "subscription");
}
exportAs("@dataplan/graphql", graphqlSubscription, "graphqlSubscription");
