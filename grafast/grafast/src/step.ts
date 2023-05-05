import chalk from "chalk";
import type { GraphQLObjectType } from "graphql";
import type { TE } from "tamedevil";
import te from "tamedevil";

import { isDev, noop } from "./dev.js";
import type { LayerPlan } from "./engine/LayerPlan.js";
import {
  currentLayerPlan,
  currentPolymorphicPaths,
  withGlobalLayerPlan,
} from "./engine/lib/withGlobalLayerPlan.js";
import type { OperationPlan } from "./engine/OperationPlan.js";
import { getDebug } from "./global.js";
import { inspect } from "./inspect.js";
import type {
  ExecutionExtra,
  GrafastResultsList,
  GrafastResultStreamList,
  GrafastValuesList,
  PromiseOrDirect,
  StepOptimizeOptions,
  StepOptions,
} from "./interfaces.js";
import type { __ItemStep } from "./steps/index.js";
import { __ListTransformStep } from "./steps/index.js";

/**
 * @internal
 */
export const $$deepDepSkip = Symbol("deepDepSkip_experimental");
/**
 * This indicates that a step never executes (e.g. __ItemStep and __ValueStep)
 * and thus when executed skips direct to reallyCompletedStep.
 *
 * @internal
 */
export const $$noExec = Symbol("noExec");

function throwDestroyed(this: ExecutableStep): any {
  let message: string;
  try {
    message = `${this} has been destroyed; calling methods on it is no longer possible`;
  } catch (e) {
    message = `Step ${this?.id} has been destroyed; calling methods on it is no longer possible`;
  }
  throw new Error(message);
}

type DeepDepSkippable<T> = ExecutableStep<T> & {
  [$$deepDepSkip](): ExecutableStep;
};

function isDeepDepSkippable<T>(
  $dep: ExecutableStep,
): $dep is DeepDepSkippable<T> {
  return $$deepDepSkip in $dep && typeof $dep[$$deepDepSkip] === "function";
}

function reallyAssertFinalized(plan: BaseStep): void {
  if (!plan.isFinalized) {
    throw new Error(
      `Step ${plan} is not finalized; did you forget to call \`super.finalize()\` from its \`finalize()\` method?`,
    );
  }
}

// Optimise this away in production.
export const assertFinalized = !isDev ? noop : reallyAssertFinalized;

/**
 * The base abstract plan type; you should not extend this directly - instead
 * use an ExecutableStep (for use when planning output fields) or a
 * ModifierStep (for use when planning arguments/input fields).
 *
 * @remarks
 *
 * Though it might seem that ModifierStep should be used for all inputs
 * (arguments, input objects), this is not the case. When planning an output
 * field, all inputs to it (including arguments, parent plan, context, etc)
 * should be other executable plans. The only time that ModifierStep is used is
 * when writing specific plans as part of the argument or input field
 * definitions themself; even in these cases the inputs to these plan resolvers
 * will be ExecutablePlans.
 */
export abstract class BaseStep {
  // Explicitly we do not add $$export here because we want children to set it

  // TODO: this comment is WAY out of date.
  /**
   * This identifies the "bucket" into which this plan's results will be stored;
   * the this is determined as:
   *
   * - If this is an __ItemStep then a new bucket is assigned (this covers
   *   lists (whether streamed or not) and subscriptions)
   * - Otherwise, if this plan is deferred, then the deferred bucket id
   * - Otherwise, if no dependencies then the root bucket
   * - Otherwise, if all dependencies buckets overlap then the containing
   *   bucket (the largest bucket), and make this bucket dependent on the
   *   relevant plans in the other buckets
   * - Otherwise, a new bucket is created representing the union of the
   *   largest non-overlapping buckets
   *
   * This value is then used to influence:
   *
   * 1. how plans are deduplicated
   * 2. the order in which the plans are executed
   * 3. where the result of executing the plan is stored
   * 4. when the plan execution cache is allowed to be GC'd
   *
   * NOTE: `__ListTransformStep`'s effectively have a temporary bucket inside
   * them (built on the `__Item`) that's thrown away once the transform is
   * complete.
   *
   * A value of -1 indicates that a bucket has not yet been assigned (buckets
   * are assigned as the last step before the OperationPlan is 'ready'.
   *
   * @internal
   */
  public readonly layerPlan: LayerPlan;
  public readonly operationPlan: OperationPlan;
  public isArgumentsFinalized: boolean;
  public isFinalized: boolean;
  public debug: boolean;

