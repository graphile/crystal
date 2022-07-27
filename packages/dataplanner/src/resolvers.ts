/* eslint-disable @typescript-eslint/ban-types */
import chalk from "chalk";
import type { GraphQLFieldResolver, GraphQLResolveInfo } from "graphql";
import { defaultFieldResolver } from "graphql";

import { crystalPrint, crystalPrintPathIdentity } from "./crystalPrint.js";
import { isCrystalError } from "./error.js";
import { establishOperationPlan } from "./establishOperationPlan.js";
import type { CrystalContext, CrystalObject } from "./interfaces.js";
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
import { sharedNull } from "./utils.js";

/*
 * **IMPORTANT**: This whole file is part of execution-v1 and is being phased out.
 */

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

const getOperationPlanFromResolver = <TContext extends object>(
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
  const operationPlan = establishOperationPlan({
    schema,
    operation,
    fragments,
    variableValues,
    context,
    rootValue,
  });
  return operationPlan;
};

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
      // operationPlan) - e.g. as a result of multiple identical subscription
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

      const _operationPlan = possiblyParentCrystalObject
        ? possiblyParentCrystalObject[$$crystalContext].operationPlan
        : getOperationPlanFromResolver(context, info);
      throw new Error("TODO");
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
