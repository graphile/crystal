import type { Bucket } from "../bucket.js";
import type { BatchExecutionValue, ExecutionEntryFlags, UnaryExecutionValue } from "../interfaces.js";
export declare function bucketToString(this: Bucket): string;
export declare function batchExecutionValue<TData>(entries: TData[], _flags?: ExecutionEntryFlags[]): BatchExecutionValue<TData>;
export declare function unaryExecutionValue<TData>(value: TData, _entryFlags?: ExecutionEntryFlags): UnaryExecutionValue<TData>;
//# sourceMappingURL=executeBucket.d.ts.map