import type { GraphQLObjectType } from "graphql";
import type { Maybe, NodeIdHandler, PolymorphicData, UnbatchedExecutionExtra } from "../interfaces.js";
import type { PolymorphicStep, Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
/**
 * A plan to get a Node by its global object identifier (string). Accepts an
 * object specifying the supported codecs, an object map detailing the
 * typeNames supported and their details (codec to use, how to find the record,
 * etc), and finally the Node id string plan.
 */
export declare class NodeStep extends UnbatchedStep implements PolymorphicStep {
    private possibleTypes;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    allowMultipleOptimizations: boolean;
    private specPlanDep;
    constructor(possibleTypes: {
        [typeName: string]: NodeIdHandler;
    }, $id: Step<string | null | undefined>);
    planForType(type: GraphQLObjectType): Step;
    private getTypeNameFromSpecifier;
    unbatchedExecute: (_extra: UnbatchedExecutionExtra, specifier: any) => PolymorphicData<string, ReadonlyArray<any>> | null;
}
/**
 * A plan to get a Node by its global object identifier (string). Accepts an
 * object specifying the supported codecs, an object map detailing the
 * typeNames supported and their details (codec to use, how to find the record,
 * etc), and finally the Node id string plan.
 */
export declare function node(possibleTypes: {
    [typeName: string]: NodeIdHandler;
}, $id: Step<string | null | undefined>): NodeStep;
export declare function specFromNodeId(handler: NodeIdHandler<any>, $id: Step<Maybe<string>>): any;
export declare function nodeIdFromNode(handler: NodeIdHandler<any>, $node: Step): import("./lambda.js").LambdaStep<any, string | null>;
export declare function makeDecodeNodeIdRuntime(handlers: readonly NodeIdHandler[]): {
    (raw: string | null | undefined): {
        [codecName: string]: any;
    } | null;
    isSyncAndSafe: boolean;
};
export declare function makeDecodeNodeId(handlers: readonly NodeIdHandler[]): ($id: Step<string | null | undefined>) => import("./lambda.js").LambdaStep<string | null | undefined, {
    [codecName: string]: any;
} | null>;
//# sourceMappingURL=node.d.ts.map