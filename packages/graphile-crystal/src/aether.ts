import { inspect } from "util";
import * as assert from "assert";
import { Constraint } from "./constraints";
import {
  GraphQLSchema,
  OperationDefinitionNode,
  FragmentDefinitionNode,
  GraphQLField,
  FieldNode,
  GraphQLObjectType,
  assertObjectType,
  getNamedType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  assertListType,
  SelectionNode,
  GraphQLInputType,
  isNonNullType,
  isListType,
  isInputObjectType,
  GraphQLInputObjectType,
  GraphQLInputField,
  GraphQLOutputType,
  GraphQLList,
  GraphQLNonNull,
} from "graphql";
import {
  Plan,
  __TrackedObjectPlan,
  __ValuePlan,
  assertFinalized,
  PolymorphicPlan,
  ArgumentPlan,
  __ListItemPlan,
} from "./plan";
import { graphqlCollectFields, getDirective } from "./graphqlCollectFields";
import { InputPlan, inputPlan, InputObjectPlan } from "./input";
import {
  defaultValueToValueNode,
  uid,
  UniqueId,
  isPromise,
  ROOT_VALUE_OBJECT,
} from "./utils";
import {
  graphqlMergeSelectionSets,
  typesUsedInSelections,
  interfaceTypeHasNonIntrospectionFieldQueriedInSelections,
} from "./graphqlMergeSelectionSets";
import {
  Batch,
  CrystalContext,
  CrystalObject,
  $$id,
  $$crystalContext,
  $$idByPathIdentity,
  $$indexes,
  $$indexesByPathIdentity,
} from "./interfaces";
import { isDev } from "./dev";
import { Deferred } from "./deferred";
import { isCrystalObject } from "./resolvers";

import debugFactory from "debug";

const EMPTY_INDEXES = Object.freeze([] as number[]);

const debug = debugFactory("crystal:aether");

const globalState = {
  aether: null as Aether | null,
  pathIdentity: "" as string,
};

interface ListCapablePlan<TData> extends Plan<TData> {
  listItem(itemPlan: __ListItemPlan<Plan<ReadonlyArray<TData>>>): Plan<TData>;
}

function assertListCapablePlan<TData>(
  plan: Plan<TData>,
  pathIdentity: string,
): asserts plan is ListCapablePlan<TData> {
  if (!("listItem" in plan) || typeof (plan as any).listItem !== "function") {
    throw new Error(
      `The plan returned from '${pathIdentity}' should be a list capable plan, but it does not implement the 'listItem' method.`,
    );
  }
}

/**
 * Since plan functions are called synchronously _by us_ we don't need to pass
 * around a reference to Aether that users then have to pass back to us;
 * instead we can pull it from this global state. This is not dissimilar to how
 * React's hooks work.
 */
export function getCurrentAether(): Aether {
  const aether = globalState.aether;
  if (!aether) {
    throw new Error(
      "You have broken the rules of Graphile Crystal Plans; they must only be created synchronously from inside the relevant `plan` function.",
    );
  }
  return aether;
}

/**
 * Like with `getCurrentAether`, since plan functions are called synchronously
 * _by us_ we can pull the current pathIdentity from global state.
 */
export function getCurrentPathIdentity(): string {
  return globalState.pathIdentity;
}

type TrackedArguments = { [key: string]: InputPlan };

function assertPolymorphicPlan(
  plan: Plan | PolymorphicPlan,
): asserts plan is PolymorphicPlan {
  assert.ok(
    "planForType" in plan,
    "Expected plan for interface field to be polymorphic.",
  );
  assert.equal(
    typeof plan.planForType,
    "function",
    "Expected property `planForType` for interface field plan to be a function.",
  );
}

function assertArgumentPlan(
  plan: Plan | ArgumentPlan,
): asserts plan is ArgumentPlan {
  assert.ok(
    "null" in plan,
    "Expected plan for argument to be compatible with ArgumentPlan.",
  );
  assert.equal(
    typeof plan.null,
    "function",
    "Expected property `null` for argument plan to be a function.",
  );
}

function atIndexes(data: any, indexes: ReadonlyArray<number>): any {
  let o = data;
  for (let i = 0, l = indexes.length; i < l; i++) {
    o = o?.[indexes[i]];
  }
  return o;
}

/**
 * Implements the `NewAether` algorithm.
 */
