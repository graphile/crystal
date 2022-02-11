import chalk from "chalk";
import debugFactory from "debug";
import type {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLField,
  GraphQLInputField,
  GraphQLInputObjectType,
  GraphQLInputType,
  GraphQLNamedType,
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
  GraphQLScalarType,
  GraphQLUnionType,
  isInputObjectType,
  isInterfaceType,
  isLeafType,
  isListType,
  isNonNullType,
  isObjectType,
  isUnionType,
} from "graphql";
import { isAsyncIterable } from "iterall";
import { inspect } from "util";

import * as assert from "./assert";
import { GLOBAL_PATH, ROOT_PATH } from "./constants";
import type { Constraint } from "./constraints";
import {
  ansiPad,
  crystalPrint,
  crystalPrintPathIdentity,
} from "./crystalPrint";
import type { Deferred } from "./deferred";
import { defer } from "./deferred";
import { isDev } from "./dev";
import { withGlobalState } from "./global";
import { getDirectiveArg, graphqlCollectFields } from "./graphqlCollectFields";
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
  CrystalResultsList,
  FieldAndGroup,
  GroupedSelections,
  PlanOptions,
  PromiseOrDirect,
  TrackedArguments,
} from "./interfaces";
import {
  $$concreteType,
  $$crystalContext,
  $$data,
  $$isCrystalLayerObject,
  $$planResults,
} from "./interfaces";
import type {
  ListCapablePlan,
  ModifierPlan,
  PolymorphicPlan,
  StreamablePlan,
} from "./plan";
import {
  assertArgumentsFinalized,
  assertExecutablePlan,
  assertFinalized,
  assertModifierPlan,
  ExecutablePlan,
  isListCapablePlan,
  isStreamablePlan,
} from "./plan";
import type { PlanResultsBucket } from "./planResults";
import { PlanResults } from "./planResults";
import { __ItemPlan, __TrackedObjectPlan, __ValuePlan } from "./plans";
import { __ListTransformPlan } from "./plans/listTransform";
import { assertPolymorphicData } from "./polymorphic";
import {
  $$crystalWrapped,
  isCrystalWrapped,
  newCrystalObject,
} from "./resolvers";
import { stripAnsi } from "./stripAnsi";
import type { UniqueId } from "./utils";
import {
  arraysMatch,
  defaultValueToValueNode,
  isPromise,
  isPromiseLike,
  planGroupsOverlap,
  ROOT_VALUE_OBJECT,
  uid,
} from "./utils";

function NOOP() {}

const $$FINISHED: unique symbol = Symbol("finished");

type MapResult = (clo: CrystalLayerObject, data: any) => any;

/**
 * Describes the document tree that we're parsing; is populated by
 * planSelectionSet. Is mostly useful for determining the groupIds of the plans
 * during the tree shaking phase.
 *
 * @internal
 */

interface TreeNode {
  fieldPathIdentity: string;

