import LRU from "@graphile/lru";
import * as assert from "assert";
import type {
  ASTNode,
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
  isLeafType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isUnionType,
} from "graphql";
import { inspect } from "util";

import type { Constraint } from "../constraints.js";
import {
  getDirectiveArg,
  graphqlCollectFields,
} from "../graphqlCollectFields.js";
import {
  fieldSelectionsForType,
  interfaceTypeHasNonIntrospectionFieldQueriedInSelections,
  typesUsedInSelections,
} from "../graphqlMergeSelectionSets.js";
import type { ModifierStep } from "../index.js";
import {
  __ItemStep,
  __TrackedObjectStep,
  __ValueStep,
  ExecutableStep,
} from "../index.js";
import { inputPlan } from "../input.js";
import type {
  FieldPlanResolver,
  StepOptions,
  TrackedArguments,
} from "../interfaces.js";
import type { PrintPlanGraphOptions } from "../mermaid.js";
import { printPlanGraph } from "../mermaid.js";
import { withFieldArgsForArguments } from "../opPlan-input.js";
import { $$crystalWrapped, isCrystalWrapped } from "../resolvers.js";
import type { ListCapableStep, PolymorphicStep } from "../step.js";
import { isPolymorphicStep } from "../step.js";
import {
  assertExecutableStep,
  assertFinalized,
  isListCapableStep,
  isStreamableStep,
} from "../step.js";
import { access } from "../steps/access.js";
import { constant, ConstantStep } from "../steps/constant.js";
import {
  arraysMatch,
  defaultValueToValueNode,
  findVariableNamesUsed,
  isTypePlanned,
} from "../utils.js";
import type { LayerPlanReasonPolymorphic } from "./LayerPlan.js";
import { isDeferredLayerPlan, LayerPlan } from "./LayerPlan.js";
import type { SchemaDigest } from "./lib/digestSchema.js";
import { digestSchema } from "./lib/digestSchema.js";
import { withGlobalLayerPlan } from "./lib/withGlobalLayerPlan.js";
import { OutputPlan } from "./OutputPlan.js";

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

export interface MetaByStepId {
  [planId: number]: Record<string, any>;
}

export class OperationPlan {
  private queryType: GraphQLObjectType;
  private mutationType: GraphQLObjectType | null;
  private subscriptionType: GraphQLObjectType | null;
  public readonly unionsContainingObjectType: {
    [objectTypeName: string]: ReadonlyArray<GraphQLUnionType>;
  };

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

