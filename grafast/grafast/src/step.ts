import chalk from "chalk";
import type { GraphQLObjectType } from "graphql";
import type { TE } from "tamedevil";
import te from "tamedevil";

import { isDev, noop } from "./dev.js";
import type {
  LayerPlan,
  LayerPlanReasonSubroutine,
} from "./engine/LayerPlan.js";
import {
  currentLayerPlan,
  currentPolymorphicPaths,
  withGlobalLayerPlan,
} from "./engine/lib/withGlobalLayerPlan.js";
import { $$unlock } from "./engine/lock.js";
import type { OperationPlan } from "./engine/OperationPlan.js";
import { flagError } from "./error.js";
import { getDebug } from "./global.js";
import { inspect } from "./inspect.js";
import type {
  AddDependencyOptions,
  ExecutionDetails,
  ExecutionEntryFlags,
  ExecutionResults,
  GrafastResultsList,
  JSONValue,
  PromiseOrDirect,
  StepOptimizeOptions,
  StepOptions,
  UnbatchedExecutionExtra,
} from "./interfaces.js";
import {
  $$deepDepSkip,
  $$subroutine,
  ALL_FLAGS,
  DEFAULT_FORBIDDEN_FLAGS,
} from "./interfaces.js";
import type { __ItemStep } from "./steps/index.js";
import { stepADependsOnStepB, stepAMayDependOnStepB } from "./utils.js";

/**
 * This indicates that a step never executes (e.g. __ItemStep and __ValueStep)
 * and thus when executed skips direct to reallyCompletedStep.
 *
 * @internal
 */
export const $$noExec = Symbol("noExec");

const ref_flagError = te.ref(flagError, "flagError");

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

// TODO: get rid of BaseStep; incorporate directly into ExecutableStep.
/**
 * The base abstract plan type; you should not extend this directly - instead
 * use an ExecutableStep (for use when planning output fields).
 */
export abstract class BaseStep {
  // Explicitly we do not add $$export here because we want children to set it

  /**
   * This identifies the "bucket" into which this plan's results will be stored.
   * New buckets are introduced when you cross boundaries that may change the
   * number of results in the bucket, or where control over execution is desired.
   *
   * - Lists / list items (generally multiplies up)
   * - Polymorphism - different entries may go into different buckets
   * - Mutations - early termination is likely
   * - Defer boundaries - don't execute this stuff until later
   * - null boundaries - if a null is met, no need to continue execution
   *
   * This bucket influences:
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
   * @internal
   */
  public readonly layerPlan: LayerPlan;
  public readonly operationPlan: OperationPlan;
  public [$$subroutine]: LayerPlan<LayerPlanReasonSubroutine> | null = null;
  public isArgumentsFinalized: boolean;
  public isFinalized: boolean;
  /** @internal */
  public _isUnary: boolean;
  /** @internal */
  public _isUnaryLocked: boolean;
  public debug: boolean;

