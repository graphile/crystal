import chalk from "chalk";
import debugFactory from "debug";
import type {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLField,
  GraphQLInputField,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLOutputType,
  GraphQLSchema,
  OperationDefinitionNode,
  SelectionNode,
} from "graphql";
import { getNamedType, isObjectType, isScalarType } from "graphql";
import { isInterfaceType, isUnionType } from "graphql";
import {
  assertListType,
  assertObjectType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLUnionType,
  isInputObjectType,
  isListType,
  isNonNullType,
} from "graphql";
import { inspect } from "util";

import * as assert from "./assert";
import { GLOBAL_PATH, ROOT_PATH } from "./constants";
import type { Constraint } from "./constraints";
import type { Deferred } from "./deferred";
import { isDev } from "./dev";
import { globalState } from "./global";
import { getDirective, graphqlCollectFields } from "./graphqlCollectFields";
import {
  graphqlMergeSelectionSets,
  interfaceTypeHasNonIntrospectionFieldQueriedInSelections,
  typesUsedInSelections,
} from "./graphqlMergeSelectionSets";
import type { InputPlan } from "./input";
import { InputObjectPlan, inputPlan } from "./input";
import type {
  BaseGraphQLContext,
  BaseGraphQLRootValue,
  BaseGraphQLVariables,
  Batch,
  CrystalContext,
  CrystalLayerObject,
  CrystalObject,
  IndexByListItemPlanId,
  TrackedArguments,
} from "./interfaces";
import {
  $$concreteData,
  $$concreteType,
  $$crystalContext,
  $$indexByListItemPlanId,
} from "./interfaces";
import type { ModifierPlan, PolymorphicPlan } from "./plan";
import {
  assertArgumentsFinalized,
  assertExecutablePlan,
  assertFinalized,
  assertModifierPlan,
  ExecutablePlan,
} from "./plan";
import {
  __ListItemPlan,
  __TrackedObjectPlan,
  __ValuePlan,
  assertListCapablePlan,
} from "./plans";
import { assertPolymorphicData } from "./polymorphic";
import { newCrystalObject } from "./resolvers";
import type { UniqueId } from "./utils";
import {
  arraysMatch,
  defaultValueToValueNode,
  ROOT_VALUE_OBJECT,
  uid,
} from "./utils";

const EMPTY_INDEXES = Object.freeze([] as number[]);

// For logging indentation
let depth = 0;

const debugAether = debugFactory("crystal:aether");
const debugPlan = debugAether.extend("plan");
const debugPlanVerbose_ = debugPlan.extend("verbose");
const debugExecute = debugAether.extend("plan");
const debugExecuteVerbose_ = debugPlan.extend("verbose");

const depthWrap = (debugFn: debugFactory.Debugger) =>
  Object.assign(
    (t: string, ...args: any[]) => debugFn("  ".repeat(depth) + t, ...args),
    debugFn,
  );
const debugPlanVerbose = depthWrap(debugPlanVerbose_);
const debugExecuteVerbose = depthWrap(debugExecuteVerbose_);

