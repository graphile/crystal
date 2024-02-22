import type {
  GraphQLAbstractType,
  GraphQLFieldResolver,
  GraphQLNullableType,
  GraphQLOutputType,
  GraphQLResolveInfo,
} from "graphql";
import * as graphql from "graphql";

import type { __ItemStep, ObjectStep } from "../index.js";
import { context, SafeError } from "../index.js";
import type {
  ExecutionExtra,
  GrafastResultsList,
  GrafastResultStreamList,
  GrafastValuesList,
  UnbatchedExecutionExtra,
} from "../interfaces.js";
import { polymorphicWrap } from "../polymorphic.js";
import type { PolymorphicStep } from "../step.js";
import { ExecutableStep, UnbatchedExecutableStep } from "../step.js";
import { isPromiseLike } from "../utils.js";

const {
  defaultTypeResolver,
  getNamedType,
  getNullableType,
  isAbstractType,
  isListType,
} = graphql;

type ResolveInfoBase = Omit<
  GraphQLResolveInfo,
  "path" | "rootValue" | "variableValues"
>;

function dcr(
  data: unknown, // but not a promise
  context: unknown,
  resolveInfo: GraphQLResolveInfo,
) {
  if (data == null) {
    return data;
  }
  if (Array.isArray(data) && data.some(isPromiseLike)) {
    return Promise.all(data).then((data) => ({ data, context, resolveInfo }));
  } else {
    return { data, context, resolveInfo };
  }
}

/**
 * Calls the given GraphQL resolver for each input - emulates GraphQL
 * resolution.
 *
 * @internal
 */
export class GraphQLResolverStep extends UnbatchedExecutableStep {
  static $$export = {
    moduleName: "grafast",
    exportName: "GraphQLResolverStep",
  };
  isSyncAndSafe = false;
  allowMultipleOptimizations = false;

  private planDep: number;
  private argsDep: number;
  private contextDep: number;
  private variableValuesDep: number;
  private rootValueDep: number;
  /** root fields can have null parent */
  private isNotRoot: boolean;
  constructor(
    private resolver:
      | (GraphQLFieldResolver<any, any> & { displayName?: string })
      | null
      | undefined,
    private subscriber:
      | (GraphQLFieldResolver<any, any> & { displayName?: string })
      | null
      | undefined,
    $plan: ExecutableStep,
    $args: ObjectStep,
    private resolveInfoBase: ResolveInfoBase,
    private returnContextAndResolveInfo = false,
  ) {
    super();
    this.planDep = this.addDependency($plan);
    this.argsDep = this.addDependency($args);
    this.contextDep = this.addDependency(context());
    this.variableValuesDep = this.addDependency(
      this.operationPlan.variableValuesStep,
    );
    this.rootValueDep = this.addDependency(this.operationPlan.rootValueStep);
    this.isNotRoot = ![
      this.operationPlan.queryType,
      this.operationPlan.mutationType,
      this.operationPlan.subscriptionType,
    ].includes(resolveInfoBase.parentType);
  }

  toStringMeta() {
    return (
      this.resolver?.displayName ||
      this.resolver?.name ||
      this.subscriber?.displayName ||
      this.subscriber?.name ||
      null
    );
  }

  deduplicate(peers: GraphQLResolverStep[]): GraphQLResolverStep[] {
    return peers.filter(
      (peer) =>
        peer.resolver === this.resolver && peer.subscriber === this.subscriber,
    );
  }

  unbatchedExecute(
    _extra: UnbatchedExecutionExtra,
    source: any,
    args: any,
    context: any,
    variableValues: any,
    rootValue: any,
  ): any {
    if (this.isNotRoot && source == null) {
      return source;
    }
    const resolveInfo: GraphQLResolveInfo = Object.assign(
      Object.create(this.resolveInfoBase),
      {
        variableValues,
        rootValue,
        path: {
          typename: this.resolveInfoBase.parentType.name,
          key: this.resolveInfoBase.fieldName,
          // ENHANCE: add full support for path (requires runtime indexes)
          prev: undefined,
        },
      },
    );
    const data = this.resolver?.(source, args, context, resolveInfo);
    if (this.returnContextAndResolveInfo) {
      if (isPromiseLike(data)) {
        return data.then((data) => dcr(data, context, resolveInfo));
      } else {
        return dcr(data, context, resolveInfo);
      }
    } else {
      return data;
    }
  }

  unbatchedStream(
    _extra: ExecutionExtra,
    source: any,
    args: any,
    context: any,
    variableValues: any,
    rootValue: any,
  ): any {
    if (this.isNotRoot) {
      return Promise.reject(new Error(`Invalid non-root subscribe`));
    }
    if (this.subscriber == null) {
      return Promise.reject(new Error(`Cannot subscribe to field`));
    }
    if (this.returnContextAndResolveInfo) {
      return Promise.reject(
        new Error(
          `Subscription with returnContextAndResolveInfo is not supported`,
        ),
      );
    }
    const resolveInfo: GraphQLResolveInfo = Object.assign(
      Object.create(this.resolveInfoBase),
      {
        // ENHANCE: add support for path
        variableValues,
        rootValue,
      },
    );
    const data = this.subscriber(source, args, context, resolveInfo);
    return data;
  }

  async stream(
    count: number,
    values: ReadonlyArray<GrafastValuesList<any>>,
    extra: ExecutionExtra,
  ): Promise<GrafastResultStreamList<any>> {
    const results = [];
    const depCount = this.dependencies.length;
    for (let i = 0; i < count; i++) {
      try {
        const tuple = [];
        for (let j = 0; j < depCount; j++) {
          tuple[j] = values[j][i];
        }
        results[i] = (this.unbatchedStream as any)(extra, ...tuple);
      } catch (e) {
        results[i] = e instanceof Error ? (e as never) : Promise.reject(e);
      }
    }
    return results;
  }
}

