import type { UnbatchedExecutionExtra } from "../interfaces.js";
import { UnbatchedStep } from "../step.js";
import type { __TrackedValueStep } from "./__trackedValue.js";
export declare class __InputDefaultStep extends UnbatchedStep {
    private defaultValue;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    constructor($variableValue: __TrackedValueStep, defaultValue: unknown);
    unbatchedExecute(_extra: UnbatchedExecutionExtra, variableValue: unknown): unknown;
}
//# sourceMappingURL=__inputDefault.d.ts.map