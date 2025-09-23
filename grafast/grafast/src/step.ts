import chalk from "chalk";

import {
  $$deepDepSkip,
  $$proxy,
  $$subroutine,
  ALL_FLAGS,
  DEFAULT_FORBIDDEN_FLAGS,
  TRAPPABLE_FLAGS,
} from "./constants.js";
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
  AddUnaryDependencyOptions,
  DependencyOptions,
  ExecutionDetails,
  ExecutionEntryFlags,
  ExecutionResults,
  GrafastResultsList,
  JSONValue,
  Maybe,
  PromiseOrDirect,
  StepOptimizeOptions,
  StepOptions,
  UnbatchedExecutionExtra,
} from "./interfaces.js";
import type { __FlagStep, __ItemStep } from "./steps/index.js";
import { buildOptimizedExecute } from "./unbatchedStepExecute.js";
import { stepADependsOnStepB, stepAMayDependOnStepB } from "./utils.js";

/**
 * This indicates that a step never executes (e.g. __ItemStep and __ValueStep)
 * and thus when executed skips direct to reallyCompletedStep.
 *
 * @internal
 */
export const $$noExec = Symbol("noExec");

function throwDestroyed(this: Step): any {
  let message: string;
  try {
    message = `${this} has been destroyed; calling methods on it is no longer possible`;
  } catch (e) {
    message = `Step ${this?.id} has been destroyed; calling methods on it is no longer possible`;
  }
  throw new Error(message);
}

type DeepDepSkippable<T> = Step<T> & {
  [$$deepDepSkip](): Step;
};

function isDeepDepSkippable<T>($dep: Step): $dep is DeepDepSkippable<T> {
  return $$deepDepSkip in $dep && typeof $dep[$$deepDepSkip] === "function";
}

function reallyAssertFinalized(plan: Step): void {
  if (!plan.isFinalized) {
    throw new Error(
      `Step ${plan} is not finalized; did you forget to call \`super.finalize()\` from its \`finalize()\` method?`,
    );
  }
}

// Optimise this away in production.
export const assertFinalized = !isDev ? noop : reallyAssertFinalized;

/**
 * Executable plans are the plans associated with leaves on the GraphQL tree,
 * they must be able to execute to return values.
 */
