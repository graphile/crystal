import type {
  ArgumentNode,
  ConstObjectFieldNode,
  ConstValueNode,
  DirectiveNode,
  FieldNode,
  GraphQLEnumValueConfig,
  GraphQLFieldConfig,
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectTypeConfig,
  GraphQLInputType,
  GraphQLNamedType,
  GraphQLObjectTypeConfig,
  GraphQLSchema,
  SelectionNode,
  ValueNode,
} from "graphql";
import * as graphql from "graphql";

import * as assert from "./assert.js";
import type { Deferred } from "./deferred.js";
import { isDev } from "./dev.js";
import type {
  LayerPlan,
  LayerPlanReasonDefer,
  LayerPlanReasonListItem,
  LayerPlanReasonSubscription,
} from "./engine/LayerPlan.js";
import type { OperationPlan } from "./engine/OperationPlan.js";
import { SafeError } from "./error.js";
import { inspect } from "./inspect.js";
import type {
  BaseGraphQLArguments,
  ExecutionEntryFlags,
  GrafastFieldConfig,
  GrafastInputFieldConfig,
  Maybe,
} from "./interfaces.js";
import type { Step } from "./step.js";
import { constant } from "./steps/constant.js";

const {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
  GraphQLUnionType,
  Kind,
} = graphql;

/**
 * The parent object is used as the key in `GetValueStepId()`; for root level
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

/**
 * Converts a JSON value into the equivalent ValueNode _without_ checking that
 * it's compatible with the expected type. Typically only used with scalars
 * (since they can use any ValueNode) - other parts of the GraphQL schema
 * should use explicitly compatible ValueNodes.
 *
 * WARNING: It's possible for this to generate `LIST(INT, FLOAT, STRING)` which
 * is not possible in GraphQL since lists have a single defined type. This should
 * only be used with custom scalars.
 */
