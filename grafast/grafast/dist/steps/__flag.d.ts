import type { DataFromStep, ExecutionDetails, ExecutionEntryFlags, GrafastResultsList } from "../interfaces.js";
import { $$deepDepSkip } from "../interfaces.js";
import type { ListCapableStep } from "../step.js";
import { Step } from "../step.js";
import type { __ItemStep } from "./__item.js";
export declare const TRAP_ERROR: ExecutionEntryFlags;
export declare const TRAP_INHIBITED: ExecutionEntryFlags;
export declare const TRAP_ERROR_OR_INHIBITED: ExecutionEntryFlags;
declare const TRAP_VALUES: readonly ["NULL", "EMPTY_LIST", "PASS_THROUGH"];
/** @defaultValue `'PASS_THROUGH'` */
export type TrapValue = (typeof TRAP_VALUES)[number];
/** `false` means pass-through; all others are literal */
export type ResolvedTrapValue = false | null | undefined | readonly never[];
export interface FlagStepOptions {
    acceptFlags?: ExecutionEntryFlags;
    onReject?: Error | null;
    if?: Step<boolean>;
    valueForInhibited?: TrapValue;
    valueForError?: TrapValue;
}
export declare class __FlagStep<TStep extends Step> extends Step<DataFromStep<TStep>> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private ifDep;
    private forbiddenFlags;
    private onRejectReturnValue;
    private valueForInhibited;
    private valueForError;
    private canBeInlined;
    constructor(step: TStep, options: FlagStepOptions);
    toStringMeta(): string | null;
    [$$deepDepSkip](): Step;
    listItem?: ($item: __ItemStep<ListCapableStep<unknown, Step<unknown>>>) => Step;
    _listItem($item: __ItemStep<ListCapableStep<unknown, Step<unknown>>>): Step<unknown>;
    deduplicate(_peers: readonly Step<any>[]): readonly Step<any>[];
    execute(_details: ExecutionDetails<[data: DataFromStep<TStep>, cond?: boolean]>): GrafastResultsList<DataFromStep<TStep>>;
    finalize(): void;
    private fancyExecute;
    private passThroughExecute;
}
/**
 * Example use case: get user by id, but id is null: no need to fetch the user
 * since we know they won't exist.
 */
export declare function inhibitOnNull<TStep extends Step>($step: TStep, options?: {
    if?: FlagStepOptions["if"];
}): __FlagStep<TStep>;
/**
 * Example use case: expecting a node ID that represents a User, but get one
 * that represents a Post instead: throw error to tell user they've sent invalid
 * data.
 */
export declare function assertNotNull<TStep extends Step>($step: TStep, message: string, options?: {
    if?: FlagStepOptions["if"];
}): __FlagStep<TStep>;
export declare function trap<TStep extends Step>($step: TStep, acceptFlags: ExecutionEntryFlags, options?: {
    valueForInhibited?: FlagStepOptions["valueForInhibited"];
    valueForError?: FlagStepOptions["valueForError"];
    if?: FlagStepOptions["if"];
}): __FlagStep<TStep>;
export {};
//# sourceMappingURL=__flag.d.ts.map