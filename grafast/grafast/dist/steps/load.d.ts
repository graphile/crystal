import type { __ItemStep, ExecutionDetails } from "../index.js";
import type { GrafastResultsList, Maybe, PromiseOrDirect } from "../interfaces.js";
import type { Multistep, UnwrapMultistep } from "../multistep.js";
import { Step } from "../step.js";
export interface LoadOptions<TItem, TParams extends Record<string, any>, TUnarySpec = never> {
    unary: TUnarySpec;
    attributes: ReadonlyArray<keyof TItem>;
    params: Partial<TParams>;
}
type LoadCallback<TSpec, TItem, TData extends TItem | ReadonlyArray<TItem>, TParams extends Record<string, any>, TUnarySpec = never> = {
    (specs: ReadonlyArray<TSpec>, options: LoadOptions<TItem, TParams, TUnarySpec>): PromiseOrDirect<ReadonlyArray<Maybe<TData>>>;
    displayName?: string;
};
export type LoadOneCallback<TSpec, TItem, TParams extends Record<string, any>, TUnarySpec = never> = LoadCallback<TSpec, TItem, TItem, TParams, TUnarySpec>;
export type LoadManyCallback<TSpec, TItem, TParams extends Record<string, any>, TUnarySpec = never> = LoadCallback<TSpec, TItem, ReadonlyArray<TItem>, TParams, TUnarySpec>;
/**
 * A TypeScript Identity Function to help you strongly type your
 * LoadOneCallback.
 */
export declare function loadOneCallback<TSpec, TItem, TParams extends Record<string, any>, TUnarySpec = never>(callback: LoadOneCallback<TSpec, TItem, TParams, TUnarySpec>): LoadOneCallback<TSpec, TItem, TParams, TUnarySpec>;
/**
 * A TypeScript Identity Function to help you strongly type your
 * LoadManyCallback.
 */
export declare function loadManyCallback<TSpec, TItem, TParams extends Record<string, any>, TUnarySpec = never>(callback: LoadManyCallback<TSpec, TItem, TParams, TUnarySpec>): LoadManyCallback<TSpec, TItem, TParams, TUnarySpec>;
/**
 * You shouldn't create instances of this yourself - use `loadOne` or `loadMany` instead.
 */