  // TODO: change hasSideEffects to getter/setter, forbid setting after a
  // particular phase.
  /**
   * Set this true for plans that implement mutations; this will prevent them
   * from being tree-shaken.
   */
  public hasSideEffects: boolean;

  constructor() {
    this.isArgumentsFinalized = false;
    this.isFinalized = false;
    this.debug = getDebug();
    this.hasSideEffects = false;
    const layerPlan = currentLayerPlan();
    this.layerPlan = layerPlan;
    this.operationPlan = layerPlan.operationPlan;
  }

  public toString(): string {
    const meta = this.toStringMeta();
    return chalk.bold.blue(
      `${this.constructor.name.replace(/Step$/, "")}${
        meta != null && meta.length ? chalk.grey(`<${meta}>`) : ""
      }`,
    );
  }

  /**
   * This metadata will be merged into toString when referencing this plan.
   */
  public toStringMeta(): string | null {
    return null;
  }

  public finalize(): void {
    if (!this.isFinalized) {
      this.isFinalized = true;
    } else {
      throw new Error(
        `Step ${this} has already been finalized - do not call \`finalize()\` from user code!`,
      );
    }
  }

  public destroy(): void {
    // TODO: should we do something to deliberately break this class, such as
    // deleting all its properties? That would ensure anything that tried to
    // use it after it was destroyed would end up in error.
  }
}

/**
 * Executable plans are the plans associated with leaves on the GraphQL tree,
 * they must be able to execute to return values.
 */
