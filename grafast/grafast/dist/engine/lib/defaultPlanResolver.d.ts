import type { FieldPlanResolver } from "../../interfaces.js";
import type { Step } from "../../step.js";
export declare const defaultPlanResolver: FieldPlanResolver<any, Step & {
    get?: (field: string) => Step;
}, any>;
//# sourceMappingURL=defaultPlanResolver.d.ts.map