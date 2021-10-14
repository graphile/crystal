import type {
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectTypeConfig,
  GraphQLInputType,
  GraphQLObjectTypeConfig,
  GraphQLOutputType,
  ObjectFieldNode,
  ValueNode,
} from "graphql";
import { GraphQLObjectType } from "graphql";
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLString,
} from "graphql";
import { inspect } from "util";

import * as assert from "./assert";
import type { Deferred } from "./deferred";
import { isDev } from "./dev";
import type { InputPlan } from "./input";
import type {
  BaseGraphQLArguments,
  BaseGraphQLContext,
  GraphileCrystalFieldConfig,
  GraphileCrystalInputFieldConfig,
  OutputPlanForType,
} from "./interfaces";
import type { ExecutablePlan, ModifierPlan } from "./plan";

/**
 * The parent object is used as the key in `GetValuePlanId()`; for root level
 * fields it's possible that the parent will be null/undefined (in all other
 * cases it will be an object), so we need a value that can be the key in a
 * WeakMap to represent the root.
 */
export const ROOT_VALUE_OBJECT = Object.freeze(Object.create(null));

export function assertNullPrototype(
  object: Record<string, unknown>,
  description: string,
): void {
  if (isDev) {
    assert.strictEqual(
      Object.getPrototypeOf(object),
      null,
      `Expected ${description} to have a null prototype`,
    );
  }
}

function dangerousRawValueToValueNode(value: JSON): ValueNode {
  if (value == null) {
    return { kind: "NullValue" };
  }
  if (typeof value === "boolean") {
    return { kind: "BooleanValue", value };
  }
  if (typeof value === "number") {
    if (value === Math.round(value)) {
      return { kind: "IntValue", value: String(value) };
    } else {
      return { kind: "FloatValue", value: String(value) };
    }
  }
  if (typeof value === "string") {
    return { kind: "StringValue", value };
  }
  if (Array.isArray(value)) {
    return {
      kind: "ListValue",
      values: value.map(dangerousRawValueToValueNode),
    };
  }
  if (typeof value === "object" && value) {
    return {
      kind: "ObjectValue",
      fields: Object.keys(value).map((key) => ({
        kind: "ObjectField",
        name: { kind: "Name", value: key },
        value: dangerousRawValueToValueNode(value[key]),
      })),
    };
  }
  const never: never = value;
  console.error(
    `Unhandled type when converting custom scalar to ValueNode: ${inspect(
      never,
    )}`,
  );
  throw new Error(`Unhandled type when converting custom scalar to ValueNode`);
}

