import * as assert from "assert";
import type {
  FragmentDefinitionNode,
  GraphQLObjectType,
  GraphQLSchema,
  OperationDefinitionNode,
} from "graphql";

import type { Constraint } from "../constraints.js";
import type { ModifierStep } from "../index.js";
import {
  __ItemStep,
  __TrackedObjectStep,
  __ValueStep,
  ExecutableStep,
} from "../index.js";
import type { PlanOptions } from "../interfaces.js";
import { assertFinalized, isStreamableStep } from "../step.js";
import { arraysMatch } from "../utils.js";
import { isDeferredLayerPlan, LayerPlan } from "./LayerPlan.js";
import type { SchemaDigest } from "./lib/digestSchema.js";
import { digestSchema } from "./lib/digestSchema.js";
import { withGlobalLayerPlan } from "./lib/withGlobalLayerPlan.js";

const BEFORE = -1;
const AFTER = 1;

function isNotNullish<T>(v: T | undefined | null): v is T {
  return v != null;
}

/** In development we might run additional checks */
const isDev =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

/** How many times will we try re-optimizing before giving up */
const MAX_OPTIMIZATION_LOOPS = 10;

type OperationPlanPhase =
  | "init"
  | "plan"
  | "validate"
  | "optimize"
  | "finalize"
  | "ready";

export class OperationPlan {
  private queryType: GraphQLObjectType;
  private mutationType: GraphQLObjectType | null;
  private subscriptionType: GraphQLObjectType | null;

  private schemaDigest: SchemaDigest;
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
  private phase: OperationPlanPhase = "init";
  /**
   * Gets updated as we work our way through the plan, useful for making errors more helpful.
   */
  public loc: string[] = [];

  private layerPlans: LayerPlan[] = [];
  private rootLayerPlan: LayerPlan;

  private stepCount = 0;
  private modifierStepCount = 0;
  private modifierSteps: ModifierStep[] = [];
  /**
   * The full list of ExecutableSteps that this OperationPlan has created.
   *
   * @remarks
   *
   * Note that although this says that the type of the field is non-nullable we
   * may in fact store nulls, but we will only do so as the result of tree
   * shaking and it should generally be assumed that having done so nothing
   * can reference the deleted plan and thus no error will occur.
   */
  private readonly steps: ExecutableStep[] = [];

  private maxDeduplicatedStepId = -1;
  private maxValidatedStepId = -1;

  /** Constraints based on evaluating variables. @internal */
  public readonly variableValuesConstraints: Constraint[] = [];
  /** Stores the actual variableValues. @internal */
  private readonly variableValuesStep: __ValueStep<{ [key: string]: any }>;
  /** A step for accessing variableValues in a tracked manner (allowing eval). @internal */
  private readonly trackedVariableValuesStep: __TrackedObjectStep<{
    [key: string]: any;
  }>;

  /** Constraints based on evaluating context. @internal */
  public readonly contextConstraints: Constraint[] = [];
  /** Stores the actual value of the context. @internal */
  public readonly contextStep: __ValueStep<{ [key: string]: any }>;
  /** Allows accessing context in a tracked manner (allowing eval). @internal */
  public readonly trackedContextStep: __TrackedObjectStep<{
    [key: string]: any;
  }>;

  /** Constraints based on evaluating rootValue. @internal */
  public readonly rootValueConstraints: Constraint[] = [];
  /** Stores the actual value of rootValue. @internal */
  public readonly rootValueStep: __ValueStep<any>;
  /** Allows accessing rootValue in a tracked manner (allowing eval). @internal */
  public readonly trackedRootValueStep: __TrackedObjectStep<any>;

  private makeMetaByStepId: () => { [planId: string]: Record<string, any> };

