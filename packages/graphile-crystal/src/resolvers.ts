/* eslint-disable @typescript-eslint/ban-types */
import chalk from "chalk";
import debugFactory from "debug";
import type { GraphQLFieldResolver, GraphQLResolveInfo } from "graphql";
import { defaultFieldResolver } from "graphql";
import type { Path } from "graphql/jsutils/Path";

import type { Aether } from "./aether";
import { CrystalError, populateValuePlan } from "./aether";
import * as assert from "./assert";
import { ROOT_PATH } from "./constants";
import { crystalPrint, crystalPrintPathIdentity } from "./crystalPrint";
import type { Deferred } from "./deferred";
import { defer } from "./deferred";
import { establishAether } from "./establishAether";
import type { Batch, CrystalContext, CrystalObject } from "./interfaces";
import { $$data } from "./interfaces";
import {
  $$concreteType,
  $$crystalContext,
  $$id,
  $$pathIdentity,
  $$planResults,
} from "./interfaces";
import type { PlanResults } from "./planResults";
import { __ValuePlan } from "./plans";
import type { UniqueId } from "./utils";
import { ROOT_VALUE_OBJECT, uid } from "./utils";

const debug = debugFactory("crystal:resolvers");
const debugVerbose = debug.extend("verbose");

function pathToPathIdentity(initialPath: Path): string {
  /**
   * We're building the pathIdentity from the end backwards, so this represents
   * the tail.
   */
  let tailPathIdentity = "";
  let path: Path | undefined = initialPath;
  while (path != null) {
    if (path.typename) {
      tailPathIdentity = `>${path.typename}.${path.key}${tailPathIdentity}`;
    } else {
      // List keys become `[]`
      tailPathIdentity = `[]${tailPathIdentity}`;
    }
    path = path.prev;
  }
  return `${ROOT_PATH}${tailPathIdentity}`;
}

export const $$crystalWrapped = Symbol("crystalWrappedResolver");

export interface CrystalWrapDetails<
  T extends GraphQLFieldResolver<any, any> = GraphQLFieldResolver<any, any>,
> {
  original: T;
  isSubscribe: boolean;
}

export function isCrystalWrapped<T>(
  t: T,
): t is T & { [$$crystalWrapped]: CrystalWrapDetails } {
  return typeof t === "function" && $$crystalWrapped in t;
}

const getAetherFromResolver = <TContext extends object>(
  context: TContext,
  info: GraphQLResolveInfo,
) => {
  // Note: in the ResolveFieldValueCrystal algorithm it uses `document` and
  // `operationName`; however all it really needs is the `operation` and
  // `fragments`, so that's what we extract here.
  const {
    schema,
    // fieldName,
    operation,
    fragments,
    variableValues,
    rootValue,
  } = info;
  // const alias = getAliasFromResolveInfo(info);
  const aether = establishAether({
    schema,
    operation,
    fragments,
    variableValues,
    context,
    rootValue,
  });
  return aether;
};

