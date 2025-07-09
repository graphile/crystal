import type { GraphQLScalarType, ListValueNode, ObjectValueNode } from "graphql";
import type { UnbatchedExecutionExtra } from "../interfaces.js";
import { UnbatchedStep } from "../step.js";
/**
 * Handles "leaves" (scalars)
 */
export declare class __InputDynamicScalarStep<TLeaf = any> extends UnbatchedStep<TLeaf> {
    private value;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private variableNames;
    constructor(inputType: GraphQLScalarType, value: ListValueNode | ObjectValueNode);
    valueFromValues(variableValues: any[]): any;
    unbatchedExecute: (_extra: UnbatchedExecutionExtra, ...variableValues: any[]) => TLeaf;
}
//# sourceMappingURL=__inputDynamicScalar.d.ts.map