export /* abstract */ class ExecutableStep<TData = any> extends BaseStep {
  // Explicitly we do not add $$export here because we want children to set it
  static $$export: any;

  /**
   * Setting this true is a performance optimisation, but it comes with strong
   * rules; we do not test you comply with these rules (as that would undo the
   * performance gains) but should you break them the behaviour is undefined
   * (and, basically, the schema may no longer be GraphQL compliant).
   *
   * Do not set this true unless the following hold:
   *
   * - The `execute` method must be a regular (not async) function
   * - The `execute` method must NEVER return a promise
   * - The values within the list returned from `execute` must NEVER include
   *   promises or GrafastError objects
   * - The result of calling `execute` should not differ after a
   *   `step.hasSideEffects` has executed (i.e. it should be pure, only
   *   dependent on its deps and use no external state)
   *
   * It's acceptable for the `execute` method to throw if it needs to.
   *
   * This optimisation applies to the majority of the built in plans and allows
   * the engine to execute without needing to resolve any promises which saves
   * precious event-loop ticks.
   */
  public isSyncAndSafe!: boolean;

  /**
   * The plan this plan will need data from in order to execute.
   * @internal
   */
  public readonly dependencies: ReadonlyArray<ExecutableStep>;

  /**
   * Just for mermaid
   * @internal
   */
  public readonly dependents: ReadonlyArray<{
    step: ExecutableStep;
    dependencyIndex: number;
  }>;

  /**
   * We reserve the right to change our mind as to whether this is a string or
   * number.
   *
   * @internal
   */
  public readonly id: number;

  /**
  /**
   * True when `optimize` has been called at least once.
   */
  public isOptimized: boolean;
  /**
   * Set this true if your plan's optimize method can be called a second time;
   * note that in this situation it's likely that your dependencies will not be
   * what you expect them to be (e.g. a PgSelectSingleStep might become an
   * AccessStep).
   */
  public allowMultipleOptimizations: boolean;

  /** @internal */
  public _stepOptions: StepOptions;

  /** @internal */
  public polymorphicPaths: ReadonlySet<string>;

  /**
   * True if this needs to be permanently stored; for example:
   *
   * - Is the dep of another LayerPlan
   * - Is used in an OutputPlan
   *
   * @internal
   */
  public store: boolean;

  /**
   * Override the metaKey to be able to share execution meta between multiple
   * steps of the same class (or even a family of step classes).
   */
  public metaKey: number | string | symbol;
  /**
   * Like `metaKey` but for the optimize phase
   */
  public optimizeMetaKey: number | string | symbol;

  constructor() {
    super();
    this.dependencies = [];
    this.dependents = [];
    this.isOptimized = false;
    this.allowMultipleOptimizations = false;
    this._stepOptions = { stream: null };
    this.store = true;
    this.polymorphicPaths = currentPolymorphicPaths();
    this.id = this.layerPlan._addStep(this);
    // @ts-ignore
    if (this.metaKey === undefined) {
      this.metaKey = this.id;
    }
    // @ts-ignore
    if (this.optimizeMetaKey === undefined) {
      this.optimizeMetaKey = this.id;
    }
  }

  protected withMyLayerPlan<T>(callback: () => T): T {
    return withGlobalLayerPlan(this.layerPlan, this.polymorphicPaths, callback);
  }

  protected getStep(id: number): ExecutableStep {
    return this.layerPlan.getStep(id, this);
  }

  public getDep(depId: number): ExecutableStep {
    return this.dependencies[depId];
  }

  /**
   * Like getDep, except it skips over __ItemStep and similar steps to get to
   * where the parent really is.
   *
   * @experimental
   */
  protected getDepDeep(depId: number): ExecutableStep {
    let $dep = this.getDep(depId);
    // Walk up the tree, looking for the source of this record. We know that
    // __ItemStep and __ListTransformStep are safe to walk through, but other
    // classes may not be.
    while (isDeepDepSkippable($dep)) {
      $dep = $dep[$$deepDepSkip]();
    }
    return $dep;
  }

  public toString(): string {
    const meta = this.toStringMeta();
    return chalk.bold.blue(
      `${this.constructor.name.replace(/Step$/, "")}${
        this.layerPlan.id === 0 ? "" : chalk.grey(`{${this.layerPlan.id}}`)
      }${meta != null && meta.length ? chalk.grey(`<${meta}>`) : ""}[${inspect(
        this.id,
        {
          colors: true,
        },
      )}]`,
    );
  }

  protected addDependency(
    step: ExecutableStep,
    skipDeduplication = false,
  ): number {
    if (this.isFinalized) {
      throw new Error(
        "You cannot add a dependency after the step is finalized.",
      );
    }
    if (!(step instanceof ExecutableStep)) {
      throw new Error(
        `Error occurred when adding dependency for '${this}', value passed was not a step, it was '${inspect(
          step,
        )}'`,
      );
    }
    if (isDev) {
      // Check that we can actually add this as a dependency
      if (!this.layerPlan.ancestry.includes(step.layerPlan)) {
        throw new Error(
          //console.error(
          // This is not a GrafastInternalError
          `Attempted to add '${step}' (${step.layerPlan}) as a dependency of '${this}' (${this.layerPlan}), but we cannot because that LayerPlan isn't an ancestor`,
        );
      }
    }

    // When copying dependencies between classes, we might not want to
    // deduplicate because we might refer to the dependency by its index. As
    // such, we should only dedupe by default but allow opting out.
    if (!skipDeduplication) {
      const existingIndex = this.dependencies.indexOf(step);
      if (existingIndex >= 0) {
        return existingIndex;
      }
    }

    return this.operationPlan.stepTracker.addStepDependency(this, step);
  }

  /**
   * Given a list of "peer" steps, return a list of these `peers` that are
   * equivalent to this step.
   *
   * NOTE: equivalence goes both ways: `a.deduplicate([b]).includes(b)` if and
   * only if `b.deduplicate([a]).includes(a)`.
   *
   * If you need to transform the peer to be equivalent you should do so via
   * the `deduplicatedWith` callback later.
   */
  public deduplicate(
    _peers: readonly ExecutableStep[],
  ): readonly ExecutableStep[] {
    return [];
  }

  /**
   * If this plan is replaced via deduplication, this method gives it a chance
   * to hand over its responsibilities to its replacement.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public deduplicatedWith(replacement: ExecutableStep): void {}

  /**
   * Our chance to optimise the plan (which could go as far as to inline the
   * plan into the parent plan).
   */
  public optimize(_options: StepOptimizeOptions): ExecutableStep {
    return this;
  }

  public finalize() {
    if (typeof (this as any).isSyncAndSafe !== "boolean") {
      // Take a guess
      const isAsync = this.execute.constructor.name === "AsyncFunction";
      if (isAsync) {
        this.isSyncAndSafe = false;
      } else {
        console.warn(
          `${this} uses a regular (non-async) function for 'execute'; if it never returns a promise and the list it returns never includes a promise then setting \`${this}.isSyncAndSafe = true\` will improve performance. If this is not true, set \`${this}.isSyncAndSafe = false\` to dismiss this message.`,
        );
        this.isSyncAndSafe = false;
      }
    }
    if (
      this.isSyncAndSafe === true &&
      this.execute.constructor.name === "AsyncFunction"
    ) {
      throw new Error(
        `${this} claims to be synchronous, however the execute method is asynchronous`,
      );
    }
    super.finalize();
  }

  /**
   * This function will be called with a `values` list: an array of entries for
   * each incoming grafast object, where each entry in the array is a list of
   * the values retrieved from executing the plans in `this.dependencies` for
   * that grafast object.
   *
   * It must return a list with the same length as `values`, where each value
   * in the list relates to the result of executing this plan for the
   * corresponding entry in the `values` list.
   *
   * IMPORTANT: it is up to the execute function to cache/memoize results as
   * appropriate for performance, this can be done via the `meta` object.
   *
   * The `meta` object is an empty object stored to `grafastContext.metaByPlan`
   * that can be used to store anything this plan needs. We recommend that you
   * add attributes to meta for each purpose (e.g. use `meta.cache` for
   * memoizing results) so that you can expand your usage of meta in future.
   */
  /* abstract */ execute(
    count: number,
    values: ReadonlyArray<GrafastValuesList<any>>,
    // EXPERIMENTAL
    extra: ExecutionExtra,
  ): PromiseOrDirect<GrafastResultsList<TData>> {
    // ESLint/TS: ignore not used.
    count;
    values;
    extra;
    throw new Error(`${this} has not implemented an 'execute' method`);
  }

  public destroy(): void {
    // Break ourself enough that if lifecycle methods are attempted an error
    // will be thrown. This should help weed out bugs where steps are processed
    // even after they have been removed/deduped.
    this.addDependency = throwDestroyed;
    this.deduplicate = throwDestroyed;
    this.deduplicatedWith = throwDestroyed;
    this.optimize = throwDestroyed;
    this.finalize = throwDestroyed;
    this.execute = throwDestroyed;

    super.destroy();
  }
}

