import type { ExecutionDetails, GrafastResultsList } from "../interfaces.js";
import { UnbatchedStep } from "../step.js";
export declare class ErrorStep<TError extends Error> extends UnbatchedStep<never> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    error: TError;
    constructor(error: TError);
    execute({ count }: ExecutionDetails): GrafastResultsList<any>;
    unbatchedExecute(): any;
}
export declare function error<TError extends Error>(error: TError): ErrorStep<TError>;
//# sourceMappingURL=error.d.ts.map