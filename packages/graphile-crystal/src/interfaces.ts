import type { Batch } from "./batch";
import type { Plan } from "./plan";
import type { TrackedObject } from "./trackedObject";
//import { Plan } from "./plan";

/*+--------------------------------------------------------------------------+
  |                            TYPESCRIPT STUFF                              |
  +--------------------------------------------------------------------------+*/

/**
 * It's going to be a TObj, but only containing the things that were actually
 * requested. We should never need to refer to it directly.
 */
export type Opaque<TObj extends { [key: string]: any }> = Partial<TObj>;

/*+--------------------------------------------------------------------------+
  |                             GRAPHQL STUFF                                |
  +--------------------------------------------------------------------------+*/

// These are what the generics extend from
export type BaseGraphQLRootValue = any;
export interface BaseGraphQLContext {}
export interface BaseGraphQLVariables {
  [key: string]: unknown;
}
export interface BaseGraphQLArguments {
  [key: string]: any;
}

/** @deprecated */
export type GraphQLRootValue = BaseGraphQLRootValue;
/** @deprecated */
export type GraphQLContext = BaseGraphQLContext;
/** @deprecated */
export type GraphQLVariables = BaseGraphQLVariables;
/** @deprecated */
export type GraphQLArguments = BaseGraphQLArguments;

/*+--------------------------------------------------------------------------+
  |                                PLANS                                     |
  +--------------------------------------------------------------------------+*/

/*+--------------------------------------------------------------------------+
  |                           EVERYTHING ELSE                                |
  +--------------------------------------------------------------------------+*/

// This is the actual runtime context; we should not use a global for this.
export interface GraphileResolverContext extends BaseGraphQLContext {}

export const $$plan = Symbol("plan");
export const $$data = Symbol("data");
export const $$batch = Symbol("batch");
// Used to ease creation of PathIdentity
export const $$path = Symbol("path");

/**
 * e.g. `Query.allUsers>UsersConnection.nodes>User.username`
 */
export type PathIdentity = string;

export interface CrystalResult {
  [$$batch]: Batch;
  [$$data]: unknown;
  [$$path]: PathIdentity;
}

/**
 * Plan resolvers are like regular resolvers except they're called beforehand,
 * they return plans rather than values, and they only run once for lists
 * rather than for each item in the list.
 *
 * The idea is that the plan resolver returns a plan object which later will
 * process the data and feed that into the actual resolver functions
 * (preferably using the default resolver function?).
 *
 * They are stored onto `<field>.extensions.graphile.plan`
 *
 * @returns a plan for this field.
 *
 * @remarks
 * We're using `TrackedObject<...>` so we can later consider caching these
 * executions.
 */
export type PlanResolver<
  TContext extends BaseGraphQLContext,
  TArgs extends BaseGraphQLArguments,
  TParentPlan extends Plan<any> | null,
  TResultPlan extends Plan<any>
> = (
  $parentPlan: TParentPlan,
  args: TrackedObject<TArgs>,
  context: TrackedObject<TContext>,
) => TResultPlan;

/**
 * Arg plan resolver is called on an argument to a field of an Object Type;
 * it's passed the "future dependencies" that were returned by its
 * `dependencies` callback (if any). Arg plan returns void, it's only job is to
 * augment the field's base plan (e.g. by adding filters, pagination info,
 * ordering, etc). It cannot use any property of the parent object that was not
 * requested via dependencies.
 *
 * @returns If the argument is a scalar then null is returned. If the argument
 * is non-scalar then it _may_ return a plan that is fed into child input
 * object fields, useful for building a conditions tree with OR/AND/etc. These
 * plans are special in that they don't resolve to runtime data, they're just
 * used to augment the root plan.
export type InputPlanResolver<
  TPlan extends Plan<any>,
  TDependencyKeys extends string,
  TOutputPlan extends Plan<any>
> = (
  plan: TPlan,
  arg: unknown,
  args: TrackedObject<GraphQLArguments>,
  context: TrackedObject<object>,
) => TOutputPlan | null;
 */

