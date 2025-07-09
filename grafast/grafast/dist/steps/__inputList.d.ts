import type { GraphQLInputType } from "graphql";
import * as graphql from "graphql";
import type { AnyInputStep, NotVariableValueNode } from "../interfaces.js";
import { Step } from "../step.js";
/**
 * Implements `__InputListStep`.
 */
export declare class __InputListStep<TInputType extends graphql.GraphQLList<GraphQLInputType> = graphql.GraphQLList<GraphQLInputType>> extends Step {
    private readonly inputValues;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private itemCount;
    constructor(inputType: TInputType, inputValues: NotVariableValueNode | undefined);
    optimize(): Step;
    execute(): any[];
    unbatchedExecute: () => any;
    at(index: number): AnyInputStep;
}
//# sourceMappingURL=__inputList.d.ts.map