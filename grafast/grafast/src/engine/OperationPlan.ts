import LRU from "@graphile/lru";
import type {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLArgument,
  GraphQLField,
  GraphQLFieldResolver,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLSchema,
  GraphQLUnionType,
  OperationDefinitionNode,
} from "graphql";
import * as graphql from "graphql";
import te from "tamedevil";

import * as assert from "../assert.js";
import {
  $$contextPlanCache,
  $$proxy,
  $$subroutine,
  $$timeout,
  $$ts,
  ALL_FLAGS,
  DEFAULT_ACCEPT_FLAGS,
} from "../constants.js";
import type { Constraint } from "../constraints.js";
import {
  graphqlCollectFields,
  newSelectionSetDigest,
} from "../graphqlCollectFields.js";
import { fieldSelectionsForType } from "../graphqlMergeSelectionSets.js";
import type { GrafastPlanJSON, StepStreamOptions } from "../index.js";
import {
  __FlagStep,
  __ItemStep,
  __ListTransformStep,
  __TrackedValueStep,
  __ValueStep,
  $$inhibit,
  error,
  get,
  isDev,
  object,
  SafeError,
  Step,
  stripAnsi,
} from "../index.js";
import { inputStep } from "../input.js";
import { inspect } from "../inspect.js";
import type {
  AbstractTypePlanner,
  AddDependencyOptions,
  AnyInputStep,
  FieldPlanResolver,
  GrafastPlanBucketJSONv1,
  GrafastPlanBucketPhaseJSONv1,
  GrafastPlanBucketReasonJSONv1,
  GrafastPlanJSONv1,
  GrafastPlanStepJSONv1,
  LocationDetails,
  Maybe,
  PlanTypeInfo,
  TrackedArguments,
} from "../interfaces.js";
import type { ApplyAfterModeArg } from "../operationPlan-input.js";
import { withFieldArgsForArguments } from "../operationPlan-input.js";
import type { GrafastOperationOptions } from "../prepare.js";
import type { UnbatchedExecutableStep } from "../step.js";
import {
  $$noExec,
  assertExecutableStep,
  assertFinalized,
  isListCapableStep,
  isUnbatchedStep,
  stepHasToRecord,
  stepHasToSpecifier,
} from "../step.js";
import { __cloneStream, __CloneStreamStep } from "../steps/__cloneStream.js";
import { __TrackedValueStepWithDollars } from "../steps/__trackedValue.js";
import { itemsOrStep } from "../steps/connection.js";
import { constant, ConstantStep } from "../steps/constant.js";
import { isSkippableEach } from "../steps/each.js";
import {
  graphqlResolver,
  graphqlResolveType,
} from "../steps/graphqlResolver.js";
import { timeSource } from "../timeSource.js";
import type { Sudo } from "../utils.js";
import {
  arraysMatch,
  assertNotAsync,
  assertNotPromise,
  defaultValueToValueNode,
  directiveArgument,
  findVariableNamesUsed,
  hasItemPlan,
  isPhaseTransitionLayerPlan,
  isTypePlanned,
  layerPlanHeirarchyContains,
  pathsFromAncestorToTargetLayerPlan,
  recordsMatch,
  setsMatch,
  stepADependsOnStepB,
  sudo,
  writeableArray,
} from "../utils.js";
import type {
  LayerPlanPhase,
  LayerPlanReasonCombined,
  LayerPlanReasonDefer,
  LayerPlanReasonListItem,
  LayerPlanReasonListItemStream,
  LayerPlanReasonSubroutine,
  LayerPlanReasonSubscription,
} from "./LayerPlan.js";
import { LayerPlan } from "./LayerPlan.js";
import { defaultPlanResolver } from "./lib/defaultPlanResolver.js";
import {
  currentLayerPlan,
  currentPolymorphicPaths,
  withGlobalLayerPlan,
} from "./lib/withGlobalLayerPlan.js";
import { lock, unlock } from "./lock.js";
import type {
  CommonPlanningDetails,
  PlanFieldReturnTypeDetails,
  PlanIntoOutputPlanDetails,
  PlanListItemDetails,
  PlanSelectionSetDetails,
  PolymorphicPlanObjectTypeDetails,
  PolymorphicResolveTypeDetails,
  ProcessGroupedFieldSetDetails,
  StreamDetails,
} from "./OperationPlanTypes.js";
import type { OutputPlanTypePolymorphicObject } from "./OutputPlan.js";
import { OutputPlan } from "./OutputPlan.js";
import { StepTracker } from "./StepTracker.js";

type ProcessStepActionDescription =
  | "deduplicate"
  | "hoist"
  | "pushDown"
  | "optimize"
  | "optimizeDataOnly";

type Todo = ReadonlyArray<
  [string, QueueTuple<CommonPlanningDetails<GraphQLOutputType>>[]]
>;

const atpe =
  typeof process !== "undefined" && process.env.ALWAYS_THROW_PLANNING_ERRORS;
const ALWAYS_THROW_PLANNING_ERRORS = atpe === "1";
const THROW_PLANNING_ERRORS_ON_SIDE_EFFECTS = atpe === "2";

const DEFAULT_MAX_DEPTH = 100;

/**
 * Returns true for steps that the system populates automatically without executing.
 */
function isPrepopulatedStep(step: Step) {
  return step instanceof __ItemStep || step instanceof __ValueStep;
}

if (
  atpe &&
  atpe !== "0" &&
  !(ALWAYS_THROW_PLANNING_ERRORS || THROW_PLANNING_ERRORS_ON_SIDE_EFFECTS)
) {
  throw new Error(
    `Invalid value for envvar 'ALWAYS_THROW_PLANNING_ERRORS' - expected '1' or '2', but received '${atpe}'`,
  );
}

// Work around TypeScript CommonJS `graphql_1.isListType` unoptimal access.
const {
  assertObjectType,
  defaultFieldResolver,
  getNamedType,
  getNullableType,
  isEnumType,
  isInterfaceType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isUnionType,
} = graphql;

/**
 * This value allows the first few plans to take more time whilst the JIT warms
 * up - planning can easily go from 400ms down to 80ms after just a few
 * executions thanks to V8's JIT.
 */
let planningTimeoutWarmupMultiplier = 5;
const EMPTY_ARRAY = Object.freeze([]);
const EMPTY_SET: ReadonlySet<never> = new Set();

export const POLYMORPHIC_ROOT_PATH = null;
export const POLYMORPHIC_ROOT_PATHS: ReadonlySet<string> | null = null;
Object.freeze(POLYMORPHIC_ROOT_PATHS);

/** How many times will we try re-optimizing before giving up */
const MAX_OPTIMIZATION_LOOPS = 10;

/** Beware: the list of phases may change over time... @experimental */
export type OperationPlanPhase =
  | "init"
  | "plan"
  | "validate"
  | "optimize"
  | "finalize"
  | "ready";

// TYPES: overhaul the TypeScript for this, allow steps to declaration merge
// their own shapes into it.
export interface MetaByMetaKey {
  [metaKey: string | number | symbol]: Record<string, any>;
}

const REASON_ROOT = Object.freeze({ type: "root" });
const OUTPUT_PLAN_TYPE_NULL = Object.freeze({ mode: "null" });
const OUTPUT_PLAN_TYPE_ARRAY = Object.freeze({ mode: "array" });
const newValueStepCallback = (isImmutable: boolean) =>
  new __ValueStep(isImmutable);

const NO_ARGS: TrackedArguments = Object.create(null);

export class OperationPlan {
  /* This only exists to make establishOperationPlan easier for TypeScript */
  public readonly [$$timeout]: undefined;
  public readonly [$$ts]: undefined;
  /** @internal */
  public [$$contextPlanCache]?: GrafastPlanJSON;
  /**
   * For use by `inputStep()` only.
   * @internal
   */
  public _inputStepCache = new Map<
    graphql.GraphQLInputType,
    Map<
      graphql.ValueNode | undefined,
      Map<graphql.ConstValueNode | undefined, AnyInputStep>
    >
  >();

  public readonly queryType: GraphQLObjectType;
  public readonly mutationType: GraphQLObjectType | null;
  public readonly subscriptionType: GraphQLObjectType | null;
  public readonly unionsContainingObjectType: {
    [objectTypeName: string]: ReadonlyArray<GraphQLUnionType>;
  };

  private operationType: "query" | "mutation" | "subscription";

  /**
   * What state is the OpPlan in?
   *
   * 1. init
   * 2. plan
   * 3. validate
   * 5. optimize
   * 6. finalize
   * 7. ready
   *
   * Once in 'ready' state we can execute the plan.
   */
  public phase: OperationPlanPhase = "init";
  /**
   * Gets updated as we work our way through the plan, useful for making errors more helpful.
   */
  public loc: string[] | null = isDev
    ? []
    : null /* forbid loc in production */;

  /** @internal */
  public rootLayerPlan: LayerPlan;
  /**
   * Assigned during OperationPlan.planOperation(), guaranteed to exist after
   * initialization.
   *
   * @internal
   */
  public rootOutputPlan!: OutputPlan;

  /** @internal */
  public readonly stepTracker = new StepTracker(this);

  /** Constraints based on evaluating variables. @internal */
  public readonly variableValuesConstraints: Constraint[];
  /** Stores the actual variableValues. @internal */
  public readonly variableValuesStep: __ValueStep<{ [key: string]: any }>;
  /** A step for accessing variableValues in a tracked manner (allowing eval). @internal */
  public readonly trackedVariableValuesStep: __TrackedValueStep<{
    [key: string]: any;
  }>;

  /** Constraints based on evaluating context. @internal */
  public readonly contextConstraints: Constraint[];
  /** Stores the actual value of the context. @internal */
  public readonly contextStep: __ValueStep<Grafast.Context>;
  /** Allows accessing context in a tracked manner (allowing eval). @internal */
  public readonly trackedContextStep: __TrackedValueStep<Grafast.Context>;

  /** Constraints based on evaluating rootValue. @internal */
  public readonly rootValueConstraints: Constraint[];
  /** Stores the actual value of rootValue. @internal */
  public readonly rootValueStep: __ValueStep<any>;
  /** Allows accessing rootValue in a tracked manner (allowing eval). @internal */
  public readonly trackedRootValueStep: __TrackedValueStep<any>;

  /** @internal */
  public makeMetaByMetaKey: () => MetaByMetaKey;

  /**
   * @internal
   */
  public readonly itemStepIdByListStepIdByParentLayerPlanId: {
    [parentLayerPlanId: number]:
      | { [listStepId: number]: number | undefined }
      | undefined;
  } = Object.create(null);

  /**
   * If true, then this operation doesn't use (custom) resolvers.
   */
  public pure = true;

  private startTime = timeSource.now();
  private previousLap = this.startTime;
  private laps: Array<{
    category: string;
    subcategory: string | undefined;
    elapsed: number;
  }> = [];

  private optimizeMeta = new Map<
    string | number | symbol,
    Record<string, any>
  >();

  private scalarPlanInfo: { schema: GraphQLSchema };

  /** @internal */
  public valueNodeToStaticValueCache = new Map<
    graphql.ValueNode,
    AnyInputStep
  >();

  private frozenPlanningPaths = isDev ? null : new Set<string>();

  /** @internal */
  public resolveInfoOperationBase: Pick<
    graphql.GraphQLResolveInfo,
    "schema" | "operation" | "fragments"
  >;

  private readonly planningTimeout: number | null;
  private readonly maxPlanningDepth: number;

  constructor(
    public readonly schema: GraphQLSchema,
    public readonly operation: OperationDefinitionNode,
    public readonly fragments: {
      [fragmentName: string]: FragmentDefinitionNode;
    },
    variableValuesConstraints: Constraint[],
    public readonly variableValues: { [key: string]: any },
    contextConstraints: Constraint[],
    public readonly context: { [key: string]: any },
    rootValueConstraints: Constraint[],
    public readonly rootValue: any,
    options: GrafastOperationOptions,
  ) {
    this.planningTimeout = options?.timeouts?.planning ?? null;
    this.maxPlanningDepth = options?.maxPlanningDepth ?? DEFAULT_MAX_DEPTH;
    this.resolveInfoOperationBase = {
      schema,
      operation,
      fragments,
    };
    this.variableValuesConstraints = variableValuesConstraints;
    this.contextConstraints = contextConstraints;
    this.rootValueConstraints = rootValueConstraints;
    this.scalarPlanInfo = { schema: this.schema };
    const queryType = schema.getQueryType();
    assert.ok(queryType, "Schema must have a query type");
    this.queryType = queryType;
    this.mutationType = schema.getMutationType() ?? null;
    this.subscriptionType = schema.getSubscriptionType() ?? null;

    const allTypes = Object.values(schema.getTypeMap());

    const allUnions: GraphQLUnionType[] = [];
    const allObjectTypes: GraphQLObjectType[] = [];
    this.unionsContainingObjectType = Object.create(null);

    for (const type of allTypes) {
      if (isUnionType(type)) {
        allUnions.push(type);
        const members = type.getTypes();
        for (const memberType of members) {
          if (!this.unionsContainingObjectType[memberType.name]) {
            this.unionsContainingObjectType[memberType.name] = [type];
          } else {
            (this.unionsContainingObjectType[memberType.name] as any).push(
              type,
            );
          }
        }
      } else if (isObjectType(type)) {
        allObjectTypes.push(type);
        if (!this.unionsContainingObjectType[type.name]) {
          this.unionsContainingObjectType[type.name] = [];
        }
      }
    }

    this.operationType = operation.operation;

    this.phase = "plan";
    this.rootLayerPlan = new LayerPlan(this, REASON_ROOT);

    // Set up the shared steps for variables, context and rootValue
    [this.variableValuesStep, this.trackedVariableValuesStep] = this.track(
      variableValues,
      this.variableValuesConstraints,
      this.operation.variableDefinitions,
    );
    [this.contextStep, this.trackedContextStep] = this.track(
      context,
      this.contextConstraints,
    );
    [this.rootValueStep, this.trackedRootValueStep] = this.track(
      rootValue,
      this.rootValueConstraints,
    );
    // this.rootLayerPlan.parentStep = this.trackedRootValueStep;

    this.deduplicateSteps();

    this.lap("init");

    // Plan the operation
    this.planOperation();

    this.checkTimeout();
    this.lap("planOperation");

    // Now perform hoisting (and repeat deduplication)
    this.hoistSteps();

    this.checkTimeout();
    this.lap("hoistSteps", "planOperation");

    if (isDev) {
      this.phase = "validate";
      this.resetCache();
      // Helpfully check steps don't do forbidden things.
      this.validateSteps();

      this.lap("validateSteps");
    }

    this.phase = "optimize";
    this.resetCache();

    // Get rid of temporary steps before `optimize` triggers side-effects.
    // (Critical due to steps that may have been discarded due to field errors
    // or similar.)
    this.stepTracker.treeShakeSteps();

    this.checkTimeout();
    this.lap("treeShakeSteps", "optimize");

    // Replace/inline/optimise steps
    te.batch(() => {
      this.optimizeSteps();
    });

    this.checkTimeout();
    this.lap("optimizeSteps");

    this.inlineSteps();
    this.checkTimeout();
    this.lap("inlineSteps");

    this.phase = "finalize";
    this.resetCache();

    this.stepTracker.finalizeSteps();

    // Get rid of steps that are no longer needed after optimising outputPlans
    // (we shouldn't see any new steps or dependencies after here)
    this.stepTracker.treeShakeSteps();

    this.checkTimeout();
    this.lap("treeShakeSteps", "finalize");

    // Now shove steps as deep down as they can go (opposite of hoist)
    this.pushDownSteps();

    this.checkTimeout();
    this.lap("pushDownSteps");

    // Plans are expected to execute later; they may take steps here to prepare
    // themselves (e.g. compiling SQL queries ahead of time).
    te.batch(() => {
      this.finalizeSteps();
    });

    this.lap("finalizeSteps");

    // Replace access plans with direct access, etc (must come after finalizeSteps)
    te.batch(() => {
      this.optimizeOutputPlans();
    });

    this.checkTimeout();
    this.lap("optimizeOutputPlans");

    // AccessSteps may have been removed
    this.stepTracker.treeShakeSteps();

    this.checkTimeout();
    this.lap("treeShakeSteps", "optimizeOutputPlans");

    this.stepTracker.finalizeOutputPlans();

    te.batch(() => {
      this.finalizeLayerPlans();
    });

    this.lap("finalizeLayerPlans");

    te.batch(() => {
      this.finalizeOutputPlans();
    });

    this.lap("finalizeOutputPlans");

    this.finalize();
    this.lap("finalizeOperationPlan");

    this.phase = "ready";
    this.resetCache();

    // this.walkFinalizedPlans();
    // this.preparePrefetches();

    const allMetaKeys = new Set<string | number | symbol>();
    for (const step of this.stepTracker.activeSteps) {
      if (step.metaKey !== undefined) {
        allMetaKeys.add(step.metaKey);
      }
    }
    const allMetaKeysList = [...allMetaKeys];

    this.makeMetaByMetaKey = makeMetaByMetaKeysFactory(allMetaKeysList);

    this.lap("ready");

    const elapsed = timeSource.now() - this.startTime;

    /*
    console.log(`Planning took ${elapsed.toFixed(1)}ms`);
    const entries: Array<{ process: string; duration: string }> = [];
    for (const lap of this.laps) {
      const elapsed = lap.elapsed;
      entries.push({
        process: `${lap.category}${
          lap.subcategory ? `[${lap.subcategory}]` : ``
        }`,
        duration: `${elapsed.toFixed(1)}ms`,
      });
    }
    console.table(entries);
    */

    // Allow this to be garbage collected
    this.optimizeMeta = null as any;
    context?.grafastMetricsEmitter?.emit("plan", {
      elapsed,
      laps: this.laps,
    });

    if (planningTimeoutWarmupMultiplier > 1) {
      planningTimeoutWarmupMultiplier = Math.max(
        1,
        planningTimeoutWarmupMultiplier - 0.5,
      );
    }
  }

  private lap(category: string, subcategory?: string): void {
    const now = timeSource.now();
    const elapsed = now - this.previousLap;
    this.previousLap = now;
    this.laps.push({ category, subcategory, elapsed });
  }

  private checkTimeout() {
    if (this.planningTimeout === null) return;
    const now = timeSource.now();
    const elapsed = now - this.startTime;
    if (elapsed > this.planningTimeout * planningTimeoutWarmupMultiplier) {
      throw new SafeError(
        "Operation took too long to plan and was aborted. Please simplify the request and try again.",
        {
          [$$timeout]: this.planningTimeout,
          [$$ts]: now,
        },
      );
    }
  }

  /**
   * Called by the LayerPlan's constructor when it wants to get a new id to use.
   *
   * @internal
   */
  public addLayerPlan(layerPlan: LayerPlan) {
    return this.stepTracker.addLayerPlan(layerPlan);
  }

  /**
   * Adds a plan to the known steps and returns the number to use as the plan
   * id. ONLY to be used from Step, user code should never call this directly.
   *
   * @internal
   */
  public _addStep(plan: Step): number {
    if (!["plan", "validate", "optimize"].includes(this.phase)) {
      throw new Error(
        `Creating a plan during the '${this.phase}' phase is forbidden.`,
      );
    }
    return this.stepTracker.addStep(plan);
  }

  /** @internal Use plan.getStep(id) instead. */
  public getStep: (id: number, requestingStep: Step) => Step = isDev
    ? (id, requestingStep) => {
        if (!["plan", "validate", "optimize"].includes(this.phase)) {
          throw new Error(
            `Getting a step during the '${this.phase}' phase is forbidden - please do so before or during the optimize phase.`,
          );
        }

        // Check that requestingStep is allowed to get steps
        if (
          requestingStep.isOptimized &&
          (this.phase !== "optimize" ||
            !requestingStep.allowMultipleOptimizations)
        ) {
          throw new Error(
            `Optimized step ${requestingStep} is not permitted to request other steps (requested '${id}')`,
          );
        }

        const step = this.stepTracker.getStepById(id);
        if (step == null) {
          throw new Error(
            `Programming error: step with id '${id}' no longer exists (attempted access from ${requestingStep}). Most likely this means that ${requestingStep} has an illegal reference to this step, you should only maintain references to steps via dependencies.`,
          );
        }
        return step[$$proxy] ?? step;
      }
    : (id, _requestingStep) => {
        const step = this.stepTracker.getStepById(id);
        return step[$$proxy] ?? step;
      };

  /**
   * Get a plan without specifying who requested it; this disables all the
   * caller checks. Only intended to be called from internal code.
   *
   * @internal
   */
  public dangerouslyGetStep(id: number): Step {
    return this.stepTracker.getStepById(id);
  }

  private planOperation() {
    try {
      switch (this.operationType) {
        case "query": {
          this.planQuery();
          break;
        }
        case "mutation": {
          this.planMutation();
          break;
        }
        case "subscription": {
          this.planSubscription();
          break;
        }
        default: {
          const never: never = this.operationType;
          throw new SafeError(`Unsupported operation type '${never}'.`);
        }
      }
    } catch (e) {
      // LOGGING: raise this somewhere critical
      if (this.loc != null) {
        console.error(
          `Error occurred during query planning (at ${this.loc.join(
            " > ",
          )}): \n${e.stack || e}`,
        );
      } else {
        console.error(
          `Error occurred during query planning: \n${e.stack || e}`,
        );
      }
      throw new Error(`Query planning error: ${e.message}`, { cause: e });
    }
  }

  /**
   * Plans a GraphQL query operation.
   */
  private planQuery(): void {
    if (this.loc !== null) this.loc.push("planQuery()");
    const rootType = this.queryType;
    if (!rootType) {
      throw new SafeError("No query type found in schema");
    }
    const locationDetails: LocationDetails = {
      node: this.operation.selectionSet.selections,
      parentTypeName: null,
      // WHAT SHOULD fieldName be here?!
      fieldName: null,
    };
    const outputPlan = new OutputPlan(
      this.rootLayerPlan,
      this.rootValueStep,
      {
        mode: "root",
        typeName: this.queryType.name,
      },
      locationDetails,
    );
    this.rootOutputPlan = outputPlan;
    this.queueNextLayer(this.planSelectionSet, {
      outputPlan,
      path: [],
      planningPath: rootType.name + ".",
      polymorphicPaths: POLYMORPHIC_ROOT_PATHS,
      parentStep: this.trackedRootValueStep,
      positionType: rootType,
      layerPlan: this.rootLayerPlan,
      selections: this.operation.selectionSet.selections,
      resolverEmulation: true,
    });
    this.planPending();
    if (this.loc !== null) this.loc.pop();
  }

