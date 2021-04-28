import * as assert from "assert";
import { inspect } from "util";
import {
  GraphQLFieldResolver,
  GraphQLOutputType,
  GraphQLObjectType,
  defaultFieldResolver,
  isNonNullType,
  isListType,
} from "graphql";
// import { getAliasFromResolveInfo } from "graphql-parse-resolve-info";
import debugFactory from "debug";
import { establishAether } from "./establishAether";
import { Path } from "graphql/jsutils/Path";

const uid = ((): (() => number) => {
  let _uidCounter = 0;
  return function uid(): number {
    return ++_uidCounter;
  };
})();

const debug = debugFactory("crystal:resolvers");

function pathToPathIdentity(path: Path): string {
  return (
    (path.prev ? pathToPathIdentity(path.prev) : "") +
    `>${path.typename}.${path.key}`
  );
}

export const $$crystalWrapped = Symbol("crystalWrappedResolver");

/**
 * Given a `resolve` function, wraps the function so that it can perform the
 * `ResolveFieldValueCrystal` algorithm.
 *
 * @param resolve - The resolver function.
 */
export function crystalWrapResolve<
  TSource,
  TContext extends object,
  TArgs = { [argName: string]: any }
>(
  resolve: GraphQLFieldResolver<
    TSource,
    TContext,
    TArgs
  > = defaultFieldResolver,
): GraphQLFieldResolver<TSource, TContext, TArgs> {
  const realResolver = resolve || defaultFieldResolver;
  if (realResolver[$$crystalWrapped]) {
    throw Object.assign(
      new Error("ETOOMUCHBLING: this resolver is already wrapped in crystals."),
      { code: "ETOOMUCHBLING" },
    );
  }

  //const wrapResult = makeResultWrapper(type);
  /**
   * Implements the `ResolveFieldValueCrystal` algorithm.
   */
  const crystalResolver: GraphQLFieldResolver<
    TSource,
    TContext,
    TArgs
  > = async function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    source: any,
    argumentValues,
    context,
    info,
  ) {
    const parentObject: TSource | CrystalWrappedValue<any> = source;
    // Note: in the ResolveFieldValueCrystal algorithm it uses `document` and
    // `operationName`; however all it really needs is the `operation` and
    // `fragments`, so that's what we extract here.
    const {
      schema,
      fieldName,
      parentType,
      returnType,
      operation,
      fragments,
      variableValues,
      rootValue,
      path,
    } = info;
    const pathIdentity = pathToPathIdentity(path);
    // const alias = getAliasFromResolveInfo(info);
    debug(
      `👉 CRYSTAL RESOLVER (${info.parentType.name}.${
        info.fieldName
      } @ ${pathIdentity}); parent: ${inspect(parentObject, {
        colors: true,
      })}`,
    );
    const aether = establishAether({
      schema,
      operation,
      fragments,
      variableValues,
      context,
      rootValue,
    });
    const planId = aether.planIdByPathIdentity[pathIdentity];
    const plan = aether.plans[planId];
    if (plan == null) {
      const objectValue = isCrystalWrappedValue(parentObject)
        ? parentObject[$$data]
        : parentObject;
      return graphqlResolveFieldValue(
        parentType,
        objectValue,
        fieldName,
        argumentValues,
      );
    }
    const id = uid();
    const batch = aether.getBatch(
      pathIdentity,
      parentObject,
      variableValues,
      context,
      rootValue,
    );
    const crystalContext = batch.crystalContext;
    const plan = batch.plan;
    let parentCrystalObject: CrystalWrappedValue;
    if (isCrystalWrappedValue(parentObject)) {
      // Note: for the most optimal execution, `rootValue` passed to graphql
      // should be a crystal object, this allows using {crystalContext} across
      // the entire operation if plans are used everywhere. Even more optimised
      // would be if we can share the same {crystalContext} across multiple
      // `rootValue`s for multiple parallel executions (must be within the same
      // aether) - e.g. as a result of multiple identical subscription
      // operations.
      parentCrystalObject = parentObject;
    } else {
      // Note: we need to "fake" that the parent was a plan. Because we may have lots of resolvers all called for the same parent object, we use a map. This happens to mean that multiple values in the graph being the same object will be merged automatically.
      const parentPathIdentity = pathToPathIdentity(path.prev);
      const parentPlanId = aether.planIdByPathIdentity[parentPathIdentity];
      const parentPlan = aether.plans[parentPlanId];
      const parentId = aether.getValuePlanId(parentPlan, parentObject);
      const indexes: number[] = [];
      parentCrystalObject = newCrystalObject(
        parentPlan,
        parentPathIdentity,
        parentId,
        indexes,
        parentObject,
        crystalContext,
      );
    }
    const result = batch.getResult(parentCrystalObject);
    return crystalWrap(
      plan,
      returnType,
      parentCrystalObject,
      pathIdentity,
      id,
      result,
    );
  };
  Object.defineProperty(crystalResolver, $$crystalWrapped, {
    enumerable: false,
    configurable: false,
  });
  return crystalResolver;
}

/**
 * Given a `subscribe` function, wraps the function so that it can perform the
 * `ResolveFieldValueCrystal` algorithm.
 *
 * @param subscribe - The subscribe function.
 */
export function crystalWrapSubscribe<
  TSource,
  TContext extends object,
  TArgs = { [argName: string]: any }
>(
  subscribe: GraphQLFieldResolver<TSource, TContext, TArgs>,
): GraphQLFieldResolver<TSource, TContext, TArgs> {
  // For now wrapping subscribe and resolve are equivalent; but this might not
  // always be the case.
  return crystalWrapResolve(subscribe);
}

function crystalWrap(
  plan: Plan,
  returnType: GraphQLOutputType,
  parentCrystalObject: CrystalWrappedValue | undefined,
  pathIdentity: string,
  id: number,
  data: any,
  indexes: number[] = [],
): CrystalWrappedValue {
  if (data == null) {
    return null;
  }
  if (isNonNullType(returnType)) {
    return crystalWrap(
      plan,
      returnType.ofType,
      parentCrystalObject,
      pathIdentity,
      id,
      data,
    );
  }
  if (isListType(returnType)) {
    assert.ok(Array.isArray(data));
    const l = data.length;
    const result = new Array(l);
    for (let index = 0; index < l; index++) {
      const entry = data[index];
      const wrappedIndexes = [...indexes, index];
      result[index] = crystalWrap(
        plan,
        returnType.ofType,
        parentCrystalObject,
        pathIdentity,
        id,
        entry,
        wrappedIndexes,
      );
    }
    return result;
  }
  if (parentCrystalObject) {
    const crystalContext = parentCrystalObject[$$context];
    const idByPathIdentity = parentCrystalObject[$$idByPathIdentity];
    const indexesByPathIdentity = parentCrystalObject[$$indexesByPathIdentity];
    return newCrystalObject(
      plan,
      pathIdentity,
      id,
      indexes,
      data,
      crystalContext,
      idByPathIdentity,
      indexesByPathIdentity,
    );
  } else {
    return newCrystalObject(plan, pathIdentity, id, indexes, data);
  }
}
