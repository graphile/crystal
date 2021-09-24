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
} from "graphql";
import {
  assertObjectType,
  getNamedType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLUnionType,
  isInputObjectType,
  isInterfaceType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isUnionType,
} from "graphql";
import { inspect } from "util";

import * as assert from "./assert";
import { GLOBAL_PATH, ROOT_PATH } from "./constants";
import type { Constraint } from "./constraints";
import type { Deferred } from "./deferred";
import { isDev } from "./dev";
import { withGlobalState } from "./global";
import { graphqlCollectFields } from "./graphqlCollectFields";
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
  FieldAndGroup,
  GroupedSelections,
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
  isPromise,
  ROOT_VALUE_OBJECT,
  uid,
} from "./utils";

/**
 * Describes the document tree that we're parsing; is populated by
 * planSelectionSet. Is mostly useful for determining the groupIds of the plans
 * during the tree shaking phase.
 *
 * @internal
 */

interface TreeNode {
  pathIdentity: string;
  groupIds: number[];
  parent: null | TreeNode;
  children: TreeNode[];
}

type AetherPhase =
  | "init"
  | "plan"
  | "validate"
  | "deduplicate"
  | "optimize"
  | "finalize"
  | "ready";

function newCrystalLayerObject(
  crystalObject: CrystalObject<any>,
  indexByListItemPlanId: {
    [listItemPlanId: number]: number;
  },
): CrystalLayerObject {
  return {
    // @ts-ignore
    toString(): string {
      return chalk.bold.green(`CLO<${crystalObject}>`);
    },
    crystalObject,
    indexByListItemPlanId,
  };
}

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

/**
 * Implements the `NewAether` algorithm.
 */
export class Aether<
  TVariables extends BaseGraphQLVariables = BaseGraphQLVariables,
  TContext extends BaseGraphQLContext = BaseGraphQLContext,
  TRootValue extends BaseGraphQLRootValue = BaseGraphQLRootValue,
