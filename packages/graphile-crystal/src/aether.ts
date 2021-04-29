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
} from "graphql";
import {
  Plan,
  __TrackedObjectPlan,
  __ValuePlan,
  assertFinalized,
  PolymorphicPlan,
  ArgumentPlan,
} from "./plan";
import { graphqlCollectFields, getDirective } from "./graphqlCollectFields";
import { InputPlan, inputPlan, InputObjectPlan } from "./input";
import { defaultValueToValueNode, uid, UniqueId } from "./utils";
import {
  graphqlMergeSelectionSets,
  typesUsedInSelections,
  interfaceTypeHasNonIntrospectionFieldQueriedInSelections,
} from "./graphqlMergeSelectionSets";
import { Batch, CrystalContext } from "./interfaces";

type TrackedArguments = { [key: string]: InputPlan };

/**
 * Implements the `MarkPlanActive` algorithm.
 */
function markPlanActive(plan: Plan, activePlans: Set<Plan>): void {
  if (activePlans.has(plan)) {
    return;
  }
  activePlans.add(plan);
  for (let i = 0, l = plan.dependencies.length; i < l; i++) {
    markPlanActive(plan.dependencies[i], activePlans);
  }
  for (let i = 0, l = plan.children.length; i < l; i++) {
    markPlanActive(plan.children[i], activePlans);
  }
}

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

/**
 * Implements the `NewAether` algorithm.
 */
export class Aether {
  public maxGroupId = 0;
  public groupId = this.maxGroupId;
  public readonly plans: Plan[] = [];
  public readonly batchByPathIdentity: {
    [pathIdentity: string]: Batch;
  } = Object.create(null);
  public readonly planIdByPathIdentity: {
    [pathIdentity: string]: number;
  } = Object.create(null);
  public readonly valueIdByObjectByPlanId: {
    [planId: number]: WeakMap<object, symbol>;
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
    public readonly context: {
      [key: string]: unknown;
    },
    public readonly rootValue: unknown,
  ) {
    this.variableValuesPlan = new __ValuePlan(this);
    // TODO: this should use a more intelligent tracked object plan since the variables are strongly typed (unlike context/rootValue).
    this.trackedVariableValuesPlan = new __TrackedObjectPlan(
      this,
      variableValues,
      this.variableValuesPlan,
      this.variableValuesConstraints,
    );
    this.contextPlan = new __ValuePlan(this);
    this.trackedContextPlan = new __TrackedObjectPlan(
      this,
      context,
      this.contextPlan,
      this.contextConstraints,
    );
    this.rootValuePlan = new __ValuePlan(this);
    this.trackedRootValuePlan = new __TrackedObjectPlan(
      this,
      rootValue,
      this.rootValuePlan,
      this.rootValueConstraints,
    );
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
  }

