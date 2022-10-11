import type {
  GraphQLAbstractType,
  GraphQLFieldResolver,
  GraphQLNullableType,
  GraphQLOutputType,
  GraphQLResolveInfo,
} from "graphql";
import {
  defaultTypeResolver,
  getNamedType,
  getNullableType,
  isAbstractType,
  isListType,
} from "graphql";

import type { __ItemStep, ObjectStep } from "../index.js";
import { context } from "../index.js";
import type {
  ExecutionExtra,
  GrafastResultsList,
  GrafastValuesList,
  PolymorphicData,
} from "../interfaces.js";
import { $$data } from "../interfaces.js";
import { polymorphicWrap } from "../polymorphic.js";
import type { PolymorphicStep } from "../step.js";
import { ExecutableStep, UnbatchedExecutableStep } from "../step.js";
import { isPromiseLike } from "../utils.js";

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
  return { data, context, resolveInfo };
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
  constructor(
    private resolver: GraphQLFieldResolver<any, any> & { displayName?: string },
    $plan: ExecutableStep,
    $args: ObjectStep,
    private resolveInfoBase: ResolveInfoBase,
    private returnContextAndResolveInfo = false,
  ) {
    super();
    this.planDep = this.addDependency($plan);
    this.argsDep = this.addDependency($args);
    this.contextDep = this.addDependency(context());
    this.variableValuesDep = this.addDependency(this.opPlan.variableValuesStep);
    this.rootValueDep = this.addDependency(this.opPlan.rootValueStep);
  }

  toStringMeta() {
    return this.resolver.displayName || this.resolver.name;
  }

  deduplicate(peers: GraphQLResolverStep[]): GraphQLResolverStep[] {
    return peers.filter((peer) => peer.resolver === this.resolver);
  }

  unbatchedExecute(
    extra: ExecutionExtra,
    source: any,
    args: any,
    context: any,
    variableValues: any,
    rootValue: any,
  ): any {
    const resolveInfo: GraphQLResolveInfo = Object.assign(
      Object.create(this.resolveInfoBase),
      {
        // TODO: add support for path
        variableValues,
        rootValue,
      },
    );
    const data = this.resolver(source, args, context, resolveInfo);
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
}

/** @internal */
export class GraphQLPolymorphicUnwrap extends UnbatchedExecutableStep {
  static $$export = {
    moduleName: "grafast",
    exportName: "GraphQLPolymorphicUnwrap",
  };
  public isSyncAndSafe = true;
  constructor($parent: ExecutableStep) {
    super();
    this.addDependency($parent);
  }
  execute(values: [GrafastValuesList<PolymorphicData>]) {
    return values[0].map((v) => (v ? v[$$data] : null));
  }
  unbatchedExecute(extra: ExecutionExtra, v: PolymorphicData) {
    return v ? v[$$data] : null;
  }
}

export function graphqlPolymorphicUnwrap($parent: ExecutableStep) {
  return new GraphQLPolymorphicUnwrap($parent);
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
          `GraphileInternalError<0a293e88-0f38-43f6-9179-f3ef9a720872>: Expected nullableType to be a list or abstract type, instead found ${nullableType}`,
        );
      }
      this.abstractType = nullableType;
    }
  }

  planForType() {
    return graphqlPolymorphicUnwrap(this);
  }

  listItem($item: __ItemStep<any>) {
    if (!this.nullableInnerType) {
      throw new Error(
        `GraphileInternalError<83f3533a-db8e-4eb9-9251-2a165ae6147b>: did not expect ${this}.listItem() to be called since it wasn't handling a list type`,
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
        "GraphileInternalError<5ea0892a-e9f6-479c-9b0b-2b09e46eecb6>: No abstract type? How can this be?",
      );
    }
    if (abstractType.resolveType) {
      return abstractType.resolveType(data, context, resolveInfo, abstractType);
    } else {
      return defaultTypeResolver(data, context, resolveInfo, abstractType);
    }
  }

  private actuallyWrapData(typeName: string | undefined, data: unknown) {
    if (typeName) {
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

  execute(values: [GrafastValuesList<any>]): GrafastResultsList<any> {
    if (this.abstractType) {
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
    } else if (this.nullableInnerType) {
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
        `GraphileInternalError<6a3ed701-6b53-41e6-9a64-fbea57c76ae7>: has to be abstract or list`,
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
  resolver: GraphQLFieldResolver<any, any>,
  $step: ExecutableStep,
  $args: ObjectStep,
  resolveInfoBase: ResolveInfoBase,
): ExecutableStep {
  const { returnType } = resolveInfoBase;
  const namedType = getNamedType(returnType);
  const isAbstract = isAbstractType(namedType);
  const nullableType = getNullableType(returnType);
  const $resolverResult = new GraphQLResolverStep(
    resolver,
    $step,
    $args,
    resolveInfoBase,
    isAbstract,
  );
  if (isAbstract) {
    return graphqlItemHandler($resolverResult, nullableType);
  } else {
    return $resolverResult;
  }
}