function rawValueToValueNode(
  type: GraphQLInputType,
  value: any,
): ValueNode | undefined {
  // TODO: move this to input object section
  if (type instanceof GraphQLNonNull) {
    if (value == null) {
      throw new Error(
        "defaultValue contained null/undefined at a position that is marked as non-null",
      );
    }
    return rawValueToValueNode(type.ofType, value);
  }
  // Below here null/undefined are allowed.
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return { kind: "NullValue" };
  }
  if (type === GraphQLBoolean) {
    if (typeof value !== "boolean") {
      throw new Error(
        "defaultValue contained invalid value at a position expecting boolean",
      );
    }
    return { kind: "BooleanValue", value };
  }
  if (type === GraphQLInt) {
    if (typeof value !== "number") {
      throw new Error(
        "defaultValue contained invalid value at a position expecting int",
      );
    }
    return { kind: "IntValue", value: String(parseInt(String(value), 10)) };
  }
  if (type === GraphQLFloat) {
    if (typeof value !== "number") {
      throw new Error(
        "defaultValue contained invalid value at a position expecting int",
      );
    }
    return { kind: "FloatValue", value: String(value) };
  }
  if (type === GraphQLString || type === GraphQLID) {
    if (typeof value !== "string") {
      throw new Error(
        "defaultValue contained invalid value at a position expecting string",
      );
    }
    return { kind: "StringValue", value };
  }
  if (type instanceof GraphQLEnumType) {
    const enumValues = type.getValues();
    const enumValue = enumValues.find((v) => v.value === value);
    if (!enumValue) {
      console.error(
        `Default contained invalid value for enum ${type.name}: ${inspect(
          value,
        )}`,
      );
      throw new Error(`Default contained invalid value for enum ${type.name}`);
    }
    return { kind: "EnumValue", value: enumValue.name };
  }
  if (type instanceof GraphQLScalarType) {
    return dangerousRawValueToValueNode(value);
  }
  if (type instanceof GraphQLList) {
    if (!Array.isArray(value)) {
      throw new Error(
        "defaultValue contained invalid value at location expecting a list",
      );
    }
    return {
      kind: "ListValue",
      values: value.map((entry: any) => {
        const entryValueNode = rawValueToValueNode(type.ofType, entry);
        if (entryValueNode === undefined) {
          throw new Error(
            "defaultValue contained invalid list (contained `undefined`)",
          );
        }
        return entryValueNode;
      }),
    };
  }
  if (type instanceof GraphQLInputObjectType) {
    if (typeof value !== "object" || !value) {
      throw new Error(
        "defaultValue contained invalid value at location expecting an object",
      );
    }
    const fieldDefs = type.getFields();
    const fields: ObjectFieldNode[] = [];
    for (const fieldName in fieldDefs) {
      const fieldDef = fieldDefs[fieldName];
      const fieldType = fieldDef.type;
      const rawValue =
        value[fieldName] !== undefined
          ? value[fieldName]
          : fieldDef.defaultValue;
      const fieldValueNode = rawValueToValueNode(fieldType, rawValue);
      if (fieldValueNode !== undefined) {
        fields.push({
          kind: "ObjectField",
          name: { kind: "Name", value: fieldName },
          value: fieldValueNode,
        });
      }
    }
    return {
      kind: "ObjectValue",
      fields,
    };
  }
  const never: never = type;
  console.error(
    `Encountered unexpected type when processing defaultValue ${inspect(
      never,
    )}`,
  );
  throw new Error(`Encountered unexpected type when processing defaultValue`);
}

export function defaultValueToValueNode(
  type: GraphQLInputType,
  defaultValue: unknown,
): ValueNode | undefined {
  // NOTE: even if `type` is non-null it's okay for `defaultValue` to be
  // undefined. However it is not okay for defaultValue to be null if type is
  // non-null.
  if (defaultValue === undefined) {
    return undefined;
  }
  return rawValueToValueNode(type, defaultValue);
}

// We might change this to number in future for optimisation reasons.
export type UniqueId = symbol;

/**
 * The internal `fastCounter` is safe up to Number.MAX_SAFE_INTEGER; if we were
 * to generate 100 million unique ids per second every second (a significant
 * over-estimate), it would take us 1042 days to exhaust the safe range for
 * this.
 *
 * Even calling this in the hottest of loops only generates about half a
 * billion per second, which is safe for ~200 days:
 *
 * `let i=0;console.time('loop');for(;i<500_000_000;i++);console.timeEnd('loop');`
 *
 * Nonetheless, out of an abundance of caution, I've decided to let this loop
 * tick over by using a prefix once we hit this max limit. This now means that
 * this is safe over roughly 360,000 times the age of the universe.
 *
 * (I considered starting at `-Number.MAX_SAFE_INTEGER` rather than zero in
 * order to quadruple the range, but decided against it on aesthetic grounds.)
 */
const developmentUid = ((): ((label?: string) => UniqueId) => {
  // Hide counter in this scope so it can't be fiddled with.
  let prefix = "";
  let prefixCounter = 0;
  let fastCounter = 0;
  return function developmentUid(label?: string): UniqueId {
    if (++fastCounter === Number.MAX_SAFE_INTEGER) {
      prefix = `${++prefixCounter}|`;
      fastCounter = 0;
    }
    return Symbol(`u${prefix}${fastCounter}${label ? `_${label}` : ""}`);
  };
})();

const productionUid = (label?: string): UniqueId => Symbol(label);

export const uid = isDev ? developmentUid : productionUid;

