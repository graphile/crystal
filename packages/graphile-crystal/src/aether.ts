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
import { Plan, assertFinalized, PolymorphicPlan, ArgumentPlan } from "./plan";
import { __TrackedObjectPlan, __ValuePlan, __ListItemPlan } from "./plans";
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
  $$crystalContext,
  $$indexesByPathIdentity,
  $$crystalObjectByPathIdentity,
} from "./interfaces";
import { isDev } from "./dev";
import { Deferred } from "./deferred";
import { isCrystalObject, newCrystalObject } from "./resolvers";
import { globalState } from "./global";

import debugFactory from "debug";

const EMPTY_INDEXES = Object.freeze([] as number[]);

const debugAether = debugFactory("crystal:aether");
const debug = debugAether.extend("regular");
const debugVerbose = debugAether.extend("verbose");

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
    debugVerbose(
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
    debugVerbose("Constructed trackedContextPlan %s", this.trackedContextPlan);
    this.rootValuePlan = new __ValuePlan();
    debug("Constructed rootValuePlan %s", this.rootValuePlan);
    this.trackedRootValuePlan = new __TrackedObjectPlan(
      rootValue,
      this.rootValuePlan,
      this.rootValueConstraints,
    );
    debugVerbose(
      "Constructed trackedRootValuePlan %s",
      this.trackedRootValuePlan,
    );
    this.planIdByPathIdentity = Object.assign(Object.create(null), {
      "": this.rootValuePlan.id,
    });
    this.itemPlanIdByPathIdentity = Object.assign(Object.create(null), {
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

    // Helpfully check plans don't do forbidden things.
    this.validatePlans();

    // Get rid of temporary plans
    this.treeShakePlans();

    // Squish plans together
    this.deduplicatePlans();

    // Get rid of unneeded plans
    this.treeShakePlans();

    // Replace/inline/optimise plans
    this.optimizePlans();

    // Get rid of plans that are no longer needed after optimising
    this.treeShakePlans();

    // Plans are expected to execute later; they may take steps here to prepare
    // themselves (e.g. compiling SQL queries ahead of time).
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
      globalState.parentPathIdentity = path;
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
    plan: Plan<any>,
  ): Plan<any> {
    if (fieldType instanceof GraphQLNonNull) {
      // TODO: we could implement a __NonNullPlan in future; currently we just
      // defer that to GraphQL.js
      this.planSelectionSetForType(
        fieldType.ofType,
        fields,
        pathIdentity,
        plan,
      );
      return plan;
    } else if (fieldType instanceof GraphQLList) {
      assertListCapablePlan(plan, pathIdentity);
      const listItemPlan = plan.listItem(new __ListItemPlan(plan));
      this.planSelectionSetForType(
        fieldType.ofType,
        fields,
        pathIdentity,
        listItemPlan,
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
          if (val instanceof Plan) {
            errors.push(
              new Error(
                `ERROR: Plan ${plan} has illegal reference via property '${key}' to plan ${val}. You must not reference plans directly, instead use the plan id to reference the plan, and look the plan up in \`this.aether.plans[planId]\`. Failure to comply could result in subtle breakage during optimisation.`,
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
  private processPlans(callback: (plan: Plan<any>) => Plan<any>): void {
    const replacements = new Map<Plan, number>();
    const processed = new Set();
    const process = (i: number): void => {
      const plan = this.plans[i];
      if (!plan) {
        return;
      }
      const replacementId = replacements.get(plan);
      if (replacementId != null) {
        this.plans[i] = this.plans[replacementId];
        return;
      }
      if (processed.has(plan)) {
        return;
      }
      // Process dependencies first
      for (let i = 0, l = plan.dependencies.length; i < l; i++) {
        const depId = plan.dependencies[i];
        process(depId);
      }
      globalState.parentPathIdentity = plan.parentPathIdentity;
      const replacementPlan = callback(plan);
      this.plans[i] = replacementPlan;
      if (replacementPlan != plan) {
        replacements.set(plan, replacementPlan.id);
      }
      processed.add(plan);
    };
    for (let i = this.plans.length - 1; i >= 0; i--) {
      process(i);
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
  private deduplicatePlans(): void {
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
      this.processPlans((plan) => {
        const replacementPlan = this.deduplicatePlan(plan);
        if (replacementPlan !== plan) {
          lastOptimizedPlan = replacementPlan;
          replacements++;
        }
        return replacementPlan;
      });
      loops++;
    } while (replacements > 0);
    debug("Plan deduplication complete after %o loops", loops);
  }

  /**
   * Implements the `OptimizePlans` algorithm. Note that we loop backwards
   * since later plans are dependent on earlier plans, so by starting at the
   * latest plans we can make sure that we know all our dependent's needs
   * before we optimise ourself.
   */
  private optimizePlans(): void {
    this.processPlans((plan) => this.optimizePlan(plan));
  }

  private isPeer(planA: Plan, planB: Plan): boolean {
    // Can only merge if plan is of same type.
    if (planA.constructor !== planB.constructor) {
      return false;
    }

    // Can only merge if the plans exist at the same level.
    if (planA.parentPathIdentity !== planB.parentPathIdentity) {
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
   * Finds suitable peers and passes them to the plan's deduplicate method (if
   * any found).
   */
  private deduplicatePlan(plan: Plan): Plan {
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
      debugVerbose(
        "Deduplicated %c with peers %c => %c",
        plan,
        peers,
        replacementPlan,
      );
    } else {
      debugVerbose("Didn't deduplicate %c with peers %c", plan, peers);
    }
    return replacementPlan;
  }

  /**
   * Implements the `OptimizePlan` algorithm.
   */
  private optimizePlan(plan: Plan): Plan {
    const replacementPlan = plan.optimize();
    if (replacementPlan !== plan) {
      debugVerbose(
        "Replaced %c with %c during optimization",
        plan,
        replacementPlan,
      );
    } else {
      debugVerbose("Optimized %c (same plan)", plan);
    }
    return replacementPlan;
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
    const distinctActivePlansInReverseOrder = new Set<Plan>();
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
    const rootId = uid("root");
    debugVerbose("Root id is %c", rootId);
    const crystalContext: CrystalContext = {
      resultByCrystalObjectByPlanId: new Map(),
      metaByPlanId: Object.create(null),
      rootId,
      // @ts-ignore We'll set this in just a moment...
      rootCrystalObject: null,
    };
    const rootCrystalObject = newCrystalObject(
      null,
      "",
      rootId,
      EMPTY_INDEXES,
      rootValue,
      crystalContext,
    );
    crystalContext.rootCrystalObject = rootCrystalObject;
    /*@__INLINE__*/ populateValuePlan(
      crystalContext,
      this.variableValuesPlan,
      rootCrystalObject,
      variableValues,
      "variableValues",
    );
    /*@__INLINE__*/ populateValuePlan(
      crystalContext,
      this.contextPlan,
      rootCrystalObject,
      context,
      "context",
    );
    /*@__INLINE__*/ populateValuePlan(
      crystalContext,
      this.rootValuePlan,
      rootCrystalObject,
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
      debug("Batch executing plan %c with %c", plan, crystalObjects);
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
    depth = 0,
  ): Promise<any[]> {
    const indent = "    ".repeat(depth);
    const follow = indent + "  ⮞";
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
    let resultByCrystalObject = crystalContext.resultByCrystalObjectByPlanId.get(
      plan.id,
    );
    if (!resultByCrystalObject) {
      resultByCrystalObject = new Map();
      crystalContext.resultByCrystalObjectByPlanId.set(
        plan.id,
        resultByCrystalObject,
      );
    }
    const pendingCrystalObjects = []; // Length unknown
    const pendingCrystalObjectsIndexes = []; // Same length as pendingCrystalObjects
    const crystalObjectCount = crystalObjects.length;
    const result = new Array(crystalObjectCount);
    debug(
      "%sExecutePlan(%c): executing with %o crystal objects",
      indent,
      plan,
      crystalObjectCount,
    );
    for (let i = 0; i < crystalObjectCount; i++) {
      const crystalObject = crystalObjects[i];
      const planCrystalObject =
        crystalObject[$$crystalObjectByPathIdentity][plan.parentPathIdentity];
      if (planCrystalObject) {
        debugVerbose(
          "%s Looking for result for %c (for %c)",
          follow,
          planCrystalObject,
          plan,
        );
        if (resultByCrystalObject.has(planCrystalObject)) {
          const previousResult = resultByCrystalObject.get(planCrystalObject);
          result[i] = previousResult;

          debugVerbose(
            `  %s result[%o] for %c found: %c`,
            follow,
            i,
            planCrystalObject,
            result[i],
          );
          continue;
        } else {
          debugVerbose(
            `  %s no result for %c (%c)`,
            follow,
            planCrystalObject,
            resultByCrystalObject,
          );
        }
      } else {
        throw new Error(
          `Crystal error: could not find id for ${plan.parentPathIdentity} in ${crystalObject}`,
        );
      }
      pendingCrystalObjects.push(crystalObject);
      pendingCrystalObjectsIndexes.push(i);
    }
    const pendingCrystalObjectsLength = pendingCrystalObjects.length;
    if (pendingCrystalObjectsLength > 0) {
      const dependenciesCount = plan.dependencies.length;
      const dependencyValuesList = new Array(dependenciesCount);
      debug("%s Executing %o dependencies", follow, dependenciesCount);

      for (let i = 0; i < dependenciesCount; i++) {
        const dependencyPlanId = plan.dependencies[i];
        const originalDependencyPlan = this.plans[dependencyPlanId];
        let dependencyPlan = originalDependencyPlan;
        if (isDev) {
          assert.ok(
            dependencyPlan,
            `Expected plan dependency '${i}' for '${plan}' to be a plan, instead found '${inspect(
              dependencyPlan,
            )}'`,
          );
        }
        let listDepth = 0;
        const dependencyPathIdentity =
          originalDependencyPlan.parentPathIdentity;
        while (dependencyPlan instanceof __ListItemPlan) {
          listDepth++;
          dependencyPlan = this.plans[dependencyPlan.dependencies[0]];
        }
        const allDependencyResults = await this.executePlan(
          dependencyPlan,
          crystalContext,
          pendingCrystalObjects,
          visitedPlans,
          depth + 1,
        );
        if (listDepth > 0) {
          const arr = new Array(pendingCrystalObjectsLength);
          for (
            let pendingCrystalObjectIndex = 0;
            pendingCrystalObjectIndex < pendingCrystalObjectsLength;
            pendingCrystalObjectIndex++
          ) {
            const dependencyResultForPendingCrystalObject =
              allDependencyResults[pendingCrystalObjectIndex];
            const pendingCrystalObject =
              pendingCrystalObjects[pendingCrystalObjectIndex];
            const indexes =
              pendingCrystalObject[$$indexesByPathIdentity][
                dependencyPathIdentity
              ];
            debugVerbose(
              `%s Evaluating indexes for object %c plan %c(%c) => %c`,
              follow,
              pendingCrystalObject,
              originalDependencyPlan,
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
            const item = /*!__INLINE__*/ atIndexes(
              dependencyResultForPendingCrystalObject,
              indexes,
            );
            arr[pendingCrystalObjectIndex] = item;
            debugVerbose(
              `  %s result at indexes %c = %c`,
              follow,
              indexes,
              item,
            );
          }
          dependencyValuesList[i] = arr;
        } else {
          // Optimisation
          dependencyValuesList[i] = allDependencyResults;
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
        const crystalObject = pendingCrystalObjects[i];
        const pendingResult = pendingResults[i];
        const j = pendingCrystalObjectsIndexes[i];

        const planCrystalObject =
          crystalObject[$$crystalObjectByPathIdentity][plan.parentPathIdentity];
        if (!planCrystalObject) {
          throw new Error(
            `Crystal error: could not find crystalObject for ${plan.parentPathIdentity} in ${crystalObject}`,
          );
        }

        result[j] = pendingResult;
        resultByCrystalObject.set(planCrystalObject, result[j]);
      }

      debugVerbose(
        `%sExecutePlan(%s): wrote results for [%s]: %c`,
        indent,
        plan,
        pendingCrystalObjects.join(", "),
        resultByCrystalObject,
      );
    }
    if (isDev) {
      if (debugVerbose.enabled) {
        debugVerbose(
          `%sExecutePlan(%s): complete; results: %c`,
          indent,
          plan,
          result,
        );
      } else {
        debug(`%sExecutePlan(%s): complete`, indent, plan);
      }
    }
    return result;
  }

  /**
   * Used to implement `GetValuePlanId`, but was rewritten to factor in that we
   * now key by crystal objects rather than id and indexes.
   */
  getValuePlanId(
    crystalContext: CrystalContext,
    valuePlan: __ValuePlan,
    object: object,
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
      debug(
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
}

/**
 * Implements `PopulateValuePlan`
 */
export function populateValuePlan(
  crystalContext: CrystalContext,
  valuePlan: Plan,
  valueCrystalObject: CrystalObject<any>,
  object: any,
  label: string,
): void {
  let resultByCrystalObject = crystalContext.resultByCrystalObjectByPlanId.get(
    valuePlan.id,
  );
  if (!resultByCrystalObject) {
    resultByCrystalObject = new Map();
    crystalContext.resultByCrystalObjectByPlanId.set(
      valuePlan.id,
      resultByCrystalObject,
    );
  }
  resultByCrystalObject.set(valueCrystalObject, object ?? ROOT_VALUE_OBJECT);
  debug("Populated value plan for %s: %c", label, resultByCrystalObject);
}