function dangerousRawValueToValueNode(value: JSON): ConstValueNode {
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
  if (typeof value === "object" && value !== null) {
    return {
      kind: Kind.OBJECT,
      fields: Object.keys(value).map((key) => ({
        kind: Kind.OBJECT_FIELD,
        name: { kind: Kind.NAME, value: key },
        value: dangerousRawValueToValueNode(
          (value as Record<string, any>)[key],
        ),
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
): ConstValueNode | undefined {
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
    if (typeof value !== "object" || value === null) {
      throw new Error(
        "defaultValue contained invalid value at location expecting an object",
      );
    }
    const fieldDefs = type.getFields();
    const fields: ConstObjectFieldNode[] = [];
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
 * defers to {@link rawValueToValueNode}
 */
export function defaultValueToValueNode(
  type: GraphQLInputType,
  defaultValue: unknown,
): ConstValueNode | undefined {
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
export function isPromiseLike<T>(t: T | PromiseLike<T>): t is PromiseLike<T> {
  return t != null && typeof (t as any).then === "function";
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
  comparator?: (val1: T, val2: T) => boolean,
): boolean {
  if (array1 === array2) return true;
  const l = array1.length;
  if (l !== array2.length) {
    return false;
  }
  if (comparator !== undefined) {
    for (let i = 0; i < l; i++) {
      const a = array1[i]!;
      const b = array2[i]!;
      if (a !== b && !comparator(a, b)) {
        return false;
      }
    }
  } else {
    for (let i = 0; i < l; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
  }
  return true;
}

export function maybeArraysMatch<T>(
  array1: Maybe<ReadonlyArray<T>>,
  array2: Maybe<ReadonlyArray<T>>,
  comparator?: (val1: T, val2: T) => boolean,
): boolean {
  return (
    array1 === array2 ||
    (array1 != null &&
      array2 != null &&
      arraysMatch(array1, array2, comparator))
  );
}

/**
 * Returns true if map1 and map2 have the same keys, and every matching entry
 * value within them pass the `comparator` check (which defaults to `===`).
 */
export function mapsMatch<TKey, TVal>(
  map1: ReadonlyMap<TKey, TVal>,
  map2: ReadonlyMap<TKey, TVal>,
  comparator?: (
    k: TKey,
    val1: TVal | undefined,
    val2: TVal | undefined,
  ) => boolean,
): boolean {
  if (map1 === map2) return true;
  const l = map1.size;
  if (l !== map2.size) {
    return false;
  }
  const allKeys = new Set([...map1.keys(), ...map2.keys()]);
  if (allKeys.size !== l) {
    return false;
  }
  if (comparator !== undefined) {
    for (const k of allKeys) {
      const a = map1.get(k);
      const b = map2.get(k);
      if (a !== b && !comparator(k, a, b)) {
        return false;
      }
    }
  } else {
    for (const k of allKeys) {
      if (map1.get(k) !== map2.get(k)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Returns true if record1 and record2 are equivalent, i.e. every value within
 * them pass the `comparator` check (which defaults to `===`).
 *
 * Currently keys are ignored (`record[key] = undefined` is treated the same as
 * `record[key]` being unset), but this may not always be the case.
 */
export function recordsMatch<
  TRecord extends { readonly [k: string | symbol | number]: any },
>(
  record1: TRecord,
  record2: TRecord,
  comparator?: (
    k: keyof TRecord,
    val1: TRecord[typeof k],
    val2: TRecord[typeof k],
  ) => boolean,
): boolean {
  if (record1 === record2) return true;
  const k1 = Object.keys(record1) as (keyof TRecord)[];
  const k2 = Object.keys(record2) as (keyof TRecord)[];
  const allKeys = new Set([...k1, ...k2]);
  if (comparator !== undefined) {
    for (const k of allKeys) {
      const a = record1[k];
      const b = record2[k];
      if (a !== b && !comparator(k, a, b)) {
        return false;
      }
    }
  } else {
    for (const k of allKeys) {
      if (record1[k] !== record2[k]) {
        return false;
      }
    }
  }
  return true;
}

export function setsMatch(
  s1: ReadonlySet<string> | null,
  s2: ReadonlySet<string> | null,
) {
  if (s1 === s2) return true;
  if (s1 == null) return false;
  if (s2 == null) return false;
  if (s1.size !== s2.size) return false;
  for (const p of s1) {
    if (!s2.has(p)) return false;
  }
  return true;
}

export type ObjectTypeFields<TParentStep extends Step> = {
  [key: string]: GrafastFieldConfig<TParentStep, any, any>;
};

export type ObjectTypeSpec<
  TParentStep extends Step,
  TFields extends ObjectTypeFields<TParentStep>,
> = Omit<GraphQLObjectTypeConfig<any, Grafast.Context>, "fields"> & {
  fields: TFields | (() => TFields);
  assertStep?: TParentStep extends Step
    ?
        | ((step: Step) => asserts step is TParentStep)
        | { new (...args: any[]): TParentStep }
    : null;
  planType?: ($specifier: Step) => TParentStep;
};

/**
 * Saves us having to write `extensions: {grafast: {...}}` everywhere.
 */
export function objectSpec<
  TParentStep extends Step,
  TFields extends ObjectTypeFields<TParentStep>,
>(
  spec: ObjectTypeSpec<TParentStep, TFields>,
): GraphQLObjectTypeConfig<any, Grafast.Context> {
  const { assertStep, planType, ...rest } = spec;
  const modifiedSpec: GraphQLObjectTypeConfig<any, Grafast.Context> = {
    ...rest,
    ...(assertStep || planType
      ? {
          extensions: {
            ...spec.extensions,
            grafast: {
              ...(assertStep ? { assertStep } : null),
              ...(planType ? { planType } : null),
              ...spec.extensions?.grafast,
            },
          },
        }
      : null),
    fields: () => {
      const fields =
        typeof spec.fields === "function" ? spec.fields() : spec.fields;
      const modifiedFields = Object.keys(fields).reduce(
        (o, key) => {
          o[key] = objectFieldSpec<TParentStep>(
            fields[key],
            `${spec.name}.${key}`,
          );
          return o;
        },
        {} as GraphQLFieldConfigMap<any, Grafast.Context>,
      );
      return modifiedFields;
    },
  };
  return modifiedSpec;
}

export type GrafastObjectType<
  TParentStep extends Step,
  TFields extends ObjectTypeFields<TParentStep>,
> = graphql.GraphQLObjectType<TParentStep extends Step<infer U> ? U : never> & {
  TParentStep: TParentStep;
  TFields: TFields;
};

/**
 * @remarks This is a mess because the first two generics need to be specified manually, but the latter one we want inferred.
 */
export function newObjectTypeBuilder<TParentStep extends Step>(
  assertStep: TParentStep extends Step
    ?
        | ((step: Step) => asserts step is TParentStep)
        | { new (...args: any[]): TParentStep }
    : never,
): <TFields extends ObjectTypeFields<TParentStep>>(
  spec: ObjectTypeSpec<TParentStep, TFields>,
) => GrafastObjectType<TParentStep, TFields> {
  return (spec) =>
    new GraphQLObjectType(
      objectSpec({ assertStep, ...spec }),
    ) as GrafastObjectType<TParentStep, any>;
}

/**
 * Saves us having to write `extensions: {grafast: {...}}` everywhere.
 */
export function objectFieldSpec<
  TSource extends Step,
  TArgs extends BaseGraphQLArguments = BaseGraphQLArguments,
  TResult extends Step = Step,
>(
  grafastSpec: GrafastFieldConfig<TSource, TArgs, TResult>,
  path: string,
): GraphQLFieldConfig<any, Grafast.Context, TArgs> {
  const { plan, subscribePlan, args, ...spec } = grafastSpec;

  assertNotAsync(plan, `${path ?? "?"}.plan`);
  assertNotAsync(subscribePlan, `${path ?? "?"}.subscribePlan`);

  const argsWithExtensions = args
    ? Object.keys(args).reduce((memo, argName) => {
        const grafastArgSpec = args[argName];
        // TODO: remove this code
        if (
          grafastArgSpec.inputPlan ||
          grafastArgSpec.autoApplyAfterParentPlan ||
          grafastArgSpec.autoApplyAfterParentSubscribePlan
        ) {
          throw new Error(
            `Argument at ${path} has inputPlan or autoApplyAfterParentPlan or autoApplyAfterParentSubscribePlan set; these properties no longer do anything and should be removed.`,
          );
        }

        const { applyPlan, applySubscribePlan, ...argSpec } = grafastArgSpec;
        assertNotAsync(applyPlan, `${path ?? "?"}(${argName}:).applyPlan`);
        assertNotAsync(
          applySubscribePlan,
          `${path ?? "?"}(${argName}:).applySubscribePlan`,
        );
        memo[argName] = {
          ...argSpec,
          ...(applyPlan || applySubscribePlan
            ? {
                extensions: {
                  ...argSpec.extensions,
                  grafast: {
                    ...argSpec.extensions?.grafast,
                    ...(applyPlan ? { applyPlan } : null),
                    ...(applySubscribePlan ? { applySubscribePlan } : null),
                  },
                },
              }
            : null),
        };
        return memo;
      }, Object.create(null))
    : {};

  return {
    ...spec,
    args: argsWithExtensions,
    ...(plan || subscribePlan
      ? {
          extensions: {
            ...spec.extensions,
            grafast: {
              ...spec.extensions?.grafast,
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
export function newGrafastFieldConfigBuilder<TParentStep extends Step>(): <
  TArgs extends BaseGraphQLArguments = BaseGraphQLArguments,
  TFieldStep extends Step = Step,
>(
  config: GrafastFieldConfig<TParentStep, TArgs, TFieldStep>,
) => typeof config {
  return (config) => config;
}

export type GrafastInputFieldConfigMap<TParent> = {
  [key: string]: GrafastInputFieldConfig<TParent, GraphQLInputType>;
};

export type InputObjectTypeSpec<TParent> = Omit<
  GraphQLInputObjectTypeConfig,
  "fields"
> & {
  fields:
    | GrafastInputFieldConfigMap<TParent>
    | (() => GrafastInputFieldConfigMap<TParent>);
};

function inputObjectSpec<TParent>(
  spec: InputObjectTypeSpec<TParent>,
): GraphQLInputObjectTypeConfig {
  const modifiedSpec: GraphQLInputObjectTypeConfig = {
    ...spec,
    fields: () => {
      const fields =
        typeof spec.fields === "function" ? spec.fields() : spec.fields;
      const modifiedFields = Object.keys(fields).reduce((o, key) => {
        o[key] = inputObjectFieldSpec(fields[key], `${spec.name}.${key}`);
        return o;
      }, {} as GraphQLInputFieldConfigMap);
      return modifiedFields;
    },
  };
  return modifiedSpec;
}

export type GrafastInputObjectType<TParent> = graphql.GraphQLInputObjectType & {
  TParent: TParent;
};

export function newInputObjectTypeBuilder<TParent = any>(): (
  spec: InputObjectTypeSpec<TParent>,
) => GrafastInputObjectType<TParent> {
  return (spec) =>
    new GraphQLInputObjectType(
      inputObjectSpec(spec),
    ) as GrafastInputObjectType<TParent>;
}

/**
 * Saves us having to write `extensions: {grafast: {...}}` everywhere.
 */
export function inputObjectFieldSpec<TParent>(
  grafastSpec: GrafastInputFieldConfig<TParent, GraphQLInputType>,
  path: string,
): GraphQLInputFieldConfig {
  // TODO: remove this code
  if (
    grafastSpec.applyPlan ||
    grafastSpec.inputPlan ||
    grafastSpec.autoApplyAfterParentApplyPlan ||
    grafastSpec.autoApplyAfterParentInputPlan
  ) {
    throw new Error(
      `Input field at ${path} has applyPlan or inputPlan or autoApplyAfterParentApplyPlan or autoApplyAfterParentInputPlan set; these properties no longer do anything and should be removed.`,
    );
  }

  const { apply, ...spec } = grafastSpec;
  assertNotAsync(apply, `${path ?? "?"}.apply`);
  return apply
    ? {
        ...spec,
        extensions: {
          ...spec.extensions,
          grafast: {
            ...spec.extensions?.grafast,
            apply,
          } as Grafast.InputFieldExtensions,
        },
      }
    : spec;
}

declare module "graphql" {
  interface GraphQLEnumType {
    [$$valueConfigByValue]?: Record<string, GraphQLEnumValueConfig>;
  }
}

const $$valueConfigByValue = Symbol("valueConfigByValue");
export function getEnumValueConfigs(enumType: graphql.GraphQLEnumType): {
  [outputValue: string]: GraphQLEnumValueConfig | undefined;
} {
  // We cache onto the enumType directly so that garbage collection can clear up after us easily.
  if (enumType[$$valueConfigByValue] === undefined) {
    const config = enumType.toConfig();
    enumType[$$valueConfigByValue] = Object.values(config.values).reduce(
      (memo, value) => {
        memo[value.value] = value;
        return memo;
      },
      Object.create(null),
    );
  }
  return enumType[$$valueConfigByValue]!;
}
/**
 * This would be equivalent to `enumType._valueLookup.get(outputValue)` except
 * that's not a public API so we have to do a bit of heavy lifting here. Since
 * it is heavy lifting, we cache the result, but we don't know when enumType
 * will go away so we use a weakmap.
 */
export function getEnumValueConfig(
  enumType: graphql.GraphQLEnumType,
  outputValue: string,
): GraphQLEnumValueConfig | undefined {
  return getEnumValueConfigs(enumType)[outputValue];
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
 */
export function arrayOfLength(length: number, fill?: any) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr[i] = fill;
  }
  return arr;
}

/**
 * Builds an array of length `length` calling `fill` for each entry in the
 * list and storing the result.
 *
 * @internal
 */
export function arrayOfLengthCb(length: number, fill: () => any) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr[i] = fill();
  }
  return arr;
}

export const valueNodeToStaticValue = graphql.valueFromAST;

export function findVariableNamesUsedInValueNode(
  valueNode: ValueNode,
  variableNames: Set<string>,
): void {
  switch (valueNode.kind) {
    case Kind.INT:
    case Kind.FLOAT:
    case Kind.STRING:
    case Kind.BOOLEAN:
    case Kind.NULL:
    case Kind.ENUM: {
      // Static -> no variables
      return;
    }
    case Kind.LIST: {
      for (const value of valueNode.values) {
        findVariableNamesUsedInValueNode(value, variableNames);
      }
      return;
    }
    case Kind.OBJECT: {
      for (const field of valueNode.fields) {
        findVariableNamesUsedInValueNode(field.value, variableNames);
      }
      return;
    }
    case Kind.VARIABLE: {
      variableNames.add(valueNode.name.value);
      return;
    }
    default: {
      const never: never = valueNode;
      throw new Error(`Unsupported valueNode: ${JSON.stringify(never)}`);
    }
  }
}

function findVariableNamesUsedInDirectives(
  directives: readonly DirectiveNode[] | undefined,
  variableNames: Set<string>,
) {
  if (directives !== undefined) {
    for (const dir of directives) {
      if (dir.arguments !== undefined) {
        for (const arg of dir.arguments) {
          findVariableNamesUsedInValueNode(arg.value, variableNames);
        }
      }
    }
  }
}

function findVariableNamesUsedInArguments(
  args: readonly ArgumentNode[] | undefined,
  variableNames: Set<string>,
) {
  if (args !== undefined) {
    for (const arg of args) {
      findVariableNamesUsedInValueNode(arg.value, variableNames);
    }
  }
}

function findVariableNamesUsedInSelectionNode(
  operationPlan: OperationPlan,
  selection: SelectionNode,
  variableNames: Set<string>,
) {
  findVariableNamesUsedInDirectives(selection.directives, variableNames);
  switch (selection.kind) {
    case Kind.FIELD: {
      findVariableNamesUsedInFieldNode(operationPlan, selection, variableNames);
      return;
    }
    case Kind.INLINE_FRAGMENT: {
      findVariableNamesUsedInDirectives(selection.directives, variableNames);
      for (const innerSelection of selection.selectionSet.selections) {
        findVariableNamesUsedInSelectionNode(
          operationPlan,
          innerSelection,
          variableNames,
        );
      }
      return;
    }
    case Kind.FRAGMENT_SPREAD: {
      findVariableNamesUsedInDirectives(selection.directives, variableNames);
      const fragmentName = selection.name.value;
      const fragment = operationPlan.fragments[fragmentName];
      findVariableNamesUsedInDirectives(fragment.directives, variableNames);
      if (fragment.variableDefinitions?.length) {
        throw new SafeError(
          "Grafast doesn't support variable definitions on fragments yet.",
        );
      }
      for (const innerSelection of fragment.selectionSet.selections) {
        findVariableNamesUsedInSelectionNode(
          operationPlan,
          innerSelection,
          variableNames,
        );
      }
      return;
    }
    default: {
      const never: never = selection;
      throw new Error(`Unsupported selection ${(never as any).kind}`);
    }
  }
}
function findVariableNamesUsedInFieldNode(
  operationPlan: OperationPlan,
  field: FieldNode,
  variableNames: Set<string>,
) {
  findVariableNamesUsedInArguments(field.arguments, variableNames);
  findVariableNamesUsedInDirectives(field.directives, variableNames);
  if (field.selectionSet !== undefined) {
    for (const selection of field.selectionSet.selections) {
      findVariableNamesUsedInSelectionNode(
        operationPlan,
        selection,
        variableNames,
      );
    }
  }
}

/**
 * Given a FieldNode, recursively walks and finds all the variable references,
 * returning a list of the (unique) variable names used.
 */
export function findVariableNamesUsed(
  operationPlan: OperationPlan,
  field: FieldNode,
): string[] {
  const variableNames = new Set<string>();
  findVariableNamesUsedInFieldNode(operationPlan, field, variableNames);
  return [...variableNames].sort();
}

export function isTypePlanned(
  schema: GraphQLSchema,
  namedType: GraphQLNamedType,
): boolean {
  if (namedType instanceof GraphQLObjectType) {
    return !!namedType.extensions?.grafast?.assertStep;
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
      const hasPlan = !!type.extensions?.grafast?.assertStep;
      if (firstHadPlan === null) {
        firstHadPlan = hasPlan;
      } else if (hasPlan !== firstHadPlan) {
        // ENHANCE: validate this at schema build time
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
 * Make protected/private methods accessible.
 *
 * @internal
 */
export type Sudo<T> =
  T extends Step<any>
    ? T & {
        dependencies: ReadonlyArray<Step>;
        implicitSideEffectStep: Step | null;
        dependencyForbiddenFlags: ReadonlyArray<ExecutionEntryFlags>;
        dependencyOnReject: ReadonlyArray<Error | null | undefined>;
        dependencyDataOnly: ReadonlyArray<boolean>;
        defaultForbiddenFlags: ExecutionEntryFlags;
        _getDepOptions: Step["_getDepOptions"];
        _refs: Array<number>;
      }
    : T;

/**
 * Make protected/private methods accessible.
 *
 * @internal
 */
export function sudo<T>(obj: T): Sudo<T> {
  return obj as Sudo<T>;
}

/**
 * We want everything else to treat things like `dependencies` as read only,
 * however we ourselves want to be able to write to them, so we can use
 * writeable for this.
 *
 * @internal
 */
export function writeableArray<T>(a: ReadonlyArray<T>): Array<T> {
  return a as any;
}

/**
 * Returns `true` if the first argument depends on the second argument either
 * directly or indirectly (via a chain of dependencies).
 */
export function stepADependsOnStepB(
  stepA: Step,
  stepB: Step,
  sansSideEffects = false,
) {
  return _stepADependsOnStepB(stepA, stepB, sansSideEffects, new Set());
}

/** @internal */
function _stepADependsOnStepB(
  stepA: Step,
  stepB: Step,
  sansSideEffects: boolean,
  visited: Set<Step>,
): boolean {
  if (stepA === stepB) {
    throw new Error("Invalid call to stepADependsOnStepB");
  }

  if (visited.has(stepA)) return false;
  visited.add(stepA);

  // PERF: bredth-first might be better.

  // PERF: we can stop looking once we pass a certain layerPlan boundary.

  // PERF: maybe some form of caching here would be sensible?

  // Depth-first search for match
  for (const dep of sudo(stepA).dependencies) {
    if (dep === stepB) {
      return true;
    }
    if (
      sansSideEffects &&
      dep.implicitSideEffectStep &&
      dep.implicitSideEffectStep !== stepB.implicitSideEffectStep
    ) {
      return false;
    }
    if (_stepADependsOnStepB(dep, stepB, false, visited)) {
      return true;
    }
  }
  if (stepA.implicitSideEffectStep) {
    if (stepA.implicitSideEffectStep === stepB) return true;
    return _stepADependsOnStepB(
      stepA.implicitSideEffectStep,
      stepB,
      false,
      visited,
    );
  } else {
    return false;
  }
}

function stepAIsOrDependsOnStepB(stepA: Step, stepB: Step): boolean {
  return stepA === stepB || stepADependsOnStepB(stepA, stepB);
}

/**
 * Returns true if stepA is allowed to depend on stepB, false otherwise. (This
 * mostly relates to heirarchy.)
 */
export function stepAMayDependOnStepB($a: Step, $b: Step): boolean {
  if ($a.isFinalized) {
    return false;
  }
  if ($a._isUnaryLocked && $a._isUnary && !$b._isUnary) {
    return false;
  }
  if (!$a.layerPlan.ancestry.includes($b.layerPlan)) {
    return false;
  }
  return !stepADependsOnStepB($b, $a);
}

export function stepAShouldTryAndInlineIntoStepB($a: Step, $b: Step): boolean {
  if ($a.implicitSideEffectStep !== $b.implicitSideEffectStep) {
    return false;
  }
  // If there's any side effects in the path, reject
  if (isDev && !stepADependsOnStepB($a, $b)) {
    throw new Error(
      `Shouldn't try and inline into something you're not dependent on!`,
    );
  }
  if (!stepsAreInSamePhase($b, $a)) return false;

  // TODO: review the rules about polymorphism here; e.g. "only if most of the
  // polymorphic paths are covered" or something. We don't want the parent to
  // do lots of work for lots of polymorphic paths that won't be covered, but
  // equally we don't want to necessarily require 100% of the polymorphic
  // branches to be matched.
  const paths = pathsFromAncestorToTargetLayerPlan($b.layerPlan, $a.layerPlan);
  let path: readonly LayerPlan[];
  if (paths.length === 0) {
    throw new Error(`No path from ${$a} back to ${$b}?`);
  } else if (paths.length > 1) {
    const commonPath: LayerPlan[] = [];
    const firstPath = paths[0];
    for (const lp of firstPath) {
      if (paths.every((p) => p.includes(lp))) {
        commonPath.push(lp);
      }
    }
    path = commonPath;
  } else {
    path = paths[0];
  }
  for (const lp of path) {
    if (lp.reason.type === "polymorphicPartition") {
      return false;
    }
  }

  // Don't go past any side effects
  if (!stepADependsOnStepB($a, $b, true)) {
    return false;
  }

  return true;
}

export function pathsFromAncestorToTargetLayerPlan(
  ancestor: LayerPlan,
  lp: LayerPlan,
): readonly LayerPlan[][] {
  if (lp === ancestor) {
    // One path, and it's the null path - stay where you are.
    return [[]];
  }

  if (lp.reason.type === "root") {
    // No paths found - lp doesn't inherit from ancestor.
    return [];
  } else if (lp.reason.type === "combined") {
    const childPaths = lp.reason.parentLayerPlans.flatMap((plp) =>
      pathsFromAncestorToTargetLayerPlan(ancestor, plp),
    );
    for (const path of childPaths) {
      path.push(lp);
    }
    return childPaths;
  } else {
    const childPaths = pathsFromAncestorToTargetLayerPlan(
      ancestor,
      lp.reason.parentLayerPlan,
    );
    for (const path of childPaths) {
      path.push(lp);
    }
    return childPaths;
  }
}

export function layerPlanHeirarchyContains(
  lp: LayerPlan,
  targetLp: LayerPlan,
): boolean {
  if (lp === targetLp) return true;
  if (lp.reason.type === "root") {
    return false;
  } else if (lp.reason.type === "combined") {
    return lp.reason.parentLayerPlans.some((plp) =>
      layerPlanHeirarchyContains(plp, targetLp),
    );
  } else {
    // PERF: loop would be faster than recursion
    return layerPlanHeirarchyContains(lp.reason.parentLayerPlan, targetLp);
  }
}

/**
 * For a regular GraphQL query with no `@stream`/`@defer`, the entire result is
 * calculated and then the output is generated and sent to the client at once.
 * Thus you can think of this as every plan is in the same "phase".
 *
 * However, if you introduce a `@stream`/`@defer` selection, then the steps
 * inside that selection should run _later_ than the steps in the parent
 * selection - they should run in two different phases. Similar is true for
 * subscriptions.
 *
 * When optimizing your plans, if you are not careful you may end up pushing
 * what should be later work into the earlier phase, resulting in the initial
 * payload being delayed whilst things that should have been deferred are being
 * calculated. Thus, you should generally check that two plans are in the same phase
 * before you try and merge them.
 *
 * This is not a strict rule, though, because sometimes it makes more sense to
 * push work into the parent phase because it would be faster overall to do
 * that work there, and would not significantly delay the initial payload's
 * execution time - for example it's unlikely that it would make sense to defer
 * selecting an additional boolean column from a database table even if the
 * operation indicates that's what you should do.
 *
 * As a step class author, it's your responsiblity to figure out the right
 * approach. Once you have, you can use this function to help you, should you
 * need it.
 */
export function stepsAreInSamePhase(ancestor: Step, descendent: Step) {
  if (isDev && !stepADependsOnStepB(descendent, ancestor)) {
    throw new Error(
      `Shouldn't try and inline into something you're not dependent on!`,
    );
  }
  const ancestorDepth = ancestor.layerPlan.depth;
  const descendentDepth = descendent.layerPlan.depth;
  if (descendentDepth < ancestorDepth) {
    throw new Error(
      `descendent is deeper than ancestor; did you pass ancestor/descendent the wrong way around?`,
    );
  }
  const descDeferBoundary =
    descendent.layerPlan.ancestry[descendent.layerPlan.deferBoundaryDepth];
  if (
    ancestor.layerPlan.ancestry[ancestor.layerPlan.deferBoundaryDepth] !==
    descDeferBoundary
  ) {
    // Still possible to be okay if ancestor is the source of a streamed list item or deferred step
    if (
      descDeferBoundary.reason.type === "listItem" &&
      descDeferBoundary.reason.stream != null &&
      descendent.layerPlan.ancestry[
        descendent.layerPlan.deferBoundaryDepth - 1
      ] === ancestor.layerPlan
    ) {
      if (
        stepAIsOrDependsOnStepB(descDeferBoundary.reason.parentStep, ancestor)
      ) {
        return true;
      }
    }
    // Nope, don't allow
    return false;
  }
  for (let i = 0; i < ancestorDepth; i++) {
    if (ancestor.layerPlan.ancestry[i] !== descendent.layerPlan.ancestry[i]) {
      return false;
    }
  }
  for (let i = ancestorDepth + 1; i < descendentDepth; i++) {
    const currentLayerPlan = descendent.layerPlan.ancestry[i];
    const t = currentLayerPlan.reason.type;
    switch (t) {
      case "combined": {
        continue;
      }
      case "subscription":
      case "defer": {
        // These indicate boundaries over which plans shouldn't be optimized
        // together (generally).
        return false;
      }
      case "listItem": {
        if (currentLayerPlan.reason.stream) {
          // It's streamed, but we can still inline the step into its parent since its the parent that is being streamed (so it should not add to the initial execution overhead).
          // OPTIMIZE: maybe we should only allow this if the parent actually has `stream` support, and disable it otherwise?
          continue;
        } else {
          continue;
        }
      }
      case "root":
      case "nullableBoundary":
      case "subroutine":
      case "polymorphic":
      case "polymorphicPartition":
      case "mutationField": {
        continue;
      }
      default: {
        const never: never = t;
        throw new Error(`Unhandled layer plan type '${never}'`);
      }
    }
  }
  return true;
}

export function isPhaseTransitionLayerPlan(
  layerPlan: LayerPlan,
): layerPlan is
  | LayerPlan<LayerPlanReasonListItem>
  | LayerPlan<LayerPlanReasonDefer>
  | LayerPlan<LayerPlanReasonSubscription> {
  const t = layerPlan.reason.type;
  switch (t) {
    case "subscription":
    case "defer": {
      return true;
    }
    case "listItem": {
      if (layerPlan.reason.stream) {
        return true;
      } else {
        return false;
      }
    }
    case "polymorphic":
    case "polymorphicPartition":
    case "root":
    case "nullableBoundary":
    case "subroutine":
    case "combined": // TODO: CHECK ME!
    case "mutationField": {
      return false;
    }
    default: {
      const never: never = t;
      throw new Error(`Unhandled layer plan type '${never}'`);
    }
  }
}

// ENHANCE: implement this!
export const canonicalJSONStringify = (o: object) => JSON.stringify(o);

// PERF: only do this if isDev; otherwise replace with NOOP?
export function assertNotAsync(fn: any, name: string): void {
  if (fn?.constructor?.name === "AsyncFunction") {
    throw new Error(
      `Plans must be synchronous, but this schema has an async function at '${name}': ${fn.toString()}`,
    );
  }
}

// PERF: only do this if isDev; otherwise replace with NOOP?
export function assertNotPromise<TVal>(
  value: TVal,
  fn: any,
  name: string,
): TVal {
  if (isPromiseLike(value)) {
    throw new Error(
      `Plans must be synchronous, but this schema has an function at '${name}' that returned a promise-like object: ${fn.toString()}`,
    );
  }
  return value;
}

export function hasItemPlan(
  step: Step & {
    itemPlan?: ($item: Step) => Step;
  },
): step is Step & {
  itemPlan: ($item: Step) => Step;
} {
  return "itemPlan" in step && typeof step.itemPlan === "function";
}

export function exportNameHint(obj: any, nameHint: string): void {
  if ((typeof obj === "object" && obj != null) || typeof obj === "function") {
    if (!("$exporter$name" in obj)) {
      Object.defineProperty(obj, "$exporter$name", {
        writable: true,
        value: nameHint,
      });
    } else if (!obj.$exporter$name) {
      obj.$exporter$name = nameHint;
    }
  }
}

export function isTuple<T extends readonly [...(readonly any[])]>(
  t: any | T,
): t is T {
  return Array.isArray(t);
}

/**
 * Turns an array of keys into a digest, avoiding conflicts.
 * Symbols are treated as equivalent. (Theoretically faster
 * than JSON.stringify().)
 */
export function digestKeys(keys: ReadonlyArray<string | number | symbol>) {
  let str = "";
  for (let i = 0, l = keys.length; i < l; i++) {
    const item = keys[i];
    if (typeof item === "string") {
      // str += `|§${item.replace(/§/g, "§§")}§`;
      str += `§${item.length}:${item}`;
    } else if (typeof item === "number") {
      str += `N${item}`;
    } else {
      str += "!";
    }
  }
  return str;
}

/**
 * If the directive has the argument `argName`, return a step representing that
 * arguments value, whether that be a step representing the relevant variable
 * or a constant step representing the hardcoded value in the document.
 *
 * @remarks NOT SUITABLE FOR USAGE WITH LISTS OR OBJECTS! Does not evaluate
 * internal variable usages e.g. `[1, $b, 3]`
 */
export function directiveArgument<T>(
  operationPlan: OperationPlan,
  directive: DirectiveNode,
  argName: string,
  expectedKind:
    | graphql.Kind.INT
    | graphql.Kind.FLOAT
    | graphql.Kind.BOOLEAN
    | graphql.Kind.STRING,
): Step<T> | undefined {
  const arg = directive.arguments?.find((n) => n.name.value === argName);
  if (!arg) return undefined;
  const val = arg.value;
  return val.kind === graphql.Kind.VARIABLE
    ? operationPlan.variableValuesStep.get(val.name.value)
    : val.kind === expectedKind
      ? constant(
          val.kind === Kind.INT
            ? (parseInt(val.value, 10) as T)
            : val.kind === Kind.FLOAT
              ? (parseFloat(val.value) as T)
              : // boolean, string
                (val.value as T),
        )
      : undefined;
}
export function stableStringSort(a: string, z: string) {
  return a < z ? -1 : a > z ? 1 : 0;
}
/**
 * Sorts tuples by a string sort of their first entry - useful for
 * `Object.fromEntries(Object.entries(...).sort(stableStringSortFirstTupleEntry))`
 */
export function stableStringSortFirstTupleEntry(
  a: readonly [string, ...any[]],
  z: readonly [string, ...any[]],
) {
  return a[0] < z[0] ? -1 : a[0] > z[0] ? 1 : 0;
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Save on garbage collection by just using this promise for everything
const DONE_PROMISE: Promise<IteratorReturnResult<void>> = Promise.resolve({
  done: true,
  value: undefined,
});

/**
 * Returns a new version of `iterable` that calls `callback()` on termination,
 * **even if `next()` is never called**.
 *
 * @experimental
 */
export function asyncIteratorWithCleanup<T>(
  iterable: AsyncIterable<T, void, never>,
  callback: (error?: unknown) => void,
): AsyncGenerator<T, void, never> & AsyncIteratorObject<T, void, never> {
  let iterator:
    | (AsyncIterator<T, void, never> &
        Partial<AsyncIteratorObject<T, void, never>>)
    | null = null;
  let done = false;
  function cleanup(e?: unknown) {
    if (!done) {
      done = true;
      callback(e);
    }
  }
  function checkDone(result: IteratorResult<T, void>) {
    if (done) return;
    if (result.done) cleanup();
  }
  return {
    [Symbol.asyncIterator]() {
      iterator ??= iterable[Symbol.asyncIterator]();
      return this;
    },
    [Symbol.asyncDispose]() {
      iterator ??= iterable[Symbol.asyncIterator]();
      cleanup();
      return iterator[Symbol.asyncDispose]?.() ?? Promise.resolve();
    },
    return(value) {
      iterator ??= iterable[Symbol.asyncIterator]();
      cleanup();
      return iterator.return?.(value) ?? DONE_PROMISE;
    },
    throw(e) {
      iterator ??= iterable[Symbol.asyncIterator]();
      cleanup(e);
      return iterator.throw?.(e) ?? DONE_PROMISE;
    },
    next() {
      iterator ??= iterable[Symbol.asyncIterator]();
      const result = iterator.next();
      result.then(checkDone, cleanup);
      return result;
    },
  };
}

export function terminateIterable(
  iterable: readonly any[] | Iterable<any> | AsyncIterable<any>,
) {
  if ("return" in iterable && typeof iterable.return === "function") {
    iterable.return();
  }
}

export const GraphQLSpecifiedErrorBehaviors = Object.freeze([
  "PROPAGATE",
  "NULL",
  "HALT",
] as const);