  /**
   * Normally the same as fieldPathIdentity, but may have `[]` appended in the
   * case of lists.
   */
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

function crystalLayerObjectToString(this: CrystalLayerObject) {
  return chalk.bold.green(`CLO<${this.parentCrystalObject}>`);
}

function newCrystalLayerObject(
  parentCrystalObject: CrystalObject,
  planResults: PlanResults,
): CrystalLayerObject {
  return {
    toString: crystalLayerObjectToString,
    [$$isCrystalLayerObject]: true,
    parentCrystalObject,
    planResults,
  };
}

export function isCrystalLayerObject(obj: unknown): obj is CrystalLayerObject {
  return (
    typeof obj === "object" &&
    obj !== null &&
    (obj as any)[$$isCrystalLayerObject] === true
  );
}

const EMPTY_INDEXES = Object.freeze([] as number[]);
const EMPTY_ARRAY = Object.freeze([] as any[]);

// For logging indentation
let depth = 0;

const debugAether = debugFactory("crystal:aether");
const debugPlan_ = debugAether.extend("plan");
const debugPlanVerbose_ = debugPlan_.extend("verbose");
const debugExecute_ = debugAether.extend("execute");
const debugExecuteVerbose_ = debugExecute_.extend("verbose");

const depthWrap = (debugFn: debugFactory.Debugger) =>
  Object.assign(
    (t: string, ...args: any[]) => debugFn("  ".repeat(depth) + t, ...args),
    debugFn,
  );
const debugPlan = depthWrap(debugPlan_);
const debugExecute = depthWrap(debugExecute_);
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

interface FieldDigest {
  parentFieldDigest: FieldDigest | null;
  pathIdentity: string;
  itemPathIdentity: string;
  responseKey: string;
  returnType: GraphQLOutputType;
  namedReturnType: GraphQLNamedType & GraphQLOutputType;
  isPolymorphic: boolean;
  isLeaf: boolean;
  listDepth: number;
  returnRaw: boolean;
  planId: number;
  itemPlanId: number;
  /**
   * Important: this does **NOT** represent the response keys, it represents
   * all the fields that are selected on the child selection set - the same
   * response key might be represented multiple times for polymorphic fields.
   */
  childFieldDigests: null | FieldDigest[];
}

interface PrefetchConfig {
  fieldDigest: FieldDigest;
  plan: ExecutablePlan;
  itemPlan: ExecutablePlan;
}

/**
 * Implements the `NewAether` algorithm.
 */
export class Aether<
  TVariables extends BaseGraphQLVariables = any,
  TContext extends BaseGraphQLContext = any,
  TRootValue extends BaseGraphQLRootValue = any,
> {
  private phase: AetherPhase = "init";

  /**
   * @internal
   */
  public maxGroupId = 0;
  private rootTreeNode: TreeNode = {
    pathIdentity: ROOT_PATH,
    fieldPathIdentity: ROOT_PATH,
    groupIds: [0],
    parent: null,
    children: [],
  };

  private readonly plans: ExecutablePlan[] = [];

  /**
   * This value is ethemeral, it only contains values whilst a specific field
   * is being planned.
   *
   * @internal
   */
  public readonly modifierPlans: ModifierPlan<any>[] = [];

  /**
   * @internal
   */
  public readonly batchByPathIdentity: {
    [pathIdentity: string]: Batch | undefined;
  } = Object.create(null);

  /**
   * The plan id for the plan that represents the subscription (if any).
   *
   * @internal
   */
  public subscriptionPlanId: number | undefined;

  /**
   * The plan id for the plan that represents a single payload in the subscription stream (if any)
   *
   * @internal
   */
  public subscriptionItemPlanId: number | undefined;

  /**
   * The plan by path identity is the plan that will return the results that
   * the resolver at that plan identity should return.
   *
   * @internal
   */
  public readonly planIdByPathIdentity: {
    [pathIdentity: string]: number | undefined;
  };
  /**
   * @internal
   */
  public readonly isUnplannedByPathIdentity: {
    [pathIdentity: string]: boolean | undefined;
  };
  /**
   * Resolvers need a quick way of determining their path identity. Since the
   * parent object already knows its path identity, it's always going to be
   * something like `parentPathIdentity + something + TypeName.fieldAlias`,
   * where the something could be empty or `[]` or `[][]` or similar. This
   * lookup is responsible for doing that calculation for them.
   *
   * It also has the added advantage that the path identities will be a limited
   * set of constants, so string concatenation and the related garbage
   * collection costs will not be incurred.
   *
   * @internal
   */
  public readonly pathIdentityByParentPathIdentity: {
    [parentPathIdentity: string]: {
      [typeName: string]: {
        [fieldAlias: string]: string;
      };
    };
  } = Object.create(null);

  /**
   * Whereas `planIdByPathIdentity` references the plan that controls what a
   * field will resolve to, `itemPlanByPathIdentity` references the plan that
   * controls what child fields will receive as their `parent`/`source`
   * argument. When the field resolves to a type directly these will likely be
   * the same thing, but when a field returns a GraphQLList the itemPlan will
   * represent individual items within this (potentially nested) list.
   *
   * @internal
   */
  public readonly itemPlanIdByFieldPathIdentity: {
    [pathIdentity: string]: number | undefined;
  };

  /**
   * @internal
   */
  public readonly sideEffectPlanIdsByPathIdentity: {
    [pathIdentity: string]: number[];
  };

  /**
   * @internal
   */
  public readonly transformDependencyPlanIdByTransformPlanId: {
    [transformPlanId: number]: number;
  };

  /**
   * @internal
   */
  public readonly returnRawValueByPathIdentity: {
    [fieldPathIdentity: string]: boolean;
  };

  /**
   * @internal
   */
  public readonly fieldDigestByPathIdentity: {
    [pathIdentity: string]: FieldDigest;
  } = Object.create(null);
  /**
   * @internal
   */
  public readonly prefetchesForPathIdentity: {
    [pathIdentity: string]: {
      local: ExecutablePlan[];
      children: PrefetchConfig[];
    };
  } = Object.create(null);

  /**
   * The field at each given path identity may be in one or more groups; these
   * groups govern how the plans run (e.g. a plan will likely not optimise
   * itself into a parent plan in a different group). Groups are advanced by
   * features such as `@stream` and `@defer`. This behavior ensures that only
   * the logic required at each stage is executed at those stages.
   *
   * @internal
   */
  public readonly groupIdsByPathIdentity: {
    [pathIdentity: string]: number[] | undefined;
  };

  /**
   * @internal
   */
  public readonly valueIdByObjectByPlanId: {
    // This is just some object, we don't need to access anything about it.
    // Critically, though, it is an object (not an `unknown`).
    // eslint-disable-next-line @typescript-eslint/ban-types
    [planId: number]: WeakMap<object, UniqueId> | undefined;
  } = Object.create(null);

  private readonly planOptionsByPlan = new Map<ExecutablePlan, PlanOptions>();

  /**
   * @internal
   */
  public readonly variableValuesConstraints: Constraint[] = [];
  /**
   * @internal
   */
  public readonly variableValuesPlan: __ValuePlan<TVariables>;
  /**
   * @internal
   */
  public readonly trackedVariableValuesPlan: __TrackedObjectPlan<TVariables>;
  /**
   * @internal
   */
  public readonly contextConstraints: Constraint[] = [];
  /**
   * @internal
   */
  public readonly contextPlan: __ValuePlan<TContext>;
  /**
   * @internal
   */
  public readonly trackedContextPlan: __TrackedObjectPlan<TContext>;
  /**
   * @internal
   */
  public readonly rootValueConstraints: Constraint[] = [];
  /**
   * @internal
   */
  public readonly rootValuePlan: __ValuePlan<TRootValue>;
  /**
   * @internal
   */
  public readonly trackedRootValuePlan: __TrackedObjectPlan<TRootValue>;
  public readonly operationType: "query" | "mutation" | "subscription";
  public readonly queryTypeName: string;
  public readonly mutationTypeName: string | undefined;
  public readonly subscriptionTypeName: string | undefined;
  /**
   * @internal
   */
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
    const mutationType = this.schema.getMutationType();
    const subscriptionType = this.schema.getSubscriptionType();
    if (!queryType) {
      throw new Error(
        "This GraphQL schema does not support queries, it cannot be used.",
      );
    }
    this.queryTypeName = queryType.name;
    this.mutationTypeName = mutationType?.name;
    this.subscriptionTypeName = subscriptionType?.name;

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
    this.isUnplannedByPathIdentity = Object.create(null);
    this.itemPlanIdByFieldPathIdentity = Object.assign(Object.create(null), {
      [ROOT_PATH]: this.rootValuePlan.id,
    });
    this.sideEffectPlanIdsByPathIdentity = Object.create(null);
    this.transformDependencyPlanIdByTransformPlanId = Object.create(null);
    this.returnRawValueByPathIdentity = Object.create(null);
    this.groupIdsByPathIdentity = Object.assign(Object.create(null), {
      [ROOT_PATH]: [0],
    });
    this.operationType = operation.operation;
    this.pathIdentityByParentPathIdentity[ROOT_PATH] = {};
    try {
      switch (this.operationType) {
        case "query": {
          this.pathIdentityByParentPathIdentity[ROOT_PATH][this.queryTypeName] =
            {};
          this.planQuery();
          break;
        }
        case "mutation": {
          this.pathIdentityByParentPathIdentity[ROOT_PATH][
            this.mutationTypeName!
          ] = {};
          this.planMutation();
          break;
        }
        case "subscription": {
          this.pathIdentityByParentPathIdentity[ROOT_PATH][
            this.subscriptionTypeName!
          ] = {};
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
      console.error(`Error occurred during query planning: \n${e.stack || e}`);
      this.logPlansByPath();
      throw new Error(`Failed to plan this query.`);
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

    // Now assign the common ancestor paths so we can determine where to store
    // the data.
    this.assignCommonAncestorPathIdentity();

    // Plans are expected to execute later; they may take steps here to prepare
    // themselves (e.g. compiling SQL queries ahead of time).
    this.finalizePlans();

    // Log the plan now we're all done
    this.logPlansByPath("after optimization and finalization");

    this.phase = "ready";

    this.walkFinalizedPlans();
    this.preparePrefetches();
  }

  /**
   * Now that the plans are finalized, we can walk them and cache certain
   * useful information:
   *
   * - the full (recursive) list of dependencies
   * - the path between plans
   * - etc
   */
  private walkFinalizedPlans() {
    this.processPlans("walking", "dependencies-first", (plan) => {
      for (const depId of plan.dependencies) {
        // id may have changed, so get this plan
        const dep = this.dangerouslyGetPlan(depId);
        plan._recursiveDependencyIds.add(dep.id);
        for (const depdep of dep._recursiveDependencyIds) {
          plan._recursiveDependencyIds.add(depdep);
        }
      }
      return plan;
    });
  }

  private preparePrefetches() {
    // Work through all the path identities, making sure that parents are
    // processed before children.
    const pathIdentities = Object.keys(this.fieldDigestByPathIdentity).sort(
      (a, z) => a.length - z.length,
    );
    for (const pathIdentity of pathIdentities) {
      const fieldDigest = this.fieldDigestByPathIdentity[pathIdentity];
      this.prefetchesForPathIdentity[pathIdentity] = Object.assign(
        Object.create(null),
        { local: [], children: [] },
      );
      if (fieldDigest.isPolymorphic) {
        // More than one match for each responseKey; may need special handling
        continue;
      }
      if (this.isUnplannedByPathIdentity[pathIdentity]) {
        continue;
      }
      const itemPlan = this.dangerouslyGetPlan(fieldDigest.itemPlanId);

      // Find all the plans that should already have been executed by now (i.e. have been executed by parent fields)
      const executedPlanIds = new Set<number>();
      let ancestorFieldDigest: FieldDigest | null = fieldDigest;
      while (ancestorFieldDigest) {
        if (this.isUnplannedByPathIdentity[ancestorFieldDigest.pathIdentity]) {
          break;
        }
        const ancestorItemPlan = this.dangerouslyGetPlan(
          ancestorFieldDigest.itemPlanId,
        );
        for (const id of ancestorItemPlan._recursiveDependencyIds) {
          executedPlanIds.add(id);
        }
        const prefetchConfig =
          this.prefetchesForPathIdentity[ancestorFieldDigest.pathIdentity];
        for (const localPlan of prefetchConfig.local) {
          executedPlanIds.add(localPlan.id);
        }
        ancestorFieldDigest = ancestorFieldDigest.parentFieldDigest;
      }

      /*
       * Sometimes there's plans that are defined at this level but they aren't
       * needed to be executed until later - for example a connection field
       * typically doesn't actually _do_ anything, it's the `edges` or
       * `pageInfo` child fields that do the work.
       *
       * In order for us to benefit from the synchronous optimizations in the
       * resolver we want to pull these executions up to this level so that the
       * children can resolve synchronously.
       */
      const plansAtThisLevel = this.plans.filter(
        (p) =>
          p != null &&
          p.commonAncestorPathIdentity === fieldDigest.itemPathIdentity &&
          !executedPlanIds.has(p.id),
      );
      if (plansAtThisLevel.length) {
        for (const plan of plansAtThisLevel) {
          this.prefetchesForPathIdentity[pathIdentity].local.push(plan);
          executedPlanIds.add(plan.id);
        }
      }

      // Now look at the children that we can maybe run ahead of time.
      if (fieldDigest.childFieldDigests) {
        for (const childFieldDigest of fieldDigest.childFieldDigests) {
          if (this.isUnplannedByPathIdentity[childFieldDigest.pathIdentity]) {
            continue;
          }
          const childPlan = this.dangerouslyGetPlan(childFieldDigest.planId);
          const childItemPlan = this.dangerouslyGetPlan(
            childFieldDigest.itemPlanId,
          );

          // Only prefetch plans in the same group
          if (
            !planGroupsOverlap(itemPlan, childPlan) ||
            !planGroupsOverlap(itemPlan, childItemPlan)
          ) {
            continue;
          }

          // Don't prefetch async/side-effect plans
          // Find all the planIds that itemPlan won't already have executed
          const intermediatePlanIds = [
            ...childItemPlan._recursiveDependencyIds.values(),
          ].filter((id) => !executedPlanIds.has(id));
          const intermediatePlans = intermediatePlanIds.map((id) =>
            this.dangerouslyGetPlan(id),
          );
          const asyncOrSideEffectPlans = intermediatePlans.filter(
            (plan) => !plan.sync || plan.hasSideEffects,
          );
          if (asyncOrSideEffectPlans.length > 0) {
            continue;
          }

          this.prefetchesForPathIdentity[pathIdentity].children.push({
            fieldDigest: childFieldDigest,
            plan: childPlan,
            itemPlan: childItemPlan,
          });
        }
      }
    }
  }

  /**
   * Implements the `PlanAetherQuery` algorithm.
   */
  private planQuery(): void {
    const rootType = this.schema.getQueryType();
    if (!rootType) {
      throw new Error("No query type found in schema");
    }
    this.finalizeArgumentsSince(0, ROOT_PATH);
    this.planSelectionSet(
      ROOT_PATH,
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
    this.finalizeArgumentsSince(0, ROOT_PATH);
    this.planSelectionSet(
      ROOT_PATH,
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
        subscriptionPlanResolver(this.trackedRootValuePlan, trackedArguments, {
          schema: this.schema,
        }),
      );
      this.subscriptionPlanId = subscribePlan.id;

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

      // TODO: this is a LIE! This should be `ROOT_PATH + "[]"` but that breaks
      // everything... We've worked around it elsewhere, but maybe all path
      // identities inside a subscription operation should assume ROOT_PATH of
      // `~[]` rather than `~`?
      const nestedParentPathIdentity = ROOT_PATH;
      const streamItemPlan = withGlobalState(
        { aether: this, parentPathIdentity: ROOT_PATH },
        () => subscribePlan.itemPlan(new __ItemPlan(subscribePlan)),
      );
      this.subscriptionItemPlanId = streamItemPlan.id;
      this.finalizeArgumentsSince(0, ROOT_PATH);
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
      this.fieldDigestByPathIdentity[ROOT_PATH] = fieldDigests[0];
    } else {
      const subscribePlan = this.trackedRootValuePlan;
      this.subscriptionPlanId = subscribePlan.id;
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
      this.fieldDigestByPathIdentity[ROOT_PATH] = fieldDigests[0];
    }
  }

  /**
   * Implements the `PlanSelectionSet` algorithm, and also
   * `GetPolymorphicObjectPlanForType`.
   */
  private planSelectionSet(
    path: string,
    parentFieldPathIdentity: string,
    parentPlan: ExecutablePlan,
    objectType: GraphQLObjectType,
    groupedSelectionsList: GroupedSelections[],
    parentTreeNode: TreeNode,
    isMutation = false,
  ): { fieldDigests: FieldDigest[] } {
    assertObjectType(objectType);
    const groupedFieldSet = graphqlCollectFields(
      this,
      objectType,
      groupedSelectionsList,
      isMutation,
    );
    const objectTypeFields = objectType.getFields();
    const fieldDigests: FieldDigest[] = [];
    for (const [responseKey, fieldAndGroups] of groupedFieldSet.entries()) {
      const pathIdentity = `${path}>${objectType.name}.${responseKey}`;
      if (
        isDev &&
        this.pathIdentityByParentPathIdentity[parentFieldPathIdentity][
          objectType.name
        ][responseKey] != null
      ) {
        throw new Error(
          `Attempted to overwrite pathIdentityByParentPathIdentity[${parentFieldPathIdentity}][${objectType.name}][${responseKey}]`,
        );
      }
      this.pathIdentityByParentPathIdentity[parentFieldPathIdentity][
        objectType.name
      ][responseKey] = pathIdentity;

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
       *      - Pass through a `__ValuePlan` representing the parent value.
       *    - Else, if fieldHasPlan:
       *      - Pass through a `__ValuePlan` representing the parent value.
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
       *          want to use an `ObjectPlan` so that the parent object is of
       *          the expected shape; e.g. your plan might return
       *          `object({username: $username})` for a `User.username` field.
       *    - Else
       *      - Leave `resolve()` untouched - do not even wrap it.
       *      - (Failing that, use a __ValuePlan and return the result
       *        directly.)
       */

      /**
       * This could be the crystal resolver or a user-supplied resolver or
       * nothing.
       */
      const rawResolver = objectField.resolve;

      const typePlan = objectType.extensions?.graphile?.Plan;
      const namedReturnType = getNamedType(fieldType);
      const namedResultTypeIsLeaf = isLeafType(namedReturnType);

      /**
       * This will never be the crystal resolver - only ever the user-supplied
       * resolver or nothing
       */
      const graphqlResolver =
        rawResolver && isCrystalWrapped(rawResolver)
          ? rawResolver[$$crystalWrapped].original
          : rawResolver;
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
          } expects a ${typePlan.name || "ExecutablePlan"} however field ${
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

      this.returnRawValueByPathIdentity[pathIdentity] = returnRaw;

      let plan: ExecutablePlan | PolymorphicPlan;
      this.sideEffectPlanIdsByPathIdentity[pathIdentity] = [];
      if (typeof planResolver === "function") {
        const oldPlansLength = this.plans.length;
        const wgs = withGlobalState.bind(null, {
          aether: this,
          parentPathIdentity: path,
          currentGraphQLType: fieldType,
        }) as <T>(cb: () => T) => T;
        const trackedArguments = wgs(() =>
          this.getTrackedArguments(objectType, field),
        );
        plan = wgs(() =>
          planResolver(parentPlan, trackedArguments, {
            schema: this.schema,
          }),
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
        const streamDirective = firstField.directives?.find(
          (d) => d.name.value === "stream",
        );

        const planOptions: PlanOptions = {
          stream:
            streamDirective && isStreamablePlan(plan)
              ? {
                  initialCount:
                    Number(
                      getDirectiveArg(
                        field,
                        "stream",
                        "initialCount",
                        this.trackedVariableValuesPlan,
                      ),
                    ) || 0,
                }
              : null,
        };
        this.planOptionsByPlan.set(plan, planOptions);

        const newPlansLength = this.plans.length;
        debugPlanVerbose(
          "Created %o new plans whilst processing %p",
          newPlansLength - oldPlansLength,
          pathIdentity,
        );

        this.finalizeArgumentsSince(oldPlansLength, pathIdentity, true);

        // Now that the field has been planned (including arguments, but NOT
        // including selection set) we can deduplicate it to see if any of its
        // peers are identical.
        this.deduplicatePlans(oldPlansLength);
      } else {
        // There's no plan resolver; use the parent plan
        plan = parentPlan;
        this.isUnplannedByPathIdentity[pathIdentity] = true;
      }

      this.planIdByPathIdentity[pathIdentity] = plan.id;

      const treeNode: TreeNode = {
        fieldPathIdentity: pathIdentity,
        pathIdentity,
        groupIds,
        parent: parentTreeNode,
        children: [],
      };
      parentTreeNode.children.push(treeNode);

      if (!namedResultTypeIsLeaf) {
        this.pathIdentityByParentPathIdentity[pathIdentity] = {};
      }

      // Now we're building the child plans, the parentPathIdentity becomes
      // actually our identity.
      const { itemPlan, listDepth, childFieldDigests, itemPathIdentity } =
        this.planFieldReturnType(
          fieldType,
          fieldAndGroups,
          pathIdentity,
          pathIdentity,
          plan,
          treeNode,
          returnRaw && !namedResultTypeIsLeaf,
          namedResultTypeIsLeaf,
        );
      this.itemPlanIdByFieldPathIdentity[pathIdentity] = itemPlan.id;

      const isPolymorphic =
        isInterfaceType(namedReturnType) || isUnionType(namedReturnType);
      const isLeaf = isLeafType(namedReturnType);
      if (!isLeaf && !isPolymorphic) {
        assertObjectType(namedReturnType);
      }

      const fieldDigest: FieldDigest = {
        parentFieldDigest: null,
        pathIdentity,
        itemPathIdentity,
        responseKey,
        returnType: fieldType,
        namedReturnType: namedReturnType,
        returnRaw,
        isPolymorphic,
        isLeaf,
        planId: plan.id,
        itemPlanId: itemPlan.id,
        listDepth,
        childFieldDigests,
      };
      if (childFieldDigests) {
        childFieldDigests.forEach((child) => {
          child.parentFieldDigest = fieldDigest;
        });
      }

      this.fieldDigestByPathIdentity[pathIdentity] = fieldDigest;
      fieldDigests.push(fieldDigest);
    }

    return { fieldDigests };
  }

  private finalizeArgumentsSince(
    oldPlansLength: number,
    pathIdentity: string,
    allowSideEffects = false,
  ): void {
    for (let i = oldPlansLength, l = this.plans.length; i < l; i++) {
      const newPlan = this.plans[i];
      // If the newPlan still exists, finalize it with respect to arguments (once only).
      if (newPlan != null && this.plans[newPlan.id] === newPlan) {
        if (newPlan.hasSideEffects && !allowSideEffects) {
          throw new Error(
            `Side effects are not allowed here - attempted to execute side effects in ${newPlan} @ ${pathIdentity}`,
          );
        }
        if (newPlan.hasSideEffects) {
          this.sideEffectPlanIdsByPathIdentity[pathIdentity].push(newPlan.id);
        }

        if (newPlan instanceof __ListTransformPlan) {
          const listPlan = newPlan.getListPlan();
          const nestedParentPathIdentity = pathIdentity + `@${newPlan.id}[]`;
          const wgs = withGlobalState.bind(null, {
            aether: this,
            parentPathIdentity: nestedParentPathIdentity,
          }) as <T>(cb: () => T) => T;
          const itemPlan = wgs(() => {
            const $__listItem = new __ItemPlan(listPlan);
            const $listItem = listPlan.listItem?.($__listItem) ?? $__listItem;
            const $newListItem = newPlan.itemPlanCallback($listItem);
            if (
              newPlan.sync &&
              (!$__listItem.sync || !$listItem.sync || !$newListItem.sync)
            ) {
              // TODO: log this deopt?
              newPlan.sync = false;
            }
            return $newListItem;
          });

          // For logging only
          this.planIdByPathIdentity[nestedParentPathIdentity] = itemPlan.id;

          // TODO: if newPlan gets deduplicated, will this lookup be broken?
          this.transformDependencyPlanIdByTransformPlanId[newPlan.id] =
            itemPlan.id;
        }

        {
          const wgs = withGlobalState.bind(null, {
            aether: this,
            parentPathIdentity: newPlan.parentPathIdentity,
          }) as <T>(cb: () => T) => T;
          wgs(() => {
            // TODO: rename finalizeArguments; maybe argumentsFinalized or lockParameters or lock?
            newPlan.finalizeArguments();
          });
        }
        assertArgumentsFinalized(newPlan);
      }
    }
  }

  /**
   * This algorithm wasn't originally planned, but we should not have jumped
   * straight to getNamedType in the plan. This method lets us walk the type
   * tree and add in `__ItemPlan`s in the relevant places so that we can refer
   * to individual values within lists.
   *
   * Note this handles both leaf types and branch types.
   */
  private planFieldReturnType(
    fieldType: GraphQLOutputType,
    fieldAndGroups: FieldAndGroup[],
    fieldPathIdentity: string,
    pathIdentity: string,
    plan: ExecutablePlan<any>,
    treeNode: TreeNode,
    useValuePlan: boolean,
    isLeaf: boolean,
    listDepth = 0,
  ): {
    listDepth: number;
    itemPlan: ExecutablePlan<any>;
    childFieldDigests: FieldDigest[] | null;
    itemPathIdentity: string;
  } {
    if (isDev) {
      assert.strictEqual(
        isLeaf,
        isLeafType(getNamedType(fieldType)),
        "isLeaf is incorrect",
      );
    }
    if (fieldType instanceof GraphQLNonNull) {
      // TODO: we could implement a __NonNullPlan in future; currently we just
      // defer that to GraphQL.js
      return this.planFieldReturnType(
        fieldType.ofType,
        fieldAndGroups,
        fieldPathIdentity,
        pathIdentity,
        plan,
        treeNode,
        useValuePlan,
        isLeaf,
        listDepth,
      );
    } else if (fieldType instanceof GraphQLList) {
      const nestedParentPathIdentity = pathIdentity + "[]";
      const nestedTreeNode: TreeNode = {
        fieldPathIdentity,
        pathIdentity: nestedParentPathIdentity,
        groupIds: treeNode.groupIds,
        parent: treeNode,
        children: [],
      };
      treeNode.children.push(nestedTreeNode);
      const oldPlansLength = this.plans.length;

      // TODO: transform?
      const listItemPlan = withGlobalState(
        {
          aether: this,
          parentPathIdentity: nestedParentPathIdentity,
          currentGraphQLType: fieldType,
        },
        isListCapablePlan(plan)
          ? () =>
              (plan as ListCapablePlan<any>).listItem(
                new __ItemPlan(plan, listDepth),
              )
          : () => new __ItemPlan(plan, listDepth),
      );
      this.finalizeArgumentsSince(oldPlansLength, nestedParentPathIdentity);

      this.planIdByPathIdentity[nestedParentPathIdentity] = listItemPlan.id;
      return this.planFieldReturnType(
        fieldType.ofType,
        fieldAndGroups,
        fieldPathIdentity,
        nestedParentPathIdentity,
        listItemPlan,
        nestedTreeNode,
        useValuePlan,
        isLeaf,
        listDepth + 1,
      );
    } else if (useValuePlan) {
      // We don't do this check first because we need the TreeNode manipulation
      // to have already taken place due to lists/etc.

      const oldPlansLength = this.plans.length;
      const valuePlan = withGlobalState(
        { aether: this, parentPathIdentity: pathIdentity },
        () => new __ValuePlan(),
      );
      this.finalizeArgumentsSince(oldPlansLength, pathIdentity);

      // Explicitly populate the groupIds because we don't get our own path
      // identity in `planIdByPathIdentity` and thus `assignGroupIds` will not
      // run against us.
      valuePlan.groupIds.push(...treeNode.groupIds);

      return this.planFieldReturnType(
        fieldType,
        fieldAndGroups,
        fieldPathIdentity,
        pathIdentity,
        valuePlan,
        treeNode,
        false,
        isLeaf,
        listDepth,
      );
    }
    const wgs = withGlobalState.bind(null, {
      aether: this,
      parentPathIdentity: pathIdentity,
    }) as <T>(cb: () => T) => T;
    let childFieldDigests: FieldDigest[] | null;
    if (
      fieldType instanceof GraphQLObjectType ||
      fieldType instanceof GraphQLInterfaceType ||
      fieldType instanceof GraphQLUnionType
    ) {
      const groupedSubSelections = graphqlMergeSelectionSets(fieldAndGroups);
      if (fieldType instanceof GraphQLObjectType) {
        if (isDev) {
          // Check that the plan we're dealing with is the one the user declared
          const ExpectedPlan = fieldType.extensions?.graphile?.Plan;
          if (ExpectedPlan && !(plan instanceof ExpectedPlan)) {
            this.logPlansByPath();
            throw new Error(
              `Plan mis-match: expected ${
                ExpectedPlan.name
              } at '${pathIdentity}', but instead found ${
                (plan as ExecutablePlan).constructor.name
              } (${plan})`,
            );
          }
        }
        if (
          isDev &&
          this.pathIdentityByParentPathIdentity[fieldPathIdentity][
            fieldType.name
          ]
        ) {
          throw new Error(
            "Attempted to overwrite entry in pathIdentityByParentPathIdentity",
          );
        }
        this.pathIdentityByParentPathIdentity[fieldPathIdentity][
          fieldType.name
        ] = {};
        const { fieldDigests } = this.planSelectionSet(
          pathIdentity,
          fieldPathIdentity,
          plan,
          fieldType as GraphQLObjectType,
          groupedSubSelections,
          treeNode,
          false,
        );
        childFieldDigests = fieldDigests;
      } else {
        assertPolymorphicPlan(plan, pathIdentity);
        const polymorphicPlan = plan;
        const fieldDigestsSet = new Set<FieldDigest>();
        const planPossibleObjectTypes = (
          possibleObjectTypes: readonly GraphQLObjectType[],
        ): void => {
          for (let i = 0, l = possibleObjectTypes.length; i < l; i++) {
            const possibleObjectType = possibleObjectTypes[i];

            const oldPlansLength = this.plans.length;
            // This line implements `GetPolymorphicObjectPlanForType`.
            const subPlan = wgs(() =>
              polymorphicPlan.planForType(possibleObjectType),
            );
            this.finalizeArgumentsSince(oldPlansLength, pathIdentity);
            if (
              isDev &&
              this.pathIdentityByParentPathIdentity[fieldPathIdentity][
                possibleObjectType.name
              ]
            ) {
              throw new Error(
                "Attempted to overwrite entry in pathIdentityByParentPathIdentity",
              );
            }
            this.pathIdentityByParentPathIdentity[fieldPathIdentity][
              possibleObjectType.name
            ] = {};

            const { fieldDigests: localFieldDigests } = this.planSelectionSet(
              pathIdentity,
              fieldPathIdentity,
              subPlan,
              possibleObjectType,
              groupedSubSelections,
              treeNode,
              false,
            );
            for (const localFieldDigest of localFieldDigests) {
              fieldDigestsSet.add(localFieldDigest);
            }
          }
        };
        if (fieldType instanceof GraphQLUnionType) {
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
            fieldType instanceof GraphQLInterfaceType,
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
        childFieldDigests = [...fieldDigestsSet.values()];
      }
    } else if (fieldType instanceof GraphQLScalarType) {
      const scalarPlanResolver = fieldType.extensions?.graphile?.plan;
      if (typeof scalarPlanResolver === "function") {
        plan = wgs(() => scalarPlanResolver(plan, { schema: this.schema }));
      }
      childFieldDigests = null;
    } else {
      // Enum?
      childFieldDigests = null;
    }
    return {
      listDepth,
      itemPlan: plan,
      childFieldDigests,
      itemPathIdentity: pathIdentity,
    };
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
            { schema: this.schema },
          );
          if (argPlan != null) {
            // TODO: why did I add this? Is it required? Seems important, but
            // also makes writing the schema a bit more painful.
            /*
            assertModifierPlan(
              argPlan,
              `${_objectType.name}.${fieldSpec.name}(${argName}:)`,
            );
            */

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
      const inputFieldPlan = planResolver(parentPlan, trackedValuePlan, {
        schema: this.schema,
      });
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
    this.assignGroupIds(startingAtPlanId);
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
      const oldPlansLength = this.plans.length;
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

      // TODO: what pathIdentity should this be?
      this.finalizeArgumentsSince(oldPlansLength, ROOT_PATH);

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

    const planOptions = this.planOptionsByPlan.get(plan);
    const shouldStream = !!planOptions?.stream;
    if (shouldStream) {
      // Never deduplicate streaming plans, we cannot reference the stream more
      // than once (and we aim to not cache the stream because we want its
      // entries to be garbage collected).
      return plan;
    }

    const seenIds = new Set();
    seenIds.add(plan.id);
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

    // TODO: should we keep this optimisation, or should we remove it so that
    // plans that are "smarter" than us can return replacement plans even if
    // they're not peers?
    if (peers.length === 0) {
      return plan;
    }

    // Sort the peers so the one with the lowest id comes first - this is the
    // one we'd rather substitute with.
    peers.sort((a, z) => {
      return a.id - z.id;
    });

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
    const options = this.planOptionsByPlan.get(plan);
    const replacementPlan = plan.optimize({ stream: options?.stream ?? null });
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

    // The root subscription plan, if any, should be marked as active
    if (this.subscriptionItemPlanId) {
      const plan = this.plans[this.subscriptionItemPlanId];
      this.markPlanActive(plan, activePlans);
    }

    // NOTE: every plan referenced in this.planIdByPathIdentity is included in
    // this.itemPlanIdByFieldPathIdentity, but the reverse is not true.
    for (const pathIdentity in this.itemPlanIdByFieldPathIdentity) {
      const planId = this.itemPlanIdByFieldPathIdentity[pathIdentity];
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

    // Mark all plans used in transforms as active.
    const planIds = Object.values(
      this.transformDependencyPlanIdByTransformPlanId,
    );
    for (const planId of planIds) {
      const plan = this.plans[planId];
      if (isDev) {
        assert.ok(plan, `Could not find plan for identifier '${planId}'`);
      }
      this.markPlanActive(plan, activePlans);
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

  private walkTreeFirstPlanUsages(
    callback: (treeNode: TreeNode, plan: ExecutablePlan) => void,
  ) {
    const recurse = (treeNode: TreeNode, knownPlans: Set<ExecutablePlan>) => {
      const processPlan = (plan: ExecutablePlan): void => {
        if (!knownPlans.has(plan)) {
          // Must come first to avoid race conditions
          if (plan instanceof __ListTransformPlan) {
            // TODO: this entire `if` statement is a big hack; we should add transforms to the treeNode elsewhere...
            const transformPathIdentity =
              treeNode.pathIdentity + `@${plan.id}[]`;
            if (
              !treeNode.children.some(
                (c) => c.pathIdentity === transformPathIdentity,
              )
            ) {
              const transformTreeNode: TreeNode = {
                parent: treeNode,
                pathIdentity: transformPathIdentity,
                children: [],
                groupIds: treeNode.groupIds,
                fieldPathIdentity: treeNode.fieldPathIdentity,
              };
              treeNode.children.push(transformTreeNode);
              const depId =
                this.transformDependencyPlanIdByTransformPlanId[plan.id];
              this.planIdByPathIdentity[transformTreeNode.pathIdentity] = depId;
            }
          }

          callback(treeNode, plan);
          knownPlans.add(plan);
          plan.dependencies.forEach((depId) => {
            const dep = this.plans[depId];
            processPlan(dep);
          });
        }
      };

      if (!treeNode.parent) {
        if (this.subscriptionPlanId) {
          const subscriptionPlan = this.plans[this.subscriptionPlanId];
          assert.ok(
            subscriptionPlan != null,
            `Could not find the plan for the subscription`,
          );
          processPlan(subscriptionPlan);
        }
      }

      const treeNodePlanId = this.planIdByPathIdentity[treeNode.pathIdentity];
      assert.ok(
        treeNodePlanId != null,
        `Could not determine the item plan id for path identity '${treeNode.pathIdentity}'`,
      );
      const treeNodePlan = this.plans[treeNodePlanId];
      assert.ok(
        treeNodePlan != null,
        `Could not find the plan for path identity '${treeNode.pathIdentity}'`,
      );
      processPlan(treeNodePlan);

      treeNode.children.forEach((child) => recurse(child, new Set(knownPlans)));
    };

    recurse(this.rootTreeNode, new Set());
  }

  /**
   * We want to know the shallowest paths in each branch of the tree that each
   * plan is used, and then extract the groupIds from these. This helps us to
   * know when plans can and cannot be optimised (e.g. merged together).
   */
  private assignGroupIds(_startingAtPlanId = 0) {
    this.walkTreeFirstPlanUsages((treeNode, plan) => {
      const groupIds = this.groupIdsByPathIdentity[treeNode.fieldPathIdentity];
      assert.ok(
        groupIds != null,
        `Could not determine the group ids for path identity '${treeNode.fieldPathIdentity}'`,
      );
      for (const groupId of groupIds) {
        if (!plan.groupIds.includes(groupId)) {
          plan.groupIds.push(groupId);
        }
      }
    });
  }

  /**
   * We want to know the shallowest paths in each branch of the tree that each
   * plan is used, and then find the deepest common ancestor field for these
   * fields without crossing a `__ItemPlan` boundary from the plan itself.
   * This will then give us the pathIdentity under which we will store the data
   * this plan produces on execution - this means we can store the data with
   * the CrystalObject and that data can be released automatically by the
   * JavaScript garbage collector once the crystal object is no longer needed.
   */
  private assignCommonAncestorPathIdentity() {
    const treeNodesByPlan = new Map<ExecutablePlan, TreeNode[]>();
    this.walkTreeFirstPlanUsages((treeNode, plan) => {
      const treeNodes = treeNodesByPlan.get(plan) || [];
      treeNodesByPlan.set(plan, treeNodes);
      treeNodes.push(treeNode);
    });
    for (const [plan, treeNodes] of treeNodesByPlan.entries()) {
      const allPaths = treeNodes.map((treeNode) =>
        treeNodePath(treeNode, plan.parentPathIdentity),
      );
      // Find the largest `i` for which `allPaths[*][i]` is the same
      let deepestCommonPath = -1;
      matchLoop: for (let i = 0; i < allPaths[0].length; i++) {
        const matcher = allPaths[0][i];
        for (let j = 1; j < allPaths.length; j++) {
          // Note this also handles arrays that are shorter, we don't need special handling for that.
          if (allPaths[j][i] !== matcher) {
            break matchLoop;
          }
        }
        deepestCommonPath = i;
      }
      if (deepestCommonPath < 0) {
        throw new Error(
          `GraphileInternalError<aac23403-3a32-4e04-a9f2-b19229e3dbfd>: the root tree node should be in common with every path (whilst trying to find the deepestCommonPath for ${plan})`,
        );
      }
      const commonAncestorNode = allPaths[0][deepestCommonPath];
      plan.commonAncestorPathIdentity = commonAncestorNode.pathIdentity;
    }

    // Assert it worked
    if (isDev) {
      let firstInvalidPlan: any = null;
      for (const plan of this.plans) {
        if (
          plan &&
          plan.commonAncestorPathIdentity === "" &&
          plan.parentPathIdentity !== ""
        ) {
          firstInvalidPlan = firstInvalidPlan ?? plan;
          console.warn(
            `WARNING: Plan ${plan} has empty commonAncestorPathIdentity`,
          );
        }
      }
      if (firstInvalidPlan) {
        throw new Error(
          `GraphileInternalError<1398689a-8285-4dd9-8e6c-25216258f275>: Failed to assign commonAncestorPathIdentity to ${firstInvalidPlan} (parentPathIdentity = '${firstInvalidPlan.parentPathIdentity}')`,
        );
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
   * Finds a (the?) path from ancestorPlan to descendentPlan. Semi-expensive, so
   * caches results.  Useful for tracking down all the `__ItemPlan`s.
   */
  private findPath(
    ancestorPlan: ExecutablePlan<any>,
    descendentPlan: ExecutablePlan<any>,
  ): ReadonlyArray<ExecutablePlan<any>> | null {
    const known = ancestorPlan._pathByDescendent.get(descendentPlan);
    if (known !== undefined) {
      return known;
    } else if (ancestorPlan === descendentPlan) {
      return EMPTY_ARRAY;
    } else if (descendentPlan instanceof __ValuePlan) {
      return EMPTY_ARRAY;
    } else if (this.phase !== "ready") {
      throw new Error("Only call findPath when aether is ready");
    }

    for (let i = 0, l = descendentPlan.dependencies.length; i < l; i++) {
      const depPlan = this.plans[descendentPlan.dependencies[i]];
      // Optimisation
      if (depPlan === ancestorPlan) {
        const path = [descendentPlan];
        ancestorPlan._pathByDescendent.set(descendentPlan, path);
        return path;
      }
      const p = this.findPath(ancestorPlan, depPlan);
      if (p) {
        const path = [...p, descendentPlan];
        ancestorPlan._pathByDescendent.set(descendentPlan, path);
        return path;
      }
    }
    ancestorPlan._pathByDescendent.set(descendentPlan, null);
    return null;
  }

  counter = 1;
  private executePlan<T>(
    plan: ExecutablePlan<T>,
    crystalContext: CrystalContext,
    planResultses: ReadonlyArray<null | PlanResults>,
    visitedPlans = new Set<ExecutablePlan>(),
    depth = 0,
  ): PromiseOrDirect<any[]> {
    let timeString: string | null = null;
    if (debugExecute.enabled) {
      timeString = `plan\t${this.counter++}\t${plan}`;
      console.time(timeString);
    }
    const result = this.executePlanAlt(
      plan,
      crystalContext,
      planResultses,
      visitedPlans,
      depth,
    );
    if (timeString) {
      Promise.resolve(result).then(() => {
        console.timeEnd(timeString!);
      });
    }

    return result;
  }

  /**
   * Implements `ExecutePlan`.
   *
   * @remarks `await` is forbidden to avoid race conditions
   */
  private executePlanAlt<T>(
    plan: ExecutablePlan<T>,
    crystalContext: CrystalContext,
    planResultses: ReadonlyArray<null | PlanResults>,
    visitedPlans = new Set<ExecutablePlan>(),
    depth = 0,
  ): PromiseOrDirect<any[]> {
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
        `ExecutablePlan execution recursion error: attempted to execute ${plan} again`,
      );
    }
    visitedPlans.add(plan);
    if (plan instanceof __ItemPlan) {
      // Shortcut evaluation because __ItemPlan cannot be executed.
      return planResultses.map((planResults) =>
        planResults == null
          ? null
          : planResults.get(plan.commonAncestorPathIdentity, plan.id),
      );
    }

    const planResultsesLength = planResultses.length;
    const result = new Array(planResultsesLength);

    // Though we've been passed a list of planResultses (some of which may be
    // null), we don't actually need to execute for all of these. The common
    // denominator is actually the unique "buckets" inside the planResultses
    // that represent the plan's commonAncestorPathIdentity.
    type PlanResultsAndIndex = {
      planResults: PlanResults;
      planResultsesIndex: number;
    };
    const planResultsesByBucket = new Map<
      PlanResultsBucket,
      Array<PlanResultsAndIndex>
    >();
    const commonAncestorPathIdentity = plan.commonAncestorPathIdentity;
    for (
      let planResultsesIndex = 0;
      planResultsesIndex < planResultsesLength;
      planResultsesIndex++
    ) {
      const planResults = planResultses[planResultsesIndex];
      if (planResults == null) {
        // It was null, it stays null
        result[planResultsesIndex] = null;
        continue;
      }
      const bucket = planResults.getBucket(commonAncestorPathIdentity);
      const list = planResultsesByBucket.get(bucket);
      if (!list) {
        planResultsesByBucket.set(bucket, [
          { planResults, planResultsesIndex },
        ]);
      } else {
        list.push({ planResults, planResultsesIndex });
      }
    }

    // From here on out we're going to deal with the buckets until we tie it
    // all back together again at the end.

    debugExecute(
      "%sExecutePlan(%c): executing with %o plan results",
      indent,
      plan,
      planResultsesLength,
    );

    const pendingPlanResultsAndIndexListList: Array<PlanResultsAndIndex[]> = []; // Length unknown

    // Collect uncompleted resultses
    for (const [bucket, bucketPlanResultses] of planResultsesByBucket) {
      // All planResults with the same bucket are equivalent as far as we're
      // concerned.
      //
      // TODO: is this true? What if we're dealing with `~>forums[]>posts` but
      // we have different entries for `~`? Can that happen? To prevent it we
      // should forbid a "higher" commonAncestorPathIdentity bucket being
      // created later, since that may only be done locally and not shared by
      // siblings.

      if (bucket.has(plan.id)) {
        const previousResult = bucket.get(plan.id);
        if (debugExecuteVerbose.enabled) {
          const planResults = bucketPlanResultses[0].planResults;
          if (debugExecuteVerbose.enabled) {
            debugExecuteVerbose(
              "%s result[%o] for %c found: %c",
              follow,
              bucketPlanResultses.map((i) => i.planResultsesIndex),
              bucketPlanResultses.map((i) => i.planResults),
              previousResult,
            );
          }
        }

        // Fill into the relevant places in `result`
        for (const item of bucketPlanResultses) {
          result[item.planResultsesIndex] = previousResult;
        }

        continue;
      }
      if (plan instanceof __ValuePlan) {
        const planResults = bucketPlanResultses[0].planResults;
        throw new Error(
          `GraphileInternalError<079b214f-3ec9-4257-8de9-0ca2b2bdb8e9>: Attempted to queue __ValuePlan ${plan} (commonAncestorPathIdentity: '${
            plan.commonAncestorPathIdentity
          }', groups: ${plan.groupIds.join(
            ", ",
          )}) for execution; however __ValuePlan must never be executed - the value should already exist in the cache: ${crystalPrint(
            planResults,
          )}.`,
        );
      }
      // Need to start executing

      pendingPlanResultsAndIndexListList.push(bucketPlanResultses);
    }
    if (debugExecuteVerbose.enabled) {
      debugExecuteVerbose(
        "%s no result for buckets with first entries %c",
        follow,
        pendingPlanResultsAndIndexListList.map((l) => l[0].planResults),
      );
    }

    // If none, return results
    if (pendingPlanResultsAndIndexListList.length === 0) {
      // Optimisation
      return result;
    }

    // As before, all planResults in the same group (sharing the same bucket
    // for this plan) are equivalent, so we'll pick the first one in each
    // group. NOTE: this must continue to mirror
    // pendingPlanResultsAndIndexListList - we use the index to these two lists
    // interchangeably.
    const pendingPlanResultses = pendingPlanResultsAndIndexListList.map(
      (list) => list[0].planResults,
    );

    // For each dependency of plan, get the results
    const dependenciesCount = plan.dependencies.length;
    const hasDependencies = dependenciesCount > 0;
    const dependencyValuesList = hasDependencies
      ? new Array(dependenciesCount)
      : plan.hasSideEffects
      ? [new Array(pendingPlanResultses.length).fill(undefined)]
      : [[undefined]];
    const dependencyPromises: Array<{
      promise: PromiseOrDirect<any[]>;
      dependencyIndex: number;
    }> = [];
    if (hasDependencies) {
      for (
        let dependencyIndex = 0;
        dependencyIndex < dependenciesCount;
        dependencyIndex++
      ) {
        const dependencyPlanId = plan.dependencies[dependencyIndex];
        const dependencyPlan = this.plans[dependencyPlanId];
        if (isDev) {
          if (!dependencyPlan) {
            throw new Error(
              `Expected plan dependency '${dependencyIndex}' for '${plan}' to be a plan, instead found '${inspect(
                dependencyPlan,
              )}'`,
            );
          }
        }
        const allDependencyResultsOrPromise = this.executePlan(
          dependencyPlan,
          crystalContext,
          pendingPlanResultses,
          // This is to detect loops, so we don't want changes made inside to
          // cascade back outside -> clone.
          new Set(visitedPlans),
          depth + 1,
        );
        if (isPromiseLike(allDependencyResultsOrPromise)) {
          dependencyPromises.push({
            promise: allDependencyResultsOrPromise,
            dependencyIndex,
          });
          // Don't moan about unhandled rejections; we only care about the first fail (and we don't care if they get handled later)
          allDependencyResultsOrPromise.then(null, NOOP);
        } else {
          dependencyValuesList[dependencyIndex] = allDependencyResultsOrPromise;
        }
      }
    }

    // TODO: extract this to be a separate method.
    const awaitDependencyPromises = async () => {
      for (
        let dependencyPromiseIndex = 0,
          dependencyPromisesLength = dependencyPromises.length;
        dependencyPromiseIndex < dependencyPromisesLength;
        dependencyPromiseIndex++
      ) {
        const { promise, dependencyIndex } =
          dependencyPromises[dependencyPromiseIndex];
        try {
          dependencyValuesList[dependencyIndex] = await promise;
        } catch (e) {
          // An error has occurred; we can short-circuit execution.
          const crystalError = new CrystalError(e);
          for (const list of pendingPlanResultsAndIndexListList) {
            for (const item of list) {
              result[item.planResultsesIndex] = crystalError;
            }
          }
          return result;
        }
      }

      // Since we just awaited, we must re-evaluate the pendingResults
      for (
        let pendingPlanResultsesIndex = pendingPlanResultses.length - 1;
        pendingPlanResultsesIndex >= 0;
        pendingPlanResultsesIndex--
      ) {
        // NOTE: pendingPlanResultsesIndex is also an index to pendingPlanResultsAndIndexListList
        const planResults = pendingPlanResultses[pendingPlanResultsesIndex];
        if (planResults.has(commonAncestorPathIdentity, plan.id)) {
          const previousResult = planResults.get(
            commonAncestorPathIdentity,
            plan.id,
          );
          const list =
            pendingPlanResultsAndIndexListList[pendingPlanResultsesIndex];
          for (const item of list) {
            result[item.planResultsesIndex] = previousResult;
          }

          // Now remove this completed result from the relevant places
          pendingPlanResultses.splice(pendingPlanResultsesIndex, 1);
          pendingPlanResultsAndIndexListList.splice(
            pendingPlanResultsesIndex,
            1,
          );
          for (
            let dependencyIndex = 0;
            dependencyIndex < dependenciesCount;
            dependencyIndex++
          ) {
            dependencyValuesList[dependencyIndex].splice(
              pendingPlanResultsesIndex,
              1,
            );
          }
        }
      }

      // And since we just re-evaluated pendingResults, we might already be done
      if (pendingPlanResultses.length === 0) {
        // Optimisation
        return result;
      }

      // Continue with execution
      return doNext();
    };

    // TODO: extract this to be a separate method.
    const doNext = () => {
      // Format the dependencies, detect & shortcircuit errors, etc
      const toExecute = hasDependencies
        ? []
        : pendingPlanResultsAndIndexListList;

      // For each bucket, build dependency values to feed to execute
      if (hasDependencies) {
        for (
          let pendingPlanResultsesIndex = pendingPlanResultses.length - 1;
          pendingPlanResultsesIndex >= 0;
          pendingPlanResultsesIndex--
        ) {
          const entry = new Array(dependenciesCount);
          let error: CrystalError | null = null;
          for (
            let dependencyIndex = 0;
            dependencyIndex < dependenciesCount;
            dependencyIndex++
          ) {
            const dependencyValues = dependencyValuesList[dependencyIndex];
            const dependencyValue = dependencyValues[pendingPlanResultsesIndex];
            if (
              dependencyValue &&
              dependencyValue.constructor === CrystalError
            ) {
              error = dependencyValue;
              break;
            }
            entry[dependencyIndex] = dependencyValue;
          }
          if (error !== null) {
            // Error occurred; short-circuit execution
            const list =
              pendingPlanResultsAndIndexListList[pendingPlanResultsesIndex];
            let first = true;
            for (const item of list) {
              result[item.planResultsesIndex] = error;
              if (first) {
                first = false;
                item.planResults.set(
                  commonAncestorPathIdentity,
                  plan.id,
                  error,
                );
              }
            }
            for (
              let dependencyIndex = 0;
              dependencyIndex < dependenciesCount;
              dependencyIndex++
            ) {
              dependencyValuesList[dependencyIndex].splice(
                pendingPlanResultsesIndex,
                1,
              );
            }
          } else {
            toExecute.push(
              pendingPlanResultsAndIndexListList[pendingPlanResultsesIndex],
            );
          }
        }
      }

      const toExecuteLength = toExecute.length;
      // Are we done?
      if (toExecuteLength === 0) {
        return result;
      }

      // TODO: optimize away
      toExecute.reverse();

      let meta = crystalContext.metaByPlanId[plan.id];
      if (!meta) {
        meta = Object.create(null) as Record<string, unknown>;
        crystalContext.metaByPlanId[plan.id] = meta;
      }
      // Note: the `execute` method on plans is responsible for memoizing
      // results into `meta`.
      if (plan instanceof __ItemPlan) {
        throw new Error(
          "Should never attempt to execute __ItemPlan; that should be handled within executeBatch",
        );
      }
      const planOptions = this.planOptionsByPlan.get(plan);
      const isSubscribe = plan.id === this.subscriptionPlanId;

      // If plan is sync, execute, store and return results (there's no risk of a race condition)
      if (
        plan.sync &&
        !(plan instanceof __ListTransformPlan) &&
        !(isSubscribe || planOptions?.stream)
      ) {
        let crystalError: CrystalError | undefined;
        let executionResults: CrystalResultsList<any> | undefined;
        try {
          executionResults = plan.execute(
            dependencyValuesList,
            meta,
          ) as CrystalResultsList<any>;
          if (typeof (executionResults as any).then === "function") {
            throw new Error(
              `${plan} claims to be synchronous, but it returned a promise; please set 'sync = false'`,
            );
          }
        } catch (e) {
          crystalError = new CrystalError(e);
        }
        for (
          let executableIndex = 0;
          executableIndex < toExecuteLength;
          executableIndex++
        ) {
          const list = toExecute[executableIndex];
          let first = true;
          const value =
            crystalError ??
            (hasDependencies || plan.hasSideEffects
              ? executionResults![executableIndex]
              : executionResults![0]);
          for (const item of list) {
            result[item.planResultsesIndex] = value;
            if (first) {
              first = false;
              debugExecuteVerbose(
                `%sExecutePlan(%s): writing value %c for %c to %c`,
                indent,
                plan,
                value,
                commonAncestorPathIdentity,
                item.planResults,
              );
              item.planResults.set(commonAncestorPathIdentity, plan.id, value);
            } else if (isDev) {
              if (
                item.planResults.get(commonAncestorPathIdentity, plan.id) !==
                value
              ) {
                throw new Error(
                  "GraphileInternalError<f0af3cb6-7f0c-4002-aff5-976bf233269a>: The plan results should be equivalent, but apprently they're not?!",
                );
              }
            }
          }
        }
        return result;
      }

      // Plan's not synchronous

      // TODO: this is a hack! Use the new execution algorithm.
      return this.executePlanOld(
        plan,
        crystalContext,
        planResultses,
        visitedPlans,
        depth,
      );
    };

    // If any dependency result was a promise, await all dependencyPromises then re-evaluate uncompleted resultses
    if (dependencyPromises.length > 0) {
      // Return a promise
      return awaitDependencyPromises();
    } else {
      // Remain synchronous, if possible
      return doNext();
    }
  }

  /**
   * Implements `ExecutePlan`.
   *
   * @remarks `await` is forbidden in this method to avoid race conditions.
   *
   * This was the original (known good) implementation of executePlan; however
   * it was `defer()`-heavy, so performance suffered.
   */
  private executePlanOld<T>(
    plan: ExecutablePlan<T>,
    crystalContext: CrystalContext,
    planResultses: ReadonlyArray<null | PlanResults>,
    visitedPlans = new Set<ExecutablePlan>(),
    depth = 0,
  ): PromiseOrDirect<any[]> {
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
    //if (visitedPlans.has(plan)) {
    //  throw new Error(
    //    `ExecutablePlan execution recursion error: attempted to execute ${plan} again`,
    //  );
    //}
    //visitedPlans.add(plan);
    if (plan instanceof __ItemPlan) {
      // Shortcut evaluation because __ItemPlan cannot be executed.
      return planResultses.map((planResults) =>
        planResults == null
          ? null
          : planResults.get(plan.commonAncestorPathIdentity, plan.id),
      );
    }
    const planResultsesLength = planResultses.length;
    const result = new Array(planResultsesLength);
    debugExecute(
      "%sExecutePlan(%c): executing with %o plan results",
      indent,
      plan,
      planResultsesLength,
    );
    const commonAncestorPathIdentity = plan.commonAncestorPathIdentity;

    const pendingPlanResultses: PlanResults[] = []; // Length unknown
    const pendingDeferreds: Deferred<any>[] = []; // Same length as pendingPlanResultses
    const pendingPlanResultsesIndexes: number[] = []; // Same length as pendingPlanResultses
    const inProgressDeferreds: Deferred<any>[] = []; // Length unknown
    const inProgressPlanResultsesIndexes: number[] = []; // Same length as inProgressDeferreds

    const deferredsByBucket = crystalContext.inProgressPlanResolutions[plan.id];

    for (let i = 0; i < planResultsesLength; i++) {
      const planResults = planResultses[i];
      if (planResults == null) {
        result[i] = null;
        continue;
      }
      if (planResults.has(commonAncestorPathIdentity, plan.id)) {
        const previousResult = planResults.get(
          commonAncestorPathIdentity,
          plan.id,
        );
        result[i] = previousResult;

        debugExecuteVerbose(
          "%s result[%o] for %c found: %c",
          follow,
          i,
          planResults,
          previousResult,
        );
        continue;
      }
      if (plan instanceof __ValuePlan) {
        throw new Error(
          `GraphileInternalError<079b214f-3ec9-4257-8de9-0ca2b2bdb8e9>: Attempted to queue __ValuePlan ${plan} (commonAncestorPathIdentity: '${
            plan.commonAncestorPathIdentity
          }', groups: ${plan.groupIds.join(
            ", ",
          )}) for execution; however __ValuePlan must never be executed - the value should already exist in the cache: ${crystalPrint(
            planResults,
          )}.`,
        );
      }
      const bucket = planResults.getBucket(commonAncestorPathIdentity);
      if (deferredsByBucket.has(bucket)) {
        // In progress already
        const deferred = deferredsByBucket.get(bucket)!;
        debugExecuteVerbose(
          "%s already in progress for %c",
          follow,
          planResults,
        );
        inProgressDeferreds.push(deferred);
        inProgressPlanResultsesIndexes.push(i);
      } else {
        // Need to start executing
        debugExecuteVerbose("%s no result for %c", follow, planResults);

        const deferred = defer<any>();

        deferredsByBucket.set(bucket, deferred);

        pendingPlanResultses.push(planResults);
        pendingDeferreds.push(deferred);
        pendingPlanResultsesIndexes.push(i);
      }
    }

    const pendingPlanResultsesLength = pendingPlanResultses.length;
    const inProgressDeferredsLength = inProgressDeferreds.length;
    if (pendingPlanResultsesLength === 0 && inProgressDeferredsLength === 0) {
      // Optimization
      return result;
    }

    const pendingResultsPromise =
      pendingPlanResultsesLength > 0
        ? this.executePlanPending(
            plan,
            crystalContext,
            pendingPlanResultses,
            visitedPlans,
            depth,
          )
        : Promise.resolve([]);

    // IMPORTANT: this must not trigger any new errors otherwise these `deferred`'s may live forever!
    const handlePendingPromise = pendingResultsPromise.then(
      (pendingResults) => {
        for (let i = 0; i < pendingPlanResultsesLength; i++) {
          // Execution complete; delete from cache
          const planResults = pendingPlanResultses[i];
          const bucket = planResults.getBucket(commonAncestorPathIdentity);
          deferredsByBucket.delete(bucket);

          // Add the result to our results
          const j = pendingPlanResultsesIndexes[i];
          result[j] = pendingResults[i];

          // Resolve the promise
          pendingDeferreds[i].resolve(pendingResults[i]);
        }
      },
      (error) => {
        for (let i = 0; i < pendingPlanResultsesLength; i++) {
          // Execution complete; delete from cache
          const planResults = pendingPlanResultses[i];
          const bucket = planResults.getBucket(commonAncestorPathIdentity);
          deferredsByBucket.delete(bucket);

          // Add the result to our results
          const j = pendingPlanResultsesIndexes[i];
          // TODO: is wrapping in a CrystalError here correct?
          result[j] = new CrystalError(error);

          // Reject the promise
          pendingDeferreds[i].reject(error);
        }
      },
    );

    const handleInProgressPromise = Promise.all(inProgressDeferreds).then(
      (completedInProgressResultses) => {
        for (let i = 0; i < inProgressDeferredsLength; i++) {
          const j = inProgressPlanResultsesIndexes[i];
          result[j] = completedInProgressResultses[i];
        }
      },
    );

    return Promise.all([handlePendingPromise, handleInProgressPromise]).then(
      () => {
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
      },
    );
  }

  // TODO: can this be made synchronous?
  /**
   * The meat of plan execution, this is called by executePlan for pending
   * plans - those that have not been executed yet.
   */
  private async executePlanPending<T>(
    plan: ExecutablePlan<T>,
    crystalContext: CrystalContext,
    pendingPlanResultses: ReadonlyArray<PlanResults>,
    visitedPlans: Set<ExecutablePlan>,
    depth: number,
  ): Promise<any[]> {
    const indent = "    ".repeat(depth);
    const follow = indent + "  ⮞";
    const commonAncestorPathIdentity = plan.commonAncestorPathIdentity;
    const pendingPlanResultsesLength = pendingPlanResultses.length;
    const dependenciesCount = plan.dependencies.length;
    const hasDependencies = dependenciesCount > 0;
    const dependencyValuesList = hasDependencies
      ? new Array(dependenciesCount)
      : plan.hasSideEffects
      ? [new Array(pendingPlanResultses.length).fill(undefined)]
      : [[undefined]];
    debugExecute("%s Executing %o dependencies", follow, dependenciesCount);

    if (hasDependencies) {
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
          pendingPlanResultses,
          // This is to detect loops, so we don't want changes made inside to
          // cascade back outside -> clone.
          new Set(visitedPlans),
          depth + 1,
        );
        dependencyValuesList[i] = allDependencyResults;
      }
    }

    // Uses the true result length
    const result = new Array(pendingPlanResultsesLength);

    // Only for pendingPlanResultses that don't have errors in their dependencies
    let realPendingPlanResultsesLength = 0;
    const realPendingPlanResultses = [];
    const indexMap = [];

    for (let i = pendingPlanResultsesLength - 1; i >= 0; i--) {
      let error;
      for (let j = 0; j < dependenciesCount; j++) {
        const dependencyValues = dependencyValuesList[j];
        const dependencyValue = dependencyValues[i];
        if (dependencyValue instanceof CrystalError) {
          error = dependencyValue;
          break;
        }
      }
      if (error) {
        // Error occurred; short-circuit execution
        result[i] = error;
        const planResults = pendingPlanResultses[i];
        planResults.set(commonAncestorPathIdentity, plan.id, error);
        // Remove the dependency values
        for (let j = 0; j < dependenciesCount; j++) {
          dependencyValuesList[j].splice(i, 1);
        }
      } else {
        //values[realPendingPlanResultsesLength] = entry;
        realPendingPlanResultses[realPendingPlanResultsesLength] =
          pendingPlanResultses[i];
        indexMap[realPendingPlanResultsesLength] = i;
        realPendingPlanResultsesLength++;
      }
    }

    // TODO: optimize this away
    realPendingPlanResultses.reverse();
    indexMap.reverse();

    // If all the plans failed we can skip this
    if (realPendingPlanResultsesLength > 0) {
      let meta = crystalContext.metaByPlanId[plan.id];
      if (!meta) {
        meta = Object.create(null) as Record<string, unknown>;
        crystalContext.metaByPlanId[plan.id] = meta;
      }
      // Note: the `execute` method on plans is responsible for memoizing
      // results into `meta`.
      if (plan instanceof __ItemPlan) {
        throw new Error(
          "Should never attempt to execute __ItemPlan; that should be handled within executeBatch",
        );
      }
      const planOptions = this.planOptionsByPlan.get(plan);
      const isSubscribe = plan.id === this.subscriptionPlanId;
      const pendingResults =
        plan instanceof __ListTransformPlan
          ? // __ListTransformPlan gets custom execution.
            await this.executeTransformPlan(
              plan,
              crystalContext,
              realPendingPlanResultses,
              visitedPlans,
            )
          : isSubscribe || planOptions?.stream
          ? await (plan as unknown as StreamablePlan<unknown>).stream(
              dependencyValuesList,
              meta,
              isSubscribe ? { initialCount: 0 } : planOptions!.stream!,
            )
          : await plan.execute(dependencyValuesList, meta);
      if (plan.debug) {
        console.log(
          `debugPlans(${plan}): called with: ${inspect(dependencyValuesList, {
            colors: true,
            depth: 6,
          })}; returned: ${inspect(pendingResults, {
            colors: true,
            depth: 6,
          })}`,
        );
      }
      if (isDev && hasDependencies) {
        assert.ok(
          Array.isArray(pendingResults),
          "Expected plan execution to return a list",
        );
        assert.strictEqual(
          pendingResults.length,
          pendingPlanResultsesLength,
          "Expected plan execution to return same number of results as inputs",
        );
      }
      for (let i = 0; i < realPendingPlanResultsesLength; i++) {
        const planResults = realPendingPlanResultses[i];
        const underlyingIndex = indexMap[i];

        // This could be a Promise, an AsyncIterable, a Promise to an
        // AsyncIterable, or arbitrary data (including an array).
        const rawPendingResult =
          hasDependencies ||
          plan instanceof __ListTransformPlan ||
          plan.hasSideEffects
            ? pendingResults[i]
            : pendingResults[0];

        // NOTE: after this result[j] could be an AsyncIterable, or arbitrary
        // data (including an array).
        if (isPromise(rawPendingResult)) {
          try {
            result[underlyingIndex] = await rawPendingResult;
          } catch (e: any) {
            result[underlyingIndex] = new CrystalError(e);
          }
        }
        // TODO: do we need 'else if (isAsyncIterable(rawPendingResult)) { ... }'
        else {
          result[underlyingIndex] = rawPendingResult;
        }

        // TODO: if result[j] is AsyncIterable it would be nice to avoid
        // writing it to the plan results.
        planResults.set(
          commonAncestorPathIdentity,
          plan.id,
          result[underlyingIndex],
        );
      }
    }

    debugExecute(
      "%sExecutePlan(%s): wrote results for %c",
      indent,
      plan,
      pendingPlanResultses,
    );
    return result;
  }

  private async executeTransformPlan(
    plan: __ListTransformPlan<any, any, any>,
    crystalContext: CrystalContext,
    planResultses: readonly PlanResults[],
    visitedPlans: Set<ExecutablePlan>,
  ) {
    const itemPlanId = this.transformDependencyPlanIdByTransformPlanId[plan.id];
    const itemPlan = this.dangerouslyGetPlan(itemPlanId);
    const namedReturnType = plan.namedType;
    const listPlan = plan.dangerouslyGetListPlan();
    const pathIdentity = itemPlan.parentPathIdentity;
    const crystalLayerObjects = planResultses.map((planResults) => {
      // const planResults = new PlanResults(originalPlanResults);
      const crystalObject = newCrystalObject(
        pathIdentity,
        namedReturnType.name,
        uid(),
        crystalContext,
        planResults,
      );

      return newCrystalLayerObject(crystalObject, planResults);
    });
    const depResults = await this.executeBatchInner(
      crystalContext,
      crystalLayerObjects,
      itemPlan.parentPathIdentity,
      listPlan,
      itemPlan,
    );
    const listResults = await this.executePlan(
      listPlan,
      crystalContext,
      planResultses,
      visitedPlans,
      depth, // TODO: should depth be incremented?
    );
    return listResults.map((list: any, listIndex: number) => {
      if (list == null) {
        return list;
      }
      const values = depResults[listIndex];
      if (!Array.isArray(list) || !Array.isArray(values)) {
        // TODO: should this be an error?
        console.warn(
          `Either list or values was not an array when processing ${plan}`,
        );
        return null;
      }
      if (isDev) {
        assert.strictEqual(
          list.length,
          values.length,
          "GraphileInternalError<c85b6936-d406-4801-9c6b-625a567d32ff>: The list and values length must match for a __ListTransformPlan",
        );
      }
      const initialState = plan.initialState();
      const reduceResult = list.reduce(
        (memo, entireItemValue, listEntryIndex) =>
          plan.reduceCallback(memo, entireItemValue, values[listEntryIndex]),
        initialState,
      );
      const finalResult = plan.finalizeCallback
        ? plan.finalizeCallback(reduceResult)
        : reduceResult;
      return finalResult;
    });
  }

  //----------------------------------------

  /**
   * Used to implement `GetValuePlanId`, but was rewritten to factor in that we
   * now key by crystal objects rather than id and indexes.
   *
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public getValuePlanId<TData extends object>(
    crystalContext: CrystalContext,
    valuePlan: __ValuePlan<TData>,
    object: TData,
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
    }
    return valueId;
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
    fieldPathIdentity: string,
    returnType: GraphQLOutputType,
    crystalContext: CrystalContext,
  ): Batch {
    const sideEffectPlanIds =
      this.sideEffectPlanIdsByPathIdentity[fieldPathIdentity];
    const isSubscribe = fieldPathIdentity === ROOT_PATH;
    const planId = isSubscribe
      ? this.subscriptionPlanId
      : this.planIdByPathIdentity[fieldPathIdentity];
    const itemPlanId = isSubscribe
      ? this.subscriptionItemPlanId
      : this.itemPlanIdByFieldPathIdentity[fieldPathIdentity];
    const returnRaw = isSubscribe
      ? false
      : !!this.returnRawValueByPathIdentity[fieldPathIdentity];
    /*
    if (planId == null) {
      throw new Error(
        "Support for unplanned resolvers is current unimplemented",
      );
      const objectValue = possiblyParentCrystalObject
        ? possiblyParentCrystalObject[$$data]
        : parentObject;
      debug(
        "Calling real resolver for %s.%s with %o",
        info.parentType.name,
        info.fieldName,
        objectValue,
      );
      return realResolver(objectValue, argumentValues, context, info);
    }
    */
    assert.ok(
      planId != null,
      `Could not find the planId for path identity '${fieldPathIdentity}'`,
    );
    assert.ok(
      itemPlanId != null,
      `Could not find the itemPlanId for path identity '${fieldPathIdentity}'`,
    );
    const sideEffectPlans =
      sideEffectPlanIds?.map(
        (sideEffectPlanId) => this.plans[sideEffectPlanId],
      ) ?? [];
    const plan = this.plans[planId];
    const itemPlan = this.plans[itemPlanId];
    assert.ok(
      plan,
      `Could not find the plan with id '${planId}' at '${fieldPathIdentity}'`,
    );
    assert.ok(
      itemPlan,
      `Could not find the itemPlan with id '${itemPlanId}' at '${fieldPathIdentity}'`,
    );
    const namedReturnType = getNamedType(returnType);
    const batch: Batch = {
      // TODO: rename Batch.pathIdentity to fieldPathIdentity
      pathIdentity: fieldPathIdentity,
      crystalContext,
      sideEffectPlans,
      plan,
      itemPlan,
      entries: [],
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
    // eslint-disable-next-line @typescript-eslint/ban-types
    context: object,
    rootValue: unknown,
  ): CrystalContext {
    const rootId = uid("root");
    debugExecuteVerbose("Root id is %c", rootId);
    const crystalContext: CrystalContext = {
      aether: this,
      metaByPlanId: Object.create(null),
      inProgressPlanResolutions: this.plans.reduce((memo, plan, idx) => {
        if (plan && plan.id === idx) {
          memo[plan.id] = new Map();
        }
        return memo;
      }, {}),
      rootId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore We'll set this in just a moment...
      rootCrystalObject: null,
    };
    const rootCrystalObject = newCrystalObject(
      GLOBAL_PATH, // TODO: this should be ROOT_PATH I think?
      this.queryTypeName,
      rootId,
      crystalContext,
      new PlanResults(),
    );
    crystalContext.rootCrystalObject = rootCrystalObject;

    /*@__INLINE__*/ populateValuePlan(
      this.variableValuesPlan,
      rootCrystalObject,
      variableValues,
      "variableValues",
    );
    /*@__INLINE__*/ populateValuePlan(
      this.contextPlan,
      rootCrystalObject,
      context,
      "context",
    );
    /*@__INLINE__*/ populateValuePlan(
      this.rootValuePlan,
      rootCrystalObject,
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
  public makeBatch(
    pathIdentity: string,
    returnType: GraphQLOutputType,
    parentCrystalObject: CrystalObject | null,
    variableValues: {
      [variableName: string]: unknown;
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    context: object,
    rootValue: unknown,
  ): Batch {
    const crystalContext = parentCrystalObject
      ? parentCrystalObject[$$crystalContext]
      : this.newCrystalContext(variableValues, context, rootValue);
    const batch = this.newBatch(pathIdentity, returnType, crystalContext);
    this.batchByPathIdentity[pathIdentity] = batch;
    // (Note: when batch is executed it will delete itself from aether.batchByPathIdentity.)
    process.nextTick(() => {
      this.executeBatch(batch, crystalContext);
    });
    return batch;
  }

  private async executeLayers(
    crystalContext: CrystalContext,
    layers: ExecutablePlan[],
    // Even when AsyncIterators are involved, this will always be a concrete array
    crystalLayerObjects: ReadonlyArray<CrystalLayerObject | null>,
    rawMapResult: MapResult | undefined,
    depth = 0,
  ): Promise<any[]> {
    const crystalLayerObjectsLength = crystalLayerObjects.length;
    if (crystalLayerObjectsLength === 0) {
      return [];
    }
    const [layerPlan, ...rest] = layers;

    const mapResult =
      rest.length === 0
        ? (clo: null | CrystalLayerObject) => {
            if (clo == null) {
              return null;
            }
            const data = clo.planResults.get(
              layerPlan.commonAncestorPathIdentity,
              layerPlan.id,
            );
            if (data == null) {
              return null;
            }
            return rawMapResult ? rawMapResult(clo, data) : data;
          }
        : null;

    debugExecute(
      "Executing layerPlan %c with %c crystal layer objects",
      layerPlan,
      crystalLayerObjectsLength,
    );

    if (layerPlan instanceof __ItemPlan) {
      // Derive new CrystalLayerObjects from the existing ones.
      const depId = layerPlan.dependencies[0];
      const dep = this.plans[depId];
      const pendingCLOs: Array<CrystalLayerObject | null> = [];
      const pendingCLOIndexes: Array<[number, number]> = [];
      const layerResults = crystalLayerObjects.map((clo, cloIndex) => {
        if (clo == null) {
          return null;
        }
        const { parentCrystalObject, planResults } = clo;
        if (
          planResults.has(layerPlan.commonAncestorPathIdentity, layerPlan.id)
        ) {
          const existingResult = planResults.get(
            layerPlan.commonAncestorPathIdentity,
            layerPlan.id,
          );
          // TODO: review this entire `if` statement; it was added to support __ListTransformPlan.
          // I wasn't sure what to do here... so I returned existingResult...
          // and the tests started passing again... so... ¯\_(ツ)_/¯
          return existingResult;
        }
        if (planResults.hasPathIdentity(layerPlan.commonAncestorPathIdentity)) {
          const bucket = planResults.getBucket(
            layerPlan.commonAncestorPathIdentity,
          );
          throw new Error(
            `GraphileInternalError<355413ed-6688-45ce-8d5d-22faee9668a3>: Did not expect plans to exist within the '${
              layerPlan.commonAncestorPathIdentity
            }' bucket yet (creating for ${layerPlan}, but already contains data from ${[
              ...bucket.keys(),
            ]
              .map((id) => this.dangerouslyGetPlan(id))
              .join(", ")}). Data found: ${crystalPrint(bucket)}`,
          );
        }
        // NOTE: this could be an async iterator
        const listResult = planResults.get(
          dep.commonAncestorPathIdentity,
          dep.id,
        );
        debugExecuteVerbose("Executing %c's dependency, %c", layerPlan, dep);
        if (Array.isArray(listResult)) {
          // Turn each entry in this listResult into it's own CrystalLayerObject, then execute the new layers.
          const newCLOs = listResult.map((result, i) => {
            if (result == null) {
              return null;
            }
            const copy = new PlanResults(planResults);
            copy.set(
              layerPlan.commonAncestorPathIdentity,
              layerPlan.id,
              result,
            );
            return newCrystalLayerObject(parentCrystalObject, copy);
          });
          if (mapResult) {
            return newCLOs.map(mapResult);
          } else {
            // Optimise this to call executeLayers once, rather than once per crystalLayerObject - see code below `layerResults` loop.
            const l = newCLOs.length;
            for (let innerCLOIndex = 0; innerCLOIndex < l; innerCLOIndex++) {
              pendingCLOs.push(newCLOs[innerCLOIndex]);
              pendingCLOIndexes.push([cloIndex, innerCLOIndex]);
            }
            return new Array(l);
          }
        } else if (isAsyncIterable(listResult)) {
          const listResultIterator = listResult[Symbol.asyncIterator]();
          const abort = defer<IteratorResult<any, any>>();

          //eslint-disable-next-line @typescript-eslint/no-this-alias
          const aether = this;

          const asyncIterator: AsyncIterableIterator<any> = {
            [Symbol.asyncIterator]() {
              return this;
            },
            async next() {
              const nextPromise = listResultIterator.next();
              const copy = new PlanResults(planResults);

              try {
                const { done, value: resultPromise } = await Promise.race([
                  abort,
                  nextPromise,
                ]);
                const result = await Promise.race([abort, resultPromise]);

                if (result == null) {
                  return { done, value: null };
                }

                copy.set(
                  layerPlan.commonAncestorPathIdentity,
                  layerPlan.id,
                  result,
                );
                const newCLO = newCrystalLayerObject(parentCrystalObject, copy);
                const value = mapResult
                  ? mapResult(newCLO)
                  : (
                      await aether.executeLayers(
                        crystalContext,
                        rest,
                        // TODO: batch this over a tick?
                        [newCLO],
                        rawMapResult,
                        depth + 1,
                      )
                    )[0];
                return { done, value };
              } catch (e) {
                if (e === $$FINISHED) {
                  return { done: true, value: undefined };
                } else {
                  throw e;
                }
              }
            },
            return(value) {
              abort.reject($$FINISHED as any);
              return (
                listResultIterator.return?.(value) ||
                Promise.resolve({
                  done: true,
                  value: undefined,
                })
              );
            },
            throw(e) {
              abort.reject($$FINISHED as any);
              return (
                listResultIterator.throw?.(e) ||
                Promise.resolve({ done: true, value: undefined })
              );
            },
          };
          return asyncIterator;
        } else {
          if (listResult != null) {
            // TODO: should we handle CrystalError here?
            console.error(
              `Expected listResult to be an array, found ${inspect(
                listResult,
              )}`,
            );
          }
          // TODO: should this be null in some cases?
          // Stops here
          return [];
        }
      });
      const l = pendingCLOs.length;
      if (!mapResult && l > 0) {
        const allResults = await this.executeLayers(
          crystalContext,
          rest,
          pendingCLOs,
          rawMapResult,
          depth + 1,
        );
        for (let j = 0; j < l; j++) {
          const [cloIndex, innerCLOIndex] = pendingCLOIndexes[j];
          layerResults[cloIndex][innerCLOIndex] = allResults[j];
        }
      }
      return layerResults;
    } else {
      // Execute the plan with the same crystalLayerObjects
      const layerResults = await this.executePlan(
        layerPlan,
        crystalContext,
        crystalLayerObjects.map((clo) =>
          clo == null ? null : clo.planResults,
        ),
      );
      if (isDev) {
        assert.ok(
          Array.isArray(layerResults),
          "Expected plan execution to return an array",
        );
        assert.strictEqual(
          layerResults.length,
          crystalLayerObjectsLength,
          "Expected plan execution result to have same length as input objects",
        );
      }

      if (mapResult) {
        // No following layers; map the result
        const finalResult = new Array(crystalLayerObjectsLength);
        for (let i = 0; i < crystalLayerObjectsLength; i++) {
          finalResult[i] =
            layerResults[i] instanceof CrystalError
              ? Promise.reject(layerResults[i].originalError)
              : mapResult(crystalLayerObjects[i]);
        }
        return finalResult;
      } else {
        // Now executing the following layers using the same crystalLayerObjects
        const finalResult = new Array(crystalLayerObjectsLength);
        const pendingIndexes = [];
        const pendingCrystalLayerObjects = [];
        for (
          let finalResultIndex = 0;
          finalResultIndex < crystalLayerObjectsLength;
          finalResultIndex++
        ) {
          if (layerResults[finalResultIndex] instanceof CrystalError) {
            finalResult[finalResultIndex] = Promise.reject(
              layerResults[finalResultIndex].originalError,
            );
          } else {
            pendingCrystalLayerObjects.push(
              crystalLayerObjects[finalResultIndex],
            );
            pendingIndexes.push(finalResultIndex);
          }
        }
        if (pendingCrystalLayerObjects.length > 0) {
          try {
            const pendingResults = await this.executeLayers(
              crystalContext,
              rest,
              pendingCrystalLayerObjects,
              rawMapResult,
              depth + 1,
            );
            if (isDev) {
              assert.ok(
                Array.isArray(pendingResults),
                "Expected non-error plan execution to return an array",
              );
              assert.strictEqual(
                pendingResults.length,
                pendingCrystalLayerObjects.length,
                "Expected non-error plan execution result to have same length as input objects",
              );
            }
            // Stitch the results back into the list
            for (
              let pendingResultIndex = 0, l = pendingResults.length;
              pendingResultIndex < l;
              pendingResultIndex++
            ) {
              const finalResultIndex = pendingIndexes[pendingResultIndex];
              finalResult[finalResultIndex] =
                pendingResults[pendingResultIndex] instanceof CrystalError
                  ? Promise.reject(
                      pendingResults[pendingResultIndex].originalError,
                    )
                  : pendingResults[pendingResultIndex];
            }
          } catch (e) {
            for (
              let pendingResultIndex = 0, l = pendingCrystalLayerObjects.length;
              pendingResultIndex < l;
              pendingResultIndex++
            ) {
              const finalResultIndex = pendingIndexes[pendingResultIndex];
              finalResult[finalResultIndex] = Promise.reject(e);
            }
          }
        }
        return finalResult;
      }
    }
  }

  /**
   * Implements `ExecuteBatch`.
   *
   * TODO: we can optimise this to not be `async` (only return a promise when
   * necessary); but when doing so be very careful that errors are handled
   * correctly.
   *
   * @internal
   */
  public async executeBatch(
    batch: Batch,
    crystalContext: CrystalContext,
  ): Promise<void> {
    // This guarantees nothing else will be added to the batch
    delete this.batchByPathIdentity[batch.pathIdentity];

    const { entries, sideEffectPlans, plan, itemPlan, pathIdentity } = batch;
    const entriesLength = entries.length;
    const crystalLayerObjects: CrystalLayerObject[] = new Array(entriesLength);
    for (let i = 0; i < entriesLength; i++) {
      const crystalObject = entries[i][0];
      crystalLayerObjects[i] = newCrystalLayerObject(
        crystalObject,
        crystalObject[$$planResults],
      );
    }

    try {
      const fieldDigest = this.fieldDigestByPathIdentity[pathIdentity];

      const results = await this.executeBatchForCLOs(
        crystalContext,
        pathIdentity,
        fieldDigest,
        sideEffectPlans,
        plan,
        itemPlan,
        crystalLayerObjects,
      );
      for (let i = 0; i < entriesLength; i++) {
        entries[i][1].resolve(results[i]);
      }
    } catch (e: any) {
      for (let i = 0; i < entriesLength; i++) {
        entries[i][1].reject(e);
      }
    }
  }

  private async executeBatchForCLOs(
    crystalContext: CrystalContext,
    pathIdentity: string,
    fieldDigest: FieldDigest,
    sideEffectPlans: ReadonlyArray<ExecutablePlan>,
    plan: ExecutablePlan,
    itemPlan: ExecutablePlan,
    crystalLayerObjects: CrystalLayerObject[],
    allowPrefetch = true,
  ) {
    const { isPolymorphic, isLeaf, namedReturnType, returnRaw } = fieldDigest;
    const crystalObjectFromCrystalLayerObjectAndTypeName = (
      clo: CrystalLayerObject,
      typeName: string,
    ) => {
      return newCrystalObject(
        pathIdentity,
        typeName,
        isDev ? uid(crystalPrintPathIdentity(pathIdentity)) : uid(pathIdentity),
        crystalContext,
        clo.planResults,
      );
    };

    // TODO: what should we do if the user has a graphqlResolver AND it's a
    // polymorphic plan?

    // These two arrays have the same length
    const resultCrystalLayerObjects: CrystalLayerObject[] = [];
    const resultCrystalObjects: CrystalObject[] = [];

    // Execute the layers to get the result
    const mapResult: MapResult | undefined =
      // The user has their own resolver, so we must not return a crystalObject
      returnRaw
        ? undefined
        : // When we're returning something polymorphic we need to figure out the typeName which we get from the plan result.
        isPolymorphic
        ? (clo, data) => {
            assertPolymorphicData(data);
            const co = crystalObjectFromCrystalLayerObjectAndTypeName(
              clo,
              data[$$concreteType],
            );
            resultCrystalLayerObjects.push(clo);
            resultCrystalObjects.push(co);
            return co;
          }
        : // Otherwise we represent a standard object, so we can just use the expected named type
          (clo, _data) => {
            const co = crystalObjectFromCrystalLayerObjectAndTypeName(
              clo,
              namedReturnType.name,
            );
            resultCrystalLayerObjects.push(clo);
            resultCrystalObjects.push(co);
            return co;
          };

    // First, execute side effects (in order, *not* in parallel)
    // TODO: assert that side effect plans cannot be nested under list items.
    const sideEffectCount = sideEffectPlans.length;
    if (sideEffectCount > 0) {
      const planResults = crystalLayerObjects.map((clo) => clo.planResults);
      for (let i = 0; i < sideEffectCount; i++) {
        const sideEffectPlan = sideEffectPlans[i];
        await this.executePlan(sideEffectPlan, crystalContext, planResults);
      }
    }

    const results = await this.executeBatchInner(
      crystalContext,
      crystalLayerObjects,
      pathIdentity,
      plan,
      itemPlan,
      mapResult,
    );
    if (!returnRaw && allowPrefetch) {
      // chance to do pre-execution of next layers!
      for (const localPlan of this.prefetchesForPathIdentity[pathIdentity]
        .local) {
        const subResults = await this.executeBatchForCLOs(
          crystalContext,
          fieldDigest.itemPathIdentity,
          fieldDigest,
          EMPTY_ARRAY,
          localPlan,
          localPlan,
          resultCrystalLayerObjects,
          false,
        );
      }

      for (const config of this.prefetchesForPathIdentity[pathIdentity]
        .children) {
        const fieldDigest = config.fieldDigest;
        const subResults = await this.executeBatchForCLOs(
          crystalContext,
          fieldDigest.pathIdentity,
          fieldDigest,
          EMPTY_ARRAY,
          config.plan,
          config.itemPlan,
          resultCrystalLayerObjects,
        );
        const responseKey = config.fieldDigest.responseKey;
        for (let i = 0, l = resultCrystalObjects.length; i < l; i++) {
          resultCrystalObjects[i][$$data][responseKey] = subResults[i];
        }
      }
    }
    return results;
  }

  private executeBatchInner(
    crystalContext: CrystalContext,
    crystalLayerObjects: CrystalLayerObject[],
    pathIdentity: string,
    plan: ExecutablePlan,
    itemPlan: ExecutablePlan,
    mapResult: MapResult | undefined = undefined,
  ) {
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
     * `__ItemPlan`s we'll have one additional layer for each
     * `__ItemPlan` and intermediate plans.
     */
    const layers: Array<ExecutablePlan<any>> = [plan, ...path];

    debugExecute(`Executing batch with %s layers: %c`, layers.length, layers);

    return this.executeLayers(
      crystalContext,
      layers,
      crystalLayerObjects,
      mapResult,
    );
  }

  /**
   * For debugging.
   *
   * @internal
   */
  public printPlans(): string {
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
    const partsLines = plans
      .map((plan, id) => {
        if (!plan) {
          return null;
        } else if (plan.id !== id) {
          // return `- ${id}: ->${chalk.bold.yellow(String(plan.id))}`;
          return null;
        } else {
          const optimized = this.optimizedPlans.has(plan);
          const finalized = plan.isFinalized;
          return [
            String(id),
            optimized ? "🚀" : "🐌",
            plan.toString(),
            plan.dependencies.length
              ? `${plan.dependencies
                  .map((depId) => printDep(depId))
                  .join(", ")}`
              : "",
            plan.commonAncestorPathIdentity
              ? " " + chalk.yellow(`${plan.commonAncestorPathIdentity}`)
              : "",
            finalized ? "✅" : "🤔",
          ];
        }
      })
      .filter(isNotNullish);

    const CAP = [
      // id
      4,
      // rocket/snail
      1,
      // plan
      60,
      // deps
      20,
      // commonAncestorPathIdentity
      0,
      // tick/thinking
      1,
    ];
    const maxSizes: number[] = [];
    partsLines.forEach((parts) => {
      parts.forEach((part, i) => {
        const l = stripAnsi(part).length;
        if (maxSizes.length <= i || maxSizes[i] < l) {
          maxSizes[i] = Math.min(l, CAP[i] || 0);
        }
      });
    });
    return partsLines
      .map((parts) => {
        const id = ansiPad(parts[0], maxSizes[0], " ", "start");
        const optimized = ansiPad(parts[1], maxSizes[1], " ", "end");
        const plan = ansiPad(parts[2], maxSizes[2], " ", "end");
        const deps = ansiPad(
          parts[3] ? `  (deps: ${parts[3]})` : "",
          9 + maxSizes[3] + 1,
          " ",
          "end",
        );
        const pathIdentity = ansiPad(parts[4], maxSizes[4], " ", "end");
        const finalized = ansiPad(parts[5], maxSizes[5], " ", "end");
        return `${id}: ${optimized}${finalized}${plan}${deps} ${pathIdentity}`;
      })
      .join("\n");
  }

  /**
   * @internal
   */
  public logPlans(why?: string): void {
    if (!debugPlanVerbose.enabled) {
      return;
    }
    debugPlanVerbose(
      "Plans%s: %s",
      why ? ` ${why}` : "",
      "\n" + this.printPlans(),
    );
  }

  /**
   * @internal
   */
  public printPlansByPath(): string {
    const fieldPathIdentities = Object.keys(this.planIdByPathIdentity)
      .sort((a, z) => a.length - z.length)
      .filter(
        (pathIdentity) =>
          !pathIdentity.endsWith("[]") || pathIdentity.match(/@[0-9]+(\[\])+$/),
      );
    const printed = new Set<string>();
    let depth = 0;
    const lines: string[] = [];
    const print = (
      fieldPathIdentity: string,
      parentFieldPathIdentity: string,
    ) => {
      if (printed.has(fieldPathIdentity)) {
        return;
      }
      printed.add(fieldPathIdentity);
      const planId = this.planIdByPathIdentity[fieldPathIdentity];
      if (!planId) {
        throw new Error(
          `Corrupted plan, no id found for '${fieldPathIdentity}'`,
        );
      }
      const plan = this.plans[planId];
      lines.push(
        "  ".repeat(depth) +
          `${fieldPathIdentity.substring(
            parentFieldPathIdentity.length,
          )}: ${plan}`,
      );
      depth++;
      for (const childFieldPathIdentity of fieldPathIdentities) {
        if (
          childFieldPathIdentity.startsWith(fieldPathIdentity) &&
          /^(\[\])*>|@/.test(
            childFieldPathIdentity.substring(fieldPathIdentity.length),
          )
        ) {
          print(childFieldPathIdentity, fieldPathIdentity);
        }
      }
      depth--;
    };
    for (const fieldPathIdentity of fieldPathIdentities) {
      print(fieldPathIdentity, "");
    }
    return lines.join("\n");
  }

  /**
   * @internal
   */
  public logPlansByPath(why?: string): void {
    if (!debugPlanVerbose.enabled) {
      return;
    }
    this.logPlans(why);
    debugPlanVerbose(
      `Plans by path%s: %s`,
      why ? ` ${why}` : "",
      "\n" + this.printPlansByPath(),
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
  valuePlan: ExecutablePlan,
  crystalObject: CrystalObject,
  object: unknown,
  label: string,
): void {
  crystalObject[$$planResults].set(
    valuePlan.commonAncestorPathIdentity,
    valuePlan.id,
    object ?? ROOT_VALUE_OBJECT,
  );
  debugExecute("Populated value plan for %s", label);
}

function isNotNullish<T>(a: T | null | undefined): a is T {
  return a != null;
}

// IMPORTANT: this WILL NOT WORK when compiled down to ES5. It requires ES6+
// native class support.
/**
 * When an error occurs during plan execution we wrap it in a CrystalError so
 * that we can pass it around as a value.  It gets unwrapped and thrown in the
 * crystal resolver.
 *
 * @internal
 */
export class CrystalError extends Error {
  public readonly originalError: Error;
  constructor(originalError: Error) {
    const message = originalError?.message;
    super(message ? `CrystalError: ${message}` : `CrystalError`);
    this.originalError = originalError;
  }
}

function treeNodePath(
  treeNode: TreeNode,
  startPathIdentity: string,
): TreeNode[] {
  if (!treeNode.pathIdentity.startsWith(startPathIdentity)) {
    throw new Error(
      `Asked to find treeNodePath to TreeNode(${treeNode.pathIdentity}) starting at '${startPathIdentity}', however that TreeNode doesn't start with that path identity!`,
    );
  }
  const path: TreeNode[] = [treeNode];
  let n: TreeNode | null = treeNode;
  while ((n = n.parent) && n.pathIdentity.startsWith(startPathIdentity)) {
    path.unshift(n);
  }
  // Find the next `GraphQLList` / `__ItemPlan` position (not including self)
  const listChangeIndex = path.findIndex((v, i) => {
    if (i === 0) {
      return false;
    }
    const previous = path[i - 1];
    if (
      previous.fieldPathIdentity === v.fieldPathIdentity &&
      previous.pathIdentity !== v.pathIdentity
    ) {
      return true;
    }
    return false;
  });
  if (listChangeIndex >= 0) {
    path.splice(listChangeIndex, path.length - listChangeIndex);
  }
  return path;
}

function isTypePlanned(
  schema: GraphQLSchema,
  namedType: GraphQLNamedType,
): boolean {
  if (namedType instanceof GraphQLObjectType) {
    return !!namedType.extensions?.graphile?.Plan;
  } else if (
    namedType instanceof GraphQLUnionType ||
    namedType instanceof GraphQLInterfaceType
  ) {
    const types =
      namedType instanceof GraphQLUnionType
        ? namedType.getTypes()
        : schema.getImplementations(namedType).objects;
    let firstHadPlan = null;
    let i = 0;
    for (const type of types) {
      const hasPlan = !!type.extensions?.graphile?.Plan;
      if (firstHadPlan === null) {
        firstHadPlan = hasPlan;
      } else if (hasPlan !== firstHadPlan) {
        // TODO: validate this at schema build time
        throw new Error(
          `The '${namedType.name}' interface or union type's first type '${
            types[0]
          }' ${
            firstHadPlan ? "expected a plan" : "did not expect a plan"
          }, however the type '${type}' (index = ${i}) ${
            hasPlan ? "expected a plan" : "did not expect a plan"
          }. All types in an interface or union must be in agreement about whether a plan is expected or not.`,
        );
      }
      i++;
    }
    return !!firstHadPlan;
  } else {
    return false;
  }
}
