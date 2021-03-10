import { inspect } from "util";
import {
  GraphQLFieldResolver,
  defaultFieldResolver,
  GraphQLOutputType,
  GraphQLNonNull,
  GraphQLList,
  isScalarType,
  GraphQLFieldConfig,
  GraphQLResolveInfo,
} from "graphql";
import { assert } from "console";
import {
  GraphQLContext,
  CrystalResult,
  PathIdentity,
  $$batch,
  $$data,
  $$path,
} from "./interfaces";
import { getDoc } from "./doc";
import { Batch } from "./batch";

export const makeCrystalObjectExtension = () => ({});
export const makeCrystalObjectFieldExtension = () => ({});

export const $$crystalWrappedResolver = Symbol("crystalWrappedResolver");

function isPromise<T>(
  possiblyPromise: T | Promise<T>,
): possiblyPromise is Promise<T> {
  return (
    typeof possiblyPromise === "object" &&
    possiblyPromise &&
    "then" in possiblyPromise &&
    typeof possiblyPromise.then === "function"
  );
}
function identityWrapper<T>(plan: any, arg: T): T {
  return arg;
}

interface WrapMeta {
  batch: Batch;
  path: PathIdentity;
}

function graphileWrap(
  { batch, path }: WrapMeta,
  data: any,
): CrystalResult | null {
  // Short-circuit nulls, undefineds, NaNs, etc
  if (data == null || Number.isNaN(data)) {
    return null;
  }
  return {
    [$$data]: data,
    [$$batch]: batch,
    [$$path]: path,
  };
}

function graphileWrap1(meta: WrapMeta, data: any) {
  // Short-circuit nulls, undefineds, NaNs, etc
  if (data == null || Number.isNaN(data)) {
    return null;
  }
  const list = Array.isArray(data) ? data : [data];
  return list.map((entry) => graphileWrap(meta, entry));
}

function graphileWrap2(meta: WrapMeta, data: any) {
  // Short-circuit nulls, undefineds, NaNs, etc
  if (data == null || Number.isNaN(data)) {
    return null;
  }
  const list = Array.isArray(data) ? data : [data];
  return list.map((entry) => graphileWrap1(meta, entry));
}

function graphileWrapN(listDepth: number) {
  if (listDepth <= 0) {
    return graphileWrap;
  } else {
    return (meta: WrapMeta, data: any): any => {
      // Short-circuit nulls, undefineds, NaNs, etc
      if (data == null || Number.isNaN(data)) {
        return null;
      }
      const list = Array.isArray(data) ? data : [data];
      return list.map((entry) => graphileWrapN(listDepth - 1)(meta, entry));
    };
  }
}

export function makeCrystalWrapResolver() {
  // Cached on a per-schema basis, so no need for a WeakMap
  const typeToWrapperMap = new Map<GraphQLOutputType, any>();

  function makeResultWrapper(
    type: GraphQLOutputType,
  ): (meta: WrapMeta, data: any) => any {
    const wrapper = typeToWrapperMap.get(type);
    if (wrapper) {
      return wrapper;
    }

    // Unwrap type
    let unwrappedType = type;
    let listDepth = 0;
    while (true) {
      if (unwrappedType instanceof GraphQLNonNull) {
        unwrappedType = unwrappedType.ofType;
      } else if (unwrappedType instanceof GraphQLList) {
        listDepth++;
        unwrappedType = unwrappedType.ofType;
      } else {
        break;
      }
    }

    // This should be a named type now.
    assert(
      unwrappedType.name,
      "Expected type to be a named type after unwrapping all GraphQLNonNull and GraphQLList elements, but received unnamed type.",
    );

    let newWrapper: any;

    if (isScalarType(unwrappedType)) {
      // We never wrap resolver results of scalars
      newWrapper = identityWrapper;
    } else {
      switch (listDepth) {
        case 0:
          newWrapper = graphileWrap;
          break;
        case 1:
          newWrapper = graphileWrap1;
          break;
        case 2:
          newWrapper = graphileWrap2;
          break;
        default:
          newWrapper = graphileWrapN(listDepth);
      }
    }
    typeToWrapperMap.set(type, newWrapper);
    return newWrapper;
  }

  return function crystalWrapResolver<
    TSource,
    TContext extends object,
    TArgs = { [argName: string]: any }
  >(
    type: GraphQLOutputType,
    resolve: GraphQLFieldResolver<
      TSource,
      TContext,
      TArgs
    > = defaultFieldResolver,
  ): GraphQLFieldResolver<TSource, TContext, TArgs> {
    const realResolver = resolve || defaultFieldResolver;

    const wrapResult = makeResultWrapper(type);
    const crystalResolver: GraphQLFieldResolver<
      TSource,
      TContext,
      TArgs
    > = async function (graphileParent: any, args, context, info) {
      console.log(
        `👉 CRYSTAL RESOLVER (${info.parentType.name}.${
          info.fieldName
        }); parent data: ${inspect(graphileParent?.[$$data], {
          colors: true,
        })}`,
      );
      // TODO: this function should not be async; it may be able to resolve sync sometimes.
      const executionResultOrPromise = executePlanFromResolver(
        graphileParent,
        args,
        context,
        info,
      );

      const executionResult = await executionResultOrPromise;
      const {
        [$$data]: data,
        [$$batch]: batch,
        [$$path]: path,
      } = executionResult;
      // Default resolver expects the data to be on a field with the same name; adhere to that.
      const fakeParent = { [info.fieldName]: data };
      const result = await realResolver(fakeParent as any, args, context, info);
      const wrappedResult = wrapResult({ batch, path }, result);
      console.log(
        `👈 CRYSTAL RESOLVER(${info.parentType.name}.${
          info.fieldName
        }); result data: ${inspect(wrappedResult?.[$$data], {
          colors: true,
        })}`,
      );
      return wrappedResult;
    };
    Object.defineProperty(crystalResolver, $$crystalWrappedResolver, {
      enumerable: false,
      configurable: false,
    });
    return crystalResolver;
  };
}

/**
 * Called from each GraphQL resolver; this tracks down (or creates) the plan
 * for this specific field, executes it, and returns the result (which should
 * be data the resolver requires).
 *
 * @remarks
 * Called from `graphileWrapResolver`.
 *
 * MUST run synchronously, otherwise we might not batch correctly.
 */
function executePlanFromResolver(
  parent: unknown,
  args: { [key: string]: any },
  context: GraphQLContext,
  info: GraphQLResolveInfo,
): CrystalResult | Promise<CrystalResult> {
  const doc = getDoc(info);
  const aether = doc.getAether(context, info);
  const batch = aether.getBatch(parent, args, context, info);
  return batch.getResultFor(parent, info);
}
