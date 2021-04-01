import { inspect } from "util";
import {
  GraphQLFieldResolver,
  GraphQLOutputType,
  GraphQLObjectType,
  defaultFieldResolver,
} from "graphql";
// import { getAliasFromResolveInfo } from "graphql-parse-resolve-info";
import debugFactory from "debug";

const debug = debugFactory("crystal:resolvers");

export const $$crystalWrapped = Symbol("crystalWrapped");

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
    } = info;
    // const alias = getAliasFromResolveInfo(info);
    debug(
      `👉 CRYSTAL RESOLVER (${info.parentType.name}.${
        info.fieldName
      }); parent: ${inspect(parentObject, {
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
    // TODO: continue implementing ResolveFieldValueCrystal
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