  /**
   * Implements the `PlanOpPlanMutation` algorithm.
   */
  private planMutation(): void {
    if (this.loc !== null) this.loc.push("planMutation()");
    const rootType = this.mutationType;
    if (!rootType) {
      throw new SafeError("No mutation type found in schema");
    }

    const locationDetails: LocationDetails = {
      node: this.operation.selectionSet.selections,
      parentTypeName: null,
      // WHAT SHOULD fieldName be here?!
      fieldName: null,
    };
    const outputPlan = new OutputPlan(
      this.rootLayerPlan,
      this.rootValueStep,
      {
        mode: "root",
        typeName: rootType.name,
      },
      locationDetails,
    );
    this.rootOutputPlan = outputPlan;
    this.queueNextLayer(this.planSelectionSet, {
      outputPlan,
      path: [],
      planningPath: rootType.name + ".",
      polymorphicPaths: POLYMORPHIC_ROOT_PATHS,
      parentStep: this.trackedRootValueStep,
      positionType: rootType,
      layerPlan: this.rootLayerPlan,
      selections: this.operation.selectionSet.selections,
      resolverEmulation: true,
      isMutation: true,
    });
    this.planPending();
    if (this.loc !== null) this.loc.pop();
  }

  /**
   * Implements the `PlanOpPlanSubscription` algorithm.
   */
  private planSubscription(): void {
    if (this.loc !== null) this.loc.push("planSubscription");
    const rootType = this.subscriptionType;
    if (!rootType) {
      throw new SafeError("No subscription type found in schema");
    }
    const planningPath = rootType.name + ".";
    const selectionSet = this.operation.selectionSet;
    const stepStreamOptions = {};
    const groupedFieldSet = withGlobalLayerPlan(
      this.rootLayerPlan,
      POLYMORPHIC_ROOT_PATHS,
      planningPath,
      stepStreamOptions,
      graphqlCollectFields,
      null,
      this,
      this.trackedRootValueStep.id,
      rootType,
      selectionSet.selections,
      newSelectionSetDigest(false),
    );
    if (groupedFieldSet.deferred !== undefined) {
      throw new SafeError(
        "@defer forbidden on subscription root selection set",
      );
    }
    let firstKey: string | undefined = undefined;
    for (const key of groupedFieldSet.fields.keys()) {
      if (firstKey !== undefined) {
        throw new SafeError("subscriptions may only have one top-level field");
      }
      firstKey = key;
    }
    assert.ok(firstKey != null, "selection set cannot be empty");
    const fields = groupedFieldSet.fields.get(firstKey);
    if (!fields) {
      throw new SafeError("Consistency error.");
    }
    // All grouped fields are equivalent, as mandated by GraphQL validation rules. Thus we can take the first one.
    const field = fields[0];
    const fieldName = field.name.value; // Unaffected by alias.
    const rootTypeFields = rootType.getFields();
    const fieldSpec: GraphQLField<unknown, unknown> = rootTypeFields[fieldName];
    const rawSubscriptionPlanResolver =
      fieldSpec.extensions?.grafast?.subscribePlan;
    const path = [field.alias?.value ?? fieldName];
    const locationDetails: LocationDetails = {
      parentTypeName: rootType.name,
      fieldName,
      node: this.operation.selectionSet.selections,
    };

    const subscriptionPlanResolver = rawSubscriptionPlanResolver;

    const fieldArgsSpec = fieldSpec.args;
    const trackedArguments =
      fieldArgsSpec.length > 0
        ? withGlobalLayerPlan(
            this.rootLayerPlan,
            POLYMORPHIC_ROOT_PATHS,
            planningPath,
            stepStreamOptions,
            this.getTrackedArguments,
            this,
            fieldArgsSpec,
            field,
          )
        : NO_ARGS;

    if (subscriptionPlanResolver !== undefined) {
      // PERF: optimize this
      const {
        haltTree,
        step: subscribeStep,
        latestSideEffectStep,
      } = this.batchPlanField({
        typeName: rootType.name,
        fieldName,
        layerPlan: this.rootLayerPlan,
        path,
        polymorphicPaths: POLYMORPHIC_ROOT_PATHS,
        planningPath,
        planResolver: subscriptionPlanResolver,
        applyAfterMode: "subscribePlan",
        rawParentStep: this.trackedRootValueStep,
        field: fieldSpec,
        trackedArguments,
        streamDetails: true,
      })();
      if (haltTree) {
        throw new SafeError("Failed to setup subscription");
      }
      this.rootLayerPlan.latestSideEffectStep = latestSideEffectStep;
      this.rootLayerPlan.setRootStep(subscribeStep);

      const subscriptionEventLayerPlan = new LayerPlan(this, {
        type: "subscription",
        parentLayerPlan: this.rootLayerPlan,
      });

      const $__item = withGlobalLayerPlan(
        subscriptionEventLayerPlan,
        POLYMORPHIC_ROOT_PATHS,
        planningPath,
        null,
        () => new __ItemStep(subscribeStep),
      );
      subscriptionEventLayerPlan.setRootStep($__item);
      const streamItemPlan = hasItemPlan(subscribeStep)
        ? withGlobalLayerPlan(
            subscriptionEventLayerPlan,
            POLYMORPHIC_ROOT_PATHS,
            planningPath,
            null,
            subscribeStep.itemPlan,
            subscribeStep,
            $__item,
          )
        : $__item;

      const outputPlan = new OutputPlan(
        subscriptionEventLayerPlan,
        this.rootValueStep,
        { mode: "root", typeName: rootType.name },
        locationDetails,
      );
      this.rootOutputPlan = outputPlan;
      this.queueNextLayer(this.planSelectionSet, {
        outputPlan,
        path: [],
        planningPath,
        polymorphicPaths: POLYMORPHIC_ROOT_PATHS,
        parentStep: streamItemPlan,
        positionType: rootType,
        layerPlan: subscriptionEventLayerPlan,
        selections: selectionSet.selections,
        resolverEmulation: false,
      });
      this.planPending();
    } else {
      const subscribeStep = withGlobalLayerPlan(
        this.rootLayerPlan,
        POLYMORPHIC_ROOT_PATHS,
        planningPath,
        null,
        () => {
          const $args = object(trackedArguments);
          const rawResolver = fieldSpec.resolve;
          const rawSubscriber = fieldSpec.subscribe;
          return graphqlResolver(
            rawResolver,
            rawSubscriber,
            this.trackedRootValueStep,
            $args,
            {
              ...this.resolveInfoOperationBase,
              fieldName,
              fieldNodes: fields,
              parentType: this.subscriptionType!,
              returnType: fieldSpec.type,
              // @ts-ignore
              path: {
                typename: this.subscriptionType!.name,
                key: fieldName,
                prev: undefined,
              },
            },
          );
        },
      );
      subscribeStep._stepOptions.stream = stepStreamOptions;
      // Note this should only have one dependent, so it should not be a
      // distributor
      subscribeStep._stepOptions.walkIterable = true;

      this.rootLayerPlan.setRootStep(subscribeStep);

      const subscriptionEventLayerPlan = new LayerPlan(this, {
        type: "subscription",
        parentLayerPlan: this.rootLayerPlan,
      });

      const $__item = withGlobalLayerPlan(
        subscriptionEventLayerPlan,
        POLYMORPHIC_ROOT_PATHS,
        planningPath,
        null,
        () => new __ItemStep(subscribeStep),
      );

      subscriptionEventLayerPlan.setRootStep($__item);

      const streamItemPlan = hasItemPlan(subscribeStep)
        ? withGlobalLayerPlan(
            subscriptionEventLayerPlan,
            POLYMORPHIC_ROOT_PATHS,
            planningPath,
            null,
            subscribeStep.itemPlan,
            subscribeStep,
            $__item,
          )
        : $__item;

      const outputPlan = new OutputPlan(
        subscriptionEventLayerPlan,
        this.rootValueStep,
        { mode: "root", typeName: rootType.name },
        locationDetails,
      );
      this.rootOutputPlan = outputPlan;
      this.queueNextLayer(this.planSelectionSet, {
        outputPlan,
        path: [],
        planningPath,
        polymorphicPaths: POLYMORPHIC_ROOT_PATHS,
        parentStep: streamItemPlan,
        positionType: rootType,
        layerPlan: subscriptionEventLayerPlan,
        selections: selectionSet.selections,
        resolverEmulation: true,
      });
      this.planPending();
    }
    if (this.loc !== null) this.loc.pop();
  }

  private getCombinedLayerPlanForLayerPlans(
    setOfParentLayerPlans: ReadonlySet<LayerPlan>,
  ) {
    const parentLayerPlans = [...setOfParentLayerPlans];

    // See if one already exists with the same layer plans in the same order
    for (const lp of this.stepTracker.layerPlans) {
      if (
        lp?.reason.type === "combined" &&
        arraysMatch(parentLayerPlans, lp.reason.parentLayerPlans)
      ) {
        return lp;
      }
    }

    return new LayerPlan(this, {
      type: "combined",
      parentLayerPlans,
    });
  }

  /**
   * Gets the item plan for a given parent list plan - this ensures we only
   * create one item plan per parent plan.
   */
  private itemStepForListStep<TData>(
    parentLayerPlan: LayerPlan,
    planningPath: string,
    listStep: Step<TData> | Step<TData[]>,
    depth: number,
    stream: LayerPlanReasonListItemStream | undefined,
  ): __ItemStep<TData> {
    const itemStepIdByListStepId =
      (this.itemStepIdByListStepIdByParentLayerPlanId[parentLayerPlan.id] ??=
        Object.create(null));
    const itemStepId = itemStepIdByListStepId[listStep.id];
    if (itemStepId !== undefined) {
      const itemStep = this.stepTracker.getStepById(
        itemStepId,
      ) as __ItemStep<TData>;
      if (
        listStep.polymorphicPaths !== null &&
        itemStep.polymorphicPaths !== null
      ) {
        for (const p of intersectPolyPaths(
          listStep.polymorphicPaths,
          polymorphicPathsForLayer(parentLayerPlan),
        )!) {
          (itemStep.polymorphicPaths as Set<string>).add(p);
        }
      }
      return itemStep;
    }
    // Create a new LayerPlan for this list item
    const layerPlan = new LayerPlan(this, {
      type: "listItem",
      parentLayerPlan,
      parentStep: listStep,
      stream,
    });
    const itemStep = withGlobalLayerPlan(
      layerPlan,
      intersectPolyPaths(
        listStep.polymorphicPaths,
        polymorphicPathsForLayer(layerPlan),
      ),
      planningPath,
      null,
      () => new __ItemStep(listStep, depth),
    );
    layerPlan.setRootStep(itemStep);
    itemStepIdByListStepId[listStep.id] = itemStep.id;
    return itemStep;
  }

  *processGroupedFieldSet(details: ProcessGroupedFieldSetDetails) {
    const {
      outputPlan,
      path,
      planningPath,
      polymorphicPaths,
      parentStep,
      positionType: objectType,
      // layerPlan,
      objectTypeFields,
      isMutation,
      groupedFieldSet,
    } = details;
    // `__typename` shouldn't bump the mutation index since it has no side effects.
    let mutationIndex = -1;
    const $sideEffect = outputPlan.layerPlan.latestSideEffectStep;
    for (const [responseKey, fieldNodes] of groupedFieldSet.fields.entries()) {
      let resolverEmulation = groupedFieldSet.resolverEmulation;
      try {
        // All grouped fields are equivalent, as mandated by GraphQL validation rules. Thus we can take the first one.
        const field = fieldNodes[0];
        const fieldName = field.name.value;

        const locationDetails: LocationDetails = {
          parentTypeName: objectType.name,
          fieldName,
          node: fieldNodes,
        };

        // explicit matches are the fastest: https://jsben.ch/ajZNf
        if (fieldName === "__typename") {
          outputPlan.addChild(objectType, responseKey, {
            type: "__typename",
            locationDetails,
          });
          continue;
        } else if (fieldName === "__schema" || fieldName === "__type") {
          const variableNames = findVariableNamesUsed(this, field);
          outputPlan.addChild(objectType, responseKey, {
            type: "outputPlan",
            isNonNull: fieldName === "__schema",
            outputPlan: new OutputPlan(
              outputPlan.layerPlan,
              this.rootValueStep,
              {
                mode: "introspection",
                field,
                variableNames,
                // PERF: if variableNames.length === 0 we should be able to optimize this!
                introspectionCacheByVariableValues: new LRU({
                  maxLength: 3,
                }),
              },
              locationDetails,
            ),
            locationDetails,
          });
          continue;
        }

        const objectField = objectTypeFields[fieldName];
        if (!objectField) {
          // Field does not exist; this should have been caught by validation
          // but the spec says to just skip it.
          continue;
        }

        const fieldType = objectField.type;
        const rawPlanResolver = objectField.extensions?.grafast?.plan;
        if (rawPlanResolver) {
          resolverEmulation = false;
          assertNotAsync(
            rawPlanResolver,
            `${objectType.name}.${fieldName}.plan`,
          );
        }
        const namedReturnType = getNamedType(fieldType);

        const resolvedResolver = objectField.resolve as
          | GraphQLFieldResolver<any, any>
          | undefined;
        const subscriber = objectField.subscribe;

        const usesDefaultResolver =
          resolvedResolver == null || resolvedResolver === defaultFieldResolver;

        // We should use a resolver if:
        // 1. they give us a non-default resolver
        // 2. we're emulating resolvers
        const resolver =
          resolvedResolver && !usesDefaultResolver
            ? resolvedResolver
            : resolverEmulation
              ? defaultFieldResolver
              : null;

        // Apply a default plan to fields that do not have a plan nor a resolver.
        const planResolver =
          rawPlanResolver ?? (resolver ? undefined : defaultPlanResolver);

        /*
         *  When considering resolvers on fields, there's three booleans to
         *  consider:
         *
         *  - typeIsPlanned: Does the type the field is defined on expect a plan?
         *    - NOTE: the root types (Query, Mutation, Subscription) implicitly
         *      expect the "root plan"
         *  - fieldHasPlan: Does the field define a `plan()` method?
         *  - resultIsPlanned: Does the named type that the field returns (the
         *    "named field type") expect a plan?
         *    - NOTE: only object types, unions and interfaces may expect plans;
         *      but not all of them do.
         *    - NOTE: a union/interface expects a plan iff ANY of its object
         *      types expect plans
         *    - NOTE: if ANY object type in an interface/union expects a plan
         *      then ALL object types within the interface/union must expect
         *      plans.
         *    - NOTE: scalars and enums never expect a plan.
         *
         *  These booleans impact:
         *
         *  - Whether there must be a `plan()` declaration and what the "parent"
         *    argument is to the same
         *    - If typeIsPlanned:
         *      - Assert: `fieldHasPlan` must be true
         *      - Pass through the parent plan
         *    - Else, if resultIsPlanned:
         *      - Assert: `fieldHasPlan` must be true
         *      - Pass through a `__ValueStep` representing the parent value.
         *    - Else, if fieldHasPlan:
         *      - Pass through a `__ValueStep` representing the parent value.
         *    - Else
         *      - No action necessary.
         *  - If the field may define `resolve()` and what the "parent" argument
         *    is to the same
         *    - If resultIsPlanned
         *      - Assert: there must not be a `resolve()`
         *      - Grafast provides pure resolver.
         *    - Else if fieldHasPlan (which may be implied by typeIsPlanned
         *      above)
         *      - If `resolve()` is not set:
         *        - grafast will return the value from the plan directly
         *      - Otherwise:
         *        - Grafast will wrap this resolver and will call `resolve()` (or
         *          default resolver) with the plan result.  IMPORTANT: you may
         *          want to use an `ObjectStep` so that the parent object is of
         *          the expected shape; e.g. your plan might return
         *          `object({username: $username})` for a `User.username` field.
         *    - Else
         *      - Leave `resolve()` untouched - do not even wrap it.
         *      - (Failing that, use a __ValueStep and return the result
         *        directly.)
         */

        if (resolver !== null) {
          this.pure = false;
          if (!rawPlanResolver) {
            resolverEmulation = true;
          }
        }

        const resultIsPlanned = isTypePlanned(this.schema, namedReturnType);
        const fieldHasPlan = !!planResolver;

        if (
          resultIsPlanned &&
          !fieldHasPlan &&
          !objectType.extensions?.grafast?.assertStep
        ) {
          throw new Error(
            `Field ${objectType.name}.${fieldName} returns a ${namedReturnType.name} which expects a plan to be available; however this field has no plan() method to produce such a plan; please add 'extensions.grafast.plan' to this field.`,
          );
        }

        if (resultIsPlanned && resolver) {
          throw new Error(
            `Field ${objectType.name}.${fieldName} returns a ${namedReturnType.name} which expects a plan to be available; this means that ${objectType.name}.${fieldName} is forbidden from defining a GraphQL resolver.`,
          );
        }

        let step: Step;
        let haltTree = false;
        const fieldLayerPlan = isMutation
          ? new LayerPlan(this, {
              type: "mutationField",
              parentLayerPlan: outputPlan.layerPlan,
              mutationIndex: ++mutationIndex,
            })
          : outputPlan.layerPlan;
        const objectFieldArgs = objectField.args;
        const fieldPath = [...path, responseKey];
        const fieldPlanningPath = planningPath + responseKey;
        const trackedArguments =
          objectFieldArgs.length > 0
            ? withGlobalLayerPlan(
                this.rootLayerPlan,
                POLYMORPHIC_ROOT_PATHS,
                fieldPlanningPath,
                null,
                this.getTrackedArguments,
                this,
                objectFieldArgs,
                field,
              )
            : NO_ARGS;
        let streamDetails: StreamDetails | null = null;
        const isList = isListType(getNullableType(fieldType));
        if (isList) {
          // read the @stream directive, if present
          // TODO: Check SameStreamDirective still exists in @stream spec at release.
          /*
           * `SameStreamDirective`
           * (https://github.com/graphql/graphql-spec/blob/26fd78c4a89a79552dcc0c7e0140a975ce654400/spec/Section%205%20--%20Validation.md#L450-L458)
           * ensures that every field that has `@stream` must have the same
           * `@stream` arguments; so we can just check the first node in the
           * merged set to see our stream options. NOTE: if this changes before
           * release then we may need to find the stream with the largest
           * `initialCount` to figure what to do; something like:
           *
           *      const streamDirective = firstField.directives?.filter(
           *        (d) => d.name.value === "stream",
           *      ).sort(
           *        (a, z) => getArg(z, 'initialCount', 0) - getArg(a, 'initialCount', 0)
           *      )[0]
           */

          for (const n of fieldNodes) {
            const streamDirective = n.directives?.find(
              (d) => d.name.value === "stream",
            );
            if (streamDirective === undefined) {
              // Undo any previous stream details; the non-@stream wins.
              streamDetails = null;
              break;
            } else if (streamDetails !== null) {
              // Validation promises the values are the same
              continue;
            } else {
              // Create streamDetails
              streamDetails = this.withRootLayerPlan(() => ({
                initialCount: this.internalDependency(
                  directiveArgument<number>(
                    this,
                    streamDirective,
                    "initialCount",
                    graphql.Kind.INT,
                  ) ?? constant(0),
                ),
                if: this.internalDependency(
                  directiveArgument<boolean>(
                    this,
                    streamDirective,
                    "if",
                    graphql.Kind.BOOLEAN,
                  ) ?? constant(true),
                ),
                label: this.internalDependency(
                  directiveArgument<Maybe<string>>(
                    this,
                    streamDirective,
                    "label",
                    graphql.Kind.STRING,
                  ) ?? constant(undefined),
                ),
              }));
            }
          }
        }
        if (typeof planResolver === "function") {
          let latestSideEffectStep: Step | null;
          ({ step, haltTree, latestSideEffectStep } = yield this.batchPlanField(
            {
              typeName: objectType.name,
              fieldName,
              layerPlan: fieldLayerPlan,
              path: fieldPath,
              polymorphicPaths,
              planningPath: fieldPlanningPath,
              planResolver,
              applyAfterMode: "plan",
              rawParentStep: parentStep,
              field: objectField,
              trackedArguments,
              streamDetails: isList ? (streamDetails ?? false) : null,
            },
          ));
          fieldLayerPlan.latestSideEffectStep = latestSideEffectStep;
        } else {
          // No plan resolver (or plan resolver fallback) so there must be a
          // `resolve` method, so we'll feed the full parent step into the
          // resolver.
          assert.ok(
            resolver !== null,
            "GraphileInternalError<81652257-617a-4d1a-8306-903d0e3d2ddf>: The field has no resolver, so planResolver should exist (either as the field.plan or as the default plan resolver).",
          );
          // ENHANCEMENT: should we do `step = parentStep.object()` (i.e.
          // `$pgSelectSingle.record()`) or similar for "opaque" steps to become
          // suitable for consumption by resolvers?
          // Maybe `parentStep.forResolver()` or `parentStep.hydrate()` or `parentStep.toFullObject()`?
          step = parentStep;
        }

        if (resolver !== null) {
          step = withGlobalLayerPlan(
            fieldLayerPlan,
            polymorphicPaths,
            fieldPlanningPath,
            null, // TODO: fix me?
            () => {
              const $args = object(trackedArguments);
              return graphqlResolver(resolver, subscriber, step, $args, {
                ...this.resolveInfoOperationBase,
                fieldName,
                fieldNodes,
                parentType: objectType,
                returnType: fieldType,
              });
            },
          );
        }

        // May have changed due to deduplicate
        step = this.stepTracker.getStepById(step.id);
        if (haltTree) {
          // Very similar to this.handlePlanningError. Should probably use it in future.
          const isNonNull = isNonNullType(fieldType);
          outputPlan.addChild(objectType, responseKey, {
            type: "outputPlan",
            outputPlan: new OutputPlan(
              fieldLayerPlan,
              step,
              OUTPUT_PLAN_TYPE_NULL,
              locationDetails,
            ),
            isNonNull,
            locationDetails,
          });
        } else {
          if (isDev && polymorphicPaths) {
            const invalid = [...polymorphicPaths].filter(
              (p) => !stepIsValidInPolyPath(step, p),
            );
            if (invalid.length > 0) {
              throw new Error(
                `${objectType}.${fieldName} (as ${responseKey}) returned ${step}, but that's not valid in ${invalid.length} out of ${polymorphicPaths.size} of the expected polymorphic paths. Invalid paths: ${invalid}`,
              );
            }
          }
          outputPlan.expectChild(objectType, responseKey);
          this.queueNextLayer(this.planFieldReturnType, {
            outputPlan,
            path: fieldPath,
            planningPath: fieldPlanningPath,
            polymorphicPaths,
            parentStep: step,
            positionType: fieldType,
            layerPlan: fieldLayerPlan,
            // If one field has a selection set, they all have a selection set (guaranteed by validation).
            selections:
              field.selectionSet != null
                ? fieldNodes.flatMap((n) => n.selectionSet!.selections)
                : undefined,
            parentObjectType: objectType,
            responseKey,
            locationDetails,
            resolverEmulation,
            streamDetails,
          });
        }
      } finally {
        outputPlan.layerPlan.latestSideEffectStep = $sideEffect;
      }
    }
    if (groupedFieldSet.deferred !== undefined) {
      for (const deferred of groupedFieldSet.deferred) {
        const deferredLayerPlan = new LayerPlan(this, {
          type: "defer",
          parentLayerPlan: outputPlan.layerPlan,
          label: deferred.label,
        });
        const deferredOutputPlan = new OutputPlan(
          deferredLayerPlan,
          outputPlan.rootStep,
          {
            mode: "object",
            deferLabel: deferred.label,
            typeName: objectType.name,
          },
          // LOGGING: the location details should be tweaked to reference this
          // fragment
          outputPlan.locationDetails,
        );
        const $sideEffect = deferredOutputPlan.layerPlan.latestSideEffectStep;
        try {
          outputPlan.deferredOutputPlans.push(deferredOutputPlan);
          this.queueNextLayer(this.processGroupedFieldSet, {
            outputPlan: deferredOutputPlan,
            path,
            planningPath: planningPath + "#",
            polymorphicPaths,
            parentStep,
            positionType: objectType,
            layerPlan: deferredLayerPlan,
            objectTypeFields,
            isMutation,
            groupedFieldSet: deferred,
          });
        } finally {
          deferredOutputPlan.layerPlan.latestSideEffectStep = $sideEffect;
        }
      }
    }
  }

