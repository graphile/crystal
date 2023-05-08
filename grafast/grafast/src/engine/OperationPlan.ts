import LRU from "@graphile/lru";
import type {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLField,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLSchema,
  GraphQLUnionType,
  OperationDefinitionNode,
  SelectionNode,
} from "graphql";
import {
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
} from "graphql";
import te from "tamedevil";

import * as assert from "../assert.js";
import type { Constraint } from "../constraints.js";
import type { SelectionSetDigest } from "../graphqlCollectFields.js";
import {
  evalDirectiveArg,
  graphqlCollectFields,
} from "../graphqlCollectFields.js";
import { fieldSelectionsForType } from "../graphqlMergeSelectionSets.js";
import { ModifierStep } from "../index.js";
import {
  __ItemStep,
  __TrackedValueStep,
  __ValueStep,
  error,
  ExecutableStep,
  object,
  SafeError,
} from "../index.js";
import { inputPlan } from "../input.js";
import { inspect } from "../inspect.js";
import type {
  FieldArgs,
  FieldPlanResolver,
  LocationDetails,
  StepOptions,
  TrackedArguments,
} from "../interfaces.js";
import { $$proxy } from "../interfaces.js";
import type { PrintPlanGraphOptions } from "../mermaid.js";
import { printPlanGraph } from "../mermaid.js";
import { withFieldArgsForArguments } from "../operationPlan-input.js";
import type { ListCapableStep, PolymorphicStep } from "../step.js";
import {
  $$noExec,
  assertExecutableStep,
  assertFinalized,
  isListCapableStep,
  isPolymorphicStep,
  isStreamableStep,
  isUnbatchedExecutableStep,
} from "../step.js";
import { access } from "../steps/access.js";
import { constant, ConstantStep } from "../steps/constant.js";
import { graphqlResolver } from "../steps/graphqlResolver.js";
import {
  assertNotAsync,
  defaultValueToValueNode,
  findVariableNamesUsed,
  isTypePlanned,
} from "../utils.js";
import type {
  LayerPlanPhase,
  LayerPlanReasonPolymorphic,
  LayerPlanReasonSubroutine,
} from "./LayerPlan.js";
import { isDeferredLayerPlan, LayerPlan } from "./LayerPlan.js";
import { withGlobalLayerPlan } from "./lib/withGlobalLayerPlan.js";
import { OutputPlan } from "./OutputPlan.js";
import { StepTracker } from "./StepTracker.js";
import { GrafastPrepareOptions } from "../prepare.js";

const EMPTY_ARRAY: readonly never[] = Object.freeze([]);

export const POLYMORPHIC_ROOT_PATH = "";
const POLYMORPHIC_ROOT_PATHS: ReadonlySet<string> = new Set([
  POLYMORPHIC_ROOT_PATH,
]);
Object.freeze(POLYMORPHIC_ROOT_PATHS);

