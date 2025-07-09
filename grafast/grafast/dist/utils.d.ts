import type { ConstValueNode, DirectiveNode, FieldNode, GraphQLEnumValueConfig, GraphQLFieldConfig, GraphQLInputFieldConfig, GraphQLInputObjectTypeConfig, GraphQLInputType, GraphQLNamedType, GraphQLObjectTypeConfig, GraphQLOutputType, GraphQLSchema, ValueNode } from "graphql";
import * as graphql from "graphql";
import type { Deferred } from "./deferred.js";
import type { OperationPlan } from "./engine/OperationPlan.js";
import type { BaseGraphQLArguments, GrafastFieldConfig, GrafastInputFieldConfig, OutputPlanForType } from "./interfaces.js";
import type { Step } from "./step.js";
/**
 * The parent object is used as the key in `GetValueStepId()`; for root level
 * fields it's possible that the parent will be null/undefined (in all other
 * cases it will be an object), so we need a value that can be the key in a
 * WeakMap to represent the root.
 */
export declare const ROOT_VALUE_OBJECT: any;
export declare function assertNullPrototype(object: Record<string, unknown>, description: string): void;
/**
 * Specifically allows for the `defaultValue` to be undefined, but otherwise
 * defers to {@link rawValueToValueNode}
 */
export declare function defaultValueToValueNode(type: GraphQLInputType, defaultValue: unknown): ConstValueNode | undefined;
export declare function isPromise<T>(t: T | Promise<T>): t is Promise<T>;
/**
 * Is "thenable".
 */
export declare function isPromiseLike<T>(t: T | PromiseLike<T>): t is PromiseLike<T>;
/**
 * Is a promise that can be externally resolved.
 */
export declare function isDeferred<T>(t: T | Promise<T> | Deferred<T>): t is Deferred<T>;
/**
 * Returns true if array1 and array2 have the same length, and every pair of
 * values within them pass the `comparator` check (which defaults to `===`).
 */
export declare function arraysMatch<T>(array1: ReadonlyArray<T>, array2: ReadonlyArray<T>, comparator?: (val1: T, val2: T) => boolean): boolean;
export type ObjectTypeFields<TParentStep extends Step> = {
    [key: string]: GrafastFieldConfig<GraphQLOutputType, TParentStep, any, any>;
};
export type ObjectTypeSpec<TParentStep extends Step, TFields extends ObjectTypeFields<TParentStep>> = Omit<GraphQLObjectTypeConfig<any, Grafast.Context>, "fields"> & {
    fields: TFields | (() => TFields);
    assertStep?: TParentStep extends Step ? ((step: Step) => asserts step is TParentStep) | {
        new (...args: any[]): TParentStep;
    } : null;
};
/**
 * Saves us having to write `extensions: {grafast: {...}}` everywhere.
 */
export declare function objectSpec<TParentStep extends Step, TFields extends ObjectTypeFields<TParentStep>>(spec: ObjectTypeSpec<TParentStep, TFields>): GraphQLObjectTypeConfig<any, Grafast.Context>;
export type GrafastObjectType<TParentStep extends Step, TFields extends ObjectTypeFields<TParentStep>> = graphql.GraphQLObjectType<TParentStep extends Step<infer U> ? U : never> & {
    TParentStep: TParentStep;
    TFields: TFields;
};
/**
 * @remarks This is a mess because the first two generics need to be specified manually, but the latter one we want inferred.
 */
export declare function newObjectTypeBuilder<TParentStep extends Step>(assertStep: TParentStep extends Step ? ((step: Step) => asserts step is TParentStep) | {
    new (...args: any[]): TParentStep;
} : never): <TFields extends ObjectTypeFields<TParentStep>>(spec: ObjectTypeSpec<TParentStep, TFields>) => GrafastObjectType<TParentStep, TFields>;
/**
 * Saves us having to write `extensions: {grafast: {...}}` everywhere.
 */
export declare function objectFieldSpec<TSource extends Step, TResult extends Step = Step, TArgs extends BaseGraphQLArguments = BaseGraphQLArguments>(grafastSpec: GrafastFieldConfig<GraphQLOutputType, TSource, TResult, TArgs>, path: string): GraphQLFieldConfig<any, TArgs>;
/**
 * "Constrainted identity function" for field configs.
 *
 * @see {@link https://kentcdodds.com/blog/how-to-write-a-constrained-identity-function-in-typescript}
 */
