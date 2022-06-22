import type {
  GraphQLEnumValueConfig,
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
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
  Kind,
} from "graphql";
import { inspect } from "util";

import * as assert from "./assert.js";
import type { Deferred } from "./deferred.js";
import { isDev } from "./dev.js";
import type { InputPlan } from "./input.js";
import type {
  BaseGraphQLArguments,
  BaseGraphQLContext,
  GraphileFieldConfig,
  GraphileInputFieldConfig,
  OutputPlanForType,
} from "./interfaces.js";
import type { ExecutablePlan, ModifierPlan } from "./plan.js";

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

// TODO: it's possible for this to generate `LIST(INT, FLOAT, STRING)` which is
// not possible in GraphQL since lists have a single defined type. We may want
// to address this.
/**
 * Converts a JSON value into the equivalent ValueNode _without_ checking that
 * it's compatible with the expected type. Typically only used with scalars
 * (since they can use any ValueNode) - other parts of the GraphQL schema
 * should use explicitly compatible ValueNodes.
 */
function dangerousRawValueToValueNode(value: JSON): ValueNode {
  if (value == null) {
    return { kind: Kind.NULL };
  }
  if (typeof value === "boolean") {
    return { kind: Kind.BOOLEAN, value };
  }
  if (typeof value === "number") {
    if (value === Math.round(value)) {
      return { kind: Kind.INT, value: String(value) };
    } else {
      return { kind: Kind.FLOAT, value: String(value) };
    }
  }
  if (typeof value === "string") {
    return { kind: Kind.STRING, value };
  }
  if (Array.isArray(value)) {
    return {
      kind: Kind.LIST,
      values: value.map(dangerousRawValueToValueNode),
    };
  }
  if (typeof value === "object" && value) {
    return {
      kind: Kind.OBJECT,
      fields: Object.keys(value).map((key) => ({
        kind: Kind.OBJECT_FIELD,
        name: { kind: Kind.NAME, value: key },
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

/**
 * Takes a value (typically a JSON-compatible value) and converts it into a
 * ValueNode that's compatible with the given GraphQL type.
 */
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
    return { kind: Kind.NULL };
  }
  if (type === GraphQLBoolean) {
    if (typeof value !== "boolean") {
      throw new Error(
        "defaultValue contained invalid value at a position expecting boolean",
      );
    }
    return { kind: Kind.BOOLEAN, value };
  }
  if (type === GraphQLInt) {
    if (typeof value !== "number") {
      throw new Error(
        "defaultValue contained invalid value at a position expecting int",
      );
    }
    return { kind: Kind.INT, value: String(parseInt(String(value), 10)) };
  }
  if (type === GraphQLFloat) {
    if (typeof value !== "number") {
      throw new Error(
        "defaultValue contained invalid value at a position expecting int",
      );
    }
    return { kind: Kind.FLOAT, value: String(value) };
  }
  if (type === GraphQLString || type === GraphQLID) {
    if (typeof value !== "string") {
      throw new Error(
        "defaultValue contained invalid value at a position expecting string",
      );
    }
    return { kind: Kind.STRING, value };
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
    return { kind: Kind.ENUM, value: enumValue.name };
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
      kind: Kind.LIST,
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
          kind: Kind.OBJECT_FIELD,
          name: { kind: Kind.NAME, value: fieldName },
          value: fieldValueNode,
        });
      }
    }
    return {
      kind: Kind.OBJECT,
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

/**
 * Specifically allows for the `defaultValue` to be undefined, but otherwise
 * defers to {@link valueToValueNode}
 */
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

export function isPromise<T>(t: T | Promise<T>): t is Promise<T> {
  return (
    typeof t === "object" &&
    t !== null &&
    typeof (t as any).then === "function" &&
    typeof (t as any).catch === "function"
  );
}

/**
 * Is "thenable".
 */
export function isPromiseLike<T>(
  t: T | Promise<T> | PromiseLike<T>,
): t is PromiseLike<T> {
  return (
    typeof t === "object" && t !== null && typeof (t as any).then === "function"
  );
}

/**
 * Is a promise that can be externally resolved.
 */
export function isDeferred<T>(
  t: T | Promise<T> | Deferred<T>,
): t is Deferred<T> {
  return (
    isPromise(t) &&
    typeof (t as any).resolve === "function" &&
    typeof (t as any).reject === "function"
  );
}

/**
 * Returns true if array1 and array2 have the same length, and every pair of
 * values within them pass the `comparator` check (which defaults to `===`).
 */
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

export type ObjectTypeFields<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ExecutablePlan<any>,
> = {
  [key: string]: GraphileFieldConfig<
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
export function objectSpec<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ExecutablePlan<any>,
  TFields extends ObjectTypeFields<TContext, TParentPlan>,
>(
  spec: ObjectTypeSpec<TContext, TParentPlan, TFields>,
  Plan: { new (...args: any[]): TParentPlan } | null,
): GraphQLObjectTypeConfig<any, TContext> {
  const modifiedSpec: GraphQLObjectTypeConfig<any, TContext> = {
    ...spec,
    ...(Plan
      ? {
          extensions: {
            ...spec.extensions,
            graphile: {
              Plan: Plan,
              ...spec.extensions?.graphile,
            },
          },
        }
      : null),
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
>(Plan: {
  new (...args: any[]): TParentPlan;
}): <TFields extends ObjectTypeFields<TContext, TParentPlan>>(
  spec: ObjectTypeSpec<TContext, TParentPlan, TFields>,
) => GraphileObjectType<TContext, TParentPlan, TFields> {
  return (spec) =>
    new GraphQLObjectType(objectSpec(spec, Plan)) as GraphileObjectType<
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
  graphileSpec: GraphileFieldConfig<
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
        const { inputPlan, ...argSpec } = args[argName];
        memo[argName] = {
          ...argSpec,
          ...(inputPlan
            ? {
                extensions: {
                  graphile: {
                    inputPlan,
                  },
                },
              }
            : null),
        };
        return memo;
      }, {})
    : {};

  return {
    ...spec,
    args: argsWithExtensions,
    ...(plan || subscribePlan
      ? {
          extensions: {
            ...spec.extensions,
            graphile: {
              ...spec.extensions?.graphile,
              ...(plan ? { plan } : null),
              ...(subscribePlan ? { subscribePlan } : null),
            },
          },
        }
      : null),
  };
}

/**
 * "Constrainted identity function" for field configs.
 *
 * @see {@link https://kentcdodds.com/blog/how-to-write-a-constrained-identity-function-in-typescript}
 */
export function newGraphileFieldConfigBuilder<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ExecutablePlan<any>,
>(): <
  TType extends GraphQLOutputType,
  TFieldPlan extends OutputPlanForType<TType>,
  TArgs extends BaseGraphQLArguments,
>(
  config: GraphileFieldConfig<TType, TContext, TParentPlan, TFieldPlan, TArgs>,
) => typeof config {
  return (config) => config;
}

export type GraphileInputFieldConfigMap<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ModifierPlan<any>,
> = {
  [key: string]: GraphileInputFieldConfig<
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
  TFields extends GraphileInputFieldConfigMap<TContext, TParentPlan>,
> = Omit<GraphQLInputObjectTypeConfig, "fields"> & {
  fields: TFields | (() => TFields);
};

function inputObjectSpec<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ModifierPlan<any>,
  TFields extends GraphileInputFieldConfigMap<TContext, TParentPlan>,
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
  TFields extends GraphileInputFieldConfigMap<TContext, TParentPlan>,
> = GraphQLInputObjectType & {
  TContext: TContext;
  TParentPlan: TParentPlan;
  TFields: TFields;
};

export function newInputObjectTypeBuilder<
  TContext extends BaseGraphQLContext,
  TParentPlan extends ModifierPlan<any>,
>(): <TFields extends GraphileInputFieldConfigMap<TContext, TParentPlan>>(
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
  graphileSpec: GraphileInputFieldConfig<
    GraphQLInputType,
    TContext,
    TParent,
    TResult,
    TInput
  >,
): GraphQLInputFieldConfig {
  const { inputPlan, ...spec } = graphileSpec;
  return inputPlan
    ? {
        ...spec,
        extensions: {
          graphile: {
            inputPlan,
          },
        },
      }
    : spec;
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

const $$valueConfigByValue = Symbol("valueConfigByValue");
/**
 * This would be equivalent to `enumType._valueLookup.get(outputValue)` except
 * that's not a public API so we have to do a bit of heavy lifting here. Since
 * it is heavy lifting, we cache the result, but we don't know when enumType
 * will go away so we use a weakmap.
 */
export function getEnumValueConfig(
  enumType: GraphQLEnumType,
  outputValue: unknown,
): GraphQLEnumValueConfig | undefined {
  // We cache onto the enumType directly so that garbage collection can clear up after us easily.
  if (!enumType[$$valueConfigByValue]) {
    const config = enumType.toConfig();
    enumType[$$valueConfigByValue] = Object.values(config.values).reduce(
      (memo, value) => {
        memo[value.value] = value;
        return memo;
      },
      {},
    );
  }
  return enumType[$$valueConfigByValue][outputValue];
}

/**
 * It's a peculiarity of V8 that `{}` is twice as fast as
 * `Object.create(null)`, but `Object.create(sharedNull)` is the same speed as
 * `{}`. Hat tip to `@purge` for bringing this to my attention.
 *
 * @internal
 */
export const sharedNull = Object.freeze(Object.create(null));

/**
 * Prints out the stack trace to the current position with a message; useful
 * for debugging which code path has hit this line.
 *
 * @internal
 */
export function stack(message: string, length = 4) {
  try {
    throw new Error(message);
  } catch (e) {
    const lines = (e.stack as string).split("\n");
    const start = lines.findIndex((line) => line.startsWith("Error:"));
    if (start < 0) {
      console.dir(e.stack);
      return;
    }
    const filtered = [
      lines[start],
      ...lines.slice(start + 2, start + 2 + length),
    ];
    const mapped = filtered.map((line) =>
      line.replace(
        /^(.*?)\(\/home[^)]*\/packages\/([^)]*)\)/,
        (_, start, rest) =>
          `${start}${" ".repeat(Math.max(0, 45 - start.length))}(${rest})`,
      ),
    );
    console.log(mapped.join("\n"));
  }
}

/**
 * Ridiculously, this is faster than `new Array(length).fill(fill)`
 *
 * @internal
 */
export function arrayOfLength(length: number, fill?: any) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr[i] = fill;
  }
  return arr;
}
