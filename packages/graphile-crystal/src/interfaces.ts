import { Batch } from "./batch";
import { TrackedObject } from "./trackedObject";
import { Plan } from "./plan";
import { FutureValue } from "./future";

export type GraphQLRootValue = any;
export type GraphQLContext = object;
export type GraphQLVariables = { [key: string]: unknown };
export type GraphQLArguments = { [key: string]: unknown };

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

export type FutureDependencies<TKeys extends string> = FutureValue<
  {
    [key in TKeys]: unknown;
  }
>;

/**
 * Plan resolver is called on the field of an Object Type; it's passed the
 * "future dependencies" that were returned by it's `dependencies` callback (if
 * any) and returns a Plan. It cannot use any property of the parent object
 * that was not requested via dependencies.
 *
 * @returns a plan for this field.
 *
 * @remarks
 * We're using TrackedObject<...> so we can later consider caching these
 * executions.
 */
export type PlanResolver<TPlan extends Plan, TDependencyKeys extends string> = (
  $deps: FutureDependencies<TDependencyKeys>,
  args: TrackedObject<GraphQLArguments>,
  context: TrackedObject<object>,
) => TPlan;

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
 */
export type InputPlanResolver<
  TPlan extends Plan,
  TDependencyKeys extends string,
  TOutputPlan extends Plan
> = (
  plan: TPlan,
  arg: unknown,
  $deps: FutureDependencies<TDependencyKeys>,
  args: TrackedObject<GraphQLArguments>,
  context: TrackedObject<object>,
) => TOutputPlan | null;

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

declare global {
  namespace GraphileEngine {
    interface GraphQLObjectTypeGraphileExtension<
      TPlan extends Plan = Plan,
      TDependencyKeys extends string = never
    > {
      dependencies?: TDependencyKeys[];
      plan?: PlanResolver<TPlan, TDependencyKeys>;
    }

    interface GraphQLFieldGraphileExtension<
      TPlan extends Plan = Plan,
      TDependencyKeys extends string = never,
      TOutputPlan extends Plan = Plan
    > {
      dependencies?: TDependencyKeys[];
      argPlan?: InputPlanResolver<TPlan, TDependencyKeys, TOutputPlan>;
    }
  }
}