  constructor(
    public readonly schema: GraphQLSchema,
    public readonly operation: OperationDefinitionNode,
    public readonly fragments: {
      [fragmentName: string]: FragmentDefinitionNode;
    },
    public readonly variableValues: { [key: string]: any },
    public readonly context: { [key: string]: any },
    public readonly rootValue: any,
  ) {
    this.schemaDigest = digestSchema(schema);
    this.operationType = operation.operation;

    this.phase = "plan";

    // Set up the shared steps for variables, context and rootValue
    this.rootLayerPlan = new LayerPlan(this, null, null, { type: "root" });
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
    this.rootLayerPlan.parentStep = this.trackedRootValueStep;

    this.deduplicateSteps();

    // Plan the operation
    this.planOperation();

    if (isDev) {
      this.phase = "validate";
      // Helpfully check steps don't do forbidden things.
      this.validateSteps();
    }

    // Get rid of temporary steps
    this.treeShakeSteps();

    this.phase = "optimize";

    // Replace/inline/optimise steps
    this.optimizeSteps();

    // Get rid of steps that are no longer needed after optimising
    this.treeShakeSteps();

    this.phase = "finalize";

    // Plans are expected to execute later; they may take steps here to prepare
    // themselves (e.g. compiling SQL queries ahead of time).
    this.finalizeSteps();

    this.phase = "ready";

    // this.walkFinalizedPlans();
    // this.preparePrefetches();

    // A JIT'd object constructor
    this.makeMetaByStepId = new Function(
      `return { ${Object.entries(this.steps)
        .map(([planId, plan]) =>
          plan && plan.id === Number(planId)
            ? `${JSON.stringify(plan.id)}: Object.create(null)`
            : null,
        )
        .filter(isNotNullish)
        .join(", ")} }`,
    ) as any;
  }

  /**
   * Called by the LayerPlan's constructor when it wants to get a new id to use.
   *
   * @internal
   */
  public addLayerPlan(layerPlan: LayerPlan) {
    return this.layerPlans.push(layerPlan) - 1;
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
    const planId = this.stepCount++;
    this.steps[planId] = plan;
    return planId;
  }

  /**
   * Adds a plan to the known steps and returns the number to use as the plan
   * id. ONLY to be used from Step, user code should never call this directly.
   *
   * @internal
   */
  public _addModifierStep(step: ModifierStep<any>): string {
    if (!["step", "validate", "optimize"].includes(this.phase)) {
      throw new Error(
        `Creating a step during the '${this.phase}' phase is forbidden.`,
      );
    }
    const modifierStepId = `${this.modifierStepCount++}`;
    this.modifierSteps.push(step);
    return modifierStepId;
  }

