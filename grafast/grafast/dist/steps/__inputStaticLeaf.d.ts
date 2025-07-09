import type { BooleanValueNode, EnumValueNode, FloatValueNode, GraphQLLeafType, IntValueNode, NullValueNode, StringValueNode } from "graphql";
import { UnbatchedStep } from "../step.js";
/**
 * Implements `InputStaticLeafStep`
 *
 * @see __InputDynamicScalarStep
 */
export declare class __InputStaticLeafStep<TLeaf = any> extends UnbatchedStep<TLeaf> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private readonly coercedValue;
    constructor(inputType: GraphQLLeafType, value: IntValueNode | FloatValueNode | StringValueNode | BooleanValueNode | NullValueNode | EnumValueNode | undefined);
    unbatchedExecute(): TLeaf;
    optimize(): import("./constant.js").ConstantStep<any>;
}
//# sourceMappingURL=__inputStaticLeaf.d.ts.map