export function isPromise<T>(t: T | Promise<T>): t is Promise<T> {
  return (
    typeof t === "object" &&
    t !== null &&
    typeof (t as any).then === "function" &&
    typeof (t as any).catch === "function"
  );
}

export function isDeferred<T>(
  t: T | Promise<T> | Deferred<T>,
): t is Deferred<T> {
  return (
    isPromise(t) &&
    typeof (t as any).resolve === "function" &&
    typeof (t as any).reject === "function"
  );
}

export function arraysMatch<T>(
  array1: ReadonlyArray<T>,
  array2: ReadonlyArray<T>,
  comparator: (val1: T, val2: T) => boolean = (v1, v2) => v1 === v2,
): boolean {
  const l = array1.length;
  if (l !== array2.length) {
    return false;
  }
  for (let i = 0; i < l; i++) {
    if (!comparator(array1[i], array2[i])) {
      return false;
    }
  }
  return true;
}
type ObjectTypeFields<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ExecutablePlan<any>,
> = {
  [key: string]: GraphileCrystalFieldConfig<
    GraphQLOutputType,
    TContext,
    TParentPlan,
    any,
    any
  >;
};

export type ObjectTypeSpec<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ExecutablePlan<any>,
  TFields extends ObjectTypeFields<TContext, TParentPlan>,
> = Omit<GraphQLObjectTypeConfig<any, TContext>, "fields"> & {
  fields: TFields | (() => TFields);
};

/**
 * Saves us having to write `extensions: {graphile: {...}}` everywhere.
 */
function objectSpec<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ExecutablePlan<any>,
  TFields extends ObjectTypeFields<TContext, TParentPlan>,
>(
  spec: ObjectTypeSpec<TContext, TParentPlan, TFields>,
): GraphQLObjectTypeConfig<any, TContext> {
  const modifiedSpec: GraphQLObjectTypeConfig<any, TContext> = {
    ...spec,
    fields: () => {
      const fields =
        typeof spec.fields === "function" ? spec.fields() : spec.fields;
      const modifiedFields = Object.keys(fields).reduce((o, key) => {
        o[key] = objectFieldSpec<TContext, TParentPlan>(fields[key]);
        return o;
      }, {} as GraphQLFieldConfigMap<any, TContext>);
      return modifiedFields;
    },
  };
  return modifiedSpec;
}

export type GraphileObjectType<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ExecutablePlan<any>,
  TFields extends ObjectTypeFields<TContext, TParentPlan>,
> = GraphQLObjectType<
  TParentPlan extends ExecutablePlan<infer U> ? U : never,
  TContext
> & { TParentPlan: TParentPlan; TFields: TFields };

/**
 * @remarks This is a mess because the first two generics need to be specified manually, but the latter one we want inferred.
 */
export function newObjectTypeBuilder<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ExecutablePlan<any>,
>(): <TFields extends ObjectTypeFields<TContext, TParentPlan>>(
  spec: ObjectTypeSpec<TContext, TParentPlan, TFields>,
) => GraphileObjectType<TContext, TParentPlan, TFields> {
  return (spec) =>
    new GraphQLObjectType(objectSpec(spec)) as GraphileObjectType<
      TContext,
      TParentPlan,
      any
    >;
}

/**
 * Saves us having to write `extensions: {graphile: {...}}` everywhere.
 */
export function objectFieldSpec<
  TContext extends BaseGraphQLContext,
  TSource extends ExecutablePlan<any>,
  TResult extends ExecutablePlan<any> = ExecutablePlan<any>,
  TArgs extends BaseGraphQLArguments = BaseGraphQLArguments,
>(
  graphileSpec: GraphileCrystalFieldConfig<
    GraphQLOutputType,
    TContext,
    TSource,
    TResult,
    TArgs
  >,
): GraphQLFieldConfig<any, TContext, TArgs> {
  const { plan, subscribePlan, args, ...spec } = graphileSpec;

  const argsWithExtensions = args
    ? Object.keys(args).reduce((memo, argName) => {
        const { plan, ...argSpec } = args[argName];
        memo[argName] = {
          ...argSpec,
          extensions: {
            graphile: {
              plan,
            },
          },
        };
        return memo;
      }, {})
    : {};

  return {
    ...spec,
    args: argsWithExtensions,
    extensions: {
      graphile: {
        plan,
        subscribePlan,
      },
    },
  };
}