  /**
   *
   * @param outputPlan - The output plan that this selection set is being added to
   * @param path - The path within the outputPlan that we're adding stuff (only for root/object OutputPlans)
   * @param parentStep - The step that represents the selection set root
   * @param objectType - The object type that this selection set is being evaluated for (note polymorphic selection should already have been handled by this point)
   * @param selections - The GraphQL selections (fields, fragment spreads, inline fragments) to evaluate
   * @param isMutation - If true this selection set should be executed serially rather than in parallel (each field gets its own LayerPlan)
   */
  private planSelectionSet(details: PlanSelectionSetDetails) {
    const {
      outputPlan,
      path,
      planningPath,
      polymorphicPaths,
      parentStep,
      positionType: objectType,
      layerPlan,
      selections,
      resolverEmulation,
      isMutation = false,
    } = details;
    if (this.loc !== null) {
      this.loc.push(
        `planSelectionSet(${objectType.name} @ ${
          outputPlan.layerPlan.id
        } @ ${path.join(".")} @ ${polymorphicPaths ? [...polymorphicPaths] : ""})`,
      );
    }

    if (isDev) {
      assertObjectType(objectType);
      if (outputPlan.layerPlan !== layerPlan) {
        throw new Error(
          `GrafastInternalError<3ea1a3dd-1e11-4eb7-a31b-e125996d7eb4>: expected ${outputPlan} to have layer plan ${layerPlan}`,
        );
      }
    }
    const groupedFieldSet = withGlobalLayerPlan(
      layerPlan,
      polymorphicPaths,
      planningPath,
      null,
      graphqlCollectFields,
      null,
      this,
      parentStep.id,
      objectType,
      selections,
      newSelectionSetDigest(resolverEmulation),
      isMutation,
    );
    const objectTypeFields = objectType.getFields();
    this.queueNextLayer(this.processGroupedFieldSet, {
      outputPlan,
      path,
      planningPath: planningPath + ">",
      polymorphicPaths,
      parentStep,
      positionType: objectType,
      layerPlan,
      objectTypeFields,
      isMutation,
      groupedFieldSet,
    });

    if (this.loc !== null) this.loc.pop();
  }

  // This is the queue of things to be done _IN ORDER_
  private planningQueue: Array<QueueTuple<any>> = [];
  // This is the queue of things to be done grouped by their planning path.
  // The result of this is not necessarily in order, but it does save us
  // time and effort in `planPending()`
  private planningQueueByPlanningPath = new Map<
    string,
    Array<QueueTuple<any>>
  >();

  private queueNextLayer<TDetails extends CommonPlanningDetails<any>>(
    method: (details: TDetails) => void | Generator<() => any, void, any>,
    details: TDetails,
  ): void {
    const { planningPath } = details;
    if (this.frozenPlanningPaths?.has(planningPath)) {
      throw new Error(
        `GrafastInternalError<93c64f55-4f3f-442f-a17b-391e28bd3629>: Already processed planning path ${planningPath}`,
      );
    }
    let list = this.planningQueueByPlanningPath.get(planningPath);
    if (!list) {
      list = [];
      this.planningQueueByPlanningPath.set(planningPath, list);
    }
    const tuple: QueueTuple<TDetails> = [
      method,
      details,
      this.loc ? [...this.loc] : null,
      details.layerPlan,
      details.layerPlan.latestSideEffectStep,
    ];
    this.planningQueue.push(tuple);
    list.push(tuple);
  }

  private planPending() {
    for (let depth = 0; depth <= this.maxPlanningDepth; depth++) {
      // Process the next batch

      const l = this.planningQueue.length;
      if (l === 0) break;
      if (depth === this.maxPlanningDepth) {
        throw new Error(
          `Query is too complex, Grafast refuses to continue processing at planning depth ${this.maxPlanningDepth}. You can configure this through \`preset.grafast.maxPlanningDepth\``,
        );
      }

      // NOTE: `batch` and `todo` are different views of the same information,
      // specifically: `batch` is stored in the order in which the calls were
      // made (critical for ensuring the OutputPlans output fields in the
      // correct order); whereas `todo` is the result of grouping `batch` into
      // groups where the planning paths match.
      const batch = this.planningQueue.slice(0, l);
      const todo: Todo = [...this.planningQueueByPlanningPath.entries()];
      // Now clear the stores ready to start collecting the next lot.
      this.planningQueue.length = 0;
      this.planningQueueByPlanningPath.clear();

      // First, do a planning-path-aware deduplicate
      this.deduplicateSteps();

      // Update the step references (and freeze the paths)
      for (const [planningPath, batch] of todo) {
        if (this.frozenPlanningPaths?.has(planningPath)) {
          throw new Error(
            `GrafastInternalError<dd30288e-9375-4025-91a6-66b64e74cf74>: planning path already processed - ${planningPath}`,
          );
        }
        this.frozenPlanningPaths?.add(planningPath);
        for (const entry of batch) {
          const step = entry[1].parentStep;
          const actualStep = this.stepTracker.getStepById(step.id);
          if (actualStep !== step) {
            entry[1].parentStep = actualStep;
          }
        }
      }

      // Then, apply the per-method batch tweaks (such as resolving
      // polymorphism)
      this.mutateTodos(todo);

      const DONE = Symbol("done");
      /** Our generators, for batching */
      interface GennySpec {
        genny: Generator<() => any, void, any>;
        loc: string[] | null;
        layerPlan: LayerPlan;
        layerPlanLatestSideEffect: Step | null;
        result: any;
      }
      const gennies: Array<GennySpec> = [];

      // Finally plan this layer
      for (const [
        fn,
        rawDetails,
        loc,
        originalLayerPlan,
        layerPlanLatestSideEffect,
      ] of batch) {
        const details = rawDetails as CommonPlanningDetails;
        this.withLocLpSE(
          loc,
          originalLayerPlan,
          layerPlanLatestSideEffect,
          () => {
            /** Still just genny from the block */
            const genny = fn.call(this, details);
            if (genny != null) {
              gennies.push({
                genny,
                loc,
                layerPlan: details.layerPlan,
                layerPlanLatestSideEffect:
                  details.layerPlan.latestSideEffectStep,
                result: undefined,
              });
            }
          },
        );
      }

      // And go through all the generators
      while (gennies.length > 0) {
        const cbs: Array<{ spec: GennySpec; cb: () => any }> = [];
        for (const spec of gennies) {
          const { genny, loc, layerPlan, layerPlanLatestSideEffect, result } =
            spec;
          this.withLocLpSE(loc, layerPlan, layerPlanLatestSideEffect, () => {
            const r = genny.next(result);
            if (r.done) {
              spec.result = DONE;
            } else {
              cbs.push({ spec, cb: r.value });
            }
          });
        }
        for (const { spec, cb } of cbs) {
          spec.result = cb();
        }
        // Remove the generators that are done.
        for (let i = gennies.length - 1; i >= 0; i--) {
          if (gennies[i].result === DONE) {
            gennies.splice(i, 1);
          }
        }
      }
    }

    // A final deduplicate
    this.deduplicateSteps();
  }

  withLocLpSE(
    loc: string[] | null,
    layerPlan: LayerPlan,
    layerPlanLatestSideEffect: Step | null,
    cb: () => void,
  ) {
    const $sideEffect = layerPlan.latestSideEffectStep;
    layerPlan.latestSideEffectStep = layerPlanLatestSideEffect;
    try {
      const prevLoc = this.loc;
      this.loc = loc;
      cb();
      this.loc = prevLoc;
    } finally {
      layerPlan.latestSideEffectStep = $sideEffect;
    }
  }

  private mutateTodos(todo: Todo) {
    for (const [_planningPath, batch] of todo) {
      const polymorphicResolveTypeEntriesByPolyType = new Map<
        GraphQLUnionType | GraphQLInterfaceType,
        Array<PolymorphicResolveTypeDetails>
      >();
      const planFieldReturnTypeEntriesByStepByLayerPlan = new Map<
        LayerPlan,
        Map<Step, Array<PolymorphicPlanObjectTypeDetails>>
      >();
      for (const entry of batch) {
        const [method, rawArgs] = entry;

        // Tidy up after dedupe
        rawArgs.parentStep = this.stepTracker.getStepById(
          rawArgs.parentStep.id,
        );

        if (method === this.polymorphicResolveType) {
          const args = rawArgs as PolymorphicResolveTypeDetails;
          const polyType = args.positionType;
          if (!isUnionType(polyType) && !isInterfaceType(polyType)) {
            throw new Error(
              `GrafastInternalError<b0a276d0-134f-4a26-9c33-00af5ead38e6>: expected ${polyType} to be an interface or union type`,
            );
          }
          let list = polymorphicResolveTypeEntriesByPolyType.get(polyType);
          if (!list) {
            list = [];
            polymorphicResolveTypeEntriesByPolyType.set(polyType, list);
          }
          list.push(args);
        } else if (method == this.polymorphicPlanObjectType) {
          const args = rawArgs as PolymorphicPlanObjectTypeDetails;
          const lp = args.layerPlan;
          let planFieldReturnTypeEntriesByStep =
            planFieldReturnTypeEntriesByStepByLayerPlan.get(lp);
          if (!planFieldReturnTypeEntriesByStep) {
            planFieldReturnTypeEntriesByStep = new Map();
            planFieldReturnTypeEntriesByStepByLayerPlan.set(
              lp,
              planFieldReturnTypeEntriesByStep,
            );
          }
          const step = args.parentStep;
          let list = planFieldReturnTypeEntriesByStep.get(step);
          if (list) {
            list.push(args);
          } else {
            list = [args];
            planFieldReturnTypeEntriesByStep.set(step, list);
          }
        }
      }

      // Handle calls to `polymorphicResolveType` by performing the combined
      // layer plan / `planType` shuffle.
      for (const [
        graphqlType,
        // A list of all the `details` argument objects capture for this type
        detailsRecordList,
      ] of polymorphicResolveTypeEntriesByPolyType) {
        const firstDetailsRecord = detailsRecordList[0];

        // All of these properties should be in common
        // const path = firstDetailsRecord.path;
        const planningPath = firstDetailsRecord.planningPath;
        const allPossibleObjectTypes =
          firstDetailsRecord.allPossibleObjectTypes;

        // The existence of this is common (i.e. either all have it set, or all
        // have it null, but the actual contents may differ)
        const polymorphicPaths = firstDetailsRecord.polymorphicPaths;

        const combinedPolymorphicPaths = polymorphicPaths
          ? new Set<string>(/* Populated below */)
          : null;

        let commonLayerPlan: LayerPlan;
        let $original: Step | null;
        let commonStep: Step;
        const steps = new Set(detailsRecordList.map((t) => t.parentStep));
        if (steps.size > 1) {
          $original = null;
          // Make combined
          const layerPlans = new Set(detailsRecordList.map((t) => t.layerPlan));
          const combinedLayerPlan =
            this.getCombinedLayerPlanForLayerPlans(layerPlans);
          const toCombine: { step: Step; layerPlan: LayerPlan }[] = [];
          let isUnary = true;
          for (const detailsRecord of detailsRecordList) {
            const parentStep = detailsRecord.parentStep;
            const polymorphicPaths = detailsRecord.polymorphicPaths;
            const layerPlan = detailsRecord.layerPlan;
            if (!parentStep._isUnary) {
              isUnary = false;
            }
            if (polymorphicPaths) {
              for (const path of polymorphicPaths) {
                combinedPolymorphicPaths!.add(path);
              }
            }
            const $data = graphqlType.extensions?.grafast?.toSpecifier
              ? withGlobalLayerPlan(
                  layerPlan,
                  polymorphicPaths,
                  planningPath,
                  null,
                  graphqlType.extensions.grafast.toSpecifier,
                  graphqlType.extensions.grafast,
                  parentStep,
                )
              : stepHasToSpecifier(parentStep)
                ? withGlobalLayerPlan(
                    layerPlan,
                    polymorphicPaths,
                    planningPath,
                    null,
                    parentStep.toSpecifier,
                    parentStep,
                  )
                : stepHasToRecord(parentStep)
                  ? withGlobalLayerPlan(
                      layerPlan,
                      polymorphicPaths,
                      planningPath,
                      null,
                      parentStep.toRecord,
                      parentStep,
                    )
                  : parentStep;
            toCombine.push({ step: $data, layerPlan });
          }
          // Create a __ValueStep in the new combined layer plan that
          // represents all of these values
          const $combined = withGlobalLayerPlan(
            combinedLayerPlan,
            combinedPolymorphicPaths,
            planningPath,
            null,
            newValueStepCallback,
            null,
            false,
          );
          if (!isUnary) {
            $combined._isUnary = false;
          }
          // Tell it to populate the __ValuePlan $combined with the combination
          // of all the values from toCombine.
          combinedLayerPlan.addCombo(toCombine, $combined);

          commonLayerPlan = combinedLayerPlan;
          commonStep = $combined;
        } else {
          $original = [...steps][0];
          const layerPlans = new Set<LayerPlan>();
          for (const tuple of detailsRecordList) {
            layerPlans.add(tuple.layerPlan);
          }
          if (layerPlans.size === 1) {
            commonLayerPlan = [...layerPlans][0];
          } else {
            commonLayerPlan =
              this.getCombinedLayerPlanForLayerPlans(layerPlans);
          }

          commonStep = graphqlType.extensions?.grafast?.toSpecifier
            ? withGlobalLayerPlan(
                commonLayerPlan,
                polymorphicPaths,
                planningPath,
                null,
                graphqlType.extensions.grafast.toSpecifier,
                graphqlType.extensions.grafast,
                $original,
              )
            : stepHasToSpecifier($original)
              ? withGlobalLayerPlan(
                  commonLayerPlan,
                  polymorphicPaths,
                  planningPath,
                  null,
                  $original.toSpecifier,
                  $original,
                )
              : stepHasToRecord($original)
                ? withGlobalLayerPlan(
                    commonLayerPlan,
                    polymorphicPaths,
                    planningPath,
                    null,
                    $original.toRecord,
                    $original,
                  )
                : $original;

          for (const detailsRecord of detailsRecordList) {
            detailsRecord.layerPlan = commonLayerPlan;
            const polymorphicPaths = detailsRecord.polymorphicPaths;
            if (polymorphicPaths) {
              for (const path of polymorphicPaths) {
                combinedPolymorphicPaths!.add(path);
              }
            }
          }
        }

        // Call planTypes and plan each of the types?
        const planType =
          graphqlType.extensions?.grafast?.planType ?? defaultPlanType;
        // TODO: revisit this. If planType exists then no need? If resolver emulation then always?
        const resolverEmulation =
          // detailsRecordList.some((a) => a.resolverEmulation) && (
          graphqlType.resolveType != null ||
          allPossibleObjectTypes.some((t) => t.isTypeOf != null);
        const info: PlanTypeInfo = {
          abstractType: graphqlType,
          resolverEmulation,
          $original,
        };
        let polymorphicTypePlanner: AbstractTypePlanner;
        try {
          polymorphicTypePlanner = withGlobalLayerPlan(
            commonLayerPlan,
            combinedPolymorphicPaths,
            planningPath,
            null,
            planType,
            null,
            commonStep,
            info,
          );
        } catch (err) {
          const $error = this.withRootLayerPlan(() => error(err));
          polymorphicTypePlanner = {
            $__typename: $error,
          };
        }
        const stepForType = new Map<GraphQLObjectType, Step | Error>();
        const allTypeNames = allPossibleObjectTypes.map((t) => t.name);
        const basePaths = [...(combinedPolymorphicPaths ?? [""])];
        const polymorphicLayerPlan = new LayerPlan(this, {
          type: "polymorphic",
          parentLayerPlan: commonLayerPlan,
          polymorphicPaths: new Set(
            // BUG: this isn't 100% correct, it's possible that this layer
            // plan might not be used in some of these polymorphic paths (e.g.
            // if fragment types caused certain fields to not be selected in
            // certain scenarios). We should instead figure out the concrete
            // list of polymorphic paths actually seen during planning.
            allTypeNames.flatMap((t) => basePaths.map((p) => `${p}>${t}`)),
          ),
          typeNames: allTypeNames,
          parentStep: polymorphicTypePlanner.$__typename,
        });
        for (const type of allPossibleObjectTypes) {
          const polymorphicPaths = new Set(
            basePaths.map((p) => `${p}>${type.name}`),
          );
          try {
            const $stepForType =
              (polymorphicTypePlanner.planForType
                ? withGlobalLayerPlan(
                    polymorphicLayerPlan,
                    polymorphicPaths,
                    planningPath + "?",
                    null,
                    polymorphicTypePlanner.planForType,
                    polymorphicTypePlanner,
                    type,
                  )
                : type.extensions?.grafast?.planType
                  ? withGlobalLayerPlan(
                      polymorphicLayerPlan,
                      polymorphicPaths,
                      planningPath + "?",
                      null,
                      type.extensions.grafast.planType,
                      type.extensions.grafast,
                      commonStep,
                    )
                  : commonStep) ??
              withGlobalLayerPlan(
                polymorphicLayerPlan,
                polymorphicPaths,
                planningPath + "?",
                null,
                constant,
                null,
                $$inhibit,
              );
            stepForType.set(type, $stepForType);
            if (isDev) {
              // Check that this plan is compatible with every poly path
              if ($stepForType.polymorphicPaths === null) {
                // All good, valid in all paths
              } else {
                const missedPaths = [...polymorphicPaths].filter(
                  (p) => !stepIsValidInPolyPath($stepForType, p),
                );
                if (missedPaths.length > 0) {
                  throw new Error(
                    `When planning ${graphqlType}'s planForType for ${
                      type.name
                    }, returned step ${
                      $stepForType
                    } is not valid in ${missedPaths.length} out of ${polymorphicPaths.size} expected paths; missed paths: ${missedPaths}`,
                  );
                }
              }
            }
          } catch (e) {
            stepForType.set(type, e);
          }
        }

        // Now replace references to layer plan and step
        for (const detailsRecord of detailsRecordList) {
          detailsRecord.parentStep = commonStep;
          detailsRecord.layerPlan = polymorphicLayerPlan;

          // TODO: do we want to set the polymorphic paths here or not?
          // detailsRecord.polymorphicPaths = combinedPolymorphicPaths;

          const {
            locationDetails,
            parentObjectType,
            responseKey,
            isNonNull,
            outputPlan: parentOutputPlan,
          } = detailsRecord;
          const polymorphicOutputPlan = new OutputPlan(
            commonLayerPlan,
            polymorphicTypePlanner.$__typename,
            {
              mode: "polymorphic",
              deferLabel: undefined,
              typeNames: allPossibleObjectTypes.map((t) => t.name),
            },
            locationDetails,
          );
          detailsRecord.outputPlan = polymorphicOutputPlan;
          parentOutputPlan.addChild(parentObjectType, responseKey, {
            type: "outputPlan",
            outputPlan: polymorphicOutputPlan,
            isNonNull,
            locationDetails,
          });
          detailsRecord.stepForType = stepForType;
        }
      }

      for (const [
        parentLayerPlan,
        planFieldReturnTypeEntriesByStep,
      ] of planFieldReturnTypeEntriesByStepByLayerPlan) {
        if (planFieldReturnTypeEntriesByStep.size <= 1) {
          continue;
        }
        for (const [step, entries] of planFieldReturnTypeEntriesByStep) {
          // We already know the planningPath lines up.
          // We know all `entries` resolved to the same `step`.
          // We know all `entries` come from the same layer plan.

          // TODO: I'm not sure if we care if the field result type is the
          // same or not. I don't think so?

          // We want to create a polymorphicPartition layer plan for these, if
          // it makes sense.
          // It makes sense if there are multiple different groups; which we
          // checked in the `if` above. So, yes.

          // TODO: Check assumption: the different groups should relate to
          // different types.

          const typeNameSet = new Set<string>();
          entries.forEach((e) => void typeNameSet.add(e.positionType.name));
          const typeNames = [...typeNameSet];

          // TODO: eliminate this
          const polymorphicPaths = new Set(
            entries.flatMap((e) => [...(e.polymorphicPaths ?? [])]),
          );
          const partitionedLayerPlan = parentLayerPlan.getPartition(
            typeNames,
            polymorphicPaths,
          );

          /**
           * Moves all the steps that match these polymorphic paths only into
           * the polymorphicPartition layer plan
           */
          const recursivelyMoveSteps = (step: Step) => {
            if (step.layerPlan !== parentLayerPlan) return;
            if (!setsMatch(step.polymorphicPaths, polymorphicPaths)) return;
            this.stepTracker.moveStepToLayerPlan(step, partitionedLayerPlan);
            for (const dep of sudo(step).dependencies) {
              recursivelyMoveSteps(dep);
            }
          };
          recursivelyMoveSteps(step);

          // TODO: Do we need to update the outputPlan.layerPlan too?
          for (const entry of entries) {
            entry.layerPlan = partitionedLayerPlan;
          }
        }
      }
    }
  }