  /** @internal Use plan.getStep(id) instead. */
  public getStep: (
    id: string,
    requestingStep: ExecutableStep,
  ) => ExecutableStep = isDev
    ? (id, requestingStep) => {
        if (!["plan", "validate", "optimize"].includes(this.phase)) {
          throw new Error(
            `Getting a plan during the '${this.phase}' phase is forbidden - please do so before or during the optimize phase.`,
          );
        }

        // TODO: check that requestingStep is allowed to get steps
        if (
          requestingStep.isOptimized &&
          (this.phase !== "optimize" ||
            !requestingStep.allowMultipleOptimizations)
        ) {
          throw new Error(
            `Optimized plan ${requestingStep} is not permitted to request other steps (requested '${id}')`,
          );
        }

        const plan = this.steps[id];
        if (plan == null) {
          throw new Error(
            `Programming error: plan with id '${id}' no longer exists`,
          );
        }
        return plan;
      }
    : (id, _requestingStep) => this.steps[id];

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
          throw new Error(`Unsupported operation type '${never}'.`);
        }
      }
    } catch (e) {
      // TODO: raise this somewhere critical
      console.error(
        `Error occurred during query planning (at ${this.loc.join(" > ")}): \n${
          e.stack || e
        }`,
      );
      throw new Error(`Failed to plan this query.`);
    }
  }

  /**
   * Plans a GraphQL query operation.
   */
  private planQuery(): void {
    this.loc.push("planQuery()");
    const rootType = this.queryType;
    if (!rootType) {
      throw new Error("No query type found in schema");
    }
    const { fieldDigests } = this.planSelectionSet(
      ROOT_PATH,
      ROOT_PATH,
      this.trackedRootValueStep,
      rootType,
      [
        {
          groupId: 0,
          selections: this.operation.selectionSet.selections,
        },
      ],
      this.rootTreeNode,
    );
    this.setRootFieldDigest(this.queryType, fieldDigests);
    this.loc.pop();
  }

  /**
   * Implements the `PlanOpPlanMutation` algorithm.
   */
  private planMutation(): void {
    this.loc.push("planMutation()");
    const rootType = this.schema.getMutationType();
    if (!rootType) {
      throw new Error("No mutation type found in schema");
    }
    this.finalizeArgumentsSince(0, ROOT_PATH);
    const { fieldDigests } = this.planSelectionSet(
      ROOT_PATH,
      ROOT_PATH,
      this.trackedRootValueStep,
      rootType,
      [
        {
          groupId: 0,
          selections: this.operation.selectionSet.selections,
        },
      ],
      this.rootTreeNode,
      true,
    );
    this.setRootFieldDigest(this.mutationType!, fieldDigests);
    this.loc.pop();
  }

  /**
   * Implements the `PlanOpPlanSubscription` algorithm.
   */
  private planSubscription(): void {
    this.loc.push("planSubscription");
    const rootType = this.schema.getSubscriptionType();
    if (!rootType) {
      throw new Error("No subscription type found in schema");
    }
    const selectionSet = this.operation.selectionSet;
    const wgs = withGlobalState.bind(null, {
      opPlan: this,
      parentPathIdentity: ROOT_PATH,
    }) as <T>(cb: () => T) => T;
    const groupedFieldSet = wgs(() =>
      graphqlCollectFields(this, this.trackedRootValueStep.id, rootType, [
        {
          groupId: 0,
          selections: selectionSet.selections,
        },
      ]),
    );
    let firstKey: string | undefined = undefined;
    for (const key of groupedFieldSet.keys()) {
      if (firstKey !== undefined) {
        throw new Error("subscriptions may only have one top-level field");
      }
      firstKey = key;
    }
    assert.ok(firstKey != null, "selection set cannot be empty");
    const fields = groupedFieldSet.get(firstKey);
    if (!fields) {
      throw new Error("Consistency error.");
    }
    // TODO: maybe assert that all fields have groupId: 0?
    const { field, groupId: _groupId } = fields[0];
    const fieldName = field.name.value; // Unaffected by alias.
    const rootTypeFields = rootType.getFields();
    const fieldSpec: GraphQLField<unknown, unknown> = rootTypeFields[fieldName];
    const subscriptionPlanResolver =
      fieldSpec.extensions?.graphile?.subscribePlan;
    if (subscriptionPlanResolver) {
      const { haltTree, plan: subscribePlan } = this.planField(
        ROOT_PATH,
        ROOT_PATH,
        rootType,
        field,
        subscriptionPlanResolver,
        this.trackedRootValueStep,
        fieldSpec,
      );
      if (haltTree) {
        throw new Error("Failed to setup subscription");
      }
      this.subscriptionStepId = subscribePlan.id;
      const oldPlansLength = this.planCount;

      // TODO: this is a LIE! This should be `ROOT_PATH + "[]"` but that breaks
      // everything... We've worked around it elsewhere, but maybe all path
      // identities inside a subscription operation should assume ROOT_PATH of
      // `~[]` rather than `~`?
      const nestedParentPathIdentity = ROOT_PATH;
      const streamItemPlan = withGlobalState(
        { opPlan: this, parentPathIdentity: ROOT_PATH },
        () => subscribePlan.itemPlan(this.itemPlanFor(subscribePlan)),
      );
      this.subscriptionItemStepId = streamItemPlan.id;
      this.finalizeArgumentsSince(oldPlansLength, ROOT_PATH);
      const { fieldDigests } = this.planSelectionSet(
        nestedParentPathIdentity,
        nestedParentPathIdentity,
        streamItemPlan,
        rootType,
        [
          {
            groupId: 0,
            selections: selectionSet.selections,
          },
        ],
        this.rootTreeNode,
      );
      assert.strictEqual(
        fieldDigests.length,
        1,
        "Expected exactly one subscription field",
      );
      this.setRootFieldDigest(this.subscriptionType!, fieldDigests);
    } else {
      const subscribePlan = this.trackedRootValueStep;
      this.subscriptionStepId = subscribePlan.id;
      this.finalizeArgumentsSince(0, ROOT_PATH);
      const { fieldDigests } = this.planSelectionSet(
        ROOT_PATH,
        ROOT_PATH,
        subscribePlan,
        rootType,
        [
          {
            groupId: 0,
            selections: selectionSet.selections,
          },
        ],
        this.rootTreeNode,
      );
      assert.strictEqual(
        fieldDigests.length,
        1,
        "Expected exactly one subscription field",
      );
      this.setRootFieldDigest(this.subscriptionType!, fieldDigests);
    }
    this.loc.pop();
  }

  /**
   * Sets up tracking for the given value (variableValues, context, rootValue).
   */
  private track(
    value: any,
    constraints: Constraint[],
  ): [__ValueStep<any>, __TrackedObjectStep] {
    const valueStep = withGlobalLayerPlan(
      this.rootLayerPlan,
      () => new __ValueStep(),
    );
    const trackedObjectStep = withGlobalLayerPlan(
      this.rootLayerPlan,
      () => new __TrackedObjectStep(value, valueStep, constraints),
    );
    return [valueStep, trackedObjectStep];
  }

  /**
   * Checks that no step has a property on it whose value is another step. It
   * should addDependency instead.
   */
  private validateSteps(offset = 0): void {
    const errors: Error[] = [];
    for (let stepId = offset; stepId < this.stepCount; stepId++) {
      const step = this.steps[stepId];
      if (step.id === stepId) {
        const referencingPlanIsAllowed =
          // Required so that we can access the underlying value plan.
          step instanceof __TrackedObjectStep;
        if (!referencingPlanIsAllowed) {
          for (const key in step) {
            const val = step[key];
            if (val instanceof ExecutableStep) {
              errors.push(
                new Error(
                  `ERROR: ExecutableStep ${step} has illegal reference via property '${key}' to plan ${val}. You must not reference steps directly, instead use the plan id to reference the plan, and look the plan up in \`this.opPlan.steps[planId]\`. Failure to comply could result in subtle breakage during optimisation.`,
                ),
              );
            }
          }
        }
      }
    }
    if (errors.length > 0) {
      console.error(errors.map((e) => e.message).join("\n"));
      throw errors[0];
    }
  }

  private replaceStep(
    originalStep: ExecutableStep,
    replacementStep: ExecutableStep,
  ): void {
    // Replace all references to `step` with `replacementStep`
    for (const id in this.steps) {
      if (this.steps[id]?.id === originalStep.id) {
        this.steps[id] = replacementStep;
      }
    }

    // TODO: we should be able to optimize this - we know the new and old
    // plan so we should be able to look at just the original plan's
    // dependencies and see if they're needed any more or not.
    this.treeShakeSteps();
  }

  // TODO: optimize
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
    callback: (plan: ExecutableStep<any>) => ExecutableStep<any>,
  ): void {
    if (fromStepId === this.stepCount) {
      // Nothing to do since there are no plans to process
      return;
    }

    // Calculate the deep dependencies of every step in `steps`
    const deepDependenciesByStepId: {
      [dependentStepId: string]: Set<ExecutableStep>;
    } = Object.create(null);
    const calculateDependencies = (
      step: ExecutableStep,
    ): Set<ExecutableStep> => {
      let deepDeps: Set<ExecutableStep> = deepDependenciesByStepId[step.id];
      if (deepDeps) {
        return deepDeps;
      }
      deepDependenciesByStepId[step.id] = deepDeps = new Set();
      for (const depId of step.dependencies) {
        const depStep = this.steps[depId];
        const depDeepDeps = calculateDependencies(depStep);
        for (const deepDepStep of depDeepDeps) {
          deepDeps.add(deepDepStep);
        }
      }
      return deepDeps;
    };

    // Sort steps into the order to be processed.
    // If `a` depends on `z` then `a` should come before `z` in dependents-first mode
    const A_DEPENDS_ON_Z = order === "dependents-first" ? BEFORE : AFTER;
    // If `z` depends on `a` then `a` should come after `z` in dependents-first mode
    const Z_DEPENDS_ON_A = order === "dependents-first" ? AFTER : BEFORE;
    // We want to `.pop()` steps from our list because that's more performant
    // than `.shift()`, so we actually sort into reverse order
    const sorter = (a: ExecutableStep, z: ExecutableStep) => {
      if (deepDependenciesByStepId[a.id].has(z)) {
        return -A_DEPENDS_ON_Z;
      } else if (deepDependenciesByStepId[z.id].has(a)) {
        return -Z_DEPENDS_ON_A;
      } else {
        return z.id - a.id;
      }
    };

    let previousStepCount = this.stepCount;
    const steps: ExecutableStep[] = [];

    // DELIBERATELY shadows `fromStepId`
    const processStepsFrom = (fromStepId: number) => {
      for (let stepId = fromStepId; stepId < previousStepCount; stepId++) {
        const step = this.steps[stepId];
        steps.push(step);
        calculateDependencies(step);
      }
      steps.sort(sorter);
    };
    processStepsFrom(fromStepId);

    const processStep = (step: ExecutableStep) => {
      let replacementStep: ExecutableStep = step;
      try {
        replacementStep = withGlobalLayerPlan(step.layerPlan, () =>
          callback(step),
        );
      } catch (e) {
        console.error(
          `Error occurred whilst processing ${step} in ${order} mode`,
        );
        throw e;
      }

      if (replacementStep != step) {
        this.replaceStep(step, replacementStep);

        for (const planId in deepDependenciesByStepId) {
          const set = deepDependenciesByStepId[planId];
          if (set.delete(step)) {
            set.add(replacementStep);
          }
        }
      }

      if (this.stepCount > previousStepCount) {
        // We've generated new steps; they must be processed too!
        const firstNewStepId = previousStepCount;
        previousStepCount = this.stepCount;
        processStepsFrom(firstNewStepId);
      }

      return replacementStep;
    };

    const oldPlanCount = this.stepCount;
    let step;
    while ((step = steps.pop())) {
      const resultStep = processStep(step);
      const plansAdded = this.stepCount - oldPlanCount;

      // NOTE: whilst processing steps new steps may be added, thus we must loop
      // ascending and we must re-evaluate this.stepCount on each loop
      // iteration.
      if (isDev && plansAdded > 100000) {
        throw new Error(
          `Whilst processing steps as part of ${actionDescription}Plans, ${plansAdded} new steps have been created... That seems like it's likely a bug in the relevant method of one of your steps. The last plan processed was ${resultStep}`,
        );
      }
    }

    if (this.phase !== "plan" && this.stepCount > oldPlanCount) {
      // Any time new steps are added we should validate them. All plans are
      // validated once "plan" is finished, so no need to do it here for that
      // phase.
      this.validateSteps(oldPlanCount);
    }
  }

  private treeShakeSteps() {
    console.log("TODO: treeShakeSteps");
  }

  private isPeer(planA: ExecutableStep, planB: ExecutableStep): boolean {
    // Can only merge if plan is of same type.
    if (planA.constructor !== planB.constructor) {
      return false;
    }

    // Can only merge if the dependencies are the same.
    if (
      !arraysMatch(
        planA.dependencies,
        planB.dependencies,
        (depA, depB) => this.steps[depA] === this.steps[depB],
      )
    ) {
      return false;
    }

    return true;
  }

  private deduplicateStep(step: ExecutableStep) {
    step.isArgumentsFinalized = true;

    if (step.hasSideEffects) {
      // Never deduplicate plans with side effects.
      return step;
    }

    if (step instanceof __ItemStep) {
      // __ItemStep cannot be deduplicated
      return step;
    }

    const planOptions = this.getPlanOptionsForStep(step);
    const shouldStream = !!planOptions?.stream;
    // TODO: revisit this decision in the context of SAGE.
    if (shouldStream) {
      // Never deduplicate streaming plans, we cannot reference the stream more
      // than once (and we aim to not cache the stream because we want its
      // entries to be garbage collected).
      return step;
    }

    /**
     * "compatible" layer plans are calculated by walking up the layer plan tree,
     * however:
     *
     * - do not pass the LayerPlan of one of the dependencies
     * - do not pass a "deferred" layer plan
     *
     * If the current LayerPlan is a polymorphic layer plan then we can also
     * include its siblings.
     */
    const compatibleLayerPlans: LayerPlan[] = [];
    let currentLayerPlan: LayerPlan | null = step.layerPlan;
    const doNotPass = step.dependencies.map(
      (depId) => this.steps[depId].layerPlan,
    );

    do {
      compatibleLayerPlans.push(currentLayerPlan);

      if (currentLayerPlan.reason.type === "polymorphic") {
        for (const potentialSibling of this.layerPlans) {
          if (
            potentialSibling.parentLayerPlan === currentLayerPlan &&
            potentialSibling.reason.type === "polymorphic" &&
            this.steps[potentialSibling.rootStepId!] ===
              this.steps[currentLayerPlan.rootStepId!]
          ) {
            compatibleLayerPlans.push(potentialSibling);
          }
        }
      }

      if (doNotPass.includes(currentLayerPlan)) {
        break;
      }
      if (isDeferredLayerPlan(currentLayerPlan)) {
        break;
      }
    } while ((currentLayerPlan = currentLayerPlan.parentLayerPlan));

    const peers: ExecutableStep[] = [];
    for (let id = 0; id < this.stepCount; id++) {
      const potentialPeer = this.steps[id];
      if (!potentialPeer || potentialPeer.id !== id) {
        continue;
      }
      if (potentialPeer.hasSideEffects) {
        continue;
      }
      if (!compatibleLayerPlans.includes(potentialPeer.layerPlan)) {
        continue;
      }
      if (!this.isPeer(step, potentialPeer)) {
        continue;
      }
      peers.push(potentialPeer);
    }

    // TODO: should we keep this optimisation, or should we remove it so that
    // plans that are "smarter" than us can return replacement plans even if
    // they're not peers?
    if (peers.length === 0) {
      return step;
    }

    const equivalentSteps = step.deduplicate(peers);
    if (equivalentSteps.length > 0) {
      if (
        !equivalentSteps.every((replacementStep) =>
          peers.includes(replacementStep),
        )
      ) {
        throw new Error(
          `deduplicatePlan error: Expected to replace step ${step} with one of its (identical) peers; instead found ${equivalentSteps}. This is currently forbidden because it could cause confusion during the optimization process, instead apply this change in 'optimize', or make sure that any child selections aren't applied until the optimize/finalize phase so that no mapping is required during deduplicate.`,
        );
      }

      const allEquivalentSteps = [step, ...equivalentSteps];

      // Prefer the step that's closest to the root LayerPlan; failing that, prefer the step with the lowest id.
      let minDepth = Infinity;
      let stepsAtMinDepth: ExecutableStep[] = [];
      for (let i = 0, l = allEquivalentSteps.length; i < l; i++) {
        const step = allEquivalentSteps[i];
        let depth = 0;
        let layer: LayerPlan | null = step.layerPlan;
        while ((layer = layer.parentLayerPlan)) {
          depth++;
        }
        if (depth < minDepth) {
          minDepth = depth;
          stepsAtMinDepth = [step];
        } else if (depth === minDepth) {
          stepsAtMinDepth.push(step);
        }
      }
      const layersAtMinDepth = [
        ...new Set(stepsAtMinDepth.map((s) => s.layerPlan)),
      ];
      if (layersAtMinDepth.length === 1) {
        // Hooray, one winning layer!
        stepsAtMinDepth.sort((a, z) => a.id - z.id);
        const winner = stepsAtMinDepth[0];
        // Everything else is equivalent to winner!
        for (const equivalentStep of allEquivalentSteps) {
          if (equivalentStep !== winner) {
            this.replaceStep(equivalentStep, winner);
          }
        }
        return winner;
      } else {
        if (isDev) {
          layersAtMinDepth.forEach((lp) => {
            assert.strictEqual(
              lp.reason.type,
              "polymorphic",
              `If there's more than one layer plan at the min depth then they must all be polymorphic otherwise how could the layers be compatible?`,
            );
          });
        }
        const polymorphic;
        // TODO:
        throw new Error("TODO!");
        // Now to handle bucket changes
        if (step.layerPlan !== replacementStep.layerPlan) {
          if (
            step.layerPlan.reason.type !== "polymorphic" ||
            replacementStep.layerPlan.reason.type !== "polymorphic"
          ) {
            throw new Error(
              `Unexpected LayerPlan mismatch when deduplicating ${step} to ${replacementStep}`,
            );
          }
          // Create a new layerplan above both these layerplans and push replacementStep into it
        }
      }
    } else {
      return step;
    }
  }

  /*
   * TODO: calculation if peers for deduplicate is too expensive, and shouldn't
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
    this.maxDeduplicatedStepId = this.stepCount - 1;
  }

  private getPlanOptionsForStep(step: ExecutableStep): PlanOptions {
    // NOTE: streams can only be merged if their parameters are compatible
    // (namely they need to have equivalent `initialCount`)
    const streamLayerPlan = step.childLayerPlans.find(
      (lp) => lp.reason.type === "stream",
    );

    return {
      stream:
        streamLayerPlan &&
        isStreamableStep(step) &&
        streamLayerPlan.parentStep === step
          ? { initialCount: streamLayerPlan.reason.initialCount }
          : null,
    };
  }

  /**
   * Calls the 'optimize' method on a plan, which may cause the plan to
   * communicate with its (deep) dependencies, and even to replace itself with
   * a different plan.
   */
  private optimizeStep(step: ExecutableStep): ExecutableStep {
    if (step.isOptimized && !step.allowMultipleOptimizations) {
      return step;
    }

    // We know if it's streaming or not based on the LayerPlan it's contained within.
    const planOptions = this.getPlanOptionsForStep(step);
    const replacementStep = step.optimize(planOptions);
    step.isOptimized = true;
    return replacementStep;
  }

  /**
   * Note that we work through dependents first so we can make sure that we
   * know all our dependent's needs before we optimise ourself.
   */
  private optimizeSteps(): void {
    const thirdAndFutureLoopReplacedPlans: ExecutableStep[] = [];
    for (let loops = 0; loops < MAX_OPTIMIZATION_LOOPS; loops++) {
      let replacedPlan = false;
      this.processSteps(
        "optimize",
        0,
        "dependents-first",
        loops === 0
          ? (step) => this.optimizeStep(step)
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
    const initialStepCount = this.stepCount;
    assert.equal(
      this.modifierSteps.length,
      0,
      "No modifier steps expected when performing finalizeSteps",
    );
    for (const [stepId, step] of Object.entries(this.steps)) {
      if (step && step.id === stepId) {
        step.finalize();
        assertFinalized(step);
        if (isDev) {
          assert.equal(
            this.stepCount,
            initialStepCount,
            `When calling ${step}.finalize() a new plan was created; this is forbidden!`,
          );
        }
      }
    }
  }
}