/*

DISABLED: originally, I was thinking we should have dependencies come from
the parent plan, e.g. `parentPlan.req("archived_at")` to allow for more
flexible planning (e.g. allowing things like computed columns to be pushed
into the parent plan). However, this significantly complicates things,
particularly in the situation where there is no parent plan - in this case we
want to be able to feed the `parent` object into the planning and have it run
the same way so long as it still satisfies the dependencies. So now, we're
going to assume that any parent object can be expressed as a POJO and you
just specify the keys of that POJO you're interested in. More complex fields
(such as totalCount, computed columns, etc) should instead be calculated via
a child plan. This may not be as optimal as it could possibly be, but it's
certainly at least as optimal as solving the problem in GraphQL would be
without lookahead, and it's much easier to understand, write, and handle.

/**
 * Lists the dependencies of this field/argument, such that the parent plan
 * ensures to fetch these values.
 * /
type PlanDependenciesResolver<
  TParentPlan extends Plan,
  TDependencies extends FutureDependencies
> = (
  parentPlan: TParentPlan,
  args: TrackedObject<GraphQLArguments>,
  context: TrackedObject<GraphileEngine.GraphileResolverContext>,
) => TDependencies;


/**
 * The list of fields required from the parent object for this plan/argument.
 * /

type Dependencies<
  TParentObject extends object = object,
  TKeys extends Array<keyof TParentObject>[] = []
> = Pick<TParentObject, TKeys[number]>;

 */

/*
declare global {
  namespace GraphileEngine {
    // GraphQLObjectTypeGraphileExtension
    interface GraphQLFieldGraphileExtension<
      TPlan extends Plan = Plan,
      TDependencyKeys extends string = string
    > {
      dependencies?: TDependencyKeys[];
    }

    interface GraphQLArgumentGraphileExtension<
      TPlan extends Plan = Plan,
      TDependencyKeys extends string = string,
      TOutputPlan extends Plan = Plan
    > {
      dependencies?: TDependencyKeys[];
      argPlan?: InputPlanResolver<TPlan, TDependencyKeys, TOutputPlan>;
    }
  }
}

declare module 'graphql' {
  interface GraphQLFieldExtensions<TSource, TContext, TArgs = { [argName: string]: any}> {
    graphile: GraphileEngine.GraphQLFieldGraphileExtension;
  }
  interface GraphQLArgumentExtensions {
    graphile: GraphileEngine.GraphQLArgumentGraphileExtension;
  }
}
*/

declare global {
  namespace GraphileEngine {
    // GraphQLObjectTypeGraphileExtension
    interface GraphQLFieldGraphileExtension<
      TContext,
      TArgs,
      TParentPlan extends Plan<any>,
      TResultPlan extends Plan<any>
    > {
      plan?: PlanResolver<TContext, TArgs, TParentPlan, TResultPlan>;
    }

    interface GraphQLArgumentGraphileExtension<
      TContext,
      TInput,
      TParentPlan extends Plan<any>,
      TResultPlan extends Plan<any>
    > {
      argPlan?: PlanResolver<TContext, TInput, TParentPlan, TResultPlan>;
    }
  }
}

declare module "graphql" {
  interface GraphQLFieldExtensions<
    TSource,
    TContext,
    TArgs = { [argName: string]: any }
  > {
    graphile: GraphileEngine.GraphQLFieldGraphileExtension<
      TContext,
      TArgs,
      any,
      any
    >;
  }
  interface GraphQLArgumentExtensions {
    graphile: GraphileEngine.GraphQLArgumentGraphileExtension<
      any,
      any,
      any,
      any
    >;
  }
}

export interface CrystalContext {
  executeQueryWithDataSource<TDataSource extends DataSource<any, any>>(
    dataSource: TDataSource,
    query: TDataSource["TQuery"],
  ): Promise<{ values: TDataSource["TData"][] }>;
}

export abstract class DataSource<
  TQuery extends Record<string, any>,
  TData extends { [key: string]: any }
> {
  /**
   * TypeScript hack so that we can retrieve the TQuery type from a data source
   * at a later time - needed so we can have strong typing on
   * `executeQueryWithDataSource` and similar methods.
   *
   * @internal
   */
  TQuery!: TQuery;

  /**
   * TypeScript hack so that we can retrieve the TData type from a data source
   * at a later time - needed so we can have strong typing on `.get()` and
   * similar methods.
   *
   * @internal
   */
  TData!: TData;

  constructor() {}

  abstract execute(context: any, op: TQuery): Promise<{ values: TData[] }>;
}