export /* abstract */ class Step<TData = any> {
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
  /** @internal */
  public [$$proxy]?: any;
  public isArgumentsFinalized: boolean;
  public isFinalized: boolean;
  /** @internal */
  public _isUnary: boolean;
  /** @internal */
  public _isUnaryLocked: boolean;
  /**
   * Set `true` if this step should only run for certain of the polymorphic
   * paths available in its LayerPlan.
   *
   * @internal
   */
  public _isSelectiveStep: boolean;
  /**
   * For input values, set `true` if it comes from variables/arguments since
   * they cannot be modified (even by mutations), set `false` otherwise.
   *
   * @internal
   */
  public _isImmutable = false;
  public debug: boolean;

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
   *
   * @internal
   */
  protected readonly dependencies: ReadonlyArray<Step>;
  get dependencyCount(): number {
    return this.dependencies.length;
  }
  /** @internal */
  protected readonly _refs: Array<number> = [];
  /**
   * If this step follows a side effects, it must implicitly depend on it (so
   * that any errors the side effect generated will be respected).
   *
   * @internal
   */
  public readonly implicitSideEffectStep: Step | null;
  /**
   * What execution entry flags we can't handle for the given indexed dependency
   * (default = this.defaultForbiddenFlags)
   *
   * @internal
   */
  protected readonly dependencyForbiddenFlags: ReadonlyArray<ExecutionEntryFlags>;
  /** @internal */
  protected readonly dependencyOnReject: ReadonlyArray<
    Error | null | undefined
  >;
  /**
   * In future we'll be able to merge "data only" dependencies somehow. For now
   * we want people to use the right method so we encourage data only as the
   * default and also forbid `getDep` on data only deps (no talking to your
   * data only dependencies!)
   *
   * @internal
   */
  protected readonly dependencyDataOnly: ReadonlyArray<boolean>;

  /**
   * Just for mermaid
   * @internal
   */
  public readonly dependents: ReadonlyArray<{
    step: Step;
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

  /**
   * Set this to `true` if this step might return an iterable or async iterable
   * that cannot be consumed more than once. Grafast will wrap such values in a
   * "distributor" to allow multiple downstream steps to independently[^1]
   * consume clones of the stream. Grafast will not wrap arrays in this way as
   * doing so is unnecessary.
   *
   * [^1]: To avoid excessive memory consumption, if a clone gets
   * `distributorTargetBufferSize` items further ahead than another clone, it
   * will be temporarily paused (for up to `distributorPauseDuration`
   * milliseconds) to give the slowest clone a chance to catch up.
   *
   * WARNING: Cloning an async iterable only clones its iterable behavior;
   * other methods and properties are not preserved. For example, if you return
   * a `Map` with `cloneStreams: true`, downstream consumers will not have
   * access to `.get(key)`, `.size`, or similar methods/properties.
   *
   * WARNING: This transform always produces _async_ iterables, even if the
   * original was synchronous. This enables pausing of fast consumers whilst
   * slower consumers catch up, minimizing memory pressure.
   */
  public cloneStreams: boolean;

  /**
   * True if one of our dependencies has cloneStreams set. Only populated
   * during `operationPlan.finalize()`.
   *
   * @internal
   **/
  public _dependsOnDistributor = false;

  /**
   * DO NOT USE! (Specifically exists so that very VERY special steps could
   * override it if they so wished.)
   *
   * @internal
   * @experimental
   */
  public __trappableFlags: number;

  constructor() {
    this.__trappableFlags = TRAPPABLE_FLAGS;
    this.isArgumentsFinalized = false;
    this.isFinalized = false;
    this.debug = getDebug();
    const layerPlan = currentLayerPlan();
    this.layerPlan = layerPlan;
    this.operationPlan = layerPlan.operationPlan;
    this._isUnary = true;
    this._isUnaryLocked = false;
    // Populated in `OperationPlan` during `finalizeLayerPlans`
    this._isSelectiveStep = false;

    this.implicitSideEffectStep = layerPlan.latestSideEffectStep;
    this.hasSideEffects ??= false;
    this.cloneStreams = false;
    let hasSideEffects = false;
    const stepTracker = this.layerPlan.operationPlan.stepTracker;
    Object.defineProperty(this, "hasSideEffects", {
      get(this: Step<TData>) {
        return hasSideEffects;
      },
      set(this: Step<TData>, value) {
        if (value === hasSideEffects) {
          // No change necessary
          return;
        }

        /**
         * If steps were created after this step, an this step doesn't depend
         * on them, then it's no longer safe to change hasSideEffects.
         */
        let nonDependentSteps: Step[] | null = null;

        const maxStepId = stepTracker.stepCount - 1;
        if (this.id === maxStepId) {
          // All good - no more steps were created
        } else {
          // If the step created them during initialization and is dependent on
          // them, that's fine too.
          for (let id = this.id + 1; id <= maxStepId; id++) {
            const step = stepTracker.getStepById(id);
            // Allow steps that aren't in our layer plan
            if (step.layerPlan !== this.layerPlan) continue;
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
        } else if (value) {
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
    this.dependencyDataOnly = [];
    this.dependents = [];
    this.isOptimized = false;
    this.allowMultipleOptimizations = false;
    this._stepOptions = { stream: null, walkIterable: false };
    this.store = true;
    this.polymorphicPaths = currentPolymorphicPaths();

    // Important: MUST come after `this.layerPlan = ...`
    this.id = this.layerPlan._addStep(this);
  }

  /**
   * Generally you should only use this once the dependencies of a step are
   * established, if you use it beforehand and it returns `true` then adding a
   * non-unary dependency later will result in an error.
   */
  public getAndFreezeIsUnary() {
    this._isUnaryLocked = true;
    return this._isUnary;
  }

  protected withMyLayerPlan<T>(callback: () => T): T {
    const $sideEffect = this.layerPlan.latestSideEffectStep;
    try {
      this.layerPlan.latestSideEffectStep = this.implicitSideEffectStep;
      return withGlobalLayerPlan(
        this.layerPlan,
        this.polymorphicPaths,
        null,
        null,
        callback,
      );
    } finally {
      this.layerPlan.latestSideEffectStep = $sideEffect;
    }
  }

  /** @experimental */
  public withLayerPlan<T>(callback: () => T): T {
    return this.withMyLayerPlan(callback);
  }

  protected getStep(id: number): Step {
    return this.layerPlan.getStep(id, this);
  }

  protected getDepOptions<TStep extends Step = Step>(
    depId: number,
  ): DependencyOptions<TStep> {
    this._assertAccessAllowed(depId);
    return this._getDepOptions(depId);
  }
  protected _getDepOptions<TStep extends Step = Step>(
    depId: number,
  ): DependencyOptions<TStep> {
    const step = this.dependencies[depId] as TStep;
    const forbiddenFlags = this.dependencyForbiddenFlags[depId];
    const onReject = this.dependencyOnReject[depId];
    const dataOnly = this.dependencyDataOnly[depId];
    const acceptFlags = ALL_FLAGS & ~forbiddenFlags;
    return { step, acceptFlags, onReject, dataOnly };
  }

  /**
   * @internal
   */
  public _assertAccessAllowed(depId: number): void {
    const phase = this.operationPlan.phase;
    if (phase !== "optimize" && phase !== "plan") return;
    const step = this.dependencies[depId];
    const dataOnly = this.dependencyDataOnly[depId];
    if (dataOnly) {
      throw new Error(
        `Dependency ${depId} (${step}) of ${this} was declared as "data only", so retrieval is forbidden.`,
      );
    }
  }

  protected getDep<TStep extends Step = Step>(
    _depId: number,
  ): TStep | __FlagStep<TStep>;
  protected getDep<TStep extends Step = Step>(
    _depId: number,
    throwOnFlagged: true,
  ): TStep;
  protected getDep<TStep extends Step = Step>(
    _depId: number,
    _throwOnFlagged = false,
  ): TStep | __FlagStep<TStep> {
    // This gets replaced when `__FlagStep` is loaded. Were we on ESM we could
    // just put the code here, but since we're not we have to avoid the
    // circular dependency.
    throw new Error(`Grafast failed to load correctly`);
  }

  protected maybeGetDep<TStep extends Step = Step>(
    depId: number | null | undefined,
  ): TStep | __FlagStep<TStep> | null;
  protected maybeGetDep<TStep extends Step = Step>(
    depId: number | null | undefined,
    throwOnFlagged: true,
  ): TStep | null;
  protected maybeGetDep<TStep extends Step = Step>(
    depId: number | null | undefined,
    throwOnFlagged = false,
  ): TStep | __FlagStep<TStep> | null {
    return depId == null
      ? null
      : throwOnFlagged
        ? this.getDep<TStep>(depId, true)
        : this.getDep<TStep>(depId);
  }

  protected getDepOrConstant<TData = any>(
    _depId: number | null,
    _fallback: TData,
  ): Step<TData> {
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
  protected getDepDeep(depId: number): Step {
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
  protected cacheStep<T extends Step>(
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

  /**
   * This metadata will be merged into toString when referencing this plan.
   */
  public toStringMeta(): string | null {
    return null;
  }

  public planJSONExtra(): Record<string, JSONValue | undefined> | undefined {
    return undefined;
  }

  /**
   * **IF IN DOUBT, USE `.addDependency()` INSTEAD!
   *
   * This **DANGEROUS** method allows you to create a reference to another
   * step. A reference is like a dependency except it has no runtime impact -
   * the data is not passed into execute. In general you should only add
   * references to steps that you directly or indirectly depend on (e.g. an
   * ancestor step) so that you may communicate with said step during
   * `optimize` (for example). Sometimes it's acceptable to reference steps
   * that you don't transitively depend on; in those cases you're permitted to
   * pass an `allowIndirectReason` to explain to yourself and others why you
   * are breaking these rules.
   *
   * @experimental
   */
  protected addRef(
    rawStep: Step,
    allowIndirectReason: string | null = null,
  ): number | null {
    const step = this.operationPlan.stepTracker.getStepById(rawStep.id);
    if (isDev && !allowIndirectReason && !stepADependsOnStepB(this, step)) {
      const allRefs = (
        step: Step,
        allDepIds = new Set<number>(),
      ): Set<number> => {
        allDepIds.add(step.id);
        for (const dep of step.dependencies) {
          allRefs(dep, allDepIds);
        }
        return allDepIds;
      };
      const refs1 = allRefs(this);
      const refs2 = allRefs(step);
      // const commonRefs = refs1.union(refs2);
      const commonRefs = new Set([...refs1].filter((v) => refs2.has(v)));
      const printDeps = (step: Step, depth: number): string => {
        const isCommon = commonRefs.has(step.id);
        const stepDesc = isCommon
          ? chalk.bgWhite.black`<${step}>`
          : String(step);
        return `${"  ".repeat(depth)}${stepDesc}${!isCommon && step.dependencies.length > 0 ? `:\n${step.dependencies.map((d) => printDeps(d, depth + 1)).join("\n")}` : ""}`;
      };
      throw new Error(
        `${this} has created a reference to ${step} which is not depended on (directly or indirectly)
Self:
${printDeps(this, 1)}
Reference:
${printDeps(step, 1)}
  `,
      );
    } else if (!stepAMayDependOnStepB(this, step)) {
      throw new Error(
        `${this}.addRef(${step}) forbidden: invalid plan heirarchy`,
      );
    }
    return this._refs.push(step.id) - 1;
  }

  /**
   * Allows you to dereference a reference made via `addRef`. Will resolve to
   * whatever that step is now (or null if not found). Note that referenced
   * referenced steps may change to a new step instance due to lifecycle
   * methods (e.g. deduplicate) or even to an entirely separate class
   * altogether (e.g. due to optimize). References are not guaranteed to be
   * honoured.
   *
   * @experimental
   */
  protected getRef(refIdx: number | null): Step | null {
    if (!["plan", "validate", "optimize"].includes(this.operationPlan.phase)) {
      throw new Error(
        `Cannot call ${this}.getRef() when the operation plan phase is ${this.operationPlan.phase}; getRef may only be called during planning.`,
      );
    }
    if (refIdx == null) return null;
    return (
      this.operationPlan.stepTracker.getStepById(this._refs[refIdx]) ?? null
    );
  }

  protected canAddDependency(step: Step): boolean {
    return stepAMayDependOnStepB(this, step);
  }

  protected _addDependency(options: AddDependencyOptions): number {
    if (options.step.layerPlan.id > this.layerPlan.id) {
      throw new Error(
        `Cannot add dependency ${options.step} to ${this} since the former is in a deeper layerPlan (${options.step.layerPlan} deeper than ${this.layerPlan}; creates a catch-22)`,
      );
    }
    return this.operationPlan.stepTracker.addStepDependency(this, options);
  }
  protected addDependency(stepOrOptions: Step | AddDependencyOptions): number {
    const options: AddDependencyOptions = {
      dataOnly: false,
      skipDeduplication: false,
      ...(stepOrOptions instanceof Step
        ? { step: stepOrOptions }
        : stepOrOptions),
    };
    return this._addDependency(options);
  }
  protected addDataDependency(
    stepOrOptions: Step | AddDependencyOptions,
  ): number {
    const opts =
      stepOrOptions instanceof Step ? { step: stepOrOptions } : stepOrOptions;
    return this._addDependency({
      dataOnly: true,
      skipDeduplication: false,
      ...opts,
    });
  }
  // Currently identical to addDependency
  protected addStrongDependency(
    stepOrOptions: Step | AddDependencyOptions,
  ): number {
    return this._addDependency({
      dataOnly: false,
      skipDeduplication: false,
      ...(stepOrOptions instanceof Step
        ? { step: stepOrOptions }
        : stepOrOptions),
    });
  }

  /**
   * Adds "unary" dependencies; in `execute({count, values})` you'll receive a
   * `values[index]` (where `index` is the return value of this function) with
   * `isBatch = false` so you can use the `values[index].value` property
   * directly.
   */
  protected addUnaryDependency(
    stepOrOptions: Step | AddUnaryDependencyOptions,
  ): number {
    const options: AddUnaryDependencyOptions =
      stepOrOptions instanceof Step ? { step: stepOrOptions } : stepOrOptions;
    if (options.step.layerPlan.id > this.layerPlan.id) {
      throw new Error(
        `Cannot add a unary dependency on ${options.step} to ${this} since the former is in a deeper layerPlan (creates a catch-22)`,
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
  public deduplicate?(_peers: readonly Step[]): readonly Step[];

  /**
   * If this plan is replaced via deduplication, this method gives it a chance
   * to hand over its responsibilities to its replacement.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public deduplicatedWith?(replacement: Step): void;

  /**
   * Our chance to optimise the plan (which could go as far as to inline the
   * plan into the parent plan).
   */
  public optimize?(_options: StepOptimizeOptions): Step;

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

    if (!this.isFinalized) {
      this.isFinalized = true;
    } else {
      throw new Error(
        `Step ${this} has already been finalized - do not call \`finalize()\` from user code!`,
      );
    }
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
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
  }

  public toRecord?(): Step;
  public toSpecifier?(): Step;
  public toTypename?(): Step<string>;
  // public itemPlan?($item: Step): Step;
}

export abstract class UnbatchedStep<TData = any> extends Step<TData> {
  static $$export = {
    moduleName: "grafast",
    exportName: "UnbatchedStep",
  };

  finalize() {
    if (this.execute === UnbatchedStep.prototype.execute) {
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
  }: ExecutionDetails): GrafastResultsList<TData> {
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

export function isStep<TData = any>(step: unknown): step is Step<TData> {
  return step instanceof Step;
}

export function assertStep<TData>(step: unknown): asserts step is Step<TData> {
  if (!isStep(step)) {
    throw new Error(
      `Expected a step, but received something else: ${inspect(step)}`,
    );
  }
}

export function isUnbatchedStep<TData = any>(
  step: unknown,
): step is UnbatchedStep<TData> {
  return isStep(step) && typeof (step as any).unbatchedExecute === "function";
}

export type ObjectLikeStep<
  TData extends { [key: string]: Step } = {
    [key: string]: Step;
  },
> = Step<{
  [key in keyof TData]: TData[key] extends Step<infer U> ? U : never;
}> & {
  get<TKey extends keyof TData>(key: TKey): Step<TData[TKey]>;
};

export function isObjectLikeStep<
  TData extends { [key: string]: Step } = {
    [key: string]: Step;
  },
>(plan: Step): plan is ObjectLikeStep<TData> {
  return "get" in plan && typeof (plan as any).get === "function";
}

export type ListLikeStep<TData extends [...Step[]] = [...Step[]]> = Step<{
  [key in keyof TData]: TData[key] extends Step<infer U> ? U : never;
}> & {
  at<TKey extends keyof TData>(key: TKey): Step<TData[TKey]>;
};

export function isListLikeStep<TData extends [...Step[]] = [...Step[]]>(
  plan: Step,
): plan is ListLikeStep<TData> {
  return "at" in plan && typeof (plan as any).at === "function";
}

export interface ListCapableStep<
  TOutputData,
  TItemStep extends Step<TOutputData> = Step<TOutputData>,
  TInputData = any,
> extends Step<Maybe<ReadonlyArray<TInputData>>> {
  listItem(itemPlan: __ItemStep<TInputData>): TItemStep;
}

export function isListCapableStep<TData, TItemStep extends Step<TData>>(
  plan: Step<Maybe<ReadonlyArray<TData>>>,
): plan is ListCapableStep<TData, TItemStep> {
  return "listItem" in plan && typeof (plan as any).listItem === "function";
}

export function assertListCapableStep<TData, TItemStep extends Step<TData>>(
  plan: Step<Maybe<ReadonlyArray<TData>>>,
  pathDescription: string,
): asserts plan is ListCapableStep<TData, TItemStep> {
  if (!isListCapableStep(plan)) {
    throw new Error(
      `The plan returned from '${pathDescription}' should be a list capable plan, but ${plan} does not implement the 'listItem' method.`,
    );
  }
}

export function stepHasToSpecifier<TStep extends Step>(
  $step: TStep,
): $step is TStep & { toSpecifier(): Step } {
  return typeof $step.toSpecifier === "function";
}
export function stepHasToRecord<TStep extends Step>(
  $step: TStep,
): $step is TStep & { toRecord(): Step } {
  return typeof $step.toRecord === "function";
}

export {
  /** @deprecated Use ExecutableStep instead */
  Step as ExecutableStep,
  /** @deprecated Use UnbatchedStep instead */
  UnbatchedStep as UnbatchedExecutableStep,
};

/** @deprecated Use isStep instead */
export const isExecutableStep = isStep;
/** @deprecated Use isStep instead */
export function assertExecutableStep<TData>(
  step: unknown,
): asserts step is Step<TData> {
  return assertStep(step);
}
