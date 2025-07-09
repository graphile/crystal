import type { GraphQLInputObjectType, GraphQLInputType, GraphQLList, GraphQLSchema } from "graphql";
import type { UnbatchedExecutionExtra } from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
export declare class BakedInputStep<TData = any> extends UnbatchedStep<TData> {
    private inputType;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    valueDepId: 0;
    constructor(inputType: GraphQLInputObjectType | GraphQLList<any>, $value: Step);
    deduplicate(peers: readonly BakedInputStep[]): BakedInputStep<any>[];
    unbatchedExecute(extra: UnbatchedExecutionExtra, value: unknown): TData;
}
/**
 * Takes a input type and matching value and performs runtime conversion of
 * that type to the internal representation (if any).
 */
export declare function bakedInput<TArg = any>(inputType: GraphQLInputType, $value: Step): Step<any>;
export declare function bakedInputRuntime(schema: GraphQLSchema, inputType: GraphQLInputType, value: unknown): unknown;
//# sourceMappingURL=bakedInput.d.ts.map