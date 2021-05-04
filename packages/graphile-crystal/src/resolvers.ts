import * as assert from "assert";
import chalk from "chalk";
import { inspect } from "util";
import {
  GraphQLFieldResolver,
  GraphQLOutputType,
  defaultFieldResolver,
  isNonNullType,
  isListType,
  isLeafType,
  getNamedType,
} from "graphql";
// import { getAliasFromResolveInfo } from "graphql-parse-resolve-info";
import debugFactory from "debug";
import { establishAether } from "./establishAether";
import { Path } from "graphql/jsutils/Path";
import { Plan, __ValuePlan } from "./plan";
import {
  CrystalObject,
  CrystalContext,
  $$idByPathIdentity,
  $$indexesByPathIdentity,
  $$crystalContext,
  $$data,
  $$id,
  Batch,
  $$pathIdentity,
  $$indexes,
} from "./interfaces";
import { uid, UniqueId, crystalPrint, compressedPathIdentity } from "./utils";
import { defer, Deferred } from "./deferred";
import { isDev } from "./dev";

const debug = debugFactory("crystal:resolvers");

function pathToPathIdentity(path: Path): string {
  // Skip over list keys.
  if (!path.typename) {
    assert.ok(
      path.prev,
      "Path has no `typename` and no `prev`; seems like an invalid Path?",
    );
    return pathToPathIdentity(path.prev);
  }
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
  TSource extends object | null | undefined,
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
    const parentObject: TSource | CrystalObject<any> = source;
    // Note: in the ResolveFieldValueCrystal algorithm it uses `document` and
    // `operationName`; however all it really needs is the `operation` and
    // `fragments`, so that's what we extract here.
    const {
      schema,
      // fieldName,
      // parentType,
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
      `👉 CRYSTAL RESOLVER (%s.%s @ %s); parent: %o`,
      info.parentType.name,
      info.fieldName,
      pathIdentity,
      isCrystalObject(parentObject)
        ? `${parentObject[$$pathIdentity]}.${parentObject[$$indexes].join(".")}`
        : parentObject,
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
    assert.ok(
      planId != null,
      `Could not find a plan id for path '${pathIdentity}'`,
    );
    const plan = aether.plans[planId];
    if (plan == null) {
      const objectValue = isCrystalObject(parentObject)
        ? parentObject[$$data]
        : parentObject;
      debug(
        "Calling real resolver for %s.%s with %o",
        info.parentType.name,
        info.fieldName,
        objectValue,
      );
      return realResolver(objectValue, argumentValues, context, info);
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
    let parentCrystalObject: CrystalObject<any>;
    if (isCrystalObject(parentObject)) {
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
      const parentPathIdentity = path.prev ? pathToPathIdentity(path.prev) : "";
      const parentPlanId = aether.planIdByPathIdentity[parentPathIdentity];
      assert.ok(
        parentPlanId != null,
        `Could not find a planId for (parent) path '${parentPathIdentity}'`,
      );
      const parentPlan = aether.plans[parentPlanId]; // TODO: assert that this is handled for us
      assert.ok(
        parentPlan instanceof __ValuePlan,
        "Expected parent field (which returned non-crystal object) to be a valuePlan)",
      );

      const parentId = aether.getValuePlanId(
        crystalContext,
        parentPlan,
        parentObject,
      );
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
    const result = await getBatchResult(batch, parentCrystalObject);
    debug(
      `👈 CRYSTAL RESOLVER %c (%s.%s @ %s); object %c; result: %o`,
      id,
      info.parentType.name,
      info.fieldName,
      pathIdentity,
      parentCrystalObject[$$id],
      result,
    );
    if (isLeafType(getNamedType(info.returnType))) {
      const valueForResolver: any = { [info.fieldName]: result };
      debug(
        "   Calling real resolver for %s.%s with %o",
        info.parentType.name,
        info.fieldName,
        valueForResolver,
      );
      return realResolver(valueForResolver, argumentValues, context, info);
    } else {
      const crystalResults = crystalWrap(
        crystalContext,
        plan,
        returnType,
        parentCrystalObject,
        pathIdentity,
        id,
        result,
      );
      return crystalResults;
    }
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
  TSource extends object | null | undefined,
  TContext extends object,
  TArgs = { [argName: string]: any }
>(
  subscribe: GraphQLFieldResolver<TSource, TContext, TArgs>,
): GraphQLFieldResolver<TSource, TContext, TArgs> {
  // For now wrapping subscribe and resolve are equivalent; but this might not
  // always be the case.
  return crystalWrapResolve(subscribe);
}

type CrystalWrapResult =
  | null
  | CrystalObject<any>
  | CrystalObjectMultidimensionalList;
type CrystalObjectMultidimensionalList = CrystalObjectMultidimensionalArray;
interface CrystalObjectMultidimensionalArray
  extends Array<CrystalObjectMultidimensionalArray | CrystalObject<any>> {}

function crystalWrap<TData>(
  crystalContext: CrystalContext,
  plan: Plan,
  returnType: GraphQLOutputType,
  parentCrystalObject: CrystalObject<any> | undefined,
  pathIdentity: string,
  id: UniqueId,
  data: TData,
  indexes: ReadonlyArray<number> = [],
): CrystalWrapResult {
  // This is an `any` because typing it is way too hard; it could be an infinitely nested list for example.
  if (data == null) {
    return null;
  }
  if (isNonNullType(returnType)) {
    return crystalWrap(
      crystalContext,
      plan,
      returnType.ofType,
      parentCrystalObject,
      pathIdentity,
      id,
      data,
    );
  }
  if (isListType(returnType)) {
    assert.ok(
      Array.isArray(data),
      `The field at '${pathIdentity}' returned a value incompatible with '${returnType.toString()}': '${inspect(
        data,
      )}'`,
    );
    const l = data.length;
    const result = new Array(l);
    for (let index = 0; index < l; index++) {
      const entry = data[index];
      const wrappedIndexes = [...indexes, index];
      result[index] = crystalWrap(
        crystalContext,
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
    return newCrystalObject(
      plan,
      pathIdentity,
      id,
      indexes,
      data,
      crystalContext,
      parentCrystalObject[$$idByPathIdentity],
      parentCrystalObject[$$indexesByPathIdentity],
    );
  } else {
    return newCrystalObject(
      plan,
      pathIdentity,
      id,
      indexes,
      data,
      crystalContext,
    );
  }
}

/**
 * Implements `NewCrystalObject`
 */
function newCrystalObject<TData>(
  plan: Plan,
  pathIdentity: string,
  id: UniqueId,
  indexes: ReadonlyArray<number>,
  data: TData,
  crystalContext: CrystalContext,
  idByPathIdentity: { [pathIdentity: string]: UniqueId | undefined } = {
    "": crystalContext.rootId,
  },
  indexesByPathIdentity: {
    [pathIdentity: string]: ReadonlyArray<number> | undefined;
  } = {
    "": [],
  },
): CrystalObject<TData> {
  const crystalObject: CrystalObject<TData> = {
    [$$pathIdentity]: pathIdentity,
    [$$id]: id,
    [$$data]: data,
    [$$indexes]: indexes, // Shortcut to $$indexesByPathIdentity[$$pathIdentity]
    [$$crystalContext]: crystalContext,
    [$$idByPathIdentity]: Object.freeze({
      ...idByPathIdentity,
      [pathIdentity]: id,
    }),
    [$$indexesByPathIdentity]: Object.freeze({
      ...indexesByPathIdentity,
      [pathIdentity]: indexes,
    }),
    // @ts-ignore
    toString() {
      const p = indexes.length ? `.${indexes.join(".")}` : ``;
      return chalk.bold.blue(
        `C(${compressedPathIdentity(pathIdentity)}${p}/${crystalPrint(id)})`,
      );
    },
  };
  if (isDev) {
    debug(`Constructed %s with data %o`, crystalObject, data);
  }
  return crystalObject;
}

export function isCrystalObject(input: any): input is CrystalObject<any> {
  return typeof input === "object" && input && $$data in input;
}

/**
 * Implements `GetBatchResult`.
 */
function getBatchResult(
  batch: Batch,
  parentCrystalObject: CrystalObject<any>,
): Deferred<any> {
  const deferred = defer();
  batch.entries.push([parentCrystalObject, deferred]);
  return deferred;
}