export declare class LoadedRecordStep<TItem, TParams extends Record<string, any> = Record<string, any>> extends Step<TItem> {
    private isSingle;
    private sourceDescription;
    private ioEquivalence;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    attributes: Set<keyof TItem>;
    params: Partial<TParams>;
    constructor($data: Step<TItem>, isSingle: boolean, sourceDescription: string, ioEquivalence: Record<string, Step>);
    toStringMeta(): string;
    get(attr: keyof TItem & (string | number)): Step<any>;
    private _getInner;
    setParam<TParamKey extends keyof TParams>(paramKey: TParamKey, value: TParams[TParamKey]): void;
    optimize(): Step<any> | import("./__flag.js").__FlagStep<Step<any>>;
    execute({ count, values: [values0], }: ExecutionDetails<[TItem]>): GrafastResultsList<TItem>;
}
export declare class LoadStep<const TMultistep extends Multistep, TItem, TData extends TItem | ReadonlyArray<TItem>, TParams extends Record<string, any>, const TUnaryMultistep extends Multistep = never> extends Step {
    private ioEquivalence;
    private load;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    loadOptions: Omit<LoadOptions<TItem, TParams, UnwrapMultistep<TUnaryMultistep>>, "unary"> | null;
    loadOptionsKey: string;
    attributes: Set<keyof TItem>;
    params: Partial<TParams>;
    unaryDepId: number | null;
    constructor(spec: TMultistep, unarySpec: TUnaryMultistep | null, ioEquivalence: IOEquivalence<TMultistep>, load: LoadCallback<UnwrapMultistep<TMultistep>, TItem, TData, TParams, UnwrapMultistep<TUnaryMultistep>>);
    toStringMeta(): string;
    private makeAccessMap;
    listItem($item: __ItemStep<TItem>): LoadedRecordStep<TItem, TParams>;
    single(): TData extends ReadonlyArray<any> ? never : LoadedRecordStep<TItem, TParams>;
    setParam<TParamKey extends keyof TParams>(paramKey: TParamKey, value: TParams[TParamKey]): void;
    addAttributes(attributes: Set<keyof TItem>): void;
    finalize(): void;
    execute({ count, values: [values0, values1], extra, }: ExecutionDetails<[
        UnwrapMultistep<TMultistep>,
        UnwrapMultistep<TUnaryMultistep>
    ]>): PromiseOrDirect<GrafastResultsList<Maybe<TData>>>;
}
export declare function loadMany<const TMultistep extends Multistep, TItem, TParams extends Record<string, any> = Record<string, any>, const TUnaryMultistep extends Multistep = never>(spec: TMultistep, loadCallback: LoadManyCallback<UnwrapMultistep<TMultistep>, TItem, TParams, UnwrapMultistep<TUnaryMultistep>>): LoadStep<UnwrapMultistep<TMultistep>, TItem, ReadonlyArray<TItem>, TParams, UnwrapMultistep<TUnaryMultistep>>;
export declare function loadMany<const TMultistep extends Multistep, TItem, TParams extends Record<string, any> = Record<string, any>, const TUnaryMultistep extends Multistep = never>(spec: TMultistep, ioEquivalence: IOEquivalence<TMultistep>, loadCallback: LoadManyCallback<UnwrapMultistep<TMultistep>, TItem, TParams, UnwrapMultistep<TUnaryMultistep>>): LoadStep<UnwrapMultistep<TMultistep>, TItem, ReadonlyArray<TItem>, TParams, UnwrapMultistep<TUnaryMultistep>>;
export declare function loadMany<const TMultistep extends Multistep, TItem, TParams extends Record<string, any> = Record<string, any>, const TUnaryMultistep extends Multistep = never>(spec: TMultistep, unarySpec: TUnaryMultistep | null, loadCallback: LoadManyCallback<UnwrapMultistep<TMultistep>, TItem, TParams, UnwrapMultistep<TUnaryMultistep>>): LoadStep<UnwrapMultistep<TMultistep>, TItem, ReadonlyArray<TItem>, TParams, UnwrapMultistep<TUnaryMultistep>>;
export declare function loadMany<const TMultistep extends Multistep, TItem, TParams extends Record<string, any> = Record<string, any>, const TUnaryMultistep extends Multistep = never>(spec: TMultistep, unarySpec: TUnaryMultistep | null, ioEquivalence: IOEquivalence<TMultistep>, loadCallback: LoadManyCallback<UnwrapMultistep<TMultistep>, TItem, TParams, UnwrapMultistep<TUnaryMultistep>>): LoadStep<UnwrapMultistep<TMultistep>, TItem, ReadonlyArray<TItem>, TParams, UnwrapMultistep<TUnaryMultistep>>;
type IOEquivalence<TMultistep extends Multistep> = null | string | (UnwrapMultistep<TMultistep> extends readonly [...(readonly any[])] ? {
    [key in Exclude<keyof UnwrapMultistep<TMultistep>, keyof any[]>]: string | null;
} : UnwrapMultistep<TMultistep> extends Record<string, any> ? {
    [key in keyof UnwrapMultistep<TMultistep>]?: string | null;
} : never);
export declare function loadOne<const TMultistep extends Multistep, TItem, TParams extends Record<string, any> = Record<string, any>, const TUnaryMultistep extends Multistep = never>(spec: TMultistep, loadCallback: LoadOneCallback<UnwrapMultistep<TMultistep>, TItem, TParams, UnwrapMultistep<TUnaryMultistep>>): LoadedRecordStep<TItem, TParams>;
export declare function loadOne<const TMultistep extends Multistep, TItem, TParams extends Record<string, any> = Record<string, any>, const TUnaryMultistep extends Multistep = never>(spec: TMultistep, ioEquivalence: IOEquivalence<TMultistep>, loadCallback: LoadOneCallback<UnwrapMultistep<TMultistep>, TItem, TParams, UnwrapMultistep<TUnaryMultistep>>): LoadedRecordStep<TItem, TParams>;
export declare function loadOne<const TMultistep extends Multistep, TItem, TParams extends Record<string, any> = Record<string, any>, const TUnaryMultistep extends Multistep = never>(spec: TMultistep, unarySpec: TUnaryMultistep | null, loadCallback: LoadOneCallback<UnwrapMultistep<TMultistep>, TItem, TParams, UnwrapMultistep<TUnaryMultistep>>): LoadedRecordStep<TItem, TParams>;
export declare function loadOne<const TMultistep extends Multistep, TItem, TParams extends Record<string, any> = Record<string, any>, const TUnaryMultistep extends Multistep = never>(spec: TMultistep, unarySpec: TUnaryMultistep | null, ioEquivalence: IOEquivalence<TMultistep>, loadCallback: LoadOneCallback<UnwrapMultistep<TMultistep>, TItem, TParams, UnwrapMultistep<TUnaryMultistep>>): LoadedRecordStep<TItem, TParams>;
export {};
//# sourceMappingURL=load.d.ts.map