> {
  private phase: AetherPhase = "init";

  public maxGroupId = 0;
  private rootTreeNode: TreeNode = {
    pathIdentity: ROOT_PATH,
    groupIds: [0],
    parent: null,
    children: [],
  };

  private readonly plans: ExecutablePlan[] = [];

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
  public readonly sideEffectPlanIdsByPathIdentity: {
    [pathIdentity: string]: number[];
  };
  /**
   * The field at each given path identity may be in one or more groups; these
   * groups govern how the plans run (e.g. a plan will likely not optimise
   * itself into a parent plan in a different group). Groups are advanced by
   * features such as `@stream` and `@defer`. This behaviour ensures that only
   * the logic required at each stage is executed at those stages.
   */
  public readonly groupIdsByPathIdentity: {
    [pathIdentity: string]: number[] | undefined;
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
  public readonly unionsContainingObjectType: {
    [objectTypeName: string]: ReadonlyArray<GraphQLUnionType>;
  };

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

    // Unions are a pain, let's cache some things up front to make them easier.
    const allTypes = Object.values(schema.getTypeMap());
    const allUnions = allTypes.filter(isUnionType);
    const allObjectTypes = allTypes.filter(isObjectType);
    this.unionsContainingObjectType = Object.create(null);
    for (const objectType of allObjectTypes) {
      this.unionsContainingObjectType[objectType.name] = allUnions.filter((u) =>
        u.getTypes().includes(objectType),
      );
    }

    this.phase = "plan";
    /** with global state */
    const wgs = withGlobalState.bind(null, {
      aether: this,
      parentPathIdentity: GLOBAL_PATH,
    }) as <T>(cb: () => T) => T;
    this.variableValuesPlan = wgs(() => new __ValuePlan());
    debugPlan("Constructed variableValuesPlan %s", this.variableValuesPlan);
    // TODO: this should use a more intelligent tracked object plan since the variables are strongly typed (unlike context/rootValue).
    this.trackedVariableValuesPlan = wgs(
      () =>
        new __TrackedObjectPlan(
          variableValues,
          this.variableValuesPlan,
          this.variableValuesConstraints,
        ),
    );
    debugPlanVerbose(
      "Constructed trackedVariableValuesPlan %s",
      this.trackedVariableValuesPlan,
    );
    this.contextPlan = wgs(() => new __ValuePlan());
    debugPlan("Constructed contextPlan %s", this.contextPlan);
    this.trackedContextPlan = wgs(
      () =>
        new __TrackedObjectPlan(
          context,
          this.contextPlan,
          this.contextConstraints,
        ),
    );
    debugPlanVerbose(
      "Constructed trackedContextPlan %s",
      this.trackedContextPlan,
    );
    this.rootValuePlan = wgs(() => new __ValuePlan());
    debugPlan("Constructed rootValuePlan %s", this.rootValuePlan);
    this.trackedRootValuePlan = wgs(
      () =>
        new __TrackedObjectPlan(
          rootValue,
          this.rootValuePlan,
          this.rootValueConstraints,
        ),
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
    this.sideEffectPlanIdsByPathIdentity = Object.create(null);
    this.groupIdsByPathIdentity = Object.assign(Object.create(null), {
      [ROOT_PATH]: [0],
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

    this.phase = "validate";

    // Helpfully check plans don't do forbidden things.
    this.validatePlans();

    // Log the initial plan map
    this.logPlansByPath("initial");

    // Get rid of temporary plans
    this.treeShakePlans();

    this.phase = "deduplicate";

    // Squish plans together; this should result in no changes because plans
    // are deduplicated during creation.
    this.deduplicatePlans();

    // Get rid of unneeded plans
    this.treeShakePlans();

    // Log the plan map after deduplication
    this.logPlansByPath("after deduplication");

    this.phase = "optimize";

    // Replace/inline/optimise plans
    this.optimizePlans();

    // Get rid of plans that are no longer needed after optimising
    this.treeShakePlans();

    this.phase = "finalize";

    // Plans are expected to execute later; they may take steps here to prepare
    // themselves (e.g. compiling SQL queries ahead of time).
    this.finalizePlans();

    // Log the plan now we're all done
    this.logPlansByPath("after optimization and finalization");

    this.phase = "ready";
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
      [
        {
          groupId: 0,
          selections: this.operation.selectionSet.selections,
        },
      ],
      this.rootTreeNode,
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
      [
        {
          groupId: 0,
          selections: this.operation.selectionSet.selections,
        },
      ],
      this.rootTreeNode,
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
    const groupedFieldSet = graphqlCollectFields(this, rootType, [
      {
        groupId: 0,
        selections: selectionSet.selections,
      },
    ]);
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
    const wgs = withGlobalState.bind(null, {
      aether: this,
      parentPathIdentity: ROOT_PATH,
    }) as <T>(cb: () => T) => T;
    if (subscriptionPlanResolver) {
      const trackedArguments = wgs(() =>
        this.getTrackedArguments(rootType, field),
      );
      const subscribePlan = wgs(() =>
        subscriptionPlanResolver(
          this.trackedRootValuePlan,
          trackedArguments,
          this.trackedContextPlan,
        ),
      );
      // NOTE: don't need to worry about tracking groupId when planning
      // arguments as they're guaranteed to be identical across all selections.
      wgs(() =>
        this.planFieldArguments(
          rootType,
          fieldSpec,
          field,
          trackedArguments,
          this.trackedRootValuePlan,
          subscribePlan,
        ),
      );
      this.planSelectionSet(
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
    } else {
      const subscribePlan = this.trackedRootValuePlan;
      this.planSelectionSet(
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
    groupedSelectionsList: GroupedSelections[],
    parentTreeNode: TreeNode,
    isSequential = false,
  ): void {
    assertObjectType(objectType);
    const groupedFieldSet = graphqlCollectFields(
      this,
      objectType,
      groupedSelectionsList,
    );
    const objectTypeFields = objectType.getFields();
    for (const [responseKey, fieldAndGroups] of groupedFieldSet.entries()) {
      const pathIdentity = `${path}>${objectType.name}.${responseKey}`;

      // We could use a Set for this, but for a very small data set arrays
      // are faster.
      const groupIds: number[] = [];
      this.groupIdsByPathIdentity[pathIdentity] = groupIds;

      let firstField: FieldNode | null = null;
      for (const { field: fieldInstance, groupId } of fieldAndGroups) {
        if (!firstField) {
          firstField = fieldInstance;
        }
        if (!groupIds.includes(groupId)) {
          groupIds.push(groupId);
        }
      }
      if (!firstField) {
        // Impossible?
        throw new Error("Grouped field set with no field?!");
      }

      // Tell TypeScript this isn't going to change now.
      const field = firstField;

      const fieldName = field.name.value;
      if (fieldName.startsWith("__")) {
        // Introspection field, skip
        continue;
      }

      // This is presumed to exist because the operation passed validation.
      const objectField = objectTypeFields[fieldName];
      const fieldType = objectTypeFields[fieldName].type;

      const planResolver = objectField.extensions?.graphile?.plan;
      let plan: ExecutablePlan | PolymorphicPlan;
      this.sideEffectPlanIdsByPathIdentity[pathIdentity] = [];
      if (typeof planResolver === "function") {
        const oldPlansLength = this.plans.length;
        const wgs = withGlobalState.bind(null, {
          aether: this,
          parentPathIdentity: path,
        }) as <T>(cb: () => T) => T;
        const trackedArguments = wgs(() =>
          this.getTrackedArguments(objectType, field),
        );
        plan = wgs(() =>
          planResolver(parentPlan, trackedArguments, this.trackedContextPlan),
        );
        assertExecutablePlan(plan, pathIdentity);
        wgs(() =>
          this.planFieldArguments(
            objectType,
            objectField,
            field,
            trackedArguments,
            parentPlan,
            plan,
          ),
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
            if (newPlan.hasSideEffects) {
              this.sideEffectPlanIdsByPathIdentity[pathIdentity].push(
                newPlan.id,
              );
            }
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

      const treeNode: TreeNode = {
        pathIdentity,
        groupIds,
        parent: parentTreeNode,
        children: [],
      };
      parentTreeNode.children.push(treeNode);

      // Now we're building the child plans, the parentPathIdentity becomes
      // actually our identity.
      const itemPlan = this.planSelectionSetForType(
        fieldType,
        fieldAndGroups,
        pathIdentity,
        plan,
        treeNode,
      );
      this.itemPlanIdByPathIdentity[pathIdentity] = itemPlan.id;
    }
  }

  /**
   * This algorithm wasn't originally planned, but we should not have jumped
   * straight to getNamedType in the plan. This method lets us walk the type
   * tree and add in `__ListItemPlan`s in the relevant places so that we can
   * refer to indexes when referencing the relevant values.
   */
  private planSelectionSetForType(
    fieldType: GraphQLOutputType,
    fieldAndGroups: FieldAndGroup[],
    pathIdentity: string,
    plan: ExecutablePlan<any>,
    treeNode: TreeNode,
    depth = 0,
  ): ExecutablePlan<any> {
    const wgs = withGlobalState.bind(null, {
      aether: this,
      parentPathIdentity: pathIdentity,
    }) as <T>(cb: () => T) => T;
    if (fieldType instanceof GraphQLNonNull) {
      // TODO: we could implement a __NonNullPlan in future; currently we just
      // defer that to GraphQL.js
      this.planSelectionSetForType(
        fieldType.ofType,
        fieldAndGroups,
        pathIdentity,
        plan,
        treeNode,
        depth,
      );
      return plan;
    } else if (fieldType instanceof GraphQLList) {
      assertListCapablePlan(plan, pathIdentity);
      const listItemPlan = wgs(() =>
        plan.listItem(new __ListItemPlan(plan, depth)),
      );
      this.planSelectionSetForType(
        fieldType.ofType,
        fieldAndGroups,
        pathIdentity,
        listItemPlan,
        treeNode,
        depth + 1,
      );
      return listItemPlan;
    }
    const fieldTypeIsObjectType = fieldType instanceof GraphQLObjectType;
    const fieldTypeIsInterfaceType = fieldType instanceof GraphQLInterfaceType;
    const fieldTypeIsUnionType = fieldType instanceof GraphQLUnionType;
    if (
      fieldTypeIsObjectType ||
      fieldTypeIsInterfaceType ||
      fieldTypeIsUnionType
    ) {
      const groupedSubSelections = graphqlMergeSelectionSets(fieldAndGroups);
      if (fieldTypeIsObjectType) {
        this.planSelectionSet(
          pathIdentity,
          plan,
          fieldType as GraphQLObjectType,
          groupedSubSelections,
          treeNode,
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
            const subPlan = wgs(() =>
              polymorphicPlan.planForType(possibleObjectType),
            );
            this.planSelectionSet(
              pathIdentity,
              subPlan,
              possibleObjectType,
              groupedSubSelections,
              treeNode,
              false,
            );
          }
        };
        if (fieldTypeIsUnionType) {
          const unionType = fieldType as GraphQLUnionType;
          const subSelections = groupedSubSelections.flatMap(
            (s) => s.selections,
          );
          const possibleObjectTypes = typesUsedInSelections(
            this,
            unionType.getTypes(),
            subSelections,
          );
          /*@__INLINE__*/ planPossibleObjectTypes(possibleObjectTypes);
        } else {
          assert.ok(
            fieldTypeIsInterfaceType,
            "Impossible. fieldTypeIsObjectType and fieldTypeIsUnionType are false so fieldTypeIsInterfaceType must be true",
          );
          const interfaceType = fieldType as GraphQLInterfaceType;
          // If we reference non-introspection fields on the interface type (or
          // any of the interface types it implements) then we need to plan for
          // every single object type that implements this interface; otherwise
          // we only need to plan the reachable types.
          const implementations =
            this.schema.getImplementations(interfaceType).objects;
          const subSelections = groupedSubSelections.flatMap(
            (s) => s.selections,
          );
          if (
            interfaceTypeHasNonIntrospectionFieldQueriedInSelections(
              this,
              interfaceType,
              subSelections,
            )
          ) {
            /*@__INLINE__*/ planPossibleObjectTypes(implementations);
          } else {
            const possibleObjectTypes = typesUsedInSelections(
              this,
              implementations,
              subSelections,
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
    return trackedArgumentValues;
  }

  private validatePlans(startingAtPlanId = 0): void {
    const errors: Error[] = [];
    for (let i = startingAtPlanId, l = this.plans.length; i < l; i++) {
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

    // TODO: This might make sense to live somewhere else / be called at a different phase?
    this.assignGroupIds(this.rootTreeNode);
  }

  /**
   * Processes the plans making sure to process the leaves of the plan DAG
   * first and then working our way back up the graph to the root nodes.
   */
  private processPlans(
    actionDescription: string,
    order: "dependents-first" | "dependencies-first",
    callback: (plan: ExecutablePlan<any>) => ExecutablePlan<any>,
    {
      onPlanReplacement,
      startingAtPlanId = 0,
    }: {
      onPlanReplacement?: (
        originalPlan: ExecutablePlan,
        replacementPlan: ExecutablePlan,
      ) => void;
      startingAtPlanId?: number;
    } = {},
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
      const shouldAbort = () => {
        if (!this.plans[plan.id]) {
          debugPlanVerbose(
            "%c is no longer needed; aborting %s",
            plan,
            actionDescription,
          );
          return true;
        }
        return false;
      };
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
            `Before we can %s %c we must %s %c`,
            actionDescription,
            plan,
            actionDescription,
            depPlan,
          );
          depth++;
          process(depPlan);
          depth--;
          if (shouldAbort()) {
            return;
          }
        }
      }
      let replacementPlan: ExecutablePlan;
      try {
        replacementPlan = withGlobalState(
          {
            aether: this,
            parentPathIdentity: plan.parentPathIdentity,
          },
          () => callback(plan),
        );
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

        onPlanReplacement?.(plan, replacementPlan);
      }
      processed.add(plan);
    };

    let plansAdded = 0;
    const oldPlanCount = this.plans.length;
    let l = oldPlanCount;
    for (let i = startingAtPlanId; i < l; i++) {
      process(this.plans[i]);

      plansAdded += this.plans.length - l;

      // NOTE: whilst processing plans new plans may be added, thus we must loop
      // ascending and we must re-evaluate this.plans.length on each loop
      // iteration.
      if (isDev && plansAdded > 100000) {
        throw new Error(
          `Whilst processing plans as part of ${actionDescription}Plans, ${plansAdded} new plans have been created... That seems like it's likely a bug in the relevant method of one of your plans. The last plan processed was ${
            this.plans[i]
          } and this created the following plans: ${this.plans
            .slice(i + 1)
            .join(",")}`,
        );
      }

      l = this.plans.length;
    }

    if (this.plans.length > oldPlanCount) {
      // Any time new plans are added we should validate them.
      this.validatePlans(oldPlanCount);
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
        "deduplicate",
        "dependencies-first",
        (plan) => {
          const replacementPlan = this.deduplicatePlan(plan);
          if (replacementPlan !== plan) {
            lastOptimizedPlan = replacementPlan;
            replacements++;
          }
          return replacementPlan;
        },
        { startingAtPlanId },
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
    this.processPlans(
      "optimize",
      "dependents-first",
      (plan) => this.optimizePlan(plan),
      {
        // TODO: we should be able to optimize this - we know the new and old
        // plan so we should be able to look at just the original plan's
        // dependencies and see if they're needed any more or not.
        onPlanReplacement: (_originalPlan, _replacementPlan) =>
          this.treeShakePlans(),
      },
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
    if (plan.hasSideEffects) {
      // Never deduplicate plans with side effects.
      return plan;
    }
    const seenIds = new Set([plan.id]);
    const peers = this.plans.filter((potentialPeer) => {
      if (
        potentialPeer &&
        !potentialPeer.hasSideEffects &&
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

    // Mark all plans with side effects as active.
    for (const pathIdentity in this.sideEffectPlanIdsByPathIdentity) {
      const planIds = this.sideEffectPlanIdsByPathIdentity[pathIdentity];
      for (const planId of planIds) {
        const plan = this.plans[planId];
        if (isDev) {
          assert.ok(plan, `Could not find plan for identifier '${planId}'`);
        }
        this.markPlanActive(plan, activePlans);
      }
    }

    for (let i = 0, l = this.plans.length; i < l; i++) {
      const plan = this.plans[i];
      if (plan && !activePlans.has(plan)) {
        if (plan.id === i) {
          debugPlanVerbose(`Deleting plan %c during tree shaking`, plan);
        }
        // We're going to delete this plan. Theoretically nothing can reference
        // it, so it should not cause any issues. If it does, it's due to a
        // programming bug somewhere where we're referencing a plan that hasn't
        // been added to the relevant dependencies. As such; I'm going
        // to bypass TypeScript here and delete the node whilst still letting
        // TypeScript guarantee it exists - better that the user gets a runtime
        // error trying to use it rather than using a nonsense plan.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.plans[i] = null as any;
      }
    }
  }

  /**
   * We want to know the shallowest paths in each branch of the tree that each
   * plan is used, and then extract the groupIds from these. This helps us to
   * know when plans can and cannot be optimised (e.g. merged together).
   */
  private assignGroupIds(
    treeNode: TreeNode,
    knownPlans = new Set<ExecutablePlan>(),
  ) {
    const groupIds = this.groupIdsByPathIdentity[treeNode.pathIdentity];
    assert.ok(
      groupIds != null,
      `Could not determine the group ids for path identity '${treeNode.pathIdentity}'`,
    );
    const planId = this.itemPlanIdByPathIdentity[treeNode.pathIdentity];
    assert.ok(
      planId != null,
      `Could not determine the item plan id for path identity '${treeNode.pathIdentity}'`,
    );
    const processPlan = (plan: ExecutablePlan): void => {
      if (!knownPlans.has(plan)) {
        for (const groupId of groupIds) {
          if (!plan.groupIds.includes(groupId)) {
            plan.groupIds.push(groupId);
          }
        }
        knownPlans.add(plan);
        plan.dependencies.forEach((depId) => {
          const dep = this.plans[depId];
          processPlan(dep);
        });
      }
    };

    const treeNodePlan = this.plans[planId];
    assert.ok(
      treeNodePlan != null,
      `Could not find the plan for path identity '${treeNode.pathIdentity}'`,
    );
    processPlan(treeNodePlan);

    treeNode.children.forEach((child) =>
      this.assignGroupIds(child, new Set([...knownPlans])),
    );
  }

  /**
   * Implements the `FinalizePlans` and `FinalizePlan` algorithms.
   */
  private finalizePlans(): void {
    const distinctActivePlansInReverseOrder = new Set<ExecutablePlan>();
    for (let i = this.plans.length - 1; i >= 0; i--) {
      const plan = this.plans[i];
      if (plan !== null) {
        // NOTE: checking the following would be redundant:
        // if (!distinctActivePlansInReverseOrder.has(plan))
        withGlobalState(
          {
            aether: this,
            parentPathIdentity: plan.parentPathIdentity,
          },
          () => {
            distinctActivePlansInReverseOrder.add(plan);
          },
        );
      }
    }
    for (const plan of distinctActivePlansInReverseOrder) {
      plan.finalize();
      assertFinalized(plan);
    }
  }

  /**
   * Finds a (the?) path from ancestorPlan to descendentPlan. Semi-expensive; try
   * and only use this at planning time, not execution time. Useful for tracking
   * down all the __ListItemPlans.
   */
  private findPath(
    ancestorPlan: ExecutablePlan<any>,
    descendentPlan: ExecutablePlan<any>,
  ): Array<ExecutablePlan<any>> | null {
    if (ancestorPlan === descendentPlan) {
      return [];
    }
    for (let i = 0, l = descendentPlan.dependencies.length; i < l; i++) {
      const depPlan = this.plans[descendentPlan.dependencies[i]];
      // Optimisation
      if (depPlan === ancestorPlan) {
        return [descendentPlan];
      }
      const p = this.findPath(ancestorPlan, depPlan);
      if (p) {
        return [...p, descendentPlan];
      }
    }
    return null;
  }

  /**
   * Implements `ExecutePlan`.
   */
  private async executePlan<T>(
    plan: ExecutablePlan<T>,
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
      const parentPlan = this.plans[plan.dependencies[0]] as ExecutablePlan<
        any[]
      >;
      // Evaluate parentPlan and then return the relevant index
      const parentResults = await this.executePlan<any[]>(
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
        const rawPendingResult = pendingResults[i];
        const j = pendingCrystalLayerObjectsIndexes[i];
        if (isPromise(rawPendingResult)) {
          try {
            result[j] = await rawPendingResult;
          } catch (e) {
            result[j] = new CrystalError(e);
          }
        } else {
          result[j] = rawPendingResult;
        }
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

  //----------------------------------------

  /**
   * Used to implement `GetValuePlanId`, but was rewritten to factor in that we
   * now key by crystal objects rather than id and indexes.
   *
   * @internal
   */
  public getValuePlanId<TData extends object>(
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
   * Get a plan without specifying who requested it; this disables all the
   * caller checks. Only intended to be called from internal code.
   *
   * @internal
   */
  public dangerouslyGetPlan(id: number): ExecutablePlan {
    return this.plans[id];
  }

  /**
   * Adds a plan to the known plans and returns the number to use as the plan
   * id. ONLY to be used from Plan, user code should never call this directly.
   *
   * @internal
   */
  public _addPlan(plan: ExecutablePlan): number {
    if (!["plan", "validate", "deduplicate", "optimize"].includes(this.phase)) {
      throw new Error(
        `Creating a plan during the '${this.phase}' phase is forbidden.`,
      );
    }
    return this.plans.push(plan) - 1;
  }

  /**
   * @internal
   */
  public newBatch(
    pathIdentity: string,
    returnType: GraphQLOutputType,
    crystalContext: CrystalContext,
  ): Batch {
    const sideEffectPlanIds =
      this.sideEffectPlanIdsByPathIdentity[pathIdentity];
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
    const sideEffectPlans =
      sideEffectPlanIds?.map(
        (sideEffectPlanId) => this.plans[sideEffectPlanId],
      ) ?? [];
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
      sideEffectPlans,
      plan,
      itemPlan,
      entries: [],
      returnType,
    };
    return batch;
  }

  /**
   * Implements `NewCrystalContext`.
   *
   * @internal
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
   *
   * @internal
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
   *
   * @internal
   */
  public async executeBatch(
    batch: Batch,
    crystalContext: CrystalContext,
  ): Promise<void> {
    // This guarantees nothing else will be added to the batch
    delete this.batchByPathIdentity[batch.pathIdentity];

    const { entries, sideEffectPlans, plan, itemPlan, returnType } = batch;
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

      const path = this.findPath(plan, itemPlan);
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
          const results = new Array(valuesLength).fill(null);
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
            results[valueIndex] = [];
            return layerResult.map(
              (_layerIndividualResult, layerResultIndex) => {
                valueIndexByNewValuesIndex.push(valueIndex);
                return newCrystalLayerObject(crystalObject, {
                  ...indexByListItemPlanId,
                  // TODO: when we implement `@stream` then this
                  // might not actually be the right index, we might
                  // need to add an offset?
                  [listItemPlanIdAtDepth[depth]]: layerResultIndex,
                });
              },
            );
          });
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
            if (data == null) {
              return null;
            }
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

      const crystalLayerObjects = crystalObjects.map((crystalObject) =>
        newCrystalLayerObject(
          crystalObject,
          crystalObject[$$indexByListItemPlanId],
        ),
      );

      // First, execute side effects (in order, *not* in parallel)
      const sideEffectCount = sideEffectPlans.length;
      for (let i = 0; i < sideEffectCount; i++) {
        const sideEffectPlan = sideEffectPlans[i];
        await this.executePlan(
          sideEffectPlan,
          crystalContext,
          crystalLayerObjects,
        );
      }

      // Now, execute the layers to get the result
      const results = await executeLayers(layers, crystalLayerObjects);

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
   * For debugging.
   *
   * @internal
   */
  public logPlans(why?: string): void {
    if (!debugPlanVerbose.enabled) {
      return;
    }
    const { plans } = this;
    const printDep = (depId: number) => {
      const actualDepId = this.plans[depId].id;
      if (actualDepId !== depId) {
        return (
          chalk.bold.gray.strikethrough(String(depId)) +
          " " +
          chalk.bold.yellow(String(actualDepId))
        );
      } else {
        return chalk.bold.yellow(String(actualDepId));
      }
    };
    debugPlanVerbose(
      "Plans%s: %s",
      why ? ` ${why}` : "",
      "\n" +
        plans
          .map((plan, id) => {
            const optimized = this.optimizedPlans.has(plan);
            if (!plan) {
              return null;
            } else if (plan.id !== id) {
              // return `- ${id}: ->${chalk.bold.yellow(String(plan.id))}`;
              return null;
            } else {
              return `- ${id}: ${
                (optimized ? "!!" : "  ") +
                plan.toString() +
                (plan.dependencies.length
                  ? ` (deps: ${plan.dependencies
                      .map((depId) => printDep(depId))
                      .join(", ")})`
                  : "")
              }`;
            }
          })
          .filter(isNotNullish)
          .join("\n"),
    );
  }

  /**
   * @internal
   */
  public logPlansByPath(why?: string): void {
    if (!debugPlanVerbose.enabled) {
      return;
    }
    this.logPlans(why);
    const pathIdentities = Object.keys(this.planIdByPathIdentity).sort(
      (a, z) => a.length - z.length,
    );
    const printed = new Set<string>();
    let depth = 0;
    const lines: string[] = [];
    const print = (pathIdentity: string, parentPathIdentity: string) => {
      if (printed.has(pathIdentity)) {
        return;
      }
      printed.add(pathIdentity);
      const planId = this.planIdByPathIdentity[pathIdentity];
      if (!planId) {
        throw new Error(`Corrupted plan, no id found for '${pathIdentity}'`);
      }
      const plan = this.plans[planId];
      lines.push(
        "  ".repeat(depth) +
          `${pathIdentity.substr(parentPathIdentity.length)}: ${plan}`,
      );
      depth++;
      for (const childPathIdentity of pathIdentities) {
        if (childPathIdentity.startsWith(pathIdentity + ">")) {
          print(childPathIdentity, pathIdentity);
        }
      }
      depth--;
    };
    for (const pathIdentity of pathIdentities) {
      print(pathIdentity, "");
    }

    debugPlanVerbose(
      `Plans by path%s: %s`,
      why ? ` ${why}` : "",
      "\n" + lines.join("\n"),
    );
  }

  //----------------------------------------

  public getPlan: (
    id: number,
    requestingPlan: ExecutablePlan,
  ) => ExecutablePlan = isDev
    ? (id, requestingPlan) => {
        if (
          !["plan", "validate", "deduplicate", "optimize"].includes(this.phase)
        ) {
          throw new Error(
            `Getting a plan during the '${this.phase}' phase is forbidden - please do so before or during the optimize phase.`,
          );
        }

        // TODO: check that requestingPlan is allowed to get plans
        if (this.optimizedPlans.has(requestingPlan)) {
          throw new Error(
            `Optimized plan ${requestingPlan} is not permitted to request other plans (requested '${id}')`,
          );
        }

        const plan = this.plans[id];
        if (plan == null) {
          throw new Error(
            `Programming error: plan with id '${id}' no longer exists`,
          );
        }
        return plan;
      }
    : (id, _requestingPlan) => this.plans[id];

  public isOptimized(plan: ExecutablePlan): boolean {
    return this.optimizedPlans.has(plan);
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

// IMPORTANT: this WILL NOT WORK when compiled down to ES5. It requires ES6+
// native class support.
class CrystalError extends Error {
  public readonly originalError: Error;
  constructor(originalError: Error) {
    const message = originalError?.message;
    super(message ? `CrystalError: ${message}` : `CrystalError`);
    this.originalError = originalError;
  }
}