/** In development we might run additional checks */
const isDev =
  typeof process !== "undefined" &&
  (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test");

/** How many times will we try re-optimizing before giving up */
const MAX_OPTIMIZATION_LOOPS = 10;

/** @internal */
export type OperationPlanPhase =
  | "init"
  | "plan"
  | "validate"
  | "optimize"
  | "finalize"
  | "ready";

// TODO: overhaul the TypeScript for this, allow steps to declaration merge
// their own shapes into it.
export interface MetaByMetaKey {
  [metaKey: string | number | symbol]: Record<string, any>;
}

// performance.now() is supported in most modern browsers, plus node.
const timeSource =
  typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance
    : Date;

export class OperationPlan {
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
   *
   * @internal
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

  private modifierStepCount = 0;
  private modifierDepthCount = 0;
  private modifierSteps: ModifierStep[] = [];

  /** @internal */
  public readonly stepTracker = new StepTracker(this);

  private maxDeduplicatedStepId = -1;
  private maxValidatedStepId = -1;

  /** Constraints based on evaluating variables. @internal */
  public readonly variableValuesConstraints: Constraint[] = [];
  /** Stores the actual variableValues. @internal */
  public readonly variableValuesStep: __ValueStep<{ [key: string]: any }>;
  /** A step for accessing variableValues in a tracked manner (allowing eval). @internal */
  public readonly trackedVariableValuesStep: __TrackedValueStep<{
    [key: string]: any;
  }>;

  /** Constraints based on evaluating context. @internal */
  public readonly contextConstraints: Constraint[] = [];
  /** Stores the actual value of the context. @internal */
  public readonly contextStep: __ValueStep<Grafast.Context>;
  /** Allows accessing context in a tracked manner (allowing eval). @internal */
  public readonly trackedContextStep: __TrackedValueStep<{
    [key: string]: any;
  }>;

  /** Constraints based on evaluating rootValue. @internal */
  public readonly rootValueConstraints: Constraint[] = [];
  /** Stores the actual value of rootValue. @internal */
  public readonly rootValueStep: __ValueStep<any>;
  /** Allows accessing rootValue in a tracked manner (allowing eval). @internal */
  public readonly trackedRootValueStep: __TrackedValueStep<any>;

  /** @internal */
  public makeMetaByMetaKey: () => MetaByMetaKey;

  /**
   * @internal
   */
  public readonly itemStepIdByListStepId: {
    [listStepId: number]: number | undefined;
  } = Object.create(null);

  /**
   * If true, then this operation doesn't use (custom) resolvers.
   */
  public pure = true;

  private startTime = timeSource.now();
  private previousLap = this.startTime;
  private planningTimeout: number | null = null;
  private laps: Array<{
    category: string;
    subcategory: string | undefined;
    elapsed: number;
  }> = [];

  private optimizeMeta = new Map<
    string | number | symbol,
    Record<string, any>
  >();

  constructor(
    public readonly schema: GraphQLSchema,
    public readonly operation: OperationDefinitionNode,
    public readonly fragments: {
      [fragmentName: string]: FragmentDefinitionNode;
    },
    public readonly variableValues: { [key: string]: any },
    public readonly context: { [key: string]: any },
    public readonly rootValue: any,
    options: GrafastPrepareOptions,
  ) {
    this.planningTimeout = options.timeouts?.planning ?? null;
    const queryType = schema.getQueryType();
    assert.ok(queryType, "Schema must have a query type");
    this.queryType = queryType;
    this.mutationType = schema.getMutationType() ?? null;
    this.subscriptionType = schema.getSubscriptionType() ?? null;

    const allTypes = Object.values(schema.getTypeMap());
    const allUnions = allTypes.filter(isUnionType);
    const allObjectTypes = allTypes.filter(isObjectType);
    this.unionsContainingObjectType = Object.create(null);
    for (const objectType of allObjectTypes) {
      this.unionsContainingObjectType[objectType.name] = allUnions.filter((u) =>
        u.getTypes().includes(objectType),
      );
    }

    this.operationType = operation.operation;

    this.phase = "plan";
    this.rootLayerPlan = new LayerPlan(
      this,
      null,
      { type: "root" },
      POLYMORPHIC_ROOT_PATHS,
    );

    // This doesn't do anything, it only exists to align plans more closely
    // with an older version of the planner (to reduce the diff).
    const rootSelectionSetStep = withGlobalLayerPlan(
      this.rootLayerPlan,
      POLYMORPHIC_ROOT_PATHS,
      () => new __ValueStep(),
    );
    this.rootLayerPlan.setRootStep(rootSelectionSetStep);

    // Set up the shared steps for variables, context and rootValue
    [this.variableValuesStep, this.trackedVariableValuesStep] = this.track(
      variableValues,
      this.variableValuesConstraints,
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
      // Helpfully check steps don't do forbidden things.
      this.validateSteps();

      this.lap("validateSteps");
    }

    this.phase = "optimize";

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

    // Replace access plans with direct access, etc
    te.batch(() => {
      this.optimizeOutputPlans();
    });

    this.checkTimeout();
    this.lap("optimizeOutputPlans");

    this.phase = "finalize";

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

    te.batch(() => {
      this.finalizeLayerPlans();
    });

    this.lap("finalizeLayerPlans");

    te.batch(() => {
      this.finalizeOutputPlans();
    });

    this.lap("finalizeOutputPlans");

    this.phase = "ready";

    // this.walkFinalizedPlans();
    // this.preparePrefetches();

    const allMetaKeys = new Set<string | number | symbol>();
    for (const step of this.stepTracker.activeSteps) {
      allMetaKeys.add(step.metaKey);
    }
    const allMetaKeysList = [...allMetaKeys];

    // A JIT'd object constructor
    this.makeMetaByMetaKey = te.run`
return () => {
  const metaByMetaKey = Object.create(null);
${te.join(
  allMetaKeysList.map(
    (key) => te`  metaByMetaKey${te.set(key)} = Object.create(null);`,
  ),
  "\n",
)}
  return metaByMetaKey;
};`;

    this.lap("ready");

    const elapsed = timeSource.now() - this.startTime;

    /*
    console.log(`Planning took ${elapsed.toFixed(1)}ms`);
    let ts = 0;
    const entries: Array<{ process: string; duration: string }> = [];
    for (const lap of this.laps) {
      const elapsed = lap.elapsed - ts;
      ts = lap.elapsed;
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
  }

  private lap(category: string, subcategory?: string): void {
    const now = timeSource.now();
    const elapsed = now - this.previousLap;
    this.previousLap = now;
    this.laps.push({ category, subcategory, elapsed });
  }

  private checkTimeout() {
    if (this.planningTimeout === null) return;
    const elapsed = timeSource.now() - this.startTime;
    if (elapsed > this.planningTimeout) {
      throw new Error("Operation took too long to plan; aborted");
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
  public _addStep(plan: ExecutableStep): number {
    if (!["plan", "validate", "optimize"].includes(this.phase)) {
      throw new Error(
        `Creating a plan during the '${this.phase}' phase is forbidden.`,
      );
    }
    return this.stepTracker.addStep(plan);
  }

  /**
   * Adds a plan to the known steps and returns the number to use as the plan
   * id. ONLY to be used from Step, user code should never call this directly.
   *
   * @internal
   */
  public _addModifierStep(step: ModifierStep<any>): string {
    if (!["plan", "validate", "optimize"].includes(this.phase)) {
      throw new Error(
        `Creating a step during the '${this.phase}' phase is forbidden.`,
      );
    }
    const modifierStepId = `${this.modifierDepthCount}-${this
      .modifierStepCount++}`;
    this.modifierSteps.push(step);
    return modifierStepId;
  }

  /** @internal Use plan.getStep(id) instead. */
  public getStep: (
    id: number,
    requestingStep: ExecutableStep,
  ) => ExecutableStep = isDev
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
  public dangerouslyGetStep(id: number): ExecutableStep {
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
      // TODO: raise this somewhere critical
      if (this.loc) {
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
    if (this.loc) this.loc.push("planQuery()");
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
    this.planSelectionSet(
      outputPlan,
      [],
      POLYMORPHIC_ROOT_PATH,
      this.trackedRootValueStep,
      rootType,
      this.operation.selectionSet.selections,
    );
    if (this.loc) this.loc.pop();
  }

  /**
   * Implements the `PlanOpPlanMutation` algorithm.
   */
  private planMutation(): void {
    if (this.loc) this.loc.push("planMutation()");
    const rootType = this.mutationType;
    if (!rootType) {
      throw new SafeError("No mutation type found in schema");
    }

    this.deduplicateSteps();

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
    this.planSelectionSet(
      outputPlan,
      [],
      POLYMORPHIC_ROOT_PATH,
      this.trackedRootValueStep,
      rootType,
      this.operation.selectionSet.selections,
      true,
    );
    if (this.loc) this.loc.pop();
  }

  /**
   * Implements the `PlanOpPlanSubscription` algorithm.
   */
  private planSubscription(): void {
    if (this.loc) this.loc.push("planSubscription");
    const rootType = this.subscriptionType;
    if (!rootType) {
      throw new SafeError("No subscription type found in schema");
    }
    const selectionSet = this.operation.selectionSet;
    const groupedFieldSet = withGlobalLayerPlan(
      this.rootLayerPlan,
      POLYMORPHIC_ROOT_PATHS,
      () =>
        graphqlCollectFields(
          this,
          this.trackedRootValueStep.id,
          rootType,
          selectionSet.selections,
        ),
    );
    if (groupedFieldSet.deferred.length > 0) {
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

    const trackedArguments = withGlobalLayerPlan(
      this.rootLayerPlan,
      POLYMORPHIC_ROOT_PATHS,
      () => this.getTrackedArguments(rootType, field),
    );
    if (subscriptionPlanResolver) {
      // PERF: optimize this
      const { haltTree, step: subscribeStep } = this.planField(
        this.rootLayerPlan,
        path,
        POLYMORPHIC_ROOT_PATHS,
        rootType,
        fields,
        subscriptionPlanResolver,
        this.trackedRootValueStep,
        fieldSpec,
        trackedArguments,
      );
      if (haltTree) {
        throw new SafeError("Failed to setup subscription");
      }
      const stepOptions: StepOptions = {
        stream: isStreamableStep(subscribeStep as ExecutableStep)
          ? { initialCount: 0 }
          : null,
      };
      subscribeStep._stepOptions = stepOptions;
      this.rootLayerPlan.setRootStep(subscribeStep);

      const subscriptionEventLayerPlan = new LayerPlan(
        this,
        this.rootLayerPlan,
        {
          type: "subscription",
        },
        this.rootLayerPlan.polymorphicPaths,
      );

      // TODO: move this somewhere else
      const hasItemPlan = (
        step: ExecutableStep,
      ): step is ExecutableStep & {
        itemPlan: ($item: ExecutableStep) => ExecutableStep;
      } => {
        return (
          "itemPlan" in (subscribeStep as any) &&
          typeof (subscribeStep as any).itemPlan === "function"
        );
      };

      const $__item = withGlobalLayerPlan(
        subscriptionEventLayerPlan,
        POLYMORPHIC_ROOT_PATHS,
        () => new __ItemStep(subscribeStep),
      );
      subscriptionEventLayerPlan.setRootStep($__item);
      let streamItemPlan = hasItemPlan(subscribeStep)
        ? withGlobalLayerPlan(
            subscriptionEventLayerPlan,
            POLYMORPHIC_ROOT_PATHS,
            () => subscribeStep.itemPlan($__item),
          )
        : $__item;

      // WE MUST RE-FETCH STEPS AFTER DEDUPLICATION!
      this.deduplicateSteps();
      streamItemPlan = this.stepTracker.getStepById(streamItemPlan.id);

      const outputPlan = new OutputPlan(
        subscriptionEventLayerPlan,
        this.rootValueStep,
        { mode: "root", typeName: rootType.name },
        locationDetails,
      );
      this.rootOutputPlan = outputPlan;
      this.planSelectionSet(
        outputPlan,
        [],
        POLYMORPHIC_ROOT_PATH,
        streamItemPlan,
        rootType,
        selectionSet.selections,
      );
    } else {
      const subscribeStep = withGlobalLayerPlan(
        this.rootLayerPlan,
        POLYMORPHIC_ROOT_PATHS,
        () => {
          const $args = object(
            field.arguments?.reduce((memo, arg) => {
              memo[arg.name.value] = trackedArguments.get(arg.name.value);
              return memo;
            }, Object.create(null)) ?? Object.create(null),
          );
          const rawResolver = fieldSpec.resolve;
          const rawSubscriber = fieldSpec.subscribe;
          return graphqlResolver(
            rawResolver,
            rawSubscriber,
            this.trackedRootValueStep,
            $args,
            {
              fieldName,
              fieldNodes: fields,
              fragments: this.fragments,
              operation: this.operation,
              parentType: this.subscriptionType!,
              returnType: fieldSpec.type,
              schema: this.schema,
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
      const stepOptions: StepOptions = {
        stream: isStreamableStep(subscribeStep as ExecutableStep)
          ? { initialCount: 0 }
          : null,
      };
      subscribeStep._stepOptions = stepOptions;

      this.rootLayerPlan.setRootStep(subscribeStep);

      const subscriptionEventLayerPlan = new LayerPlan(
        this,
        this.rootLayerPlan,
        {
          type: "subscription",
        },
        this.rootLayerPlan.polymorphicPaths,
      );

      // TODO: move this somewhere else
      const hasItemPlan = (
        step: ExecutableStep,
      ): step is ExecutableStep & {
        itemPlan: ($item: ExecutableStep) => ExecutableStep;
      } => {
        return (
          "itemPlan" in (subscribeStep as any) &&
          typeof (subscribeStep as any).itemPlan === "function"
        );
      };

      const $__item = withGlobalLayerPlan(
        subscriptionEventLayerPlan,
        POLYMORPHIC_ROOT_PATHS,
        () => new __ItemStep(subscribeStep),
      );

      subscriptionEventLayerPlan.setRootStep($__item);

      let streamItemPlan = hasItemPlan(subscribeStep)
        ? withGlobalLayerPlan(
            subscriptionEventLayerPlan,
            POLYMORPHIC_ROOT_PATHS,
            () => subscribeStep.itemPlan($__item),
          )
        : $__item;

      // WE MUST RE-FETCH STEPS AFTER DEDUPLICATION!
      this.deduplicateSteps();
      streamItemPlan = this.stepTracker.getStepById(streamItemPlan.id);

      const outputPlan = new OutputPlan(
        subscriptionEventLayerPlan,
        this.rootValueStep,
        { mode: "root", typeName: rootType.name },
        locationDetails,
      );
      this.rootOutputPlan = outputPlan;
      this.planSelectionSet(
        outputPlan,
        [],
        POLYMORPHIC_ROOT_PATH,
        streamItemPlan,
        rootType,
        selectionSet.selections,
      );
    }
    if (this.loc) this.loc.pop();
  }

  /**
   * Gets the item plan for a given parent list plan - this ensures we only
   * create one item plan per parent plan.
   */
  private itemStepForListStep<TData>(
    parentLayerPlan: LayerPlan,
    listStep: ExecutableStep<TData> | ExecutableStep<TData[]>,
    depth = 0,
  ): __ItemStep<TData> {
    const itemStepId = this.itemStepIdByListStepId[listStep.id];
    if (itemStepId !== undefined) {
      return this.stepTracker.getStepById(itemStepId) as __ItemStep<TData>;
    }
    // Create a new LayerPlan for this list item
    const layerPlan = new LayerPlan(
      this,
      parentLayerPlan,
      {
        type: "listItem",
        parentStep: listStep,
        stream: listStep._stepOptions.stream ?? undefined,
      },
      listStep.polymorphicPaths,
    );
    const itemPlan = withGlobalLayerPlan(
      layerPlan,
      listStep.polymorphicPaths,
      () => new __ItemStep(listStep, depth),
    );
    layerPlan.setRootStep(itemPlan);
    this.itemStepIdByListStepId[listStep.id] = itemPlan.id;
    return itemPlan;
  }

  /**
   *
   * @param outputPlan - The output plan that this selection set is being added to
   * @param path - The path within the outputPlan that we're adding stuff (only for root/object OutputPlans)
   * @param parentStep - The step that represents the selection set root
   * @param objectType - The object type that this selection set is being evaluated for (note polymorphic selection should already have been handled by this point)
   * @param selections - The GraphQL selections (fields, fragment spreads, inline fragments) to evaluate
   * @param isMutation - If true this selection set should be executed serially rather than in parallel (each field gets its own LayerPlan)
   * @param customRecurse - By default we'll auto-recurse, but you can add recursion to a queue instead (e.g. when handling polymorphism); if you provide this then we also won't deduplicate
   */
  private planSelectionSet(
    outputPlan: OutputPlan,
    path: readonly string[],
    polymorphicPath: string,
    parentStep: ExecutableStep,
    objectType: GraphQLObjectType,
    selections: readonly SelectionNode[],
    isMutation = false,
    customRecurse: null | ((nextUp: () => void) => void) = null,
  ) {
    if (this.loc)
      this.loc.push(
        `planSelectionSet(${objectType.name} @ ${
          outputPlan.layerPlan.id
        } @ ${path.join(".")} @ ${polymorphicPath})`,
      );
    interface NextUp {
      outputPlan: OutputPlan;
      haltTree: boolean;
      stepId: number;
      responseKey: string;
      fieldType: GraphQLOutputType;
      fieldNodes: FieldNode[];
      fieldLayerPlan: LayerPlan;
      locationDetails: LocationDetails;
    }
    const nextUpList: NextUp[] = [];

    const next: (nextUp: NextUp) => void = customRecurse
      ? (nextUp) => void nextUpList.push(nextUp)
      : (nextUp) => processNextUp(nextUp);

    const processNextUp = (nextUp: NextUp): void => {
      const {
        haltTree,
        stepId,
        responseKey,
        fieldType,
        fieldNodes,
        fieldLayerPlan,
        locationDetails,
        // Deliberately shadow
        outputPlan,
      } = nextUp;

      // May have changed due to deduplicate
      const step = this.stepTracker.getStepById(stepId);
      if (haltTree) {
        const isNonNull = isNonNullType(fieldType);
        outputPlan.addChild(objectType, responseKey, {
          type: "outputPlan",
          outputPlan: new OutputPlan(
            fieldLayerPlan,
            step,
            {
              mode: "null",
            },
            locationDetails,
          ),
          isNonNull,
          locationDetails,
        });
      } else {
        this.planIntoOutputPlan(
          outputPlan,
          fieldLayerPlan,
          [...path, responseKey],
          polymorphicPath,
          fieldNodes[0].selectionSet
            ? fieldNodes.flatMap((n) => n.selectionSet!.selections)
            : undefined,
          objectType,
          responseKey,
          fieldType,
          step,
          locationDetails,
        );
      }
    };

    assertObjectType(objectType);
    const groupedFieldSet = withGlobalLayerPlan(
      outputPlan.layerPlan,
      new Set([polymorphicPath]),
      () =>
        graphqlCollectFields(
          this,
          parentStep.id,
          objectType,
          selections,
          isMutation,
        ),
    );
    const objectTypeFields = objectType.getFields();
    const processGroupedFieldSet = (
      // Deliberately shadows
      outputPlan: OutputPlan,
      groupedFieldSet: SelectionSetDigest,
    ) => {
      // `__typename` shouldn't bump the mutation index since it has no side effects.
      let mutationIndex = -1;
      for (const [
        responseKey,
        fieldNodes,
      ] of groupedFieldSet.fields.entries()) {
        // All grouped fields are equivalent, as mandated by GraphQL validation rules. Thus we can take the first one.
        const field = fieldNodes[0];
        const fieldName = field.name.value;
        const objectField = objectTypeFields[fieldName];

        const locationDetails: LocationDetails = {
          parentTypeName: objectType.name,
          fieldName,
          node: fieldNodes,
        };

        if (fieldName.startsWith("__")) {
          if (fieldName === "__typename") {
            outputPlan.addChild(objectType, responseKey, {
              type: "__typename",
              locationDetails,
            });
          } else {
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
          }
          continue;
        }

        if (!objectField) {
          // Field does not exist; this should have been caught by validation
          // but the spec says to just skip it.
          continue;
        }

        const fieldType = objectField.type;
        const rawPlanResolver = objectField.extensions?.grafast?.plan;
        assertNotAsync(rawPlanResolver, `${objectType.name}.${fieldName}.plan`);
        const namedReturnType = getNamedType(fieldType);

        /**
         * This could be the grafast resolver or a user-supplied resolver or
         * nothing.
         */
        const rawResolver = objectField.resolve;
        const rawSubscriber = objectField.subscribe;

        /**
         * This will never be the grafast resolver - only ever the user-supplied
         * resolver or nothing
         */
        const resolvedResolver = rawResolver;

        const usesDefaultResolver =
          !resolvedResolver || resolvedResolver === defaultFieldResolver;

        const resolver =
          resolvedResolver && !usesDefaultResolver ? resolvedResolver : null;
        const subscriber = rawSubscriber;

        // Apply a default plan to fields that do not have a plan nor a resolver.
        const planResolver =
          rawPlanResolver ??
          (usesDefaultResolver ? makeDefaultPlan(fieldName) : undefined);

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

        const typePlan = objectType.extensions?.grafast?.Step;

        if (resolver) {
          this.pure = false;
        }

        const resultIsPlanned = isTypePlanned(this.schema, namedReturnType);
        const fieldHasPlan = !!planResolver;

        // TODO: delete this. Or uncomment it. One or the other.
        // Context: if the parent type has a plan then it's likely that all
        // child fields will need a plan to extract the relevant data from the
        // parent, a resolver alone might not receive what it expects. However,
        // `Query` needs a plan so it can be part of `Node`, and adding
        // resolver-only fields to `Query` makes sense... And really this is
        // just a recommendation to the user, not a hard requirement... So we
        // should remove it.
        /*
        if (typePlan && !fieldHasPlan) {
          throw new Error(
            `Every field within a planned type must have a plan; object type ${
              objectType.name
            } represents an instance of '${
              typePlan.displayName || typePlan.name || "ExecutableStep"
            }', however field ${
              objectType.name
            }.${fieldName} has no plan. Please add an 'extensions.grafast.plan' callback to this field.`,
          );
        }
        */

        if (!typePlan && resultIsPlanned && !fieldHasPlan) {
          throw new Error(
            `Field ${objectType.name}.${fieldName} returns a ${namedReturnType.name} which expects a plan to be available; however this field has no plan() method to produce such a plan; please add 'extensions.grafast.plan' to this field.`,
          );
        }

        if (resultIsPlanned && resolver) {
          throw new Error(
            `Field ${objectType.name}.${fieldName} returns a ${namedReturnType.name} which expects a plan to be available; this means that ${objectType.name}.${fieldName} is forbidden from defining a GraphQL resolver.`,
          );
        }

        let step: ExecutableStep | PolymorphicStep;
        let haltTree = false;
        const polymorphicPaths: ReadonlySet<string> = new Set([
          polymorphicPath,
        ]);
        const fieldLayerPlan = isMutation
          ? new LayerPlan(
              this,
              outputPlan.layerPlan,
              {
                type: "mutationField",
                mutationIndex: ++mutationIndex,
              },
              outputPlan.layerPlan.polymorphicPaths,
            )
          : outputPlan.layerPlan;
        const trackedArguments = withGlobalLayerPlan(
          fieldLayerPlan,
          polymorphicPaths,
          () => this.getTrackedArguments(objectType, fieldNodes[0]),
        );
        if (typeof planResolver === "function") {
          ({ step, haltTree } = this.planField(
            fieldLayerPlan,
            path,
            polymorphicPaths,
            objectType,
            fieldNodes,
            planResolver,
            parentStep,
            objectField,
            trackedArguments,
          ));
        } else {
          // FIXME: should this use the default plan resolver?
          // There's no step resolver; use the parent step
          step = parentStep;
        }

        if (resolver) {
          step = withGlobalLayerPlan(fieldLayerPlan, polymorphicPaths, () => {
            const $args = object(
              field.arguments?.reduce((memo, arg) => {
                memo[arg.name.value] = trackedArguments.get(arg.name.value);
                return memo;
              }, Object.create(null)) ?? Object.create(null),
            );
            return graphqlResolver(resolver, subscriber, step, $args, {
              fieldName,
              fieldNodes,
              fragments: this.fragments,
              operation: this.operation,
              parentType: objectType,
              returnType: fieldType,
              schema: this.schema,
              // @ts-ignore
              path: {
                typename: objectType.name,
                key: fieldName,
                // TODO if we decide to properly support path, we will need to
                // build this at run-time.
                prev: undefined,
              },
            });
          });
        }

        next({
          haltTree,
          stepId: step.id,
          responseKey,
          fieldType,
          fieldNodes,
          fieldLayerPlan,
          locationDetails,
          outputPlan,
        });
      }
      if (groupedFieldSet.deferred) {
        for (const deferred of groupedFieldSet.deferred) {
          const deferredLayerPlan = new LayerPlan(
            this,
            outputPlan.layerPlan,
            {
              type: "defer",
              label: deferred.label,
            },
            new Set([polymorphicPath]),
          );
          const deferredOutputPlan = new OutputPlan(
            deferredLayerPlan,
            outputPlan.rootStep,
            {
              mode: "object",
              deferLabel: deferred.label,
              typeName: objectType.name,
            },
            // TODO: the location details should be tweaked to reference this
            // fragment
            outputPlan.locationDetails,
          );
          outputPlan.deferredOutputPlans.push(deferredOutputPlan);
          processGroupedFieldSet(deferredOutputPlan, deferred);
        }
      }
    };
    processGroupedFieldSet(outputPlan, groupedFieldSet);

    if (customRecurse) {
      customRecurse(() => {
        for (const nextUp of nextUpList) {
          processNextUp(nextUp);
        }
      });
    }

    if (this.loc) this.loc.pop();
  }

  // Similar to the old 'planFieldReturnType'
  private planIntoOutputPlan(
    parentOutputPlan: OutputPlan,
    // Typically this is parentOutputPlan.layerPlan; but in the case of mutationFields it isn't.
    parentLayerPlan: LayerPlan,
    // This is the LAYER-RELATIVE path, not the absolute path! It resets!
    path: readonly string[],
    polymorphicPath: string,
    selections: readonly SelectionNode[] | undefined,
    parentObjectType: GraphQLObjectType | null,
    responseKey: string | null,
    fieldType: GraphQLOutputType,
    $step: ExecutableStep,
    locationDetails: LocationDetails,
    listDepth = 0,
  ) {
    const polymorphicPaths = new Set([polymorphicPath]);
    const nullableFieldType = getNullableType(fieldType);
    const isNonNull = nullableFieldType !== fieldType;

    if (isListType(nullableFieldType)) {
      const listOutputPlan = new OutputPlan(
        parentLayerPlan,
        $step,
        {
          mode: "array",
        },
        locationDetails,
      );
      parentOutputPlan.addChild(parentObjectType, responseKey, {
        type: "outputPlan",
        outputPlan: listOutputPlan,
        isNonNull,
        locationDetails,
      });

      const $__item = this.itemStepForListStep(
        parentLayerPlan,
        $step,
        listDepth,
      );
      const $item = isListCapableStep($step)
        ? withGlobalLayerPlan($__item.layerPlan, polymorphicPaths, () =>
            ($step as ListCapableStep<any>).listItem($__item),
          )
        : $__item;
      this.planIntoOutputPlan(
        listOutputPlan,
        $item.layerPlan,
        [],
        polymorphicPath,
        selections,
        null,
        null,
        nullableFieldType.ofType,
        $item,
        locationDetails,
        listDepth + 1,
      );
    } else if (isScalarType(nullableFieldType)) {
      const scalarPlanResolver = nullableFieldType.extensions?.grafast?.plan;
      assertNotAsync(scalarPlanResolver, `${nullableFieldType.name}.plan`);
      const $leaf =
        typeof scalarPlanResolver === "function"
          ? withGlobalLayerPlan(parentLayerPlan, polymorphicPaths, () =>
              scalarPlanResolver($step, { schema: this.schema }),
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
            serialize: nullableFieldType.serialize.bind(nullableFieldType),
            graphqlType: nullableFieldType,
          },
          locationDetails,
        ),
        locationDetails,
      });
    } else if (isEnumType(nullableFieldType)) {
      parentOutputPlan.addChild(parentObjectType, responseKey, {
        type: "outputPlan",
        isNonNull,
        outputPlan: new OutputPlan(
          parentLayerPlan,
          $step,
          {
            mode: "leaf",
            serialize: nullableFieldType.serialize.bind(nullableFieldType),
            graphqlType: nullableFieldType,
          },
          locationDetails,
        ),
        locationDetails,
      });
    } else if (isObjectType(nullableFieldType)) {
      // Check that the plan we're dealing with is the one the user declared
      /** Either an assertion function or a step class */
      const stepAssertion = nullableFieldType.extensions?.grafast?.Step;
      if (stepAssertion) {
        try {
          if (
            stepAssertion === ExecutableStep ||
            stepAssertion.prototype instanceof ExecutableStep
          ) {
            if (!($step instanceof stepAssertion)) {
              throw new Error(
                `Step mis-match: expected ${
                  stepAssertion.name
                }, but instead found ${
                  ($step as ExecutableStep).constructor.name
                } (${$step})`,
              );
            }
          } else {
            (stepAssertion as ($step: ExecutableStep) => void)($step);
          }
        } catch (e) {
          throw new Error(
            `The step returned by '${path.join(
              ".",
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
        if (match) {
          objectLayerPlan = match;
        } else {
          objectLayerPlan = new LayerPlan(
            this,
            parentLayerPlan,
            {
              type: "nullableBoundary",
              parentStep: $step,
            },
            new Set([polymorphicPath]),
          );
          objectLayerPlan.setRootStep($step);
        }
      }

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
      this.planSelectionSet(
        objectOutputPlan,
        path,
        polymorphicPath,
        $step,
        nullableFieldType,
        selections!,
      );
    } else {
      // Polymorphic
      const isUnion = isUnionType(nullableFieldType);
      const isInterface = isInterfaceType(nullableFieldType);
      if (!(isUnion || isInterface)) {
        throw new Error(
          `GrafastInternalError<a54d6d63-d186-4ab9-9299-05f817894300>: Wasn't expecting ${nullableFieldType}`,
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
       * First we ensure we're dealing with a polymorphic step.
       */
      if (!isPolymorphicStep($step)) {
        throw new Error(
          `${$step} is not a polymorphic capable step, it must have a planForType method`,
        );
      }

      /*
       * Next, we figure out the list of `possibleTypes` based on the
       * union/interface and any other constraints that we know. NOTE: we can't
       * discount a type just because it doesn't have any fragments that apply
       * to it - instead we must still plan an empty selection set (or one just
       * using `{__typename}`), and we need to know it exists for that. See
       * https://github.com/graphql/graphql-spec/issues/951#issuecomment-1140957685
       */
      const allPossibleObjectTypes = isUnion
        ? nullableFieldType.getTypes()
        : this.schema.getImplementations(nullableFieldType).objects;

      /*
       * An output plan for it (knows how to branch the different object
       * output plans).
       */
      const polymorphicOutputPlan = new OutputPlan(
        parentLayerPlan,
        $step,
        {
          mode: "polymorphic",
          deferLabel: undefined,
          typeNames: allPossibleObjectTypes.map((t) => t.name),
        },
        locationDetails,
      );
      parentOutputPlan.addChild(parentObjectType, responseKey, {
        type: "outputPlan",
        outputPlan: polymorphicOutputPlan,
        isNonNull,
        locationDetails,
      });

      /*
       * Now a polymorphic layer plan for all the plans to live in
       */
      const polymorphicLayerPlan = this.getPolymorphicLayerPlan(
        parentLayerPlan,
        path,
        $step,
        allPossibleObjectTypes,
      );

      /*
       * Now we need to loop through each type and plan it.
       */
      for (const type of allPossibleObjectTypes) {
        // Bit of a hack, but saves passing it around through all the arguments
        const newPolymorphicPath = `${polymorphicPath}>${type.name}`;
        polymorphicLayerPlan.polymorphicPaths = new Set([
          ...polymorphicLayerPlan.polymorphicPaths,
          newPolymorphicPath,
        ]);

        const $root = withGlobalLayerPlan(
          polymorphicLayerPlan,
          new Set([newPolymorphicPath]),
          () => $step.planForType(type),
        );
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
        // find all selections compatible with `type`
        const fieldNodes = fieldSelectionsForType(this, type, selections);
        this.planSelectionSet(
          objectOutputPlan,
          path,
          newPolymorphicPath,
          $root,
          type,
          fieldNodes,
          false,
        );
        polymorphicOutputPlan.addChild(type, null, {
          type: "outputPlan",
          isNonNull,
          outputPlan: objectOutputPlan,
          locationDetails,
        });
      }
    }
  }

  private polymorphicLayerPlanByPathByLayerPlan = new Map<
    LayerPlan,
    Map<
      string,
      { stepId: number; layerPlan: LayerPlan<LayerPlanReasonPolymorphic> }
    >
  >();
  private getPolymorphicLayerPlan(
    parentLayerPlan: LayerPlan,
    path: readonly string[],
    $step: ExecutableStep,
    allPossibleObjectTypes: readonly GraphQLObjectType[],
  ): LayerPlan<LayerPlanReasonPolymorphic> {
    // OPTIMIZE: I added the $step.id to pathString to fix a planning issue; but maybe we can do this without branching?
    // https://github.com/benjie/postgraphile-private/issues/109
    const pathString = `${path.join("|")}!${$step.id}`;
    const polymorphicLayerPlanByPath =
      this.polymorphicLayerPlanByPathByLayerPlan.get(parentLayerPlan) ??
      new Map();
    if (polymorphicLayerPlanByPath.size === 0) {
      this.polymorphicLayerPlanByPathByLayerPlan.set(
        parentLayerPlan,
        polymorphicLayerPlanByPath,
      );
    }
    const prev = polymorphicLayerPlanByPath.get(pathString);
    if (prev) {
      const { stepId, layerPlan } = prev;
      const stepByStepId = this.stepTracker.getStepById(stepId);
      const stepBy$stepId = this.stepTracker.getStepById($step.id);
      if (stepByStepId !== stepBy$stepId) {
        throw new Error(
          `GrafastInternalError<e01bdc40-7c89-41c6-8d84-56efa22c872a>: unexpected inconsistency when determining the polymorphic LayerPlan to use (pathString = ${pathString}, ${stepByStepId} (${stepId}) != ${stepBy$stepId} (${$step.id}))`,
        );
      }
      for (const t of allPossibleObjectTypes) {
        if (!layerPlan.reason.typeNames.includes(t.name)) {
          // TODO: do I need to do anything extra here?
          layerPlan.reason.typeNames.push(t.name);
        }
      }
      return layerPlan;
    } else {
      const layerPlan = new LayerPlan(
        this,
        parentLayerPlan,
        {
          type: "polymorphic",
          typeNames: allPossibleObjectTypes.map((t) => t.name),
          parentStep: $step,
        },
        new Set(),
      );
      polymorphicLayerPlanByPath.set(pathString, {
        stepId: $step.id,
        layerPlan,
      });
      return layerPlan;
    }
  }

  private planField(
    layerPlan: LayerPlan,
    path: readonly string[],
    polymorphicPaths: ReadonlySet<string>,
    objectType: GraphQLObjectType,
    fieldNodes: FieldNode[],
    planResolver: FieldPlanResolver<any, ExecutableStep, ExecutableStep>,
    rawParentStep: ExecutableStep,
    field: GraphQLField<any, any>,
    trackedArguments: TrackedArguments,
    deduplicate = true,
  ): { haltTree: boolean; step: ExecutableStep } {
    // The step may have been de-duped whilst sibling steps were planned
    // PERF: this should be handled in the parent?
    const parentStep = this.stepTracker.getStepById(rawParentStep.id);

    if (this.loc) this.loc.push(`planField(${path.join(".")})`);
    try {
      let _fieldArgs!: FieldArgs;

      let step = withGlobalLayerPlan(layerPlan, polymorphicPaths, () =>
        withFieldArgsForArguments(
          this,
          parentStep,
          trackedArguments,
          field,
          (fieldArgs) => {
            _fieldArgs = fieldArgs;
            return planResolver(parentStep, fieldArgs, {
              field,
              schema: this.schema,
            });
          },
        ),
      );
      let haltTree = false;
      if (step === null || (step instanceof ConstantStep && step.isNull())) {
        // Constantly null; do not step any further in this tree.
        step = step || constant(null);
        haltTree = true;
      }
      assertExecutableStep(step);

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
      const streamDirective = fieldNodes[0].directives?.find(
        (d) => d.name.value === "stream",
      );

      const stepOptions: StepOptions = {
        stream:
          !haltTree &&
          streamDirective &&
          isStreamableStep(step as ExecutableStep)
            ? {
                initialCount:
                  Number(
                    evalDirectiveArg<number | null>(
                      fieldNodes[0],
                      "stream",
                      "initialCount",
                      this.trackedVariableValuesStep,
                    ),
                  ) || 0,
              }
            : null,
      };
      step._stepOptions = stepOptions;

      if (deduplicate) {
        // Now that the field has been planned (including arguments, but NOT
        // including selection set) we can deduplicate it to see if any of its
        // peers are identical.
        this.deduplicateSteps();

        // After deduplication, this step may have been substituted; get the
        // updated reference.
        step = this.stepTracker.getStepById(step.id)!;
      }

      return { step, haltTree };
    } catch (e) {
      const step = withGlobalLayerPlan(layerPlan, polymorphicPaths, () =>
        error(e),
      );
      const haltTree = true;
      this.modifierSteps = [];
      // PERF: consider deleting all steps that were allocated during this. For
      // now we'll just rely on tree-shaking.
      return { step, haltTree };
    } finally {
      if (this.loc) this.loc.pop();
    }
  }

  /**
   * A replacement for GraphQL's
   * `CoerceArgumentValues` that factors in tracked variables.
   *
   * @see https://spec.graphql.org/draft/#CoerceArgumentValues()
   */
  private getTrackedArguments(
    objectType: GraphQLObjectType,
    field: FieldNode,
  ): TrackedArguments {
    const trackedArgumentValues = Object.create(null);
    if (field.arguments) {
      const argumentValues = field.arguments;
      const fieldName = field.name.value;
      const fieldSpec = objectType.getFields()[fieldName];
      const argumentDefinitions = fieldSpec.args;

      const seenNames = new Set();
      for (const argumentDefinition of argumentDefinitions) {
        const argumentName = argumentDefinition.name;
        if (seenNames.has(argumentName)) {
          throw new SafeError(
            `Argument name '${argumentName}' seen twice; aborting.`,
          );
        }
        seenNames.add(argumentName);
        const argumentType = argumentDefinition.type;
        const defaultValue = defaultValueToValueNode(
          argumentType,
          argumentDefinition.defaultValue,
        );
        const argumentValue = argumentValues.find(
          (v) => v.name.value === argumentName,
        );
        const argumentPlan = inputPlan(
          this,
          argumentType,
          new Set(),
          argumentValue?.value,
          defaultValue,
        );
        trackedArgumentValues[argumentName] = argumentPlan;
      }
    }
    return {
      get(name) {
        return trackedArgumentValues[name];
      },
    };
  }

  public withModifiers<T>(cb: () => T): T {
    // Stash previous modifiers
    const previousStack = this.modifierSteps.splice(
      0,
      this.modifierSteps.length,
    );
    const previousModifierDepthCount = this.modifierDepthCount++;
    let result;
    let plansToApply;
    try {
      const previousCount = this.modifierStepCount;
      this.modifierStepCount = 0;
      try {
        result = cb();

        // Remove the modifier plans from operationPlan and sort them ready for application.
        plansToApply = this.modifierSteps
          .splice(0, this.modifierSteps.length)
          .reverse();
      } finally {
        // Restore previous modifiers
        this.modifierStepCount = previousCount;
      }
    } finally {
      // Restore previous depth
      this.modifierDepthCount = previousModifierDepthCount;
    }
    for (const mod of previousStack) {
      this.modifierSteps.push(mod);
    }

    // Apply the plans.
    for (let i = 0, l = plansToApply.length; i < l; i++) {
      plansToApply[i].apply();
    }

    return result;
  }

  /**
   * Sets up tracking for the given value (variableValues, context, rootValue).
   */
  private track(
    value: any,
    constraints: Constraint[],
  ): [__ValueStep<any>, __TrackedValueStep] {
    const valueStep = withGlobalLayerPlan(
      this.rootLayerPlan,
      POLYMORPHIC_ROOT_PATHS,
      () => new __ValueStep(),
    );
    const trackedObjectStep = withGlobalLayerPlan(
      this.rootLayerPlan,
      POLYMORPHIC_ROOT_PATHS,
      () => new __TrackedValueStep(value, valueStep, constraints),
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
        if (val instanceof ExecutableStep) {
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

  private replaceStep(
    $original: ExecutableStep,
    $replacement: ExecutableStep,
  ): void {
    this.stepTracker.replaceStep($original, $replacement);
  }

  // PERF: optimize
  /**
   * Process the given steps, either dependencies first (root to leaf) or
   * dependents first (leaves to root).
   *
   * @internal
   */
  public processSteps(
    actionDescription: string,
    fromStepId: number,
    order: "dependents-first" | "dependencies-first",
    callback: (plan: ExecutableStep) => ExecutableStep,
  ): void {
    if (fromStepId === this.stepTracker.stepCount) {
      // Nothing to do since there are no plans to process
      return;
    }

    const previousStepCount = this.stepTracker.stepCount;

    const processed = new Set<ExecutableStep>();

    const processStep = (step: ExecutableStep) => {
      // MUST come before anything else, otherwise infinite loops may occur
      processed.add(step);

      if (!this.stepTracker.activeSteps.has(step)) {
        return step;
      }

      if (order === "dependents-first") {
        for (let i = 0; i < step.dependents.length; i++) {
          const entry = step.dependents[i];
          const { step: $processFirst } = entry;
          if ($processFirst.id >= fromStepId && !processed.has($processFirst)) {
            processStep($processFirst);
            if (step.dependents[i] !== entry) {
              // The world has change; go back to the start
              i = -1;
            }
          }
        }
        // PERF: we should calculate this _once only_ rather than for every step!
        const childLayerPlans =
          this.stepTracker.layerPlansByParentStep.get(step);
        const subroutineLayerPlans =
          childLayerPlans && childLayerPlans.size > 0
            ? [...childLayerPlans].filter((l) => l.reason.type === "subroutine")
            : null;
        if (subroutineLayerPlans !== null && subroutineLayerPlans.length > 0) {
          for (const subroutineLayerPlan of subroutineLayerPlans) {
            const $root = subroutineLayerPlan.rootStep;
            if ($root) {
              processStep($root);
            }
          }
        }
      } else {
        for (const $processFirst of step.dependencies) {
          if ($processFirst.id >= fromStepId && !processed.has($processFirst)) {
            processStep($processFirst);
          }
        }
      }

      // Check again, processing another step may have invalidated this one.
      if (!this.stepTracker.activeSteps.has(step)) {
        return step;
      }

      let replacementStep: ExecutableStep = step;
      try {
        replacementStep = withGlobalLayerPlan(
          step.layerPlan,
          step.polymorphicPaths,
          () => callback(step),
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

      if (replacementStep != step) {
        this.replaceStep(step, replacementStep);
      }
      if (actionDescription !== "deduplicate") {
        this.deduplicateSteps();
      }

      return replacementStep;
    };

    for (let i = fromStepId; i < this.stepTracker.stepCount; i++) {
      const step = this.stepTracker.getStepById(i, true);
      // Check it hasn't been tree-shaken away, or already processed
      if (!step || step.id !== i || processed.has(step)) continue;
      const resultStep = processStep(step);
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
    }

    if (
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
   * effects.
   */
  private getPeers(step: ExecutableStep): ExecutableStep[] {
    if (step.hasSideEffects) {
      return [step];
    }

    const {
      dependencies: deps,
      layerPlan: layerPlan,
      constructor: stepConstructor,
    } = step;
    const dependencyCount = deps.length;

    if (dependencyCount === 0) {
      const allPeers: ExecutableStep[] = [step];
      for (const possiblyPeer of this.stepTracker.stepsWithNoDependencies) {
        if (
          possiblyPeer !== step &&
          !possiblyPeer.hasSideEffects &&
          possiblyPeer.layerPlan === layerPlan &&
          possiblyPeer.constructor === stepConstructor
        ) {
          allPeers.push(possiblyPeer);
        }
      }
      return allPeers;
    } else if (dependencyCount === 1) {
      // Optimized form for steps that have one dependency (extremely common!)

      const { ancestry, deferBoundaryDepth } = layerPlan;
      const dep = deps[0];

      const dl = dep.dependents.length;
      if (dl === 1) {
        // We're the only dependent; therefore we have no peers (since peers
        // share dependencies)
        return [step];
      }

      const minDepth = Math.max(deferBoundaryDepth, dep.layerPlan.depth);
      const allPeers: ExecutableStep[] = [step];

      for (const {
        dependencyIndex: peerDependencyIndex,
        step: possiblyPeer,
      } of dep.dependents) {
        const { layerPlan: peerLayerPlan } = possiblyPeer;
        if (
          possiblyPeer !== step &&
          peerDependencyIndex === 0 &&
          !possiblyPeer.hasSideEffects &&
          possiblyPeer.constructor === stepConstructor &&
          peerLayerPlan.depth >= minDepth &&
          possiblyPeer.dependencies.length === dependencyCount &&
          peerLayerPlan === ancestry[peerLayerPlan.depth]
        ) {
          allPeers.push(possiblyPeer);
        }
      }
      return allPeers;
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
      const possiblePeers: ExecutableStep[] = [];
      for (
        let dependencyIndex = 0;
        dependencyIndex < dependencyCount;
        dependencyIndex++
      ) {
        const dep = deps[dependencyIndex];
        const dl = dep.dependents.length;
        if (dl === 1) {
          // We're the only dependent; therefore we have no peers (since peers
          // share dependencies)
          return [step];
        }
        if (dependencyIndex === dependencyCount - 1) {
          // Check the final dependency - this is likely to have the fewest
          // dependents (since it was added last it's more likely to be
          // unique).
          for (const {
            dependencyIndex: peerDependencyIndex,
            step: possiblyPeer,
          } of dep.dependents) {
            if (
              possiblyPeer !== step &&
              peerDependencyIndex === dependencyIndex &&
              !possiblyPeer.hasSideEffects &&
              possiblyPeer.constructor === stepConstructor &&
              possiblyPeer.dependencies.length === dependencyCount &&
              possiblyPeer.layerPlan === ancestry[possiblyPeer.layerPlan.depth]
            ) {
              possiblePeers.push(possiblyPeer);
            }
          }
        }
        let d = dep.layerPlan.depth;
        if (d > minDepth) {
          minDepth = d;
        }
      }
      const allPeers: ExecutableStep[] = [step];
      outerloop: for (const possiblyPeer of possiblePeers) {
        if (possiblyPeer.layerPlan.depth < minDepth) continue;
        // We know the final dependency matches and the dependency count
        // matches - check the other dependencies match.
        for (let i = 0; i < dependencyCount - 1; i++) {
          if (deps[i] !== possiblyPeer.dependencies[i]) {
            continue outerloop;
          }
        }
        allPeers.push(possiblyPeer);
      }
      return allPeers;
    }
  }

  private isImmoveable(step: ExecutableStep): boolean {
    if (step.hasSideEffects) {
      return true;
    }
    if (step instanceof __ItemStep || step instanceof __ValueStep) {
      return true;
    }
    // PERF: we should calculate this _once only_ rather than for every step!
    const layerPlansWithParentStep =
      this.stepTracker.layerPlansByParentStep.get(step);
    const hasSubroutinesWithParentStep =
      layerPlansWithParentStep &&
      layerPlansWithParentStep.size > 0 &&
      [...layerPlansWithParentStep].some((l) => l.reason.type === "subroutine");
    if (hasSubroutinesWithParentStep) {
      // Don't hoist steps that are the root of a subroutine
      // PERF: we _should_ be able to hoist, but care must be taken. Currently it causes test failures.
      return true;
    }
    return false;
  }

  /**
   * Attempts to hoist the step into a higher layerPlan to maximize
   * deduplication.
   */
  private hoistStep(step: ExecutableStep) {
    if (this.isImmoveable(step)) {
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

    if (step.layerPlan.parentLayerPlan?.reason.type === "mutationField") {
      // Never hoist into a mutation layer
      return;
    }
    switch (step.layerPlan.reason.type) {
      case "root": {
        // There is no higher layerPlan
        return;
      }
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
        // May only need to be evaluated for certain types, so avoid hoisting anything expensive.
        if (
          step.isSyncAndSafe &&
          step.polymorphicPaths.size === step.layerPlan.polymorphicPaths.size
        ) {
          // It's cheap and covers all types, try and hoist it.
          // NOTE: I have concerns about whether this is safe or not, but I
          // have not been able to come up with a counterexample that is
          // unsafe. Should we do so, we should remove this.
          break;
        } else {
          return;
        }
      }
      case "subroutine": {
        // Should be safe to hoist.
        break;
      }
      case "nullableBoundary": {
        // Safe to hoist _unless_ it depends on the root step of the nullableBoundary.
        const $root = step.layerPlan.reason.parentStep!;
        if (step.dependencies.includes($root)) {
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
    const deps = step.dependencies;
    if (deps.some((dep) => dep.layerPlan === step.layerPlan)) {
      return;
    }

    // All our checks passed, hoist it.
    assert.ok(
      step.layerPlan.parentLayerPlan !== null,
      "GrafastInternalError<55c8940f-e8ac-4985-8b34-96fc6f81d62d>: A non-root layer plan had no parent?!",
    );

    // 1: adjust polymorphicPaths to fit new layerPlan
    const parentPolymorphicPaths =
      step.layerPlan.parentLayerPlan.polymorphicPaths;
    const myPaths = [...step.polymorphicPaths];
    if (parentPolymorphicPaths.has(myPaths[0])) {
      // All the others must be valid too
    } else {
      const layerPaths = [...step.layerPlan.polymorphicPaths];
      const newPaths = new Set<string>();
      for (const path of parentPolymorphicPaths) {
        const prefix = path + ">";
        const matches = myPaths.filter((p) => p.startsWith(prefix));
        const layerMatches = layerPaths.filter((p) => p.startsWith(prefix));
        if (matches.length !== layerMatches.length) {
          // Can't hoist because it's not used for all polymorphicPaths of this type
          return;
        } else if (matches.length > 0) {
          newPaths.add(path);
        }
      }
      step.polymorphicPaths = newPaths;
    }

    const $subroutine =
      step.layerPlan.reason.type === "subroutine"
        ? step.layerPlan.reason.parentStep
        : null;

    // 2: move it up a layer
    this.stepTracker.moveStepToLayerPlan(step, step.layerPlan.parentLayerPlan);

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
  private pushDown(step: ExecutableStep): void {
    if (this.isImmoveable(step)) {
      return;
    }
    switch (step.layerPlan.reason.type) {
      case "root":
      case "subscription":
      case "defer":
      case "polymorphic":
      case "subroutine":
      case "nullableBoundary":
      case "listItem": {
        // Fine to push lower
        break;
      }
      case "mutationField": {
        // NOTE: It's the user's responsibility to ensure that steps that have
        // side effects are marked as such via `step.hasSideEffects = true`.
        if (step.isSyncAndSafe && !step.hasSideEffects) {
          break;
        } else {
          // Side effects should take place inside the mutation field plan
          // (that's the whole point), so we should not push these down.
          return;
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
    if (outputPlans) {
      for (const outputPlan of outputPlans) {
        if (outputPlan.layerPlan === step.layerPlan) {
          return;
        } else {
          dependentLayerPlans.add(outputPlan.layerPlan);
        }
      }
    }

    for (const { step: s } of step.dependents) {
      if (s.layerPlan === step.layerPlan) {
        return;
      } else {
        dependentLayerPlans.add(s.layerPlan);
      }
    }

    const layerPlansByParent =
      this.stepTracker.layerPlansByParentStep.get(step);
    if (layerPlansByParent) {
      for (const layerPlan of layerPlansByParent) {
        if (layerPlan.parentLayerPlan === step.layerPlan) {
          return;
        } else {
          dependentLayerPlans.add(layerPlan.parentLayerPlan!);
        }
      }
    }

    const layerPlansByRoot = this.stepTracker.layerPlansByRootStep.get(step);
    if (layerPlansByRoot) {
      for (const layerPlan of layerPlansByRoot) {
        if (layerPlan === step.layerPlan) {
          return;
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

    const paths: LayerPlan[][] = [];
    let minPathLength = Infinity;

    for (const dependentLayerPlan of dependentLayerPlans) {
      let lp = dependentLayerPlan;
      const path: LayerPlan[] = [lp];
      while (lp.parentLayerPlan != step.layerPlan) {
        const parent = lp.parentLayerPlan;
        if (!parent) {
          throw new Error(
            `GrafastInternalError<64c07427-4fe2-43c4-9858-272d33bee0b8>: invalid layer plan heirarchy`,
          );
        }
        lp = parent;
        path.push(lp);
      }
      paths.push(path);
      minPathLength = Math.min(path.length, minPathLength);
    }

    const dependentLayerPlanCount = dependentLayerPlans.size;

    let deepest = step.layerPlan;
    outerloop: for (let i = 0; i < minPathLength; i++) {
      const expected = paths[0][i];
      if (expected.reason.type === "polymorphic") {
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
      return;
    }

    // All our checks passed, shove it down!

    // 1: no need to adjust polymorphicPaths, since we don't cross polymorphic boundary
    const targetPolymorphicPaths = deepest.polymorphicPaths;
    if (!targetPolymorphicPaths.has([...step.polymorphicPaths][0])) {
      throw new Error(
        `GrafastInternalError<53907e56-940a-4173-979d-bc620e4f1ff8>: polymorphic assumption doesn't hold. Mine = ${[
          ...step.polymorphicPaths,
        ]}; theirs = ${[...deepest.polymorphicPaths]}`,
      );
    }

    // 2: move it to target layer
    this.stepTracker.moveStepToLayerPlan(step, deepest);
  }

  private _deduplicateInnerLogic(step: ExecutableStep) {
    step.isArgumentsFinalized = true;

    if (step.hasSideEffects) {
      // Never deduplicate plans with side effects.
      return null;
    }

    if (step instanceof __ItemStep) {
      // __ItemStep cannot be deduplicated
      return null;
    }

    const stepOptions = this.getStepOptionsForStep(step);
    const shouldStream = !!stepOptions?.stream;
    // OPTIMIZE: Past Benjie thought we might want to revisit this under the
    // new Grafast system. No idea what he had in mind there though...
    if (shouldStream) {
      // Never deduplicate streaming plans, we cannot reference the stream more
      // than once (and we aim to not cache the stream because we want its
      // entries to be garbage collected).
      return null;
    }

    const peers = this.getPeers(step);
    const equivalentSteps = step.deduplicate(
      peers.length === 1 ? EMPTY_ARRAY : peers,
    );
    if (equivalentSteps.length === 0) {
      // No equivalents, we're the original
      return null;
    }

    if (isDev) {
      if (
        !equivalentSteps.every((replacementStep) =>
          peers.includes(replacementStep),
        )
      ) {
        throw new Error(
          `deduplicatePlan error: Expected to replace step ${step} with one of its (identical) peers; instead found ${equivalentSteps}. This is currently forbidden because it could cause confusion during the optimization process, instead apply this change in 'optimize', or make sure that any child selections aren't applied until the optimize/finalize phase so that no mapping is required during deduplicate.`,
        );
      }
    }

    const allEquivalentSteps = equivalentSteps.includes(step)
      ? equivalentSteps
      : [step, ...equivalentSteps];

    // Prefer the step that's closest to the root LayerPlan; failing that, prefer the step with the lowest id.
    let minDepth = Infinity;
    let stepsAtMinDepth: ExecutableStep[] = [];
    for (const step of allEquivalentSteps) {
      let depth = 0;
      let layer: LayerPlan | null = step.layerPlan;
      while ((layer = layer.parentLayerPlan)) {
        depth++;
        if (depth > minDepth) {
          // No point digging deeper
          break;
        }
      }
      if (depth < minDepth) {
        minDepth = depth;
        stepsAtMinDepth = [step];
      } else if (depth === minDepth) {
        stepsAtMinDepth.push(step);
      }
    }
    stepsAtMinDepth.sort((a, z) => a.id - z.id);
    return { stepsAtMinDepth, allEquivalentSteps };
  }

  private deduplicateStep(step: ExecutableStep): ExecutableStep {
    const result = this._deduplicateInnerLogic(step);
    if (result == null) {
      return step;
    }

    const { stepsAtMinDepth, allEquivalentSteps } = result;
    if (allEquivalentSteps.length === 1) {
      const [first] = allEquivalentSteps;
      if (first === step) {
        return step;
      }
    }

    // Hooray, one winning layer! Find the first one by id.
    const winner = stepsAtMinDepth[0];

    const polymorphicPaths = new Set<string>();
    for (const s of stepsAtMinDepth) {
      for (const p of s.polymorphicPaths) {
        polymorphicPaths.add(p);
      }
    }
    winner.polymorphicPaths = polymorphicPaths;

    // Give the steps a chance to pass their responsibilities to the winner.
    for (const target of allEquivalentSteps) {
      if (winner !== target) {
        target.deduplicatedWith(winner);
        this.replaceStep(target, winner);
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
  private deduplicateSteps() {
    this.processSteps(
      "deduplicate",
      this.maxDeduplicatedStepId + 1,
      "dependencies-first",
      (step) => this.deduplicateStep(step),
    );
    this.maxDeduplicatedStepId = this.stepTracker.stepCount - 1;
  }

  private hoistSteps() {
    this.processSteps("hoist", 0, "dependencies-first", (step) => {
      this.hoistStep(step);
      // Even if step wasn't hoisted, its deps may have been so we should still
      // re-deduplicate it.
      return this.deduplicateStep(step);
    });
  }

  private pushDownSteps() {
    this.processSteps("pushDown", 0, "dependents-first", (step) => {
      this.pushDown(step);
      return step;
    });
  }

  private getStepOptionsForStep(step: ExecutableStep): StepOptions {
    return step._stepOptions;
    /*
    // NOTE: streams can only be merged if their parameters are compatible
    // (namely they need to have equivalent `initialCount`)
    const streamLayerPlan = step.childLayerPlans.find(
      (lp) => lp.reason.type === "stream",
    );

    // PERF: if step isn't streamable, don't create a streamLayerPlan because
    // there's no point (and then we can leverage better optimisations).

    return {
      stream:
        streamLayerPlan && isStreamableStep(step)
          ? // && streamLayerPlan.parentStep === step
            { initialCount: streamLayerPlan.reason.initialCount }
          : null,
    };
    */
  }

  /**
   * Calls the 'optimize' method on a plan, which may cause the plan to
   * communicate with its (deep) dependencies, and even to replace itself with
   * a different plan.
   */
  private optimizeStep(inStep: ExecutableStep): ExecutableStep {
    const step = inStep.allowMultipleOptimizations
      ? this.deduplicateStep(inStep)
      : inStep;
    if (step.isOptimized && !step.allowMultipleOptimizations) {
      return step;
    }

    // We know if it's streaming or not based on the LayerPlan it's contained within.
    const stepOptions = this.getStepOptionsForStep(step);
    let meta = this.optimizeMeta.get(step.optimizeMetaKey);
    if (!meta) {
      meta = Object.create(null) as Record<string, any>;
      this.optimizeMeta.set(step.optimizeMetaKey, meta);
    }
    const replacementStep = step.optimize({
      ...stepOptions,
      meta,
    });
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
    const thirdAndFutureLoopReplacedPlans: ExecutableStep[] = [];
    for (let loops = 0; loops < MAX_OPTIMIZATION_LOOPS; loops++) {
      let replacedPlan = false;
      this.processSteps(
        "optimize",
        0,
        "dependents-first",
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

  /** Finalizes each step */
  private finalizeSteps(): void {
    const initialStepCount = this.stepTracker.stepCount;
    assert.strictEqual(
      this.modifierSteps.length,
      0,
      "No modifier steps expected when performing finalizeSteps",
    );
    for (const step of this.stepTracker.activeSteps) {
      step.finalize();
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
      dep: ExecutableStep,
      layerPlan: LayerPlan,
    ): void => {
      let currentLayerPlan: LayerPlan | null = layerPlan;

      while (dep.layerPlan !== currentLayerPlan) {
        if (currentLayerPlan.copyStepIds.includes(dep.id)) {
          break;
        }
        if (isDev && this.stepTracker.getStepById(dep.id) !== dep) {
          throw new Error(
            `Plan mismatch - ${dep} != ${this.stepTracker.getStepById(dep.id)}`,
          );
        }
        currentLayerPlan.copyStepIds.push(dep.id);
        currentLayerPlan = currentLayerPlan.parentLayerPlan;
        if (!currentLayerPlan) {
          throw new Error(
            `GrafastInternalError<8c1640b9-fa3c-440d-99e5-7693d0d7e5d1>: could not find layer plan for '${dep}' in chain from layer plan ${layerPlan}`,
          );
        }
      }
    };

    for (const layerPlan of this.stepTracker.layerPlans) {
      if (!layerPlan) {
        continue;
      }
      layerPlan.steps = [];
    }
    for (const step of this.stepTracker.activeSteps) {
      step.layerPlan.steps.push(step);
    }

    for (const layerPlan of this.stepTracker.layerPlans) {
      if (!layerPlan) {
        continue;
      }
      layerPlan.pendingSteps = layerPlan.steps.filter((s) => !($$noExec in s));
      const sideEffectSteps = layerPlan.pendingSteps.filter(
        (s) => s.hasSideEffects,
      );
      const pending = new Set<ExecutableStep>(layerPlan.pendingSteps);
      const processed = new Set<ExecutableStep>();

      const processSideEffectPlan = (step: ExecutableStep) => {
        if (processed.has(step)) {
          return;
        }
        processed.add(step);
        pending.delete(step);

        const sideEffectDeps: ExecutableStep[] = [];
        const rest: ExecutableStep[] = [];
        for (const dep of step.dependencies) {
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

        layerPlan.phases.push({ normalSteps: [{ step }], _allSteps: [step] });
      };

      for (const sideEffectStep of sideEffectSteps) {
        processSideEffectPlan(sideEffectStep);
      }

      const readyToExecute = (step: ExecutableStep): boolean => {
        for (const dep of step.dependencies) {
          if (dep.layerPlan === layerPlan && pending.has(dep)) {
            return false;
          }
        }
        return true;
      };

      while (pending.size > 0) {
        const nextSteps: ExecutableStep[] = [];
        for (const step of pending) {
          if (readyToExecute(step)) {
            nextSteps.push(step);
          }
        }
        if (nextSteps.length === 0) {
          console.log(this.printPlanGraph());
          throw new Error(
            `GrafastInternalError<2904ebbf-6344-4f2b-9305-8db9c1ff29c5>: Could not compute execution order?! Remaining: ${[
              ...pending,
            ]} (processed: ${[...processed]}; all: ${layerPlan.pendingSteps})`,
          );
        }

        // Do not add to processed until whole layer is known
        const phase: Omit<LayerPlanPhase, "_allSteps"> = Object.create(null);
        for (const step of nextSteps) {
          processed.add(step);
          pending.delete(step);
          if (step.isSyncAndSafe && isUnbatchedExecutableStep(step)) {
            if (phase.unbatchedSyncAndSafeSteps) {
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
            if (phase.normalSteps) {
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
            if (step.isSyncAndSafe && isUnbatchedExecutableStep(step)) {
              if (readyToExecute(step)) {
                processed.add(step);
                pending.delete(step);
                foundOne = true;
                if (phase.unbatchedSyncAndSafeSteps) {
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

        const _allSteps: ExecutableStep[] = [];
        if (phase.normalSteps) {
          for (const { step } of phase.normalSteps) {
            _allSteps.push(step);
          }
        }
        if (phase.unbatchedSyncAndSafeSteps) {
          for (const { step } of phase.unbatchedSyncAndSafeSteps) {
            _allSteps.push(step);
          }
        }
        layerPlan.phases.push(Object.assign(phase, { _allSteps }));
      }

      // PERF: this could probably be faster.
      // Populate copyPlanIds for each step
      for (const step of layerPlan.steps) {
        // Items shouldn't have their "list" copied in.
        if ($$noExec in step) {
          continue;
        }
        for (const dep of step.dependencies) {
          ensurePlanAvailableInLayer(dep, layerPlan);
        }
      }

      const $root = layerPlan.rootStep;
      if ($root) {
        ensurePlanAvailableInLayer($root, layerPlan);
      }

      // Copy polymorphic parentStepId
      if (layerPlan.reason.type === "polymorphic") {
        const parentStep = layerPlan.reason.parentStep;
        ensurePlanAvailableInLayer(parentStep, layerPlan);
      }

      // Ensure list is accessible in parent layerPlan
      if (layerPlan.reason.type === "listItem") {
        const parentStep = layerPlan.reason.parentStep;
        ensurePlanAvailableInLayer(parentStep, layerPlan.parentLayerPlan!);
      }
    }

    // Populate copyPlanIds for output plans' rootStepId
    this.stepTracker.allOutputPlans.forEach((outputPlan) => {
      ensurePlanAvailableInLayer(outputPlan.rootStep, outputPlan.layerPlan);
    });

    for (const layerPlan of this.stepTracker.layerPlans) {
      if (layerPlan) {
        layerPlan.finalize();
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
    if (outputPlan.child) {
      this.walkOutputPlans(outputPlan.child, callback);
    }
    if (outputPlan.childByTypeName) {
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

  /**
   * Convert an OpPlan into a plan graph in mermaid-js format.
   */
  printPlanGraph(options: PrintPlanGraphOptions = {}): string {
    return printPlanGraph(this, options, {
      steps: this.stepTracker.stepById,
    });
  }

  finishSubroutine(
    subroutineStep: ExecutableStep,
    layerPlan: LayerPlan<LayerPlanReasonSubroutine>,
  ): void {
    // Now find anything that these plans are dependent on and make ourself
    // dependent on them.
    const process = (lp: LayerPlan, known: LayerPlan[]) => {
      for (const step of this.stepTracker.activeSteps) {
        if (step.layerPlan === lp) {
          for (const dep of step.dependencies) {
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

  getStepsByMetaKey(metaKey: string | number | symbol): ExecutableStep[] {
    const matches: ExecutableStep[] = [];
    for (const step of this.stepTracker.activeSteps) {
      if (step.metaKey === metaKey) {
        matches.push(step);
      }
    }
    return matches;
  }

  getStepsByStepClass<TClass extends ExecutableStep>(klass: {
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
}

function makeDefaultPlan(fieldName: string) {
  return ($step: ExecutableStep) => access($step, [fieldName]);
}
