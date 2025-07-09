import type { Bucket, RequestTools } from "../bucket.js";
import type { OutputPlan } from "./OutputPlan.js";
export type OutputPath = Array<string | number>;
export interface OutputStream {
    asyncIterable: AsyncIterableIterator<any>;
}
export interface OutputPlanContext {
    requestContext: RequestTools;
    root: PayloadRoot;
    path: ReadonlyArray<string | number>;
}
export interface SubsequentPayloadSpec {
    root: PayloadRoot;
    path: ReadonlyArray<string | number>;
    bucket: Bucket;
    bucketIndex: number;
    outputPlan: OutputPlan;
    label: string | undefined;
}
export interface SubsequentStreamSpec {
    root: PayloadRoot;
    path: ReadonlyArray<string | number>;
    bucket: Bucket;
    bucketIndex: number;
    outputPlan: OutputPlan;
    label: string | undefined;
    stream: AsyncIterator<any> | Iterator<any>;
    startIndex: number;
}
//# sourceMappingURL=executeOutputPlan.d.ts.map