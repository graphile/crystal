import {
  defaultTypeResolver,
  getNamedType,
  getNullableType,
  GraphQLAbstractType,
  GraphQLFieldResolver,
  GraphQLNamedType,
  GraphQLNullableType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLResolveInfo,
  isAbstractType,
  isListType,
} from "graphql";

import type { ObjectStep, __ItemStep } from "../index.js";
import { context } from "../index.js";
import {
  $$data,
  CrystalResultsList,
  CrystalValuesList,
  PolymorphicData,
} from "../interfaces.js";
import { ExecutableStep, PolymorphicStep } from "../step.js";
import { polymorphicWrap } from "../polymorphic.js";
import { isPromiseLike } from "../utils.js";

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
export class GraphQLResolverStep extends ExecutableStep {
  static $$export = {
    moduleName: "dataplanner",
    exportName: "GraphQLResolverStep",
  };
  isSyncAndSafe = false;
  allowMultipleOptimizations = false;

  private planDep: number;
  private argsDep: number;
  private contextDep: number;
  constructor(
    private resolver: GraphQLFieldResolver<any, any> & { displayName?: string },
    $plan: ExecutableStep,
    $args: ObjectStep,
    private returnContextAndResolveInfo = false,
  ) {
    super();
    this.planDep = this.addDependency($plan);
    this.argsDep = this.addDependency($args);
    this.contextDep = this.addDependency(context());
  }

  toStringMeta() {
    return this.resolver.displayName || this.resolver.name;
  }

  deduplicate(peers: GraphQLResolverStep[]): GraphQLResolverStep[] {
    return peers.filter((peer) => peer.resolver === this.resolver);
  }

  execute(values: [CrystalValuesList<any>]): CrystalResultsList<any> {
    return values[this.planDep].map((source, i) => {
      try {
        const args = values[this.argsDep][i];
        const context = values[this.contextDep][i];
        const resolveInfo = makeResolveInfo();
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
      } catch (e) {
        return Promise.reject(e);
      }
    });
  }
}

function makeResolveInfo(): GraphQLResolveInfo {
  // TODO: at least fake _some_ of ResolveInfo!
  return new Proxy(Object.create(null), {
    get(target, p) {
      throw new Error(
        `GraphileInternalError<0d3f1e5e-617b-41ea-95c2-e86370e9a2d4>: DataPlanner doesn't currently implement the '${String(
          p,
        )}' field on GraphQLResolveInfo, sorry!`,
      );
    },
  });
}

class PolymorphicUnwrap extends ExecutableStep {
  public isSyncAndSafe = true;
  constructor($parent: ExecutableStep) {
    super();
    this.addDependency($parent);
  }
  execute(values: [CrystalValuesList<PolymorphicData>]) {
    return values[0].map((v) => v[$$data]);
  }
}

function polymorphicUnwrap($parent: ExecutableStep) {
  return new PolymorphicUnwrap($parent);
}

class GraphQLItemHandler extends ExecutableStep implements PolymorphicStep {
  private abstractType?: GraphQLAbstractType;
  private abstractDepth = 0;
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

  planForType(objectType: GraphQLObjectType) {
    return polymorphicUnwrap(this);
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
      return Promise.reject(new Error("Could not determine type of data"));
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

  execute(values: [CrystalValuesList<any>]): CrystalResultsList<any> {
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

function graphqlItemHandler(
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
  $plan: ExecutableStep,
  $args: ObjectStep,
  fieldType: GraphQLOutputType,
): ExecutableStep {
  const namedType = getNamedType(fieldType);
  const isAbstract = isAbstractType(namedType);
  const nullableType = getNullableType(fieldType);
  const $resolverResult = new GraphQLResolverStep(
    resolver,
    $plan,
    $args,
    isAbstract,
  );
  if (isAbstract) {
    return graphqlItemHandler($resolverResult, nullableType);
  } else {
    return $resolverResult;
  }
}
