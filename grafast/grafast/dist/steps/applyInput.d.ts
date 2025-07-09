import type { GraphQLInputType, GraphQLSchema } from "graphql";
import type { AnyInputStep, UnbatchedExecutionExtra } from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
import { ConstantStep } from "./index.js";
export declare class ApplyInputStep<TParent extends object = any, TTarget extends object = TParent> extends UnbatchedStep<(arg: TParent) => void> {
    private inputType;
    private getTargetFromParent;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    allowMultipleOptimizations: boolean;
    valueDepId: 0;
    constructor(inputType: GraphQLInputType, $value: AnyInputStep, getTargetFromParent: ((parent: TParent, inputValue: any) => TTarget | undefined | (() => TTarget)) | undefined);
    deduplicate(peers: readonly ApplyInputStep[]): ApplyInputStep<any, any>[];
    optimize(): this | ConstantStep<(parent: TParent) => void>;
    unbatchedExecute(extra: UnbatchedExecutionExtra, value: any): (parentThing: TParent) => void;
}
export declare function inputArgsApply<TArg extends object, TTarget extends object = TArg>(schema: GraphQLSchema, inputType: GraphQLInputType, parent: TArg, inputValue: unknown, getTargetFromParent: ((parent: TArg, inputValue: any) => TTarget | undefined | (() => TTarget)) | undefined): void;
export declare function applyInput<TParent extends object = any, TTarget extends object = TParent>(inputType: GraphQLInputType, $value: AnyInputStep, getTargetFromParent?: (parent: TParent, inputValue: any) => TTarget | undefined): ConstantStep<(parent: TParent) => void> | ApplyInputStep<TParent, TTarget>;
/**
 * Modifiers modify their parent (which may be another modifier or anything
 * else). First they gather all the requirements from their children (if any)
 * being applied to them, then they apply themselves to their parent. This
 * application is done through the `apply()` method.
 */
export declare abstract class Modifier<TParent> {
    protected readonly parent: TParent;
    static $$export: any;
    constructor(parent: TParent);
    /**
     * In this method, you should apply the changes to your `this.parent` plan
     */
    abstract apply(): void;
}
export declare function isModifier<TParent>(plan: any): plan is Modifier<TParent>;
export declare function assertModifier<TParent>(plan: any, pathDescription: string): asserts plan is Modifier<TParent>;
export type ApplyableExecutableStep<TArg extends object = any, TData = any> = Step<TData> & {
    apply($apply: Step<(arg: TArg) => void>): void;
};
export declare function isApplyableStep<TArg extends object = any, TData = any>(s: Step<TData>): s is ApplyableExecutableStep<TArg, TData>;
//# sourceMappingURL=applyInput.d.ts.map