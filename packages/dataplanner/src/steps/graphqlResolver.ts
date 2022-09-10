import {
  defaultTypeResolver,
  getNamedType,
  getNullableType,
  GraphQLAbstractType,
  GraphQLFieldResolver,
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

export class Poly extends ExecutableStep implements PolymorphicStep {
  isSyncAndSafe = false;
  constructor(
    $parent: ExecutableStep,
    private abstractType: GraphQLAbstractType,
  ) {
    super();
    this.addDependency($parent);
  }
  planForType(objectType: GraphQLObjectType) {
    return polymorphicUnwrap(this);
  }
  execute(values: CrystalValuesList<any>) {
    return values[0];
  }
}

/**
 * Calls the given GraphQL resolver for each input - emulates GraphQL
 * resolution.
 *
 * @internal
 */
export class GraphQLResolverStep
  extends ExecutableStep
  implements PolymorphicStep
{
  static $$export = {
    moduleName: "dataplanner",
    exportName: "GraphQLResolverStep",
  };
  isSyncAndSafe = false;
  allowMultipleOptimizations = false;

  private planDep: number;
  private argsDep: number;
  private contextDep: number;
  private abstractType?: GraphQLAbstractType;
  private abstractDepth = 0;
  constructor(
    private resolver: GraphQLFieldResolver<any, any> & { displayName?: string },
    $plan: ExecutableStep,
    $args: ObjectStep,
    fieldType: GraphQLOutputType,
  ) {
    super();
    this.planDep = this.addDependency($plan);
    this.argsDep = this.addDependency($args);
    this.contextDep = this.addDependency(context());
    const namedType = getNamedType(fieldType);
    if (isAbstractType(namedType)) {
      this.abstractType = namedType;
      let t: GraphQLOutputType = fieldType;
      while ((t = getNullableType(t)) && isListType(t)) {
        this.abstractDepth++;
        t = t.ofType;
      }
      if (this.abstractDepth > 1) {
        throw new Error(
          "We don't support lists of lists of abstract types (or deeper)",
        );
      }
    }
  }

  toStringMeta() {
    return this.resolver.displayName || this.resolver.name;
  }

  deduplicate(peers: GraphQLResolverStep[]): GraphQLResolverStep[] {
    return peers.filter((peer) => peer.resolver === this.resolver);
  }

  planForType(objectType: GraphQLObjectType) {
    return polymorphicUnwrap(this);
  }

  listItem($item: __ItemStep<any>) {
    if (this.abstractType) {
      return new Poly($item, this.abstractType);
    } else {
      return $item;
    }
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

  private foo(
    data: unknown, // but not a promise
    context: unknown,
    resolveInfo: GraphQLResolveInfo,
  ) {
    // Need to polymorphicWrap the data
    if (isPromiseLike(data)) {
      return data.then((data) =>
        this.polymorphicWrapData(data, context, resolveInfo),
      );
    } else {
      return this.polymorphicWrapData(data, context, resolveInfo);
    }
  }

  execute(values: [CrystalValuesList<any>]): CrystalResultsList<any> {
    return values[this.planDep].map((source, i) => {
      try {
        const args = values[this.argsDep][i];
        const context = values[this.contextDep][i];
        const resolveInfo = makeResolveInfo();
        const data = this.resolver(source, args, context, resolveInfo);
        if (this.abstractType) {
          if (this.abstractDepth > 0) {
            if (isPromiseLike(data)) {
              return data.then((list) =>
                Array.isArray(list)
                  ? list.map((data) => this.foo(data, context, resolveInfo))
                  : null,
              );
            } else {
              return Array.isArray(data)
                ? data.map((data) => this.foo(data, context, resolveInfo))
                : null;
            }
          } else {
            return this.foo(data, context, resolveInfo);
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

/**
 * Emulates what GraphQL does when calling a resolver.
 *
 * @internal
 */
export function graphqlResolver(
  resolver: GraphQLFieldResolver<any, any>,
  $plan: ExecutableStep,
  $args: ObjectStep,
  fieldType: GraphQLOutputType,
): GraphQLResolverStep {
  return new GraphQLResolverStep(resolver, $plan, $args, fieldType);
}

class PolymorphicUnwrap extends ExecutableStep {
  public isSyncAndSafe = true;
  constructor($parent: ExecutableStep) {
    super();
    this.addDependency($parent);
  }
  execute(values: CrystalValuesList<[PolymorphicData]>) {
    return values.map(([v]) => v[$$data]);
  }
}

function polymorphicUnwrap($parent: ExecutableStep) {
  return new PolymorphicUnwrap($parent);
}
