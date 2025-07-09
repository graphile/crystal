import type { ExecutionDetails, GrafastResultsList, UnbatchedExecutionExtra } from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
export type ActualKeyByDesiredKey = {
    [desiredKey: string]: string;
};
/**
 * A plan that returns an object resulting from extracting the given
 * `actualKey` from the input and storing it as the `desiredKey` in the output.
 */
export declare class RemapKeysStep extends UnbatchedStep {
    private readonly actualKeyByDesiredKey;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    allowMultipleOptimizations: boolean;
    private mapper;
    constructor($plan: Step, actualKeyByDesiredKey: ActualKeyByDesiredKey);
    toStringMeta(): string;
    optimize(): Step<any> | this;
    finalize(): void;
    execute({ count, values: [values0], }: ExecutionDetails): GrafastResultsList<any>;
    unbatchedExecute(_extra: UnbatchedExecutionExtra, value: any): any;
    deduplicate(peers: RemapKeysStep[]): RemapKeysStep[];
}
/**
 * A plan that returns an object resulting from extracting the given
 * `actualKey` from the input and storing it as the `desiredKey` in the output.
 */
export declare function remapKeys($step: Step, actualKeyByDesiredKey: {
    [desiredKey: string]: string;
}): RemapKeysStep;
//# sourceMappingURL=remapKeys.d.ts.map