function assertPolymorphicPlan(
  plan: ExecutablePlan | PolymorphicPlan,
  pathIdentity: string,
): asserts plan is PolymorphicPlan {
  assert.ok(
    "planForType" in plan,
    `Expected plan for interface field to be polymorphic at ${pathIdentity}, found ${plan}.`,
  );
  assert.strictEqual(
    typeof plan.planForType,
    "function",
    `Expected property 'planForType' for interface field plan ${plan} to be a function at ${pathIdentity}.`,
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
export class Aether<
  TVariables extends BaseGraphQLVariables = BaseGraphQLVariables,
  TContext extends BaseGraphQLContext = BaseGraphQLContext,
  TRootValue extends BaseGraphQLRootValue = BaseGraphQLRootValue,
> {
  public maxGroupId = 0;
  public groupId = this.maxGroupId;
  public readonly plans: ExecutablePlan[] = [];

  /**
   * This value is ethemeral, it only contains values whilst a specific field
   * is being planned.
   */
  public readonly modifierPlans: ModifierPlan<any>[] = [];

  public readonly batchByPathIdentity: {
    [pathIdentity: string]: Batch | undefined;
  } = Object.create(null);

  /**
   * The plan by path identity is the plan that will return the results that
   * the resolver at that plan identity should return.
   */
  public readonly planIdByPathIdentity: {
    [pathIdentity: string]: number | undefined;
  };

  /**
   * The itemPlan by path identity is like planIdByPathIdentity **except** it
   * factors in list indexes, i.e. it's the plan for the value that child
   * fields would receive as their parent object. If the parent returned an
   * object it'll be the same as planIdByPathIdentity but if the parent
   * returned a list of objects it would be a `__ListItemPlan`.
   */
  public readonly itemPlanIdByPathIdentity: {
    [pathIdentity: string]: number | undefined;
  };
  public readonly valueIdByObjectByPlanId: {
    [planId: number]: WeakMap<object, UniqueId> | undefined;
  } = Object.create(null);
  public readonly variableValuesConstraints: Constraint[] = [];
  public readonly variableValuesPlan: __ValuePlan<TVariables>;
  public readonly trackedVariableValuesPlan: __TrackedObjectPlan<TVariables>;
  public readonly contextConstraints: Constraint[] = [];
  public readonly contextPlan: __ValuePlan<TContext>;
  public readonly trackedContextPlan: __TrackedObjectPlan<TContext>;
  public readonly rootValueConstraints: Constraint[] = [];
  public readonly rootValuePlan: __ValuePlan<TRootValue>;
  public readonly trackedRootValuePlan: __TrackedObjectPlan<TRootValue>;
  public readonly operationType: "query" | "mutation" | "subscription";
  public readonly queryTypeName: string;

  constructor(
    public readonly schema: GraphQLSchema,
    // Note: whereas the `NewAether` algorithm refers to `document` and
    // `operationName`; we use `operation` and `fragments` because they're
    // easier to access in GraphQL.js
    public readonly operation: OperationDefinitionNode,
    public readonly fragments: {
      [fragmentName: string]: FragmentDefinitionNode;
    },
    public readonly variableValues: TVariables,
    public readonly context: TContext,
    public readonly rootValue: TRootValue,
  ) {
    const queryType = this.schema.getQueryType();
    if (!queryType) {
      throw new Error(
        "This GraphQL schema does not support queries, it cannot be used.",
      );
    }
    this.queryTypeName = queryType.name;
    globalState.aether = this;
    globalState.parentPathIdentity = GLOBAL_PATH;
    this.variableValuesPlan = new __ValuePlan();
    debugPlan("Constructed variableValuesPlan %s", this.variableValuesPlan);
    // TODO: this should use a more intelligent tracked object plan since the variables are strongly typed (unlike context/rootValue).
    this.trackedVariableValuesPlan = new __TrackedObjectPlan(
      variableValues,
      this.variableValuesPlan,
      this.variableValuesConstraints,
    );
    debugPlanVerbose(
      "Constructed trackedVariableValuesPlan %s",
      this.trackedVariableValuesPlan,
    );
    this.contextPlan = new __ValuePlan();
    debugPlan("Constructed contextPlan %s", this.contextPlan);
    this.trackedContextPlan = new __TrackedObjectPlan(
      context,
      this.contextPlan,
      this.contextConstraints,
    );
    debugPlanVerbose(
      "Constructed trackedContextPlan %s",
      this.trackedContextPlan,
    );
    this.rootValuePlan = new __ValuePlan();
    debugPlan("Constructed rootValuePlan %s", this.rootValuePlan);
    this.trackedRootValuePlan = new __TrackedObjectPlan(
      rootValue,
      this.rootValuePlan,
      this.rootValueConstraints,
    );
    debugPlanVerbose(
      "Constructed trackedRootValuePlan %s",
      this.trackedRootValuePlan,
    );
    this.planIdByPathIdentity = Object.assign(Object.create(null), {
      [ROOT_PATH]: this.rootValuePlan.id,
    });
    this.itemPlanIdByPathIdentity = Object.assign(Object.create(null), {
      [ROOT_PATH]: this.rootValuePlan.id,
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

    // Helpfully check plans don't do forbidden things.
    this.validatePlans();

    // Log the initial plan map
    this.logPlansByPath();

    // Get rid of temporary plans
    this.treeShakePlans();

    // Squish plans together; this should result in no changes because plans
    // are deduplicated during creation.
    this.deduplicatePlans();

    // Get rid of unneeded plans
    this.treeShakePlans();

    // Log the plan map after deduplication
    this.logPlansByPath();

    // Replace/inline/optimise plans
    this.optimizePlans();

    // Get rid of plans that are no longer needed after optimising
    this.treeShakePlans();

    // Plans are expected to execute later; they may take steps here to prepare
    // themselves (e.g. compiling SQL queries ahead of time).
    this.finalizePlans();

    // Log the plan now we're all done
    this.logPlansByPath();

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
      ROOT_PATH,
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
      ROOT_PATH,
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
        this.trackedRootValuePlan,
        subscribePlan,
      );
      this.planSelectionSet(
        ROOT_PATH,
        subscribePlan,
        rootType,
        selectionSet.selections,
      );
    } else {
      const subscribePlan = this.trackedRootValuePlan;
      this.planSelectionSet(
        ROOT_PATH,
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
    parentPlan: ExecutablePlan,
    objectType: GraphQLObjectType,
    selections: ReadonlyArray<SelectionNode>,
    isSequential = false,
  ): void {
    assertObjectType(objectType);
    globalState.parentPathIdentity = path;
    const groupedFieldSet = graphqlCollectFields(this, objectType, selections);
    const objectTypeFields = objectType.getFields();
    for (const [responseKey, fields] of groupedFieldSet.entries()) {
      const oldGroupId = this.groupId;
      const pathIdentity = `${path}>${objectType.name}.${responseKey}`;
      const field = fields[0];
      const fieldName = field.name.value;
      if (fieldName.startsWith("__")) {
        // Introspection field, skip
        continue;
      }

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
      let plan: ExecutablePlan | PolymorphicPlan;
      if (typeof planResolver === "function") {
        const oldPlansLength = this.plans.length;
        const trackedArguments = this.getTrackedArguments(objectType, field);
        plan = planResolver(
          parentPlan,
          trackedArguments,
          this.trackedContextPlan,
        );
        assertExecutablePlan(plan, pathIdentity);
        this.planFieldArguments(
          objectType,
          objectField,
          field,
          trackedArguments,
          parentPlan,
          plan,
        );
        const newPlansLength = this.plans.length;
        debugPlanVerbose(
          "Created %o new plans whilst processing %p",
          newPlansLength - oldPlansLength,
          pathIdentity,
        );

        const newPlans = new Set(
          this.plans.slice(oldPlansLength).filter(isNotNullish),
        );

        for (const newPlan of newPlans) {
          // If the newPlan still exists, finalize it with respect to arguments.
          if (this.plans[newPlan.id] === newPlan) {
            // TODO: rename finalizeArguments; maybe argumentsFinalized or lockParameters or lock?
            newPlan.finalizeArguments();
            assertArgumentsFinalized(newPlan);
          }
        }

        // Now that the field has been planned (including arguments, but NOT
        // including selection set) we can deduplicate it to see if any of its
        // peers are identical.
        this.deduplicatePlans(oldPlansLength);
      } else {
        // Note: this is populated in GetValuePlanId
        plan = new __ValuePlan();
      }

      this.planIdByPathIdentity[pathIdentity] = plan.id;

      // Now we're building the child plans, the parentPathIdentity becomes actually our identity.
      globalState.parentPathIdentity = pathIdentity;
      const itemPlan = this.planSelectionSetForType(
        fieldType,
        fields,
        pathIdentity,
        plan,
      );
      this.itemPlanIdByPathIdentity[pathIdentity] = itemPlan.id;

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
    plan: ExecutablePlan<any>,
    depth = 0,
  ): ExecutablePlan<any> {
    if (fieldType instanceof GraphQLNonNull) {
      // TODO: we could implement a __NonNullPlan in future; currently we just
      // defer that to GraphQL.js
      this.planSelectionSetForType(
        fieldType.ofType,
        fields,
        pathIdentity,
        plan,
        depth,
      );
      return plan;
    } else if (fieldType instanceof GraphQLList) {
      assertListCapablePlan(plan, pathIdentity);
      const listItemPlan = plan.listItem(new __ListItemPlan(plan, depth));
      this.planSelectionSetForType(
        fieldType.ofType,
        fields,
        pathIdentity,
        listItemPlan,
        depth + 1,
      );
      return listItemPlan;
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
        assertPolymorphicPlan(plan, pathIdentity);
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
          const implementations =
            this.schema.getImplementations(interfaceType).objects;
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
    return plan;
  }

  /**
   * Implements the `PlanFieldArguments` and `PlanFieldArgument` algorithms.
   */
  private planFieldArguments(
    _objectType: GraphQLObjectType,
    fieldSpec: GraphQLField<unknown, unknown>,
    _field: FieldNode,
    trackedArguments: TrackedArguments,
    parentPlan: ExecutablePlan,
    fieldPlan: ExecutablePlan,
  ): void {
    assert.strictEqual(
      this.modifierPlans.length,
      0,
      "Expected Aether.modifierPlans to be empty",
    );

    // Arguments are applied in the order that they are specified in the
    // schema, NOT the order that they are specified in the request.
    for (let i = 0, l = fieldSpec.args.length; i < l; i++) {
      const argSpec = fieldSpec.args[i];
      const argName = argSpec.name;
      const trackedArgumentValuePlan = trackedArguments[argName];
      if (trackedArgumentValuePlan !== undefined) {
        const planResolver = argSpec.extensions?.graphile?.plan;
        if (typeof planResolver === "function") {
          const argPlan = planResolver(
            parentPlan,
            fieldPlan,
            trackedArgumentValuePlan,
            this.trackedContextPlan,
          );
          if (argPlan != null) {
            assertModifierPlan(
              argPlan,
              `${_objectType.name}.${fieldSpec.name}(${argName}:)`,
            );

            this.planInput(argSpec.type, trackedArgumentValuePlan, argPlan);
          }
        }
      }
    }

    // Remove the modifier plans from aether and sort them ready for application.
    const plansToApply = this.modifierPlans
      .splice(0, this.modifierPlans.length)
      .reverse();

    // Apply the plans.
    for (let i = 0, l = plansToApply.length; i < l; i++) {
      plansToApply[i].apply();
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
    parentPlan: ExecutablePlan | ModifierPlan<any>,
  ): void {
    if (isNonNullType(inputType)) {
      this.planInput(inputType.ofType, trackedValuePlan, parentPlan);
    } else if (isListType(inputType)) {
      if (trackedValuePlan.evalIs(null)) {
        // parentPlan.null();
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
    } else if (isInputObjectType(inputType)) {
      if (trackedValuePlan.evalIs(null)) {
        // TODO: should we indicate to the parent that this is null as opposed to an empty object?
        return;
      }
      this.planInputFields(inputType, trackedValuePlan, parentPlan);
      return;
    } else {
      throw new Error(
        `Invalid plan; planInput called for unsupported type '${inspect(
          inputType,
        )}'.`,
      );
    }
  }

  /**
   * Implements `PlanInputFields` algorithm.
   */
  private planInputFields(
    inputObjectType: GraphQLInputObjectType,
    trackedValuePlan: InputPlan,
    parentPlan: ExecutablePlan | ModifierPlan<any>,
  ): void {
    assert.ok(
      trackedValuePlan instanceof InputObjectPlan,
      "Expected trackedValuePlan to be an InputObjectPlan",
    );
    const inputFieldSpecs = inputObjectType.getFields();
    // Input fields are applied in the order that they are specified in the
    // schema, NOT the order that they are specified in the request.
    for (const fieldName in inputFieldSpecs) {
      const inputFieldSpec = inputFieldSpecs[fieldName];
      if (trackedValuePlan.evalHas(fieldName)) {
        const trackedFieldValue = trackedValuePlan.get(fieldName);
        this.planInputField(
          inputObjectType,
          inputFieldSpec,
          trackedFieldValue,
          parentPlan,
        );
      }
    }
  }

  /**
   * Implements `PlanInputField` algorithm.
   */
  private planInputField(
    inputObjectType: GraphQLInputObjectType,
    inputField: GraphQLInputField,
    trackedValuePlan: InputPlan,
    parentPlan: ExecutablePlan | ModifierPlan<any>,
  ): void {
    const planResolver = inputField.extensions?.graphile?.plan;
    if (planResolver != null) {
      assert.strictEqual(
        typeof planResolver,
        "function",
        `Expected ${inputObjectType.name}.${inputField.name}'s 'extensions.graphile.plan' property to be a plan resolver function.`,
      );
      const inputFieldPlan = planResolver(
        parentPlan,
        trackedValuePlan,
        this.trackedContextPlan,
      );
      if (inputFieldPlan != null) {
        const inputFieldType = inputField.type;
        // Note: the unwrapped type of inputFieldType must be an input object.
        // TODO: assert this?
        this.planInput(inputFieldType, trackedValuePlan, inputFieldPlan);
      }
    } else {
      if (isDev) {
        console.warn(
          `Expected ${inputObjectType.name}.${inputField.name} to have an 'extensions.graphile.plan' function, but it does not.`,
        );
      }
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
    return trackedArgumentValues;
  }

  private validatePlans(): void {
    const errors: Error[] = [];
    for (let i = 0, l = this.plans.length; i < l; i++) {
      const plan = this.plans[i];
      const referencingPlanIsAllowed =
        // Required so that we can access the underlying value plan.
        plan instanceof __TrackedObjectPlan;
      if (!referencingPlanIsAllowed) {
        for (const key in plan) {
          const val = plan[key];
          if (val instanceof ExecutablePlan) {
            errors.push(
              new Error(
                `ERROR: ExecutablePlan ${plan} has illegal reference via property '${key}' to plan ${val}. You must not reference plans directly, instead use the plan id to reference the plan, and look the plan up in \`this.aether.plans[planId]\`. Failure to comply could result in subtle breakage during optimisation.`,
              ),
            );
          }
        }
      }
    }
    if (errors.length > 0) {
      console.error(errors.map((e) => e.message).join("\n"));
      throw errors[0];
    }
  }

  /**
   * Processes the plans making sure to process the leaves of the plan DAG
   * first and then working our way back up the graph to the root nodes.
   */
  private processPlans(
    actionDescription: string,
    order: "dependents-first" | "dependencies-first",
    callback: (plan: ExecutablePlan<any>) => ExecutablePlan<any>,
    startingAtPlanId = 0,
  ): void {
    depth = 0;
    const processed = new Set<ExecutablePlan>();
    const process = (plan: ExecutablePlan): void => {
      if (!plan) {
        return;
      }
      if (processed.has(plan)) {
        return;
      }
      // Process dependents first
      const first = new Set<number>();
      if (order === "dependents-first") {
        this.plans.forEach((possibleDependent) => {
          if (!possibleDependent) {
            return;
          }
          // Cannot just use the number since the number could be an alias
          const dependencies = possibleDependent.dependencies.map(
            (depId) => this.plans[depId],
          );
          if (dependencies.includes(plan)) {
            first.add(possibleDependent.id);
          }
        });
      } else {
        plan.dependencies.forEach((depId) => {
          const dependency = this.plans[depId];
          first.add(dependency.id);
        });
      }
      for (const depId of first) {
        const depPlan = this.plans[depId];
        if (depPlan && !processed.has(depPlan)) {
          debugPlanVerbose(
            `Before we can process %c we must process %c`,
            plan,
            depPlan,
          );
          depth++;
          process(depPlan);
          depth--;
        }
      }
      globalState.parentPathIdentity = plan.parentPathIdentity;
      let replacementPlan: ExecutablePlan;
      try {
        replacementPlan = callback(plan);
      } catch (e) {
        this.logPlans();
        console.error(
          `Error occurred whilst processing ${plan} in ${order} mode`,
        );
        throw e;
      }
      if (replacementPlan != plan) {
        // Replace all references to `plan` with `replacementPlan`
        for (let j = 0, m = this.plans.length; j < m; j++) {
          if (this.plans[j] && this.plans[j].id === plan.id) {
            this.plans[j] = replacementPlan;
          }
        }
      }
      processed.add(plan);
    };

    let plansAdded = 0;
    let l = this.plans.length;
    for (let i = startingAtPlanId; i < l; i++) {
      process(this.plans[i]);

      plansAdded += this.plans.length - l;

      // NOTE: whilst processing plans new plans may be added, thus we must loop
      // ascending and we must re-evaluate this.plans.length on each loop
      // iteration.
      if (isDev && plansAdded > 100000) {
        throw new Error(
          `Whilst processing plans as part of ${actionDescription}, ${plansAdded} new plans have been created... That seems like it's likely a bug in the relevant method of one of your plans. The last plan processed was ${
            this.plans[i]
          } and this created the following plans: ${this.plans
            .slice(i + 1)
            .join(",")}`,
        );
      }

      l = this.plans.length;
    }
  }

  /**
   * We split this out from optimizePlans, this gives us a chance to replace
   * nearly-duplicate plans with other existing plans (and adding the necessary
   * transforms); this means that by the time we come to optimize the plan tree
   * should already be simpler. For example if you have two plans at the same
   * level that both request row data from the same database table with the
   * same identifiers, `WHERE`, `LIMIT`, `OFFSET` and `ORDER BY`, but different
   * `SELECT`s we could merge the two plans together by replacing the latter
   * with the former and having the former SELECT additional fields, then
   * transform the results back to what our child plans would be expecting.
   */
  private deduplicatePlans(startingAtPlanId = 0): void {
    let replacements = 0;
    let loops = 0;
    let lastOptimizedPlan;

    // Keep optimising plans until there's no more replacements to be made.
    do {
      if (loops > 10000) {
        throw new Error(
          `deduplicatePlans has looped ${loops} times and is still substituting out plans; the plan.optimize method on ${lastOptimizedPlan} might be buggy.`,
        );
      }
      replacements = 0;
      this.processPlans(
        "deduplicatePlans",
        "dependencies-first",
        (plan) => {
          const replacementPlan = this.deduplicatePlan(plan);
          if (replacementPlan !== plan) {
            lastOptimizedPlan = replacementPlan;
            replacements++;
          }
          return replacementPlan;
        },
        startingAtPlanId,
      );
      loops++;
    } while (replacements > 0);
    debugPlan("ExecutablePlan deduplication complete after %o loops", loops);
  }

  /**
   * Implements the `OptimizePlans` algorithm. Note that we loop backwards
   * since later plans are dependent on earlier plans, so by starting at the
   * latest plans we can make sure that we know all our dependent's needs
   * before we optimise ourself.
   */
  private optimizePlans(): void {
    this.processPlans("optimizePlans", "dependents-first", (plan) =>
      this.optimizePlan(plan),
    );
  }

  private isPeer(planA: ExecutablePlan, planB: ExecutablePlan): boolean {
    // Can only merge if plan is of same type.
    if (planA.constructor !== planB.constructor) {
      return false;
    }

    // Can only merge if the plans exist at the same level (this can exit early
    // if the dependencies are significantly different).
    if (planA.parentPathIdentity !== planB.parentPathIdentity) {
      return false;
    }

    // Can only merge if the dependencies are the same.
    if (
      !arraysMatch(
        planA.dependencies,
        planB.dependencies,
        (depA, depB) => this.plans[depA] === this.plans[depB],
      )
    ) {
      return false;
    }

    return true;
  }

  /**
   * Finds suitable peers and passes them to the plan's deduplicate method (if
   * any found).
   */
  private deduplicatePlan(plan: ExecutablePlan): ExecutablePlan {
    const seenIds = new Set([plan.id]);
    const peers = this.plans.filter((potentialPeer) => {
      if (
        potentialPeer &&
        !seenIds.has(potentialPeer.id) &&
        this.isPeer(plan, potentialPeer)
      ) {
        seenIds.add(potentialPeer.id);
        return true;
      }
      return false;
    });
    if (peers.length === 0) {
      return plan;
    }
    const replacementPlan = plan.deduplicate(peers);
    if (replacementPlan !== plan) {
      if (!peers.includes(replacementPlan)) {
        throw new Error(
          `deduplicatePlan error: Expected to replace plan ${plan} with one of its (identical) peers; instead found ${replacementPlan}. This is currently forbidden because it could cause confusion during the optimization process, instead apply this change in 'optimize', or make sure that any child selections aren't applied until the optimize/finalize phase so that no mapping is required during deduplicate.`,
        );
      }
      debugPlanVerbose(
        "Deduplicated %c with peers %c => %c",
        plan,
        peers,
        replacementPlan,
      );
    } else {
      debugPlanVerbose("Didn't deduplicate %c with peers %c", plan, peers);
    }
    return replacementPlan;
  }

  private optimizedPlans = new Set<ExecutablePlan>();
  /**
   * Implements the `OptimizePlan` algorithm.
   */
  private optimizePlan(plan: ExecutablePlan): ExecutablePlan {
    if (this.optimizedPlans.has(plan)) {
      throw new Error("Must not optimize plan twice");
    }
    const replacementPlan = plan.optimize();
    this.optimizedPlans.add(plan);
    if (replacementPlan !== plan) {
      debugPlanVerbose(
        "Optimized %c into %c (replaced plan)",
        plan,
        replacementPlan,
      );
    } else {
      debugPlanVerbose("Optimized %c (same plan)", plan);
    }
    return replacementPlan;
  }

  /**
   * Implements the `MarkPlanActive` algorithm.
   */
  private markPlanActive(
    plan: ExecutablePlan,
    activePlans: Set<ExecutablePlan>,
  ): void {
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
    const activePlans = new Set<ExecutablePlan>();

    // NOTE: every plan referenced in this.planIdByPathIdentity is included in
    // this.itemPlanIdByPathIdentity, but the reverse is not true.
    for (const pathIdentity in this.itemPlanIdByPathIdentity) {
      const planId = this.itemPlanIdByPathIdentity[pathIdentity];
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
    const distinctActivePlansInReverseOrder = new Set<ExecutablePlan>();
    for (let i = this.plans.length - 1; i >= 0; i--) {
      const plan = this.plans[i];
      if (plan !== null) {
        globalState.parentPathIdentity = plan.parentPathIdentity;
        // NOTE: checking the following would be redundant:
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

  public newBatch(
    pathIdentity: string,
    returnType: GraphQLOutputType,
    crystalContext: CrystalContext,
  ): Batch {
    const planId = this.planIdByPathIdentity[pathIdentity];
    const itemPlanId = this.itemPlanIdByPathIdentity[pathIdentity];
    assert.ok(
      planId != null,
      `Could not find the planId for path identity '${pathIdentity}'`,
    );
    assert.ok(
      itemPlanId != null,
      `Could not find the itemPlanId for path identity '${pathIdentity}'`,
    );
    const plan = this.plans[planId];
    const itemPlan = this.plans[itemPlanId];
    assert.ok(
      plan,
      `Could not find the plan with id '${planId}' at '${pathIdentity}'`,
    );
    assert.ok(
      itemPlan,
      `Could not find the itemPlan with id '${itemPlanId}' at '${pathIdentity}'`,
    );
    const batch: Batch = {
      pathIdentity,
      crystalContext,
      plan,
      itemPlan,
      entries: [],
      returnType,
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
    const rootId = uid("root");
    debugExecuteVerbose("Root id is %c", rootId);
    const crystalContext: CrystalContext = {
      aether: this,
      resultByIndexesByPlanId: new Map(),
      metaByPlanId: Object.create(null),
      rootId,
      // @ts-ignore We'll set this in just a moment...
      rootCrystalObject: null,
    };
    const rootCrystalObject = newCrystalObject(
      null,
      GLOBAL_PATH, // TODO: this should be ROOT_PATH I think?
      this.queryTypeName,
      rootId,
      EMPTY_INDEXES,
      rootValue,
      crystalContext,
      {},
    );
    crystalContext.rootCrystalObject = rootCrystalObject;
    /*@__INLINE__*/ populateValuePlan(
      crystalContext,
      this.variableValuesPlan,
      [],
      variableValues,
      "variableValues",
    );
    /*@__INLINE__*/ populateValuePlan(
      crystalContext,
      this.contextPlan,
      [],
      context,
      "context",
    );
    /*@__INLINE__*/ populateValuePlan(
      crystalContext,
      this.rootValuePlan,
      [],
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
    returnType: GraphQLOutputType,
    parentCrystalObject: CrystalObject<any> | null,
    variableValues: {
      [variableName: string]: unknown;
    },
    context: object,
    rootValue: unknown,
  ): Batch {
    let batch = this.batchByPathIdentity[pathIdentity];
    if (!batch) {
      const crystalContext = parentCrystalObject
        ? parentCrystalObject[$$crystalContext]
        : this.newCrystalContext(variableValues, context, rootValue);
      batch = this.newBatch(pathIdentity, returnType, crystalContext);
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

    const { entries, plan, itemPlan, returnType } = batch;
    const namedReturnType = getNamedType(returnType);
    const entriesLength = entries.length;
    const crystalObjects: CrystalObject<any>[] = new Array(entriesLength);
    const deferredResults: Deferred<any>[] = new Array(entriesLength);
    for (let i = 0; i < entriesLength; i++) {
      const [crystalObject, deferredResult] = entries[i];
      crystalObjects[i] = crystalObject;
      deferredResults[i] = deferredResult;
    }

    try {
      assert.ok(plan, "No plan in batch?!");
      assert.ok(itemPlan, "No itemPlan in batch?!");

      const path = findPath(this, plan, itemPlan);
      if (!path) {
        throw new Error(
          `Item plan ${itemPlan} for field plan ${plan} seem to be unrelated.`,
        );
      }

      /**
       * We'll always have at least one layer, but for itemPlans that depend on
       * `__ListItemPlan`s we'll have one additional layer for each
       * `__ListItemPlan`.
       */
      const layers: Array<ExecutablePlan<any>> = [plan];

      /**
       * If there are no __ListItemPlans then this will be empty, otherwise
       * it'll be the plan id for each __ListItemPlan.
       */
      const listItemPlanIdAtDepth: number[] = [];

      // This block to define a new scope for the mutable `depth` variable. (No shadowing.)
      {
        let depth = 0;
        // Walk through the subplans, each time we find a `__ListItemPlan` we
        // add a new layer and record the listItemPlanIdAtDepth.
        for (const subPlan of path) {
          if (subPlan instanceof __ListItemPlan) {
            listItemPlanIdAtDepth[depth] = subPlan.id;
            assert.strictEqual(
              subPlan.depth,
              depth,
              `Expected ${subPlan}'s depth to match our locally tracked depth`,
            );
            depth++;
            // null means no need to transform the data; we might replace this in further iterations
          } else if (depth === 0) {
            // This should never happen
            throw new Error(
              `Unexpected plan structure: did not expect to find plan ${subPlan} between ${plan} and the first '__ListItemPlan' leading to ${itemPlan}.`,
            );
          } else {
            // We don't need to execute each individual plan manually because
            // `executePlan` handles dependencies for us; so just walk forward
            // until we hit another __ListItemPlan.
          }
          layers[depth] = subPlan;
        }
      }

      const executeLayers = async (
        layers: Array<ExecutablePlan<any>>,
        values: Array<CrystalLayerObject>,
        depth = 0,
      ): Promise<any[]> => {
        // If `rest` is empty then we're expecting to turn the results into
        // CrystalObjects, otherwise we're expecting arrays which we will then
        // process through another layer of executeLayers.
        const [layerPlan, ...rest] = layers;
        const valuesLength = values.length;

        debugExecuteVerbose(
          "Batch executing plan %c with %c",
          layerPlan,
          crystalObjects,
        );

        const layerResults = await this.executePlan(
          layerPlan,
          crystalContext,
          values,
        );

        if (isDev) {
          assert.ok(
            Array.isArray(layerResults),
            "Expected plan execution to return an array",
          );
          assert.strictEqual(
            layerResults.length,
            valuesLength,
            "Expected plan execution result to have same length as input objects",
          );
        }
        const valueIndexByNewValuesIndex: number[] = [];
        if (rest.length) {
          // We're expecting to be handling arrays still; there's another layer to come...
          const newValues = values.flatMap((value, valueIndex) => {
            const { crystalObject, indexByListItemPlanId } = value;
            const layerResult = layerResults[valueIndex];
            if (!Array.isArray(layerResult)) {
              if (layerResult != null) {
                console.error(
                  `Expected layerResult to be an array, found ${inspect(
                    layerResult,
                  )}`,
                );
              }
              // Stops here
              return [];
            }
            return layerResult.map(
              (_layerIndividualResult, layerResultIndex) => {
                valueIndexByNewValuesIndex.push(valueIndex);
                return {
                  crystalObject,
                  indexByListItemPlanId: {
                    ...indexByListItemPlanId,
                    // TODO: when we implement `@stream` then this
                    // might not actually be the right index, we might
                    // need to add an offset?
                    [listItemPlanIdAtDepth[depth]]: layerResultIndex,
                  },
                };
              },
            );
          });
          const results = new Array(values.length).fill(null);
          const newValuesResults = await executeLayers(
            rest,
            newValues,
            depth + 1,
          );
          assert.strictEqual(
            newValuesResults.length,
            newValues.length,
            "Expected newValuesResults and newValues to have the same length",
          );
          for (let i = 0, l = newValuesResults.length; i < l; i++) {
            const valueIndex = valueIndexByNewValuesIndex[i];
            if (!results[valueIndex]) {
              results[valueIndex] = [];
            }
            results[valueIndex].push(newValuesResults[i]);
          }
          return results;
        } else {
          // This was the final layer, so it's time to make the crystal objects.
          if (isScalarType(namedReturnType)) {
            // No crystal objects for scalars; just return the results directly.
            return layerResults;
          }
          const isPolymorphic =
            isUnionType(namedReturnType) || isInterfaceType(namedReturnType);
          if (!isPolymorphic) {
            assertObjectType(namedReturnType);
          }
          return values.map((value, valueIndex) => {
            const { indexByListItemPlanId } = value;
            const layerResult = layerResults[valueIndex];
            const data = layerResult;
            let typeName: string;
            let innerData: any;
            if (isPolymorphic) {
              assertPolymorphicData(data);
              ({ [$$concreteType]: typeName, [$$concreteData]: innerData } =
                data);
            } else {
              typeName = namedReturnType.name;
              innerData = data;
            }
            const crystalObject = newCrystalObject(
              layerPlan,
              batch.pathIdentity,
              typeName,
              uid(batch.pathIdentity),
              listItemPlanIdAtDepth.map(
                (planId) => indexByListItemPlanId[planId],
              ),
              innerData,
              crystalContext,
              indexByListItemPlanId,
            );
            return crystalObject;
          });
        }
      };

      const results = await executeLayers(
        layers,
        crystalObjects.map((crystalObject) => ({
          crystalObject,
          indexByListItemPlanId: crystalObject[$$indexByListItemPlanId],
        })),
      );

      for (let i = 0; i < entriesLength; i++) {
        deferredResults[i].resolve(results[i]);
      }
    } catch (e) {
      for (let i = 0; i < entriesLength; i++) {
        deferredResults[i].reject(e);
      }
    }
  }

  /**
   * Implements `ExecutePlan`.
   */
  private async executePlan(
    plan: ExecutablePlan,
    crystalContext: CrystalContext,
    crystalLayerObjects: CrystalLayerObject[],
    visitedPlans = new Set<ExecutablePlan>(),
    depth = 0,
  ): Promise<any[]> {
    const indent = "    ".repeat(depth);
    const follow = indent + "  ⮞";
    if (isDev) {
      if (!plan) {
        throw new Error(
          `executePlan was called but it was not passed a plan to execute, instead '${inspect(
            plan,
          )}'`,
        );
      }
    }
    if (visitedPlans.has(plan)) {
      throw new Error(
        `ExecutablePlan execution recursion error: attempted to execute ${plan} again (crystal layer objects: ${crystalLayerObjects.join(
          ", ",
        )})`,
      );
    }
    visitedPlans.add(plan);
    if (plan instanceof __ListItemPlan) {
      // Shortcut evaluation because __ListItemPlan cannot be executed.
      const parentPlan = this.plans[plan.dependencies[0]];
      // Evaluate parentPlan and then return the relevant index
      const parentResults = await this.executePlan(
        parentPlan,
        crystalContext,
        crystalLayerObjects,
        // This is to detect loops, so we don't want changes made inside to
        // cascade back outside -> clone.
        new Set([...visitedPlans]),
        depth + 1,
      );
      return crystalLayerObjects.map((value, i) => {
        const parentResult = parentResults[i];
        const resultAtIndex = parentResult
          ? parentResult[value.indexByListItemPlanId[plan.id]]
          : null;
        return resultAtIndex;
      });
    }
    let resultByIndexes = crystalContext.resultByIndexesByPlanId.get(plan.id);
    const listItemPlanIds = plan._listItemPlanIds;
    if (!resultByIndexes) {
      resultByIndexes = new Map();
      crystalContext.resultByIndexesByPlanId.set(plan.id, resultByIndexes);
    }
    const pendingCrystalLayerObjects = []; // Length unknown
    const pendingCrystalLayerObjectsIndexes = []; // Same length as pendingCrystalLayerObjects
    const crystalObjectCount = crystalLayerObjects.length;
    const result = new Array(crystalObjectCount);
    debugExecute(
      "%sExecutePlan(%c): executing with %o crystal objects",
      indent,
      plan,
      crystalObjectCount,
    );
    for (let i = 0; i < crystalObjectCount; i++) {
      const crystalLayerObject = crystalLayerObjects[i];
      const { indexByListItemPlanId } = crystalLayerObject;
      const indexes = listItemPlanIds.map(
        (planId) => indexByListItemPlanId[planId],
      );
      const indexesString = indexes.join();
      debugExecuteVerbose(
        "%s Looking for result for %c (for %c)",
        follow,
        indexesString,
        plan,
      );
      if (resultByIndexes.has(indexesString)) {
        const previousResult = resultByIndexes.get(indexesString);
        result[i] = previousResult;

        debugExecuteVerbose(
          "  %s result[%o] for %c found: %c",
          follow,
          i,
          indexesString,
          result[i],
        );
        continue;
      } else {
        debugExecuteVerbose(
          "  %s no result for %c (%c)",
          follow,
          indexesString,
          resultByIndexes,
        );
      }
      pendingCrystalLayerObjects.push(crystalLayerObject);
      pendingCrystalLayerObjectsIndexes.push(i);
    }
    const pendingCrystalObjectsLength = pendingCrystalLayerObjects.length;
    if (pendingCrystalObjectsLength > 0) {
      const dependenciesCount = plan.dependencies.length;
      const dependencyValuesList = new Array(dependenciesCount);
      debugExecute("%s Executing %o dependencies", follow, dependenciesCount);

      for (let i = 0; i < dependenciesCount; i++) {
        const dependencyPlanId = plan.dependencies[i];
        const dependencyPlan = this.plans[dependencyPlanId];
        if (isDev) {
          if (!dependencyPlan) {
            throw new Error(
              `Expected plan dependency '${i}' for '${plan}' to be a plan, instead found '${inspect(
                dependencyPlan,
              )}'`,
            );
          }
        }
        /*
        if (dependencyPlan instanceof __ListItemPlan) {
          const parentPlan = this.plans[dependencyPlan.dependencies[0]];
          // execute the parent plan, then get the result at the given index.
          const arr = new Array(pendingCrystalObjectsLength);
          const dependencyPathIdentity = dependencyPlan.parentPathIdentity;
          for (
            let pendingCrystalObjectIndex = 0;
            pendingCrystalObjectIndex < pendingCrystalObjectsLength;
            pendingCrystalObjectIndex++
          ) {
            const dependencyResultForPendingCrystalObject =
              allDependencyResults[pendingCrystalObjectIndex];
            const pendingCrystalObject =
              pendingCrystalLayerObjects[pendingCrystalObjectIndex];
            const indexes =
              pendingCrystalObject[$$indexesByPathIdentity][
                dependencyPathIdentity
              ];
            debugExecuteVerbose(
              `%s Evaluating indexes for object %c plan %c(%c) => %c`,
              follow,
              pendingCrystalObject,
              dependencyPlan,
              dependencyPlan,
              indexes,
            );
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
            const item = / *!__INLINE__* / atIndexes(
              dependencyResultForPendingCrystalObject,
              indexes,
            );
            arr[pendingCrystalObjectIndex] = item;
            debugExecuteVerbose(
              `  %s result at indexes %c = %c`,
              follow,
              indexes,
              item,
            );
          }
          dependencyValuesList[i] = arr;
        } else {
        */
        const allDependencyResults = await this.executePlan(
          dependencyPlan,
          crystalContext,
          pendingCrystalLayerObjects,
          // This is to detect loops, so we don't want changes made inside to
          // cascade back outside -> clone.
          new Set([...visitedPlans]),
          depth + 1,
        );
        dependencyValuesList[i] = allDependencyResults;
        /*
        }
        */
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
        meta = Object.create(null) as Record<string, unknown>;
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
      if (plan.debug) {
        console.log(
          `debugPlans(${plan}): called with: ${inspect(values, {
            colors: true,
            depth: 6,
          })}; returned: ${inspect(pendingResults, {
            colors: true,
            depth: 6,
          })}`,
        );
      }
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
        const crystalLayerObject = pendingCrystalLayerObjects[i];
        const pendingResult = pendingResults[i];
        const j = pendingCrystalLayerObjectsIndexes[i];

        result[j] = pendingResult;
        const { indexByListItemPlanId } = crystalLayerObject;
        const indexes = listItemPlanIds.map(
          (planId) => indexByListItemPlanId[planId],
        );
        const indexesString = indexes.join();
        resultByIndexes.set(indexesString, result[j]);
      }

      debugExecuteVerbose(
        `%sExecutePlan(%s): wrote results for [%s]: %c`,
        indent,
        plan,
        pendingCrystalLayerObjects.join(", "),
        resultByIndexes,
      );
    }
    if (isDev) {
      if (debugExecuteVerbose.enabled) {
        debugExecuteVerbose(
          `%sExecutePlan(%s): complete; results: %c`,
          indent,
          plan,
          result,
        );
      } else {
        debugExecute(`%sExecutePlan(%s): complete`, indent, plan);
      }
    }
    return result;
  }

  /**
   * Used to implement `GetValuePlanId`, but was rewritten to factor in that we
   * now key by crystal objects rather than id and indexes.
   */
  getValuePlanId<TData extends object>(
    crystalContext: CrystalContext,
    valuePlan: __ValuePlan<TData>,
    object: TData,
    pathIdentity: string,
  ): { valueId: UniqueId; existed: boolean } {
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
      valueId = uid("val");
      debugExecute(
        "No id for object %c (parent object of %s) against plan %s, generated %c",
        key,
        pathIdentity,
        valuePlan,
        valueId,
      );
      valueIdByObject.set(key, valueId);
      // populateValuePlan used to be here, but now it lives in resolvers.ts
      return { valueId, existed: false };
    }
    return { valueId, existed: true };
  }

  /**
   * For debugging.
   *
   * @internal
   */
  logPlans(): void {
    if (!debugPlanVerbose.enabled) {
      return;
    }
    const { plans } = this;
    debugPlanVerbose(
      "Plans: %s",
      "\n" +
        plans
          .map((plan, id) => {
            const optimized = this.optimizedPlans.has(plan);
            return plan
              ? `- ${id}: ${
                  plan.id !== id
                    ? `->${chalk.bold.yellow(String(plan.id))}`
                    : (optimized ? "!!" : "  ") +
                      plan.toString() +
                      ` (deps: ${plan.dependencies.map((depId) =>
                        chalk.bold.yellow(String(depId)),
                      )})`
                }`
              : null;
          })
          .filter(isNotNullish)
          .join("\n"),
    );
  }

  logPlansByPath(): void {
    if (!debugPlanVerbose.enabled) {
      return;
    }
    this.logPlans();
    const pathIdentities = Object.keys(this.planIdByPathIdentity).sort(
      (a, z) => a.length - z.length,
    );
    const printed = new Set<string>();
    let depth = 0;
    const lines: string[] = [];
    const print = (pathIdentity: string) => {
      if (printed.has(pathIdentity)) {
        return;
      }
      printed.add(pathIdentity);
      const planId = this.planIdByPathIdentity[pathIdentity];
      if (!planId) {
        throw new Error(`Corrupted plan, no id found for '${pathIdentity}'`);
      }
      const plan = this.plans[planId];
      lines.push("  ".repeat(depth) + `${pathIdentity}: ${plan}`);
      depth++;
      for (const childPathIdentity of pathIdentities) {
        if (childPathIdentity.startsWith(pathIdentity)) {
          print(childPathIdentity);
        }
      }
      depth--;
    };
    for (const pathIdentity of pathIdentities) {
      print(pathIdentity);
    }

    debugPlanVerbose("Plans by path: %s", "\n" + lines.join("\n"));
  }
}

/**
 * Implements `PopulateValuePlan`
 */
export function populateValuePlan(
  crystalContext: CrystalContext,
  valuePlan: ExecutablePlan,
  indexByListItemPlanId: IndexByListItemPlanId,
  object: unknown,
  label: string,
): void {
  let resultByIndexes = crystalContext.resultByIndexesByPlanId.get(
    valuePlan.id,
  );
  if (!resultByIndexes) {
    resultByIndexes = new Map();
    crystalContext.resultByIndexesByPlanId.set(valuePlan.id, resultByIndexes);
  }
  const listItemPlanIds = valuePlan._listItemPlanIds;
  const indexes = listItemPlanIds.map(
    (planId) => indexByListItemPlanId[planId],
  );
  const indexesString = indexes.join();
  resultByIndexes.set(indexesString, object ?? ROOT_VALUE_OBJECT);
  debugExecute("Populated value plan for %s: %c", label, resultByIndexes);
}

function isNotNullish<T>(a: T | null | undefined): a is T {
  return a != null;
}

class __TypePlan extends ExecutablePlan<any> {
  private planId: number;
  private typeName: string;
  constructor(type: GraphQLObjectType, plan: ExecutablePlan<any>) {
    super();
    this.planId = this.addDependency(plan);
    this.typeName = type.name;
  }

  execute(values: any[][]): any[] {
    return values.map((v) => ({ type: this.typeName, data: v[this.planId] }));
  }
}

/**
 * Finds a (the?) path from ancestorPlan to descendentPlan. Semi-expensive; try
 * and only use this at planning time, not execution time. Useful for tracking
 * down all the __ListItemPlans.
 */
function findPath(
  aether: Aether,
  ancestorPlan: ExecutablePlan<any>,
  descendentPlan: ExecutablePlan<any>,
): Array<ExecutablePlan<any>> | null {
  if (ancestorPlan === descendentPlan) {
    return [];
  }
  for (let i = 0, l = descendentPlan.dependencies.length; i < l; i++) {
    const depPlan = aether.plans[descendentPlan.dependencies[i]];
    // Optimisation
    if (depPlan === ancestorPlan) {
      return [descendentPlan];
    }
    const p = findPath(aether, ancestorPlan, depPlan);
    if (p) {
      return [...p, descendentPlan];
    }
  }
  return null;
}