export function newGraphileCrystalFieldConfigBuilder<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ExecutablePlan<any>,
>(): <
  TType extends GraphQLOutputType,
  TFieldPlan extends OutputPlanForType<TType>,
  TArgs extends BaseGraphQLArguments,
>(
  config: GraphileCrystalFieldConfig<
    TType,
    TContext,
    TParentPlan,
    TFieldPlan,
    TArgs
  >,
) => typeof config {
  return (config) => config;
}

type InputObjectTypeFields<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ModifierPlan<any>,
> = {
  [key: string]: GraphileCrystalInputFieldConfig<
    GraphQLInputType,
    TContext,
    TParentPlan,
    any,
    any
  >;
};

export type InputObjectTypeSpec<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ModifierPlan<any>,
  TFields extends InputObjectTypeFields<TContext, TParentPlan>,
> = Omit<GraphQLInputObjectTypeConfig, "fields"> & {
  fields: TFields | (() => TFields);
};

function inputObjectSpec<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ModifierPlan<any>,
  TFields extends InputObjectTypeFields<TContext, TParentPlan>,
>(
  spec: InputObjectTypeSpec<TContext, TParentPlan, TFields>,
): GraphQLInputObjectTypeConfig {
  const modifiedSpec: GraphQLInputObjectTypeConfig = {
    ...spec,
    fields: () => {
      const fields =
        typeof spec.fields === "function" ? spec.fields() : spec.fields;
      const modifiedFields = Object.keys(fields).reduce((o, key) => {
        o[key] = inputObjectFieldSpec<TContext, TParentPlan>(fields[key]);
        return o;
      }, {} as GraphQLInputFieldConfigMap);
      return modifiedFields;
    },
  };
  return modifiedSpec;
}

export type GraphileInputObjectType<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ModifierPlan<any>,
  TFields extends InputObjectTypeFields<TContext, TParentPlan>,
> = GraphQLInputObjectType & {
  TContext: TContext;
  TParentPlan: TParentPlan;
  TFields: TFields;
};

export function newInputObjectTypeBuilder<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ModifierPlan<any>,
>(): <TFields extends InputObjectTypeFields<TContext, TParentPlan>>(
  spec: InputObjectTypeSpec<TContext, TParentPlan, TFields>,
) => GraphileInputObjectType<TContext, TParentPlan, TFields> {
  return (spec) =>
    new GraphQLInputObjectType(
      inputObjectSpec(spec),
    ) as GraphileInputObjectType<TContext, TParentPlan, any>;
}

/**
 * Saves us having to write `extensions: {graphile: {...}}` everywhere.
 */
export function inputObjectFieldSpec<
  TContext extends BaseGraphQLContext,
  TParent extends ModifierPlan<any>,
  TResult extends ModifierPlan<TParent> = ModifierPlan<TParent>,
  TInput extends InputPlan = InputPlan,
>(
  graphileSpec: GraphileCrystalInputFieldConfig<
    GraphQLInputType,
    TContext,
    TParent,
    TResult,
    TInput
  >,
): GraphQLInputFieldConfig {
  const { plan, ...spec } = graphileSpec;

  return {
    ...spec,
    extensions: {
      graphile: {
        plan,
      },
    },
  };
}

/**
 * Returns true if plan1 and plan2 have at least one groupId in common, false
 * otherwise.
 *
 * @remarks This relates generally to the `@stream`/`@defer` directives -
 * adding `@stream` or `@defer` pushes execution of the given selection to a
 * later stage, in Crystal we represent this by putting the plans in different
 * "groups". In general you shouldn't merge a plan into a parent plan that
 * belongs to a different group - this should opt them out of optimisation.
 */
export function planGroupsOverlap(
  plan1: ExecutablePlan,
  plan2: ExecutablePlan,
): boolean {
  return plan1.groupIds.some((id) => plan2.groupIds.includes(id));
}