export abstract class UnbatchedExecutableStep<
  TData = any,
> extends ExecutableStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "UnbatchedExecutableStep",
  };

  finalize() {
    // If they've not replaced 'execute', use our optimized form
    if (this.execute === UnbatchedExecutableStep.prototype.execute) {
      const depIndexes = this.dependencies.map((_, i) => i);
      const tryOrNot = (inFrag: TE): TE => {
        if (this.isSyncAndSafe) {
          return inFrag;
        } else {
          return te`\
      try {
${te.indent(inFrag)}
      } catch (e) {
        results[i] = e instanceof Error ? e : Promise.reject(e);
      }
`;
        }
      };
      this.execute = te.run`
return function execute(count, values, extra) {
  const [
${te.join(
  depIndexes.map((i) => te`    ${te.identifier(`list${i}`)},\n`),
  "",
)}\
  ] = values;
  const results = [];
  for (let i = 0; i < count; i++) {
${tryOrNot(te`\
    results[i] = this.unbatchedExecute(extra, ${te.join(
      depIndexes.map((depIndex) => te`${te.identifier(`list${depIndex}`)}[i]`),
      ", ",
    )});
`)}\
  }
  return results;
}
` as any;
    }
    super.finalize();
  }

  execute(
    count: number,
    values: ReadonlyArray<GrafastValuesList<any>>,
    extra: ExecutionExtra,
  ): PromiseOrDirect<GrafastResultsList<TData>> {
    console.warn(
      `${this} didn't call 'super.finalize()' in the finalize method.`,
    );
    const results = [];
    for (let i = 0; i < count; i++) {
      try {
        const tuple = values.map((list) => list[i]);
        results[i] = this.unbatchedExecute(extra, ...tuple);
      } catch (e) {
        results[i] = e instanceof Error ? (e as never) : Promise.reject(e);
      }
    }
    return results;
  }

  abstract unbatchedExecute(
    extra: ExecutionExtra,
    ...tuple: any[]
  ): PromiseOrDirect<TData>;
}

export function isExecutableStep<TData = any>(
  step: unknown,
): step is ExecutableStep<TData> {
  return (
    step instanceof BaseStep &&
    "execute" in step &&
    typeof (step as any).execute === "function"
  );
}

export function assertExecutableStep<TData>(
  step: BaseStep,
): asserts step is ExecutableStep<TData> {
  if (!isExecutableStep(step)) {
    throw new Error(
      `Expected an executable step, but received something else: ${inspect(
        step,
      )}`,
    );
  }
}

export function isUnbatchedExecutableStep<TData = any>(
  step: unknown,
): step is UnbatchedExecutableStep<TData> {
  return (
    isExecutableStep(step) &&
    typeof (step as any).unbatchedExecute === "function"
  );
}

