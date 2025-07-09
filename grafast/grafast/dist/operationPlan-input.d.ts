import type { GraphQLField, GraphQLInputType, GraphQLNullableType } from "graphql";
import type { OperationPlan } from "./engine/OperationPlan.js";
import type { FieldArgs, TrackedArguments } from "./interfaces.js";
import type { Step } from "./step.js";
export type ApplyAfterModeArg = "plan" | "subscribePlan";
export declare function withFieldArgsForArguments<T extends Step>(operationPlan: OperationPlan, $all: TrackedArguments, field: GraphQLField<any, any, any>, $parent: Step, applyAfterMode: ApplyAfterModeArg, coordinate: string, callback: (fieldArgs: FieldArgs) => T | null | undefined): Exclude<T, undefined | null> | null;
export declare function getNullableInputTypeAtPath(startType: GraphQLInputType, path: ReadonlyArray<string | number>): GraphQLInputType & GraphQLNullableType;
//# sourceMappingURL=operationPlan-input.d.ts.map