export class Aether {
  public maxGroupId = 0;
  public groupId = this.maxGroupId;
  public readonly plans: Plan[] = [];
  public readonly batchByPathIdentity: {
    [pathIdentity: string]: Batch | undefined;
  } = Object.create(null);
  public readonly planIdByPathIdentity: {
    [pathIdentity: string]: number | undefined;
  };
  public readonly valueIdByObjectByPlanId: {
    [planId: number]: WeakMap<object, UniqueId> | undefined;
  } = Object.create(null);
  public readonly variableValuesConstraints: Constraint[] = [];
  public readonly variableValuesPlan: __ValuePlan;
  public readonly trackedVariableValuesPlan: __TrackedObjectPlan;
  public readonly contextConstraints: Constraint[] = [];
  public readonly contextPlan: __ValuePlan;
  public readonly trackedContextPlan: __TrackedObjectPlan;
  public readonly rootValueConstraints: Constraint[] = [];
  public readonly rootValuePlan: __ValuePlan;
  public readonly trackedRootValuePlan: __TrackedObjectPlan;
  public readonly operationType: "query" | "mutation" | "subscription";

  constructor(
    public readonly schema: GraphQLSchema,
    // Note: whereas the `NewAether` algorithm refers to `document` and
    // `operationName`; we use `operation` and `fragments` because they're
    // easier to access in GraphQL.js
    public readonly operation: OperationDefinitionNode,
    public readonly fragments: {
      [fragmentName: string]: FragmentDefinitionNode;
    },
    public readonly variableValues: {
      [variableName: string]: unknown;
    },
    public readonly context: object,
    public readonly rootValue: unknown,
  ) {
    globalState.aether = this;
    this.variableValuesPlan = new __ValuePlan();
    debug("Constructed variableValuesPlan %s", this.variableValuesPlan);
    // TODO: this should use a more intelligent tracked object plan since the variables are strongly typed (unlike context/rootValue).
    this.trackedVariableValuesPlan = new __TrackedObjectPlan(
      variableValues,
      this.variableValuesPlan,
      this.variableValuesConstraints,
    );
    debug(
      "Constructed trackedVariableValuesPlan %s",
      this.trackedVariableValuesPlan,
    );
    this.contextPlan = new __ValuePlan();
    debug("Constructed contextPlan %s", this.contextPlan);
    this.trackedContextPlan = new __TrackedObjectPlan(
      context,
      this.contextPlan,
      this.contextConstraints,
    );
    debug("Constructed trackedContextPlan %s", this.trackedContextPlan);
    this.rootValuePlan = new __ValuePlan();
    debug("Constructed rootValuePlan %s", this.rootValuePlan);
    this.trackedRootValuePlan = new __TrackedObjectPlan(
      rootValue,
      this.rootValuePlan,
      this.rootValueConstraints,
    );
    debug("Constructed trackedRootValuePlan %s", this.trackedRootValuePlan);
    this.planIdByPathIdentity = Object.assign(Object.create(null), {
      "": this.rootValuePlan.id,
    });
    this.operationType = operation.operation;
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

    this.optimizePlans();
    this.treeShakePlans();
    this.finalizePlans();
    globalState.aether = null;
  }

  /**
   * Implements the `PlanAetherQuery` algorithm.
   */
  private planQuery(): void {
    const rootType = this.schema.getQueryType();
    if (!rootType) {
      throw new Error("No query type found in schema");
    }
    this.planSelectionSet(
      "",
      this.trackedRootValuePlan,
      rootType,
      this.operation.selectionSet.selections,
    );
  }

  /**
   * Implements the `PlanAetherMutation` algorithm.
   */
  private planMutation(): void {
    const rootType = this.schema.getMutationType();
    if (!rootType) {
      throw new Error("No mutation type found in schema");
    }
    this.planSelectionSet(
      "",
      this.trackedRootValuePlan,
      rootType,
      this.operation.selectionSet.selections,
      true,
    );
  }