export type ObjectLikeStep<
  TData extends { [key: string]: ExecutableStep } = {
    [key: string]: ExecutableStep;
  },
> = ExecutableStep<{
  [key in keyof TData]: TData[key] extends ExecutableStep<infer U> ? U : never;
}> & {
  get<TKey extends keyof TData>(key: TKey): ExecutableStep<TData[TKey]>;
};

export function isObjectLikeStep<
  TData extends { [key: string]: ExecutableStep } = {
    [key: string]: ExecutableStep;
  },
>(plan: ExecutableStep): plan is ObjectLikeStep<TData> {
  return "get" in plan && typeof (plan as any).get === "function";
}

export type StreamableStep<TData> = ExecutableStep<ReadonlyArray<TData>> & {
  /**
   * If this plan supports streaming then it should implement this method. It's
   * basically the same as `execute` except it returns a list of result streams
   * rather than a list of results.
   */
  stream(
    count: number,
    values: ReadonlyArray<GrafastValuesList<any>>,
    extra: ExecutionExtra,
    streamOptions: {
      initialCount: number;
    },
  ): PromiseOrDirect<GrafastResultStreamList<TData>>;
};

export function isStreamableStep<TData>(
  plan: ExecutableStep<ReadonlyArray<TData>>,
): plan is StreamableStep<TData> {
  return typeof (plan as StreamableStep<TData>).stream === "function";
}

export type PolymorphicStep = ExecutableStep & {
  planForType(objectType: GraphQLObjectType): ExecutableStep;
};

export function isPolymorphicStep(s: ExecutableStep): s is PolymorphicStep {
  return (
    "planForType" in s &&
    typeof (s as PolymorphicStep).planForType === "function"
  );
}

/**
 * Modifier plans modify their parent plan (which may be another ModifierStep
 * or an ExecutableStep). First they gather all the requirements from their
 * children (if any) being applied to them, then they apply themselves to their
 * parent plan. This application is done through the `apply()` method.
 *
 * Modifier plans do not use dependencies.
 */
export abstract class ModifierStep<
  TParentStep extends BaseStep = BaseStep,
> extends BaseStep {
  // Explicitly we do not add $$export here because we want children to set it
  static $$export: any;

  public readonly id: string;
  constructor(protected readonly $parent: TParentStep) {
    super();
    this.id = this.layerPlan._addModifierStep(this);
  }

  public toString(): string {
    const meta = this.toStringMeta();
    return chalk.bold.blue(
      `${this.constructor.name.replace(/Step$/, "")}${
        meta != null && meta.length ? chalk.grey(`<${meta}>`) : ""
      }[${inspect(this.id, {
        colors: true,
      })}]`,
    );
  }

  /**
   * In this method, you should apply the changes to your `this.$parent` plan
   */
  abstract apply(): void;
}

export function isModifierStep<
  TParentStep extends ExecutableStep | ModifierStep<any>,
>(plan: BaseStep): plan is ModifierStep<TParentStep> {
  return "apply" in plan && typeof (plan as any).apply === "function";
}

export function assertModifierStep<
  TParentStep extends ExecutableStep | ModifierStep<any>,
>(
  plan: BaseStep,
  pathDescription: string,
): asserts plan is ModifierStep<TParentStep> {
  if (!isModifierStep(plan)) {
    throw new Error(
      `The plan returned from '${pathDescription}' should be a modifier plan, but it does not implement the 'apply' method.`,
    );
  }
}

export interface ListCapableStep<
  TOutputData,
  TItemStep extends ExecutableStep<TOutputData> = ExecutableStep<TOutputData>,
> extends ExecutableStep<ReadonlyArray<any>> {
  listItem(itemPlan: __ItemStep<this>): TItemStep;
}

export function isListCapableStep<
  TData,
  TItemStep extends ExecutableStep<TData>,
>(
  plan: ExecutableStep<ReadonlyArray<TData>>,
): plan is ListCapableStep<TData, TItemStep> {
  return "listItem" in plan && typeof (plan as any).listItem === "function";
}

export function assertListCapableStep<
  TData,
  TItemStep extends ExecutableStep<TData>,
>(
  plan: ExecutableStep<ReadonlyArray<TData>>,
  pathDescription: string,
): asserts plan is ListCapableStep<TData, TItemStep> {
  if (!isListCapableStep(plan)) {
    throw new Error(
      `The plan returned from '${pathDescription}' should be a list capable plan, but ${plan} does not implement the 'listItem' method.`,
    );
  }
}