  constructor() {
    this.isArgumentsFinalized = false;
    this.isFinalized = false;
    this.debug = getDebug();
    const layerPlan = currentLayerPlan();
    this.layerPlan = layerPlan;
    this.operationPlan = layerPlan.operationPlan;
    this._isUnary = true;
    this._isUnaryLocked = false;
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

  public planJSONExtra(): Record<string, JSONValue | undefined> | undefined {
    return undefined;
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

  public destroy(): void {}
}

/**
 * Executable plans are the plans associated with leaves on the GraphQL tree,
 * they must be able to execute to return values.
 */
export /* abstract */ class ExecutableStep<TData = any> extends BaseStep {
  // Explicitly we do not add $$export here because we want children to set it
  static $$export: any;

  /** @internal */
  [$$unlock]: undefined | (() => void) = undefined;

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
   *   promises or FlaggedValue objects
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
   * (default = ALL_FLAGS & ~FLAG_NULL)
   */
  protected readonly defaultForbiddenFlags: ExecutionEntryFlags =
    DEFAULT_FORBIDDEN_FLAGS;
  /**
   * The plan this plan will need data from in order to execute.
   */
  protected readonly dependencies: ReadonlyArray<ExecutableStep>;
  /**
   * If this step follows a side effects, it must implicitly depend on it (so
   * that any errors the side effect generated will be respected).
   *
   * @internal
   */
  public readonly implicitSideEffectStep: ExecutableStep | null;
  /**
   * What execution entry flags we can't handle for the given indexed dependency
   * (default = this.defaultForbiddenFlags)
   */
  protected readonly dependencyForbiddenFlags: ReadonlyArray<ExecutionEntryFlags>;
  protected readonly dependencyOnReject: ReadonlyArray<
    Error | null | undefined
  >;

  /**
   * Just for mermaid
   * @internal
   */
  public readonly dependents: ReadonlyArray<{
    step: ExecutableStep;
    dependencyIndex: number;
  }>;

  /**
   * Unique identifier for this step within the plan.
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
  public polymorphicPaths: ReadonlySet<string> | null;

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
   * Set the metaKey so `execute` will be passed a meta object to use.
   * Depending on what you set it to, you can share execution meta between
   * multiple steps of the same class (or even a family of step classes).
   *
   * A sensible value for it is `this.metaKey = this.id;`.
   */
  public metaKey: number | string | symbol | undefined;
  /**
   * Like `metaKey` but for the optimize phase
   */
  public optimizeMetaKey: number | string | symbol | undefined;

  /**
   * If the peerKey of two steps do not match, then they are definitely not
   * peers. Use this to reduce the load on deduplicate by more quickly
   * eradicating definitely-not-peers.
   *
   * Note: we may well change this to be a function in future, so it's advised
   * that you don't use this unless you're working inside the graphile/crystal
   * core codebase.
   *
   * @experimental
   */
  public peerKey: string | null = null;

  /**
   * Set this true for plans that implement mutations; this will prevent them
   * from being tree-shaken.
   */
  public hasSideEffects: boolean;

  constructor() {
    super();
    this.implicitSideEffectStep = null;
    this.hasSideEffects ??= false;
    let hasSideEffects = false;
    const stepTracker = this.layerPlan.operationPlan.stepTracker;
    Object.defineProperty(this, "hasSideEffects", {
      get(this: ExecutableStep<TData>) {
        return hasSideEffects;
      },
      set(this: ExecutableStep<TData>, value) {
        /**
         * If steps were created after this step, an this step doesn't depend
         * on them, then it's no longer safe to change hasSideEffects.
         */
        let nonDependentSteps: ExecutableStep[] | null = null;

        const maxStepId = stepTracker.stepCount - 1;
        if (this.id === maxStepId) {
          // All good - no more steps were created
        } else {
          // If the step created them during initialization and is dependent on
          // them, that's fine too.
          for (let id = this.id + 1; id <= maxStepId; id++) {
            const step = stepTracker.getStepById(id);
            if (stepADependsOnStepB(this, step)) continue;
            if (nonDependentSteps === null) {
              nonDependentSteps = [step];
            } else {
              nonDependentSteps.push(step);
            }
          }
        }
        if (nonDependentSteps === null) {
          hasSideEffects = value;
          if (value === true) {
            this.layerPlan.latestSideEffectStep = this;
            this.operationPlan.resetCache();
          } else if (value !== true && hasSideEffects === true) {
            throw new Error(
              `Cannot mark ${this} as having no side effects after having set it to have side effects.`,
            );
          }
        } else {
          throw new Error(
            `Attempted to mark ${this} as having side effects, but other non-dependent steps (${nonDependentSteps
              .map(String)
              .join(", ")}) have already been created.`,
          );
        }
      },
      enumerable: true,
      configurable: false,
    });
    this.dependencies = [];
    this.dependencyForbiddenFlags = [];
    this.dependencyOnReject = [];
    this.dependents = [];
    this.isOptimized = false;
    this.allowMultipleOptimizations = false;
    this._stepOptions = { stream: null, walkIterable: false };
    this.store = true;
    this.polymorphicPaths = currentPolymorphicPaths();

    // Important: MUST come after `this.layerPlan = ...`
    this.id = this.layerPlan._addStep(this);
  }

  protected withMyLayerPlan<T>(callback: () => T): T {
    return withGlobalLayerPlan(this.layerPlan, this.polymorphicPaths, callback);
  }

  protected getStep(id: number): ExecutableStep {
    return this.layerPlan.getStep(id, this);
  }

  protected getDepOptions(depId: number): AddDependencyOptions {
    const step = this.dependencies[depId];
    const forbiddenFlags = this.dependencyForbiddenFlags[depId];
    const onReject = this.dependencyOnReject[depId];
    const acceptFlags = ALL_FLAGS & ~forbiddenFlags;
    return { step, acceptFlags, onReject };
  }

  protected getDep<T extends ExecutableStep = ExecutableStep>(
    _depId: number,
  ): T {
    // This gets replaced when `__FlagStep` is loaded. Were we on ESM we could
    // just put the code here, but since we're not we have to avoid the
    // circular dependency.
    throw new Error(`Grafast failed to load correctly`);
  }

  protected maybeGetDep<T extends ExecutableStep = ExecutableStep>(
    depId: number | null | undefined,
  ): T | null {
    return depId == null ? null : this.getDep<T>(depId);
  }

  protected getDepOrConstant<TData = any>(
    _depId: number | null,
    _fallback: TData,
  ): ExecutableStep<TData> {
    // This gets replaced when `constant` is loaded. Were we on ESM we could
    // just put the code here, but since we're not we have to avoid the
    // circular dependency.
    throw new Error(`Grafast failed to load correctly`);
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

  /**
   * Cache a generated step by a given identifier (cacheKey) such that we don't
   * need to regenerate it on future calls, significantly reducing the load on
   * deduplication later.
   *
   * @experimental
   */
  protected cacheStep<T extends ExecutableStep>(
    actionKey: string,
    cacheKey: symbol | string | number,
    cb: () => T,
  ): T {
    return this.operationPlan.cacheStep(this, actionKey, cacheKey, cb);
  }

  public toString(): string {
    let meta;
    try {
      // If we log out too early, the meta function might fail.
      meta = this.toStringMeta();
    } catch (e) {
      // Ignore
    }
    return chalk.bold.blue(
      `${this.constructor.name.replace(/Step$/, "")}${
        this.layerPlan.id === 0 ? "" : chalk.grey(`{${this.layerPlan.id}}`)
      }${this._isUnary ? "➊" : ""}${
        this._stepOptions.stream != null ? "@s" : ""
      }${meta != null && meta.length ? chalk.grey(`<${meta}>`) : ""}[${inspect(
        this.id,
        { colors: true },
      )}]`,
    );
  }

  protected canAddDependency(step: ExecutableStep): boolean {
    return stepAMayDependOnStepB(this, step);
  }

  protected addDependency(
    stepOrOptions: ExecutableStep | AddDependencyOptions,
  ): number {
    const options: AddDependencyOptions =
      stepOrOptions instanceof ExecutableStep
        ? { step: stepOrOptions, skipDeduplication: false }
        : stepOrOptions;
    if (options.step.layerPlan.id > this.layerPlan.id) {
      throw new Error(
        `Cannot add dependency ${options.step} to ${this} since the former is in a deeper layerPlan (creates a catch-22)`,
      );
    }
    return this.operationPlan.stepTracker.addStepDependency(this, options);
  }

  /**
   * Adds "unary" dependencies; in `execute({count, values})` you'll receive a
   * `values[index]` (where `index` is the return value of this function) with
   * `isBatch = false` so you can use the `values[index].value` property
   * directly.
   */
  protected addUnaryDependency(
    stepOrOptions: ExecutableStep | AddDependencyOptions,
  ): number {
    const options: AddDependencyOptions =
      stepOrOptions instanceof ExecutableStep
        ? { step: stepOrOptions }
        : stepOrOptions;
    if (options.step.layerPlan.id > this.layerPlan.id) {
      throw new Error(
        `Cannot add dependency ${options.step} to ${this} since the former is in a deeper layerPlan (creates a catch-22)`,
      );
    }
    return this.operationPlan.stepTracker.addStepUnaryDependency(this, options);
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
  public deduplicate?(
    _peers: readonly ExecutableStep[],
  ): readonly ExecutableStep[];

  /**
   * If this plan is replaced via deduplication, this method gives it a chance
   * to hand over its responsibilities to its replacement.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public deduplicatedWith?(replacement: ExecutableStep): void;

  /**
   * Our chance to optimise the plan (which could go as far as to inline the
   * plan into the parent plan).
   */
  public optimize?(_options: StepOptimizeOptions): ExecutableStep;

  public finalize() {
    if (typeof (this as any).isSyncAndSafe !== "boolean") {
      // Take a guess
      if (!isDev) {
        this.isSyncAndSafe = false;
      } else if (this.execute.constructor.name === "AsyncFunction") {
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
   * This function will be called with 'execution details', an object containing:
   *
   * - `count`: the number of entries in the batch that's being executed
   * - `values`: a tuple representing the runtime values of the steps
   *   dependencies; each value in the tuple is an object, either a batch object
   *   containing a list of size `count` containing the values, or a unary
   *   object containing the single value common to all entries.
   * - `indexMap`: helper function to map over each index from `0` to `count-1`,
   *   returning the resulting array.
   * - `indexForEach`: as `indexMap`, but without the array result.
   * - `meta`: [experimental]
   *
   * `execute` must return a list with `count` entries, where each value in the
   * list relates to the result of executing this plan for the corresponding
   * entry in each of the entries in the `values` tuple.
   *
   * IMPORTANT: it is up to the execute function to cache/memoize results as
   * appropriate for performance, this can be done via the `meta` object.
   *
   * The `meta` object is an empty object stored to `grafastContext.metaByPlan`
   * that can be used to store anything this plan needs. We recommend that you
   * add attributes to meta for each purpose (e.g. use `meta.cache` for
   * memoizing results) so that you can expand your usage of meta in future.
   */
  /* abstract */
  execute(details: ExecutionDetails): ExecutionResults<TData> {
    // ESLint/TS: ignore not used.
    details;
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

function _buildOptimizedExecuteV2Expression(
  depCount: number,
  isSyncAndSafe: boolean,
) {
  const identifiers: TE[] = [];
  for (let i = 0; i < depCount; i++) {
    identifiers.push(te.identifier(`value${i}`));
  }
  const tryOrNot = (inFrag: TE): TE => {
    if (isSyncAndSafe) {
      return inFrag;
    } else {
      return te`\
    try {
  ${te.indent(inFrag)}
    } catch (e) {
      results[i] = ${ref_flagError}(e);
    }\
`;
    }
  };
  return te`\
(function execute({
  count,
  values: [${te.join(identifiers, ", ")}],
  extra,
}) {
  const results = [];
  for (let i = 0; i < count; i++) {
${tryOrNot(te`\
    results[i] = this.unbatchedExecute(extra, ${te.join(
      identifiers.map((identifier) => te`${identifier}.at(i)`),
      ", ",
    )});\
`)}
  }
  return results;
})`;
}

const MAX_DEPENDENCIES_TO_CACHE = 10;
const unsafeCache: any[] = [];
const safeCache: any[] = [];
te.batch(() => {
  for (let i = 0; i <= MAX_DEPENDENCIES_TO_CACHE; i++) {
    const depCount = i;
    const unsafeExpression = _buildOptimizedExecuteV2Expression(
      depCount,
      false,
    );
    te.runInBatch(unsafeExpression, (fn) => {
      unsafeCache[depCount] = fn;
    });
    const safeExpression = _buildOptimizedExecuteV2Expression(depCount, true);
    te.runInBatch(safeExpression, (fn) => {
      safeCache[depCount] = fn;
    });
  }
});

function buildOptimizedExecute(
  depCount: number,
  isSyncAndSafe: boolean,
  callback: (fn: any) => void,
) {
  // Try and satisfy from cache
  const cache = isSyncAndSafe ? safeCache : unsafeCache;
  if (depCount <= MAX_DEPENDENCIES_TO_CACHE) {
    callback(cache[depCount]);
    return;
  }

  // Build it
  const expression = _buildOptimizedExecuteV2Expression(
    depCount,
    isSyncAndSafe,
  );
  te.runInBatch<any>(expression, (fn) => {
    callback(fn);
  });
}

export abstract class UnbatchedExecutableStep<
  TData = any,
> extends ExecutableStep<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "UnbatchedExecutableStep",
  };

  finalize() {
    if (this.execute === UnbatchedExecutableStep.prototype.execute) {
      // If they've not replaced 'execute', use our optimized form
      buildOptimizedExecute(
        this.dependencies.length,
        this.isSyncAndSafe,
        (fn) => {
          this.execute = fn;
        },
      );
    }
    super.finalize();
  }

  execute({
    indexMap,
    values,
    extra,
  }: ExecutionDetails): PromiseOrDirect<GrafastResultsList<TData>> {
    console.warn(
      `${this} didn't call 'super.finalize()' in the finalize method.`,
    );
    const depCount = this.dependencies.length;
    return indexMap((i) => {
      try {
        const tuple = [];
        for (let j = 0; j < depCount; j++) {
          tuple[j] = values[j].at(i);
        }
        return this.unbatchedExecute(extra, ...tuple);
      } catch (e) {
        return flagError(e);
      }
    });
  }

  abstract unbatchedExecute(
    extra: UnbatchedExecutionExtra,
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

export type ListLikeStep<
  TData extends [...ExecutableStep[]] = [...ExecutableStep[]],
> = ExecutableStep<{
  [key in keyof TData]: TData[key] extends ExecutableStep<infer U> ? U : never;
}> & {
  at<TKey extends keyof TData>(key: TKey): ExecutableStep<TData[TKey]>;
};

export function isListLikeStep<
  TData extends [...ExecutableStep[]] = [...ExecutableStep[]],
>(plan: ExecutableStep): plan is ListLikeStep<TData> {
  return "at" in plan && typeof (plan as any).at === "function";
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