  private internalDependency<TStep extends Step>($step: TStep): TStep {
    this.stepTracker.internalDependencies.add($step);
    return $step;
  }

  private planFieldReturnType(details: PlanFieldReturnTypeDetails): void {
    return this.planIntoOutputPlan({ ...details, listDepth: 0 });
  }

  private planIntoOutputPlan(details: PlanIntoOutputPlanDetails): void {
    const {
      outputPlan: parentOutputPlan,
      path,
      planningPath,
      polymorphicPaths,
      parentStep: $step,
      positionType: fieldType,
      layerPlan: parentLayerPlan,
      selections,
      parentObjectType,
      responseKey,
      locationDetails,
      resolverEmulation,
      listDepth,
      streamDetails,
    } = details;
    const nullableFieldType = getNullableType(fieldType);
    const isNonNull = nullableFieldType !== fieldType;

    if (isListType(nullableFieldType)) {
      const listItemPlanningPath =
        planningPath +
        `[${
          streamDetails
            ? `#${streamDetails.initialCount.id}|${streamDetails.if.id}|${streamDetails.label.id}`
            : ""
        }]`;
      let $list = withGlobalLayerPlan(
        parentLayerPlan,
        polymorphicPaths,
        listItemPlanningPath,
        null,
        itemsOrStep,
        null,
        $step,
      );
      if ($list !== $step) {
        $list._stepOptions.stream = $step._stepOptions.stream;
      }

      // Clone the stream
      if ($list._stepOptions.stream) {
        $list = withGlobalLayerPlan(
          parentLayerPlan,
          polymorphicPaths,
          listItemPlanningPath,
          null,
          __cloneStream,
          null,
          $list,
        );
        $list._stepOptions.stream = $step._stepOptions.stream;
      }

      $list._stepOptions.walkIterable = true;
      const listOutputPlan = new OutputPlan(
        parentLayerPlan,
        $list,
        OUTPUT_PLAN_TYPE_ARRAY,
        locationDetails,
      );
      parentOutputPlan.addChild(parentObjectType, responseKey, {
        type: "outputPlan",
        outputPlan: listOutputPlan,
        isNonNull,
        locationDetails,
      });

      const stream: LayerPlanReasonListItemStream | undefined = streamDetails
        ? {
            // These are already marked as internal dependencies
            initialCountStepId: streamDetails.initialCount.id,
            ifStepId: streamDetails.if.id,
            labelStepId: streamDetails.label.id,
          }
        : undefined;

      this.queueNextLayer(this.planListItem, {
        outputPlan: listOutputPlan,
        path,
        planningPath: listItemPlanningPath,
        polymorphicPaths,
        parentStep: $list,
        positionType: nullableFieldType,
        layerPlan: parentLayerPlan,
        selections,
        listDepth,
        stream,
        locationDetails,
        resolverEmulation,
      });
    } else if (isScalarType(nullableFieldType)) {
      const scalarPlanResolver = nullableFieldType.extensions?.grafast?.plan;
      const fnDescription = `${nullableFieldType.name}.plan`;
      assertNotAsync(scalarPlanResolver, fnDescription);
      const $sideEffect = parentLayerPlan.latestSideEffectStep;
      try {
        const $leaf =
          typeof scalarPlanResolver === "function"
            ? assertNotPromise(
                withGlobalLayerPlan(
                  parentLayerPlan,
                  polymorphicPaths,
                  planningPath,
                  null,
                  scalarPlanResolver,
                  null,
                  $step,
                  this.scalarPlanInfo,
                ),
                scalarPlanResolver,
                fnDescription,
              )
            : $step;

        parentOutputPlan.addChild(parentObjectType, responseKey, {
          type: "outputPlan",
          isNonNull,
          outputPlan: new OutputPlan(
            parentLayerPlan,
            $leaf,
            {
              mode: "leaf",
              // stepId: $leaf.id,
              graphqlType: nullableFieldType,
            },
            locationDetails,
          ),
          locationDetails,
        });
      } finally {
        parentLayerPlan.latestSideEffectStep = $sideEffect;
      }
    } else if (isEnumType(nullableFieldType)) {
      const $sideEffect = parentLayerPlan.latestSideEffectStep;
      try {
        parentOutputPlan.addChild(parentObjectType, responseKey, {
          type: "outputPlan",
          isNonNull,
          outputPlan: new OutputPlan(
            parentLayerPlan,
            $step,
            {
              mode: "leaf",
              graphqlType: nullableFieldType,
            },
            locationDetails,
          ),
          locationDetails,
        });
      } finally {
        parentLayerPlan.latestSideEffectStep = $sideEffect;
      }
    } else if (isObjectType(nullableFieldType)) {
      if (isDev) {
        // Check that the plan we're dealing with is the one the user declared
        /** Either an assertion function or a step class */
        const stepAssertion = nullableFieldType.extensions?.grafast?.assertStep;
        if (stepAssertion != null) {
          try {
            if (
              stepAssertion === Step ||
              stepAssertion.prototype instanceof Step
            ) {
              if (!($step instanceof stepAssertion)) {
                throw new Error(
                  `Step mis-match: expected ${
                    stepAssertion.name
                  }, but instead found ${
                    ($step as Step).constructor.name
                  } (${$step})`,
                );
              }
            } else {
              (stepAssertion as ($step: Step) => void)($step);
            }
          } catch (e) {
            throw new Error(
              `The step returned by '${path.join(".")}${"[]".repeat(
                listDepth,
              )}' is not compatible with the GraphQL object type '${
                nullableFieldType.name
              }': ${e.message}`,
              { cause: e },
            );
          }
        }
        if (!selections) {
          throw new Error(
            `GrafastInternalError<7fe4f7d1-01d2-4f1e-add6-5aa6936938c9>: no selections on a GraphQLObjectType?!`,
          );
        }
      }

      let objectLayerPlan: LayerPlan;
      if (
        isNonNull ||
        (parentLayerPlan.reason.type === "nullableBoundary" &&
          parentLayerPlan.rootStep === $step)
      ) {
        objectLayerPlan = parentLayerPlan;
      } else {
        // Find existing match
        const match = parentLayerPlan.children.find(
          (clp) =>
            clp.reason.type === "nullableBoundary" &&
            clp.reason.parentStep === $step,
        );
        if (match !== undefined) {
          objectLayerPlan = match;
        } else {
          objectLayerPlan = new LayerPlan(this, {
            type: "nullableBoundary",
            parentLayerPlan,
            parentStep: $step,
          });
          objectLayerPlan.setRootStep($step);
        }
      }

      const $sideEffect = objectLayerPlan.latestSideEffectStep;
      try {
        const objectOutputPlan = new OutputPlan(
          objectLayerPlan,
          $step,
          {
            mode: "object",
            deferLabel: undefined,
            typeName: nullableFieldType.name,
          },
          locationDetails,
        );
        parentOutputPlan.addChild(parentObjectType, responseKey, {
          type: "outputPlan",
          outputPlan: objectOutputPlan,
          isNonNull,
          locationDetails,
        });
        this.queueNextLayer(this.planSelectionSet, {
          outputPlan: objectOutputPlan,
          path,
          planningPath: planningPath + ".",
          polymorphicPaths,
          parentStep: $step,
          positionType: nullableFieldType,
          layerPlan: objectLayerPlan,
          selections: selections!,
          resolverEmulation,
        });
      } finally {
        objectLayerPlan.latestSideEffectStep = $sideEffect;
      }
    } else {
      // Polymorphic
      const isUnion = isUnionType(nullableFieldType);
      const isInterface = isInterfaceType(nullableFieldType);
      if (!(isUnion || isInterface)) {
        const never: never = nullableFieldType;
        throw new Error(
          `GrafastInternalError<a54d6d63-d186-4ab9-9299-05f817894300>: Wasn't expecting ${never}`,
        );
      }
      assert.ok(
        selections,
        "GrafastInternalError<d94e281c-1a10-463e-b7f5-2b0a3665d99b>: A polymorphic type with no selections is invalid",
      );

      /*
       * Planning for polymorphic types is somewhat more complicated than for
       * other types.
       *
       * First, we figure out the list of `possibleTypes` based on the
       * union/interface and any other constraints that we know. Note: we can't
       * discount a type just because it doesn't have any fragments that apply
       * to it - instead we must still plan an empty selection set (or one just
       * using `{__typename}`), and we need to know it exists (is not null) for
       * that. See
       * https://github.com/graphql/graphql-spec/issues/951#issuecomment-1140957685
       */
      const allPossibleObjectTypes = isUnion
        ? nullableFieldType.getTypes()
        : this.schema.getImplementations(nullableFieldType).objects;

      if (allPossibleObjectTypes.length === 0) {
        /* If there are no implementations, simply stop via a null output plan */

        const nullOutputPlan = new OutputPlan(
          parentLayerPlan,
          $step,
          OUTPUT_PLAN_TYPE_NULL,
          locationDetails,
        );
        parentOutputPlan.addChild(parentObjectType, responseKey, {
          type: "outputPlan",
          outputPlan: nullOutputPlan,
          isNonNull,
          locationDetails,
        });
      } else {
        const polymorphicResolvePlanningPath = planningPath + "<*>";
        this.queueNextLayer(this.polymorphicResolveType, {
          outputPlan: parentOutputPlan,
          path,
          planningPath: polymorphicResolvePlanningPath,
          polymorphicPaths,
          parentStep: $step, // NOTE: This may be batched and turned into a $specifier step
          positionType: nullableFieldType,
          layerPlan: parentLayerPlan, // NOTE: This may be batched and turned into a combined layer plan
          selections,
          allPossibleObjectTypes,
          locationDetails,
          parentObjectType,
          responseKey,
          isNonNull,
          resolverEmulation,
        });
      }
    }
  }

  /** @internal */
  private planListItem(details: PlanListItemDetails) {
    const {
      outputPlan: listOutputPlan,
      path,
      planningPath: listItemPlanningPath,
      polymorphicPaths,
      parentStep: $list,
      positionType: nullableFieldType,
      layerPlan: parentLayerPlan,
      selections,
      listDepth,
      stream,
      locationDetails,
      resolverEmulation,
    } = details;

    // "see through" a list transform step that's only doing `each(...)` (and
    // no stream), and deduplicate so we only get one layer plan and one
    // `__Item` step.
    // IMPORTANT: we still need to use $list below otherwise we won't get the
    // right mapped items.
    const $listForItem =
      stream == null && isSkippableEach($list) ? $list.getListStep() : $list;

    const $__item = this.itemStepForListStep(
      parentLayerPlan,
      listItemPlanningPath,
      $listForItem,
      listDepth,
      stream,
    );
    const $sideEffect = $__item.layerPlan.latestSideEffectStep;
    try {
      let $item: Step;
      if (isListCapableStep($list)) {
        $item = withGlobalLayerPlan(
          $__item.layerPlan,
          $__item.polymorphicPaths,
          listItemPlanningPath,
          null,
          $list.listItem,
          $list,
          $__item,
        );
      } else {
        $item = $__item;
      }
      const newPolymorphicPaths = intersectPolyPaths(
        $item.polymorphicPaths,
        polymorphicPaths,
      );

      this.queueNextLayer(this.planIntoOutputPlan, {
        outputPlan: listOutputPlan,
        path,
        planningPath: listItemPlanningPath + "^",
        polymorphicPaths: newPolymorphicPaths,
        parentStep: $item,
        positionType: nullableFieldType.ofType,
        layerPlan: $item.layerPlan,
        selections,
        parentObjectType: null,
        responseKey: null,
        locationDetails,
        resolverEmulation,
        listDepth: listDepth + 1,
        streamDetails: null,
      });
    } catch (err) {
      this.handlePlanningError({
        outputPlan: listOutputPlan,
        layerPlan: $__item.layerPlan,
        objectType: null,
        responseKey: null,
        positionType: nullableFieldType.ofType,
        locationDetails,
        err,
      });
    } finally {
      $__item.layerPlan.latestSideEffectStep = $sideEffect;
    }
  }

  handlePlanningError(details: {
    outputPlan: OutputPlan;
    layerPlan: LayerPlan;
    objectType: GraphQLObjectType | null;
    responseKey: string | null;
    positionType: GraphQLOutputType;
    locationDetails: LocationDetails;
    err: Error;
  }) {
    const {
      outputPlan,
      layerPlan,
      objectType,
      responseKey,
      positionType,
      locationDetails,
      err,
    } = details;
    const step = this.withRootLayerPlan(() => error(err));
    const nullableFieldType = getNullableType(positionType);
    const isNonNull = nullableFieldType !== positionType;
    outputPlan.addChild(objectType, responseKey, {
      type: "outputPlan",
      outputPlan: new OutputPlan(
        layerPlan,
        step,
        OUTPUT_PLAN_TYPE_NULL,
        locationDetails,
      ),
      isNonNull,
      locationDetails,
    });
  }

  /** @internal */
  private polymorphicResolveType(details: PolymorphicResolveTypeDetails) {
    const {
      outputPlan,
      path,
      planningPath: polymorphicResolvePlanningPath,
      polymorphicPaths,
      layerPlan,
      selections,
      allPossibleObjectTypes,
      locationDetails,
      isNonNull,
      resolverEmulation,
      stepForType,
    } = details;
    if (!stepForType) {
      throw new Error(
        "GrafastInternalError<6afce944-f963-470f-8575-0d0420b4c838>: planForType wasn't set!",
      );
    }
    if (outputPlan.type.mode !== "polymorphic") {
      throw new Error(
        `GrafastInternalError<21de2f87-45c9-42c6-a1a3-c2c0f6e72ccb>: expected a polymorphic output plan`,
      );
    }
    const polymorphicOutputPlan =
      outputPlan as OutputPlan<OutputPlanTypePolymorphicObject>;

    /*
     * Now we need to loop through each type and plan it.
     */
    const polyBases = [...(polymorphicPaths ?? [""])];
    const polymorphicPlanningPath = polymorphicResolvePlanningPath + "!";
    for (const type of allPossibleObjectTypes) {
      const $sideEffect = layerPlan.latestSideEffectStep;
      try {
        // Bit of a hack, but saves passing it around through all the arguments
        const newPolymorphicPaths = new Set<string>();
        for (const polyBase of polyBases) {
          const newPolymorphicPath = `${polyBase}>${type.name}`;
          //resolveTypeLayerPlan.reason.polymorphicPaths.add(newPolymorphicPath);
          newPolymorphicPaths.add(newPolymorphicPath);
        }

        const $root = stepForType.get(type);
        try {
          if ($root == null) {
            throw new Error(
              `${details.positionType}'s planType().planForType(${type}) returned ${$root}`,
            );
          } else if (!($root instanceof Step)) {
            throw $root;
          }
        } catch (err) {
          this.handlePlanningError({
            outputPlan: polymorphicOutputPlan,
            layerPlan: layerPlan,
            objectType: type,
            responseKey: null,
            positionType: type,
            locationDetails,
            err,
          });
          return;
        }

        // find all selections compatible with `type`
        const fieldNodes = fieldSelectionsForType(this, type, selections);
        this.queueNextLayer(this.polymorphicPlanObjectType, {
          outputPlan: polymorphicOutputPlan,
          path,
          planningPath: polymorphicPlanningPath,
          polymorphicPaths: newPolymorphicPaths,
          parentStep: $root,
          positionType: type,
          layerPlan,
          fieldNodes,
          locationDetails,
          isNonNull,
          resolverEmulation,
        });
      } finally {
        layerPlan.latestSideEffectStep = $sideEffect;
      }
    }
  }

  // Before calling this, all the deduplication in the resolveType layer plan
  // should have taken place, and for each step that survives, a polymorphic
  // layer plan matching those relevant types should be created, and passed
  // through here as `polymorphicLayerPlan`.
  private polymorphicPlanObjectType(details: PolymorphicPlanObjectTypeDetails) {
    const {
      outputPlan,
      path,
      planningPath: polymorphicPlanningPath,
      polymorphicPaths: newPolymorphicPaths,
      parentStep: $root,
      positionType: type,
      layerPlan: polymorphicLayerPlan,
      fieldNodes,
      locationDetails,
      isNonNull,
      resolverEmulation,
    } = details;
    const $sideEffect = polymorphicLayerPlan.latestSideEffectStep;
    try {
      if (outputPlan.type.mode !== "polymorphic") {
        throw new Error(
          `GrafastInternalError<4c8d9d82-6cb2-4712-aa1e-fdd2173a0760>: expected a polymorphic output plan`,
        );
      }
      const polymorphicOutputPlan =
        outputPlan as OutputPlan<OutputPlanTypePolymorphicObject>;

      if (
        polymorphicLayerPlan.reason.type !== "polymorphic" &&
        polymorphicLayerPlan.reason.type !== "polymorphicPartition"
      ) {
        // NOTE: when queued, this method will be queued with a different layer
        // plan, but `planPending` should go through and convert it to the
        // relevant polymorphic layer plans for us.
        throw new Error(
          `GrafastInternalError<877eaa1c-30c9-4526-ada4-3ccce020ee0e>: expected ${polymorphicLayerPlan} to be a polymorphic or polymorphicPartition layer plan`,
        );
      }

      const objectOutputPlan = new OutputPlan(
        polymorphicLayerPlan,
        $root,
        {
          mode: "object",
          deferLabel: undefined,
          typeName: type.name,
        },
        locationDetails,
      );
      this.planSelectionSet({
        outputPlan: objectOutputPlan,
        path,
        planningPath: polymorphicPlanningPath + ".",
        polymorphicPaths: newPolymorphicPaths,
        parentStep: $root,
        positionType: type,
        layerPlan: polymorphicLayerPlan,
        selections: fieldNodes,
        resolverEmulation,
      });
      polymorphicOutputPlan.addChild(type, null, {
        type: "outputPlan",
        isNonNull,
        outputPlan: objectOutputPlan,
        locationDetails,
      });
    } finally {
      polymorphicLayerPlan.latestSideEffectStep = $sideEffect;
    }
  }

  planFieldBatch: PlanFieldBatch | null = null;
  private batchPlanField(batchPlanFieldDetails: PlanFieldDetails): () => {
    haltTree: boolean;
    step: Step;
    latestSideEffectStep: Step | null;
  } {
    let b: PlanFieldBatch;
    if (this.planFieldBatch != null) {
      b = this.planFieldBatch;
    } else {
      b = this.planFieldBatch = {
        complete: false,
        batch: [],
        results: [],
      };
    }
    const myIndex = b.batch.length;
    b.batch.push(batchPlanFieldDetails);
    return () => {
      if (!b.complete) {
        this.processPlanField(b);
      }
      const result = b.results[myIndex];
      if (result.error) {
        throw result.error;
      }
      return result;
    };
  }

  private processPlanField(b: PlanFieldBatch) {
    b.complete = true;
    this.planFieldBatch = null;

    const groups = new Map<
      string,
      {
        firstDetails: PlanFieldDetails;
        extraDetails: { polymorphicPaths: ReadonlySet<string> | null }[];
        streamDetails: boolean | StreamDetails | null;
        indexes: number[];
      }
    >();
    for (let i = 0, l = b.batch.length; i < l; i++) {
      const batchPlanFieldDetails = b.batch[i];
      const {
        typeName,
        fieldName,
        layerPlan,
        // path,
        polymorphicPaths,
        planningPath,
        // planResolver,
        // applyAfterMode,
        rawParentStep,
        // field,
        trackedArguments,
        streamDetails,
      } = batchPlanFieldDetails;
      const argsSig = Object.entries(trackedArguments)
        .map(([key, step]) => `${key}:${step.id}`)
        .join(",");

      /**
       * Our tests don't come up with anywhere where rawParentStep.id needs
       * incorporation into the signature, but I'm feeling paranoid.
       */
      const benjiesParanoia = `[${rawParentStep.id}]`;

      const signature = `${planningPath}@${layerPlan.id}${benjiesParanoia}=${typeName}.${fieldName}(${argsSig})`;
      let entry = groups.get(signature);
      if (!entry) {
        entry = {
          firstDetails: batchPlanFieldDetails,
          extraDetails: [{ polymorphicPaths }],
          streamDetails,
          indexes: [i],
        };
        groups.set(signature, entry);
      } else {
        if (isDev) {
          // Check everything lines up as we would expect
          for (const key of Object.keys(
            batchPlanFieldDetails,
          ) as (keyof typeof batchPlanFieldDetails)[]) {
            const myVal = batchPlanFieldDetails[key];
            const first = entry.firstDetails[key];
            if (myVal === first) continue;
            switch (key) {
              case "typeName":
                throw new Error(
                  `GraphileInternalError<15e09f3f-1a83-48a8-822c-1158b9740ef7>: processPlanField signature failure - mismatch typeName`,
                );
              case "fieldName":
                throw new Error(
                  `GraphileInternalError<2999cbf9-7143-4677-9592-0bfc52e12cb0>: processPlanField signature failure - mismatch fieldName`,
                );
              case "layerPlan":
                throw new Error(
                  `GraphileInternalError<52786d18-cfda-4ed6-a309-9cb31dcd5f34>: processPlanField signature failure - mismatch layerPlan`,
                );
              case "path":
                if (
                  !arraysMatch(
                    batchPlanFieldDetails.path,
                    entry.firstDetails.path,
                  )
                ) {
                  throw new Error(
                    `GraphileInternalError<cb84829d-ee4c-40cd-a3a6-f53d1029ad83>: processPlanField signature failure - mismatch path`,
                  );
                }
                break;
              case "polymorphicPaths":
                // Explicitly differences in polymorphicPaths are allowed
                break;
              case "planningPath":
                throw new Error(
                  `GraphileInternalError<1b708215-1549-47c3-9cf5-8fd8d7eb9bd0>: processPlanField signature failure - mismatch planningPath`,
                );
              case "planResolver":
                throw new Error(
                  `GraphileInternalError<7f14700f-2272-4b6a-a927-7600d934fdf0>: processPlanField signature failure - mismatch planResolver`,
                );
              case "applyAfterMode":
                throw new Error(
                  `GraphileInternalError<bbddad4f-68aa-49c7-b82c-09ceebf14a3f>: processPlanField signature failure - mismatch applyAfterMode`,
                );
              case "rawParentStep":
                throw new Error(
                  `GraphileInternalError<3306994d-7881-4495-89d1-6c9252840369>: processPlanField signature failure - mismatch rawParentStep`,
                );
              case "field":
                throw new Error(
                  `GraphileInternalError<67d2a787-2383-4228-8358-6ea9b3321445>: processPlanField signature failure - mismatch field`,
                );
              case "trackedArguments":
                if (
                  !recordsMatch(
                    batchPlanFieldDetails.trackedArguments,
                    entry.firstDetails.trackedArguments,
                  )
                ) {
                  throw new Error(
                    `GraphileInternalError<ec3f1e44-0ab6-445c-a644-a4d276f4b787>: processPlanField signature failure - mismatch trackedArguments`,
                  );
                }
                break;
              case "streamDetails":
                // If any of them don't stream, turn streaming off
                if (!streamDetails) {
                  entry.streamDetails = null;
                }
                break;
              default: {
                const never: never = key;
                throw new Error(
                  `GraphileInternalError<3f039c33-0b43-47d8-8da8-57873186cd60>: unexpected key '${never}'`,
                );
              }
            }
          }
        }

        entry.indexes.push(i);
        entry.extraDetails.push({ polymorphicPaths });
      }
    }

    // Loop through the groups and resolve the plan ONCE per group.
    // We don't care about the signature here; that was just for grouping
    for (const entry of groups.values()) {
      const planFieldDetails: PlanFieldDetails = {
        ...entry.firstDetails,
        polymorphicPaths: entry.firstDetails.polymorphicPaths
          ? new Set([
              ...entry.firstDetails.polymorphicPaths,
              ...entry.extraDetails.flatMap((d) => [...d.polymorphicPaths!]),
            ])
          : null,
      };
      let result: PlanFieldBatchResult;
      try {
        result = this._realPlanField(planFieldDetails);
      } catch (error) {
        result = { error };
      }
      for (const i of entry.indexes) {
        b.results[i] = result;
      }
    }
  }

  _realPlanField(planFieldDetails: PlanFieldDetails) {
    const {
      typeName,
      fieldName,
      layerPlan,
      path,
      polymorphicPaths,
      planningPath,
      planResolver,
      applyAfterMode,
      rawParentStep,
      field,
      trackedArguments,
      streamDetails,
    } = planFieldDetails;
    const coordinate = `${typeName}.${fieldName}`;

    // The step may have been de-duped whilst sibling steps were planned
    // PERF: this should be handled in the parent?
    const parentStep = this.stepTracker.getStepById(rawParentStep.id);

    const previousStepCount = this.stepTracker.stepCount;
    const previousSideEffectStep = layerPlan.latestSideEffectStep;

    if (this.loc !== null) this.loc.push(`planField(${path.join(".")})`);
    try {
      let stepStreamOptions: Maybe<StepStreamOptions> = undefined;
      if (streamDetails === true) {
        // subscription
        stepStreamOptions = {};
      } else if (streamDetails === false) {
        // Simple list, no action necessary
        stepStreamOptions = null;
      } else if (streamDetails != null) {
        // List with @stream
        stepStreamOptions = {
          initialCountStepId: streamDetails.initialCount.id,
          ifStepId: streamDetails.if.id,
          labelStepId: streamDetails.label.id,
        };
        // } else { // it's not a list and not a subscription
      }
      let step = withGlobalLayerPlan(
        layerPlan,
        polymorphicPaths,
        planningPath,
        stepStreamOptions ?? null,
        withFieldArgsForArguments,
        null,
        this,
        trackedArguments,
        field,
        parentStep,
        applyAfterMode,
        coordinate,
        (fieldArgs) =>
          planResolver(parentStep, fieldArgs, {
            fieldName,
            field,
            schema: this.schema,
          }),
      );
      let haltTree = false;
      if (step === null || (step instanceof ConstantStep && step.isNull())) {
        // Constantly null; do not step any further in this tree.
        step =
          step ||
          // `withGlobalLayerPlan(layerPlan, polymorphicPaths, () => constant(null))` but with reduced memory allocation
          withGlobalLayerPlan(
            layerPlan,
            polymorphicPaths,
            planningPath,
            null,
            constant,
            null,
            null,
          );
        haltTree = true;
      }
      assertExecutableStep(step);

      // `undefined` for non-lists (?)
      if (stepStreamOptions !== undefined) {
        // `null` is fine! `undefined` is not.
        step._stepOptions.stream = stepStreamOptions;

        if (streamDetails === true) {
          // Subscriptions need to be informed to walkIterable
          step._stepOptions.walkIterable = true;
        }
      }
      return {
        step,
        haltTree,
        latestSideEffectStep: layerPlan.latestSideEffectStep,
      };
    } catch (e) {
      if (ALWAYS_THROW_PLANNING_ERRORS) {
        throw e;
      }

      if (THROW_PLANNING_ERRORS_ON_SIDE_EFFECTS) {
        for (let i = previousStepCount; i < this.stepTracker.stepCount; i++) {
          const step = this.stepTracker.stepById[i];
          if (step && step.hasSideEffects) {
            throw e;
          }
        }
      }

      try {
        this.stepTracker.purgeBackTo(previousStepCount);
        layerPlan.latestSideEffectStep = previousSideEffectStep;
      } catch (e2) {
        console.error(
          `Cleanup error occurred whilst trying to recover from field planning error: ${e2.stack}`,
        );
        throw e;
      }

      const step = withGlobalLayerPlan(
        layerPlan,
        polymorphicPaths,
        planningPath,
        null,
        error,
        null,
        e,
      );
      const haltTree = true;
      // PERF: consider deleting all steps that were allocated during this. For
      // now we'll just rely on tree-shaking.
      return {
        step,
        haltTree,
        latestSideEffectStep: layerPlan.latestSideEffectStep,
      };
    } finally {
      if (this.loc !== null) this.loc.pop();
      layerPlan.latestSideEffectStep = previousSideEffectStep;
    }
  }

  /**
   * A replacement for GraphQL's
   * `CoerceArgumentValues` that factors in tracked variables.
   *
   * @see https://spec.graphql.org/draft/#CoerceArgumentValues()
   */
  private getTrackedArguments(
    argumentDefinitions: ReadonlyArray<GraphQLArgument>,
    field: FieldNode,
  ): TrackedArguments {
    const argumentValues = field.arguments;
    const trackedArgumentValues = Object.create(null);

    for (const argumentDefinition of argumentDefinitions) {
      const argumentName = argumentDefinition.name;
      if (isDev && trackedArgumentValues[argumentName]) {
        throw new SafeError(
          `Argument name '${argumentName}' seen twice; aborting.`,
        );
      }
      const argumentType = argumentDefinition.type;
      const defaultValue = argumentDefinition.defaultValue
        ? defaultValueToValueNode(argumentType, argumentDefinition.defaultValue)
        : undefined;
      const argumentValue = argumentValues?.find(
        (v) => v.name.value === argumentName,
      );
      const argumentPlan = inputStep(
        this,
        argumentType,
        argumentValue?.value,
        defaultValue,
      );
      trackedArgumentValues[argumentName] = argumentPlan;
    }
    return trackedArgumentValues;
  }

  /**
   * Sets up tracking for the given value (variableValues, context, rootValue).
   */
  private track(
    value: any,
    constraints: Constraint[],
    variableDefinitions?: ReadonlyArray<graphql.VariableDefinitionNode>,
  ): [__ValueStep<any>, __TrackedValueStep<any, any>] {
    const valueStep = withGlobalLayerPlan(
      this.rootLayerPlan,
      POLYMORPHIC_ROOT_PATHS,
      "",
      null,
      newValueStepCallback,
      null,
      variableDefinitions != null,
    );
    const trackedObjectStep = withGlobalLayerPlan(
      this.rootLayerPlan,
      POLYMORPHIC_ROOT_PATHS,
      "",
      null,
      () =>
        new __TrackedValueStep(
          value,
          valueStep,
          constraints,
          [],
          variableDefinitions != null,
          variableDefinitions,
        ),
    );
    return [valueStep, trackedObjectStep];
  }

  /**
   * Checks that no step has a property on it whose value is another step. It
   * should addDependency instead.
   */
  private validateSteps(offset = 0): void {
    const errors: Error[] = [];
    for (const step of this.stepTracker.activeSteps) {
      if (step.id < offset) continue;
      for (const key in step) {
        const val = step[key as keyof typeof step];
        if (
          key !== ("implicitSideEffectStep" satisfies keyof Step) &&
          val instanceof Step
        ) {
          errors.push(
            new Error(
              `ERROR: ExecutableStep ${step} has illegal reference via property '${key}' to step ${val}. You must not reference steps directly, instead add the step as a dependency (\`depId = this.addDependency($step)\`) and use \`this.getDep(depId)\` to look the step up (or, if the step is not a dependency, store the step ID and use \`this.getStep(stepId)\` each time you need to reference it). Failure to comply could result in subtle breakage during optimisation.`,
            ),
          );
        }
      }
    }
    if (errors.length > 0) {
      console.error(errors.map((e) => e.message).join("\n"));
      throw errors[0];
    }
  }

  private replaceStep($original: Step, $replacement: Step): void {
    this.stepTracker.replaceStep($original, $replacement);
  }

  private processStep(
    actionDescription: ProcessStepActionDescription,
    order: "dependents-first" | "dependencies-first",
    isReadonly: boolean,
    callback: (plan: Step) => Step,
    processed: Set<Step>,
    step: Step,
  ) {
    // MUST come before anything else, otherwise infinite loops may occur
    processed.add(step);

    if (!this.stepTracker.activeSteps.has(step)) {
      return step;
    }

    if (order === "dependents-first") {
      // used for: pushDown, optimize

      for (let i = 0; i < step.dependents.length; i++) {
        const entry = step.dependents[i];
        const { step: $processFirst } = entry;
        if (!processed.has($processFirst)) {
          this.processStep(
            actionDescription,
            order,
            isReadonly,
            callback,
            processed,
            $processFirst,
          );
          if (step.dependents[i] !== entry) {
            // The world has change; go back to the start
            i = -1;
          }
        }
      }
      const subroutineLayerPlan = step[$$subroutine];
      if (subroutineLayerPlan !== null) {
        const $root = subroutineLayerPlan.rootStep;
        if ($root) {
          this.processStep(
            actionDescription,
            order,
            isReadonly,
            callback,
            processed,
            $root,
          );
        }
      }
    } else {
      // used for: hoist

      for (const $processFirst of sudo(step).dependencies) {
        if (!processed.has($processFirst)) {
          this.processStep(
            actionDescription,
            order,
            isReadonly,
            callback,
            processed,
            $processFirst,
          );
        }
      }
    }

    // Check again, processing another step may have invalidated this one.
    if (!this.stepTracker.activeSteps.has(step)) {
      return step;
    }

    let replacementStep: Step = step;
    try {
      replacementStep = withGlobalLayerPlan(
        step.layerPlan,
        step.polymorphicPaths,
        null,
        null,
        callback,
        this,
        step,
      );
    } catch (e) {
      console.error(
        `Error occurred during ${actionDescription}; whilst processing ${step} in ${order} mode an error occurred:`,
        e,
      );
      throw e;
    }
    if (!replacementStep) {
      throw new Error(
        `The callback did not return a step during ${actionDescription}`,
      );
    }

    if (isReadonly) {
      if (replacementStep !== step) {
        throw new Error(`Replacing step in readonly mode is not permitted!`);
      }
    } else {
      if (replacementStep !== step) {
        this.replaceStep(step, replacementStep);
      }
      if (actionDescription !== "deduplicate") {
        this.deduplicateSteps();
      }
    }

    return replacementStep;
  }

  // PERF: optimize
  /**
   * Process the given steps, either dependencies first (root to leaf) or
   * dependents first (leaves to root).
   *
   * @internal
   */
  public processSteps(
    actionDescription: ProcessStepActionDescription,
    order: "dependents-first" | "dependencies-first",
    isReadonly: boolean,
    callback: (plan: Step) => Step,
  ): void {
    if (isDev) this.stepTracker.lockNewSteps();
    const previousStepCount = this.stepTracker.stepCount;

    const processed = new Set<Step>();

    for (let i = 0; i < this.stepTracker.stepCount; i++) {
      const step = this.stepTracker.getStepById(i, true);
      // Check it hasn't been tree-shaken away, or already processed
      if (!step || step.id !== i || processed.has(step)) continue;
      const resultStep = this.processStep(
        actionDescription,
        order,
        isReadonly,
        callback,
        processed,
        step,
      );
      if (isDev) {
        const plansAdded = this.stepTracker.stepCount - previousStepCount;

        // NOTE: whilst processing steps new steps may be added, thus we must loop
        // ascending and we must re-evaluate this.stepTracker.stepCount on each loop
        // iteration.
        if (plansAdded > 100000) {
          throw new Error(
            `Whilst processing steps as part of ${actionDescription}Plans, ${plansAdded} new steps have been created... That seems like it's likely a bug in the relevant method of one of your steps. The last plan processed was ${resultStep}`,
          );
        }
      }
      if (
        (isReadonly || isDev) &&
        this.stepTracker.stepCount > previousStepCount
      ) {
        if (isReadonly) {
          throwNoNewStepsError(
            this,
            actionDescription,
            step,
            previousStepCount,
            "Creating steps in isReadonly mode is forbidden",
          );
        }
        if (isDev) this.stepTracker.lockNewSteps();
      }
    }

    if (
      !isReadonly &&
      this.phase !== "plan" &&
      this.stepTracker.stepCount > previousStepCount
    ) {
      // Any time new steps are added we should validate them. All plans are
      // validated once "plan" is finished, so no need to do it here for that
      // phase.
      this.validateSteps(previousStepCount);
    }
  }

  /**
   * Peers are steps of the same type (but not the same step!) that are in
   * compatible layers and have the same dependencies. Peers must not have side
   * effects. A step is not its own peer.
   */
  private getPeers(step: Step): ReadonlyArray<Step> {
    if (step.hasSideEffects) {
      // Plans with side effects have no peers.
      return EMPTY_ARRAY;
    }

    // NOTE: Streams have no peers - we cannot reference the stream more than
    // once (and we aim to not cache the stream because we want its entries to
    // be garbage collected) - however if we're already fetching the list then
    // we shouldn't fetch it again via stream... We should deduplicate a stream
    // to return a non-stream.

    if (step._stepOptions.stream != null) {
      // Streams have no peers - we cannot reference the stream more
      // than once (and we aim to not cache the stream because we want its
      // entries to be garbage collected).
      //
      // HOWEVER! There may be lifecycle parts that need to be called... So
      // call the function with an empty array; ignore the result.

      // TODO: remove this if block when we implement the new stream/defer -
      // deduplicating a stream should be fine. (Not subscriptions though - may
      // need a check for that!)

      return EMPTY_ARRAY;
    }

    if (this.stepTracker.internalDependencies.has(step)) {
      // PERF: we need to set up correct tracking, then internal deps can be deduped
      return EMPTY_ARRAY;
    }

    const sstep = sudo(step);
    const {
      dependencies: deps,
      dependencyForbiddenFlags: flags,
      dependencyOnReject: onReject,
      dependencyDataOnly: dataOnly,
      layerPlan: layerPlan,
      constructor: stepConstructor,
      peerKey,
      isSyncAndSafe,
      cloneStreams,
      implicitSideEffectStep,
    } = sstep;
    // const streamInitialCount = sstep._stepOptions.stream?.initialCount;
    const dependencyCount = deps.length;

    if (dependencyCount === 0) {
      let allPeers: Step[] | null = null;
      const stepsWithNoDependencies =
        this.stepTracker.stepsWithNoDependenciesByConstructor.get(
          step.constructor,
        ) ?? new Set();
      for (const possiblyPeer of stepsWithNoDependencies) {
        if (
          possiblyPeer !== step &&
          !possiblyPeer.hasSideEffects &&
          possiblyPeer.implicitSideEffectStep === implicitSideEffectStep &&
          possiblyPeer.cloneStreams === cloneStreams &&
          possiblyPeer.isSyncAndSafe === isSyncAndSafe &&
          isPeerLayerPlan(possiblyPeer.layerPlan, layerPlan) &&
          possiblyPeer._stepOptions.stream == null &&
          possiblyPeer.peerKey === peerKey
          // && possiblyPeer._stepOptions.stream?.initialCount === streamInitialCount
        ) {
          if (allPeers === null) {
            allPeers = [possiblyPeer];
          } else {
            allPeers.push(possiblyPeer);
          }
        }
      }
      return allPeers === null ? EMPTY_ARRAY : allPeers;
    } else if (dependencyCount === 1) {
      // Optimized form for steps that have one dependency (extremely common!)

      const dependencyIndex = 0;

      const { ancestry, deferBoundaryDepth } = layerPlan;
      const dep = deps[dependencyIndex];

      const dl = dep.dependents.length;
      if (dl === 1) {
        // We're the only dependent; therefore we have no peers (since peers
        // share dependencies)
        return EMPTY_ARRAY;
      }

      const minDepth = Math.max(deferBoundaryDepth, dep.layerPlan.depth);
      let allPeers: Step[] | null = null;

      for (const {
        dependencyIndex: peerDependencyIndex,
        step: rawPossiblyPeer,
      } of dep.dependents) {
        if (
          peerDependencyIndex !== dependencyIndex ||
          rawPossiblyPeer === step ||
          rawPossiblyPeer.hasSideEffects ||
          rawPossiblyPeer.implicitSideEffectStep !== implicitSideEffectStep ||
          rawPossiblyPeer.cloneStreams !== cloneStreams ||
          rawPossiblyPeer.isSyncAndSafe !== isSyncAndSafe ||
          rawPossiblyPeer._stepOptions.stream != null ||
          rawPossiblyPeer.constructor !== stepConstructor ||
          rawPossiblyPeer.peerKey !== peerKey
          // || rawPossiblyPeer._stepOptions.stream?.initialCount !== streamInitialCount
        ) {
          continue;
        }
        const possiblyPeer = sudo(rawPossiblyPeer);
        const {
          layerPlan: peerLayerPlan,
          dependencyForbiddenFlags: peerFlags,
          dependencyOnReject: peerOnReject,
          dependencyDataOnly: peerDataOnly,
        } = possiblyPeer;
        if (
          peerLayerPlan.depth >= minDepth &&
          possiblyPeer.dependencies.length === dependencyCount &&
          isPeerLayerPlan(peerLayerPlan, ancestry[peerLayerPlan.depth]) &&
          peerFlags[dependencyIndex] === flags[dependencyIndex] &&
          peerOnReject[dependencyIndex] === onReject[dependencyIndex] &&
          peerDataOnly[dependencyIndex] === dataOnly[dependencyIndex]
        ) {
          if (allPeers === null) {
            allPeers = [possiblyPeer];
          } else {
            allPeers.push(possiblyPeer);
          }
        }
      }
      return allPeers === null ? EMPTY_ARRAY : allPeers;
    } else {
      const { ancestry, deferBoundaryDepth } = layerPlan;
      /**
       * "compatible" layer plans are calculated by walking up the layer plan tree,
       * however:
       *
       * - do not pass the LayerPlan of one of the dependencies
       * - do not pass a "deferred" layer plan
       *
       * Compatible layer plans are no less deep than minDepth.
       */
      let minDepth = deferBoundaryDepth;
      const possiblePeers: Step[] = [];
      // Loop backwards since last dependency is most likely to be most unique
      for (
        let dependencyIndex = dependencyCount - 1;
        dependencyIndex >= 0;
        dependencyIndex--
      ) {
        const dep = deps[dependencyIndex];
        const dl = dep.dependents.length;
        if (dl === 1) {
          // We're the only dependent; therefore we have no peers (since peers
          // share dependencies)
          return EMPTY_ARRAY;
        }
        if (dependencyIndex === dependencyCount - 1) {
          // Check the final dependency - this is likely to have the fewest
          // dependents (since it was added last it's more likely to be
          // unique).
          for (const {
            dependencyIndex: peerDependencyIndex,
            step: rawPossiblyPeer,
          } of dep.dependents) {
            if (
              peerDependencyIndex !== dependencyIndex ||
              rawPossiblyPeer === step ||
              rawPossiblyPeer.hasSideEffects ||
              rawPossiblyPeer.implicitSideEffectStep !==
                implicitSideEffectStep ||
              rawPossiblyPeer.cloneStreams !== cloneStreams ||
              rawPossiblyPeer.isSyncAndSafe !== isSyncAndSafe ||
              rawPossiblyPeer._stepOptions.stream != null ||
              rawPossiblyPeer.constructor !== stepConstructor ||
              rawPossiblyPeer.peerKey !== peerKey
              // || rawPossiblyPeer._stepOptions.stream?.initialCount !== streamInitialCount
            ) {
              continue;
            }
            const possiblyPeer = sudo(rawPossiblyPeer);
            const {
              layerPlan: peerLayerPlan,
              dependencyForbiddenFlags: peerFlags,
              dependencyOnReject: peerOnReject,
              dependencyDataOnly: peerDataOnly,
              dependencies: peerDependencies,
            } = possiblyPeer;
            if (
              peerDependencies.length === dependencyCount &&
              isPeerLayerPlan(peerLayerPlan, ancestry[peerLayerPlan.depth]) &&
              peerFlags[dependencyIndex] === flags[dependencyIndex] &&
              peerOnReject[dependencyIndex] === onReject[dependencyIndex] &&
              peerDataOnly[dependencyIndex] === dataOnly[dependencyIndex]
            ) {
              possiblePeers.push(possiblyPeer);
            }
          }
        }
        const d = dep.layerPlan.depth;
        if (d > minDepth) {
          minDepth = d;
        }
      }
      if (possiblePeers.length === 0) {
        return EMPTY_ARRAY;
      }
      let allPeers: Step[] | null = null;
      outerloop: for (const possiblyPeer of possiblePeers) {
        if (possiblyPeer.layerPlan.depth < minDepth) continue;
        const speer = sudo(possiblyPeer);
        // PERF: I'm not sure we strictly require this.
        if (
          !arraysMatch(
            sstep._refs,
            speer._refs,
            (refA, refB) =>
              refA === refB ||
              this.stepTracker.getStepById(refA) ===
                this.stepTracker.getStepById(refB),
          )
        ) {
          continue;
        }
        // We know the final dependency matches and the dependency count
        // matches - check the other dependencies match.
        for (let i = 0; i < dependencyCount - 1; i++) {
          if (deps[i] !== speer.dependencies[i]) {
            continue outerloop;
          }
        }
        if (allPeers === null) {
          allPeers = [possiblyPeer];
        } else {
          allPeers.push(possiblyPeer);
        }
      }
      return allPeers === null ? EMPTY_ARRAY : allPeers;
    }
  }

  private isImmoveable(step: Step): boolean {
    if (step.hasSideEffects) {
      return true;
    }
    if (isPrepopulatedStep(step)) {
      return true;
    }
    if (step[$$subroutine] !== null) {
      // Don't hoist steps that are the parent of a subroutine
      // PERF: we _should_ be able to hoist, but care must be taken. Currently it causes test failures.
      return true;
    }
    return false;
  }

  /**
   * Attempts to hoist the step into a higher layerPlan to maximize
   * deduplication.
   */
  private hoistStep(step: Step) {
    if (this.isImmoveable(step)) {
      return;
    }
    if (step.implicitSideEffectStep?.layerPlan === step.layerPlan) {
      // Can't hoist past our side effect
      return;
    }

    // PERF: would be nice to prevent ConstantStep from being hoisted - we
    // don't want to keep multiplying up and up its data as it traverses the buckets - would be better
    // to push the step down to the furthest level and then have it run there straight away.
    // PERF: actually... might be better to specifically replace all
    // ConstantStep dependencies with a bucket-local ConstantStep as one of the
    // final steps of optimize.

    /* // This is disabled because it breaks pgSelect's `mergePlaceholdersInto` logic.
    if (step instanceof __InputStaticLeafStep || step instanceof ConstantStep) {
      // More optimal to not hoist these - they convert to `constant()` which executes to produce a filled array incredibly efficiently.
      return true;
    }
    */

    if (step.layerPlan.reason.type === "root") {
      // There is no higher layerPlan
      return;
    } else if (step.layerPlan.reason.type === "combined") {
      // Cannot hoist out of a combination
      return;
    } else if (
      step.layerPlan.reason.parentLayerPlan.reason.type === "mutationField"
    ) {
      // Never hoist into a mutation layer
      return;
    }

    switch (step.layerPlan.reason.type) {
      case "subscription":
      case "defer": {
        // Should be deferred, don't evaluate early (unless it's cheap to do so)
        if (step.isSyncAndSafe) {
          // It's cheap, try and hoist it
          break;
        } else {
          return;
        }
      }
      case "polymorphic": {
        // Only hoist steps that are executed for all the types
        if (
          step.polymorphicPaths === null ||
          step.polymorphicPaths.size ===
            step.layerPlan.reason.polymorphicPaths.size
        ) {
          // It covers all types, try and hoist it.
          break;
        } else if (step instanceof __FlagStep) {
          // Flag step is cheap, try and hoist
          break;
        } else {
          return;
        }
      }
      case "polymorphicPartition": {
        // Don't want to hoist out of a polymorphic partition
        // TODO: revisit this, e.g. global unary steps should be hoistable? But
        // we should only do that if they're cheap, we don't want to run
        // expensive stuff at a higher level if only certain types need it.
        return;
      }
      case "subroutine": {
        // Should be safe to hoist.
        break;
      }
      case "nullableBoundary": {
        // Safe to hoist _unless_ it depends on the root step of the nullableBoundary.
        const $root = step.layerPlan.reason.parentStep!;
        if (sudo(step).dependencies.includes($root)) {
          return;
        } else {
          break;
        }
      }
      case "listItem": {
        // Should be safe to hoist so long as it doesn't depend on the
        // `__ItemStep` itself (which is just a regular dependency, so it'll be
        // checked later).
        // NOTE: this is true even if the listItem streams.
        break;
      }
      case "mutationField": {
        // NOTE: It's the user's responsibility to ensure that steps that have
        // side effects are marked as such via `step.hasSideEffects = true`.
        if (step.isSyncAndSafe && !step.hasSideEffects) {
          if (step.layerPlan.reason.mutationIndex === 0) {
            // Safe to hoist inside first mutation; but all later mutations may be impacted by previous actions.
            break;
          }
          // OPTIMIZE: figure out under which circumstances it is safe to hoist here.
          // break;
          return;
        } else if (step instanceof __FlagStep) {
          break;
        } else {
          // Plans that rely on external state shouldn't be hoisted because
          // their results may change after a mutation, so the mutation should
          // run first.
          return;
        }
      }
      default: {
        const never: never = step.layerPlan.reason;
        throw new Error(
          `GrafastInternalError<81e3a7d4-aaa0-416b-abbb-a887734007bc>: unhandled layer plan reason ${inspect(
            never,
          )}`,
        );
      }
    }

    // Finally, check that none of its dependencies are in the same bucket.
    const deps = sudo(step).dependencies;
    if (deps.some((dep) => dep.layerPlan === step.layerPlan)) {
      return;
    }

    // All our checks passed, hoist it.

    // 1: adjust polymorphicPaths to fit new layerPlan
    if (step.layerPlan.reason.type === "polymorphic") {
      // PERF: this is cacheable
      let newPolyPaths: null | Set<string> = new Set();
      for (const polyPath of step.polymorphicPaths!) {
        const i = polyPath.lastIndexOf(">");
        if (i > 0) {
          const newPath = polyPath.slice(0, i);
          newPolyPaths.add(newPath);
        } else if (i === 0) {
          newPolyPaths = null;
          break;
        } else {
          throw new Error(
            `GrafastInternalError<42f1c7e7-e544-46d2-81b3-00db11eb5def>: invalid poly path ${polyPath}`,
          );
        }
      }
      step.polymorphicPaths = newPolyPaths;
    }

    const $subroutine =
      step.layerPlan.reason.type === "subroutine"
        ? step.layerPlan.reason.parentStep
        : null;

    // 2: move it up a layer
    this.stepTracker.moveStepToLayerPlan(
      step,
      step.layerPlan.reason.parentLayerPlan,
    );

    // 3: if it's was in a subroutine, the subroutine parent plan needs to list it as a dependency
    if ($subroutine) {
      // Naughty naughty
      ($subroutine as any).addDependency(step);
    }

    // Now try and hoist it again!
    this.hoistStep(step);
  }

  /**
   * Attempts to push the step into the lowest layerPlan to minimize the need
   * for copying between layer plans.
   */
  private pushDown<T extends Step>(step: T): T {
    if (this.isImmoveable(step)) {
      return step;
    }
    if (step._isUnary) {
      step._isUnaryLocked = true;
      // Don't push unary steps down
      return step;
    }
    switch (step.layerPlan.reason.type) {
      case "root":
      case "subscription":
      case "defer":
      case "polymorphic":
      case "polymorphicPartition":
      case "subroutine":
      case "nullableBoundary":
      case "listItem": {
        // Fine to push lower
        break;
      }
      case "combined": {
        return step;
      }
      case "mutationField": {
        // NOTE: It's the user's responsibility to ensure that steps that have
        // side effects are marked as such via `step.hasSideEffects = true`.
        if (step.isSyncAndSafe && !step.hasSideEffects) {
          break;
        } else {
          // Side effects should take place inside the mutation field plan
          // (that's the whole point), so we should not push these down.
          return step;
        }
      }
      default: {
        const never: never = step.layerPlan.reason;
        throw new Error(
          `GrafastInternalError<81e3a7d4-aaa0-416b-abbb-a887734009bc>: unhandled layer plan reason ${inspect(
            never,
          )}`,
        );
      }
    }

    // Now find the lowest bucket that still satisfies all of it's dependents.
    const dependentLayerPlans = new Set<LayerPlan>();

    const outputPlans = this.stepTracker.outputPlansByRootStep.get(step);
    if (outputPlans !== undefined) {
      for (const outputPlan of outputPlans) {
        if (outputPlan.layerPlan === step.layerPlan) {
          return step;
        } else {
          dependentLayerPlans.add(outputPlan.layerPlan);
        }
      }
    }

    for (const { step: s } of step.dependents) {
      if (s.layerPlan === step.layerPlan) {
        return step;
      } else {
        dependentLayerPlans.add(s.layerPlan);
      }
    }

    const layerPlansByParent =
      this.stepTracker.layerPlansByParentStep.get(step);
    if (layerPlansByParent !== undefined) {
      for (const layerPlan of layerPlansByParent) {
        if (layerPlan.reason.parentLayerPlan === step.layerPlan) {
          return step;
        } else {
          dependentLayerPlans.add(layerPlan.reason.parentLayerPlan);
        }
      }
    }

    const layerPlansByDependent =
      this.stepTracker.layerPlansByDependentStep.get(step);
    if (layerPlansByDependent !== undefined) {
      for (const layerPlan of layerPlansByDependent) {
        for (const parentLayerPlan of layerPlan.reason.parentLayerPlans) {
          if (parentLayerPlan === step.layerPlan) {
            return step;
          } else if (
            layerPlanHeirarchyContains(parentLayerPlan, step.layerPlan)
          ) {
            dependentLayerPlans.add(parentLayerPlan);
          }
        }
      }
    }

    const layerPlansByRoot = this.stepTracker.layerPlansByRootStep.get(step);
    if (layerPlansByRoot !== undefined) {
      for (const layerPlan of layerPlansByRoot) {
        if (layerPlan === step.layerPlan) {
          return step;
        } else {
          dependentLayerPlans.add(layerPlan);
        }
      }
    }

    if (dependentLayerPlans.size === 0) {
      throw new Error(`Nothing depends on ${step}?!`);
    }

    if (dependentLayerPlans.has(step.layerPlan)) {
      throw new Error(
        `GrafastInternalError<c5cefdbc-9aa4-4895-8966-71171d8c0b36>: This should already have been caught`,
      );
    }

    const paths: Array<readonly LayerPlan[]> = [];
    let minPathLength = Infinity;

    for (const dependentLayerPlan of dependentLayerPlans) {
      const lp = dependentLayerPlan;
      const childPaths = pathsFromAncestorToTargetLayerPlan(step.layerPlan, lp);
      if (childPaths.length === 0) {
        throw new Error(
          `GrafastInternalError<64c07427-4fe2-43c4-9858-272d33bee0b8>: invalid layer plan heirarchy; step ${step} cannot be found from ${dependentLayerPlan}`,
        );
      }
      for (const path of childPaths) {
        paths.push(path);
        minPathLength = Math.min(path.length, minPathLength);
      }
    }

    const dependentLayerPlanCount = dependentLayerPlans.size;

    let deepest = step.layerPlan;
    outerloop: for (let i = minPathLength - 1; i >= 0; i--) {
      const expected = paths[0][i];
      if (expected.reason.type === "polymorphic") {
        // PERF: reconsider
        // Let's not pass polymorphic boundaries for now
        break;
      }
      if (expected.reason.type === "polymorphicPartition") {
        // PERF: reconsider
        // Let's not pass polymorphic boundaries for now
        break;
      }
      if (expected.reason.type === "subroutine") {
        // PERF: reconsider
        // Let's not pass subroutine boundaries for now
        break;
      }
      if (expected.reason.type === "mutationField") {
        // Let's not pass mutationField boundaries for now
        break;
      }
      for (let j = 1; j < dependentLayerPlanCount; j++) {
        const actual = paths[j][i];
        if (expected != actual) {
          break outerloop;
        }
      }
      deepest = expected;
    }

    if (deepest === step.layerPlan) {
      return step;
    }

    // All our checks passed, shove it down!

    // 1: no need to adjust polymorphicPaths, since we don't cross polymorphic boundary

    // const targetPolymorphicPaths = deepest.polymorphicPaths;
    // if (!targetPolymorphicPaths.has([...step.polymorphicPaths][0])) {
    //   throw new Error(
    //     `GrafastInternalError<53907e56-940a-4173-979d-bc620e4f1ff8>: polymorphic assumption doesn't hold. Mine = ${[
    //       ...step.polymorphicPaths,
    //     ]}; theirs = ${[...deepest.polymorphicPaths]}`,
    //   );
    // }

    // 2: move it to target layer
    this.stepTracker.moveStepToLayerPlan(step, deepest);

    return step;
  }

  private _deduplicateInnerLogic(step: Step) {
    if (step instanceof __ItemStep) {
      // __ItemStep cannot be deduplicated
      return null;
    }

    const peers = this.getPeers(step);
    // Even if there are no peers, we must still deduplicate because
    // `deduplicate` is called to indicate that the field is done being
    // planned, which the step class may want to acknowledge by locking certain
    // facets of its functionality (such as adding filters). We'll simplify its
    // work though by giving it an empty array to filter.
    const wasLocked = isDev && unlock(step);
    const equivalentSteps = step.deduplicate!(peers);
    if (wasLocked) lock(step);
    if (equivalentSteps.length === 0) {
      // No other equivalents
      return null;
    }

    if (isDev) {
      if (
        !equivalentSteps.every((replacementStep) =>
          peers.includes(replacementStep),
        )
      ) {
        throw new Error(
          `deduplicatePlan error: '${step}.deduplicate' may only return steps from its peers peers (peers = ${peers}), but it returned ${equivalentSteps}. This is currently forbidden because it could cause confusion during the optimization process, instead apply this change in 'optimize', or make sure that any child selections aren't applied until the optimize/finalize phase so that no mapping is required during deduplicate.`,
        );
      }
    }

    // Prefer the step that's closest to the root LayerPlan; failing that, prefer the step with the lowest id.
    let minDepth = step.layerPlan.depth;
    let stepsAtMinDepth: Step[] = [step];
    for (const step of equivalentSteps) {
      const depth = step.layerPlan.depth;
      if (depth < minDepth) {
        minDepth = depth;
        stepsAtMinDepth = [step];
      } else if (depth === minDepth) {
        stepsAtMinDepth.push(step);
      }
    }
    stepsAtMinDepth.sort((a, z) => a.id - z.id);
    return { stepsAtMinDepth, equivalentSteps };
  }

  private deduplicateStep(step: Step): Step {
    // Conditions applied to this step are now finalized, though we may still
    // tell the step to do more stuff (like fetch extra data), it can no longer
    // change its order, conditions, etc.
    step.isArgumentsFinalized = true;

    // If a step is unary at this point, it must always remain unary.
    if (step._isUnary) {
      step._isUnaryLocked = true;
    }

    if (step.deduplicate == null) return step;
    const result = this._deduplicateInnerLogic(step);
    if (result == null) {
      return step;
    }

    const { stepsAtMinDepth, equivalentSteps } = result;

    // Hooray, one winning layer! Find the first one by id.
    const winner = stepsAtMinDepth[0];

    if (winner.polymorphicPaths !== null) {
      const polymorphicPaths = new Set<string>();

      // If the paths don't match up we must be in a polymorphicPartition and
      // need to move the winner out of it
      tryAgain: for (let attempts = 0; attempts < 2; attempts++) {
        const layerPolymorphicPaths = polymorphicPathsForLayer(
          winner.layerPlan,
        )!;
        // PERF: this string trimming is hideous
        for (const s of [step, ...equivalentSteps]) {
          for (const p of s.polymorphicPaths!) {
            let trimmed = p;
            let i;
            while (
              !layerPolymorphicPaths.has(trimmed) &&
              (i = trimmed.lastIndexOf(">")) >= 0
            ) {
              if (i === 0) {
                const reason = winner.layerPlan.reason;
                if (reason.type === "polymorphicPartition") {
                  // Hoist winner into the polymorphic layer plan, and restart
                  // the loop
                  this.stepTracker.moveStepToLayerPlan(
                    winner,
                    reason.parentLayerPlan,
                  );
                  polymorphicPaths.clear();
                  continue tryAgain;
                } else {
                  throw new Error(
                    `GrafastInternalError<93da1006-3af9-44dd-a54b-5bf6fe3e791c>: polymorphic mismatch...${`
${s}∈${s.layerPlan}${s !== step ? ` (equivalent to ${step})` : ""} has polymorphic paths:
  - ${[...(s.polymorphicPaths ?? [])].join("\n  - ")}
But ${p} is not in ${winner.layerPlan}'s expected polymorphic paths:
  - ${[...layerPolymorphicPaths].join("\n  - ")}`.replace(/\n/g, "\n      ")}`,
                  );
                }
              }
              trimmed = trimmed.slice(0, i);
            }
            polymorphicPaths.add(trimmed);
          }
        }
        break;
      }
      winner.polymorphicPaths = polymorphicPaths;
    }

    // Equivalent steps cannot be streaming; so we can no longer stream either.
    if (equivalentSteps.length > 0) {
      winner._stepOptions.stream = null;
    }

    // Give the steps a chance to pass their responsibilities to the winner.
    if (winner !== step) {
      const wasLocked = isDev && unlock(step);
      step.deduplicatedWith?.(winner);
      if (wasLocked) lock(step);
      this.stepTracker.replaceStep(step, winner);
    }

    for (const target of equivalentSteps) {
      if (winner !== target) {
        const wasLocked = isDev && unlock(target);
        target.deduplicatedWith?.(winner);
        if (wasLocked) lock(target);
        this.stepTracker.replaceStep(target, winner);
      }
    }

    return winner;
  }

  /*
   * PERF: calculation if peers for deduplicate is too expensive, and shouldn't
   * be done in an expensive loop. Alternative:
   *
   * 1. build a `list` of the steps to deduplicate
   * 2. sort this `list` into "dependencies first" order
   * 3. for each step in this `list`:
   *    1. calculate the list of "compatible" LayerPlans for this step (using
   *       cache of results of this step where possible)
   *    2. find all the "peer" steps within these LayerPlans
   *    3. calculate the equivalents for this step
   *    4. pick the winning equivalent, replace all other instances with this
   *    5. remove the replaced (and winning) steps from the `list`
   *
   * "compatible" layer plans are calculated by walking up the layer plan tree,
   * however:
   *   - do not pass the LayerPlan of one of the dependencies
   *   - do not pass a "deferred" layer plan
   *
   * "Pick the winning equivalent" is challenging, here's current thought:
   *
   * 1. find the shallowest LayerPlans (logic already written above)
   * 2. if just one shallowest LayerPlan, winner is lowest-id plan from this LayerPlan
   * 3. otherwise, if all shallowest LayerPlans are polymorphic... ARGH!
   *
   * ARGH! WHAT DOES THIS MEAN FOR BRANCHING/NON-BRANCHING PLANS. We can
   * guarantee that the dependencies must be at least a layer up (otherwise how
   * can these be peers with the same dependencies?). For non-branching
   * non-deferred plans, push it a layer up.
   */

  private deduplicateStepsProcess(
    processed: Set<Step>,
    start: number,
    step: Step,
  ) {
    processed.add(step);
    for (const dep of sudo(step).dependencies) {
      if (dep.id >= start && !processed.has(dep)) {
        this.deduplicateStepsProcess(processed, start, dep);
      }
    }
    withGlobalLayerPlan(
      step.layerPlan,
      step.polymorphicPaths,
      null, // TODO: can we get the operation path when phase === "plan"?
      null,
      this.phase === "plan" ? this.deduplicateStep : this.hoistAndDeduplicate,
      this,
      step,
    );
  }

  /**
   * Gives us a chance to replace nearly-duplicate plans with other existing
   * plans (and adding the necessary transforms); this means that by the time
   * we come to optimize the plan tree should already be simpler. For example
   * if you have two plans at the same level that both request row data from
   * the same database table with the same identifiers, `WHERE`, `LIMIT`,
   * `OFFSET` and `ORDER BY`, but different `SELECT`s we could merge the two
   * plans together by replacing the latter with the former and having the
   * former SELECT additional fields, then transform the results back to what
   * our child plans would be expecting.
   */
  private deduplicateSteps(): void {
    const start = this.stepTracker.nextStepIdToDeduplicate;
    if (start === this.stepTracker.stepCount) {
      // No action necessary since there are no new steps
      return;
    }

    // Then we deduplicate
    this._deduplicateStepsInner(start, 0);
  }

  private _deduplicateStepsInner(start: number, depth: number): void {
    const end = this.stepTracker.stepCount;
    const processed = new Set<Step>();
    for (let i = start; i < end; i++) {
      const step = this.stepTracker.stepById[i];
      if (!step || step.id !== i || processed.has(step)) continue;
      this.deduplicateStepsProcess(processed, start, step);
    }

    this.stepTracker.nextStepIdToDeduplicate = end;

    if (this.stepTracker.stepCount > end) {
      // More steps were created during deduplicate; let's deduplicate those!
      const MAX_DEPTH = 5;
      if (depth > MAX_DEPTH) {
        const newSteps: (Step | null)[] = [];
        for (let i = end, l = this.stepTracker.stepCount; i < l; i++) {
          newSteps.push(this.stepTracker.stepById[i]);
        }
        throw new Error(
          `Whilst deduplicating steps, more steps were created; whilst deduplicating those, even more steps were created. This happened ${MAX_DEPTH} times, which suggests this might go on infinitely. Please check the deduplicate/deduplicatedWith methods on ${newSteps
            .map((s) => String(s))
            .join(", ")}.`,
        );
      }
      return this._deduplicateStepsInner(end, depth + 1);
    }
  }

  private hoistAndDeduplicate(step: Step) {
    this.hoistStep(step);
    // Even if step wasn't hoisted, its deps may have been so we should still
    // re-deduplicate it.
    return step.deduplicate ? this.deduplicateStep(step) : step;
  }

  private hoistSteps() {
    this.processSteps(
      "hoist",
      "dependencies-first",
      false,
      this.hoistAndDeduplicate,
    );
  }

  private pushDownSteps() {
    this.processSteps("pushDown", "dependents-first", false, this.pushDown);
  }

  /**
   * Calls the 'optimize' method on a plan, which may cause the plan to
   * communicate with its (deep) dependencies, and even to replace itself with
   * a different plan.
   */
  private optimizeStep(inStep: Step): Step {
    const step =
      inStep.allowMultipleOptimizations && inStep.deduplicate
        ? this.deduplicateStep(inStep)
        : inStep;
    if (!step.optimize) {
      step.isOptimized = true;
      return step;
    }
    if (step.isOptimized && !step.allowMultipleOptimizations) {
      return step;
    }

    // We know if it's streaming or not based on the LayerPlan it's contained within.
    // const stepOptions = step._stepOptions;
    let meta;
    if (step.optimizeMetaKey !== undefined) {
      meta = this.optimizeMeta.get(step.optimizeMetaKey);
      if (!meta) {
        meta = Object.create(null) as Record<string, any>;
        this.optimizeMeta.set(step.optimizeMetaKey, meta);
      }
    }
    const wasLocked = isDev && unlock(step);
    const replacementStep = step.optimize({
      stream: step._stepOptions.stream
        ? {
            // We could add more details here, but for now we don't really need them?
          }
        : null,
      meta,
    });
    if (wasLocked) lock(step);
    if (!replacementStep) {
      throw new Error(
        `Bug in ${step}'s class: the 'optimize' method must return a step. Hint: did you forget 'return this;'?`,
      );
    }
    step.isOptimized = true;
    return replacementStep;
  }

  /**
   * Note that we work through dependents first so we can make sure that we
   * know all our dependent's needs before we optimise ourself.
   */
  private optimizeSteps() {
    const thirdAndFutureLoopReplacedPlans: Step[] = [];
    for (let loops = 0; loops < MAX_OPTIMIZATION_LOOPS; loops++) {
      let replacedPlan = false;
      this.processSteps(
        "optimize",
        "dependents-first",
        false,
        loops === 0
          ? (step) => {
              const newStep = this.optimizeStep(step);
              if (newStep !== step) {
                replacedPlan = true;
              }
              return newStep;
            }
          : (step) => {
              if (step.allowMultipleOptimizations) {
                const replacement = this.optimizeStep(step);
                if (replacement !== step) {
                  replacedPlan = true;
                  if (loops >= 3) {
                    thirdAndFutureLoopReplacedPlans.push(step);
                  }
                }
                return replacement;
              } else {
                return step;
              }
            },
      );
      if (!replacedPlan) {
        return;
      }
    }
    console.warn(
      `Optimize steps looped ${MAX_OPTIMIZATION_LOOPS} times, and was still replacing steps at the end - this could indicate a very complex plan, or badly behaved steps. Here are some of the steps that were replaced after the second loop: ${thirdAndFutureLoopReplacedPlans
        .slice(0, 10)
        .join(", ")}`,
    );
  }

  private inlineSteps() {
    flagLoop: for (const $step of this.stepTracker.activeSteps) {
      if ($step instanceof __FlagStep) {
        const $flag = $step;
        // We can only inline it if it's not used by an output plan or layer plan
        {
          const usages = this.stepTracker.outputPlansByRootStep.get($flag);
          if (usages?.size) {
            continue;
          }
        }
        {
          const usages = this.stepTracker.layerPlansByRootStep.get($flag);
          if (usages?.size) {
            continue;
          }
        }
        {
          const usages = this.stepTracker.layerPlansByParentStep.get($flag);
          if (usages?.size) {
            continue;
          }
        }

        // We're only going to inline one if we can inline all.
        const toInline: Array<{
          $dependent: Sudo<Step>;
          dependencyIndex: number;
          inlineDetails: AddDependencyOptions;
          dependent: Step["dependents"][number];
        }> = [];
        for (const dependent of $flag.dependents) {
          const { step, dependencyIndex } = dependent;
          const $dependent = sudo(step);
          const inlineDetails = $flag.inline(
            $dependent._getDepOptions(dependencyIndex),
          );
          if (inlineDetails === null) {
            continue flagLoop;
          }
          toInline.push({
            $dependent,
            dependencyIndex,
            inlineDetails,
            dependent,
          });
        }
        // All of them pass the check, let's inline them
        for (const todo of toInline) {
          const {
            $dependent,
            dependencyIndex,
            inlineDetails: {
              onReject,
              acceptFlags = DEFAULT_ACCEPT_FLAGS,
              dataOnly = false,
            },
          } = todo;
          writeableArray($dependent.dependencyOnReject)[dependencyIndex] =
            onReject;
          writeableArray($dependent.dependencyDataOnly)[dependencyIndex] =
            dataOnly;
          writeableArray($dependent.dependencyForbiddenFlags)[dependencyIndex] =
            ALL_FLAGS & ~acceptFlags;
        }
        const $flagDep = sudo($flag).dependencies[0];
        this.stepTracker.replaceStep($flag, $flagDep);
      } else if ($step instanceof __CloneStreamStep) {
        const $clone = sudo($step);
        const $dep = $clone.dependencies[0];
        if ($dep.dependents.length === 1) {
          $dep.cloneStreams = false;
          $dep._stepOptions.walkIterable ||= $clone._stepOptions.walkIterable;
          $dep._stepOptions.stream ||= $clone._stepOptions.stream;
          this.stepTracker.replaceStep($clone, $dep);
        }
      }
    }
  }

  /** Finalizes each step */
  private finalizeSteps(): void {
    const initialStepCount = this.stepTracker.stepCount;
    for (const step of this.stepTracker.activeSteps) {
      if (step.isSyncAndSafe && !(step instanceof __ItemStep)) {
        const dependencies = sudo(step).dependencies;
        for (const dep of dependencies) {
          if (dep.cloneStreams) {
            throw new Error(
              `${step} has isSyncAndSafe=true, but depends on ${dep} which has cloneStreams=true - this is forbidden.`,
            );
          }
        }
      }
      const wasLocked = isDev && unlock(step);
      step.finalize();
      if (step._stepOptions.stream) {
        // (Potentially) streamed steps aren't sync and safe, we need to
        // iterate them expensively
        step.isSyncAndSafe = false;
      }
      if (wasLocked) lock(step);
      assertFinalized(step);
      if (isDev && this.stepTracker.stepCount !== initialStepCount) {
        throw new Error(
          `When calling ${step}.finalize() a new plan was created; this is forbidden!`,
        );
      }
    }
  }

  private finalizeLayerPlans(): void {
    /**
     * Adds the `dep` plan to the `copyPlanIds` for `layerPlan` and any
     * ancestor layers until we hit the layerPlan that `dep` is from.
     */
    const ensurePlanAvailableInLayer = (
      dep: Step,
      layerPlan: LayerPlan,
      reason: () => string,
    ): void => {
      let currentLayerPlan: LayerPlan | null = layerPlan;

      while (dep.layerPlan !== currentLayerPlan) {
        if (currentLayerPlan.reason.type === "root") {
          throw new Error(
            `GrafastInternalError<7f3ce201-810c-4639-8e69-f44a95221c6d>: reached root whilst ensuring ${dep} is available in ${layerPlan} (${reason()})`,
          );
        }
        if (currentLayerPlan.copyStepIds.includes(dep.id)) {
          break;
        }
        const targetStep = this.stepTracker.getStepById(dep.id);
        if (isDev && targetStep !== dep) {
          throw new Error(
            `GrafastInternalError<b291b110-396a-4c9c-814a-5466af3c50e8>: Plan mismatch; are we using a replaced step? Step ID: ${
              dep.id
            }; step: ${dep}; stepById: ${this.stepTracker.getStepById(dep.id)}`,
          );
        }
        if (targetStep._isUnary) {
          targetStep._isUnaryLocked = true;
        }
        currentLayerPlan.copyStepIds.push(dep.id);
        if (currentLayerPlan.reason.type === "combined") {
          const prev = currentLayerPlan as LayerPlan<LayerPlanReasonCombined>;
          currentLayerPlan = null;
          // Figure out which of our parent layer plans contains the step
          for (const parentLayerPlan of prev.reason.parentLayerPlans) {
            if (dep.layerPlan === parentLayerPlan) {
              currentLayerPlan = parentLayerPlan;
              break;
            } else if (
              layerPlanHeirarchyContains(parentLayerPlan, dep.layerPlan)
            ) {
              ensurePlanAvailableInLayer(dep, parentLayerPlan, reason);
            }
          }
          if (currentLayerPlan == null) {
            return;
          }
        } else {
          currentLayerPlan = currentLayerPlan.reason.parentLayerPlan;
        }
        if (!currentLayerPlan) {
          throw new Error(
            `GrafastInternalError<8c1640b9-fa3c-440d-99e5-7693d0d7e5d1>: could not find layer plan for '${dep}' in chain from layer plan ${layerPlan}`,
          );
        }
      }
    };

    // Track exactly which steps are in which layer plans
    const phaseTransitionLayerPlans = new Set<
      | LayerPlan<LayerPlanReasonDefer>
      | LayerPlan<LayerPlanReasonListItem>
      | LayerPlan<LayerPlanReasonSubscription>
    >();
    const combinedLayerPlans = new Set<LayerPlan<LayerPlanReasonCombined>>();
    const childrenByLayerPlan = new Map<LayerPlan, LayerPlan[]>();
    const addParent = (lp: LayerPlan, parent: LayerPlan) => {
      let list = childrenByLayerPlan.get(parent);
      if (!list) {
        list = [];
        childrenByLayerPlan.set(parent, list);
      }
      list.push(lp);
    };
    for (const layerPlan of this.stepTracker.layerPlans) {
      if (!layerPlan) {
        continue;
      }
      if (isPhaseTransitionLayerPlan(layerPlan)) {
        phaseTransitionLayerPlans.add(layerPlan);
      }
      if (layerPlan.reason.type === "combined") {
        combinedLayerPlans.add(layerPlan as LayerPlan<LayerPlanReasonCombined>);
      }
      layerPlan.steps = [];
      switch (layerPlan.reason.type) {
        case "root":
          break;
        case "combined": {
          for (const parent of layerPlan.reason.parentLayerPlans) {
            addParent(layerPlan, parent);
          }
          break;
        }
        default: {
          addParent(layerPlan, layerPlan.reason.parentLayerPlan);
        }
      }
    }

    // Go through all the phase transition layer plans and populate their
    // "outOfBoundsLayerPlanIds". These are "external inputs" to the subgraph
    // of layer plans starting at the phase transition layer plan. The external
    // inputs will always be parent nodes of combined layer plans that are
    // descendents of the phase transition layer plan.
    for (const phaseTransitionNode of phaseTransitionLayerPlans) {
      const descendents = getDescendents(
        phaseTransitionNode,
        childrenByLayerPlan,
      );
      for (const combo of combinedLayerPlans) {
        if (descendents.has(combo)) {
          for (const parent of combo.reason.parentLayerPlans) {
            if (!descendents.has(parent)) {
              phaseTransitionNode.outOfBoundsLayerPlanIds.add(parent.id);
            }
          }
        }
      }
    }

    for (const step of this.stepTracker.activeSteps) {
      step.layerPlan.steps.push(step);
    }

    // For each layer plan, track the polymorphic types, and mark the steps in
    // that layer plan as selective if they don't possess the same number of
    // poly paths.
    const polyPathsByLayerPlan = new Map<LayerPlan, ReadonlySet<string>>();
    const processPolymorphicPathsInLayerPlan = (
      layerPlan: LayerPlan,
    ): ReadonlySet<string> => {
      const existing = polyPathsByLayerPlan.get(layerPlan);
      if (existing) {
        return existing;
      }

      const parentPolyPaths: ReadonlySet<string> =
        layerPlan.reason.type === "root"
          ? EMPTY_SET
          : layerPlan.reason.type === "combined"
            ? new Set(
                layerPlan.reason.parentLayerPlans.flatMap((p) => [
                  ...processPolymorphicPathsInLayerPlan(p),
                ]),
              )
            : processPolymorphicPathsInLayerPlan(
                layerPlan.reason.parentLayerPlan,
              );
      let polyPaths: ReadonlySet<string>;
      const reason = layerPlan.reason;
      switch (reason.type) {
        case "root":
        case "nullableBoundary":
        case "listItem":
        case "defer":
        case "subroutine":
        case "subscription":
        case "mutationField": {
          polyPaths = parentPolyPaths;
          break;
        }
        case "combined": {
          // Resolve redundant combinations now plans have been deduped/optimized
          for (const combo of layerPlan.combinations) {
            const { sources } = combo;
            let newSources: Array<(typeof sources)[number]> | null = null;
            const l = sources.length;
            // Deliberately miss the first (index=0) item
            for (let i = l - 1; i > 0; i--) {
              const source = sources[i];
              const { layerPlanId, stepId } = source;
              for (let j = i - 1; j >= 0; j--) {
                const otherSource = sources[j];
                if (
                  otherSource.layerPlanId === layerPlanId &&
                  otherSource.stepId === stepId
                ) {
                  if (!newSources) newSources = [...sources];
                  // Duplicate! Remove it!
                  newSources.splice(i, 1);
                  break;
                }
              }
            }
            if (newSources) {
              combo.sources = newSources;
            }
          }

          // Populate our final polyPaths
          const newPolyPaths = new Set<string>();
          for (const lp of reason.parentLayerPlans) {
            const paths = processPolymorphicPathsInLayerPlan(lp);
            for (const p of paths) {
              newPolyPaths.add(p);
            }
          }
          polyPaths = newPolyPaths;

          // Check that everything is sensible
          if (isDev) {
            // Let's check we're being sensible - each poly path should only be
            // sourceable from one step, and these steps should only have poly
            // paths that we understand
            for (const { sources } of layerPlan.combinations) {
              const overlapCheck = new Map<string, (typeof sources)[number]>();
              for (const source of sources) {
                const { layerPlanId, stepId } = source;
                const step = this.stepTracker.getStepById(stepId);
                const paths = step.polymorphicPaths;
                if (paths === null) {
                  throw new Error(
                    `GrafastInternalError<170ac297-e7b2-4d15-bf3b-1c0c50a0da40>: Step ${step} shouldn't be used in a combo because it's valid in all polymorphic paths`,
                  );
                }
                for (const p of paths) {
                  if (overlapCheck.has(p)) {
                    const sourceLp = this.stepTracker.layerPlans[layerPlanId];
                    const dup = overlapCheck.get(p)!;
                    const dupStep = this.stepTracker.getStepById(dup.stepId);
                    const dupLp = this.stepTracker.layerPlans[dup.layerPlanId];
                    throw new Error(
                      `GrafastInternalError<f2d906fe-7f52-4234-a172-42691613f733>: Overlapping path ${p} in ${layerPlan} found; sourced from both ${step} in ${sourceLp} and ${dupStep} in ${dupLp}`,
                    );
                  }
                  if (!newPolyPaths.has(p)) {
                    throw new Error(
                      `GrafastInternalError<c697df8f-e194-42f0-9f73-c510bc2e9b74>: path ${p} in ${layerPlan} not expected; sourced from ${step}`,
                    );
                  }
                  overlapCheck.set(p, source);
                }
              }
            }
          }
          break;
        }
        case "polymorphic":
        case "polymorphicPartition": {
          polyPaths = reason.polymorphicPaths;
          break;
        }
        default: {
          const never: never = reason;
          throw new Error(
            `GrafastInternalError<032aef95-97d8-4900-95f7-edc34a5d3703>: unexpected layer plan reason ${inspect(never)}`,
          );
        }
      }

      for (const step of layerPlan.steps) {
        if (
          step.polymorphicPaths !== null &&
          step.polymorphicPaths.size !== polyPaths.size
        ) {
          step._isSelectiveStep = true;
        }
      }

      polyPathsByLayerPlan.set(layerPlan, polyPaths);
      return polyPaths;
    };
    for (const layerPlan of this.stepTracker.layerPlans) {
      if (!layerPlan) continue;
      processPolymorphicPathsInLayerPlan(layerPlan);
    }

    for (const layerPlan of this.stepTracker.layerPlans) {
      if (!layerPlan) {
        continue;
      }
      layerPlan.pendingSteps = layerPlan.steps.filter((s) => !($$noExec in s));
      const sideEffectSteps = layerPlan.pendingSteps.filter(
        (s) => s.hasSideEffects,
      );
      const pending = new Set<Step>(layerPlan.pendingSteps);
      const processed = new Set<Step>();

      const processSideEffectPlan = (step: Step) => {
        if (processed.has(step) || isPrepopulatedStep(step)) {
          return;
        }
        const sstep = sudo(step);
        processed.add(step);
        pending.delete(step);

        const sideEffectDeps: Step[] = [];
        const rest: Step[] = [];
        for (const dep of sstep.dependencies) {
          if (dep.layerPlan !== layerPlan) {
            continue;
          }
          if (processed.has(dep)) {
            continue;
          }
          if (dep.hasSideEffects) {
            sideEffectDeps.push(dep);
          } else {
            rest.push(dep);
          }
        }

        // Call any side effects we're dependent on
        for (const sideEffectDep of sideEffectDeps) {
          processSideEffectPlan(sideEffectDep);
        }

        // PERF: this is silly, we should be able to group them together and
        // run them in parallel, and they don't even have side effects!
        for (const dep of rest) {
          processSideEffectPlan(dep);
        }

        const phase = /*#__INLINE__*/ newLayerPlanPhase();
        phase.checkTimeout = true;
        phase.normalSteps = [{ step }];
        phase._allSteps.push(step);

        layerPlan.phases.push(phase);
      };

      for (const sideEffectStep of sideEffectSteps) {
        processSideEffectPlan(sideEffectStep);
      }

      const readyToExecute = (step: Step): boolean => {
        for (const dep of sudo(step).dependencies) {
          if (dep.layerPlan === layerPlan && pending.has(dep)) {
            return false;
          }
        }
        return true;
      };

      while (pending.size > 0) {
        const nextSteps: Step[] = [];
        for (const step of pending) {
          if (readyToExecute(step)) {
            nextSteps.push(step);
          }
        }
        if (nextSteps.length === 0) {
          throw new Error(
            `GrafastInternalError<2904ebbf-6344-4f2b-9305-8db9c1ff29c5>: Could not compute execution order?! Remaining: ${[
              ...pending,
            ]} (processed: ${[...processed]}; all: ${layerPlan.pendingSteps})`,
          );
        }

        // Do not add to processed until whole layer is known
        const phase = /*#__INLINE__*/ newLayerPlanPhase();
        for (const step of nextSteps) {
          processed.add(step);
          pending.delete(step);
          if (
            step.isSyncAndSafe &&
            isUnbatchedStep(step) &&
            isSafeForUnbatched(step)
          ) {
            if (phase.unbatchedSyncAndSafeSteps !== undefined) {
              phase.unbatchedSyncAndSafeSteps.push({
                step,
                scratchpad: undefined,
              });
            } else {
              phase.unbatchedSyncAndSafeSteps = [
                { step, scratchpad: undefined },
              ];
            }
          } else {
            if (!step.isSyncAndSafe || step.hasSideEffects) {
              phase.checkTimeout = true;
            }
            if (phase.normalSteps !== undefined) {
              phase.normalSteps.push({ step });
            } else {
              phase.normalSteps = [{ step }];
            }
          }
        }

        // Add more isSyncAndSafe unbatched steps if possible
        let foundOne = false;
        do {
          foundOne = false;
          for (const step of pending) {
            if (step.isSyncAndSafe && isUnbatchedStep(step)) {
              if (readyToExecute(step)) {
                processed.add(step);
                pending.delete(step);
                foundOne = true;
                if (phase.unbatchedSyncAndSafeSteps !== undefined) {
                  phase.unbatchedSyncAndSafeSteps.push({
                    step,
                    scratchpad: undefined,
                  });
                } else {
                  phase.unbatchedSyncAndSafeSteps = [
                    { step, scratchpad: undefined },
                  ];
                }
              }
            }
          }
        } while (foundOne);

        if (phase.normalSteps !== undefined) {
          for (const { step } of phase.normalSteps) {
            phase._allSteps.push(step);
          }
        }
        if (phase.unbatchedSyncAndSafeSteps !== undefined) {
          for (const { step } of phase.unbatchedSyncAndSafeSteps) {
            phase._allSteps.push(step);
          }
        }
        layerPlan.phases.push(phase);
      }

      // PERF: this could probably be faster.
      // Populate copyPlanIds for each step
      for (const step of layerPlan.steps) {
        // Items shouldn't have their "list" copied in.
        if ($$noExec in step) {
          continue;
        }
        for (const dep of sudo(step).dependencies) {
          ensurePlanAvailableInLayer(dep, layerPlan, () => `${step} (dep)`);
        }
        if (step.implicitSideEffectStep) {
          ensurePlanAvailableInLayer(
            step.implicitSideEffectStep,
            layerPlan,
            () => `${step} (side effect)`,
          );
        }
      }

      const $root = layerPlan.rootStep;
      if ($root) {
        ensurePlanAvailableInLayer(
          $root,
          layerPlan,
          () => `${layerPlan}.rootStep`,
        );

        // If $root explicitly dependends on `layerPlan.parentSideEffectStep`
        // then we should remove the implicit layerPlan dependency (e.g. so
        // that if you `trap()` the error it does not interfere).
        if (layerPlan.parentSideEffectStep) {
          if (
            layerPlan.parentSideEffectStep === $root ||
            layerPlan.parentSideEffectStep === $root.implicitSideEffectStep ||
            stepADependsOnStepB($root, layerPlan.parentSideEffectStep)
          ) {
            layerPlan.parentSideEffectStep = null;
          }
        }
      }

      const $sideEffect = layerPlan.parentSideEffectStep;
      if ($sideEffect) {
        // We read it from the parent layer plan at newBucket time, but we
        // don't need to actually scale it up/down.
        //
        // If parentSideEffectStep exists then parentLayerPlan must exist.
        if (layerPlan.reason.type === "root") {
          // No action
        } else if (layerPlan.reason.type === "combined") {
          throw new Error(
            `GrafastInternalError<26f6b639-637b-4db5-980b-294697317e35>: combined layer plan ${layerPlan} is not permitted to reference side effects`,
          );
        } else {
          ensurePlanAvailableInLayer(
            $sideEffect,
            layerPlan.reason.parentLayerPlan,
            () => `${layerPlan}.parentSideEffectStep`,
          );
        }
      }

      // Copy polymorphic parentStepId
      if (layerPlan.reason.type === "polymorphic") {
        const parentStep = layerPlan.reason.parentStep;
        ensurePlanAvailableInLayer(
          parentStep,
          layerPlan,
          () => `${layerPlan} poly`,
        );
      }

      // Ensure list is accessible in parent layerPlan
      if (layerPlan.reason.type === "listItem") {
        const parentStep = layerPlan.reason.parentStep;
        ensurePlanAvailableInLayer(
          parentStep,
          layerPlan.reason.parentLayerPlan,
          () => `${layerPlan} listItem`,
        );
        const stream = layerPlan.reason.stream;
        if (stream != null) {
          if (stream.initialCountStepId) {
            ensurePlanAvailableInLayer(
              this.stepTracker.getStepById(stream.initialCountStepId),
              layerPlan.reason.parentLayerPlan,
              () => `${layerPlan} stream`,
            );
          }
          if (stream.ifStepId) {
            ensurePlanAvailableInLayer(
              this.stepTracker.getStepById(stream.ifStepId),
              layerPlan.reason.parentLayerPlan,
              () => `${layerPlan} stream 2`,
            );
          }
          if (stream.labelStepId) {
            ensurePlanAvailableInLayer(
              this.stepTracker.getStepById(stream.labelStepId),
              layerPlan.reason.parentLayerPlan,
              () => `${layerPlan} stream 3`,
            );
          }
        }
      }

      if (layerPlan.reason.type === "combined") {
        // Loop through combinations and ensure source step is available in parent layer plan
        for (const combo of layerPlan.combinations) {
          for (const source of combo.sources) {
            const { stepId, layerPlanId } = source;
            const sourceLayerPlan = layerPlan.reason.parentLayerPlans.find(
              (p) => p.id === layerPlanId,
            );
            if (!sourceLayerPlan) {
              throw new Error(
                `GrafastInternalError<86d15f1e-7ec8-4095-869a-548daa2cea0e>: Could not find the parent layer plan ${layerPlanId} of ${layerPlan}`,
              );
            }
            const step = this.stepTracker.getStepById(stepId);
            ensurePlanAvailableInLayer(
              step,
              sourceLayerPlan,
              () => `${layerPlan} combo`,
            );
          }
        }
      }
    }

    // Populate copyPlanIds for output plans' rootStepId
    this.stepTracker.allOutputPlans.forEach((outputPlan) => {
      ensurePlanAvailableInLayer(
        outputPlan.rootStep,
        outputPlan.layerPlan,
        () => `${outputPlan} output plan root step`,
      );
    });

    for (const layerPlan of this.stepTracker.layerPlans) {
      if (layerPlan !== null) {
        layerPlan.finalize();
      }
    }
  }

  private finalize(): void {
    const stepDependsOnDistributorInLayerPlan = (
      sstep: Sudo<Step>,
      distrib: Step,
      lp: LayerPlan,
    ) => {
      if (distrib.layerPlan === lp) {
        // No need to handle dependencies in same layer plan; this only relates
        // to handling buckets skipping indexes.
        return;
      }

      // Recurse first (throw error on bad assumption)
      switch (lp.reason.type) {
        case "defer":
        case "nullableBoundary":
        case "polymorphic":
        case "mutationField": {
          const parentLayerPlan = lp.reason.parentLayerPlan;
          stepDependsOnDistributorInLayerPlan(sstep, distrib, parentLayerPlan);
          break;
        }
        case "root": {
          throw new Error(
            `Planning error - could not find path from ${sstep} up to ${distrib}; this is likely a bug in your plan resolvers.`,
          );
        }
        case "subroutine":
        case "combined":
        case "listItem":
        case "subscription":
        case "polymorphicPartition": {
          throw new Error(
            `${sstep} depends on ${distrib} which is marked with 'cloneStreams'; however this dependency crosses a forbidden layer plan boundary at ${lp}`,
          );
        }
        default: {
          const never: never = lp.reason;
          throw new Error(
            `Unhandled layer plan reason ${(never as any)?.type}`,
          );
        }
      }

      // Indicate that this layerPlan must release the relevant distributors if
      // it skips those indicies.
      if (lp.distributorDependencies === null) {
        lp.distributorDependencies = Object.create(null) as {};
      }
      const list = (lp.distributorDependencies[distrib.id] ??= []);
      list.push(sstep.id);
    };

    for (const step of this.stepTracker.activeSteps) {
      const sstep = sudo(step);
      const distribs = sstep.dependencies.filter((d) => d.cloneStreams);
      sstep._dependsOnDistributor = distribs.length > 0;
      if (distribs.length > 0) {
        sstep._dependsOnDistributor = true;
        for (const distrib of distribs) {
          stepDependsOnDistributorInLayerPlan(sstep, distrib, sstep.layerPlan);
        }
      } else {
        sstep._dependsOnDistributor = false;
      }
    }
  }

  /** Optimizes each output plan */
  private optimizeOutputPlans(): void {
    this.stepTracker.allOutputPlans.forEach((outputPlan) =>
      outputPlan.optimize(),
    );
  }

  /** Finalizes each output plan */
  private finalizeOutputPlans(): void {
    this.stepTracker.allOutputPlans.forEach((outputPlan) =>
      outputPlan.finalize(),
    );
  }

  private walkOutputPlans(
    outputPlan: OutputPlan,
    callback: (outputPlan: OutputPlan) => void,
  ): void {
    callback(outputPlan);
    if (outputPlan.child !== null) {
      this.walkOutputPlans(outputPlan.child, callback);
    }
    if (outputPlan.childByTypeName !== undefined) {
      Object.values(outputPlan.childByTypeName).forEach((childOutputPlan) => {
        this.walkOutputPlans(childOutputPlan, callback);
      });
    }
    for (const spec of Object.values(outputPlan.keys)) {
      if (spec.type === "outputPlan") {
        this.walkOutputPlans(spec.outputPlan, callback);
      }
    }
    for (const defer of outputPlan.deferredOutputPlans) {
      this.walkOutputPlans(defer, callback);
    }
  }

  generatePlanJSON(): GrafastPlanJSON {
    function printStep(step: Step): GrafastPlanStepJSONv1 {
      const metaString = step.toStringMeta();
      const sstep = sudo(step);
      return {
        id: step.id,
        stepClass: step.constructor.name,
        metaString: metaString ? stripAnsi(metaString) : metaString,
        isUnary: step._isUnary,
        bucketId: step.layerPlan.id,
        implicitSideEffectStepId: step.implicitSideEffectStep?.id ?? null,
        dependencyIds: sstep.dependencies.map((d) => d.id),
        dependencyForbiddenFlags: sstep.dependencyForbiddenFlags.slice(),
        dependencyOnReject: sstep.dependencyOnReject.map((or) =>
          or ? String(or) : or,
        ),
        dependencyDataOnly: sstep.dependencyDataOnly.slice(),
        polymorphicPaths: step.polymorphicPaths
          ? [...step.polymorphicPaths]
          : undefined,
        isSyncAndSafe: step.isSyncAndSafe || undefined,
        supportsUnbatched:
          typeof (step as any).unbatchedExecute === "function" || undefined,
        hasSideEffects: step.hasSideEffects || undefined,
        stream: step._stepOptions.stream
          ? { initialCountStepId: step._stepOptions.stream.initialCountStepId }
          : undefined,
        extra: step.planJSONExtra(),
      };
    }
    function printPhase(phase: LayerPlanPhase): GrafastPlanBucketPhaseJSONv1 {
      return {
        normalStepIds: phase.normalSteps?.map((s) => s.step.id),
        unbatchedStepIds: phase.unbatchedSyncAndSafeSteps?.map(
          (s) => s.step.id,
        ),
      };
    }
    function printBucketReason(
      layerPlan: LayerPlan,
    ): GrafastPlanBucketReasonJSONv1 {
      const { reason } = layerPlan;
      switch (reason.type) {
        case "root": {
          const { type } = reason;
          return { type };
        }
        case "nullableBoundary": {
          const { type, parentStep } = reason;
          return { type, parentStepId: parentStep.id };
        }
        case "listItem": {
          const { type, parentStep, stream } = reason;
          return { type, parentStepId: parentStep.id, stream };
        }
        case "subscription": {
          const { type } = reason;
          return { type };
        }
        case "mutationField": {
          const { type, mutationIndex } = reason;
          return { type, mutationIndex };
        }
        case "defer": {
          const { type, label } = reason;
          return { type, label };
        }
        case "polymorphic": {
          const { type, typeNames, parentStep, polymorphicPaths } = reason;
          return {
            type,
            typeNames: [...typeNames],
            parentStepId: parentStep.id,
            polymorphicPaths: [...polymorphicPaths],
          };
        }
        case "polymorphicPartition": {
          const { type, typeNames, polymorphicPaths } = reason;
          return {
            type,
            typeNames: [...typeNames],
            polymorphicPaths: [...polymorphicPaths],
          };
        }
        case "subroutine": {
          const { type, parentStep } = reason;
          return { type, parentStepId: parentStep.id };
        }
        case "combined": {
          const { type, parentLayerPlans } = reason;
          return {
            type,
            parentLayerPlanIds: [...parentLayerPlans].map((l) => l.id),
            combinations: layerPlan.combinations.map((c) => ({
              sources: c.sources.map((f) => ({
                layerPlanId: f.layerPlanId,
                stepId: f.stepId,
              })),
              targetStepId: c.targetStepId,
            })),
          };
        }
        default: {
          const never: never = reason;
          throw new Error(
            `Failed to process layer plan reason ${inspect(never)}`,
          );
        }
      }
    }
    function printBucket(lp: LayerPlan): GrafastPlanBucketJSONv1 {
      return {
        id: lp.id,
        reason: printBucketReason(lp),
        parentSideEffectStepId: lp.parentSideEffectStep?.id ?? null,
        copyStepIds: lp.copyStepIds,
        phases: lp.phases.map(printPhase),
        steps: lp.steps.map(printStep),
        childIds: lp.children.map((c) => c.id),
        rootStepId: lp.rootStep ? lp.rootStep.id : null,
      };
    }
    return {
      version: "v1",
      buckets: this.stepTracker.layerPlans
        .filter((b) => b != null)
        .map(printBucket),
    } as GrafastPlanJSONv1;
  }

  finishSubroutine(
    subroutineStep: Step,
    layerPlan: LayerPlan<LayerPlanReasonSubroutine>,
  ): void {
    // Now find anything that these plans are dependent on and make ourself
    // dependent on them.
    const process = (lp: LayerPlan, known: LayerPlan[]) => {
      for (const step of this.stepTracker.activeSteps) {
        if (step.layerPlan === lp) {
          for (const dep of sudo(step).dependencies) {
            if (!known.includes(dep.layerPlan)) {
              // Naughty naughty
              (subroutineStep as any).addDependency(dep);
            }
          }
        }
      }
      for (const child of lp.children) {
        process(child, [...known, child]);
      }
    };
    process(layerPlan, [layerPlan]);
  }

  /**
   * HIGHLY EXPERIMENTAL!
   *
   * @internal
   */
  public deleteLayerPlan(layerPlan: LayerPlan) {
    this.stepTracker.deleteLayerPlan(layerPlan);
  }

  getStepsByMetaKey(metaKey: string | number | symbol): Step[] {
    const matches: Step[] = [];
    for (const step of this.stepTracker.activeSteps) {
      if (step.metaKey === metaKey) {
        matches.push(step);
      }
    }
    return matches;
  }

  getStepsByStepClass<TClass extends Step>(klass: {
    new (...args: any[]): TClass;
  }): TClass[] {
    const matches: TClass[] = [];
    for (const step of this.stepTracker.activeSteps) {
      if (step instanceof klass) {
        matches.push(step);
      }
    }
    return matches;
  }

  private _cacheStepStoreByActionKeyByLayerPlan: Map<number, StepCache> =
    new Map();
  private _immutableCacheStepStoreAndActionKey: StepCache = Object.create(null);
  /**
   * Cache a generated step by a given identifier (cacheKey) such that we don't
   * need to regenerate it on future calls, significantly reducing the load on
   * deduplication later.
   *
   * @experimental
   */
  cacheStep<T extends Step>(
    ownerStep: Step,
    actionKey: string,
    cacheKey: symbol | string | number | boolean | null | undefined,
    cb: () => T,
  ): T {
    const layerPlan = currentLayerPlan();
    let cache = this._cacheStepStoreByActionKeyByLayerPlan.get(layerPlan.id);
    if (!cache) {
      cache = Object.create(null) as StepCache;
      this._cacheStepStoreByActionKeyByLayerPlan.set(layerPlan.id, cache);
    }
    return this._cacheStep(cache, ownerStep, actionKey, cacheKey, cb);
  }

  /** @internal */
  cacheImmutableStep<T extends Step>(
    actionKey: string,
    cacheKey: any /* Anything suitable to be the key in a Map */,
    cb: () => T,
  ): T {
    const cache = this._immutableCacheStepStoreAndActionKey;
    return this._cacheStep(
      cache,
      this.variableValuesStep,
      actionKey,
      cacheKey,
      cb,
    );
  }

  _cacheStep<T extends Step>(
    store: StepCache,
    ownerStep: Step,
    actionKey: string,
    cacheKey: any /* Anything suitable to be the key in a Map */,
    cb: () => T,
  ): T {
    const paths = currentPolymorphicPaths();
    const cache = (store[
      `${actionKey}|${ownerStep.id}|${paths == null ? "" : [...paths].join(",")}`
    ] ??= new Map());

    const cacheIt = () => {
      const stepToCache = cb();
      if (!(stepToCache instanceof Step)) {
        throw new Error(
          `The callback passed to cacheStep must always return an ExecutableStep; but this call from ${ownerStep} returned instead ${inspect(
            stepToCache,
          )}`,
        );
      }
      cache.set(cacheKey, stepToCache.id);
      return stepToCache;
    };

    if (!cache.has(cacheKey)) {
      return cacheIt();
    }

    const cachedStepId = cache.get(cacheKey);
    const cachedStep = this.stepTracker.stepById[cachedStepId] as T | undefined;
    if (cachedStep) {
      return cachedStep;
    } else {
      return cacheIt();
    }
  }

  /**
   * Clears the cache, typically due to side effects having taken place. Called
   * from setting hasSideEffects on an ExecutableStep, among other places.
   */
  public resetCache() {
    this._cacheStepStoreByActionKeyByLayerPlan.clear();
  }

  public withRootLayerPlan<T>(cb: () => T): T {
    return withGlobalLayerPlan(
      this.rootLayerPlan,
      POLYMORPHIC_ROOT_PATHS,
      null,
      null,
      cb,
    );
  }
}

