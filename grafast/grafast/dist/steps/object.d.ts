import type { DataFromStep, ExecutionDetails, ExecutionExtra, StepOptimizeOptions, UnbatchedExecutionExtra } from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
import { ConstantStep } from "./constant.js";
export type DataFromObjectSteps<TSteps extends {
    [key: string]: Step;
}> = {
    [key in keyof TSteps]: DataFromStep<TSteps[key]>;
};
type Results<TSteps extends {
    [key: string]: Step;
}> = Array<[
    Array<DataFromObjectSteps<TSteps>[keyof TSteps]>,
    DataFromObjectSteps<TSteps>
]>;
export interface ObjectPlanMeta<TSteps extends {
    [key: string]: Step;
}> {
    results: Results<TSteps>;
}
interface ObjectStepCacheConfig {
    identifier?: string;
    cacheSize?: number;
}
/**
 * A plan that represents an object using the keys given and the values being
 * the results of the associated plans.
 */
export declare class ObjectStep<TPlans extends {
    [key: string]: Step;
} = {
    [key: string]: Step;
}> extends UnbatchedStep<DataFromObjectSteps<TPlans>> {
    private cacheConfig?;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    allowMultipleOptimizations: boolean;
    private readonly keys;
    optimizeMetaKey: string;
    private cacheSize;
    constructor(obj: TPlans, cacheConfig?: ObjectStepCacheConfig | undefined);
    private _setKeys;
    /**
     * This key doesn't get typed, but it can be added later which can be quite
     * handy.
     */
    set<TKey extends keyof TPlans>(key: TKey, plan: TPlans[TKey]): void;
    getStepForKey<TKey extends keyof TPlans>(key: TKey): TPlans[TKey];
    getStepForKey<TKey extends keyof TPlans>(key: TKey, allowMissing: true): TPlans[TKey] | null;
    toStringMeta(): string;
    tupleToObjectJIT(callback: (fn: (extra: ExecutionExtra, ...tuple: Array<DataFromObjectSteps<TPlans>[keyof TPlans]>) => DataFromObjectSteps<TPlans>) => void): void;
    finalize(): void;
    execute({ indexMap, values, extra, }: ExecutionDetails<Array<DataFromObjectSteps<TPlans>[keyof TPlans]>>): ReadonlyArray<DataFromObjectSteps<TPlans>>;
    unbatchedExecute(_extra: UnbatchedExecutionExtra, ..._values: any[]): any;
    deduplicate(peers: ObjectStep<any>[]): ObjectStep<TPlans>[];
    optimize(opts: StepOptimizeOptions): ConstantStep<any> | this | ConstantStep<Record<string, any>>;
    /**
     * Get the original plan with the given key back again.
     */
    get<TKey extends keyof TPlans>(key: TKey): TPlans[TKey];
}
/**
 * A plan that represents an object using the keys given and the values being
 * the results of the associated plans.
 */
export declare function object<TPlans extends {
    [key: string]: Step;
}>(obj: TPlans, cacheConfig?: ObjectStepCacheConfig): ObjectStep<TPlans>;
export {};
//# sourceMappingURL=object.d.ts.map