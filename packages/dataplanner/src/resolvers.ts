/* eslint-disable @typescript-eslint/ban-types */
import chalk from "chalk";
import debugFactory from "debug";
import type { GraphQLFieldResolver, GraphQLResolveInfo } from "graphql";
import { defaultFieldResolver } from "graphql";
import type { Path } from "graphql/jsutils/Path";

import { populateValuePlan } from "./aether.js";
import { ROOT_PATH } from "./constants.js";
import { crystalPrint, crystalPrintPathIdentity } from "./crystalPrint.js";
import type { Deferred } from "./deferred.js";
import { defer } from "./deferred.js";
import { noop } from "./dev.js";
import { isCrystalError } from "./error.js";
import { establishAether } from "./establishAether.js";
import type { Batch, CrystalContext, CrystalObject } from "./interfaces.js";
import {
  $$concreteType,
  $$crystalContext,
  $$data,
  $$id,
  $$pathIdentity,
  $$planResults,
  $$verbatim,
} from "./interfaces.js";
import type { PlanResults } from "./planResults.js";
import { __ValueStep } from "./steps/index.js";
import { ROOT_VALUE_OBJECT, sharedNull } from "./utils.js";

const debug = debugFactory("dataplanner:resolvers");
const debugVerbose = debug.extend("verbose");

/*
 * **IMPORTANT**: This whole file is part of execution-v1 and is being phased out.
 */

/**
 * Takes a path from GraphQLResolveInfo and returns the equivalent "path
 * identity". This is part of execution-v1 so is being phased out.
 */
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

/**
 * Returns true if the given resolver is already crystal wrapped.
 */
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

/**
 * Makes a CrystalObject to represent the value we received from the parent
 * resolver, since that was not using crystal.
 */
function makeParentCrystalObject(
  batch: Batch,
  info: GraphQLResolveInfo,
  pathIdentity: string,
  source: object | null | undefined,
): CrystalObject {
  const parentObject: object | CrystalObject = source ?? ROOT_VALUE_OBJECT;
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
    const parentStepId =
      aether.itemPlanIdByFieldPathIdentity[parentPathIdentity];
    if (parentStepId == null) {
      throw new Error(
        `Could not find a planId for (parent) path '${parentPathIdentity}'`,
      );
    }
    const parentPlan = aether.dangerouslyGetPlan(parentStepId); // TODO: assert that this is handled for us
    if (!(parentPlan instanceof __ValueStep)) {
      throw new Error(
        `Expected parent field (which returned non-crystal object) to be a __ValueStep, instead found ${parentPlan})`,
      );
    }

    const parentPlanResults = crystalContext.rootCrystalObject[$$planResults];
    const { parentType } = info;

    const parentCrystalObject = newCrystalObject(
      parentPathIdentity,
      parentType.name,
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

/**
 * Wraps the given resolver function (or the default resolver) in a
 * Crystal-aware resolver.
 */
function dataplannerResolverOrSubscriber<
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
    realResolver === defaultFieldResolver || !realResolver
      ? undefined
      : realResolver;

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
      // If $$verbatim is specified then we can just return the relevant entry
      // directly.
      if (source?.[$$verbatim]) {
        const fieldAlias = info.path.key;
        if (fieldAlias in source) {
          const data = source[fieldAlias];
          if (isCrystalError(data)) {
            throw data.originalError;
          } else {
            return data;
          }
        }
      }
      let possiblyParentCrystalObject: CrystalObject | null = null;

      // Note: for the most optimal execution, `rootValue` passed to graphql
      // should be a crystal object, this allows using {crystalContext} across
      // the entire operation if plans are used everywhere. Even more optimised
      // would be if we can share the same {crystalContext} across multiple
      // `rootValue`s for multiple parallel executions (must be within the same
      // aether) - e.g. as a result of multiple identical subscription
      // operations.

      /**
       * Sometimes we're able to precompute _some_ data for the parent, if so
       * we store it in $$data. Note: in some cases we still need to pass this
       * data through the original resolver.
       */
      const precomputedData = source?.[$$data];
      if (precomputedData != null) {
        const fieldAlias = info.path.key;
        if (fieldAlias in precomputedData) {
          // Short-circuit execution - we already have results
          const result = precomputedData[fieldAlias];
          if (userSpecifiedResolver !== undefined) {
            return userSpecifiedResolver(result, argumentValues, context, info);
            // NOTE: this cannot occur if the field is unplanned, so no need to handle that
          } else {
            return result;
          }
        }
      }

      // At this point, we know the data has not been predetermined, so we need
      // to calculate it via a batch.

      if (isCrystalObject(source)) {
        possiblyParentCrystalObject = source;
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
        makeParentCrystalObject(batch, info, pathIdentity, source);
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
        }, noop);
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
export function dataplannerResolver<
  TSource extends object | null | undefined,
  TContext extends object,
  TArgs = { [argName: string]: any },
>(
  resolve: GraphQLFieldResolver<TSource, TContext, TArgs> | undefined,
): GraphQLFieldResolver<TSource, TContext, TArgs> {
  return dataplannerResolverOrSubscriber(resolve, false);
}

/**
 * If you don't need to wrap a resolver, you can use this to save memory.
 */
export const crystalResolve = dataplannerResolver(undefined);

/**
 * Returns a `subscribe` subscription resolver function that's capable of the
 * DataPlanner algorithms.
 */
export function dataplannerSubscriber<
  TSource extends object | null | undefined,
  TContext extends object,
  TArgs = { [argName: string]: any },
>(): GraphQLFieldResolver<TSource, TContext, TArgs> {
  return dataplannerResolverOrSubscriber(undefined, true);
}

/**
 * For debugging.
 */
export function crystalObjectToString(this: CrystalObject) {
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
  crystalContext: CrystalContext,
  planResults: PlanResults,
): CrystalObject {
  return {
    toString: crystalObjectToString,
    [$$crystalContext]: crystalContext,
    [$$pathIdentity]: pathIdentity,
    [$$concreteType]: typeName,
    [$$planResults]: planResults,
    [$$data]: Object.create(sharedNull),
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