function makeMetaByMetaKeysFactory(
  allMetaKeysList: ReadonlyArray<string | number | symbol>,
) {
  const l = allMetaKeysList.length;
  // Optimize the common cases
  if (l === 0) {
    return makeMetaByMetaKeys0;
  } else if (l === 1) {
    return makeMetaByMetaKeys1Factory(allMetaKeysList[0]);
  } else if (l === 2) {
    return makeMetaByMetaKeys2Factory(allMetaKeysList[0], allMetaKeysList[1]);
  } else if (l === 3) {
    return makeMetaByMetaKeys3Factory(
      allMetaKeysList[0],
      allMetaKeysList[1],
      allMetaKeysList[2],
    );
  } else if (l === 4) {
    return makeMetaByMetaKeys4Factory(
      allMetaKeysList[0],
      allMetaKeysList[1],
      allMetaKeysList[2],
      allMetaKeysList[3],
    );
  } else if (l === 5) {
    return makeMetaByMetaKeys5Factory(
      allMetaKeysList[0],
      allMetaKeysList[1],
      allMetaKeysList[2],
      allMetaKeysList[3],
      allMetaKeysList[4],
    );
  } else if (l === 6) {
    return makeMetaByMetaKeys6Factory(
      allMetaKeysList[0],
      allMetaKeysList[1],
      allMetaKeysList[2],
      allMetaKeysList[3],
      allMetaKeysList[4],
      allMetaKeysList[5],
    );
  }
  return function makeMetaByMetaKey() {
    const metaByMetaKey = Object.create(null);
    for (let i = 0; i < l; i++) {
      metaByMetaKey[allMetaKeysList[i]] = Object.create(null);
    }
    return metaByMetaKey;
  };
}

