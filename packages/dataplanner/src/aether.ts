import chalk from "chalk";
import debugFactory from "debug";
import type {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLEnumType,
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
  defaultFieldResolver,
  executeSync,
  getNamedType,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
  GraphQLUnionType,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isLeafType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isUnionType,
  Kind,
  TypeNameMetaFieldDef,
} from "graphql";
import { isAsyncIterable } from "iterall";
import { inspect } from "util";

import * as assert from "./assert.js";
import type {
  Bucket,
  BucketDefinition,
  BucketDefinitionFieldOutputMap,
  BucketDefinitionOutputMode,
  RequestContext,
} from "./bucket.js";
import { BucketSetter } from "./bucket.js";
import { GLOBAL_PATH, ROOT_PATH } from "./constants.js";
import type { Constraint } from "./constraints.js";
import { ansiPad, crystalPrint } from "./crystalPrint.js";
import type { Deferred } from "./deferred.js";
import { defer } from "./deferred.js";
import type { CrystalError } from "./error.js";
import { isCrystalError, newCrystalError } from "./error.js";
import { $$keys, executeBucket } from "./execution-v2.js";
import { withGlobalState } from "./global.js";
import type { Group } from "./graphqlCollectFields.js";
import {
  getDirectiveArg,
  graphqlCollectFields,
} from "./graphqlCollectFields.js";
import {
  graphqlMergeSelectionSets,
  interfaceTypeHasNonIntrospectionFieldQueriedInSelections,
  typesUsedInSelections,
} from "./graphqlMergeSelectionSets.js";
import type { InputPlan } from "./input.js";
import { inputPlan } from "./input.js";
import type {
  BaseGraphQLContext,
  BaseGraphQLRootValue,
  BaseGraphQLVariables,
  Batch,
  CrystalContext,
  CrystalObject,
  CrystalResultsList,
  FieldAndGroup,
  GroupedSelections,
  PlanOptions,
  PromiseOrDirect,
  TrackedArguments,
} from "./interfaces.js";
import {
  $$bypassGraphQL,
  $$concreteType,
  $$crystalContext,
  $$data,
  $$eventEmitter,
  $$idempotent,
  $$planResults,
  $$verbatim,
} from "./interfaces.js";
import type { PrintPlanGraphOptions } from "./mermaid.js";
import { printPlanGraph } from "./mermaid.js";
import type {
  ListCapablePlan,
  ModifierPlan,
  PolymorphicPlan,
  StreamablePlan,
} from "./plan.js";
import {
  assertArgumentsFinalized,
  assertExecutablePlan,
  assertFinalized,
  ExecutablePlan,
  isListCapablePlan,
  isStreamablePlan,
} from "./plan.js";
import type { PlanResultsBucket } from "./planResults.js";
import { PlanResults } from "./planResults.js";
import type { AccessPlan } from "./plans/index.js";
import {
  __InputObjectPlan,
  __ItemPlan,
  __TrackedObjectPlan,
  __ValuePlan,
  access,
} from "./plans/index.js";
import { __ListTransformPlan } from "./plans/listTransform.js";
import { assertPolymorphicData } from "./polymorphic.js";
import {
  $$crystalWrapped,
  isCrystalObject,
  isCrystalWrapped,
  newCrystalObject,
} from "./resolvers.js";
import { stripAnsi } from "./stripAnsi.js";
import {
  arrayOfLength,
  arraysMatch,
  defaultValueToValueNode,
  isPromiseLike,
  planGroupsOverlap,
  ROOT_VALUE_OBJECT,
  sharedNull,
} from "./utils.js";

/**
 * Once the plan has been requested once from context, we can just return the
 * same plan over and over without rebuilding it each time.
 *
 * @internal
 */
export const $$contextPlanCache = Symbol("contextPlanCache");
/**
 * If the request is an introspection-only request, we can cache the result and
 * return it over and over without rebuilding it each itme.
 */
const $$introspectionResponseCache = Symbol("introspectionResponseCache");

// How many times will we try re-optimizing before giving up
const MAX_OPTIMIZATION_LOOPS = 10;

/**
 * Use this via `Object.create(verbatimPrototype)` to mark an object as being
 * allowed to be used verbatim (i.e. it can be returned directly to the user
 * without having to go through GraphQL.js).
 */
const verbatimPrototype = Object.freeze(
  Object.assign(Object.create(null), { [$$verbatim]: true }),
);

/**
 * A description of all the fields that a GraphQL selection set can produce,
 * and whether each one is either a normal field, or the `__typename`
 * introspection field (which we can populate in advance).
 */
interface ObjectCreatorFields {
  [fieldName: string]: "normal" | "__typename";
}

/**
 * Returns a function that, given a type name, creates an object with the
 * fields in the given order and the $$verbatim, $$concreteType and any
 * __typename fields already populated. This is in an effort to make the
 * objects suitable to return directly without having to go via GraphQL.js.
 */
function makeObjectCreator(
  fields: ObjectCreatorFields,
): (typeName: string | null) => object {
  const keys = Object.keys(fields);
  /*
   * NOTE: because we use `Object.create(verbatimPrototype)` (and
   * `verbatimPrototype` is based on Object.create(null)) it's safe for us to
   * set keys such as `__proto__`. This would not be safe if we were to use
   * `{}` instead.
   */
  const unsafeKeys = keys.filter(
    (key) => !/^[A-Za-z_][A-Za-z0-9_]*$/.test(key),
  );
  if (unsafeKeys.length > 0) {
    throw new Error(`Unsafe keys: ${unsafeKeys.join(",")}`);
  }

  const functionBody = `\
return typeName => {
  return Object.assign(Object.create(verbatimPrototype), {
    [$$concreteType]: typeName,
${Object.entries(fields)
  .map(([fieldName, type]) => {
    switch (type) {
      case "normal":
        return `    ${fieldName}: undefined,\n`;
      case "__typename":
        return `    ${fieldName}: typeName,\n`;
      default: {
        throw new Error();
      }
    }
  })
  .join("")}
  });
}`;
  const f = new Function("verbatimPrototype", "$$concreteType", functionBody);
  return f(verbatimPrototype, $$concreteType) as any;
}

const identity = <T>(_: T): T => _;
identity[$$idempotent] = true;

// TODO: consider memoizing this
/**
 * When outputting a value directly (bypassing GraphQL) we must still serialize
 * it; this returns a suitable serializer for enum types. Note: if the enum's
 * values and keys are the same then it will return the identity function as an
 * optimization.
 */
function serializerForEnumType(
  type: GraphQLEnumType,
): GraphQLScalarType["serialize"] {
  const values = type.getValues();
  const lookup = new Map();
  let noTranslationNecessary = true;
  for (const value of values) {
    if (value.value !== value.name) {
      noTranslationNecessary = false;
    }
    lookup.set(value.value, value.name);
  }
  if (noTranslationNecessary) {
    return identity;
  }
  return (value) => lookup.get(value);
}

/**
 * When outputting a value directly (bypassing GraphQL) we must still serialize
 * it; this returns a suitable serializer for scalar types. Note: in case we
 * need to rollback to graphql-js execution we do not want to open ourselves to
 * double serialization errors, so we automatically roll back serialization
 * _unless_ the serializer is marked as idempotent. Where possible, it is best
 * to use idempotent serializers for this reason. An idempotent serializer is
 * one where `serialize(serialize(value)) === serialize(value)` for all values.
 */
function serializerForScalarType(
  type: GraphQLScalarType,
): GraphQLScalarType["serialize"] {
  const sz = type.serialize.bind(type);
  // All the built in serializers are idempotent - sz(sz(foo)) === sz(foo)
  const isIdempotent =
    type === GraphQLString ||
    type === GraphQLID ||
    type === GraphQLFloat ||
    type === GraphQLInt ||
    type === GraphQLBoolean ||
    type.serialize[$$idempotent] ||
    type.extensions.graphile?.idempotent;
  if (isIdempotent) {
    sz[$$idempotent] = true;
  }
  return sz;
}

/**
 * Returns true if this "executable plan" isn't actually executable because
 * it's a special internal plan type whose values get auto-populated
 */
const isInternalPlan = (plan: ExecutablePlan) =>
  plan instanceof __ValuePlan || plan instanceof __ItemPlan;

interface PlanCacheForPlanResultses {
  [planId: string]: PromiseOrDirect<any[]>;
}

function NOOP() {}

const $$FINISHED: unique symbol = Symbol("finished");

type ProcessResults = (
  planResultses: Array<PlanResults | CrystalError | null>,
  planCacheForPlanResultses: PlanCacheForPlanResultses,
) => PromiseOrDirect<any[]>;

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

const EMPTY_ARRAY = Object.freeze([] as any[]);

// For logging indentation
let depth = 0;

const debugAether = debugFactory("dataplanner:aether");
const debugPlan_ = debugAether.extend("plan");
const debugPlanVerbose_ = debugPlan_.extend("verbose");
const debugExecute_ = debugAether.extend("execute");
const debugExecuteVerbose_ = debugExecute_.extend("verbose");

const isDev = process.env.GRAPHILE_ENV === "development";

const depthWrap = (debugFn: debugFactory.Debugger) =>
  Object.assign(
    (t: string, ...args: any[]) => debugFn("  ".repeat(depth) + t, ...args),
    debugFn,
  );
const debugPlan = depthWrap(debugPlan_);
const debugPlanEnabled = debugPlan.enabled;
const debugExecute = depthWrap(debugExecute_);
const debugExecuteEnabled = isDev && debugExecute.enabled;
const debugPlanVerbose = depthWrap(debugPlanVerbose_);
const debugPlanVerboseEnabled = isDev && debugPlanVerbose.enabled;
const debugExecuteVerbose = depthWrap(debugExecuteVerbose_);
const debugExecuteVerboseEnabled = isDev && debugExecuteVerbose.enabled;

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

function makeDefaultPlan(fieldName: string) {
  return ($plan: ExecutablePlan<any>) => access($plan, [fieldName]);
}

/**
 * The FieldDigest stores a wealth of information about a specific field within
 * a GraphQL selection set.
 */
interface FieldDigest {
  parentFieldDigest: FieldDigest | null;

  /**
   * Where the field was in the GraphQL request.
   */
  pathIdentity: string;

  /**
   * Often the same as the `pathIdentity` but has `[]`s appended for each
   * layer of lists the field type has.
   */
  itemPathIdentity: string;

  /**
   * The name of the attribute this field will be output as in the GraphQL
   * response.
   */
  responseKey: string;

  returnType: GraphQLOutputType;
  namedReturnType: GraphQLNamedType & GraphQLOutputType;
  isPolymorphic: boolean;
  isLeaf: boolean;
  /** True if the field is a `__typename` field */
  isTypeName: boolean;

  /** How many GraphQLLists are involved in the return type of the field */
  listDepth: number;
  /**
   * True if the field is a leaf _or_ if the user has their own resolver for it, false otherwise.
   */
  returnRaw: boolean;
  planId: string;
  itemPlanId: string;
  /**
   * The field digests that are related to the selection set for this field.
   *
   * Important: this does **NOT** represent the response keys, it represents
   * all the fields that are selected on the child selection set - the same
   * response key might be represented multiple times for polymorphic fields.
   */
  childFieldDigests: null | FieldDigest[];
}

/**
 * "Prefetching" was a performance optimisation we used for a while before
 * moving to execution V2. This won't be needed once execution V2 is complete.
 *
 * TODO: phase this out.
 *
 * @internal
 */
interface PrefetchConfig {
  fieldDigest: FieldDigest;
  plan: ExecutablePlan;
  itemPlan: ExecutablePlan;
}

/**
 * See Aether.groups
 */
interface GroupAndChildren extends Group {
  id: number;
  parent: GroupAndChildren | null;
  children: Group[];
}

/**
 * Implements the `NewAether` algorithm.
 */
export class Aether<
  TVariables extends BaseGraphQLVariables = any,
  TContext extends BaseGraphQLContext = any,
  TRootValue extends BaseGraphQLRootValue = any,