  /** @internal */
  public layerPlans: LayerPlan[] = [];
  /** @internal */
  public rootLayerPlan: LayerPlan;
  // Assigned during OperationPlan.planOperation(), guaranteed to exist after
  // initialization.
  public rootOutputPlan!: OutputPlan;

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
  public readonly variableValuesStep: __ValueStep<{ [key: string]: any }>;
  /** A step for accessing variableValues in a tracked manner (allowing eval). @internal */
  public readonly trackedVariableValuesStep: __TrackedObjectStep<{
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

  /** @internal */
  public makeMetaByStepId: () => MetaByStepId;

  /**
   * The plan id for the plan that represents the subscription (if any).
   *
   * @internal
   */
  public subscriptionStepId: number | undefined;

  /**
   * The plan id for the plan that represents a single payload in the subscription stream (if any)
   *
   * @internal
   */
  public subscriptionItemStepId: number | undefined;

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

    this.schemaDigest = digestSchema(schema);
    this.operationType = operation.operation;

    this.phase = "plan";
    this.rootLayerPlan = new LayerPlan(this, null, { type: "root" });

    // TODO: delete this.
    // This doesn't do anything, it only exists to align plans more closely
    // with an older version of the planner (to reduce the diff).
    const _rootSelectionSetStep = withGlobalLayerPlan(
      this.rootLayerPlan,
      () => new __ValueStep(),
    );

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

    // Plan the operation
    this.planOperation();

    // Now perform hoisting (and repeat deduplication)
    this.hoistSteps();

    // Get rid of temporary steps before `optimize` triggers side-effects
    this.treeShakeSteps();

    if (isDev) {
      this.phase = "validate";
      // Helpfully check steps don't do forbidden things.
      this.validateSteps();
    }

    this.phase = "optimize";

    // Replace/inline/optimise steps
    this.optimizeSteps();

    // Get rid of steps that are no longer needed after optimising
    this.treeShakeSteps();

    this.phase = "finalize";

    // Plans are expected to execute later; they may take steps here to prepare
    // themselves (e.g. compiling SQL queries ahead of time).
    this.finalizeSteps();

    this.finalizeLayerPlans();

    this.finalizeOutputPlans();

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
    if (!["plan", "validate", "optimize"].includes(this.phase)) {
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
    id: number,
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

  /**
   * Get a plan without specifying who requested it; this disables all the
   * caller checks. Only intended to be called from internal code.
   *
   * @internal
   */
  public dangerouslyGetStep(id: number): ExecutableStep {
    return this.steps[id];
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
    const outputPlan = new OutputPlan(
      this.rootLayerPlan,
      this.rootValueStep,
      {
        mode: "root",
        typeName: this.queryType.name,
      },
      this.operation.selectionSet.selections,
    );
    this.rootOutputPlan = outputPlan;
    this.planSelectionSet(
      outputPlan,
      [],
      this.trackedRootValueStep,
      rootType,
      this.operation.selectionSet.selections,
    );
    this.loc.pop();
  }

  /**
   * Implements the `PlanOpPlanMutation` algorithm.
   */
  private planMutation(): void {
    this.loc.push("planMutation()");
    const rootType = this.mutationType;
    if (!rootType) {
      throw new Error("No mutation type found in schema");
    }
    this.deduplicateSteps();
    const outputPlan = new OutputPlan(
      this.rootLayerPlan,
      this.rootValueStep,
      {
        mode: "root",
        typeName: rootType.name,
      },
      this.operation.selectionSet.selections,
    );
    this.rootOutputPlan = outputPlan;
    this.planSelectionSet(
      outputPlan,
      [],
      this.trackedRootValueStep,
      rootType,
      this.operation.selectionSet.selections,
      true,
    );
    this.loc.pop();
  }

  /**
   * Implements the `PlanOpPlanSubscription` algorithm.
   */
  private planSubscription(): void {
    this.loc.push("planSubscription");
    const rootType = this.subscriptionType;
    if (!rootType) {
      throw new Error("No subscription type found in schema");
    }
    const selectionSet = this.operation.selectionSet;
    const groupedFieldSet = withGlobalLayerPlan(this.rootLayerPlan, () =>
      graphqlCollectFields(
        this,
        this.trackedRootValueStep.id,
        rootType,
        selectionSet.selections,
      ),
    );
    if (groupedFieldSet.deferred.length > 0) {
      throw new Error("@defer forbidden on subscription root selection set");
    }
    let firstKey: string | undefined = undefined;
    for (const key of groupedFieldSet.fields.keys()) {
      if (firstKey !== undefined) {
        throw new Error("subscriptions may only have one top-level field");
      }
      firstKey = key;
    }
    assert.ok(firstKey != null, "selection set cannot be empty");
    const fields = groupedFieldSet.fields.get(firstKey);
    if (!fields) {
      throw new Error("Consistency error.");
    }
    // All grouped fields are equivalent, as mandated by GraphQL validation rules. Thus we can take the first one.
    const field = fields[0];
    const fieldName = field.name.value; // Unaffected by alias.
    const rootTypeFields = rootType.getFields();
    const fieldSpec: GraphQLField<unknown, unknown> = rootTypeFields[fieldName];
    const subscriptionPlanResolver =
      fieldSpec.extensions?.graphile?.subscribePlan;
    if (subscriptionPlanResolver) {
      const { haltTree, step: subscribeStep } = this.planField(
        this.rootLayerPlan,
        [field.alias?.value ?? fieldName],
        rootType,
        fields,
        subscriptionPlanResolver,
        this.trackedRootValueStep,
        fieldSpec,
      );
      if (haltTree) {
        throw new Error("Failed to setup subscription");
      }
      this.subscriptionStepId = subscribeStep.id;

      const subscriptionEventLayerPlan = new LayerPlan(
        this,
        this.rootLayerPlan,
        {
          type: "subscription",
        },
      );

      const streamItemPlan = withGlobalLayerPlan(
        subscriptionEventLayerPlan,
        () => subscribeStep.itemPlan(new __ItemStep(subscribeStep)),
      );
      this.subscriptionItemStepId = streamItemPlan.id;
      this.deduplicateSteps();
      const outputPlan = new OutputPlan(
        subscriptionEventLayerPlan,
        this.rootValueStep,
        { mode: "root", typeName: rootType.name },
        this.operation.selectionSet.selections,
      );
      this.rootOutputPlan = outputPlan;
      this.planSelectionSet(
        outputPlan,
        [],
        streamItemPlan,
        rootType,
        selectionSet.selections,
      );
    } else {
      // TODO: take the regular GraphQL subscription resolver and convert it to a plan. (Lambda plan?)
      const subscribeStep = this.trackedRootValueStep;
      this.subscriptionStepId = subscribeStep.id;
      this.deduplicateSteps();
      const subscriptionEventLayerPlan = new LayerPlan(
        this,
        this.rootLayerPlan,
        {
          type: "subscription",
        },
      );
      const outputPlan = new OutputPlan(
        subscriptionEventLayerPlan,
        this.rootValueStep,
        { mode: "root", typeName: rootType.name },
        this.operation.selectionSet.selections,
      );
      this.rootOutputPlan = outputPlan;
      this.planSelectionSet(
        outputPlan,
        [],
        subscribeStep,
        rootType,
        selectionSet.selections,
      );
    }
    this.loc.pop();
  }

  /**
   * Gets the item plan for a given parent list plan - this ensures we only
   * create one item plan per parent plan.
   */
  private itemStepForListStep<TData>(
    listStep: ExecutableStep<TData> | ExecutableStep<TData[]>,
    depth = 0,
  ): __ItemStep<TData> {
    const itemStepId = this.itemStepIdByListStepId[listStep.id];
    if (itemStepId !== undefined) {
      return this.steps[itemStepId] as __ItemStep<TData>;
    }
    // Create a new LayerPlan for this list item
    const layerPlan = new LayerPlan(this, listStep.layerPlan, {
      type: "listItem",
      parentPlanId: listStep.id,
      streamLabel: null,
    });
    const itemPlan = withGlobalLayerPlan(
      layerPlan,
      () => new __ItemStep(listStep, depth),
    );
    layerPlan.rootStepId = itemPlan.id;
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
    parentStep: ExecutableStep,
    objectType: GraphQLObjectType,
    selections: readonly SelectionNode[],
    isMutation = false,
    customRecurse: null | ((nextUp: () => void) => void) = null,
  ) {
    this.loc.push(
      `planSelectionSet(${objectType.name} @ ${
        outputPlan.layerPlan.id
      } @ ${path.join(".")})`,
    );
    interface NextUp {
      haltTree: boolean;
      stepId: number;
      responseKey: string;
      fieldType: GraphQLOutputType;
      fieldNodes: FieldNode[];
      fieldLayerPlan: LayerPlan;
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
      } = nextUp;
      // May have changed due to deduplicate
      const step = this.steps[stepId];
      // TODO: is `outputPlan` unchanged here after polymorphicDeduplicateSteps?
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
            fieldNodes,
          ),
          isNonNull,
          node: fieldNodes,
        });
      } else {
        this.planIntoOutputPlan(
          outputPlan,
          fieldLayerPlan,
          [...path, responseKey],
          fieldNodes[0].selectionSet
            ? fieldNodes.flatMap((n) => n.selectionSet!.selections)
            : undefined,
          objectType,
          responseKey,
          fieldType,
          step,
          fieldNodes,
        );
      }

      // TODO: this.itemPlanIdByFieldPathIdentity[pathIdentity] = itemPlan.id;
    };

    assertObjectType(objectType);
    const groupedFieldSet = withGlobalLayerPlan(outputPlan.layerPlan, () =>
      graphqlCollectFields(
        this,
        parentStep.id,
        objectType,
        selections,
        isMutation,
      ),
    );
    const objectTypeFields = objectType.getFields();
    // TODO: don't forget about deferreds!
    for (const [responseKey, fieldNodes] of groupedFieldSet.fields.entries()) {
      // All grouped fields are equivalent, as mandated by GraphQL validation rules. Thus we can take the first one.
      const field = fieldNodes[0];
      const fieldName = field.name.value;

      // This is presumed to exist because the operation passed validation.
      const objectField = objectTypeFields[fieldName];

      if (fieldName.startsWith("__")) {
        if (fieldName === "__typename") {
          outputPlan.addChild(objectType, responseKey, {
            type: "__typename",
            node: fieldNodes,
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
                // TODO: if variableNames.length === 0 we should be able to optimize this!
                introspectionCacheByVariableValues: new LRU({
                  maxLength: 3,
                }),
              },
              fieldNodes,
            ),
            node: fieldNodes,
          });
        }
        continue;
      }
      const fieldType = objectTypeFields[fieldName].type;
      const rawPlanResolver = objectField.extensions?.graphile?.plan;
      const namedReturnType = getNamedType(fieldType);
      const namedResultTypeIsLeaf = isLeafType(namedReturnType);

      /**
       * This could be the crystal resolver or a user-supplied resolver or
       * nothing.
       */
      const rawResolver = objectField.resolve;

      /**
       * This will never be the crystal resolver - only ever the user-supplied
       * resolver or nothing
       */
      const graphqlResolver =
        rawResolver && isCrystalWrapped(rawResolver)
          ? rawResolver[$$crystalWrapped].original
          : rawResolver;

      const usesDefaultResolver =
        !graphqlResolver || graphqlResolver === defaultFieldResolver;

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
       *      - Crystal provides pure resolver.
       *    - Else if fieldHasPlan (which may be implied by typeIsPlanned
       *      above)
       *      - If `resolve()` is not set:
       *        - crystal will return the value from the plan directly
       *      - Otherwise:
       *        - Crystal will wrap this resolver and will call `resolve()` (or
       *          default resolver) with the plan result.  IMPORTANT: you may
       *          want to use an `ObjectStep` so that the parent object is of
       *          the expected shape; e.g. your plan might return
       *          `object({username: $username})` for a `User.username` field.
       *    - Else
       *      - Leave `resolve()` untouched - do not even wrap it.
       *      - (Failing that, use a __ValueStep and return the result
       *        directly.)
       */

      const typePlan = objectType.extensions?.graphile?.Step;

      if (graphqlResolver) {
        this.pure = false;
      }

      /*
        namedReturnType instanceof GraphQLInterfaceType ||
        namedReturnType instanceof GraphQLUnionType
        */
      const resultIsPlanned = isTypePlanned(this.schema, namedReturnType);
      const fieldHasPlan = !!planResolver;

      // Return raw data if either the user has their own resolver _or_ it's a leaf field.
      const returnRaw = graphqlResolver != null || namedResultTypeIsLeaf;

      if (typePlan && !fieldHasPlan) {
        throw new Error(
          `Every field within a planned type must have a plan; object type ${
            objectType.name
          } expects a ${typePlan.name || "ExecutableStep"} however field ${
            objectType.name
          }.${fieldName} has no plan. Please add an 'extensions.graphile.plan' callback to this field.`,
        );
      }

      if (!typePlan && resultIsPlanned && !fieldHasPlan) {
        throw new Error(
          `Field ${objectType.name}.${fieldName} returns a ${namedReturnType.name} which expects a plan to be available; however this field has no plan() method to produce such a plan; please add 'extensions.graphile.plan' to this field.`,
        );
      }

      if (resultIsPlanned && graphqlResolver) {
        throw new Error(
          `Field ${objectType.name}.${fieldName} returns a ${namedReturnType.name} which expects a plan to be available; this means that ${objectType.name}.${fieldName} is forbidden from defining a GraphQL resolver.`,
        );
      }

      // this.returnRawValueByPathIdentity[pathIdentity] = returnRaw;

      let step: ExecutableStep | PolymorphicStep;
      // this.sideEffectPlanIdsByPathIdentity[pathIdentity] = [];
      let haltTree = false;
      const fieldLayerPlan = isMutation
        ? new LayerPlan(this, outputPlan.layerPlan, {
            type: "mutationField",
          })
        : outputPlan.layerPlan;
      if (typeof planResolver === "function") {
        ({ step, haltTree } = this.planField(
          fieldLayerPlan,
          path,
          objectType,
          fieldNodes,
          planResolver,
          parentStep,
          objectField,
          // If we have a customRecurse then don't deduplicate because we'll be
          // calling polymorphicDeduplicateSteps later.
          !customRecurse,
        ));
      } else {
        // TODO: should this use the default plan resolver?
        // There's no step resolver; use the parent step
        step = parentStep;
        // TODO: this.isUnplannedByPathIdentity[pathIdentity] = true;
      }

      // this.planIdByPathIdentity[pathIdentity] = step.id;
      next({
        haltTree,
        stepId: step.id,
        responseKey,
        fieldType,
        fieldNodes,
        fieldLayerPlan,
      });
    }

    if (customRecurse) {
      customRecurse(() => {
        for (const nextUp of nextUpList) {
          processNextUp(nextUp);
        }
      });
    }

    this.loc.pop();
  }

  // Similar to the old 'planFieldReturnType'
  private planIntoOutputPlan(
    parentOutputPlan: OutputPlan,
    // Typically this is parentOutputPlan.layerPlan; but in the case of mutationFields it isn't.
    parentLayerPlan: LayerPlan,
    path: readonly string[],
    selections: readonly SelectionNode[] | undefined,
    parentObjectType: GraphQLObjectType | null,
    responseKey: string | null,
    fieldType: GraphQLOutputType,
    $step: ExecutableStep,
    node: ASTNode | readonly ASTNode[],
    listDepth = 0,
  ) {
    const nullableFieldType = getNullableType(fieldType);
    const isNonNull = nullableFieldType !== fieldType;
    if (isListType(nullableFieldType)) {
      const listOutputPlan = new OutputPlan(
        parentLayerPlan,
        $step,
        {
          mode: "array",
          streamedOutputPlan: null,
          streamLabel: null,
        },
        node,
      );
      parentOutputPlan.addChild(parentObjectType, responseKey, {
        type: "outputPlan",
        outputPlan: listOutputPlan,
        isNonNull,
        node,
      });

      const $__item = this.itemStepForListStep($step, listDepth);
      const $item = isListCapableStep($step)
        ? withGlobalLayerPlan($__item.layerPlan, () =>
            ($step as ListCapableStep<any>).listItem($__item),
          )
        : $__item;
      this.planIntoOutputPlan(
        listOutputPlan,
        $item.layerPlan,
        [],
        selections,
        null,
        null,
        nullableFieldType.ofType,
        $item,
        node,
        listDepth + 1,
      );
    } else if (isScalarType(nullableFieldType)) {
      const scalarPlanResolver = nullableFieldType.extensions?.graphile?.plan;
      const $leaf =
        typeof scalarPlanResolver === "function"
          ? withGlobalLayerPlan(parentLayerPlan, () =>
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
          },
          node,
        ),
        node,
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
          },
          node,
        ),
        node,
      });
    } else if (isObjectType(nullableFieldType)) {
      // TODO: graphqlMergeSelectionSets ?
      if (isDev) {
        // Check that the plan we're dealing with is the one the user declared
        const ExpectedStep = nullableFieldType.extensions?.graphile?.Step;
        if (ExpectedStep && !($step instanceof ExpectedStep)) {
          throw new Error(
            `Step mis-match: expected ${ExpectedStep.name}, but instead found ${
              ($step as ExecutableStep).constructor.name
            } (${$step})`,
          );
        }
        if (!selections) {
          throw new Error(
            `GraphileInternalError<7fe4f7d1-01d2-4f1e-add6-5aa6936938c9>: no selections on a GraphQLObjectType?!`,
          );
        }
      }
      const objectOutputPlan = new OutputPlan(
        parentLayerPlan,
        $step,
        {
          mode: "object",
          deferLabel: null,
          typeName: nullableFieldType.name,
        },
        node,
      );
      parentOutputPlan.addChild(parentObjectType, responseKey, {
        type: "outputPlan",
        outputPlan: objectOutputPlan,
        isNonNull,
        node,
      });
      this.planSelectionSet(
        objectOutputPlan,
        path,
        $step,
        nullableFieldType,
        selections!,
      );
    } else {
      // Polymorphic
      const isUnion = isUnionType(nullableFieldType);
      const isInterface = isInterfaceType(nullableFieldType);
      assert.ok(
        isUnion || isInterface,
        `GraphileInternalError<a54d6d63-d186-4ab9-9299-05f817894300>: Wasn't expecting ${nullableFieldType}`,
      );
      assert.ok(
        selections,
        "GraphileInternalError<d94e281c-1a10-463e-b7f5-2b0a3665d99b>: A polymorphic type with no selections is invalid",
      );

      /*
       * Planning for polymorphic types is somewhat more complicated than for
       * other types.
       *
       * First we ensure we're dealing with a polymorphic step.
       */
      assert.ok(
        isPolymorphicStep($step),
        `${$step} is not a polymorphic capable step, it must have a planForType method`,
      );

      /*
       * Next, we figure out the list of `possibleTypes` based on the
       * union/interface and any other constraints that we know. NOTE: we can't
       * discount a type just because it doesn't have any fragments that apply
       * to it - instead we must still plan an empty selection set, and we need
       * to know it exists for that. See
       * https://github.com/graphql/graphql-spec/issues/951#issuecomment-1140957685
       */
      const possibleObjectTypes = isUnion
        ? typesUsedInSelections(this, nullableFieldType.getTypes(), selections)
        : (() => {
            const interfaceType = nullableFieldType;
            const implementations =
              this.schema.getImplementations(interfaceType).objects;
            if (
              interfaceTypeHasNonIntrospectionFieldQueriedInSelections(
                this,
                interfaceType,
                selections,
              )
            ) {
              return implementations;
            } else {
              return typesUsedInSelections(this, implementations, selections);
            }
          })();

      const polymorphicOutputPlan = new OutputPlan(
        parentLayerPlan,
        $step,
        {
          mode: "polymorphic",
          deferLabel: null,
          typeNames: possibleObjectTypes.map((t) => t.name),
        },
        node,
      );
      parentOutputPlan.addChild(parentObjectType, responseKey, {
        type: "outputPlan",
        outputPlan: polymorphicOutputPlan,
        isNonNull,
        node,
      });

      /*
       * Then we create a new polymorphic LayerPlan for each of these types,
       * and set the rootPlan of it to be the result of calling the
       * `planForType` method the type.
       */
      const polymorphicLayerPlanByObjectType = new Map<
        GraphQLObjectType,
        LayerPlan<LayerPlanReasonPolymorphic>
      >();
      for (const type of possibleObjectTypes) {
        const lp = new LayerPlan(this, $step.layerPlan, {
          type: "polymorphic",
          typeNames: [type.name],
          parentPlanId: $step.id,
        });
        const stepForType = withGlobalLayerPlan(lp, () =>
          $step.planForType(type),
        );
        lp.rootStepId = stepForType.id;
        polymorphicLayerPlanByObjectType.set(type, lp);
      }
      // TODO: would it be faster to do some deduping here?
      //
      const queue: Array<() => void> = [];
      const polymorphicLayerPlans: LayerPlan<LayerPlanReasonPolymorphic>[] = [];

      /*
       * Then plan the fields (BUT NOT THEIR SELECTION SETS) into this
       * LayerPlan. DO NOT USE REGULAR DEDUPLICATION!
       */
      for (const type of possibleObjectTypes) {
        const polymorphicLayerPlan =
          polymorphicLayerPlanByObjectType.get(type)!;
        polymorphicLayerPlans.push(polymorphicLayerPlan);
        const $root = this.steps[polymorphicLayerPlan.rootStepId!]!;
        const objectOutputPlan = new OutputPlan(
          polymorphicLayerPlan,
          $root,
          {
            mode: "object",
            deferLabel: null,
            typeName: type.name,
          },
          node,
        );
        // find all selections compatible with `type`
        const fieldNodes = fieldSelectionsForType(this, type, selections);
        this.planSelectionSet(
          objectOutputPlan,
          path,
          $root,
          type,
          fieldNodes,
          false,
          // DO NOT PROCESS SELECTION SET YET! Add to queue:
          (cb) => queue.push(cb),
        );
        polymorphicOutputPlan.addChild(type, null, {
          type: "outputPlan",
          isNonNull,
          outputPlan: objectOutputPlan,
          node,
        });
      }

      /*
       * Then call `polymorphicDeduplicateSteps()`.
       */
      this.polymorphicDeduplicateSteps(polymorphicLayerPlans);

      /*
       * Finally, plan the selection sets for all the fields we previously
       * postponed.
       */
      for (const cb of queue) {
        cb();
      }
    }
  }

  private planField(
    layerPlan: LayerPlan,
    path: readonly string[],
    objectType: GraphQLObjectType,
    fieldNodes: FieldNode[],
    planResolver: FieldPlanResolver<any, any, any>,
    parentStep: ExecutableStep,
    field: GraphQLField<any, any>,
    deduplicate = true,
  ) {
    this.loc.push(`planField(${path.join(".")})`);
    const trackedArguments = withGlobalLayerPlan(layerPlan, () =>
      this.getTrackedArguments(objectType, fieldNodes[0]),
    );

    let step = withGlobalLayerPlan(layerPlan, () =>
      withFieldArgsForArguments(
        this,
        parentStep,
        trackedArguments,
        field,
        (fieldArgs) =>
          planResolver(parentStep, fieldArgs, {
            field,
            schema: this.schema,
          }),
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
        isStreamableStep(step as ExecutableStep<any>)
          ? {
              initialCount:
                Number(
                  getDirectiveArg(
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
      step = this.steps[step.id]!;
    }

    this.loc.pop();
    return { step, haltTree };
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
          throw new Error(
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
          argumentValue?.value,
          defaultValue,
        );
        trackedArgumentValues[argumentName] = argumentPlan;
      }
    }
    return {
      // TODO: should this be FieldArgs?
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
    const previousCount = this.modifierStepCount;
    this.modifierStepCount = 0;

    const result = cb();

    // Remove the modifier plans from opPlan and sort them ready for application.
    const plansToApply = this.modifierSteps
      .splice(0, this.modifierSteps.length)
      .reverse();

    // Restore previous modifiers
    this.modifierStepCount = previousCount;
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
      if (step && step.id === stepId) {
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

    if (this.phase != "plan") {
      // TODO: we should be able to optimize this - we know the new and old
      // plan so we should be able to look at just the original plan's
      // dependencies and see if they're needed any more or not.
      this.treeShakeSteps();
    }
  }

  private replaceSteps(
    originalSteps: ExecutableStep[],
    replaceStep: ExecutableStep,
  ): void {
    for (const originalStep of originalSteps) {
      if (originalStep !== replaceStep) {
        this.replaceStep(originalStep, replaceStep);
      }
    }
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

    let previousStepCount = this.stepCount;
    let steps: ExecutableStep[] = [];

    /** Sort steps into the order to be processed. */
    const sortSteps = () => {
      const ordered: ExecutableStep[] = [];
      /** Adds 'step' to ordered, ensuring that all step's dependencies are there first */
      const process = (step: ExecutableStep) => {
        if (ordered.includes(step)) {
          return;
        }
        const deps = step.dependencies.map((depId) => this.steps[depId]);
        for (const dep of deps) {
          if (steps.includes(dep)) {
            process(dep);
          }
        }
        ordered.push(step);
      };

      // We want to `.pop()` steps from our list because that's more performant
      // than `.shift()`, so we actually sort into reverse order
      if (order === "dependencies-first") {
        for (let i = 0, l = steps.length; i < l; i++) {
          process(steps[i]);
        }
        ordered.reverse();
      } else {
        for (let i = steps.length - 1; i >= 0; i--) {
          process(steps[i]);
        }
      }
      steps = ordered;
    };

    // DELIBERATELY shadows `fromStepId`
    const processStepsFrom = (fromStepId: number) => {
      for (let stepId = fromStepId; stepId < previousStepCount; stepId++) {
        const step = this.steps[stepId];
        if (step && step.id === stepId) {
          steps.push(step);
        }
      }
      sortSteps();
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
          e,
        );
        throw e;
      }

      if (replacementStep != step) {
        this.replaceStep(step, replacementStep);
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

  private markStepActive(
    step: ExecutableStep,
    activeSteps: Set<ExecutableStep>,
  ): void {
    if (activeSteps.has(step)) {
      return;
    }
    activeSteps.add(step);
    for (let i = 0, l = step.dependencies.length; i < l; i++) {
      const id = step.dependencies[i];
      this.markStepActive(this.steps[id], activeSteps);
    }
  }

  private treeShakeSteps() {
    const activeSteps = new Set<ExecutableStep>();

    // The root subscription step, if any, should be marked as active
    if (this.subscriptionItemStepId) {
      const step = this.steps[this.subscriptionItemStepId];
      this.markStepActive(step, activeSteps);
    }

    // TODO: ensure side-effect plans are handled nicely

    // TODO: ensure plans in 'subprocedure' layerPlans are marked active

    // Now walk through all the output plans and mark every used plan as
    // active.
    this.walkOutputPlans(this.rootOutputPlan, (outputPlan) => {
      if (outputPlan.rootStepId) {
        this.markStepActive(this.steps[outputPlan.rootStepId], activeSteps);
      }
    });

    // TODO: had to add the code ensuring all the layer plan parentPlanId's
    // existed to fix polymorphism, but it feels wrong. Should we be doing
    // something different?

    // Ensure all the layer plan parents exist
    for (const layerPlan of this.layerPlans) {
      if ("parentPlanId" in layerPlan.reason) {
        this.markStepActive(
          this.steps[layerPlan.reason.parentPlanId],
          activeSteps,
        );
      }
    }

    for (let i = 0, l = this.steps.length; i < l; i++) {
      const step = this.steps[i];
      if (step && !activeSteps.has(step)) {
        // if (debugPlanVerboseEnabled && step.id === i) {
        //   debugPlanVerbose(`Deleting step %c during tree shaking`, step);
        // }

        // We're going to delete this step. Theoretically nothing can reference
        // it, so it should not cause any issues. If it does, it's due to a
        // programming bug somewhere where we're referencing a step that hasn't
        // been added to the relevant dependencies. As such; I'm going
        // to bypass TypeScript here and delete the node whilst still letting
        // TypeScript guarantee it exists - better that the user gets a runtime
        // error trying to use it rather than using a nonsense step.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.steps[i] = null as any;
      }
    }
  }

  private getPeers(
    step: ExecutableStep,
    alsoIncludeLayerPlans: LayerPlan[],
  ): ExecutableStep[] {
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
    const compatibleLayerPlans: LayerPlan[] = [...alsoIncludeLayerPlans];
    let currentLayerPlan: LayerPlan | null = step.layerPlan;
    const doNotPass = step.dependencies.map((depId) => {
      if (isDev) {
        assert.ok(
          this.steps[depId] != null,
          `GraphileInternalError<825a1c5c-ad15-49fc-a340-159799061daf>: step '${depId}' has been deleted; but '${step}' depends on it. Bug in tree shaking?`,
        );
      }
      return this.steps[depId].layerPlan;
    });

    do {
      if (!compatibleLayerPlans.includes(currentLayerPlan)) {
        compatibleLayerPlans.push(currentLayerPlan);
      }

      /*
       * NOTE: this has been disabled in favour of using
       * `polymorphicDeduplicateSteps` method.
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
      */

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

      // Can only merge if plan is of same type.
      if (step.constructor !== potentialPeer.constructor) {
        continue;
      }

      // Can only merge if the dependencies are the same.
      if (
        !arraysMatch(
          step.dependencies,
          potentialPeer.dependencies,
          (depA, depB) => this.steps[depA] === this.steps[depB],
        )
      ) {
        continue;
      }

      peers.push(potentialPeer);
    }

    return peers;
  }

  /**
   * Attempts to hoist the step into a higher layerPlan to maximize
   * deduplication.
   */
  private hoistStep(step: ExecutableStep) {
    if (step.hasSideEffects) {
      return;
    }
    if (step instanceof __ItemStep) {
      return;
    }
    switch (step.layerPlan.reason.type) {
      case "root": {
        // There is no higher layerPlan
        return;
      }
      case "subscription":
      case "defer":
      case "stream": {
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
        if (step.isSyncAndSafe) {
          // It's cheap, try and hoist it.
          // NOTE: this means this will run for non-matching types, which is
          // not ideal. We may need to revert this.
          // TODO: ensure this is safe.
          break;
        } else {
          return;
        }
      }
      case "subroutine": {
        // Should be safe to hoist.
        break;
      }
      case "listItem": {
        // Should be safe to hoist so long as it doesn't depend on the
        // `__ItemStep` itself (which is just a regular dependency, so it'll be
        // checked later).
        break;
      }
      case "mutationField": {
        // NOTE: It's the user's responsibility to ensure that steps that have
        // side effects are marked as such via `step.hasSideEffects = true`.
        // TODO: warn user we're hoisting from a mutationField?
        // TODO: maybe only hoist the isSyncAndSafe steps?
        break;
      }
      default: {
        const never: never = step.layerPlan.reason;
        throw new Error(
          `GraphileInternalError<81e3a7d4-aaa0-416b-abbb-a887734007bc>: unhandled layer plan reason ${inspect(
            never,
          )}`,
        );
      }
    }

    // Finally, check that none of its dependencies are in the same bucket.
    const deps = step.dependencies.map((depId) => this.steps[depId]);
    if (deps.some((dep) => dep.layerPlan === step.layerPlan)) {
      return;
    }

    // All our checks passed, hoist it.
    assert.ok(
      step.layerPlan.parentLayerPlan !== null,
      "GraphileInternalError<55c8940f-e8ac-4985-8b34-96fc6f81d62d>: A non-root layer plan had no parent?!",
    );
    step.layerPlan = step.layerPlan.parentLayerPlan;

    // Now try and hoist it again!
    this.hoistStep(step);
  }

  private _deduplicateInnerLogic(
    step: ExecutableStep,
    alsoIncludeLayerPlans: LayerPlan[] = [],
  ) {
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
    // TODO: revisit this decision in the context of SAGE.
    if (shouldStream) {
      // Never deduplicate streaming plans, we cannot reference the stream more
      // than once (and we aim to not cache the stream because we want its
      // entries to be garbage collected).
      return null;
    }

    const peers = this.getPeers(step, alsoIncludeLayerPlans);

    // TODO: should we keep this optimisation, or should we remove it so that
    // plans that are "smarter" than us can return replacement plans even if
    // they're not peers?
    if (peers.length === 0) {
      return null;
    }

    const equivalentSteps = step.deduplicate(peers);
    if (equivalentSteps.length === 0) {
      // No equivalents, we're the original
      return null;
    }

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
    layersAtMinDepth.sort((a, z) => a.id - z.id);
    stepsAtMinDepth.sort((a, z) => a.id - z.id);
    return { layersAtMinDepth, stepsAtMinDepth, allEquivalentSteps };
  }

  private deduplicateStep(step: ExecutableStep): ExecutableStep {
    const result = this._deduplicateInnerLogic(step);
    if (result == null) {
      return step;
    }

    const { layersAtMinDepth, stepsAtMinDepth, allEquivalentSteps } = result;
    assert.strictEqual(
      layersAtMinDepth.length,
      1,
      "How did we find more than one layer at the min depth?! Polymorphics should be handled via polymorphicDeduplicateSteps",
    );

    // Hooray, one winning layer! Find the first one by id.
    const winner = stepsAtMinDepth[0];

    // Everything else is equivalent to winner!
    this.replaceSteps(allEquivalentSteps, winner);

    return winner;
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

  private hoistSteps() {
    this.processSteps("hoist", 0, "dependencies-first", (step) => {
      this.hoistStep(step);
      // Even if step wasn't hoisted, its deps may have been so we should still
      // re-deduplicate it.
      return this.deduplicateStep(step);
    });
  }

  /**
   * When deduplicating polymorphic plans we have to put a bit more effort in.
   * This should only be called after planning the fields (but not their
   * items/selection sets) for each possible type in a polymorphic selection.
   *
   * The starting state should be that we have a set of polymorphicLayerPlans
   * covering all the possible types. Note that some of these layers may cover
   * more than one potential type, this might be the case if they each return
   * the exact same plan as their polymorphic item plan.
   *
   * We'll then scan over the list of not-yet-deduplicated steps and make a
   * list of just the steps that aren't dependent on any of the other steps in
   * this list. We'll then deduplicate these, picking the highest bucket that
   * any of them are in. If that bucket is not polymorphic that's fine. If that
   * bucket is polymorphic but it's the same bucket for all then that's fine.
   * If, however, it's more than one polymorphic bucket then we'll create a new
   * polymorphic bucket that's above all these buckets and make these buckets a
   * child of it (and push this step into that bucket); that is unless a
   * perfectly matching bucket already exists.
   *
   * Then we repeat.
   *
   * TODO: the above isn't quite right because as the LayerPlans restructure we
   * won't always be able to full deduplicate (possibly).
   *
   * TODO: no idea if this is complete.
   */
  polymorphicDeduplicateSteps(
    // TODO: use this
    polymorphicLayerPlans: LayerPlan<LayerPlanReasonPolymorphic>[],
  ) {
    const previousStepCount = this.stepCount;
    const fromStepId = this.maxDeduplicatedStepId + 1;
    const pendingSteps: ExecutableStep[] = [];

    for (let stepId = fromStepId; stepId < previousStepCount; stepId++) {
      const step = this.steps[stepId];
      pendingSteps.push(step);
    }

    while (pendingSteps.length > 0) {
      /** The steps that aren't dependent on any other steps in this batch */
      const topSteps: ExecutableStep[] = [];
      for (let i = pendingSteps.length - 1; i >= 0; i--) {
        const step = pendingSteps[i];
        if (
          !step.dependencies.some((depId) =>
            pendingSteps.includes(this.steps[depId]),
          )
        ) {
          topSteps.push(step);
          pendingSteps.splice(i, 1);
        }
      }
      topSteps.reverse();

      assert.ok(
        topSteps.length > 0,
        "There must be a cycle in the dependencies; this is not allowed.",
      );

      // Now go calculate the equivalent steps for each of these
      const seen = new Set<ExecutableStep>();
      const results: Exclude<
        ReturnType<typeof this._deduplicateInnerLogic>,
        null
      >[] = [];
      for (const step of topSteps) {
        if (seen.has(step)) {
          continue;
        }
        seen.add(step);

        let includeLayerPlans: LayerPlan[] = [];
        if (step.layerPlan.reason.type === "polymorphic") {
          // Siblings of `step.layerPlan`
          const my = step.layerPlan;
          includeLayerPlans = this.layerPlans.filter(
            (lp) =>
              lp.parentLayerPlan === my.parentLayerPlan &&
              lp.reason.type === "polymorphic" &&
              lp.rootStepId === my.rootStepId,
          );
        }
        const result = this._deduplicateInnerLogic(step, includeLayerPlans);

        if (!result) {
          continue;
        }
        const { layersAtMinDepth, stepsAtMinDepth, allEquivalentSteps } =
          result;
        if (layersAtMinDepth.length === 1) {
          // Simples!
          const winner = stepsAtMinDepth[0];
          this.replaceSteps(allEquivalentSteps, winner);
          for (const equivalentStep of allEquivalentSteps) {
            seen.add(equivalentStep);
          }
        } else {
          // Polymorphic... handle later
          results.push(result);
        }
      }

      // It's later now, time to handle the polymorphic ones
      while (results.length > 0) {
        /*
         * "Ooo, polymorphic time." <cracks knuckles>
         *
         * So we've got a bunch of results for our "deduplicated" plans. We've
         * not _actually_ deduplicated them, just figured out the equivalents.
         * Now we need to act.
         */

        // First up, lets find the results that affect the most layers. We know
        // they all affect at least 2 layers.
        let winners: typeof results = [];
        let winningCount = 0;
        for (const result of results) {
          if (result?.layersAtMinDepth.length > winningCount) {
            winners = [result];
            winningCount = result?.layersAtMinDepth.length;
          }
        }

        // So all these ${winners} affect ${winningCount} layers. Lets find out
        // which layer combination is most popular.
        const comboCounts: { [combo: string]: typeof results } =
          Object.create(null);
        let winningCombo: typeof results = [];
        for (const winner of winners) {
          const combo = winner.layersAtMinDepth.map((l) => l.id).join(",");
          if (!comboCounts[combo]) {
            comboCounts[combo] = [winner];
          } else {
            comboCounts[combo].push(winner);
          }
          if (comboCounts[combo].length > winningCombo.length) {
            winningCombo = comboCounts[combo];
          }
        }

        // And the typeNames for this combo
        const typeNames = winningCombo[0].layersAtMinDepth
          .flatMap((l) => (l.reason as LayerPlanReasonPolymorphic).typeNames)
          .sort();
        // TODO: assert typeNames is unique if isDev. (It should be!)

        // Does the existing parent of each of these already match?
        const oneLayer = winningCombo[0].layersAtMinDepth[0];
        const parent = oneLayer.parentLayerPlan;
        if (!parent) {
          throw new Error(
            "GraphileInternalError<c7e37f4d-d7ea-4f29-98f5-c0781b5f4293>: how could a polymorphic LayerPlan not have a parent?",
          );
        }

        // Remove these results from the 'results' list
        for (const result of winningCombo) {
          const i = results.indexOf(result);
          assert.ok(i >= 0, "result wasn't in results?!");
          // TODO: should results be a Set to make splicing cheaper?
          results.splice(i, 1);
        }

        if (
          parent.reason.type === "polymorphic" &&
          parent.rootStepId === oneLayer.rootStepId &&
          arraysMatch(parent.reason.typeNames.sort(), typeNames)
        ) {
          // Yes, parent matches so we can just hoist to here!
          for (const result of winningCombo) {
            const winner = result.allEquivalentSteps[0];
            winner.layerPlan = parent;
            this.replaceSteps(result.allEquivalentSteps, winner);
          }
        } else {
          // Not equivalent, need to create a new bucket and shove all the
          // plans into it
          if (!parent.rootStepId) {
            throw new Error("Need parent step");
          }
          const newPolymorphicLayerPlan = new LayerPlan(this, parent, {
            type: "polymorphic",
            typeNames,
            // TODO: is this right?
            parentPlanId: parent.rootStepId,
          });
          winningCombo[0].layersAtMinDepth.forEach((layer) => {
            layer.parentLayerPlan = newPolymorphicLayerPlan;
          });
          for (const result of winningCombo) {
            const winner = result.allEquivalentSteps[0];
            winner.layerPlan = newPolymorphicLayerPlan;
            this.replaceSteps(result.allEquivalentSteps, winner);
          }

          // Doing this restructuring of the LayerPlans has invalidated
          // `results`; we need to account for this.
          // Loop backwards due to splice. Also remember we're pushing and
          // don't want to process the newly pushed values.
          for (
            let resultIndex = results.length - 1;
            resultIndex >= 0;
            resultIndex--
          ) {
            const result = results[resultIndex];
            const parents = new Set([
              ...result.layersAtMinDepth.map((l) => l.parentLayerPlan),
            ]);
            if (parents.size > 1) {
              // One of parents is presumably newPolymorphicLayerPlan... There
              // should only be two I guess?
              assert.strictEqual(
                parents.size,
                2,
                "GraphileInternalError<6b6a3a15-fad0-4f2f-a3a2-51b984b3e22d>: consistency check",
              );

              // Original values
              const { layersAtMinDepth, stepsAtMinDepth, allEquivalentSteps } =
                result;

              // Remove this old result
              results.splice(resultIndex, 1);

              // Add new results for each of the parents
              for (const parent of parents) {
                // Find the subset for this parent
                const newLayersAtMinDepth = layersAtMinDepth.filter(
                  (l) => l.parentLayerPlan === parent,
                );
                const newStepsAtMinDepth = stepsAtMinDepth.filter((s) =>
                  newLayersAtMinDepth.includes(s.layerPlan),
                );
                const newAllEquivalentSteps = allEquivalentSteps.filter((s) => {
                  // This step has to be "within" one of the newLayersAtMinDepth, but potentially deep.
                  let p: LayerPlan | null = s.layerPlan;
                  while (p) {
                    if (newLayersAtMinDepth.includes(p)) {
                      return true;
                    }

                    p = p.parentLayerPlan;
                  }
                  return false;
                });
                const newResult: typeof result = {
                  allEquivalentSteps: newAllEquivalentSteps,
                  stepsAtMinDepth: newStepsAtMinDepth,
                  layersAtMinDepth: newLayersAtMinDepth,
                };
                results.push(newResult);
              }
              // TODO: if isDev check that all values from the original
              // `result` are represented in the `newResult`s.
            }
          }
        }
      }
    }

    // Finally:
    this.maxDeduplicatedStepId = previousStepCount - 1;
  }

  private getStepOptionsForStep(step: ExecutableStep): StepOptions {
    return step._stepOptions;
    /*
    // NOTE: streams can only be merged if their parameters are compatible
    // (namely they need to have equivalent `initialCount`)
    const streamLayerPlan = step.childLayerPlans.find(
      (lp) => lp.reason.type === "stream",
    );

    // TODO: if step isn't streamable, don't create a streamLayerPlan because
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
  private optimizeStep(step: ExecutableStep): ExecutableStep {
    if (step.isOptimized && !step.allowMultipleOptimizations) {
      return step;
    }

    // We know if it's streaming or not based on the LayerPlan it's contained within.
    const stepOptions = this.getStepOptionsForStep(step);
    const replacementStep = step.optimize(stepOptions);
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
      if (step && step.id === Number(stepId)) {
        step.finalize();
        assertFinalized(step);
        if (isDev) {
          assert.equal(
            this.stepCount,
            initialStepCount,
            `When calling ${step}.finalize() a new plan was created; this is forbidden!`,
          );
        }
        for (let i = 0, l = step.dependencies.length; i < l; i++) {
          const dep = this.steps[step.dependencies[i]];
          // Overwrite the dependency id with its resolved ID so we don't need
          // to look it up in executeBucket
          (step.dependencies as number[])[i] = dep.id;
          dep.dependentPlans.push(step);
        }
      }
    }
  }

  private finalizeLayerPlans(): void {
    for (const layerPlan of this.layerPlans) {
      layerPlan.steps = this.steps.filter(
        (s) => s !== null && s.layerPlan === layerPlan,
      );
      layerPlan.startSteps = layerPlan.steps.filter((s) => {
        for (const depId of s.dependencies) {
          const dep = this.steps[depId];
          if (dep.layerPlan === layerPlan) {
            return false;
          }
        }
        return true;
      });

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
          if (currentLayerPlan.copyPlanIds.includes(dep.id)) {
            break;
          }
          currentLayerPlan.copyPlanIds.push(dep.id);
          currentLayerPlan = currentLayerPlan.parentLayerPlan;
          if (!currentLayerPlan) {
            throw new Error(
              `GraphileInternalError<8c1640b9-fa3c-440d-99e5-7693d0d7e5d1>: could not find layer plan for '${dep}' in chain from layer plan ${layerPlan.id}`,
            );
          }
        }
      };

      // TODO:perf: this could probably be faster.
      // Populate copyPlanIds for each step
      for (const step of layerPlan.steps) {
        // Items shouldn't have their "list" copied in.
        if (step instanceof __ItemStep) {
          continue;
        }
        for (const depId of step.dependencies) {
          const dep = this.steps[depId];
          ensurePlanAvailableInLayer(dep, layerPlan);
        }
      }
      // Populate copyPlanIds for output plans' rootStepId
      this.walkOutputPlans(this.rootOutputPlan, (outputPlan) => {
        const rootPlan = this.steps[outputPlan.rootStepId];
        ensurePlanAvailableInLayer(rootPlan, outputPlan.layerPlan);
      });

      // Update plan references so executeBucket doesn't need to do explicit lookups
      const reason = layerPlan.reason;
      switch (reason.type) {
        case "root":
        case "defer":
        case "subscription":
        case "mutationField": {
          break;
        }
        case "subroutine":
        case "polymorphic":
        case "stream":
        case "listItem": {
          reason.parentPlanId = this.steps[reason.parentPlanId].id;
          break;
        }
        default: {
          const never: never = reason;
          throw new Error(
            `GraphileInternalError<0ac8d6d7-3a02-4c84-99c1-21ad77e3a8f7>: unrecognized layer plan reason ${inspect(
              never,
            )}`,
          );
        }
      }
    }
  }

  /** Finalizes each output plan */
  private finalizeOutputPlans(): void {
    this.walkOutputPlans(this.rootOutputPlan, (outputPlan) =>
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
    for (const key of Object.values(outputPlan.keys).flatMap((o) =>
      Object.values(o),
    )) {
      if (key.type === "outputPlan") {
        this.walkOutputPlans(key.outputPlan, callback);
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
      steps: this.steps,
    });
  }
}

function makeDefaultPlan(fieldName: string) {
  return ($step: ExecutableStep<any>) => access($step, [fieldName]);
}
