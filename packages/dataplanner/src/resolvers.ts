/* eslint-disable @typescript-eslint/ban-types */
import type { GraphQLFieldResolver } from "graphql";
import { defaultFieldResolver } from "graphql";

import { isCrystalError } from "./error.js";
import { $$verbatim } from "./interfaces.js";
import { __ValueStep } from "./steps/index.js";

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

      // Note: for the most optimal execution, `rootValue` passed to graphql
      // should be a crystal object, this allows using {crystalContext} across
      // the entire operation if plans are used everywhere. Even more optimised
      // would be if we can share the same {crystalContext} across multiple
      // `rootValue`s for multiple parallel executions (must be within the same
      // operationPlan) - e.g. as a result of multiple identical subscription
      // operations.

      // TODO: support execution inside GraphQL
      throw new Error(
        "TODO<b85a2e03-2cd2-4b31-8360-525ca0630e80>: In-GraphQL resolution is not currently supported, please use the 'execute' or 'dataplannerGraphql' functions from 'dataplanner'.",
      );
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
