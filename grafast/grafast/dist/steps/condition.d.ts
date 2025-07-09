import type { UnbatchedExecutionExtra } from "../interfaces.js";
import type { Step } from "../step.js";
import { UnbatchedStep } from "../step.js";
declare const unaryOperators: readonly ["null", "not null", "exists", "not exists"];
type UnaryOperator = (typeof unaryOperators)[number];
declare const binaryOperators: readonly ["===", "!=="];
type BinaryOperator = (typeof binaryOperators)[number];
type Operator = UnaryOperator | BinaryOperator;
export declare class ConditionStep extends UnbatchedStep<boolean> {
    private op;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    allowMultipleOptimizations: boolean;
    constructor(op: Operator, step1: Step, step2?: Step);
    toStringMeta(): string | null;
    finalize(): void;
    private makeUnbatchedExecute;
    unbatchedExecute(_extra: UnbatchedExecutionExtra, _value1: any, _value2: any): boolean;
}
type $Boolean = Step<boolean>;
declare function condition(op: "null", step: Step): $Boolean;
declare function condition(op: "not null", step: Step): $Boolean;
declare function condition(op: "exists", step: Step): $Boolean;
declare function condition(op: "not exists", step: Step): $Boolean;
declare function condition(op: "===", step1: Step, step2: Step): $Boolean;
declare function condition(op: "!==", step1: Step, step2: Step): $Boolean;
export { condition };
//# sourceMappingURL=condition.d.ts.map