import type { GraphQLInputObjectType } from "graphql";
import type { AnyInputStep, NotVariableValueNode, UnbatchedExecutionExtra } from "../interfaces.js";
import { UnbatchedStep } from "../step.js";
/**
 * Implements `InputObjectStep`
 */
export declare class __InputObjectStep<TInputType extends GraphQLInputObjectType = GraphQLInputObjectType> extends UnbatchedStep {
    private inputObjectType;
    private inputValues;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private inputFields;
    constructor(inputObjectType: TInputType, inputValues: NotVariableValueNode | undefined);
    optimize(): import("./constant.js").ConstantStep<null> | this;
    finalize(): void;
    unbatchedExecute(_extra: UnbatchedExecutionExtra, ...values: any[]): any;
    get(attrName: string): AnyInputStep;
}
export type __InputObjectStepWithDollars<TInputType extends GraphQLInputObjectType = GraphQLInputObjectType> = __InputObjectStep<TInputType> & {
    [key in keyof ReturnType<TInputType["getFields"]> & string as `$${key}`]: AnyInputStep;
};
//# sourceMappingURL=__inputObject.d.ts.map