> {
  /**
   * What state is the Aether in?
   *
   * 1. init
   * 2. plan
   * 3. validate
   * 4. deduplicate
   * 5. optimize
   * 6. finalize
   * 7. ready
   *
   * Once in 'ready' state we can execute the plan.
   */
  private phase: AetherPhase = "init";

  /**
   * A new 'group' is introduced whenever a field must evaluated at a later
   * time:
   *
   * - a deferred fragment's fields should run at a later time than its parent
   *   selection set,
   * - a streamed field's selection set should run at a later time than the
   *   field itself,
   * - a mutation's payload selection set should run at a later time than the
   *   mutation,
   * - a second mutation should run after the previous mutation's selection set
   *   has completed.
   *
   * When plans are in different groups they cannot be deduplicated, and this
   * should also be factored into optimisation decisions.
   *
   * @internal
   */
  public groups: Array<GroupAndChildren> = [];

  // TODO: can we remove TreeNodes now?
  private rootTreeNode: TreeNode = {
    pathIdentity: ROOT_PATH,
    fieldPathIdentity: ROOT_PATH,
    groupIds: [0],
    parent: null,
    children: [],
  };

  /**
   * The bucket at the root of the GraphQL request, all other buckets
   * are ancestors of this bucket.
   */
  private rootBucket: BucketDefinition;

  /**
   * All the bucket definitions needed for this Aether.
   *
   * @internal
   */
  public readonly buckets: BucketDefinition[] = [];

  /**
   * Debatable optimisation vs getting the length of this.plans
   *
   * @internal
   */
  private planCount = 0;
  /** @internal */
  private modifierPlanCount = 0;

  /**
   * The full list of ExecutablePlans that this Aether has created.
   *
   * @remarks
   *
   * Note that although this says that the type of the field is non-nullable we
   * may in fact store nulls, but we will only do so as the result of tree
   * shaking and it should generally be assumed that having done so nothing
   * can reference the deleted plan and thus no error will occur.
   */
  private readonly plans: {
    [key: string]: ExecutablePlan;
  } = Object.create(sharedNull);

  /**
   * This value is ethemeral, it only contains values whilst a specific field
   * is being planned.
   *
   * @internal
   */
  public readonly modifierPlans: ModifierPlan<any>[] = [];

  /**
   * This is a execution-time (rather than planning time) property - it's for
   * batching together requests from the same path identity so that multiple
   * requests can all be executed at once.
   *
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
  public subscriptionPlanId: string | undefined;

  /**
   * The plan id for the plan that represents a single payload in the subscription stream (if any)
   *
   * @internal
   */
  public subscriptionItemPlanId: string | undefined;

  /**
   * The plan by path identity is the plan that will return the results that
   * the resolver at that plan identity should return.
   *
   * @internal
   */
  public readonly planIdByPathIdentity: {
    [pathIdentity: string]: string | undefined;
  };
  /**
   * True if the field at the given path identity has no plan resolver
   * function.
   *
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
    [pathIdentity: string]: string | undefined;
  };

  /**
   * @internal
   */
  public readonly itemPlanIdByListPlanId: {
    [listPlanId: string]: string | undefined;
  } = Object.create(null);

  /**
   * @internal
   */
  public readonly itemPlanIdByListTransformPlanId: {
    [listPlanId: string]: string | undefined;
  } = Object.create(null);

  /**
   * @internal
   */
  public readonly sideEffectPlanIdsByPathIdentity: {
    [pathIdentity: string]: string[];
  };

  /**
   * @internal
   */
  public readonly transformDependencyPlanIdByTransformPlanId: {
    [transformPlanId: string]: string;
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
  public rootFieldDigest: FieldDigest | null = null;

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
   * mutations and features such as `@stream` and `@defer`. This behavior
   * ensures that only the logic required at each stage is executed at those
   * stages.
   *
   * @internal
   */
  public readonly groupIdsByPathIdentity: {
    [pathIdentity: string]: number[] | undefined;
  };

  /**
   * Details of any plan options for the given plan; currently only used for
   * the `@stream` directive.
   */
  private readonly planOptionsByPlan = new Map<ExecutablePlan, PlanOptions>();

  // TODO: this is hideous, there must be a better way. Search HIDEOUS_POLY
  private readonly polymorphicDetailsByPlanId: Record<
    string,
    { polymorphicPlanIds: string[]; typeNames: string[] }
  > = Object.create(null);

  /**
   * The root selection set is always an object (independent of what
   * `rootValue` is set to).
   *
   * @internal
   */
  public readonly rootSelectionSetPlan: __ValuePlan<object>;
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
  public readonly queryType: GraphQLObjectType;
  public readonly mutationType: GraphQLObjectType | undefined;
  public readonly subscriptionType: GraphQLObjectType | undefined;
  /**
   * @internal
   */
  public readonly unionsContainingObjectType: {
    [objectTypeName: string]: ReadonlyArray<GraphQLUnionType>;
  };

  /**
   * If true, then this operation doesn't use (custom) resolvers.
   */
  private pure = true;
  /**
   * If true, then this operation uses `__type` or `__schema` fields and thus
   * must go through GraphQL.js for resolution.
   *
   * NOTE: we're ignoring the `__typename` field deliberately, we can handle
   * that.
   */
  private hasIntrospectionFields = false;
  /**
   * If true, this request is purely for introspection (so maybe we can cache it...)
   */
  private hasNonIntrospectionFields = false;
  /**
   * True if the operation is simple enough that we can execute all the data
   * requirements before even hitting GraphQL
   */
  private canPreempt = false;
  /**
   * Factory for metaByPlanId variables.
   */
  private makeMetaByPlanId: () => CrystalContext["metaByPlanId"];

  private [$$contextPlanCache]: any = null;
  private [$$introspectionResponseCache]: any = null;

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
    this.queryType = queryType;
    this.queryTypeName = queryType.name;
    this.mutationType = mutationType ?? undefined;
    this.mutationTypeName = mutationType?.name;
    this.subscriptionType = subscriptionType ?? undefined;
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

    this.operationType = operation.operation;

    this.rootBucket = this.newBucket({
      parent: null,
      rootPathIdentities: [ROOT_PATH],
      groupId: 0,
    });
    assert.strictEqual(
      this.rootBucket.id,
      0,
      "Expected the root bucket to have id 0",
    );

    this.phase = "plan";
    /** with global state (think: React hooks) */
    const wgs = withGlobalState.bind(null, {
      aether: this,
      parentPathIdentity: GLOBAL_PATH,
    }) as <T>(cb: () => T) => T;
    this.rootSelectionSetPlan = wgs(() => new __ValuePlan());
    this.variableValuesPlan = wgs(() => new __ValuePlan());
    debugPlanVerbose(
      "Constructed variableValuesPlan %s",
      this.variableValuesPlan,
    );
    // TODO: this should use a more intelligent tracked object plan since the variables are strongly typed (unlike context/rootValue).
    this.trackedVariableValuesPlan = wgs(
      () =>
        new __TrackedObjectPlan(
          variableValues,
          this.variableValuesPlan,
          this.variableValuesConstraints,
        ),
    );
    if (debugPlanVerboseEnabled) {
      debugPlanVerbose(
        "Constructed trackedVariableValuesPlan %s",
        this.trackedVariableValuesPlan,
      );
    }
    this.contextPlan = wgs(() => new __ValuePlan());
    debugPlanVerbose("Constructed contextPlan %s", this.contextPlan);
    this.trackedContextPlan = wgs(
      () =>
        new __TrackedObjectPlan(
          context,
          this.contextPlan,
          this.contextConstraints,
        ),
    );
    if (debugPlanVerboseEnabled) {
      debugPlanVerbose(
        "Constructed trackedContextPlan %s",
        this.trackedContextPlan,
      );
    }
    this.rootValuePlan = wgs(() => new __ValuePlan());
    debugPlanVerbose("Constructed rootValuePlan %s", this.rootValuePlan);
    this.trackedRootValuePlan = wgs(
      () =>
        new __TrackedObjectPlan(
          rootValue,
          this.rootValuePlan,
          this.rootValueConstraints,
        ),
    );
    if (debugPlanVerboseEnabled) {
      debugPlanVerbose(
        "Constructed trackedRootValuePlan %s",
        this.trackedRootValuePlan,
      );
    }
    this.planIdByPathIdentity = Object.assign(Object.create(null), {
      [ROOT_PATH]: this.rootSelectionSetPlan.id,
    });
    this.isUnplannedByPathIdentity = Object.create(null);
    this.itemPlanIdByFieldPathIdentity = Object.assign(Object.create(null), {
      [ROOT_PATH]: this.planIdByPathIdentity[ROOT_PATH],
    });
    this.sideEffectPlanIdsByPathIdentity = Object.create(null);
    this.transformDependencyPlanIdByTransformPlanId = Object.create(null);
    this.returnRawValueByPathIdentity = Object.create(null);
    this.groupIdsByPathIdentity = Object.assign(Object.create(null), {
      [ROOT_PATH]: [0],
    });
    this.pathIdentityByParentPathIdentity[ROOT_PATH] = Object.create(null);
    this.groups.push({
      id: 0,
      parent: null,
      parentPlanId: this.rootSelectionSetPlan.id,
      reason: "root",
      children: [],
    });
    try {
      switch (this.operationType) {
        case "query": {
          this.pathIdentityByParentPathIdentity[ROOT_PATH][this.queryTypeName] =
            Object.create(null);
          this.planQuery();
          break;
        }
        case "mutation": {
          this.pathIdentityByParentPathIdentity[ROOT_PATH][
            this.mutationTypeName!
          ] = Object.create(null);
          this.planMutation();
          break;
        }
        case "subscription": {
          this.pathIdentityByParentPathIdentity[ROOT_PATH][
            this.subscriptionTypeName!
          ] = Object.create(null);
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
      if (debugPlanVerboseEnabled) {
        this.logPlansByPath();
      }
      throw new Error(`Failed to plan this query.`);
    }

    this.phase = "validate";

    // Helpfully check plans don't do forbidden things.
    this.validatePlans();

    // Log the initial plan map
    if (debugPlanVerboseEnabled) {
      this.logPlansByPath("initial");
    }

    // Get rid of temporary plans
    this.treeShakePlans();

    this.phase = "deduplicate";

    // Squish plans together; this should result in no changes because plans
    // are deduplicated during creation.
    this.deduplicatePlans();

    // Get rid of unneeded plans
    this.treeShakePlans();

    // Log the plan map after deduplication
    if (debugPlanVerboseEnabled) {
      this.logPlansByPath("after deduplication");
    }

    this.phase = "optimize";

    // Replace/inline/optimise plans
    this.optimizePlans();

    // Get rid of plans that are no longer needed after optimising
    this.treeShakePlans();

    this.phase = "finalize";

    // Plans are expected to execute later; they may take steps here to prepare
    // themselves (e.g. compiling SQL queries ahead of time).
    this.finalizePlans();

    // Populate 'dependentPlans' for all plans, also fix the depIds
    for (const [id, plan] of Object.entries(this.plans)) {
      if (plan && plan.id === id) {
        for (let i = 0, l = plan.dependencies.length; i < l; i++) {
          const depId = plan.dependencies[i];
          const dep = this.plans[depId];

          // Fix the dependency reference
          (plan.dependencies[i] as any) = dep.id;

          dep.dependentPlans.push(plan);
        }
      }
    }

    // Assign bucket IDs; this MUST come after finalization otherwise
    // `__ListTransformPlan`s will be broken
    this.assignBucketIds();

    // Log the plan now we're all done
    if (debugPlanEnabled) {
      const why = "after optimization and finalization";
      debugPlan("Plans%s: %s", why ? ` ${why}` : "", "\n" + this.printPlans());
      debugPlan(
        `Plans by path%s: %s`,
        why ? ` ${why}` : "",
        "\n" + this.printPlansByPath(),
      );
      debugPlan(`Plan graph: %s`, "\n" + this.printPlanGraph());
    }

    this.phase = "ready";

    this.walkFinalizedPlans();
    this.preparePrefetches();

    this.canPreempt = (() => {
      if (!this.pure) {
        // Cannot currently preempt operations that involve user-supplied resolvers
        return false;
      }
      if (this.operationType !== "query") {
        // Cannot currently preempt mutation/subscription requests
        return false;
      }
      if (this.groups.length > 1) {
        // Cannot currently preempt stream/defer/subscription/mutation execution
        return false;
      }
      if (
        this.buckets.some(
          (b) =>
            (b.groupId != null && b.groupId !== 0) ||
            b.polymorphicPlanIds != null,
        )
      ) {
        // Cannot currently preempt polymorphic/grouped operations
        return false;
      }
      return true;
    })();

    /*
     * A JIT'd object constructor, roughly equivalent to:

       const makeMetaByPlanId = () => {
         const metaByPlanId = Object.create(null);
         for (const [planId, plan] of Object.entries(this.plans)) {
           if (plan && plan.id === planId) {
             metaByPlanId[plan.id] = Object.create(null);
           }
         }
       }
    */
    this.makeMetaByPlanId = new Function(
      `return { ${Object.entries(this.plans)
        .map(([planId, plan]) =>
          plan && plan.id === planId ? `${plan.id}: Object.create(null)` : null,
        )
        .filter(isNotNullish)
        .join(", ")} }`,
    ) as any;
  }

  private newBucket(
    spec: Pick<
      BucketDefinition,
      | "parent"
      | "itemPlanId"
      | "groupId"
      | "polymorphicPlanIds"
      | "polymorphicTypeNames"
      | "rootPathIdentities"
    >,
  ): BucketDefinition {
    const id = this.buckets.length;
    const singleTypeNameByRootPathIdentity: BucketDefinition["singleTypeNameByRootPathIdentity"] =
      spec.polymorphicTypeNames ? null : Object.create(null);
    if (singleTypeNameByRootPathIdentity) {
      for (const rootPathIdentity of spec.rootPathIdentities) {
        if (rootPathIdentity == ROOT_PATH) {
          singleTypeNameByRootPathIdentity[rootPathIdentity] =
            this.operationType === "query"
              ? this.queryTypeName
              : this.operationType === "mutation"
              ? this.mutationTypeName!
              : this.operationType === "subscription"
              ? this.subscriptionTypeName!
              : (null as never);
        } else {
          const trimmedRootPathIdentity = rootPathIdentity.replace(
            /(?:\[\])+$/,
            "",
          );
          const fieldDigest =
            this.fieldDigestByPathIdentity[trimmedRootPathIdentity];
          if (fieldDigest) {
            singleTypeNameByRootPathIdentity[rootPathIdentity] =
              fieldDigest.namedReturnType.name;
          } else {
            throw new Error(
              `Could not find fieldDigest for ${trimmedRootPathIdentity} (valid IDs: ${Object.keys(
                this.fieldDigestByPathIdentity,
              )})`,
            );
          }
        }
      }
    }
    const bucket: BucketDefinition = {
      id,
      ...spec,
      singleTypeNameByRootPathIdentity,
      outputMap: Object.create(null),
      ancestors: spec.parent ? [...spec.parent.ancestors, spec.parent] : [],
      children: [],
      copyPlanIds: [],
      plans: [],
      startPlans: [],
    };
    spec.parent?.children.push(bucket);
    this.buckets[id] = bucket;
    return bucket;
  }

  /**
   * Called by `graphqlCollectFields` when a new boundary is met -
   * mutations/mutation payloads/stream/defer.
   *
   * @internal
   */
  public addGroup(group: Group): number {
    if (!group.parent) {
      throw new Error("Only the root group may have no parent");
    }
    if (group.reason === "root") {
      throw new Error("Only the root group may use the 'root' reason");
    }
    const id = this.groups.length;
    const groupAndChildren = Object.assign(group, {
      id,
      children: [],
    }) as GroupAndChildren;
    groupAndChildren.parent!.children.push(groupAndChildren);
    this.groups[id] = groupAndChildren;
    return id;
  }

  /**
   * Gets the item plan for a given parent list plan - this ensures we only
   * create one item plan per parent plan.
   */
  private itemPlanFor<TData>(
    listPlan: ExecutablePlan<TData> | ExecutablePlan<TData[]>,
    depth = 0,
  ): __ItemPlan<TData> {
    const itemPlanId = this.itemPlanIdByListPlanId[listPlan.id];
    if (itemPlanId !== undefined) {
      return this.plans[itemPlanId] as __ItemPlan<TData>;
    }
    const itemPlan = new __ItemPlan(listPlan, depth);
    this.itemPlanIdByListPlanId[listPlan.id] = itemPlan.id;
    return itemPlan;
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

  // TODO: phase this out.
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

      // TODO: restore prefetching
      if (Math.random() < 2) {
        continue;
      }

      const itemPlan = this.dangerouslyGetPlan(fieldDigest.itemPlanId);

      // Find all the plans that should already have been executed by now (i.e. have been executed by parent fields)
      const executedPlanIds = new Set<string>();
      const itemPlanId =
        this.itemPlanIdByFieldPathIdentity[fieldDigest.pathIdentity];
      if (itemPlanId != null) {
        executedPlanIds.add(itemPlanId);
      }
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
        if (prefetchConfig) {
          for (const localPlan of prefetchConfig.local) {
            executedPlanIds.add(localPlan.id);
          }
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
      const plansAtThisLevel = Object.values(this.plans).filter(
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
            (plan) => !plan.isSyncAndSafe || plan.hasSideEffects,
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

  private setRootFieldDigest(
    type: GraphQLObjectType,
    childFieldDigests: FieldDigest[],
  ) {
    this.rootFieldDigest = {
      parentFieldDigest: null,
      pathIdentity: ROOT_PATH,
      itemPathIdentity: ROOT_PATH,
      responseKey: "",
      returnType: type,
      namedReturnType: type,
      returnRaw: false,
      isPolymorphic: false,
      isTypeName: false,
      isLeaf: false,
      planId: this.rootSelectionSetPlan.id,
      itemPlanId: this.rootSelectionSetPlan.id,
      listDepth: 0,
      childFieldDigests,
    };
    this.fieldDigestByPathIdentity[ROOT_PATH] = this.rootFieldDigest;
    childFieldDigests.forEach((digest) => {
      digest.parentFieldDigest = this.rootFieldDigest!;
    });
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
    const { fieldDigests } = this.planSelectionSet(
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
    this.setRootFieldDigest(this.queryType, fieldDigests);
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
    const { fieldDigests } = this.planSelectionSet(
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
    this.setRootFieldDigest(this.mutationType!, fieldDigests);
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
    const wgs = withGlobalState.bind(null, {
      aether: this,
      parentPathIdentity: ROOT_PATH,
    }) as <T>(cb: () => T) => T;
    const groupedFieldSet = wgs(() =>
      graphqlCollectFields(this, this.trackedRootValuePlan.id, rootType, [
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
        () => subscribePlan.itemPlan(this.itemPlanFor(subscribePlan)),
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
      this.setRootFieldDigest(this.subscriptionType!, fieldDigests);
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
      this.setRootFieldDigest(this.subscriptionType!, fieldDigests);
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
    const groupedFieldSet = withGlobalState(
      {
        aether: this,
        parentPathIdentity: parentFieldPathIdentity,
      },
      () =>
        graphqlCollectFields(
          this,
          parentPlan.id,
          objectType,
          groupedSelectionsList,
          isMutation,
        ),
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

      // This is presumed to exist because the operation passed validation.
      const objectField = objectTypeFields[fieldName];

      if (fieldName.startsWith("__")) {
        if (fieldName === "__typename") {
          const fieldDigest: FieldDigest = {
            parentFieldDigest: null,
            pathIdentity,
            itemPathIdentity: pathIdentity,
            responseKey,
            returnType: TypeNameMetaFieldDef.type,
            namedReturnType: getNamedType(TypeNameMetaFieldDef.type),
            returnRaw: true,
            isPolymorphic: false,
            isLeaf: true,
            isTypeName: true,
            planId: "__typename",
            itemPlanId: "__typename",
            listDepth: 0,
            childFieldDigests: null,
          };
          this.fieldDigestByPathIdentity[pathIdentity] = fieldDigest;
          fieldDigests.push(fieldDigest);
        } else {
          this.hasIntrospectionFields = true;
        }
        // Introspection field, skip
        continue;
      } else {
        this.hasNonIntrospectionFields = true;
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

      const typePlan = objectType.extensions?.graphile?.Plan;

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
        const oldPlansLength = this.planCount;
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

        const newPlansLength = this.planCount;
        if (debugPlanVerboseEnabled) {
          debugPlanVerbose(
            "Created %o new plans whilst processing %p",
            newPlansLength - oldPlansLength,
            pathIdentity,
          );
        }

        this.finalizeArgumentsSince(oldPlansLength, pathIdentity, true);

        // Now that the field has been planned (including arguments, but NOT
        // including selection set) we can deduplicate it to see if any of its
        // peers are identical.
        this.deduplicatePlans(oldPlansLength);

        // After deduplication, this plan may have been substituted; get the
        // updated reference.
        plan = this.plans[plan.id]!;
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
        this.pathIdentityByParentPathIdentity[pathIdentity] =
          Object.create(null);
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
        isTypeName: false,
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
    const ids = this.getPlanIds(oldPlansLength);
    for (const i of ids) {
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
            // This does NOT use `itemPlanFor` because __ListTransformPlans are special.
            const $__listItem = new __ItemPlan(listPlan);
            $__listItem.transformPlanId = newPlan.id;
            this.itemPlanIdByListTransformPlanId[newPlan.id] = $__listItem.id;
            const $listItem = listPlan.listItem?.($__listItem) ?? $__listItem;
            const $newListItem = newPlan.itemPlanCallback($listItem);

            if (
              newPlan.isSyncAndSafe &&
              (!$__listItem.isSyncAndSafe ||
                !$listItem.isSyncAndSafe ||
                !$newListItem.isSyncAndSafe)
            ) {
              // TODO: log this deopt?
              newPlan.isSyncAndSafe = false;
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
      const oldPlansLength = this.planCount;

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
                this.itemPlanFor(plan, listDepth),
              )
          : () => this.itemPlanFor(plan, listDepth),
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

      const oldPlansLength = this.planCount;
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
            if (debugPlanVerboseEnabled) {
              this.logPlansByPath();
            }
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
        ] = Object.create(null);
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

            const oldPlansLength = this.planCount;
            // This line implements `GetPolymorphicObjectPlanForType`.
            const subPlan = wgs(() =>
              polymorphicPlan.planForType(possibleObjectType),
            );

            // TODO: this is hideous, there must be a better way. Search HIDEOUS_POLY
            {
              let details = this.polymorphicDetailsByPlanId[subPlan.id];
              if (!details) {
                this.polymorphicDetailsByPlanId[subPlan.id] = details = {
                  polymorphicPlanIds: [],
                  typeNames: [],
                };
              }
              if (!details.polymorphicPlanIds.includes(polymorphicPlan.id)) {
                details.polymorphicPlanIds.push(polymorphicPlan.id);
              }
              if (!details.typeNames.includes(possibleObjectType.name)) {
                details.typeNames.push(possibleObjectType.name);
              }
            }

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
            ] = Object.create(null);

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
          /*#__INLINE__*/ planPossibleObjectTypes(possibleObjectTypes);
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
            /*#__INLINE__*/ planPossibleObjectTypes(implementations);
          } else {
            const possibleObjectTypes = typesUsedInSelections(
              this,
              implementations,
              subSelections,
            );
            /*#__INLINE__*/ planPossibleObjectTypes(possibleObjectTypes);
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
    this.modifierPlanCount = 0;

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
      trackedValuePlan instanceof __InputObjectPlan,
      "Expected trackedValuePlan to be an __InputObjectPlan",
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

  private getPlanIds(offset = 0) {
    return Object.keys(this.plans).slice(offset);
  }

  private validatePlans(offset = 0): void {
    const errors: Error[] = [];
    const ids = this.getPlanIds(offset);
    for (const id of ids) {
      const plan = this.plans[id];
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
    this.assignGroupIds(offset);
  }

  /**
   * Processes the plans making sure to process the leaves of the plan DAG
   * first and then working our way back up the graph to the root nodes.
   *
   * @internal
   */
  public processPlans(
    actionDescription: string,
    order: "dependents-first" | "dependencies-first",
    callback: (plan: ExecutablePlan<any>) => ExecutablePlan<any>,
    {
      onPlanReplacement,
      offset = 0,
    }: {
      onPlanReplacement?: (
        originalPlan: ExecutablePlan,
        replacementPlan: ExecutablePlan,
      ) => void;
      offset?: number;
    } = {},
  ): void {
    depth = 0;
    const processed = new Set<ExecutablePlan>();
    const processPlan = (plan: ExecutablePlan): void => {
      if (!plan) {
        return;
      }
      if (processed.has(plan)) {
        return;
      }
      const shouldAbort = () => {
        if (!this.plans[plan.id]) {
          if (debugPlanVerboseEnabled) {
            debugPlanVerbose(
              "%c is no longer needed; aborting %s",
              plan,
              actionDescription,
            );
          }
          return true;
        }
        return false;
      };
      // Process dependents first
      const first = new Set<string>();
      if (order === "dependents-first") {
        Object.values(this.plans).forEach((possibleDependent) => {
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
          if (debugPlanVerboseEnabled) {
            debugPlanVerbose(
              `Before we can %s %c we must %s %c`,
              actionDescription,
              plan,
              actionDescription,
              depPlan,
            );
          }
          depth++;
          processPlan(depPlan);
          depth--;
          if (shouldAbort()) {
            return;
          }
        }
      }
      let replacementPlan: ExecutablePlan;
      const oldPlansLength = this.planCount;
      try {
        replacementPlan = withGlobalState(
          {
            aether: this,
            parentPathIdentity: plan.parentPathIdentity,
          },
          () => callback(plan),
        );
      } catch (e) {
        if (debugPlanVerboseEnabled) {
          this.logPlans();
        }
        console.error(
          `Error occurred whilst processing ${plan} in ${order} mode`,
        );
        throw e;
      }

      // TODO: what pathIdentity should this be?
      this.finalizeArgumentsSince(oldPlansLength, ROOT_PATH);

      if (replacementPlan != plan) {
        // Replace all references to `plan` with `replacementPlan`
        const ids = this.getPlanIds();
        for (const j of ids) {
          if (this.plans[j] && this.plans[j].id === plan.id) {
            this.plans[j] = replacementPlan;
          }
        }

        onPlanReplacement?.(plan, replacementPlan);
      }
      processed.add(plan);
    };

    let plansAdded = 0;
    const oldPlanCount = this.planCount;
    let l = oldPlanCount;
    const ids = this.getPlanIds(offset);
    for (const i of ids) {
      processPlan(this.plans[i]);

      plansAdded += this.planCount - l;

      // NOTE: whilst processing plans new plans may be added, thus we must loop
      // ascending and we must re-evaluate this.planCount on each loop
      // iteration.
      if (isDev && plansAdded > 100000) {
        throw new Error(
          `Whilst processing plans as part of ${actionDescription}Plans, ${plansAdded} new plans have been created... That seems like it's likely a bug in the relevant method of one of your plans. The last plan processed was ${this.plans[i]}`,
        );
      }

      l = this.planCount;
    }

    if (this.planCount > oldPlanCount) {
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
  private deduplicatePlans(offset = 0): void {
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
        { offset },
      );
      loops++;
    } while (replacements > 0);
    debugPlanVerbose(
      "ExecutablePlan deduplication complete after %o loops",
      loops,
    );
  }

  /**
   * Implements the `OptimizePlans` algorithm. Note that we loop backwards
   * since later plans are dependent on earlier plans, so by starting at the
   * latest plans we can make sure that we know all our dependent's needs
   * before we optimise ourself.
   */
  private optimizePlans(): void {
    const thirdAndFutureLoopReplacedPlans: ExecutablePlan[] = [];
    for (let loops = 0; loops < MAX_OPTIMIZATION_LOOPS; loops++) {
      let replacedPlan = false;
      this.processPlans(
        "optimize",
        "dependents-first",
        (plan) => this.optimizePlan(plan),
        {
          onPlanReplacement: (_originalPlan, _replacementPlan) => {
            replacedPlan = true;
            if (loops >= 3) {
              thirdAndFutureLoopReplacedPlans.push(_originalPlan);
            }
            // TODO: we should be able to optimize this - we know the new and old
            // plan so we should be able to look at just the original plan's
            // dependencies and see if they're needed any more or not.
            this.treeShakePlans();
          },
        },
      );
      if (!replacedPlan) {
        return;
      }
    }
    console.warn(
      `Optimize plans looped ${MAX_OPTIMIZATION_LOOPS} times, and was still replacing plans at the end - this could indicate a very complex plan, or badly behaved plans. Here are some of the plans that were replaced after the second loop: ${thirdAndFutureLoopReplacedPlans
        .slice(0, 10)
        .join(", ")}`,
    );
  }

  private isPeer(planA: ExecutablePlan, planB: ExecutablePlan): boolean {
    // Can only merge if plan is of same type.
    if (planA.constructor !== planB.constructor) {
      return false;
    }

    // Can only merge if the plans exist in the same "groups"
    if (planGroupsOverlap(planA, planB)) {
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

    if (plan instanceof __ItemPlan) {
      // __ItemPlan cannot be deduplicated
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
    const peers = Object.entries(this.plans)
      .filter(([id, potentialPeer]) => {
        if (
          potentialPeer &&
          potentialPeer.id === id &&
          !potentialPeer.hasSideEffects &&
          !seenIds.has(potentialPeer.id) &&
          this.isPeer(plan, potentialPeer)
        ) {
          seenIds.add(potentialPeer.id);
          return true;
        }
        return false;
      })
      .map((tuple) => tuple[1]);

    // TODO: should we keep this optimisation, or should we remove it so that
    // plans that are "smarter" than us can return replacement plans even if
    // they're not peers?
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
      if (this.itemPlanIdByListPlanId[plan.id] !== undefined) {
        const itemPlan = this.plans[
          this.itemPlanIdByListPlanId[plan.id]!
        ] as __ItemPlan<any>;
        const replacementItemPlan = this.itemPlanFor(
          replacementPlan,
          itemPlan.depth,
        );
        // Replace the __ItemPlan for this entry
        this.itemPlanIdByListPlanId[plan.id] = replacementItemPlan.id;
      }
      if (debugPlanVerboseEnabled) {
        debugPlanVerbose(
          "Deduplicated %c with peers %c => %c",
          plan,
          peers,
          replacementPlan,
        );
      }
    } else {
      if (debugPlanVerboseEnabled) {
        debugPlanVerbose("Didn't deduplicate %c with peers %c", plan, peers);
      }
    }
    return replacementPlan;
  }

  /**
   * Implements the `OptimizePlan` algorithm.
   */
  private optimizePlan(plan: ExecutablePlan): ExecutablePlan {
    if (plan.isOptimized && !plan.allowMultipleOptimizations) {
      return plan;
    }
    const options = this.planOptionsByPlan.get(plan);
    const replacementPlan = plan.optimize({ stream: options?.stream ?? null });
    plan.isOptimized = true;
    if (debugPlanVerboseEnabled) {
      if (replacementPlan !== plan) {
        debugPlanVerbose(
          "Optimized %c into %c (replaced plan)",
          plan,
          replacementPlan,
        );
      } else {
        debugPlanVerbose("Optimized %c (same plan)", plan);
      }
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

    // Mark all group-root plans as active.
    for (const group of this.groups) {
      const plan = this.plans[group.parentPlanId];
      if (isDev) {
        assert.ok(
          plan,
          `Could not find group ${group.id} parent plan for identifier '${group.parentPlanId}'`,
        );
      }
      this.markPlanActive(plan, activePlans);
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

    const ids = this.getPlanIds();
    for (const i of ids) {
      const plan = this.plans[i];
      if (plan && !activePlans.has(plan)) {
        if (debugPlanVerboseEnabled && plan.id === i) {
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

      const sideEffectPlanIds =
        this.sideEffectPlanIdsByPathIdentity[treeNode.pathIdentity];
      if (sideEffectPlanIds) {
        sideEffectPlanIds.forEach((sideEffectPlanId) =>
          processPlan(this.plans[sideEffectPlanId]),
        );
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
   *
   * This information is also used for deduplication (e.g. you cannot
   * deduplicate a plan that's used in two separate defers but not in the
   * parent selection set), and is indirectly factored into determining the
   * bucketId for the plan.
   */
  private assignGroupIds(_offset = 0) {
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

  private getPathIdentitiesByPlanId() {
    const pathIdentitiesByPlanId: {
      [planId: string]: string[];
    } = Object.create(null);

    for (const [pathIdentity, rawPlanId] of Object.entries(
      this.planIdByPathIdentity,
    )) {
      if (rawPlanId != null) {
        const planId = this.plans[rawPlanId].id;
        if (!pathIdentitiesByPlanId[planId]) {
          pathIdentitiesByPlanId[planId] = [];
        }
        pathIdentitiesByPlanId[planId].push(pathIdentity);
      }
    }
    if (this.subscriptionPlanId != null) {
      const subscriptionPlan = this.plans[this.subscriptionPlanId];
      pathIdentitiesByPlanId[subscriptionPlan.id] = [ROOT_PATH];
    }
    for (const list of Object.values(pathIdentitiesByPlanId)) {
      list.sort((a, z) => a.length - z.length);
    }
    const keys = Object.keys(pathIdentitiesByPlanId).sort(
      (a, z) => parseInt(a.slice(1), 10) - parseInt(z.slice(1), 10),
    );
    // Return pathIdentitiesByPlanId but with sorted keys
    return keys.reduce((memo, key) => {
      memo[key] = pathIdentitiesByPlanId[key];
      return memo;
    }, Object.create(null) as typeof pathIdentitiesByPlanId);
  }

  private assignBucketIds() {
    const pathIdentitiesByPlanId = this.getPathIdentitiesByPlanId();

    // See description of BucketDefinition for fuller explanation of this algorithm
    const bucketByBucketKey: {
      [groupKey: string]: BucketDefinition;
    } = {
      0: this.rootBucket,
    };
    const processedPlans = new Set<ExecutablePlan>();
    const processPlan = (plan: ExecutablePlan) => {
      if (processedPlans.has(plan)) {
        return;
      }
      processedPlans.add(plan);

      if (
        // TODO: should this be "if (plan instanceof __ValuePlan)"?
        (
          [
            this.rootSelectionSetPlan,
            this.variableValuesPlan,
            this.contextPlan,
            this.rootValuePlan,
          ] as ExecutablePlan[]
        ).includes(plan)
      ) {
        (plan.groupIds as any) = [0];
        plan.primaryGroupId = 0;
      } else if (plan.groupIds.length === 0 || plan.groupIds.includes(0)) {
        (plan.groupIds as any) = [0];
        plan.primaryGroupId = 0;
      } else if (plan.groupIds.length === 1) {
        plan.primaryGroupId = plan.groupIds[0];
      } else {
        let g: GroupAndChildren | null = this.groups[plan.groupIds[0]];
        // Find a 'g' such that 'g' is an ancestor (or self) of all of the
        // plan's groups.
        while (g) {
          if (
            plan.groupIds.every((groupId) => {
              // Is g an ancestor of groupId?
              let ancestor: GroupAndChildren | null = this.groups[groupId];
              while (ancestor) {
                if (ancestor === g) {
                  return true;
                }
                ancestor = ancestor.parent;
              }
              return false;
            })
          ) {
            break;
          }
          g = g.parent;
        }
        if (!g) {
          throw new Error(
            `Failed to find common group ID - this should be impossible because group 0 is a common group ID for everything`,
          );
        }
        plan.primaryGroupId = g.id;
      }

      // TODO: this is hideous, there must be a better way. Search HIDEOUS_POLY
      /**
       * Due to plan rewriting/deduplication/etc, there may be multiple ids
       * that point to this same plan. What are they all?
       */
      const equivalentPlanIds = Object.keys(this.plans).filter(
        (id) => this.plans[id] === plan,
      );

      const dependencyPlans = plan.dependencies.map((depId) => {
        const dep = this.plans[depId]!;
        processPlan(dep);
        return dep;
      });
      const allParents = [
        ...new Set(dependencyPlans.map((plan) => this.buckets[plan.bucketId])),
      ];

      // Go through `allParents` and remove the buckets who are contained in the ancestors of other buckets
      const nonOverlappingParents = new Set(allParents);
      for (const parent of nonOverlappingParents) {
        for (const otherParent of nonOverlappingParents) {
          if (
            otherParent !== parent &&
            otherParent.ancestors.includes(parent)
          ) {
            nonOverlappingParents.delete(parent);
            break;
          }
        }
      }
      // What's left are the unique parent buckets
      const parents = [...nonOverlappingParents.values()];

      const polymorphicDetailsList = equivalentPlanIds
        .map((planId) => this.polymorphicDetailsByPlanId[planId])
        .filter(isNotNullish);

      const polymorphicDetails = polymorphicDetailsList.reduce(
        (memo, polymorphicDetailsListEntry) => {
          if (memo === undefined) {
            return {
              polymorphicPlanIds:
                polymorphicDetailsListEntry.polymorphicPlanIds.map(
                  (id) => this.plans[id].id,
                ),
              typeNames: [...polymorphicDetailsListEntry.typeNames],
            };
          } else {
            const ids = polymorphicDetailsListEntry.polymorphicPlanIds.map(
              (id) => this.plans[id].id,
            );
            for (const id of ids) {
              if (!memo.polymorphicPlanIds.includes(id)) {
                memo.polymorphicPlanIds.push(id);
              }
            }
            for (const typeName of polymorphicDetailsListEntry.typeNames) {
              if (!memo.typeNames.includes(typeName)) {
                memo.typeNames.push(typeName);
              }
            }
            return memo;
          }
        },
        undefined as
          | undefined
          | { polymorphicPlanIds: string[]; typeNames: string[] },
      );

      const itemPlanId = plan instanceof __ItemPlan ? plan.id : undefined;
      // Plans that are in a new group get their own bucket
      const groupId =
        plan.primaryGroupId !== 0 &&
        (plan.dependencies.length === 0 ||
          plan.dependencies.every(
            (depId) => plan.primaryGroupId !== this.plans[depId].primaryGroupId,
          ))
          ? plan.primaryGroupId
          : undefined;
      const polymorphicPlanIds = polymorphicDetails
        ? polymorphicDetails.polymorphicPlanIds
        : undefined;
      const polymorphicTypeNames = polymorphicDetails
        ? polymorphicDetails.typeNames
        : undefined;
      /*
      const fieldDigests = pathIdentitiesByPlanId[plan.id]
        ?.map((pathIdentity) => this.fieldDigestByPathIdentity[pathIdentity])
        .filter(isNotNullish);
      */

      const group = groupId ? this.groups[groupId] : null;

      let parent: BucketDefinition | null | undefined = undefined;

      const itemPlan = plan instanceof __ItemPlan ? plan : null;
      const transformPlan = itemPlan?.transformPlanId
        ? (this.plans[itemPlan.transformPlanId]! as __ListTransformPlan<
            any,
            any,
            any
          >)
        : null;

      const bucketKeyParts: string[] = [];

      if (itemPlan) {
        bucketKeyParts.push(`item=${itemPlan.id}`);
        if (transformPlan) {
          processPlan(transformPlan);
          transformPlan.itemPlanId = itemPlan.id;
          const potentialParent = this.buckets[transformPlan.bucketId];
          parent = parent ? deeper(parent, potentialParent) : potentialParent;
        } else {
          /**
           * The plan that returns the items; though this is called "listPlan"
           * it could also be a subscription plan which returns a stream of
           * results.
           */
          const listPlan = this.plans[plan.dependencies[0]]!;
          processPlan(listPlan);
          const potentialParent = this.buckets[listPlan.bucketId];
          parent = parent ? deeper(parent, potentialParent) : potentialParent;
        }
      }

      // Plans that are in a new group (and don't have a bucket already due to being __ItemPlans) get their own bucket
      if (groupId !== undefined) {
        bucketKeyParts.push(`group=${groupId}`);
        const group = this.groups[plan.primaryGroupId];
        const groupParentPlan = this.plans[group.parentPlanId];
        if (!groupParentPlan) {
          throw new Error(
            `Group ${plan.primaryGroupId} had parentPlanId ${group.parentPlanId} but we couldn't find a plan with that id.`,
          );
        }
        processPlan(groupParentPlan);
        if (parents.length > 1) {
          throw new Error(
            `GraphileInternalError<74be1e65-f549-4ec8-bd2b-6f8f0b72f7aa>: there was more than one parent bucket of a grouped plan`,
          );
        }
        const depsParentBucket = parents[0] as BucketDefinition | undefined;
        const groupParentBucket = this.buckets[groupParentPlan.bucketId];
        const potentialParent = depsParentBucket
          ? deeper(depsParentBucket, groupParentBucket)
          : groupParentBucket;
        parent = parent ? deeper(parent, potentialParent) : potentialParent;
      }

      // The "planForType" from polymorphic plans get their own buckets
      if (polymorphicPlanIds !== undefined) {
        if (polymorphicTypeNames == null) {
          throw new Error(
            `GraphileInternalError<3b9e4942-f401-4755-93e3-046776c32d06>: polymorphicTypeNames was null but polymorphicPlanIds was not`,
          );
        }
        bucketKeyParts.push(
          `polymorphicPlanIds=${polymorphicPlanIds.join(
            ",",
          )};typeNames=${polymorphicTypeNames.join(",")}`,
        );
        const potentialParent =
          parents.length === 0 ? this.rootBucket : parents[0];
        parent = parent ? deeper(parent, potentialParent) : potentialParent;
      }

      // Is it not special?
      if (bucketKeyParts.length === 0) {
        // Plans with no dependencies go in the root bucket
        if (parents.length === 0) {
          plan.bucketId = this.rootBucket.id;
          return plan;
        }

        // If there's only one parent bucket, we just reuse that
        if (parents.length === 1) {
          plan.bucketId = parents[0].id;
          return plan;
        }

        throw new Error(
          `GraphileInternalError<9d83ff70-0240-416d-b79e-1b1593600b6d>: planning error; every "bucket" should have exactly one parent, however when attempting to assign a bucket to ${plan} we found that its dependencies come from ${
            parents.length
          } incompatible buckets: ${parents.map(
            (bucket) =>
              `${bucket.id}(i=${bucket.itemPlanId ?? "-"}, g=${
                bucket.groupId ?? "-"
              }, t=${bucket.polymorphicTypeNames?.join(",") ?? "-"}, p=${
                bucket.parent
              })`,
          )}`,
        );
      }

      // Okay it's special; let's build a bucket for it... unless we already have one
      const bucketKey = bucketKeyParts.join("|");
      if (bucketByBucketKey[bucketKey]) {
        plan.bucketId = bucketByBucketKey[bucketKey].id;
        return plan;
      } else {
        const rootPathIdentities: string[] = (() => {
          if (group?.reason === "mutation") {
            return [
              `${ROOT_PATH}>${this.mutationTypeName}.${group.responseKey}`,
            ];
          }
          if (transformPlan) {
            return [];
          }
          if (itemPlan) {
            const listPlan = this.plans[plan.dependencies[0]]!;
            const listPlanPathIdentities = pathIdentitiesByPlanId[listPlan.id];
            if (
              !listPlanPathIdentities ||
              listPlanPathIdentities.length === 0
            ) {
              throw new Error(
                `GraphileInternalError<e5dfb383-d413-49d8-8a3f-2d2f677c373d>: could not determine the path identities served by ${listPlan}`,
              );
            }
            return listPlanPathIdentities.map((pi) =>
              // This ternary is a hack for subscriptions support; see TODO in planSubscription
              pi === `~` ? pi : `${pi}[]`,
            );
          }
          if (polymorphicPlanIds !== undefined) {
            const polymorphicPlans = polymorphicPlanIds.map(
              (id) => this.plans[id],
            );
            return [
              ...new Set(
                polymorphicPlans.flatMap(
                  (polymorphicPlan) =>
                    pathIdentitiesByPlanId[polymorphicPlan.id],
                ),
              ),
            ];
          }
          if (group) {
            const groupParentPlan = this.plans[group.parentPlanId];
            return pathIdentitiesByPlanId[groupParentPlan.id];
          }
          throw new Error(
            `GraphileInternalError<e5dfb383-d413-49d8-8a3f-2d2f677c373d>: could not determine the rootPathIdentities to use`,
          );
        })();
        if (!parent) {
          throw new Error(
            `GraphileInternalError<af6208af-193d-4dbd-96d7-1cfe63ce1c4c>: could not determine the parent for this bucket`,
          );
        }
        const newBucket: BucketDefinition = this.newBucket({
          parent,
          rootPathIdentities,
          itemPlanId,
          groupId,
          polymorphicPlanIds,
          polymorphicTypeNames,
        });
        addPlanIdsToBucket(newBucket, dependencyPlans);
        bucketByBucketKey[bucketKey] = newBucket;
        plan.bucketId = newBucket.id;
        return plan;
      }
    };

    // Assign bucketIds
    for (const [id, plan] of Object.entries(this.plans)) {
      if (plan != null && plan.id === id) {
        processPlan(plan);
        if (plan.bucketId < 0) {
          throw new Error(`Failed to assign bucket to ${plan}`);
        }
      }
    }

    for (const [id, plan] of Object.entries(this.plans)) {
      if (plan != null && plan.id === id) {
        if (!processedPlans.has(plan)) {
          throw new Error(`Didn't assign bucketId to ${plan}`);
        }
      }
    }

    // TODO: remove this post-processing step!
    /*
     * When we assign the bucketId to `planForType` polymorphic child plans,
     * depending on what plans are involved there's a significant chance that
     * we'll include the polymorphic plan itself in the polymorphic bucket.
     * This leads to a chicken and egg situation - we need to complete the
     * polymorphic plan so we know what type the object is so that we know
     * which bucket to create/pass results to, but we need the bucket to be
     * created in order to evaluate the polymorphic plan... Catch-22 y'see? So
     * to work around this, we do all the regular allocation and then as a
     * post-processing step we go back through and remove the polymorphic plan
     * and any of its dependencies from the polymorphic bucket and put them in
     * the parent bucket instead.
     */
    for (const bucket of this.buckets) {
      /**
       * Moves a plan (and any of its dependencies) out of `bucket` and into
       * the bucket's parent instead.
       */
      const exfiltrate = (plan: ExecutablePlan, bucket: BucketDefinition) => {
        if (plan.bucketId !== bucket.id) {
          return;
        }
        if (!bucket.parent) {
          throw new Error(
            `Cannot exfiltrate a plan from a bucket that has no parent.`,
          );
        }
        plan.bucketId = bucket.parent.id;
        plan.dependencies.forEach((depId) => {
          const dep = this.plans[depId];
          exfiltrate(dep, bucket);
        });
      };
      if (bucket.polymorphicPlanIds) {
        for (const planId of bucket.polymorphicPlanIds) {
          const plan = this.plans[planId];
          exfiltrate(plan, bucket);
        }
      }
    }

    // Now to set up the bucket's `copyPlanIds`
    for (const [id, plan] of Object.entries(this.plans)) {
      if (plan != null && plan.id === id) {
        const bucket = this.buckets[plan.bucketId];
        const dependencies = plan.dependencies.map(
          (depId) => this.plans[depId],
        );
        addPlanIdsToBucket(bucket, dependencies);
      }
    }

    // Set the bucket's outputMap / rootOutputPlanId
    /*
     * Buckets are responsible for where the data gets written out in the final
     * response.  Given each plan lives in exactly one bucket, and each path
     * identity is served by exactly one plan, the most basic approach is to
     * make the plan's bucket responsible for populating the given path
     * identity; however care must be taken when doing this as we may resolve
     * the plans in a different order to the paths.
     *
     * Take for example the polymorphic plan generated by the
     * `queries/interfaces-single-table/nested-more.test.graphql` test in
     * `dataplan-pg`. In this test a PG row is selected, and its `type`
     * attribute is both output to a regular GraphQL field _and_ used to
     * resolve the `__typename` of the object via the `PgPolymorphicPlan`. We
     * need the `PgPolymorphicPlan` to be executed first so that we can create
     * the object, before setting the value for the `type` field of that
     * object. Thus we must not set the path identities as soon as the
     * associated plan completes.
     *
     * Our current strategy is to execute the bucket, then apply the output
     * maps sorted such that the shortest paths are served first, before then
     * going on to executing the child buckets.
     */

    const getDeepestBucket = (
      plan: ExecutablePlan,
      planPathIdentity: string,
    ): BucketDefinition => {
      const planBucket = this.buckets[plan.bucketId];
      let pathIdentity = getParentPathIdentity(planPathIdentity);
      let winningBucket = planBucket;
      while (pathIdentity) {
        const planId = this.planIdByPathIdentity[pathIdentity];
        if (planId == null) {
          throw new Error(
            `Failed to get a plan for path identity '${pathIdentity}'`,
          );
        }
        const fieldPlan = this.plans[planId];
        const fieldBucket = this.buckets[fieldPlan.bucketId];
        winningBucket = deeper(winningBucket, fieldBucket);
        pathIdentity = getParentPathIdentity(pathIdentity);
      }
      return winningBucket;
    };

    // TODO: make `plan.groupId` rather than `plan.groupIds` - each group
    // should get its own plans.
    /**
     * This governs whether the new execution strategy might be able to be
     * used.  Currently it doesn't support stream/defer (read on), but even if
     * this is true that doesn't mean we necessarily support it.
     *
     * The new execution strategy is reliant on the buckets knowing where
     * they're writing the results. However, for stream and defer, the writing
     * of results can be ambiguous in the current system. A decision was made a
     * long time ago that needs revisiting - namely that when a selection set
     * is evaluated the fields can be in many groupIds but only get planned
     * once. Instead, each field should be planned once for each groupId it's
     * in, thus each plan should have exactly one groupId. To make this
     * achievable we need to fix `planIdByPathIdentity`; for regular queries,
     * mutations and even subscriptions this is fine since there is only one
     * "selection set" that ultimately gets output. However, for stream/defer
     * there's many selection sets, so there could be more than one plan for
     * each path through the GraphQL document. To solve this, we're going to
     * introduce new "root paths" for streamed/deferred selection sets, so
     * where the root paths all start like `~>Query.myField` or similar, for
     * streamed/deferred payloads we'll use path identities such as
     * `~defer1>User.topPosts`.  The root path identity for these (e.g.
     * `~defer1`) will have the plan id at the root of the selection set
     * (`Group.parentPlanId`) supplied.
     *
     * Temporarily I've disabled this for subscriptions too, since they want to
     * write to the root twice.
     */
    const canPrepare = this.groups.every(
      (g) =>
        g.reason != "defer" &&
        g.reason != "stream" &&
        this.operationType !== "subscription",
    );

    if (canPrepare) {
      for (const bucket of this.buckets) {
        if (bucket.rootPathIdentities.length > 0) {
          /**
           * Tuples of [pathIdentity, plan] for all the path identities that
           * should be set within this bucket. NOTE: this is not necessarily only
           * (or all) plans belonging to this bucket, for example there may be a
           * plan that only depends on constants (and thus is in bucket 0) and
           * yet it might write to path identities that are a few nested lists
           * deep.
           *
           * ~~Our strategy is to find the bucket for the plan, and then to walk
           * that bucket's non-group children (item plans and polymorphic plans
           * are fine) whilst their child bucket's rootPathIdentities is still
           * compatible.~~
           *
           * Our strategy is to find the deeper of the plan's own bucket and the
           * deepest bucket for the plans for each of the path identity's
           * ancestors.
           */
          const planPathIdentityTuples = Object.keys(this.plans)
            .flatMap((planId) => {
              const plan = this.plans[planId];
              if (plan && plan.id === planId) {
                const pathIdentities = pathIdentitiesByPlanId[plan.id];
                if (pathIdentities && pathIdentities.length > 0) {
                  return pathIdentities.map((pathIdentity) => {
                    if (pathIdentity.includes("@")) {
                      // Fake path, we don't care about this.
                      return null;
                    }
                    const deepestBucket = getDeepestBucket(plan, pathIdentity);
                    if (deepestBucket === bucket) {
                      return [pathIdentity, plan] as [string, ExecutablePlan];
                    } else {
                      return null;
                    }
                  });
                }
              }
              return null;
            })
            .filter(isNotNullish);

          /*
           * Sort the path identities by their number of component parts so we
           * can just loop through them and their ancestors (if any) will already
           * exist.
           * NOTE: the GraphQL spec specifies that we must maintain the field order
           * the user specifies (see
           * https://spec.graphql.org/draft/#sec-Executing-Selection-Sets), we don't currently
           * do that, so the output cannot be used for GraphQL verbatim.
           */
          // TODO: sort this so it matches the GraphQL field order.
          planPathIdentityTuples.sort(
            (a, z) => a[0].split(">").length - z[0].split(">").length,
          );

          for (const [pathIdentity, plan] of planPathIdentityTuples) {
            let depth = 0;
            let fieldPathIdentity = pathIdentity;
            while (fieldPathIdentity.endsWith("[]")) {
              depth++;
              fieldPathIdentity = fieldPathIdentity.slice(
                0,
                fieldPathIdentity.length - 2,
              );
            }
            const fieldDigest =
              this.fieldDigestByPathIdentity[fieldPathIdentity];
            const remainingDepth = fieldDigest.listDepth - depth;

            // Determine the GraphQL type at this level
            let typeAtThisDepth = fieldDigest.returnType;
            for (let i = 0; i < depth; i++) {
              if (isNonNullType(typeAtThisDepth)) {
                typeAtThisDepth = typeAtThisDepth.ofType;
              }
              if (isListType(typeAtThisDepth)) {
                typeAtThisDepth = typeAtThisDepth.ofType;
              } else {
                throw new Error(
                  `GraphileInternalError<ef22a107-3d2e-4413-9611-e04669f74e4c>: Expected a list type, but instead found ${typeAtThisDepth}`,
                );
              }
            }

            const notNull = isNonNullType(typeAtThisDepth);
            const mode = ((): BucketDefinitionOutputMode => {
              if (remainingDepth > 0) {
                return {
                  type: "A",
                  notNull,
                };
              } else if (fieldDigest.isLeaf) {
                const serialize = isScalarType(fieldDigest.namedReturnType)
                  ? serializerForScalarType(fieldDigest.namedReturnType)
                  : isEnumType(fieldDigest.namedReturnType)
                  ? serializerForEnumType(fieldDigest.namedReturnType)
                  : null;
                if (!serialize) {
                  throw new Error(
                    `GraphileInternalError<f98383a6-75c4-4ec8-a75a-b5916489a71f>: Leaves must be scalars or enums! Found ${fieldDigest.namedReturnType}`,
                  );
                }
                return {
                  type: "L",
                  notNull,
                  serialize,
                };
              } else {
                const fields: ObjectCreatorFields = Object.create(null);
                if (!fieldDigest.childFieldDigests) {
                  throw new Error(
                    `GraphileInternalError<18101261-6949-4de5-b3b9-22919fb4fccf>: Processing an object type, childFieldDigests is expected to exist`,
                  );
                }
                for (const childFieldDigest of fieldDigest.childFieldDigests) {
                  if (fields[childFieldDigest.responseKey]) {
                    continue;
                  }
                  fields[childFieldDigest.responseKey] =
                    childFieldDigest.isTypeName ? "__typename" : "normal";
                }
                return {
                  type: "O",
                  notNull,
                  objectCreator: makeObjectCreator(fields),
                };
              }
            })();
            const matchingParentPathIdentities =
              bucket.rootPathIdentities.filter(
                (rpi) =>
                  rpi === pathIdentity || pathIdentity.startsWith(rpi + ">"),
              );
            if (matchingParentPathIdentities.length !== 1) {
              throw new Error(
                `GraphileInternalError<204ef204-7112-48e3-9d9b-2ce96aea86ec>: Bad bucketing; couldn't find match for '${pathIdentity}' in '${bucket.rootPathIdentities.join(
                  "', '",
                )}'`,
              );
            }
            const rootPathIdentity = matchingParentPathIdentities[0];
            /*
            const rootPathIdentityIndex =
              bucket.rootPathIdentities.indexOf(rootPathIdentity);
            */
            const remainingPath = pathIdentity.slice(
              rootPathIdentity.length + 1,
            );
            const parts = remainingPath
              ? remainingPath.split(">").map((part) => part.split("."))
              : [];
            const path = parts.map((part) => part[1]);
            if (isDev) {
              const isValidIdentifier = (identifier: string) =>
                /^[a-zA-Z_0-9]+$/.test(identifier);
              const invalidPaths = path.filter(
                (identifier) => !isValidIdentifier(identifier),
              );
              if (invalidPaths.length > 0) {
                throw new Error(
                  `GraphileInternalError<c53bbc17-1e38-4642-8bc1-ee27043ea3b6>: invalid paths found for bucket ${
                    bucket.id
                  } / plan ${plan.id} -> ${invalidPaths.join(", ")}`,
                );
              }
            }

            if (path.length === 0) {
              if (
                bucket.rootOutputPlanId != null &&
                bucket.rootOutputPlanId !== plan.id
              ) {
                throw new Error(
                  `GraphileInternalError<f9a8ba81-5025-440e-aa03-d355125705ea>: bucket ${bucket.id}'s rootOutputPlanId is already set to '${bucket.rootOutputPlanId}', cannot set it to '${plan.id}'`,
                );
              }
              if (bucket.polymorphicPlanIds) {
                throw new Error(
                  `GraphileInternalError<d09677c6-f5ff-4d8b-af0f-a82e2efadd30>: A polymorphic plan cannot set the root object path, this must be set outside.`,
                );
              }
              bucket.rootOutputPlanId = plan.id;
              if (!bucket.rootOutputModeByRootPathIdentity) {
                bucket.rootOutputModeByRootPathIdentity = Object.create(null);
                bucket.rootOutputModeType = mode.type;
              } else {
                if (mode.type !== bucket.rootOutputModeType) {
                  throw new Error(
                    `GraphileInternalError<771dc65b-f77d-4a33-8496-62624026e3aa>: root mode mistmatch at ${rootPathIdentity}`,
                  );
                }
              }
              bucket.rootOutputModeByRootPathIdentity![rootPathIdentity] = mode;
            } else {
              let spec = bucket.outputMap;
              for (let i = 0, l = path.length - 1; i < l; i++) {
                const pathComponent = path[i];

                const field = spec[pathComponent];
                if (!field) {
                  /*
                   * This path doesn't exist yet. This could happen for a number
                   * of reasons.
                   *
                   * Reason 1: we're the root bucket and there's a deep plan that
                   * returns a constant (e.g. it only depends on `context` or
                   * similar, or maybe has no dependencies at all); in this case,
                   * it's not our responsibility to set that key - we should pass
                   * it down to our child(ren).
                   *
                   * Reason 2: we're a "group" bucket (defer, stream, mutation,
                   * subscription, etc) and the required key has already been
                   * populated in our parent. In the case of defer/stream, we
                   * want to copy the result from our parent (no need to run it
                   * again), but in the case of mutation/subscription we really
                   * ought to re-evaluate it. Let's assume that that
                   * re-evaluation has been handled for us by the query planner
                   * rules (specifically that a duplicate plan will have been
                   * created and will not be de-duplicated since it's in a
                   * separate group) so we shouldn't need to handle that here; so
                   * we only need to handle the "copy it from parent" case.
                   */

                  throw new Error(
                    `GraphileInternalError<7f7193d9-a8af-4154-ad8e-b8d16396f19f>: component ${i} ('${pathComponent}') of '${path.join(
                      ">",
                    )}' was not (yet) set in bucket ${bucket.id}'s outputMap`,
                  );
                }
                const nextSpec = field.children;
                if (!nextSpec) {
                  throw new Error(
                    `GraphileInternalError<3067ac98-f448-4669-baa3-c5212fa50fa5>: component ${i} ('${pathComponent}') of '${path.join(
                      ">",
                    )}' doesn't have any children`,
                  );
                }
                spec = nextSpec;
              }

              const typeName = parts.length ? parts[0][0] : null;
              const fieldName = path[path.length - 1];

              if (!spec[fieldName]) {
                spec[fieldName] = {
                  planIdByRootPathIdentity: Object.create(null),
                  modeType: mode.type,
                  modeByRootPathIdentity: Object.create(null),
                  typeName: fieldDigest.namedReturnType.name,
                  children: mode.type === "O" ? Object.create(null) : null,
                  typeNames: bucket.polymorphicPlanIds ? [] : null,
                };
              } else {
                if (mode.type !== spec[fieldName].modeType) {
                  throw new Error(
                    `GraphileInternalError<effa6a63-7ec0-4ed2-b13d-97ca67e8ba9f>: mode mismatch at ${rootPathIdentity}`,
                  );
                }
              }
              const fieldSpec = spec[fieldName];
              fieldSpec.modeByRootPathIdentity[rootPathIdentity] = mode;
              if (
                fieldSpec.planIdByRootPathIdentity[rootPathIdentity] != null &&
                fieldSpec.planIdByRootPathIdentity[rootPathIdentity] !== plan.id
              ) {
                console.error(
                  `GraphileInternalError<1ba4a423-abe6-447f-a9a7-4de24d4b419d>: bucket ${
                    bucket.id
                  }'s field spec for '${path.join(">")}' already has plan ${
                    fieldSpec.planIdByRootPathIdentity[rootPathIdentity]
                  } set for root path identity '${rootPathIdentity}', cannot set to ${
                    plan.id
                  }`,
                );
              }
              fieldSpec.planIdByRootPathIdentity[rootPathIdentity] = plan.id;
              if (plan.bucketId !== bucket.id) {
                addPlanIdsToBucket(bucket, [plan]);
              }
              if (
                fieldSpec.typeNames &&
                !fieldSpec.typeNames.includes(typeName!)
              ) {
                if (!typeName) {
                  throw new Error(
                    `GraphileInternalError<5f412f08-4c69-4b8d-8360-b25aa27d5160>: typeName must be set for polymorphic bucket`,
                  );
                }
                fieldSpec.typeNames.push(typeName);
              }
            }
          }
        }
      }
    }

    const setKeys = (map: {
      [responseKey: string]: BucketDefinitionFieldOutputMap;
    }): void => {
      const keys = Object.keys(map);
      for (const key of keys) {
        const entry = map[key];
        if (entry.children) {
          setKeys(entry.children);
        }
      }
      (map as any)[$$keys] = keys;
    };

    // Finalize the buckets (perform any precomputation we can)
    for (const bucket of this.buckets) {
      // Track which plans belong in which buckets
      const plans = Object.entries(this.plans)
        .filter(
          ([planId, plan]) =>
            plan &&
            plan.id === planId &&
            plan.bucketId === bucket.id &&
            !isInternalPlan(plan),
        )
        .map((t) => t[1]);
      bucket.plans = plans;

      // Start plans are the plans that have no dependencies within this bucket
      bucket.startPlans = plans.filter((p) =>
        p.dependencies.every((depId) => {
          const dep = this.plans[depId];
          if (dep.bucketId !== bucket.id) {
            return true;
          }
          if (isInternalPlan(dep)) {
            return true;
          }
          return false;
        }),
      );

      // Pre-calculate the Object.keys of the outputMap (recursively)
      setKeys(bucket.outputMap);
    }
  }

  /**
   * Implements the `FinalizePlans` and `FinalizePlan` algorithms.
   */
  private finalizePlans(): void {
    const distinctActivePlansInReverseOrder = new Set<ExecutablePlan>();
    const ids = this.getPlanIds();
    for (const i of ids.reverse()) {
      const plan = this.plans[i];
      if (plan !== null) {
        distinctActivePlansInReverseOrder.add(plan);
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
    planResultses: ReadonlyArray<PlanResults | CrystalError | null>,
    visitedPlans = new Set<ExecutablePlan>(),
    depth = 0,
    planCacheForPlanResultses: PlanCacheForPlanResultses = Object.create(null),
  ): PromiseOrDirect<any[]> {
    try {
      if (String(plan.id) in planCacheForPlanResultses) {
        if (isDev) {
          return Promise.resolve(planCacheForPlanResultses[plan.id]).then(
            (planCache) => {
              assert.strictEqual(
                planCache.length,
                planResultses.length,
                `(1) When executing '${plan}', expected the planCache length (${planCache.length}) to match the planResultses length (${planResultses.length})`,
              );
              return planCache;
            },
          );
        } else {
          return planCacheForPlanResultses[plan.id];
        }
      }
      let timeString: string | null = null;
      if (debugExecuteEnabled && Math.random() > 2) {
        timeString = `plan\t${plan}`;
        console.time(timeString);
        console.timeLog(timeString, "START");
      }
      const result = this.executePlanAlt(
        plan,
        crystalContext,
        planResultses,
        visitedPlans,
        depth,
        planCacheForPlanResultses,
      );
      if (timeString) {
        if (isPromiseLike(result)) {
          Promise.resolve(result).then(
            () => {
              console.timeEnd(timeString!);
            },
            () => {},
          );
        } else {
          console.timeEnd(timeString!);
        }
      }
      planCacheForPlanResultses[plan.id] = result;

      return result;
    } catch (e) {
      const promise = Promise.reject(e);
      planCacheForPlanResultses[plan.id] = promise;
      return promise;
    }
  }

  /**
   * Implements `ExecutePlan`.
   *
   * @remarks `await` is forbidden to avoid race conditions
   */
  private executePlanAlt<T>(
    plan: ExecutablePlan<T>,
    crystalContext: CrystalContext,
    planResultses: ReadonlyArray<PlanResults | CrystalError | null>,
    visitedPlans = new Set<ExecutablePlan>(),
    depth = 0,
    planCacheForPlanResultses: PlanCacheForPlanResultses = Object.create(null),
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
        planResults == null || isCrystalError(planResults)
          ? planResults
          : planResults.get(plan.bucketId, plan.id),
      );
    }

    const planResultsesLength = planResultses.length;
    const result: any[] = [];

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
    if (debugExecuteEnabled) console.timeLog(`plan\t${plan}`, "loop 1");
    for (
      let planResultsesIndex = 0;
      planResultsesIndex < planResultsesLength;
      planResultsesIndex++
    ) {
      result[planResultsesIndex] = undefined;
      const planResults = planResultses[planResultsesIndex];
      if (planResults == null || isCrystalError(planResults)) {
        result[planResultsesIndex] = planResults;
        continue;
      }
      const bucket = planResults.getBucket(plan.bucketId);
      const list = planResultsesByBucket.get(bucket);
      if (!list) {
        planResultsesByBucket.set(bucket, [
          { planResults, planResultsesIndex },
        ]);
      } else {
        list.push({ planResults, planResultsesIndex });
      }
    }
    if (debugExecuteEnabled) console.timeLog(`plan\t${plan}`, "loop 1 done");

    // From here on out we're going to deal with the buckets until we tie it
    // all back together again at the end.

    if (debugExecuteEnabled) {
      debugExecute(
        "%sExecutePlan(%c): executing with %o plan results",
        indent,
        plan,
        planResultsesLength,
      );
    }

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

      if (plan.id in bucket) {
        const previousResult = bucket[plan.id];
        if (debugExecuteVerboseEnabled) {
          const planResults = bucketPlanResultses[0].planResults;
          debugExecuteVerbose(
            "%s result[%o] for %c found: %c",
            follow,
            bucketPlanResultses.map((r) => r.planResultsesIndex),
            planResults,
            previousResult,
          );
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
          `GraphileInternalError<079b214f-3ec9-4257-8de9-0ca2b2bdb8e9>: Attempted to queue __ValuePlan ${plan} (bucketId: '${
            plan.bucketId
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
    if (debugExecuteEnabled) console.timeLog(`plan\t${plan}`, "loop 2 done");
    if (debugExecuteVerboseEnabled) {
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
    const planCacheForPendingPlanResultses =
      pendingPlanResultses.length === planResultses.length
        ? planCacheForPlanResultses
        : Object.create(null);

    // For each dependency of plan, get the results
    const dependenciesCount = plan.dependencies.length;
    const hasDependencies = dependenciesCount > 0;
    const dependencyValuesList = hasDependencies
      ? []
      : plan.hasSideEffects
      ? [arrayOfLength(pendingPlanResultses.length)]
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
          planCacheForPendingPlanResultses,
        );
        if (isPromiseLike(allDependencyResultsOrPromise)) {
          dependencyPromises.push({
            promise: allDependencyResultsOrPromise,
            dependencyIndex,
          });
          // Don't moan about unhandled rejections; we only care about the first fail (and we don't care if they get handled later)
          allDependencyResultsOrPromise.then(null, NOOP);
          dependencyValuesList[dependencyIndex] = undefined as any; // We'll set this later
        } else {
          dependencyValuesList[dependencyIndex] = allDependencyResultsOrPromise;
        }
      }
      if (debugExecuteEnabled) console.timeLog(`plan\t${plan}`, "deps done");
    }

    // TODO: extract this to be a separate method.
    const awaitDependencyPromises = async () => {
      if (debugExecuteEnabled)
        console.timeLog(`plan\t${plan}`, "awaitDependencyPromises");
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
          const crystalError = newCrystalError(
            e,
            plan.dependencies[dependencyIndex],
          );
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
        if (planResults.has(plan.bucketId, plan.id)) {
          const previousResult = planResults.get(plan.bucketId, plan.id);
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
      if (debugExecuteEnabled) console.timeLog(`plan\t${plan}`, "doNext");
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
          const entry = [];
          let error: CrystalError | null = null;
          for (
            let dependencyIndex = 0;
            dependencyIndex < dependenciesCount;
            dependencyIndex++
          ) {
            const dependencyValues = dependencyValuesList[dependencyIndex];
            const dependencyValue = dependencyValues[pendingPlanResultsesIndex];
            if (isCrystalError(dependencyValue)) {
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
                item.planResults.set(plan.bucketId, plan.id, error);
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
        if (debugExecuteEnabled)
          console.timeLog(`plan\t${plan}`, "deps created");
      }

      const toExecuteLength = toExecute.length;
      // Are we done?
      if (toExecuteLength === 0) {
        return result;
      }

      // TODO: optimize away
      toExecute.reverse();
      if (debugExecuteEnabled)
        console.timeLog(`plan\t${plan}`, "toExecute reversed");

      let meta = crystalContext.metaByPlanId[plan.id];
      if (!meta) {
        meta = Object.create(null) as Record<string, unknown>;
        crystalContext.metaByPlanId[plan.id] = meta;
      }
      const extra = {
        meta,
        eventEmitter: crystalContext.eventEmitter,
      };
      // Note: the `execute` method on plans is responsible for memoizing
      // results into `meta`.
      if (plan instanceof __ItemPlan) {
        throw new Error(
          "Should never attempt to execute __ItemPlan; that should be handled within executeBatch",
        );
      }
      const planOptions = this.planOptionsByPlan.get(plan);
      const isSubscribe = plan.id === this.subscriptionPlanId;

      // If plan is sync and safe then execute, store and return results (there's no risk of a race condition)
      if (
        plan.isSyncAndSafe &&
        !(plan instanceof __ListTransformPlan) &&
        !(isSubscribe || planOptions?.stream)
      ) {
        let crystalError: CrystalError | undefined;
        let executionResults: CrystalResultsList<any> | undefined;
        try {
          executionResults = plan.execute(
            dependencyValuesList,
            extra,
          ) as CrystalResultsList<any>;
          if (typeof (executionResults as any).then === "function") {
            throw new Error(
              `${plan} claims to be synchronous, but it returned a promise; please set 'isSyncAndSafe = false'`,
            );
          }
        } catch (e) {
          crystalError = newCrystalError(e, plan.id);
        }
        if (debugExecuteEnabled)
          console.timeLog(`plan\t${plan}`, "pre executable loop");
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
                plan.bucketId,
                item.planResults,
              );
              item.planResults.set(plan.bucketId, plan.id, value);
            } else if (isDev) {
              if (item.planResults.get(plan.bucketId, plan.id) !== value) {
                throw new Error(
                  "GraphileInternalError<f0af3cb6-7f0c-4002-aff5-976bf233269a>: The plan results should be equivalent, but apprently they're not?!",
                );
              }
            }
          }
        }
        if (debugExecuteEnabled)
          console.timeLog(`plan\t${plan}`, "sync execution complete");
        return result;
      }
      if (debugExecuteEnabled)
        console.timeLog(`plan\t${plan}`, "async execution");

      // Plan's not synchronous

      // TODO: this is a hack! We should write the new execution algorithm...
      return this.executePlanOld(
        plan,
        crystalContext,
        planResultses,
        visitedPlans,
        depth,
        planCacheForPlanResultses,
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
    planResultses: ReadonlyArray<PlanResults | CrystalError | null>,
    visitedPlans = new Set<ExecutablePlan>(),
    depth = 0,
    planCacheForPlanResultses: PlanCacheForPlanResultses = Object.create(null),
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
        planResults == null || isCrystalError(planResults)
          ? planResults
          : planResults.get(plan.bucketId, plan.id),
      );
    }
    const planResultsesLength = planResultses.length;
    const result: any[] = [];
    if (debugExecuteEnabled) {
      debugExecute(
        "%sExecutePlan(%c): executing with %o plan results",
        indent,
        plan,
        planResultsesLength,
      );
    }

    const pendingPlanResultses: PlanResults[] = []; // Length unknown
    const pendingDeferreds: Deferred<any>[] = []; // Same length as pendingPlanResultses
    const pendingPlanResultsesIndexes: number[] = []; // Same length as pendingPlanResultses
    const inProgressDeferreds: Deferred<any>[] = []; // Length unknown
    const inProgressPlanResultsesIndexes: number[] = []; // Same length as inProgressDeferreds

    const deferredsByBucket = crystalContext.inProgressPlanResolutions[plan.id];

    for (let i = 0; i < planResultsesLength; i++) {
      const planResults = planResultses[i];
      if (planResults == null || isCrystalError(planResults)) {
        result[i] = planResults;
        continue;
      }
      if (planResults.has(plan.bucketId, plan.id)) {
        const previousResult = planResults.get(plan.bucketId, plan.id);
        result[i] = previousResult;

        if (debugExecuteVerboseEnabled) {
          debugExecuteVerbose(
            "%s result[%o] for %c found: %c",
            follow,
            i,
            planResults,
            previousResult,
          );
        }
        continue;
      }
      if (plan instanceof __ValuePlan) {
        throw new Error(
          `GraphileInternalError<079b214f-3ec9-4257-8de9-0ca2b2bdb8e9>: Attempted to queue __ValuePlan ${plan} (bucketId: '${
            plan.bucketId
          }', groups: ${plan.groupIds.join(
            ", ",
          )}) for execution; however __ValuePlan must never be executed - the value should already exist in the cache: ${crystalPrint(
            planResults,
          )}.`,
        );
      }
      result[i] = undefined;
      const bucket = planResults.getBucket(plan.bucketId);
      if (deferredsByBucket.has(bucket)) {
        // In progress already
        const deferred = deferredsByBucket.get(bucket)!;
        if (debugExecuteVerboseEnabled) {
          debugExecuteVerbose(
            "%s already in progress for %c",
            follow,
            planResults,
          );
        }
        inProgressDeferreds.push(deferred);
        inProgressPlanResultsesIndexes.push(i);
      } else {
        // Need to start executing
        if (debugExecuteVerboseEnabled) {
          debugExecuteVerbose("%s no result for %c", follow, planResults);
        }

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

    const planCacheForPendingPlanResultses =
      pendingPlanResultsesLength === planResultsesLength
        ? planCacheForPlanResultses
        : Object.create(null);

    const pendingResultsPromise =
      pendingPlanResultsesLength > 0
        ? this.executePlanPending(
            plan,
            crystalContext,
            pendingPlanResultses,
            visitedPlans,
            depth,
            planCacheForPendingPlanResultses,
          )
        : Promise.resolve([]);

    // IMPORTANT: this must not trigger any new errors otherwise these `deferred`'s may live forever!
    const handlePendingPromise = pendingResultsPromise.then(
      (pendingResults) => {
        for (let i = 0; i < pendingPlanResultsesLength; i++) {
          // Execution complete; delete from cache
          const planResults = pendingPlanResultses[i];
          const bucket = planResults.getBucket(plan.bucketId);
          deferredsByBucket.delete(bucket);

          // Add the result to our results
          const j = pendingPlanResultsesIndexes[i];
          result[j] = pendingResults[i];

          // Resolve the promise
          pendingDeferreds[i].resolve(pendingResults[i]);
        }
      },
      (error) => {
        const crystalError = newCrystalError(error, plan.id);
        for (let i = 0; i < pendingPlanResultsesLength; i++) {
          // Execution complete; delete from cache
          const planResults = pendingPlanResultses[i];
          const bucket = planResults.getBucket(plan.bucketId);
          deferredsByBucket.delete(bucket);

          // Add the result to our results
          const j = pendingPlanResultsesIndexes[i];
          // TODO: is wrapping in a CrystalError here correct?
          result[j] = crystalError;

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
          if (debugExecuteVerboseEnabled) {
            debugExecuteVerbose(
              `%sExecutePlan(%s): complete; results: %c`,
              indent,
              plan,
              result,
            );
          } else if (debugExecuteEnabled) {
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
    planCacheForPendingPlanResultses: PlanCacheForPlanResultses,
  ): Promise<any[]> {
    const indent = "    ".repeat(depth);
    const follow = indent + "  ⮞";
    const pendingPlanResultsesLength = pendingPlanResultses.length;
    const dependenciesCount = plan.dependencies.length;
    const hasDependencies = dependenciesCount > 0;
    const dependencyValuesList = hasDependencies
      ? []
      : plan.hasSideEffects
      ? [arrayOfLength(pendingPlanResultses.length)]
      : [[undefined]];
    if (debugExecuteEnabled) {
      debugExecute("%s Executing %o dependencies", follow, dependenciesCount);
    }

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
          planCacheForPendingPlanResultses,
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
        if (isCrystalError(dependencyValue)) {
          error = dependencyValue;
          break;
        }
      }
      if (error) {
        // Error occurred; short-circuit execution
        result[i] = error;
        const planResults = pendingPlanResultses[i];
        planResults.set(plan.bucketId, plan.id, error);
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
    const planCacheForRealPendingPlanResultses =
      realPendingPlanResultses.length === pendingPlanResultses.length
        ? planCacheForPendingPlanResultses
        : Object.create(null);

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
      const extra = {
        meta,
        eventEmitter: crystalContext.eventEmitter,
      };
      const pendingResults =
        plan instanceof __ListTransformPlan
          ? // __ListTransformPlan gets custom execution.
            await this.executeTransformPlan(
              plan,
              crystalContext,
              realPendingPlanResultses,
              visitedPlans,
              planCacheForRealPendingPlanResultses,
            )
          : isSubscribe || planOptions?.stream
          ? await (plan as unknown as StreamablePlan<unknown>).stream(
              dependencyValuesList,
              extra,
              isSubscribe ? { initialCount: 0 } : planOptions!.stream!,
            )
          : await plan.execute(dependencyValuesList, extra);
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
        if (isPromiseLike(rawPendingResult)) {
          try {
            result[underlyingIndex] = await rawPendingResult;
          } catch (e: any) {
            result[underlyingIndex] = newCrystalError(e, plan.id);
          }
        }
        // TODO: do we need 'else if (isAsyncIterable(rawPendingResult)) { ... }'
        else {
          result[underlyingIndex] = rawPendingResult;
        }

        // TODO: if result[j] is AsyncIterable it would be nice to avoid
        // writing it to the plan results.
        planResults.set(plan.bucketId, plan.id, result[underlyingIndex]);
      }
    }

    if (debugExecuteEnabled) {
      debugExecute(
        "%sExecutePlan(%s): wrote results for %c",
        indent,
        plan,
        pendingPlanResultses,
      );
    }
    return result;
  }

  private async executeTransformPlan(
    plan: __ListTransformPlan<any, any, any>,
    crystalContext: CrystalContext,
    planResultses: readonly PlanResults[],
    visitedPlans: Set<ExecutablePlan>,
    planCacheForPlanResultses: PlanCacheForPlanResultses,
  ) {
    const itemPlanId = this.transformDependencyPlanIdByTransformPlanId[plan.id];
    const itemPlan = this.dangerouslyGetPlan(itemPlanId);
    const listPlan = plan.dangerouslyGetListPlan();
    // TODO: can this be made more efficient?
    const depResults = await this.executeBatchInner(
      crystalContext,
      planResultses,
      itemPlan.parentPathIdentity,
      listPlan,
      itemPlan,
      planCacheForPlanResultses, // TODO: can we cache this?
    );
    const listResults = await this.executePlan(
      listPlan,
      crystalContext,
      planResultses,
      visitedPlans,
      depth, // TODO: should depth be incremented?
      planCacheForPlanResultses,
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
   * Get a plan without specifying who requested it; this disables all the
   * caller checks. Only intended to be called from internal code.
   *
   * @internal
   */
  public dangerouslyGetPlan(id: string): ExecutablePlan {
    return this.plans[id];
  }

  /**
   * Adds a plan to the known plans and returns the number to use as the plan
   * id. ONLY to be used from Plan, user code should never call this directly.
   *
   * @internal
   */
  public _addPlan(plan: ExecutablePlan): string {
    if (!["plan", "validate", "deduplicate", "optimize"].includes(this.phase)) {
      throw new Error(
        `Creating a plan during the '${this.phase}' phase is forbidden.`,
      );
    }
    const planId = `${this.planCount++}`;
    this.plans[planId] = plan;
    return planId;
  }

  /**
   * Adds a plan to the known plans and returns the number to use as the plan
   * id. ONLY to be used from Plan, user code should never call this directly.
   *
   * @internal
   */
  public _addModifierPlan(plan: ModifierPlan<any>): string {
    if (!["plan", "validate", "deduplicate", "optimize"].includes(this.phase)) {
      throw new Error(
        `Creating a plan during the '${this.phase}' phase is forbidden.`,
      );
    }
    const modifierPlanId = `${this.modifierPlanCount++}`;
    this.modifierPlans.push(plan);
    return modifierPlanId;
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
    /*
    const returnRaw = isSubscribe
      ? false
      : !!this.returnRawValueByPathIdentity[fieldPathIdentity];
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
    // TODO: precompute this (and various other things in here)
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
    const crystalContext: CrystalContext = {
      aether: this,
      metaByPlanId: Object.create(null),
      inProgressPlanResolutions: Object.entries(this.plans).reduce(
        (memo, [idx, plan]) => {
          if (plan && plan.id === idx) {
            memo[plan.id] = new Map();
          }
          return memo;
        },
        Object.create(null),
      ),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore We'll set this in just a moment...
      rootCrystalObject: null,
    };
    const rootCrystalObject = newCrystalObject(
      ROOT_PATH,
      this.queryTypeName,
      crystalContext,
      new PlanResults(),
    );
    crystalContext.rootCrystalObject = rootCrystalObject;

    if (this.rootSelectionSetPlan.bucketId >= 0) {
      /*#__INLINE__*/ populateValuePlan(
        this.rootSelectionSetPlan,
        rootCrystalObject,
        Object.create(null),
        "rootSelectionSet",
      );
    }
    if (this.variableValuesPlan.bucketId >= 0) {
      /*#__INLINE__*/ populateValuePlan(
        this.variableValuesPlan,
        rootCrystalObject,
        variableValues,
        "variableValues",
      );
    }
    if (this.contextPlan.bucketId >= 0) {
      /*#__INLINE__*/ populateValuePlan(
        this.contextPlan,
        rootCrystalObject,
        context,
        "context",
      );
    }
    if (this.rootValuePlan.bucketId >= 0) {
      /*#__INLINE__*/ populateValuePlan(
        this.rootValuePlan,
        rootCrystalObject,
        rootValue,
        "rootValue",
      );
    }
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

  private executeLayers(
    crystalContext: CrystalContext,
    layers: ExecutablePlan[],
    // Even when AsyncIterators are involved, this will always be a concrete array
    planResultses: ReadonlyArray<PlanResults | CrystalError | null>,
    rawProcessResults: ProcessResults | undefined,
    planCacheForPlanResultses: PlanCacheForPlanResultses,
    depth = 0,
  ): PromiseOrDirect<any[]> {
    const planResultsesLength = planResultses.length;
    if (planResultsesLength === 0) {
      return [];
    }
    const [layerPlan, ...rest] = layers;

    const processResults: ProcessResults | undefined =
      rest.length > 0
        ? undefined
        : rawProcessResults ??
          ((planResultses) => {
            const planResultsesLength = planResultses.length;
            const result = [];
            for (let i = 0, l = planResultsesLength; i < l; i++) {
              const planResults = planResultses[i];
              if (planResults == null) {
                result[i] = null;
              } else if (isCrystalError(planResults)) {
                result[i] = Promise.reject(planResults.originalError);
              } else {
                const data = planResults.get(layerPlan.bucketId, layerPlan.id);
                result[i] = data ?? null;
              }
            }
            return result;
          });

    if (debugExecuteEnabled) {
      debugExecute(
        "Executing layerPlan %c with %c planResultses",
        layerPlan,
        planResultsesLength,
      );
    }

    if (layerPlan instanceof __ItemPlan) {
      // Derive new PlanResultses from the existing ones.
      const depId = layerPlan.dependencies[0];
      const dep = this.plans[depId];
      const pendingPlanResultses: Array<PlanResults | null> = [];
      const pendingPlanResultsesIndexes: Array<[number, number]> = [];
      const layerResults = planResultses.map(
        (planResults, planResultsesIndex) => {
          if (planResults == null || isCrystalError(planResults)) {
            return planResults;
          }
          if (planResults.has(layerPlan.bucketId, layerPlan.id)) {
            const existingResult = planResults.get(
              layerPlan.bucketId,
              layerPlan.id,
            );
            // TODO: review this entire `if` statement; it was added to support __ListTransformPlan.
            // I wasn't sure what to do here... so I returned existingResult...
            // and the tests started passing again... so... ¯\_(ツ)_/¯
            return existingResult;
          }
          if (isDev && planResults.hasBucketId(layerPlan.bucketId)) {
            const bucket = planResults.getBucket(layerPlan.bucketId);
            throw new Error(
              `GraphileInternalError<355413ed-6688-45ce-8d5d-22faee9668a3>: Did not expect plans to exist within the '${
                layerPlan.bucketId
              }' bucket yet (creating for ${layerPlan}, but already contains data from ${Object.keys(
                bucket,
              )
                .map((id) => this.dangerouslyGetPlan(id))
                .join(", ")}). Data found: ${crystalPrint(bucket)}`,
            );
          }
          // NOTE: this could be an async iterator
          const listResult = planResults.get(dep.bucketId, dep.id);
          if (debugExecuteVerboseEnabled) {
            debugExecuteVerbose(
              "Executing %c's dependency, %c",
              layerPlan,
              dep,
            );
          }
          if (Array.isArray(listResult)) {
            // Turn each entry in this listResult into it's own PlanResultses, then execute the new layers.
            const newPlanResultses = listResult.map((result) => {
              if (result == null) {
                return null;
              }
              const copy = new PlanResults(planResults);
              copy.set(layerPlan.bucketId, layerPlan.id, result);
              return copy;
            });
            if (processResults) {
              return processResults(newPlanResultses, Object.create(null));
            } else {
              // Optimise this to call executeLayers once, rather than once per PlanResults - see code below `layerResults` loop.
              const l = newPlanResultses.length;
              for (
                let innerPlanResultsesIndex = 0;
                innerPlanResultsesIndex < l;
                innerPlanResultsesIndex++
              ) {
                pendingPlanResultses.push(
                  newPlanResultses[innerPlanResultsesIndex],
                );
                pendingPlanResultsesIndexes.push([
                  planResultsesIndex,
                  innerPlanResultsesIndex,
                ]);
              }
              return arrayOfLength(l);
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

                  copy.set(layerPlan.bucketId, layerPlan.id, result);
                  const copyList = [copy];
                  const planCacheForCopyList = Object.create(sharedNull);
                  // TODO: are CrystalError's handled correctly here?
                  // TODO: batch this?
                  if (processResults) {
                    const [value] = await processResults(
                      copyList,
                      planCacheForCopyList,
                    );
                    return { done, value };
                  } else {
                    const value = (
                      await aether.executeLayers(
                        crystalContext,
                        rest,
                        // TODO: batch this over a tick?
                        copyList,
                        rawProcessResults,
                        planCacheForCopyList,
                        depth + 1,
                      )
                    )[0];
                    return { done, value };
                  }
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
            // Stops here
            return null;
          }
        },
      );
      const l = pendingPlanResultses.length;
      if (!processResults && l > 0) {
        const planCacheForPendingPlanResultses: PlanCacheForPlanResultses =
          Object.create(null);
        const allResults = this.executeLayers(
          crystalContext,
          rest,
          pendingPlanResultses,
          rawProcessResults,
          planCacheForPendingPlanResultses,
          depth + 1,
        );
        const finaliseLayerResults = (allResults: any[]) => {
          for (let j = 0; j < l; j++) {
            const [planResultsesIndex, innerPlanResultsesIndex] =
              pendingPlanResultsesIndexes[j];
            layerResults[planResultsesIndex][innerPlanResultsesIndex] =
              allResults[j];
          }
          return layerResults;
        };
        if (isPromiseLike(allResults)) {
          return allResults.then(finaliseLayerResults);
        } else {
          return finaliseLayerResults(allResults);
        }
      } else {
        return layerResults;
      }
    } else {
      // Execute the plan with the same PlanResultses
      const layerResultsOrPromise = this.executePlan(
        layerPlan,
        crystalContext,
        planResultses,
        new Set(),
        0,
        planCacheForPlanResultses,
      );
      if (isDev) {
        Promise.resolve(layerResultsOrPromise)
          .then((layerResults) => {
            assert.ok(
              Array.isArray(layerResults),
              "Expected plan execution to return an array",
            );
            assert.strictEqual(
              layerResults.length,
              planResultsesLength,
              "Expected plan execution result to have same length as input objects",
            );
          })
          .catch((e) => {
            console.error(e);
          });
      }

      const finalizeLayerResults = (
        layerResults: any[],
      ): PromiseOrDirect<any[]> => {
        if (processResults) {
          // No following layers; map the result
          const finalResult: Array<PlanResults | CrystalError | null> = [];
          for (let i = 0; i < planResultsesLength; i++) {
            finalResult[i] = isCrystalError(layerResults[i])
              ? layerResults[i]
              : planResultses[i];
          }
          return processResults(finalResult, planCacheForPlanResultses);
        } else {
          // Now executing the following layers using the same planResultses
          const finalResult: any[] = [];
          const pendingPlanResultses: Array<PlanResults | CrystalError | null> =
            [];
          let hasAtLeastOneNonError = false;
          for (
            let finalResultIndex = 0;
            finalResultIndex < planResultsesLength;
            finalResultIndex++
          ) {
            if (isCrystalError(layerResults[finalResultIndex])) {
              finalResult[finalResultIndex] = Promise.reject(
                layerResults[finalResultIndex].originalError,
              );
              pendingPlanResultses[finalResultIndex] = null;
            } else {
              finalResult[finalResultIndex] = undefined;
              hasAtLeastOneNonError = true;
              pendingPlanResultses[finalResultIndex] =
                planResultses[finalResultIndex];
            }
          }
          if (hasAtLeastOneNonError) {
            let pendingResultsOrPromise: PromiseOrDirect<any[]>;
            try {
              pendingResultsOrPromise = this.executeLayers(
                crystalContext,
                rest,
                pendingPlanResultses,
                rawProcessResults,
                planCacheForPlanResultses, // pendingPlanResultses shares indexes with planResultses
                depth + 1,
              );
            } catch (e) {
              pendingResultsOrPromise = Promise.reject(e);
            }

            const finalizePendingResults = (pendingResults: any[]): any[] => {
              if (isDev) {
                assert.ok(
                  Array.isArray(pendingResults),
                  "Expected non-error plan execution to return an array",
                );
                assert.strictEqual(
                  pendingResults.length,
                  pendingPlanResultses.length,
                  "Expected non-error plan execution result to have same length as input objects",
                );
              }
              // Stitch the results back into the list
              for (
                let finalResultIndex = 0, l = pendingResults.length;
                finalResultIndex < l;
                finalResultIndex++
              ) {
                if (pendingPlanResultses[finalResultIndex] != null) {
                  finalResult[finalResultIndex] =
                    // NOTE: if this would have been a CrystalError, processResults
                    // should already have dealt with this via Promise.reject.
                    pendingResults[finalResultIndex];
                }
              }
              return finalResult;
            };
            if (isPromiseLike(pendingResultsOrPromise)) {
              return pendingResultsOrPromise.then(
                finalizePendingResults,
                (e) => {
                  const errorPromise = Promise.reject(e);
                  for (
                    let finalResultIndex = 0, l = pendingPlanResultses.length;
                    finalResultIndex < l;
                    finalResultIndex++
                  ) {
                    if (pendingPlanResultses[finalResultIndex] != null) {
                      finalResult[finalResultIndex] = errorPromise;
                    }
                  }
                  return finalResult;
                },
              );
            } else {
              return finalizePendingResults(pendingResultsOrPromise);
            }
          }
          return finalResult;
        }
      };
      if (isPromiseLike(layerResultsOrPromise)) {
        return layerResultsOrPromise.then(finalizeLayerResults);
      } else {
        return finalizeLayerResults(layerResultsOrPromise);
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
    const planResultses: PlanResults[] = [];
    for (let i = 0; i < entriesLength; i++) {
      const crystalObject = entries[i][0];
      planResultses[i] = crystalObject[$$planResults];
    }

    try {
      const fieldDigest = this.fieldDigestByPathIdentity[pathIdentity];

      const results = await this.executeBatchForPlanResultses(
        crystalContext,
        pathIdentity,
        fieldDigest,
        sideEffectPlans,
        plan,
        itemPlan,
        planResultses,
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

  private executeBatchForPlanResultses(
    crystalContext: CrystalContext,
    pathIdentity: string,
    fieldDigest: FieldDigest,
    sideEffectPlans: ReadonlyArray<ExecutablePlan>,
    plan: ExecutablePlan,
    itemPlan: ExecutablePlan,
    planResultses: ReadonlyArray<PlanResults | CrystalError | null>,
    planCacheForPlanResultses: PlanCacheForPlanResultses = Object.create(null),
    allowPrefetch = true,
  ): PromiseOrDirect<any[]> {
    const { isPolymorphic, namedReturnType, returnRaw } = fieldDigest;
    const crystalObjectFromPlanResultsAndTypeName = (
      planResults: PlanResults,
      typeName: string,
    ) => {
      return newCrystalObject(
        pathIdentity,
        typeName,
        crystalContext,
        planResults,
      );
    };

    const hasListBoundary = fieldDigest.listDepth > 0;

    // TODO: what should we do if the user has a graphqlResolver AND it's a
    // polymorphic plan?

    // Execute the layers to get the result
    const processResults: ProcessResults | undefined =
      // The user has their own resolver, so we must not return a crystalObject
      returnRaw
        ? undefined
        : (childPlanResultses, planCacheForChildPlanResultses) => {
            const childPlanResultsesLength = childPlanResultses.length;
            const result: any[] = [];
            let hasAtLeastOneNonError = false;
            for (let i = 0; i < childPlanResultsesLength; i++) {
              const childPlanResults = childPlanResultses[i];
              if (childPlanResults == null) {
                result[i] = null;
              } else if (isCrystalError(childPlanResults)) {
                result[i] = Promise.reject(childPlanResults.originalError);
              } else {
                const data = childPlanResults.get(
                  itemPlan.bucketId,
                  itemPlan.id,
                );

                if (data == null || isCrystalError(data)) {
                  result[i] = data;
                } else if (isPolymorphic) {
                  hasAtLeastOneNonError = true;
                  // When we're returning something polymorphic we need to figure out the typeName which we get from the plan result.       if (isPolymorphic
                  assertPolymorphicData(data);
                  const co =
                    /*#__INLINE__*/ crystalObjectFromPlanResultsAndTypeName(
                      childPlanResults,
                      data[$$concreteType],
                    );
                  result[i] = co;
                } else {
                  hasAtLeastOneNonError = true;
                  // Otherwise we represent a standard object, so we can just use the expected named type
                  const co =
                    /*#__INLINE__*/ crystalObjectFromPlanResultsAndTypeName(
                      childPlanResults,
                      namedReturnType.name,
                    );
                  result[i] = co;
                }
              }
            }

            if (allowPrefetch && hasAtLeastOneNonError) {
              if (debugExecuteEnabled) {
                debugExecute(
                  "Prefetching after %c/%c, hasListBoundary=%c, count=%c, localPlans=%c",
                  plan,
                  itemPlan,
                  hasListBoundary,
                  childPlanResultses.length,
                  this.prefetchesForPathIdentity[pathIdentity].local,
                );
              }

              // chance to do pre-execution of next layers!
              const siblingPromises = [];
              for (const localPlan of this.prefetchesForPathIdentity[
                pathIdentity
              ].local) {
                const subResults = this.executeBatchForPlanResultses(
                  crystalContext,
                  fieldDigest.itemPathIdentity,
                  fieldDigest,
                  EMPTY_ARRAY,
                  localPlan,
                  localPlan,
                  childPlanResultses,
                  planCacheForChildPlanResultses,
                  false,
                );
                if (isPromiseLike(subResults)) {
                  siblingPromises.push(subResults);
                }
              }

              const siblingsComplete = (): PromiseOrDirect<any[]> => {
                const promises = [];
                for (const config of this.prefetchesForPathIdentity[
                  pathIdentity
                ].children) {
                  const fieldDigest = config.fieldDigest;
                  const subResultsOrPromise: PromiseOrDirect<any[]> =
                    this.executeBatchForPlanResultses(
                      crystalContext,
                      fieldDigest.pathIdentity,
                      fieldDigest,
                      EMPTY_ARRAY,
                      config.plan,
                      config.itemPlan,
                      childPlanResultses,
                      planCacheForChildPlanResultses,
                    );
                  const responseKey = config.fieldDigest.responseKey;
                  const storeResults = (subResults: any[]) => {
                    for (let i = 0, l = result.length; i < l; i++) {
                      if (isCrystalObject(result[i])) {
                        result[i][$$data][responseKey] = subResults[i];
                      }
                    }
                  };
                  if (isPromiseLike(subResultsOrPromise)) {
                    promises.push(subResultsOrPromise.then(storeResults));
                  } else {
                    storeResults(subResultsOrPromise);
                  }
                }
                if (promises.length) {
                  return Promise.all(promises).then(() => result);
                } else {
                  return result;
                }
              };

              if (siblingPromises.length > 0) {
                return Promise.all(siblingPromises).then(siblingsComplete);
              } else {
                return siblingsComplete();
              }
            } else {
              return result;
            }
          };

    // First, execute side effects (in order, *not* in parallel)
    // TODO: assert that side effect plans cannot be nested under list items.
    const sideEffectCount = sideEffectPlans.length;
    if (sideEffectCount > 0) {
      let chain: Promise<any> = Promise.resolve();
      for (let i = 0; i < sideEffectCount; i++) {
        const sideEffectPlan = sideEffectPlans[i];
        chain = chain.then(() =>
          this.executePlan(sideEffectPlan, crystalContext, planResultses),
        );
      }
      return chain.then(() =>
        this.executeBatchInner(
          crystalContext,
          planResultses,
          pathIdentity,
          plan,
          itemPlan,
          planCacheForPlanResultses,
          processResults,
        ),
      );
    } else {
      return this.executeBatchInner(
        crystalContext,
        planResultses,
        pathIdentity,
        plan,
        itemPlan,
        planCacheForPlanResultses,
        processResults,
      );
    }
  }

  private executeBatchInner(
    crystalContext: CrystalContext,
    planResultses: ReadonlyArray<PlanResults | CrystalError | null>,
    pathIdentity: string,
    plan: ExecutablePlan,
    itemPlan: ExecutablePlan,
    planCacheForPlanResultses: PlanCacheForPlanResultses,
    processResults: ProcessResults | undefined = undefined,
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

    if (debugExecuteEnabled) {
      debugExecute(`Executing batch with %s layers: %c`, layers.length, layers);
    }

    return this.executeLayers(
      crystalContext,
      layers,
      planResultses,
      processResults,
      planCacheForPlanResultses,
      0,
    );
  }

  public executePreemptive(
    variableValues: any,
    context: any,
    rootValue: any,
    // Experimental feature!
    shouldTryToBypassGraphQL = false,
  ): null | PromiseOrDirect<any> {
    if (!this.canPreempt) {
      return null;
    }
    if (!this.hasNonIntrospectionFields) {
      // This is an introspection-only request. Perform it once; return it forever.
      if (!this[$$introspectionResponseCache]) {
        const result = executeSync({
          schema: this.schema,
          document: {
            kind: Kind.DOCUMENT,
            definitions: [this.operation, ...Object.values(this.fragments)],
          },
          variableValues: this.variableValues,
        });
        // TODO: ideally this would also JSON.stringify so this doesn't need to be done every time.
        this[$$introspectionResponseCache] = Object.assign(
          Object.create(null),
          result,
          { [$$bypassGraphQL]: true },
        );
      }
      if (this[$$introspectionResponseCache].errors) {
        return null;
      }
      return this[$$introspectionResponseCache].data;
    }
    const rootField = this.fieldDigestByPathIdentity[ROOT_PATH];
    if (!rootField.childFieldDigests) {
      throw new Error(
        "GraphileInternalError<51dfe77e-3912-4aaa-9481-6e760a07c03b>: missing selection set? Field digests not present for root.",
      );
    }

    // TODO: batch this method so it can process multiple GraphQL requests in parallel
    const batch = [undefined];
    const input = [new BucketSetter(ROOT_PATH, batch, 0)];
    const roots = [Object.create(null)];
    const vars = [variableValues];
    const ctxs = [context];
    const rvs = [rootValue];
    const rootBucket: Bucket = {
      definition: this.rootBucket,
      input,
      noDepsList: Object.freeze(arrayOfLength(input.length)),
      store: Object.assign(Object.create(null), {
        [this.rootSelectionSetPlan.id]: roots,
        [this.variableValuesPlan.id]: vars,
        [this.contextPlan.id]: ctxs,
        [this.rootValuePlan.id]: rvs,
      }),
      hasErrors: false,
    };
    const metaByPlanId = this.makeMetaByPlanId();
    let requiresGraphQLJS =
      this.hasIntrospectionFields || !shouldTryToBypassGraphQL;
    const requestContext: RequestContext = {
      shouldTryToBypassGraphQL,
      hasIssue() {
        requiresGraphQLJS = true;
      },
      toSerialize: [],
      eventEmitter: rootValue?.[$$eventEmitter],
    };
    const p = executeBucket(this, metaByPlanId, rootBucket, requestContext);
    const finalize = (list: any[]) => {
      const result = list[0];
      if (!requiresGraphQLJS && typeof result == "object" && result != null) {
        // Perform serialization; we only do this here because if an error
        // occurred we would want GraphQL.js to handle the response, and it
        // does it's own serialization - we don't want double serialization as
        // that would lead to further issues.
        // TODO: once we have our own error handling, we can get rid of
        // `toSerialize` and perform the serialization inside `bucketValue`
        // directly.
        let hasSerializationErrors = false;
        const rollback: any[] = [];
        for (let i = 0, l = requestContext.toSerialize.length; i < l; i++) {
          const { o, k, s } = requestContext.toSerialize[i];
          const value = o[k];
          rollback[i] = value;
          try {
            o[k] = s(value);
          } catch (e) {
            hasSerializationErrors = true;
            break;
          }
        }
        if (hasSerializationErrors) {
          // To avoid double serialization issues, we need to roll these values
          // back to their unserialized forms before passing to GraphQL.js
          for (let i = 0, l = rollback.length; i < l; i++) {
            const { o, k } = requestContext.toSerialize[i];
            o[k] = rollback[i];
          }
        } else {
          // Safe to bypass GraphQL!
          result[$$bypassGraphQL] = true;
        }
      }
      return result;
    };
    if (isPromiseLike(p)) {
      return p.then(finalize);
    } else {
      return finalize(p);
    }
  }

  /**
   * For debugging.
   *
   * @internal
   */
  public printPlans(): string {
    const { plans } = this;
    const printDep = (depId: string) => {
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
    const partsLines = Object.entries(plans)
      .map(([id, plan]) => {
        if (!plan) {
          return null;
        } else if (plan.id !== id) {
          // return `- ${id}: ->${chalk.bold.yellow(String(plan.id))}`;
          return null;
        } else {
          const optimized = plan.isOptimized;
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
            plan.bucketId >= 0 ? " " + chalk.yellow(`${plan.bucketId}`) : "",
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
      // bucketId
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
          `${fieldPathIdentity.slice(parentFieldPathIdentity.length)}: ${plan}`,
      );
      depth++;
      for (const childFieldPathIdentity of fieldPathIdentities) {
        if (
          childFieldPathIdentity.startsWith(fieldPathIdentity) &&
          /^(\[\])*>|@/.test(
            childFieldPathIdentity.slice(fieldPathIdentity.length),
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

    const plansByPath = lines.join("\n");

    return plansByPath;
  }

  /**
   * Convert an Aether into a plan graph in mermaid-js format.
   */
  printPlanGraph(options: PrintPlanGraphOptions = {}): string {
    return printPlanGraph(this, options, {
      pathIdentitiesByPlanId: this.getPathIdentitiesByPlanId(),
      plans: this.plans,
    });
  }

  /**
   * @internal
   */
  public logPlansByPath(why?: string): void {
    this.logPlans(why);
    debugPlanVerbose(
      `Plans by path%s: %s`,
      why ? ` ${why}` : "",
      "\n" + this.printPlansByPath(),
    );
  }

  //----------------------------------------

  public getPlan: (
    id: string,
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
        if (
          requestingPlan.isOptimized &&
          (this.phase !== "optimize" ||
            !requestingPlan.allowMultipleOptimizations)
        ) {
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
    return plan.isOptimized;
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
    valuePlan.bucketId,
    valuePlan.id,
    object ?? ROOT_VALUE_OBJECT,
  );
  if (debugExecuteEnabled) {
    debugExecute("Populated value plan for %s", label);
  }
}

function isNotNullish<T>(a: T | null | undefined): a is T {
  return a != null;
}

// TODO: review our use of TreeNode
/*
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
*/

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

/**
 * Returns the bucket that is an ancestor of the other bucket.
 */
function deeper(
  bucket1: BucketDefinition,
  bucket2: BucketDefinition,
  tryReverse = true,
): BucketDefinition {
  let b: BucketDefinition | null = bucket1;
  while (b) {
    if (b === bucket2) {
      return bucket1;
    }
    b = b.parent;
  }
  // bucket2 must be the ancestor; but let's check that
  if (isDev) {
    if (tryReverse) {
      return deeper(bucket2, bucket1, false);
    } else {
      throw new Error(
        `bucket1 and bucket2 do not exist on the same lineage - one is not an ancestor of the other`,
      );
    }
  }

  return bucket2;
}

function getParentPathIdentity(pathIdentity: string): string | null {
  if (pathIdentity.endsWith("[]")) {
    return pathIdentity.slice(0, pathIdentity.length - 2);
  } else {
    const i = pathIdentity.lastIndexOf(">");
    if (i >= 0) {
      return pathIdentity.slice(0, i);
    } else {
      return null;
    }
  }
}

function addPlanIdsToBucket(
  bucket: BucketDefinition,
  dependencyPlans: ExecutablePlan[],
  attemptedBuckets: BucketDefinition[] = [],
): void {
  const next: ExecutablePlan[] = [];
  dependencyPlans.forEach((plan) => {
    if (plan.bucketId !== bucket.id) {
      if (!bucket.copyPlanIds.includes(plan.id)) {
        bucket.copyPlanIds.push(plan.id);
        next.push(plan);
      }
    }
  });
  if (next.length) {
    if (!bucket.parent) {
      throw new Error(
        `Attempted to add ${next} to bucket ${attemptedBuckets[0].id}, but did not find their parent buckets in the chain. (i.e. the plan heirarchy is malformed.)`,
        //`${plan} (bucket ${plan.bucketId}) depends on ${dep} (bucket ${dep.bucketId}), but bucket ${dep.bucketId} does not appear in bucket ${plan.bucketId}'s ancestors.`,
      );
    }
    addPlanIdsToBucket(bucket.parent, next, [...attemptedBuckets, bucket]);
  }
}
