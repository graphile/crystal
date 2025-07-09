import type { GraphQLInputObjectType, GraphQLInputType, VariableDefinitionNode } from "graphql";
import { GraphQLList, GraphQLNonNull } from "graphql";
import type { Constraint } from "../constraints.js";
import type { ExecutionDetails, GrafastResultsList, UnbatchedExecutionExtra } from "../interfaces.js";
import { UnbatchedStep } from "../step.js";
import type { __ValueStep } from "./__value.js";
import type { AccessStep } from "./access.js";
/**
 * Implements the `__TrackedValueStep(operationPlan, object, constraints, path)`
 * algorithm used to allow runtime AND plan-time access to the three special
 * entities: `variableValues`, `rootValue` and `context`.
 *
 * ExecutableStep-time access can evaluate the `object` passed to the constructor, and
 * will add constraints to the relevant operationPlan.variableValuesConstraints,
 * operationPlan.rootValueConstraints or operationPlan.contextConstraints to
 * ensure that all future variableValues, rootValues and context will match the
 * assumptions made.
 *
 * Run-time access will see the runtime values of these properties, it will
 * **NOT** reference the `object` passed to the constructor.
 *
 * In core this will be used for evaluating `@skip`, `@include`, `@defer` and
 * `@stream` directives so that a different OpPlan will be used if these would
 * change the query plan, but it can also be used within plan resolvers to
 * branch the logic of a plan based on something in these entities.
 */
export declare class __TrackedValueStep<TData = any, TInputType extends GraphQLInputType | ReadonlyArray<VariableDefinitionNode> | undefined = undefined> extends UnbatchedStep<TData> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    /**
     * Could be anything. In the case of context it could even have exotic
     * entries such as `pgClient`.
     */
    private readonly value;
    /**
     * The path that we are through the original value (the one that
     * `constraints` relates to).
     */
    private readonly path;
    static withGraphQLType<TInputType extends GraphQLInputType, TData = any>(value: TData | undefined, valuePlan: __ValueStep<TData> | AccessStep<TData>, constraints: Constraint[], path: Array<string | number> | undefined, graphqlType: TInputType): __TrackedValueStepWithDollars<TData, TInputType>;
    private nullableGraphQLType;
    private variableDefinitions;
    execute({ count, values: [values0], }: ExecutionDetails<[TData]>): GrafastResultsList<TData>;
    unbatchedExecute(_extra: UnbatchedExecutionExtra, v: TData): TData;
    private getValuePlan;
    /**
     * Get the named property of an object.
     */
    get<TAttribute extends keyof TData & string>(attrName: TAttribute): __TrackedValueStepWithDollars<TData[TAttribute], TInputType extends GraphQLInputObjectType ? ReturnType<TInputType["getFields"]>[TAttribute]["type"] : undefined>;
    /**
     * Get the entry at the given index in an array.
     */
    at<TIndex extends keyof TData & number>(index: TIndex): __TrackedValueStepWithDollars<TData[TIndex], TInputType extends GraphQLList<infer U> ? U & GraphQLInputType : TInputType extends GraphQLNonNull<GraphQLList<infer U>> ? U & GraphQLInputType : undefined>;
    optimize(): import("../step.js").Step<any> | import("./__flag.js").__FlagStep<import("../step.js").Step<any>>;
}
export type __TrackedValueStepWithDollars<TData = any, TInputType extends GraphQLInputType | undefined = undefined> = __TrackedValueStep<TData, TInputType> & (TInputType extends GraphQLInputObjectType ? {
    [key in keyof ReturnType<TInputType["getFields"]> & string as `$${key}`]: __TrackedValueStepWithDollars<TData extends {
        [k in key]: infer U;
    } ? U : any, ReturnType<TInputType["getFields"]>[key]["type"]>;
} : Record<string, never>);
//# sourceMappingURL=__trackedValue.d.ts.map