function makeParentCrystalObject(
  batch: Batch,
  info: GraphQLResolveInfo,
  pathIdentity: string,
  parentObject: any,
): CrystalObject {
  const { path } = info;
  // TODO: we're not actually using id below
  const crystalContext = batch.crystalContext;
  if (!path.prev) {
    // Special workaround for the root object.
    return crystalContext.rootCrystalObject;
  } else {
    // TODO: I think using path.prev here is a bug; should it be the first
    // path.prev that has a type name? It happens to work currently because we
    // only use it at the root, but if we were starting crystal resolution on a
    // field of something returned from a list field things may be different.
    const parentPathIdentity = path.prev
      ? pathToPathIdentity(path.prev)
      : ROOT_PATH;
    const { crystalContext } = batch;
    const { aether } = crystalContext;
    const parentPlanId =
      aether.itemPlanIdByFieldPathIdentity[parentPathIdentity];
    if (parentPlanId == null) {
      throw new Error(
        `Could not find a planId for (parent) path '${parentPathIdentity}'`,
      );
    }
    const parentPlan = aether.dangerouslyGetPlan(parentPlanId); // TODO: assert that this is handled for us
    if (!(parentPlan instanceof __ValuePlan)) {
      throw new Error(
        `Expected parent field (which returned non-crystal object) to be a __ValuePlan, instead found ${parentPlan})`,
      );
    }

    // Note: we need to "fake" that the parent was a plan. Because we may
    // have lots of resolvers all called for the same parent object, we use a
    // map. This happens to mean that multiple values in the graph being the
    // same object will be merged automatically.
    const valueId = aether.getValuePlanId(
      crystalContext,
      parentPlan,
      parentObject,
      pathIdentity,
    );

    // We don't really care about indexes, it's just for debugging. Skipping
    // for now.
    const indexes: ReadonlyArray<number> = []; //pathToIndexes(path);

    const parentPlanResults = crystalContext.rootCrystalObject[$$planResults];
    const { parentType } = info;

    const parentCrystalObject = newCrystalObject(
      parentPathIdentity,
      parentType.name,
      valueId,
      crystalContext,
      parentPlanResults,
    );

    populateValuePlan(parentPlan, parentCrystalObject, parentObject, "parent");

    debugVerbose(
      "👉  Created a new crystal object to represent the parent of %p: %c (results: %c)",
      pathIdentity,
      parentCrystalObject,
      parentPlanResults,
    );
    return parentCrystalObject;
  }
}

function crystalWrapResolveOrSubscribe<
  TSource extends object | null | undefined,
  TContext extends object,
  TArgs = { [argName: string]: any },
>(
  realResolver: GraphQLFieldResolver<TSource, TContext, TArgs> | undefined,
  isSubscribe = false,
): GraphQLFieldResolver<TSource, TContext, TArgs> {
  if (realResolver?.[$$crystalWrapped]) {
    throw Object.assign(
      new Error("ETOOMUCHBLING: this resolver is already wrapped in crystals."),
      { code: "ETOOMUCHBLING" },
    );
  }
  const userSpecifiedResolver =
    realResolver === defaultFieldResolver ? undefined : realResolver;

  //const wrapResult = makeResultWrapper(type);
  /**
   * Implements the `ResolveFieldValueCrystal` algorithm.
   */
  const crystalResolver: GraphQLFieldResolver<TSource, TContext, TArgs> =
    function (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      source: any,
      argumentValues,
      context,
      info,
    ) {
      const parentObject: Exclude<TSource, null | undefined> | CrystalObject =
        source ?? ROOT_VALUE_OBJECT;
      let possiblyParentCrystalObject: CrystalObject | null = null;

      // Note: for the most optimal execution, `rootValue` passed to graphql
      // should be a crystal object, this allows using {crystalContext} across
      // the entire operation if plans are used everywhere. Even more optimised
      // would be if we can share the same {crystalContext} across multiple
      // `rootValue`s for multiple parallel executions (must be within the same
      // aether) - e.g. as a result of multiple identical subscription
      // operations.
      if (isCrystalObject(parentObject)) {
        const fieldAlias = info.path.key;
        if (fieldAlias in parentObject[$$data]) {
          // Short-circuit execution - we already have results
          return parentObject[$$data][fieldAlias];
        }
        possiblyParentCrystalObject = parentObject;
      }

      const aether = possiblyParentCrystalObject
        ? possiblyParentCrystalObject[$$crystalContext].aether
        : getAetherFromResolver(context, info);
      const pathIdentity = isSubscribe
        ? ROOT_PATH
        : possiblyParentCrystalObject != null
        ? aether.pathIdentityByParentPathIdentity[
            possiblyParentCrystalObject[$$pathIdentity]
          ][info.path.typename!][info.path.key]
        : pathToPathIdentity(info.path);
      const isUnplanned =
        aether.isUnplannedByPathIdentity[pathIdentity] === true;

      // IMPORTANT: there must be no `await` between here and `getBatchResult`.
      /* 👇👇👇👇👇 NO AWAIT ALLOWED BELOW HERE 👇👇👇👇👇 */
      const batch =
        aether.batchByPathIdentity[pathIdentity] ??
        aether.makeBatch(
          pathIdentity,
          info.returnType,
          possiblyParentCrystalObject,
          info.variableValues,
          context,
          info.rootValue,
        );
      const parentCrystalObject =
        possiblyParentCrystalObject ??
        makeParentCrystalObject(batch, info, pathIdentity, parentObject);
      const resultPromise = getBatchResult(batch, parentCrystalObject);
      /* 👆👆👆👆👆 NO AWAIT ALLOWED ABOVE HERE 👆👆👆👆👆 */

      if (debugVerbose.enabled) {
        resultPromise.then((result) => {
          debugVerbose(
            `👈 %p/%c for %s; result: %c`,
            pathIdentity,
            parentCrystalObject[$$id],
            parentCrystalObject,
            result,
          );
        });
      }
      if (userSpecifiedResolver != null) {
        // At this point, Aether will already have performed the relevant
        // checks to ensure this is safe to do. The values returned through
        // here must never be CrystalObjects (or lists thereof).
        return resultPromise.then((result) => {
          if (debugVerbose.enabled) {
            debugVerbose(
              "   Calling real resolver for %s.%s with %o",
              info.parentType.name,
              info.fieldName,
              result,
            );
          }
          return userSpecifiedResolver(result, argumentValues, context, info);
        });
      } else if (isUnplanned) {
        // If the field is unplanned then we want the default resolver to
        // extract the relevant property.
        return resultPromise.then((result) =>
          defaultFieldResolver(result, argumentValues, context, info),
        );
      } else {
        // In the case of planned leaf fields this will just be the underlying
        // data to return; however in all other cases this is either a
        // CrystalObject or an n-dimensional list of CrystalObjects, or a
        // stream of these things.
        return resultPromise;
      }
    };
  Object.defineProperty(crystalResolver, $$crystalWrapped, {
    enumerable: false,
    configurable: false,
    value: {
      original: userSpecifiedResolver,
      isSubscribe,
    } as CrystalWrapDetails,
  });
  return crystalResolver;
}