export declare function newGrafastFieldConfigBuilder<TParentStep extends Step>(): <TType extends GraphQLOutputType, TFieldStep extends OutputPlanForType<TType>, TArgs extends BaseGraphQLArguments>(config: GrafastFieldConfig<TType, TParentStep, TFieldStep, TArgs>) => typeof config;
export type GrafastInputFieldConfigMap<TParent> = {
    [key: string]: GrafastInputFieldConfig<TParent, GraphQLInputType>;
};
export type InputObjectTypeSpec<TParent> = Omit<GraphQLInputObjectTypeConfig, "fields"> & {
    fields: GrafastInputFieldConfigMap<TParent> | (() => GrafastInputFieldConfigMap<TParent>);
};
export type GrafastInputObjectType<TParent> = graphql.GraphQLInputObjectType & {
    TParent: TParent;
};
export declare function newInputObjectTypeBuilder<TParent = any>(): (spec: InputObjectTypeSpec<TParent>) => GrafastInputObjectType<TParent>;
/**
 * Saves us having to write `extensions: {grafast: {...}}` everywhere.
 */
export declare function inputObjectFieldSpec<TParent>(grafastSpec: GrafastInputFieldConfig<TParent, GraphQLInputType>, path: string): GraphQLInputFieldConfig;
declare module "graphql" {
    interface GraphQLEnumType {
        [$$valueConfigByValue]?: Record<string, GraphQLEnumValueConfig>;
    }
}
declare const $$valueConfigByValue: unique symbol;
export declare function getEnumValueConfigs(enumType: graphql.GraphQLEnumType): {
    [outputValue: string]: GraphQLEnumValueConfig | undefined;
};
/**
 * This would be equivalent to `enumType._valueLookup.get(outputValue)` except
 * that's not a public API so we have to do a bit of heavy lifting here. Since
 * it is heavy lifting, we cache the result, but we don't know when enumType
 * will go away so we use a weakmap.
 */
export declare function getEnumValueConfig(enumType: graphql.GraphQLEnumType, outputValue: string): GraphQLEnumValueConfig | undefined;
/**
 * Ridiculously, this is faster than `new Array(length).fill(fill)`
 */
export declare function arrayOfLength(length: number, fill?: any): any[];
export declare const valueNodeToStaticValue: typeof graphql.valueFromAST;
export declare function findVariableNamesUsedInValueNode(valueNode: ValueNode, variableNames: Set<string>): void;
/**
 * Given a FieldNode, recursively walks and finds all the variable references,
 * returning a list of the (unique) variable names used.
 */
export declare function findVariableNamesUsed(operationPlan: OperationPlan, field: FieldNode): string[];
export declare function isTypePlanned(schema: GraphQLSchema, namedType: GraphQLNamedType): boolean;
/**
 * Returns `true` if the first argument depends on the second argument either
 * directly or indirectly (via a chain of dependencies).
 */
export declare function stepADependsOnStepB(stepA: Step, stepB: Step): boolean;
/**
 * Returns true if stepA is allowed to depend on stepB, false otherwise. (This
 * mostly relates to heirarchy.)
 */
export declare function stepAMayDependOnStepB($a: Step, $b: Step): boolean;
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
export declare function stepsAreInSamePhase(ancestor: Step, descendent: Step): boolean;
export declare const canonicalJSONStringify: (o: object) => string;
export declare function assertNotAsync(fn: any, name: string): void;
export declare function assertNotPromise<TVal>(value: TVal, fn: any, name: string): TVal;
export declare function hasItemPlan(step: Step & {
    itemPlan?: ($item: Step) => Step;
}): step is Step & {
    itemPlan: ($item: Step) => Step;
};
export declare function exportNameHint(obj: any, nameHint: string): void;
export declare function isTuple<T extends readonly [...(readonly any[])]>(t: any | T): t is T;
/**
 * Turns an array of keys into a digest, avoiding conflicts.
 * Symbols are treated as equivalent. (Theoretically faster
 * than JSON.stringify().)
 */
export declare function digestKeys(keys: ReadonlyArray<string | number | symbol>): string;
/**
 * If the directive has the argument `argName`, return a step representing that
 * arguments value, whether that be a step representing the relevant variable
 * or a constant step representing the hardcoded value in the document.
 *
 * @remarks NOT SUITABLE FOR USAGE WITH LISTS OR OBJECTS! Does not evaluate
 * internal variable usages e.g. `[1, $b, 3]`
 */
export declare function directiveArgument<T>(operationPlan: OperationPlan, directive: DirectiveNode, argName: string, expectedKind: graphql.Kind.INT | graphql.Kind.FLOAT | graphql.Kind.BOOLEAN | graphql.Kind.STRING): Step<T> | undefined;
export {};
//# sourceMappingURL=utils.d.ts.map