const EMPTY_OBJECT = Object.freeze(Object.create(null));
function makeMetaByMetaKeys0() {
  return EMPTY_OBJECT;
}
function makeMetaByMetaKeys1Factory(key1: string | number | symbol) {
  return function makeMetaByMetaKeys1() {
    const obj = Object.create(null);
    obj[key1] = Object.create(null);
    return obj;
  };
}
function makeMetaByMetaKeys2Factory(
  key1: string | number | symbol,
  key2: string | number | symbol,
) {
  return function makeMetaByMetaKeys2() {
    const obj = Object.create(null);
    obj[key1] = Object.create(null);
    obj[key2] = Object.create(null);
    return obj;
  };
}
function makeMetaByMetaKeys3Factory(
  key1: string | number | symbol,
  key2: string | number | symbol,
  key3: string | number | symbol,
) {
  return function makeMetaByMetaKeys3() {
    const obj = Object.create(null);
    obj[key1] = Object.create(null);
    obj[key2] = Object.create(null);
    obj[key3] = Object.create(null);
    return obj;
  };
}
function makeMetaByMetaKeys4Factory(
  key1: string | number | symbol,
  key2: string | number | symbol,
  key3: string | number | symbol,
  key4: string | number | symbol,
) {
  return function makeMetaByMetaKeys4() {
    const obj = Object.create(null);
    obj[key1] = Object.create(null);
    obj[key2] = Object.create(null);
    obj[key3] = Object.create(null);
    obj[key4] = Object.create(null);
    return obj;
  };
}
function makeMetaByMetaKeys5Factory(
  key1: string | number | symbol,
  key2: string | number | symbol,
  key3: string | number | symbol,
  key4: string | number | symbol,
  key5: string | number | symbol,
) {
  return function makeMetaByMetaKeys5() {
    const obj = Object.create(null);
    obj[key1] = Object.create(null);
    obj[key2] = Object.create(null);
    obj[key3] = Object.create(null);
    obj[key4] = Object.create(null);
    obj[key5] = Object.create(null);
    return obj;
  };
}
function makeMetaByMetaKeys6Factory(
  key1: string | number | symbol,
  key2: string | number | symbol,
  key3: string | number | symbol,
  key4: string | number | symbol,
  key5: string | number | symbol,
  key6: string | number | symbol,
) {
  return function makeMetaByMetaKeys6() {
    const obj = Object.create(null);
    obj[key1] = Object.create(null);
    obj[key2] = Object.create(null);
    obj[key3] = Object.create(null);
    obj[key4] = Object.create(null);
    obj[key5] = Object.create(null);
    obj[key6] = Object.create(null);
    return obj;
  };
}