  /**
   * Implements the `PlanAetherQuery` algorithm.
   */
  planQuery(): void {
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
  planMutation(): void {
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
  planSubscription(): void {
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
  planSelectionSet(
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
        plan = new __ValuePlan(this);
      }
      this.planIdByPathIdentity[pathIdentity] = plan.id;
      const unwrappedFieldType = getNamedType(fieldType);
      // TODO:  see the list depth of fieldType and assert that the data to be returned has the same depth if we can.
      const isObjectType = unwrappedFieldType instanceof GraphQLObjectType;
      const isInterfaceType =
        unwrappedFieldType instanceof GraphQLInterfaceType;
      const isUnionType = unwrappedFieldType instanceof GraphQLUnionType;
      if (isObjectType || isInterfaceType || isUnionType) {
        const subSelectionSet = graphqlMergeSelectionSets(fields);
        if (isObjectType) {
          this.planSelectionSet(
            pathIdentity,
            plan,
            unwrappedFieldType as GraphQLObjectType,
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
            const unionType = unwrappedFieldType as GraphQLUnionType;
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
            const interfaceType = unwrappedFieldType as GraphQLInterfaceType;
            // If we reference non-introspection fields on the interface type (or
            // any of the interface types it implements) then we need to plan for
            // every single object type that implements this interface; otherwise
            // we only need to plan the reachable types.
            const implementations = this.schema.getImplementations(
              interfaceType,
            ).objects;
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
      this.groupId = oldGroupId;
    }
  }

  /**
   * Implements the `PlanFieldArguments` and `PlanFieldArgument` algorithms.
   */
  planFieldArguments(
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
   * Note: we are only expecting to {PlanInput()} for objects or lists thereof, not scalars.
   */
  planInput(
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
  planInputFields(
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
  planInputField(
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
  getTrackedArguments(
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
   * Implements the `OptimizePlans` algorithm.
   */
  optimizePlans(): void {
    for (let i = this.plans.length - 1; i >= 0; i--) {
      this.plans[i] = this.optimizePlan(this.plans[i]);
    }
  }

  /**
   * Implements the `OptimizePlan` algorithm.
   */
  optimizePlan(plan: Plan): Plan {
    return plan;
  }

  /**
   * Implements the `TreeShakePlans` algorithm.
   */
  treeShakePlans(): void {
    const activePlans = new Set<Plan>();

    for (const pathIdentity in this.planIdByPathIdentity) {
      const planId = this.planIdByPathIdentity[pathIdentity];
      const plan = this.plans[planId];
      markPlanActive(plan, activePlans);
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
  finalizePlans(): void {
    const distinctActivePlansInReverseOrder = new Set<Plan>();
    for (let i = this.plans.length - 1; i >= 0; i--) {
      const plan = this.plans[i];
      if (plan !== null) {
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

  newBatch(pathIdentity: string, crystalContext: CrystalContext): Batch {
    const planId = this.planIdByPathIdentity[pathIdentity];
    const plan = this.plans[planId];
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
  newCrystalContext(
    variableValues: {
      [variableName: string]: unknown;
    },
    context: {
      [key: string]: unknown;
    },
    rootValue: unknown,
  ): CrystalContext {
    const rootId = uid();
    const crystalContext: CrystalContext = {
      resultByIdByPlanId: {
        // TODO: maybe we should populate the initial values here rather than
        // calling populateValuePlan? Will need to research V8 HiddenClass
        // performance again.
      },
      metaByPlanId: {},
      rootId,
    };
    /*@__INLINE__*/ populateValuePlan(
      crystalContext,
      this.variableValuesPlan,
      rootId,
      variableValues,
    );
    /*@__INLINE__*/ populateValuePlan(
      crystalContext,
      this.contextPlan,
      rootId,
      context,
    );
    /*@__INLINE__*/ populateValuePlan(
      crystalContext,
      this.rootValuePlan,
      rootId,
      rootValue,
    );
    return crystalContext;
  }

  /**
   * Implements `GetBatch`.
   */
  getBatch(
    pathIdentity: string,
    parentObject: unknown,
    variableValues: {
      [variableName: string]: unknown;
    },
    context: {
      [key: string]: unknown;
    },
    rootValue: unknown,
  ): Batch {
    const batch = this.batchByPathIdentity[pathIdentity];
    if (!batch) {
      const crystalContext = isCrystalWrappedValue(parentObject)
        ? parentObject[$$crystalContext]
        : this.newCrystalContext(variableValues, context, rootValue);
      const batch = this.newBatch(pathIdentity, crystalContext);
      this.batchByPathIdentity[pathIdentity] = batch;
      // (Note: when batch is executed it will delete itself from aether.batchByPathIdentity.)
      setTimeout(() => this.executeBatch(batch, crystalContext), 0);
    }
    return batch;
  }
}

/**
 * Implements `PopulateValuePlan`
 */
function populateValuePlan(
  crystalContext: CrystalContext,
  valuePlan: Plan,
  valueId: UniqueId,
  object: any,
): void {
  crystalContext.resultByIdByPlanId[valuePlan.id][valueId] = object;
}
