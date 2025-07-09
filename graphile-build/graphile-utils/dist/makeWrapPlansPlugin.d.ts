import type { FieldArgs, FieldInfo, FieldPlanResolver, GrafastFieldConfig } from "grafast";
type ToOptional<T> = {
    [K in keyof T]+?: T[K];
};
type SmartFieldPlanResolver = (...args: ToOptional<Parameters<FieldPlanResolver<any, any, any>>>) => ReturnType<FieldPlanResolver<any, any, any>>;
export type PlanWrapperFn = (plan: SmartFieldPlanResolver, $source: import("grafast").ExecutableStep, fieldArgs: FieldArgs, info: FieldInfo) => any;
export interface PlanWrapperRule {
    plan?: PlanWrapperFn;
}
export interface PlanWrapperRules {
    [typeName: string]: {
        [fieldName: string]: PlanWrapperRule | PlanWrapperFn;
    };
}
export type PlanWrapperRulesGenerator = (build: Partial<GraphileBuild.Build> & GraphileBuild.BuildBase) => PlanWrapperRules;
export type PlanWrapperFilter<T> = (context: GraphileBuild.ContextObjectFieldsField, build: GraphileBuild.Build, field: GrafastFieldConfig<any, any, any, any>) => T | null;
export type PlanWrapperFilterRule<T> = (match: T) => PlanWrapperRule | PlanWrapperFn;
export declare function makeWrapPlansPlugin(rulesOrGenerator: PlanWrapperRules | PlanWrapperRulesGenerator): GraphileConfig.Plugin;
export declare function makeWrapPlansPlugin<T>(filter: PlanWrapperFilter<T>, rule: PlanWrapperFilterRule<T>): GraphileConfig.Plugin;
export {};
//# sourceMappingURL=makeWrapPlansPlugin.d.ts.map