function newLayerPlanPhase(): LayerPlanPhase {
  return {
    checkTimeout: false,
    normalSteps: undefined,
    unbatchedSyncAndSafeSteps: undefined,
    _allSteps: [],
  };
}

function throwNoNewStepsError(
  operationPlan: OperationPlan,
  actionDescription: string,
  step: Step,
  previousStepCount: number,
  message: string,
) {
  const newSteps: (Step | null)[] = [];
  for (
    let i = previousStepCount, l = operationPlan.stepTracker.stepCount;
    i < l;
    i++
  ) {
    newSteps.push(operationPlan.stepTracker.stepById[i]);
  }
  throw new Error(
    `${message}; whilst performing ${actionDescription} of ${step} the following new steps were created: ${newSteps
      .map((s) => String(s))
      .join(", ")}`,
  );
}

type QueueTuple<T extends CommonPlanningDetails> = [
  method: (details: T) => void | Generator<() => any, void, any>,
  details: T,
  loc: string[] | null,
  originalLayerPlan: LayerPlan,
  layerPlanLatestSideEffect: Step | null,
];

function isSafeForUnbatched(step: UnbatchedExecutableStep): boolean {
  // Never run (potential) stream steps as unbatched, otherwise they won't be
  // able to stream!
  if (step._stepOptions.stream) return false;
  // Non-unary steps are safe for unbatched execution
  if (step._isUnary === false) return true;
  // Unary steps are only safe for unbatched execution _if_ their polymorphic
  // paths match that of their bucket.
  // !! search "f4ce2c83"
  if (step.polymorphicPaths === null) return true;
  // PERF: this can probably be optimized further
  return false;
}