  /**
   * Implements the `PlanAetherSubscription` algorithm.
   */
  private planSubscription(): void {
    const rootType = this.schema.getSubscriptionType();
    if (!rootType) {
      throw new Error("No subscription type found in schema");
    }
    const selectionSet = this.operation.selectionSet;
    const groupedFieldSet = graphqlCollectFields(
      this,
      rootType,
      selectionSet.selections,
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
    const field = fields[0];
    const fieldName = field.name.value; // Unaffected by alias.
    const rootTypeFields = rootType.getFields();
    const fieldSpec: GraphQLField<unknown, unknown> = rootTypeFields[fieldName];
    const subscriptionPlanResolver =
      fieldSpec.extensions?.graphile?.subscribePlan;
    if (subscriptionPlanResolver) {
      const trackedArguments = this.getTrackedArguments(rootType, field);
      const subscribePlan = subscriptionPlanResolver(
        this.trackedRootValuePlan,
        trackedArguments,
        this.trackedContextPlan,
      );
      this.planFieldArguments(
        rootType,
        fieldSpec,
        field,
        trackedArguments,
        subscribePlan,
      );
      this.planSelectionSet(
        "",
        subscribePlan,
        rootType,
        selectionSet.selections,
      );
    } else {
      const subscribePlan = this.trackedRootValuePlan;
      this.planSelectionSet(
        "",
        subscribePlan,
        rootType,
        selectionSet.selections,
      );
    }
  }

  /**
   * Implements the `PlanSelectionSet` algorithm, and also
   * `GetPolymorphicObjectPlanForType`.
   */
  private planSelectionSet(
    path: string,
    parentPlan: Plan,
    objectType: GraphQLObjectType,
    selections: ReadonlyArray<SelectionNode>,
    isSequential = false,
  ): void {
    assertObjectType(objectType);
    const groupedFieldSet = graphqlCollectFields(this, objectType, selections);
    const objectTypeFields = objectType.getFields();
    for (const [responseKey, fields] of groupedFieldSet.entries()) {
      const oldGroupId = this.groupId;
      const pathIdentity = `${path}>${objectType.name}.${responseKey}`;
      globalState.pathIdentity = pathIdentity;
      const field = fields[0];
      const fieldName = field.name.value;

      // This is presumed to exist because the operation passed validation.
      const objectField = objectTypeFields[fieldName];
      const fieldType = objectTypeFields[fieldName].type;

      // Note we don't have "defer" here, since "defer" only applies to fragments.
      const stream = getDirective(field, "stream");
      if (stream) {
        assertListType(fieldType);
        this.groupId = ++this.maxGroupId;
      }

      const planResolver = objectField.extensions?.graphile?.plan;
      let plan: Plan | PolymorphicPlan;
      if (typeof planResolver === "function") {
        const trackedArguments = this.getTrackedArguments(objectType, field);
        plan = planResolver(
          parentPlan,
          trackedArguments,
          this.trackedContextPlan,
        );
        this.planFieldArguments(
          objectType,
          objectField,
          field,
          trackedArguments,
          plan,
        );
      } else {
        // Note: this is populated in GetValuePlanId
        plan = new __ValuePlan();
      }
      this.planIdByPathIdentity[pathIdentity] = plan.id;

      this.planSelectionSetForType(fieldType, fields, pathIdentity, plan);
      this.groupId = oldGroupId;
    }
  }

  /**
   * This algorithm wasn't originally planned, but we should not have jumped
   * straight to getNamedType in the plan. This method lets us walk the type
   * tree and add in `__ListItemPlan`s in the relevant places so that we can
   * refer to indexes when referencing the relevant values.
   */
  planSelectionSetForType(
    fieldType: GraphQLOutputType,
    fields: FieldNode[],
    pathIdentity: string,
    plan: Plan<any>,
  ): void {
    if (fieldType instanceof GraphQLNonNull) {
      // TODO: we could implement a __NonNullPlan in future; currently we just
      // defer that to GraphQL.js
      this.planSelectionSetForType(
        fieldType.ofType,
        fields,
        pathIdentity,
        plan,
      );
      return;
    } else if (fieldType instanceof GraphQLList) {
      assertListCapablePlan(plan, pathIdentity);
      const listItemPlan = plan.listItem(new __ListItemPlan(plan));
      this.planSelectionSetForType(
        fieldType.ofType,
        fields,
        pathIdentity,
        listItemPlan,
      );
      return;
    }
    const isObjectType = fieldType instanceof GraphQLObjectType;
    const isInterfaceType = fieldType instanceof GraphQLInterfaceType;
    const isUnionType = fieldType instanceof GraphQLUnionType;
    if (isObjectType || isInterfaceType || isUnionType) {
      const subSelectionSet = graphqlMergeSelectionSets(fields);
      if (isObjectType) {
        this.planSelectionSet(
          pathIdentity,
          plan,
          fieldType as GraphQLObjectType,
          subSelectionSet,
          false,
        );
      } else {
        assertPolymorphicPlan(plan);
        const polymorphicPlan = plan;
        const planPossibleObjectTypes = (
          possibleObjectTypes: readonly GraphQLObjectType[],
        ): void => {
          for (let i = 0, l = possibleObjectTypes.length; i < l; i++) {
            const possibleObjectType = possibleObjectTypes[i];
            // This line implements `GetPolymorphicObjectPlanForType`.
            const subPlan = polymorphicPlan.planForType(possibleObjectType);
            this.planSelectionSet(
              pathIdentity,
              subPlan,
              possibleObjectType,
              subSelectionSet,
              false,
            );
          }
        };
        if (isUnionType) {
          const unionType = fieldType as GraphQLUnionType;
          const possibleObjectTypes = typesUsedInSelections(
            this,
            unionType.getTypes(),
            subSelectionSet,
          );
          /*@__INLINE__*/ planPossibleObjectTypes(possibleObjectTypes);
        } else {
          assert.ok(
            isInterfaceType,
            "Impossible. isObjectType and isUnionType are false so isInterfaceType must be true",
          );
          const interfaceType = fieldType as GraphQLInterfaceType;
          // If we reference non-introspection fields on the interface type (or
          // any of the interface types it implements) then we need to plan for
          // every single object type that implements this interface; otherwise
          // we only need to plan the reachable types.
          const implementations = this.schema.getImplementations(interfaceType)
            .objects;
          if (
            interfaceTypeHasNonIntrospectionFieldQueriedInSelections(
              this,
              interfaceType,
              subSelectionSet,
            )
          ) {
            /*@__INLINE__*/ planPossibleObjectTypes(implementations);
          } else {
            const possibleObjectTypes = typesUsedInSelections(
              this,
              implementations,
              subSelectionSet,
            );
            /*@__INLINE__*/ planPossibleObjectTypes(possibleObjectTypes);
          }
        }
      }
    }
  }

  /**
   * Implements the `PlanFieldArguments` and `PlanFieldArgument` algorithms.
   */
  private planFieldArguments(
    _objectType: GraphQLObjectType,
    fieldSpec: GraphQLField<unknown, unknown>,
    _field: FieldNode,
    trackedArguments: TrackedArguments,
    fieldPlan: Plan,
  ): void {
    for (let i = 0, l = fieldSpec.args.length; i < l; i++) {
      const argSpec = fieldSpec.args[i];
      const argName = argSpec.name;
      const trackedArgumentValuePlan = trackedArguments[argName];
      if (trackedArgumentValuePlan !== undefined) {
        const planResolver = argSpec.extensions?.graphile?.plan;
        if (typeof planResolver === "function") {
          const argPlan = planResolver(
            fieldPlan,
            trackedArgumentValuePlan,
            this.trackedContextPlan,
          );
          assertArgumentPlan(argPlan);
          if (argPlan != null) {
            this.planInput(argSpec.type, trackedArgumentValuePlan, argPlan);
          }
        }
      }
    }
  }

  /**
   * Implements the `PlanInput` algorithm.
   *
   * Note: we are only expecting to `PlanInput()` for objects or lists thereof, not scalars.
   */
  private planInput(
    inputType: GraphQLInputType,
    trackedValuePlan: InputPlan,
    parentPlan: ArgumentPlan,
  ): void {
    if (isNonNullType(inputType)) {
      this.planInput(inputType.ofType, trackedValuePlan, parentPlan);
      return;
    }
    if (isListType(inputType)) {
      if (trackedValuePlan.evalIs(null)) {
        parentPlan.null();
        return;
      }
      const innerInputType = inputType.ofType;
      // TODO: assert trackedValuePlan represents a list
      const length = (trackedValuePlan as any).evalLength?.();
      for (let i = 0; i < length; i++) {
        const listItemParentPlan = (parentPlan as any).itemPlan();
        const trackedListValue = (trackedValuePlan as any).at(i);
        this.planInput(innerInputType, trackedListValue, listItemParentPlan);
      }
      return;
    }
    if (isInputObjectType(inputType)) {
      if (trackedValuePlan.evalIs(null)) {
        // TODO: should we indicate to the parent that this is null as opposed to an empty object?
        return;
      }
      this.planInputFields(inputType, trackedValuePlan, parentPlan);
    }
    throw new Error("Invalid plan; planInput called for unsupported type.");
  }

  /**
   * Implements `PlanInputFields` algorithm.
   */
  private planInputFields(
    inputObjectType: GraphQLInputObjectType,
    trackedValuePlan: InputPlan,
    parentPlan: ArgumentPlan,
  ): void {
    assert.ok(
      trackedValuePlan instanceof InputObjectPlan,
      "Expected trackedValuePlan to be an InputObjectPlan",
    );
    const inputFieldSpecs = inputObjectType.getFields();
    for (const fieldName in inputFieldSpecs) {
      const inputFieldSpec = inputFieldSpecs[fieldName];
      if (trackedValuePlan.evalHas(fieldName)) {
        const trackedFieldValue = trackedValuePlan.get(fieldName);
        this.planInputField(inputFieldSpec, trackedFieldValue, parentPlan);
      }
    }
  }

  /**
   * Implements `PlanInputField` algorithm.
   */
  private planInputField(
    inputField: GraphQLInputField,
    trackedValuePlan: InputPlan,
    parentPlan: ArgumentPlan,
  ): void {
    const planResolver = inputField.extensions?.graphile?.plan;
    assert.equal(typeof planResolver, "function");
    const inputFieldPlan = planResolver(
      parentPlan,
      trackedValuePlan,
      this.trackedContextPlan,
    );
    if (typeof inputFieldPlan === "function") {
      const inputFieldType = inputField.type;
      // Note: the unwrapped type of inputFieldType must be an input object.
      // TODO: assert this?
      this.planInput(inputFieldType, trackedValuePlan, inputFieldPlan);
    }
  }

  /**
   * Implements the `TrackedArguments` algorithm, a replacement for GraphQL's
   * `CoerceArgumentValues` that factors in tracked variables.
   *
   * @see https://spec.graphql.org/draft/#CoerceArgumentValues()
   */
  private getTrackedArguments(
    objectType: GraphQLObjectType,
    field: FieldNode,
  ): TrackedArguments {
    const trackedArgumentValues = {};
    if (field.arguments) {
      const argumentValues = field.arguments;
      const fieldName = field.name.value;
      const fieldSpec = objectType.getFields()[fieldName];
      const argumentDefinitions = fieldSpec.args;

      for (const argumentName in argumentDefinitions) {
        const argumentDefinition = argumentDefinitions[argumentName];
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
    return trackedArgumentValues;
  }

  /**
   * Implements the `OptimizePlans` algorithm. Note that we loop backwards
   * since later plans are dependent on earlier plans, so by starting at the
   * latest plans we can make sure that we know all our dependent's needs
   * before we optimise ourself.
   */
  private optimizePlans(): void {
    for (let i = this.plans.length - 1; i >= 0; i--) {
      const plan = this.plans[i];
      globalState.pathIdentity = plan.pathIdentity;
      this.plans[i] = this.optimizePlan(plan);
    }
  }

  private isPeer(planA: Plan, planB: Plan): boolean {
    // Can only merge if plan is of same type.
    if (planA.constructor !== planB.constructor) {
      return false;
    }

    // Can only merge if the dependencies are the same.
    // TODO: can we soften this?
    if (
      planA.dependencies.length !== planB.dependencies.length ||
      planA.dependencies.some(
        (depId, i) => this.plans[depId] !== this.plans[planB.dependencies[i]],
      )
    ) {
      return false;
    }

    return true;
  }

  /**
   * Implements the `OptimizePlan` algorithm.
   */
  private optimizePlan(plan: Plan): Plan {
    const peers = this.plans.filter(
      (potentialPeer) =>
        potentialPeer.id !== plan.id && this.isPeer(plan, potentialPeer),
    );
    return plan.optimize(peers);
  }

  /**
   * Implements the `MarkPlanActive` algorithm.
   */
  private markPlanActive(plan: Plan, activePlans: Set<Plan>): void {
    if (activePlans.has(plan)) {
      return;
    }
    activePlans.add(plan);
    for (let i = 0, l = plan.dependencies.length; i < l; i++) {
      const id = plan.dependencies[i];
      this.markPlanActive(this.plans[id], activePlans);
    }
    for (let i = 0, l = plan.children.length; i < l; i++) {
      const id = plan.children[i];
      this.markPlanActive(this.plans[id], activePlans);
    }
  }

  /**
   * Implements the `TreeShakePlans` algorithm.
   */
  private treeShakePlans(): void {
    const activePlans = new Set<Plan>();

    for (const pathIdentity in this.planIdByPathIdentity) {
      const planId = this.planIdByPathIdentity[pathIdentity];
      assert.ok(
        planId != null,
        `Could not find the planId for path identity '${pathIdentity}'`,
      );
      const plan = this.plans[planId];
      if (isDev) {
        assert.ok(plan, `Could not find plan for identifier '${planId}'`);
      }
      this.markPlanActive(plan, activePlans);
    }

    for (let i = 0, l = this.plans.length; i < l; i++) {
      const plan = this.plans[i];
      if (!activePlans.has(plan)) {
        // We're going to delete this plan. Theoretically nothing can reference
        // it, so it should not cause any issues. If it does, it's due to a
        // programming bug somewhere where we're referencing a plan that hasn't
        // been added to the relevant dependencies/children. As such; I'm going
        // to bypass TypeScript here and delete the node whilst still letting
        // TypeScript guarantee it exists - better that the user gets a runtime
        // error trying to use it rather than using a nonsense plan.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.plans[i] = null as any;
      }
    }
  }

  /**
   * Implements the `FinalizePlans` and `FinalizePlan` algorithms.
   */
  private finalizePlans(): void {
    const distinctActivePlansInReverseOrder = new Set<Plan>();
    for (let i = this.plans.length - 1; i >= 0; i--) {
      const plan = this.plans[i];
      if (plan !== null) {
        globalState.pathIdentity = plan.pathIdentity;
        // checking the following would be redundant:
        // if (!distinctActivePlansInReverseOrder.has(plan))
        distinctActivePlansInReverseOrder.add(plan);
      }
    }
    for (const plan of distinctActivePlansInReverseOrder) {
      plan.finalize();
      assertFinalized(plan);
    }
  }

  //----------------------------------------

  public newBatch(pathIdentity: string, crystalContext: CrystalContext): Batch {
    const planId = this.planIdByPathIdentity[pathIdentity];
    assert.ok(
      planId != null,
      `Could not find the planId for path identity '${pathIdentity}'`,
    );
    const plan = this.plans[planId];
    assert.ok(
      plan,
      `Could not find the plan with id '${planId}' at '${pathIdentity}'`,
    );
    const batch: Batch = {
      pathIdentity,
      crystalContext,
      plan,
      entries: [],
    };
    return batch;
  }

  /**
   * Implements `NewCrystalContext`.
   */
  public newCrystalContext(
    variableValues: {
      [variableName: string]: unknown;
    },
    context: object,
    rootValue: unknown,
  ): CrystalContext {
    const rootId = uid();
    debug("Root id is %c", rootId);
    const crystalContext: CrystalContext = {
      resultByIdByPlanId: Object.assign(Object.create(null), {
        // TODO: maybe we should populate the initial values here rather than
        // calling populateValuePlan? Will need to research V8 HiddenClass
        // performance again.
      }),
      metaByPlanId: Object.create(null),
      rootId,
    };
    /*@__INLINE__*/ populateValuePlan(
      crystalContext,
      this.variableValuesPlan,
      rootId,
      EMPTY_INDEXES,
      variableValues,
      "variableValues",
    );
    /*@__INLINE__*/ populateValuePlan(
      crystalContext,
      this.contextPlan,
      rootId,
      EMPTY_INDEXES,
      context,
      "context",
    );
    /*@__INLINE__*/ populateValuePlan(
      crystalContext,
      this.rootValuePlan,
      rootId,
      EMPTY_INDEXES,
      rootValue,
      "rootValue",
    );
    return crystalContext;
  }

  /**
   * Implements `GetBatch`.
   */
  public getBatch(
    pathIdentity: string,
    parentObject: unknown,
    variableValues: {
      [variableName: string]: unknown;
    },
    context: object,
    rootValue: unknown,
  ): Batch {
    let batch = this.batchByPathIdentity[pathIdentity];
    if (!batch) {
      const crystalContext = isCrystalObject(parentObject)
        ? parentObject[$$crystalContext]
        : this.newCrystalContext(variableValues, context, rootValue);
      batch = this.newBatch(pathIdentity, crystalContext);
      // TypeScript hack
      const definitelyBatch: Batch = batch;
      this.batchByPathIdentity[pathIdentity] = definitelyBatch;
      // (Note: when batch is executed it will delete itself from aether.batchByPathIdentity.)
      setTimeout(
        () =>
          this.executeBatch(definitelyBatch, crystalContext).catch((e) => {
            // This should not be able to happen because executeBatch contains the try/catch.
            console.error(
              `GraphileInternalError<cd7c157b-9f20-432d-8716-7ff052acd1fd>: ${e.message}`,
            );
          }),
        0,
      );
    }
    return batch;
  }

  /**
   * Implements `ExecuteBatch`.
   *
   * TODO: we can optimise this to not be `async` (only return a promise when
   * necessary).
   */
  public async executeBatch(
    batch: Batch,
    crystalContext: CrystalContext,
  ): Promise<void> {
    // This guarantees nothing else will be added to the batch
    delete this.batchByPathIdentity[batch.pathIdentity];
    const { entries, plan } = batch;
    const l = entries.length;
    const crystalObjects: CrystalObject<any>[] = new Array(l);
    const deferredResults: Deferred<any>[] = new Array(l);
    for (let i = 0; i < l; i++) {
      const [crystalObject, deferredResult] = entries[i];
      crystalObjects[i] = crystalObject;
      deferredResults[i] = deferredResult;
    }
    try {
      assert.ok(plan, "No plan in batch?!");
      const resultsPromise = this.executePlan(
        plan,
        crystalContext,
        crystalObjects,
      );
      const results = isPromise(resultsPromise)
        ? await resultsPromise
        : resultsPromise;
      if (isDev) {
        assert.ok(
          Array.isArray(results),
          "Expected plan execution to return an array",
        );
        assert.equal(
          results.length,
          l,
          "Expected plan execution result to have same length as input objects",
        );
      }
      for (let i = 0; i < l; i++) {
        deferredResults[i].resolve(results[i]);
      }
    } catch (e) {
      for (let i = 0; i < l; i++) {
        deferredResults[i].reject(e);
      }
    }
  }

  /**
   * Implements `ExecutePlan`.
   */
  private async executePlan(
    plan: Plan,
    crystalContext: CrystalContext,
    crystalObjects: CrystalObject<any>[],
    visitedPlans = new Set<Plan>(),
  ): Promise<any[]> {
    if (isDev) {
      assert.ok(
        plan,
        `executePlan was called but it was not passed a plan to execute, instead '${inspect(
          plan,
        )}'`,
      );
    }
    if (visitedPlans.has(plan)) {
      throw new Error("Plan execution recursion error");
    }
    visitedPlans.add(plan);
    let resultById = crystalContext.resultByIdByPlanId[plan.id];
    if (!resultById) {
      resultById = Object.create(null) as Record<symbol, any>;
      crystalContext.resultByIdByPlanId[plan.id] = resultById;
    }
    const pendingCrystalObjects = []; // Length unknown
    const pendingCrystalObjectsIndexes = []; // Same length as pendingCrystalObjects
    const crystalObjectCount = crystalObjects.length;
    const result = new Array(crystalObjectCount);
    for (let i = 0; i < crystalObjectCount; i++) {
      const crystalObject = crystalObjects[i];
      const id = crystalObject[$$idByPathIdentity][plan.parentPathIdentity];
      const indexes =
        crystalObject[$$indexesByPathIdentity][plan.parentPathIdentity];
      if (id && indexes) {
        const indexesStr = indexes.join(",");
        debug(
          "Looking for id %c, indexes %c for plan %c in resultById %c",
          id,
          indexes,
          plan.id,
          resultById,
        );
        if (resultById[id]?.has(indexesStr)) {
          const previousResult = resultById[id].get(indexesStr);
          const innerIndexes =
            crystalObject[$$indexesByPathIdentity][plan.pathIdentity];

          /*
           * ### What does it mean if innerIndexes is not set?
           *
           * We get `$$indexesByPathIdentity` from the _parent_ crystal object,
           * so it represents only the parent details. Consider a query such as
           *
           * ```graphql
           * { forums { messages { body } } }
           * ```
           *
           * Imagine the plan for `body` was quite complex:
           *
           * ```ts
           * body: {
           *   type: GraphQLString,
           *   plan($message) {
           *     const $id = $message.get('id');
           *     const $revision = new PgClassSelectPlan(messageRevisions, ... $id ..., single=true);
           *     const $text = $revision.get('body');
           *     const $formatted = new FancyAsynchronousFormatterPlan($text);
           *     return $formatted;
           *   },
           * }
           * ```
           *
           * These plans are dependent on each other, but they're all executed
           * in the context of the current field. Since `crystalObject`
           * represents the parent field (i.e. `$message` above represents the
           * nth entry in the list returned from the `messages` field), it does
           * not contain an `$$indexesByPathIdentity` entry for the current
           * `pathIdentity`.
           *
           * It turns out this is not a concern. All of these plans depend on
           * the full result of the previous plan - not a specific index within
           * it - the only plan where the indexes matter is the one that the
           * plan function returns. Thus we just skip calling `atIndexes` if
           * the indexes for the pathIdentity are not known, and everything
           * works as designed.
           */
          result[i] = innerIndexes
            ? atIndexes(previousResult, innerIndexes)
            : previousResult;

          debug(
            `ExecutePlan(%s) result %s for %s (using id: %c/%s) was found: %o`,
            plan,
            i,
            crystalObject,
            id,
            indexes,
            result[i],
          );
          continue;
        } else {
          debug(
            `ExecutePlan(%s) no result for %s (using id: %c/%s) (%c)`,
            plan,
            crystalObject,
            id,
            indexes,
            resultById,
          );
        }
      } else {
        throw new Error(
          `Crystal error: could not find id/indexes for ${plan.parentPathIdentity} in ${crystalObject}`,
        );
      }
      pendingCrystalObjects.push(crystalObject);
      pendingCrystalObjectsIndexes.push(i);
    }
    const pendingCrystalObjectsLength = pendingCrystalObjects.length;
    if (pendingCrystalObjectsLength > 0) {
      const dependenciesCount = plan.dependencies.length;
      const dependencyValuesList = new Array(dependenciesCount);

      for (let i = 0; i < dependenciesCount; i++) {
        const dependencyPlanId = plan.dependencies[i];
        let dependencyPlan = this.plans[dependencyPlanId];
        if (isDev) {
          assert.ok(
            dependencyPlan,
            `Expected plan dependency '${i}' for '${plan}' to be a plan, instead found '${inspect(
              dependencyPlan,
            )}'`,
          );
        }
        let listDepth = 0;
        while (dependencyPlan instanceof __ListItemPlan) {
          listDepth++;
          dependencyPlan = this.plans[dependencyPlan.dependencies[0]];
        }
        const dependencyResult = await this.executePlan(
          dependencyPlan,
          crystalContext,
          pendingCrystalObjects,
          visitedPlans,
        );
        if (listDepth > 0) {
          const arr = new Array(pendingCrystalObjectsLength);
          for (
            let pendingCrystalObjectIndex = 0;
            pendingCrystalObjectIndex < pendingCrystalObjectsLength;
            pendingCrystalObjectIndex++
          ) {
            const pendingCrystalObject =
              pendingCrystalObjects[pendingCrystalObjectIndex];
            const indexes =
              pendingCrystalObject[$$indexesByPathIdentity][
                dependencyPlan.pathIdentity
              ];
            if (!indexes) {
              throw new Error(
                "Attempted to access __ListItemPlan with unknown indexes",
              );
            }
            if (indexes.length !== listDepth) {
              throw new Error(
                `Attempted to access __ListItemPlan with incorrect list depth (${indexes.length} != ${listDepth})`,
              );
            }
            const item = /*!__INLINE__*/ atIndexes(dependencyResult, indexes);
            arr[pendingCrystalObjectIndex] = item;
          }
          dependencyValuesList[i] = arr;
        } else {
          // Optimisation
          dependencyValuesList[i] = dependencyResult;
        }
      }

      const values = new Array(pendingCrystalObjectsLength);

      for (let i = 0; i < pendingCrystalObjectsLength; i++) {
        const entry = new Array(dependenciesCount);
        for (let j = 0; j < dependenciesCount; j++) {
          const dependencyValues = dependencyValuesList[j];
          entry[j] = dependencyValues[i];
        }
        values[i] = entry;
      }

      let meta = crystalContext.metaByPlanId[plan.id];
      if (!meta) {
        meta = Object.create(null) as object;
        crystalContext.metaByPlanId[plan.id] = meta;
      }
      // Note: the `execute` method on plans is responsible for memoizing
      // results into `meta`.
      if (plan instanceof __ListItemPlan) {
        throw new Error(
          "Should never attempt to execute __ListItemPlan; that should be handled whilst evaluating dependencies",
        );
      }
      const pendingResults = await plan.execute(values, meta);
      if (isDev) {
        assert.ok(
          Array.isArray(pendingResults),
          "Expected plan execution to return a list",
        );
        assert.strictEqual(
          pendingResults.length,
          pendingCrystalObjectsLength,
          "Expected plan execution to return same number of results as inputs",
        );
      }
      for (let i = 0; i < pendingCrystalObjectsLength; i++) {
        const crystalObject = pendingCrystalObjects[i];
        const pendingResult = pendingResults[i];
        const j = pendingCrystalObjectsIndexes[i];

        const id = crystalObject[$$idByPathIdentity][plan.parentPathIdentity];
        const indexes =
          crystalObject[$$indexesByPathIdentity][plan.parentPathIdentity];
        if (!id || !indexes) {
          throw new Error(
            `Crystal error: could not find id/indexes for ${plan.parentPathIdentity} in ${crystalObject}`,
          );
        }

        const innerIndexes =
          crystalObject[$$indexesByPathIdentity][plan.pathIdentity];

        // To understand this, see the comment about atIndexes earlier within
        // `executePlan`.
        result[j] = innerIndexes
          ? atIndexes(pendingResult, innerIndexes)
          : pendingResult;

        if (!resultById[id]) {
          resultById[id] = new Map();
        }
        resultById[id].set(indexes.join(), result[j]);
      }

      debug(
        `ExecutePlan(%s): wrote results for %s: %c`,
        plan,
        pendingCrystalObjects.join(", "),
        resultById,
      );
    }
    if (isDev) {
      debug(`ExecutePlan(%s): complete; results: %o`, plan, result);
    }
    return result;
  }

  /**
   * Implements `GetValuePlanId`.
   */
  getValuePlanId(
    crystalContext: CrystalContext,
    valuePlan: __ValuePlan,
    object: object,
    pathIdentity: string,
  ): UniqueId {
    assert.ok(
      valuePlan instanceof __ValuePlan,
      "Expected getValuePlanId to be called with a __ValuePlan",
    );
    assert.ok(
      object != null,
      "object passed to getValuePlanId cannot be null; consider using ROOT_VALUE_OBJECT",
    );
    let valueIdByObject = this.valueIdByObjectByPlanId[valuePlan.id];
    if (!valueIdByObject) {
      valueIdByObject = new WeakMap();
      valueIdByObject.set(ROOT_VALUE_OBJECT, crystalContext.rootId);
      this.valueIdByObjectByPlanId[valuePlan.id] = valueIdByObject;
    }
    const key = object;
    let valueId = valueIdByObject.get(key);
    if (valueId === undefined) {
      valueId = uid();
      debug(
        "No id for object %c (parent object of %s) against plan %s, generated %c",
        key,
        pathIdentity,
        valuePlan,
        valueId,
      );
      valueIdByObject.set(key, valueId);
      populateValuePlan(
        crystalContext,
        valuePlan,
        valueId,
        EMPTY_INDEXES, // TODO: this seems wrong
        key,
        "parent",
      );
    }
    return valueId;
  }
}

/**
 * Implements `PopulateValuePlan`
 */
function populateValuePlan(
  crystalContext: CrystalContext,
  valuePlan: Plan,
  valueId: UniqueId,
  indexes: readonly number[],
  object: any,
  label: string,
): void {
  let resultById = crystalContext.resultByIdByPlanId[valuePlan.id];
  if (!resultById) {
    resultById = Object.create(null) as Record<symbol, any>;
    crystalContext.resultByIdByPlanId[valuePlan.id] = resultById;
  }
  resultById[valueId] = new Map<string, any>();
  const map = resultById[valueId];
  map.set(indexes.join(), object ?? ROOT_VALUE_OBJECT);
  debug("Populated value plan for %s: %c", label, resultById);
}
