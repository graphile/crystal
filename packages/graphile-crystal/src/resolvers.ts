/* eslint-disable @typescript-eslint/ban-types */
import chalk from "chalk";
import debugFactory from "debug";
import type { GraphQLFieldResolver, GraphQLResolveInfo } from "graphql";
import { getNamedType, isLeafType } from "graphql";
import type { Path } from "graphql/jsutils/Path";
import { inspect } from "util";

import { ROOT_PATH } from "./constants";
import { crystalPrint, crystalPrintPathIdentity } from "./crystalPrint";
import type { Deferred } from "./deferred";
import { defer } from "./deferred";
import { establishAether } from "./establishAether";
import type { Batch, CrystalContext, CrystalObject } from "./interfaces";
import {
  $$concreteType,
  $$crystalContext,
  $$id,
  $$pathIdentity,
  $$planResults,
} from "./interfaces";
import type { PlanResults } from "./planResults";
import type { __ListItemPlan } from "./plans";
import { __ValuePlan } from "./plans";
import type { UniqueId } from "./utils";
import { ROOT_VALUE_OBJECT } from "./utils";

const debug = debugFactory("crystal:resolvers");

function pathToPathIdentity(initialPath: Path): string {
  /**
   * We're building the pathIdentity from the end backwards, so this represents
   * the tail.
   */
  let tailPathIdentity = "";
  let path: Path | undefined = initialPath;
  while (path) {
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
    throw new Error(
      `Unimplemented - we do not currently support resolving plans where the parent is not a CrystalObject. Instead of CrystalObject in resolver at ${pathIdentity}, we saw: ${inspect(
        parentObject,
        {
          colors: true,
          depth: 4,
        },
      )}`,
    );

    // TODO: implement this.
    /*
        const id = uid(info.fieldName);
        debug(`👉 %p/%c for %c`, pathIdentity, id, parentObject);
        // Note: we need to "fake" that the parent was a plan. Because we may
        // have lots of resolvers all called for the same parent object, we use a
        // map. This happens to mean that multiple values in the graph being the
        // same object will be merged automatically.
        const parentPathIdentity = path.prev
          ? pathToPathIdentity(path.prev)
          : "";
        const parentPlanId =
          aether.itemPlanIdByFieldPathIdentity[parentPathIdentity];
        assert.ok(
          parentPlanId != null,
          `Could not find a planId for (parent) path '${parentPathIdentity}'`,
        );
        const parentPlan = aether.dangerouslyGetPlan(parentPlanId); // TODO: assert that this is handled for us
        assert.ok(
          parentPlan instanceof __ValuePlan,
          "Expected parent field (which returned non-crystal object) to be a valuePlan)",
        );

        const { valueId: parentId, existed } = aether.getValuePlanId(
          crystalContext,
          parentPlan,
          parentObject,
          pathIdentity,
        );
        const indexes = pathToIndexes(path);
        const parentPlanResults = new PlanResults(
          crystalContext.rootCrystalObject[$$planResults],
        );

        parentCrystalObject = newCrystalObject(
          parentPathIdentity,
          parentType.name,
          parentId,
          indexes,
          crystalContext,
          parentPlanResults,
        );
        if (!existed) {
          // TODO: here we're populating the parentObject as if it were a
          // regular ValuePlan, however it might have been a list in which case
          // we actually want to populate the __ListItemPlan with the
          // underlying value from the array (which is actually
          // `parentObject`). This is old code and is effectively now wrong,
          // and will need replacing to enable us to have compatibility with
          // regular GraphQL resolvers that don't know about Crystal.
          populateValuePlan(
            parentPlan,
            parentCrystalObject,
            parentObject,
            "parent",
          );
        }
        debug(
          "   Created a new crystal object to represent the parent of %p: %c",
          pathIdentity,
          parentCrystalObject,
        );
        */
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

  //const wrapResult = makeResultWrapper(type);
  /**
   * Implements the `ResolveFieldValueCrystal` algorithm.
   */
  const crystalResolver: GraphQLFieldResolver<TSource, TContext, TArgs> =
    async function (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      source: any,
      argumentValues,
      context,
      info,
    ) {
      const parentObject:
        | Exclude<TSource, null | undefined>
        | CrystalObject = source ?? ROOT_VALUE_OBJECT;
      let possiblyParentCrystalObject: CrystalObject | null = null;

      // Note: for the most optimal execution, `rootValue` passed to graphql
      // should be a crystal object, this allows using {crystalContext} across
      // the entire operation if plans are used everywhere. Even more optimised
      // would be if we can share the same {crystalContext} across multiple
      // `rootValue`s for multiple parallel executions (must be within the same
      // aether) - e.g. as a result of multiple identical subscription
      // operations.
      if (isCrystalObject(parentObject)) {
        possiblyParentCrystalObject = parentObject;
      }

      const aether = possiblyParentCrystalObject
        ? possiblyParentCrystalObject[$$crystalContext].aether
        : getAetherFromResolver(context, info);
      const {
        path,
        parentType,
        returnType,
        variableValues,
        rootValue,
        fieldName,
      } = info;
      const pathIdentity = isSubscribe ? ROOT_PATH : pathToPathIdentity(path);

      // IMPORTANT: there must be no `await` between here and `getBatchResult`.
      /* 👇👇👇👇👇 NO AWAIT ALLOWED BELOW HERE 👇👇👇👇👇 */
      const batch = aether.getBatch(
        pathIdentity,
        returnType,
        possiblyParentCrystalObject,
        variableValues,
        context,
        rootValue,
      );
      const parentCrystalObject =
        possiblyParentCrystalObject ??
        makeParentCrystalObject(batch, info, pathIdentity, parentObject);
      const resultPromise = getBatchResult(batch, parentCrystalObject);
      /* 👆👆👆👆👆 NO AWAIT ALLOWED ABOVE HERE 👆👆👆👆👆 */

      const result = await resultPromise;

      debug(
        `👈 %p/%c for %s; result: %c`,
        pathIdentity,
        parentCrystalObject[$$id],
        parentCrystalObject,
        result,
      );
      if (isLeafType(getNamedType(returnType))) {
        if (realResolver) {
          debug(
            "   Calling real resolver for %s.%s with %o",
            parentType.name,
            fieldName,
            result,
          );
          return realResolver(result, argumentValues, context, info);
        } else {
          return result;
        }
      } else {
        // This is either a CrystalObject or an n-dimensional list of
        // CrystalObjects, or a stream of these things.
        return result;
      }
    };
  Object.defineProperty(crystalResolver, $$crystalWrapped, {
    enumerable: false,
    configurable: false,
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

/**
 * Implements `NewCrystalObject`
 */
export function newCrystalObject(
  pathIdentity: string,
  typeName: string,
  id: UniqueId,
  indexes: ReadonlyArray<number>,
  crystalContext: CrystalContext,
  // TODO: remove this?
  planResults: PlanResults,
): CrystalObject {
  const crystalObject: CrystalObject = {
    [$$pathIdentity]: pathIdentity,
    [$$concreteType]: typeName,
    [$$id]: id,
    [$$planResults]: planResults,
    [$$crystalContext]: crystalContext,
    toString() {
      const p = indexes.length ? `.${indexes.join(".")}` : ``;
      return chalk.bold.blue(
        `CO(${chalk.bold.yellow(
          crystalPrintPathIdentity(pathIdentity),
        )}/${crystalPrint(id)}${p})`,
      );
    },
  };
  return crystalObject;
}

export function isCrystalObject(input: any): input is CrystalObject {
  return typeof input === "object" && input && $$planResults in input;
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
