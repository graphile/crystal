import type {
  ArgumentNode,
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
  GraphQLOutputType,
  GraphQLSchema,
  ObjectFieldNode,
  SelectionNode,
  ValueNode,
} from "graphql";
import {
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
} from "graphql";

import * as assert from "./assert.js";
import type { Deferred } from "./deferred.js";
import { isDev } from "./dev.js";
import type { LayerPlan } from "./engine/LayerPlan.js";
import type { OperationPlan } from "./engine/OperationPlan.js";
import { SafeError } from "./error.js";
import type { InputStep } from "./input.js";
import { inspect } from "./inspect.js";
import type {
  BaseGraphQLArguments,
  GrafastFieldConfig,
  GrafastInputFieldConfig,
  OutputPlanForType,
} from "./interfaces.js";
import type { ExecutableStep, ModifierStep } from "./step.js";

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
  if (comparator) {
    for (let i = 0; i < l; i++) {
      if (!comparator(array1[i], array2[i])) {
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

export type ObjectTypeFields<
  TContext extends Grafast.Context,
  TParentStep extends ExecutableStep,
> = {
  [key: string]: GrafastFieldConfig<
    GraphQLOutputType,
    TContext,
    TParentStep,
    any,
    any
  >;
};

export type ObjectTypeSpec<
  TContext extends Grafast.Context,
  TParentStep extends ExecutableStep,
  TFields extends ObjectTypeFields<TContext, TParentStep>,
> = Omit<GraphQLObjectTypeConfig<any, TContext>, "fields"> & {
  fields: TFields | (() => TFields);
};

/**
 * Saves us having to write `extensions: {grafast: {...}}` everywhere.
 */
export function objectSpec<
  TContext extends Grafast.Context,
  TParentStep extends ExecutableStep,
  TFields extends ObjectTypeFields<TContext, TParentStep>,
>(
  spec: ObjectTypeSpec<TContext, TParentStep, TFields>,
  Step:
    | ((step: ExecutableStep) => asserts step is ExecutableStep)
    | { new (...args: any[]): TParentStep }
    | null,
): GraphQLObjectTypeConfig<any, TContext> {
  const modifiedSpec: GraphQLObjectTypeConfig<any, TContext> = {
    ...spec,
    ...(Step
      ? {
          extensions: {
            ...spec.extensions,
            grafast: {
              Step: Step,
              ...spec.extensions?.grafast,
            },
          },
        }
      : null),
    fields: () => {
      const fields =
        typeof spec.fields === "function" ? spec.fields() : spec.fields;
      const modifiedFields = Object.keys(fields).reduce((o, key) => {
        o[key] = objectFieldSpec<TContext, TParentStep>(
          fields[key],
          `${spec.name}.${key}`,
        );
        return o;
      }, {} as GraphQLFieldConfigMap<any, TContext>);
      return modifiedFields;
    },
  };
  return modifiedSpec;
}

export type GrafastObjectType<
  TContext extends Grafast.Context,
  TParentStep extends ExecutableStep,
  TFields extends ObjectTypeFields<TContext, TParentStep>,
> = GraphQLObjectType<
  TParentStep extends ExecutableStep<infer U> ? U : never,
  TContext
> & { TParentStep: TParentStep; TFields: TFields };

/**
 * @remarks This is a mess because the first two generics need to be specified manually, but the latter one we want inferred.
 */
export function newObjectTypeBuilder<
  TContext extends Grafast.Context,
  TParentStep extends ExecutableStep,
>(Step: {
  new (...args: any[]): TParentStep;
}): <TFields extends ObjectTypeFields<TContext, TParentStep>>(
  spec: ObjectTypeSpec<TContext, TParentStep, TFields>,
) => GrafastObjectType<TContext, TParentStep, TFields> {
  return (spec) =>
    new GraphQLObjectType(objectSpec(spec, Step)) as GrafastObjectType<
      TContext,
      TParentStep,
      any
    >;
}

/**
 * Saves us having to write `extensions: {grafast: {...}}` everywhere.
 */
export function objectFieldSpec<
  TContext extends Grafast.Context,
  TSource extends ExecutableStep,
  TResult extends ExecutableStep = ExecutableStep,
  TArgs extends BaseGraphQLArguments = BaseGraphQLArguments,
>(
  grafastSpec: GrafastFieldConfig<
    GraphQLOutputType,
    TContext,
    TSource,
    TResult,
    TArgs
  >,
  path: string,
): GraphQLFieldConfig<any, TContext, TArgs> {
  const { plan, subscribePlan, args, ...spec } = grafastSpec;

  assertNotAsync(plan, `${path ?? "?"}.plan`);
  assertNotAsync(subscribePlan, `${path ?? "?"}.subscribePlan`);

  const argsWithExtensions = args
    ? Object.keys(args).reduce((memo, argName) => {
        const { inputPlan, applyPlan, ...argSpec } = args[argName];
        assertNotAsync(inputPlan, `${path ?? "?"}(${argName}:).inputPlan`);
        assertNotAsync(applyPlan, `${path ?? "?"}(${argName}:).applyPlan`);
        memo[argName] = {
          ...argSpec,
          ...(inputPlan || applyPlan
            ? {
                extensions: {
                  grafast: {
                    ...(inputPlan ? { inputPlan } : null),
                    ...(applyPlan ? { applyPlan } : null),
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
export function newGrafastFieldConfigBuilder<
  TContext extends Grafast.Context,
  TParentStep extends ExecutableStep,
>(): <
  TType extends GraphQLOutputType,
  TFieldStep extends OutputPlanForType<TType>,
  TArgs extends BaseGraphQLArguments,
>(
  config: GrafastFieldConfig<TType, TContext, TParentStep, TFieldStep, TArgs>,
) => typeof config {
  return (config) => config;
}

export type GrafastInputFieldConfigMap<
  TContext extends Grafast.Context,
  TParentStep extends ModifierStep<any>,
> = {
  [key: string]: GrafastInputFieldConfig<
    GraphQLInputType,
    TContext,
    TParentStep,
    any,
    any
  >;
};

export type InputObjectTypeSpec<
  TContext extends Grafast.Context,
  TParentStep extends ModifierStep<any>,
  TFields extends GrafastInputFieldConfigMap<TContext, TParentStep>,
> = Omit<GraphQLInputObjectTypeConfig, "fields"> & {
  fields: TFields | (() => TFields);
};

function inputObjectSpec<
  TContext extends Grafast.Context,
  TParentStep extends ModifierStep<any>,
  TFields extends GrafastInputFieldConfigMap<TContext, TParentStep>,
>(
  spec: InputObjectTypeSpec<TContext, TParentStep, TFields>,
): GraphQLInputObjectTypeConfig {
  const modifiedSpec: GraphQLInputObjectTypeConfig = {
    ...spec,
    fields: () => {
      const fields =
        typeof spec.fields === "function" ? spec.fields() : spec.fields;
      const modifiedFields = Object.keys(fields).reduce((o, key) => {
        o[key] = inputObjectFieldSpec<TContext, TParentStep>(
          fields[key],
          `${spec.name}.${key}`,
        );
        return o;
      }, {} as GraphQLInputFieldConfigMap);
      return modifiedFields;
    },
  };
  return modifiedSpec;
}

export type GrafastInputObjectType<
  TContext extends Grafast.Context,
  TParentStep extends ModifierStep<any>,
  TFields extends GrafastInputFieldConfigMap<TContext, TParentStep>,
> = GraphQLInputObjectType & {
  TContext: TContext;
  TParentStep: TParentStep;
  TFields: TFields;
};

export function newInputObjectTypeBuilder<
  TContext extends Grafast.Context,
  TParentStep extends ModifierStep<any>,
>(): <TFields extends GrafastInputFieldConfigMap<TContext, TParentStep>>(
  spec: InputObjectTypeSpec<TContext, TParentStep, TFields>,
) => GrafastInputObjectType<TContext, TParentStep, TFields> {
  return (spec) =>
    new GraphQLInputObjectType(inputObjectSpec(spec)) as GrafastInputObjectType<
      TContext,
      TParentStep,
      any
    >;
}

/**
 * Saves us having to write `extensions: {grafast: {...}}` everywhere.
 */
export function inputObjectFieldSpec<
  TContext extends Grafast.Context,
  TParent extends ModifierStep<any>,
  TResult extends ModifierStep<TParent> = ModifierStep<TParent>,
  TInput extends InputStep = InputStep,
>(
  grafastSpec: GrafastInputFieldConfig<
    GraphQLInputType,
    TContext,
    TParent,
    TResult,
    TInput
  >,
  path: string,
): GraphQLInputFieldConfig {
  const { inputPlan, applyPlan, ...spec } = grafastSpec;
  assertNotAsync(inputPlan, `${path ?? "?"}.inputPlan`);
  assertNotAsync(applyPlan, `${path ?? "?"}.applyPlan`);
  return inputPlan || applyPlan
    ? {
        ...spec,
        extensions: {
          grafast: {
            ...(inputPlan ? { inputPlan } : null),
            ...(applyPlan ? { applyPlan } : null),
          },
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
/**
 * This would be equivalent to `enumType._valueLookup.get(outputValue)` except
 * that's not a public API so we have to do a bit of heavy lifting here. Since
 * it is heavy lifting, we cache the result, but we don't know when enumType
 * will go away so we use a weakmap.
 */
export function getEnumValueConfig(
  enumType: GraphQLEnumType,
  outputValue: string,
): GraphQLEnumValueConfig | undefined {
  // We cache onto the enumType directly so that garbage collection can clear up after us easily.
  if (!enumType[$$valueConfigByValue]) {
    const config = enumType.toConfig();
    enumType[$$valueConfigByValue] = Object.values(config.values).reduce(
      (memo, value) => {
        memo[value.value] = value;
        return memo;
      },
      Object.create(null),
    );
  }
  return enumType[$$valueConfigByValue]![outputValue];
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

function findVariableNamesUsedInValueNode(
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
  if (directives) {
    for (const dir of directives) {
      if (dir.arguments) {
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
  if (args) {
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
  if (field.selectionSet) {
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
    return !!namedType.extensions?.grafast?.Step;
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
      const hasPlan = !!type.extensions?.grafast?.Step;
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

export function stepADependsOnStepB(
  stepA: ExecutableStep,
  stepB: ExecutableStep,
): boolean {
  if (stepA === stepB) {
    throw new Error("Invalid call to stepADependsOnStepB");
  }
  // Depth-first search for match
  for (const dep of stepA.dependencies) {
    if (dep === stepB) {
      return true;
    }
    if (stepADependsOnStepB(dep, stepB)) {
      return true;
    }
  }
  return false;
}

/**
 * Returns true if stepA is allowed to depend on stepB, false otherwise. (This
 * mostly relates to heirarchy.)
 */
export function stepAMayDependOnStepB(
  $a: ExecutableStep,
  $b: ExecutableStep,
): boolean {
  return (
    $a.layerPlan.ancestry.includes($b.layerPlan) && !stepADependsOnStepB($b, $a)
  );
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
export function stepsAreInSamePhase(
  ancestor: ExecutableStep,
  descendent: ExecutableStep,
) {
  let currentLayerPlan: LayerPlan | null = descendent.layerPlan;
  do {
    if (currentLayerPlan === ancestor.layerPlan) {
      return true;
    }
    const t = currentLayerPlan.reason.type;
    if (t === "polymorphic") {
      // OPTIMIZE: can optimize this so that if all polymorphicPaths match then it
      // passes
      return false;
    } else if (t === "subscription" || t === "defer") {
      // These indicate boundaries over which plans shouldn't be optimized
      // together (generally).
      return false;
    }
    // TODO: what about streams?
    // `t === "listItem" && currentLayerPlan.reason.stream`
  } while ((currentLayerPlan = currentLayerPlan.parentLayerPlan));
  throw new Error(
    `${descendent} is not dependent on ${ancestor}, perhaps you passed the arguments in the wrong order?`,
  );
}

// TODO: implement this!
export const canonicalJSONStringify = (o: object) => JSON.stringify(o);

export function assertNotAsync(fn: any, name: string): void {
  if (fn?.constructor?.name === "AsyncFunction") {
    throw new Error(
      `Plans must be synchronous, but this schema has an async function at '${name}': ${fn.toString()}`,
    );
  }
}