/** @internal */
export class GraphQLItemHandler
  extends ExecutableStep
  implements PolymorphicStep
{
  static $$export = {
    moduleName: "grafast",
    exportName: "GraphQLItemHandler",
  };
  private abstractType?: GraphQLAbstractType;
  private nullableInnerType: (GraphQLNullableType & GraphQLOutputType) | null =
    null;
  public isSyncAndSafe = false;
  constructor(
    $parent: ExecutableStep,
    nullableType: GraphQLNullableType & GraphQLOutputType,
  ) {
    super();
    this.addDependency($parent);
    if (isListType(nullableType)) {
      this.nullableInnerType = nullableType.ofType;
    } else {
      if (!isAbstractType(nullableType)) {
        throw new Error(
          `GrafastInternalError<0a293e88-0f38-43f6-9179-f3ef9a720872>: Expected nullableType to be a list or abstract type, instead found ${nullableType}`,
        );
      }
      this.abstractType = nullableType;
    }
  }

  planForType() {
    return this;
  }

  listItem($item: __ItemStep<any>) {
    if (!this.nullableInnerType) {
      throw new Error(
        `GrafastInternalError<83f3533a-db8e-4eb9-9251-2a165ae6147b>: did not expect ${this}.listItem() to be called since it wasn't handling a list type`,
      );
    }
    return graphqlItemHandler($item, this.nullableInnerType);
  }

  /**
   * Akin to graphql-js' completeAbstractValue... but just the typeName
   * resolution part.
   */
  private figureOutTheTypeOf(
    data: unknown,
    context: unknown,
    resolveInfo: GraphQLResolveInfo,
  ) {
    const abstractType = this.abstractType;
    if (!abstractType) {
      throw new Error(
        "GrafastInternalError<5ea0892a-e9f6-479c-9b0b-2b09e46eecb6>: No abstract type? How can this be?",
      );
    }
    if (abstractType.resolveType != null) {
      return abstractType.resolveType(data, context, resolveInfo, abstractType);
    } else {
      return defaultTypeResolver(data, context, resolveInfo, abstractType);
    }
  }

  private actuallyWrapData(typeName: string | undefined, data: unknown) {
    if (typeName !== undefined) {
      return polymorphicWrap(typeName, data);
    } else {
      return new Error("Could not determine type of data");
    }
  }

  private polymorphicWrapData(
    data: unknown, // but not a promise
    context: unknown,
    resolveInfo: GraphQLResolveInfo,
  ) {
    if (data == null) {
      return null;
    }
    const typeName = this.figureOutTheTypeOf(data, context, resolveInfo);
    if (isPromiseLike(typeName)) {
      return typeName.then((name) => this.actuallyWrapData(name, data));
    } else {
      return this.actuallyWrapData(typeName, data);
    }
  }

  wrapListData(
    data: unknown,
    context: unknown,
    resolveInfo: GraphQLResolveInfo,
  ) {
    if (data == null) {
      return null;
    }
    if (!Array.isArray(data)) {
      console.warn(`${this}: data wasn't an array, so we're returning null`);
      return null;
    }
    return data.map((data) => dcr(data, context, resolveInfo));
  }

  execute(
    _count: number,
    values: [GrafastValuesList<any>],
  ): GrafastResultsList<any> {
    if (this.abstractType !== undefined) {
      return values[0].map((data) => {
        if (data == null) {
          return data;
        }
        if (isPromiseLike(data.data)) {
          return data.data.then((resolvedData: unknown) =>
            this.polymorphicWrapData(
              resolvedData,
              data.context,
              data.resolveInfo,
            ),
          );
        } else {
          return this.polymorphicWrapData(
            data.data,
            data.context,
            data.resolveInfo,
          );
        }
      });
    } else if (this.nullableInnerType != null) {
      return values[0].map((d) => {
        if (d == null) {
          return null;
        }
        const { data, context, resolveInfo } = d;
        if (isPromiseLike(data)) {
          return data.then((data) =>
            this.wrapListData(data, context, resolveInfo),
          );
        } else {
          return this.wrapListData(data, context, resolveInfo);
        }
      });
    } else {
      throw new Error(
        `GrafastInternalError<6a3ed701-6b53-41e6-9a64-fbea57c76ae7>: has to be abstract or list`,
      );
    }
  }
}

export function graphqlItemHandler(
  $item: ExecutableStep,
  nullableType: GraphQLNullableType & GraphQLOutputType,
) {
  return new GraphQLItemHandler($item, nullableType);
}

/**
 * Emulates what GraphQL does when calling a resolver, including handling of
 * polymorphism.
 *
 * @internal
 */
export function graphqlResolver(
  resolver: GraphQLFieldResolver<any, any> | null | undefined,
  subscriber: GraphQLFieldResolver<any, any> | null | undefined,
  $step: ExecutableStep,
  $args: ObjectStep,
  resolveInfoBase: ResolveInfoBase,
): ExecutableStep {
  const { returnType } = resolveInfoBase;
  const namedType = getNamedType(returnType);
  const isAbstract = isAbstractType(namedType);
  const $resolverResult = new GraphQLResolverStep(
    resolver,
    subscriber,
    $step,
    $args,
    resolveInfoBase,
    isAbstract,
  );
  if (isAbstract) {
    if (subscriber != null) {
      throw new SafeError(
        `GraphQL subscribe function emulation currently doesn't support polymorphism`,
      );
    }
    const nullableType = getNullableType(returnType);
    return graphqlItemHandler($resolverResult, nullableType);
  } else {
    return $resolverResult;
  }
}
