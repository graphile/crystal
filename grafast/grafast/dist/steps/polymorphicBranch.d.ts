import type { GraphQLObjectType } from "graphql";
import type { ExecutionDetails, GrafastResultsList, PromiseOrDirect } from "../index.js";
import type { PolymorphicStep } from "../step.js";
import { Step } from "../step.js";
type StepData<TStep extends Step> = TStep extends Step<infer U> ? U : any;
export interface PolymorphicBranchMatchers<TStep extends Step> {
    [typeName: string]: PolymorphicBranchMatcher<TStep>;
}
export interface PolymorphicBranchMatcher<TStep extends Step> {
    match?: (obj: StepData<TStep>) => boolean;
    plan?: ($obj: TStep) => Step;
}
export declare class PolymorphicBranchStep<TStep extends Step> extends Step implements PolymorphicStep {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private typeNames;
    private matchers;
    constructor($step: TStep, matchers: PolymorphicBranchMatchers<TStep>);
    planForType(objectType: GraphQLObjectType): Step;
    execute({ indexMap, values: [values0], }: ExecutionDetails): PromiseOrDirect<GrafastResultsList<any>>;
}
export declare function polymorphicBranch<TStep extends Step>($step: TStep, matchers: PolymorphicBranchMatchers<TStep>): PolymorphicBranchStep<TStep>;
export {};
//# sourceMappingURL=polymorphicBranch.d.ts.map