/**
 * Given a `resolve` function, wraps the function so that it can perform the
 * `ResolveFieldValueCrystal` algorithm.
 *
 * @param resolve - The resolver function.
 */
export function crystalWrapResolve<
  TSource extends object | null | undefined,
  TContext extends object,
  TArgs = { [argName: string]: any },
>(
  resolve: GraphQLFieldResolver<TSource, TContext, TArgs> | undefined,
): GraphQLFieldResolver<TSource, TContext, TArgs> {
  return crystalWrapResolveOrSubscribe(resolve, false);
}

/**
 * If you don't need to wrap a resolver, you can use this to save memory.
 */
export const crystalResolve = crystalWrapResolve(undefined);

/**
 * Given a `subscribe` function, wraps the function so that it can perform the
 * `ResolveFieldValueCrystal` algorithm.
 *
 * @param subscribe - The subscribe function.
 */
export function makeCrystalSubscriber<
  TSource extends object | null | undefined,
  TContext extends object,
  TArgs = { [argName: string]: any },
>(): GraphQLFieldResolver<TSource, TContext, TArgs> {
  return crystalWrapResolveOrSubscribe(undefined, true);
}

function crystalObjectToString(this: CrystalObject) {
  return chalk.bold.blue(
    `CO(${chalk.bold.yellow(
      crystalPrintPathIdentity(this[$$pathIdentity]),
    )}/${crystalPrint(this[$$id])})`,
  );
}

/**
 * Implements `NewCrystalObject`
 */
export function newCrystalObject(
  pathIdentity: string,
  typeName: string,
  id: UniqueId,
  crystalContext: CrystalContext,
  planResults: PlanResults,
): CrystalObject {
  return {
    [$$pathIdentity]: pathIdentity,
    [$$concreteType]: typeName,
    [$$id]: id,
    [$$data]: Object.create(null),
    [$$planResults]: planResults,
    [$$crystalContext]: crystalContext,
    toString: crystalObjectToString,
  };
}

export function isCrystalObject(input: any): input is CrystalObject {
  return (
    typeof input === "object" && input !== null && input[$$planResults] != null
  );
}

/**
 * Implements `GetBatchResult`.
 */
function getBatchResult(
  batch: Batch,
  parentCrystalObject: CrystalObject,
): Deferred<any> {
  const deferred = defer();
  batch.entries.push([parentCrystalObject, deferred]);
  return deferred;
}
