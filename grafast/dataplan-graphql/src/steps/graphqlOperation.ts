import type {
  GrafastResultsList,
  GrafastValuesList,
  PromiseOrDirect,
  AccessStep,
} from "grafast";
import { access, ExecutableStep, exportAs } from "grafast";

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | Array<JSONValue>;

export class GraphQLOperationStep<
  TJSON extends JSONValue,
> extends ExecutableStep<TJSON> {
  static $$export = {
    moduleName: "@dataplan/graphql",
    exportName: "GraphQLOperationStep",
  };

  isSyncAndSafe = false;

  constructor(
    public readonly operationType: "query" | "mutation" | "subscription",
  ) {
    super();
  }

  get<TKey extends keyof TJSON>(
    key: TKey,
  ): AccessStep<
    TJSON extends { [key: string]: unknown } ? TJSON[TKey] : never
  > {
    return access(this, [key as string]);
  }

  execute(count: number, values: never[]): GrafastResultsList<TJSON> {
    const result: Array<PromiseOrDirect<TJSON>> = []; // new Array(count);
    for (let i = 0; i < count; i++) {
      result[i] = null as any;
    }
    return result;
  }
}

export function graphqlQuery<
  TJSON extends JSONValue,
>(): GraphQLOperationStep<TJSON> {
  return new GraphQLOperationStep<TJSON>("query");
}

exportAs("@dataplan/graphql", graphqlQuery, "graphqlQuery");

export function graphqlMutation<
  TJSON extends JSONValue,
>(): GraphQLOperationStep<TJSON> {
  return new GraphQLOperationStep<TJSON>("mutation");
}

exportAs("@dataplan/graphql", graphqlMutation, "graphqlMutation");

export function graphqlSubscription<
  TJSON extends JSONValue,
>(): GraphQLOperationStep<TJSON> {
  return new GraphQLOperationStep<TJSON>("subscription");
}

exportAs("@dataplan/graphql", graphqlSubscription, "graphqlSubscription");