function defaultPlanType(
  $stepOrSpecifier: Step,
  info: PlanTypeInfo,
): AbstractTypePlanner {
  const $__typename =
    $stepOrSpecifier.toTypename?.() ??
    (info.resolverEmulation
      ? graphqlResolveType($stepOrSpecifier, info)
      : get($stepOrSpecifier, "__typename"));
  return { $__typename };
}

function polymorphicPathsForLayer(
  layer: LayerPlan,
): ReadonlySet<string> | null {
  switch (layer.reason.type) {
    case "polymorphic":
    case "polymorphicPartition": {
      return layer.reason.polymorphicPaths;
    }
    case "combined": {
      const set = new Set<string>();
      for (const lp of layer.reason.parentLayerPlans) {
        for (const p of polymorphicPathsForLayer(lp)!) {
          set.add(p);
        }
      }
      return set;
    }
    case "root": {
      return null;
    }
    default: {
      return polymorphicPathsForLayer(layer.reason.parentLayerPlan);
    }
  }
}

function stepIsValidInPolyPath($step: Step, polyPath: string): boolean {
  if (!$step.polymorphicPaths) return true;
  let trimmed = polyPath;
  do {
    if ($step.polymorphicPaths.has(trimmed)) return true;
    const i = trimmed.lastIndexOf(">");
    trimmed = trimmed.slice(0, i);
  } while (trimmed.length > 0 && trimmed[0] === ">");
  return false;
}

function isPeerLayerPlan(
  lp1: LayerPlan | undefined,
  lp2: LayerPlan | undefined,
) {
  if (lp1 == null || lp2 == null) {
    return false;
  }
  if (lp1 === lp2) return true;
  if (
    lp1.reason.type === "polymorphicPartition" &&
    lp2.reason.type === "polymorphicPartition" &&
    lp1.reason.parentLayerPlan === lp2.reason.parentLayerPlan
  ) {
    return true;
  }
  return false;
}

type StepCache = Record<string, Map<any, any> | undefined>;

interface PlanFieldDetails {
  typeName: string;
  fieldName: string;
  layerPlan: LayerPlan;
  path: readonly string[];
  polymorphicPaths: ReadonlySet<string> | null;
  planningPath: string;
  planResolver: FieldPlanResolver;
  applyAfterMode: ApplyAfterModeArg;
  rawParentStep: Step;
  field: GraphQLField<any, any>;
  trackedArguments: TrackedArguments;
  // If 'true' this is a subscription rather than a stream
  // If 'false' this is a list but it will never stream
  // If 'null' this is neither subscribe field nor list field
  // Otherwise, it's a list field that has the `@stream` directive applied
  streamDetails: StreamDetails | true | false | null;
}

type PlanFieldBatchResult =
  | { error: Error }
  | {
      error?: never;
      haltTree: boolean;
      step: Step;
      latestSideEffectStep: Step | null;
    };

interface PlanFieldBatch {
  complete: boolean;
  batch: Array<PlanFieldDetails>;
  results: Array<PlanFieldBatchResult>;
}

/**
 * NOTE: includes `start` itself, so it's not _truly_ descendents
 */
function getDescendents(
  start: LayerPlan,
  childrenByLayerPlan: ReadonlyMap<LayerPlan, readonly LayerPlan[]>,
): Set<LayerPlan> {
  const descendents = new Set<LayerPlan>();
  const queue = [start];

  while (queue.length > 0) {
    const current = queue.pop()!;

    // Already seen
    if (descendents.has(current)) continue;
    descendents.add(current);

    const children = childrenByLayerPlan.get(current);
    if (children) {
      for (const child of children) {
        queue.push(child);
      }
    }
  }

  return descendents;
}

/**
 * Return the set of poly paths that are common to both `one` and `two` - note
 * that `null` means all possible poly paths.
 */
function intersectPolyPaths(
  one: ReadonlySet<string> | null,
  two: ReadonlySet<string> | null,
): ReadonlySet<string> | null {
  if (one === two) return one;
  if (one == null) return two;
  if (two == null) return one;
  const set = new Set<string>();
  for (const str of one) {
    if (two.has(str)) {
      set.add(str);
    }
  }
  return set;
}
