import type { ObjectStep } from "grafast";
import { ExecutableStep } from "grafast";
import type { SQL } from "pg-sql2";
import type { PgCodecAttributes, PgCodecAttributeVia, PgCodecAttributeViaExplicit } from "./codecs.js";
import type { PgExecutor, PgExecutorContextPlans } from "./executor.js";
import type { Expand, GetPgCodecAttributes, GetPgRegistryCodecRelations, GetPgRegistryCodecs, PgCodec, PgCodecRelationConfig, PgCodecWithAttributes, PgRefDefinition, PgRegistry, PgRegistryConfig, PlanByUniques } from "./interfaces.js";
import type { PgClassExpressionStep } from "./steps/pgClassExpression.js";
import type { PgSelectArgumentDigest, PgSelectArgumentSpec, PgSelectMode, PgSelectStep } from "./steps/pgSelect.js";
import type { PgSelectSinglePlanOptions, PgSelectSingleStep } from "./steps/pgSelectSingle.js";
export declare function EXPORTABLE<T, TScope extends any[]>(factory: (...args: TScope) => T, args: [...TScope], nameHint?: string): T;
/** @deprecated Use DataplanPg.PgResourceUniqueExtensions instead */
export type PgResourceUniqueExtensions = DataplanPg.PgResourceUniqueExtensions;
/** @deprecated Use DataplanPg.PgResourceExtensions instead */
export type PgResourceExtensions = DataplanPg.PgResourceExtensions;
/** @deprecated Use DataplanPg.PgResourceParameterExtensions instead */
export type PgResourceParameterExtensions = DataplanPg.PgResourceParameterExtensions;
/**
 * If this is a functional (rather than static) resource, this describes one of
 * the parameters it accepts.
 */
export interface PgResourceParameter<TName extends string | null = string | null, TCodec extends PgCodec = PgCodec> {
    /**
     * Name of the parameter, if null then we must use positional rather than
     * named arguments
     */
    name: TName;
    /**
     * The type of this parameter
     */
    codec: TCodec;
    /**
     * If true, then this parameter must be supplied, otherwise it's optional.
     */
    required: boolean;
    /**
     * If true and the parameter is supplied, then the parameter must not be
     * null.
     */
    notNull?: boolean;
    extensions?: PgResourceParameterExtensions;
}
/**
 * Description of a unique constraint on a PgResource.
 */
export interface PgResourceUnique<TAttributes extends PgCodecAttributes = PgCodecAttributes> {
    /**
     * The attributes that are unique
     */
    attributes: ReadonlyArray<keyof TAttributes & string>;
    /**
     * If this is true, this represents the "primary key" of the resource.
     */
    isPrimary?: boolean;
    description?: string;
    /**
     * Space for you to add your own metadata
     */
    extensions?: PgResourceUniqueExtensions;
}
export interface PgCodecRefPathEntry {
    relationName: string;
}
export type PgCodecRefPath = PgCodecRefPathEntry[];
/** @deprecated Use DataplanPg.PgCodecRefExtensions instead */
export type PgCodecRefExtensions = DataplanPg.PgCodecRefExtensions;
export interface PgCodecRef {
    definition: PgRefDefinition;
    paths: Array<PgCodecRefPath>;
    description?: string;
    extensions?: PgCodecRefExtensions;
}
export interface PgCodecRefs {
    [refName: string]: PgCodecRef;
}
/**
 * Configuration options for your PgResource
 */
export interface PgResourceOptions<TName extends string = string, TCodec extends PgCodec = PgCodec, TUniques extends ReadonlyArray<PgResourceUnique<GetPgCodecAttributes<TCodec>>> = ReadonlyArray<PgResourceUnique<GetPgCodecAttributes<TCodec>>>, TParameters extends readonly PgResourceParameter[] | undefined = readonly PgResourceParameter[] | undefined> {
    /**
     * The associated codec for this resource
     */
    codec: TCodec;
    /**
     * The PgExecutor to use when servicing this resource; different executors can
     * have different caching rules. A plan that uses one executor cannot be
     * inlined into a plan for a different executor.
     */
    executor: PgExecutor;
    selectAuth?: (($step: PgSelectStep<PgResource<any, any, any, any, any>>) => void) | null;
    name: TName;
    identifier?: string;
    from: TParameters extends readonly PgResourceParameter[] ? (...args: PgSelectArgumentDigest[]) => SQL : SQL;
    uniques?: TUniques;
    extensions?: PgResourceExtensions;
    parameters?: TParameters;
    description?: string;
    /**
     * Set true if this resource will only return at most one record - this is
     * generally only useful for PostgreSQL function resources, in which case you
     * should set it false if the function `returns setof` and true otherwise.
     */
    isUnique?: boolean;
    sqlPartitionByIndex?: SQL;
    isMutation?: boolean;
    hasImplicitOrder?: boolean;
    /**
     * If true, this indicates that this was originally a list (array) and thus
     * should be treated as having a predetermined and reasonable length rather
     * than being unbounded. It's just a hint to schema generation, it doesn't
     * affect planning.
     */
    isList?: boolean;
    /**
     * "Virtual" resources cannot be selected from/inserted to/etc, they're
     * normally used to generate other resources that are _not_ virtual.
     */
    isVirtual?: boolean;
}
export interface PgFunctionResourceOptions<TNewName extends string = string, TCodec extends PgCodec = PgCodec, TUniques extends ReadonlyArray<PgResourceUnique<GetPgCodecAttributes<TCodec>>> = ReadonlyArray<PgResourceUnique<GetPgCodecAttributes<TCodec>>>, TNewParameters extends readonly PgResourceParameter[] = readonly PgResourceParameter[]> {
    name: TNewName;
    identifier?: string;
    from: (...args: PgSelectArgumentDigest[]) => SQL;
    parameters: TNewParameters;
    returnsSetof: boolean;
    returnsArray: boolean;
    uniques?: TUniques;
    extensions?: PgResourceExtensions;
    isMutation?: boolean;
    hasImplicitOrder?: boolean;
    selectAuth?: (($step: PgSelectStep<PgResource<any, any, any, any, any>>) => void) | null;
    description?: string;
}
/**
 * PgResource represents any resource of SELECT-able data in Postgres: tables,
 * views, functions, etc.
 */
export declare class PgResource<TName extends string = string, TCodec extends PgCodec = PgCodec, TUniques extends ReadonlyArray<PgResourceUnique<GetPgCodecAttributes<TCodec>>> = ReadonlyArray<PgResourceUnique<GetPgCodecAttributes<TCodec>>>, TParameters extends readonly PgResourceParameter[] | undefined = readonly PgResourceParameter[] | undefined, TRegistry extends PgRegistry<any, any, any, any> = PgRegistry<any, any, any, any>> {
    readonly registry: TRegistry;
    readonly codec: TCodec;
    readonly executor: PgExecutor;
    readonly name: TName;
    readonly identifier: string;
    readonly from: SQL | ((...args: PgSelectArgumentDigest[]) => SQL);
    readonly uniques: TUniques;
    private selectAuth?;
    /**
     * If present, implies that the resource represents a `setof composite[]` (i.e.
     * an array of arrays) - and thus is not appropriate to use for GraphQL
     * Cursor Connections.
     *
     * @experimental
     */
    sqlPartitionByIndex: SQL | null;
    readonly parameters: TParameters;
    readonly description: string | undefined;
    readonly isUnique: boolean;
    readonly isMutation: boolean;
    readonly hasImplicitOrder: boolean;
    /**
     * If true, this indicates that this was originally a list (array) and thus
     * should be treated as having a predetermined and reasonable length rather
     * than being unbounded. It's just a hint to schema generation, it doesn't
     * affect planning.
     */
    readonly isList: boolean;
    /**
     * "Virtual" resources cannot be selected from/inserted to/etc, they're
     * normally used to generate other resources that are _not_ virtual.
     */
    readonly isVirtual: boolean;
    extensions: Partial<PgResourceExtensions> | undefined;
    /**
     * @param from - the SQL for the `FROM` clause (without any
     * aliasing). If this is a subquery don't forget to wrap it in parens.
     * @param name - a nickname for this resource. Doesn't need to be unique
     * (but should be). Used for making the SQL query and debug messages easier
     * to understand.
     */
    constructor(registry: TRegistry, options: PgResourceOptions<TName, TCodec, TUniques, TParameters>);
    /**
     * Often you can access table records from a table directly but also from a
     * view or materialized view.  This method makes it convenient to construct
     * multiple datasources that all represent the same underlying table
     * type/relations/etc.
     */
    static alternativeResourceOptions<TCodec extends PgCodec, const TNewUniques extends ReadonlyArray<PgResourceUnique<GetPgCodecAttributes<TCodec>>>, const TNewName extends string>(baseOptions: PgResourceOptions<any, TCodec, any, undefined>, overrideOptions: {
        name: TNewName;
        identifier?: string;
        from: SQL;
        uniques?: TNewUniques;
        extensions?: PgResourceExtensions;
    }): PgResourceOptions<TNewName, TCodec, TNewUniques, undefined>;
    /**
     * Often you can access table records from a table directly but also from a
     * number of functions. This method makes it convenient to construct multiple
     * datasources that all represent the same underlying table
     * type/relations/etc but pull their rows from functions.
     */
    static functionResourceOptions<TCodec extends PgCodec, const TNewParameters extends readonly PgResourceParameter[], const TNewUniques extends ReadonlyArray<PgResourceUnique<GetPgCodecAttributes<TCodec>>>, const TNewName extends string>(baseOptions: Pick<PgResourceOptions<any, TCodec, any, any>, "codec" | "executor" | "selectAuth">, overrideOptions: PgFunctionResourceOptions<TNewName, TCodec, TNewUniques, TNewParameters>): PgResourceOptions<TNewName, TCodec, TNewUniques, TNewParameters>;
    toString(): string;
    getRelations(): GetPgRegistryCodecRelations<TRegistry, TCodec>;
    getRelation<TRelationName extends keyof GetPgRegistryCodecRelations<TRegistry, TCodec>>(name: TRelationName): GetPgRegistryCodecRelations<TRegistry, TCodec>[TRelationName];
    resolveVia(via: PgCodecAttributeVia, attr: string): PgCodecAttributeViaExplicit;
    getReciprocal<TOtherCodec extends GetPgRegistryCodecs<TRegistry>, TOtherRelationName extends keyof GetPgRegistryCodecRelations<TRegistry, TOtherCodec>>(otherCodec: TOtherCodec, otherRelationName: TOtherRelationName): [
        relationName: keyof GetPgRegistryCodecRelations<TRegistry, TCodec>,
        relation: GetPgRegistryCodecRelations<TRegistry, TCodec>[keyof GetPgRegistryCodecRelations<TRegistry, TCodec>]
    ] | null;
    get(spec: PlanByUniques<GetPgCodecAttributes<TCodec>, TUniques>, _internalOptionsDoNotPass?: PgSelectSinglePlanOptions): GetPgCodecAttributes<TCodec> extends PgCodecAttributes ? PgSelectSingleStep<this> : PgClassExpressionStep<TCodec, this>;
    find(spec?: {
        [key in keyof GetPgCodecAttributes<TCodec>]?: ExecutableStep | string | number;
    }): PgSelectStep<this>;
    execute(args?: ReadonlyArray<PgSelectArgumentSpec>, mode?: PgSelectMode): ExecutableStep<unknown>;
    applyAuthorizationChecksToPlan($step: PgSelectStep<this>): void;
    /**
     * @deprecated Please use `.executor.context()` instead - all resources for the
     * same executor must use the same context to allow for SQL inlining, unions,
     * etc.
     */
    context(): ObjectStep<PgExecutorContextPlans>;
}
export interface PgRegistryBuilder<TCodecs extends {
    [name in string]: PgCodec<name, PgCodecAttributes | undefined, any, any, any, any, any>;
}, TResources extends {
    [name in string]: PgResourceOptions<name, PgCodec, ReadonlyArray<PgResourceUnique<PgCodecAttributes>>, readonly PgResourceParameter[] | undefined>;
}, TRelations extends {
    [codecName in keyof TCodecs]?: {
        [relationName in string]: PgCodecRelationConfig<PgCodec<string, PgCodecAttributes, any, any, undefined, any, undefined>, PgResourceOptions<any, PgCodecWithAttributes, any, any>>;
    };
}, TExecutors extends {
    [name in string]: PgExecutor<any>;
}> {
    getRegistryConfig(): PgRegistryConfig<Expand<TCodecs>, Expand<TResources>, Expand<TRelations>, Expand<TExecutors>>;
    addExecutor<const TExecutor extends PgExecutor>(codec: TExecutor): PgRegistryBuilder<TCodecs, TResources, TRelations, TExecutors & {
        [name in TExecutor["name"]]: TExecutor;
    }>;
    addCodec<const TCodec extends PgCodec>(codec: TCodec): PgRegistryBuilder<TCodecs & {
        [name in TCodec["name"]]: TCodec;
    }, TResources, TRelations, TExecutors>;
    addResource<const TResource extends PgResourceOptions<any, any, any, any>>(resource: TResource): PgRegistryBuilder<TCodecs & {
        [name in TResource["codec"]["name"]]: TResource["codec"];
    }, TResources & {
        [name in TResource["name"]]: TResource;
    }, TRelations, TExecutors>;
    addRelation<TCodec extends PgCodec, const TCodecRelationName extends string, const TRemoteResource extends PgResourceOptions<any, any, any, any>, const TCodecRelation extends Omit<PgCodecRelationConfig<TCodec, TRemoteResource>, "localCodec" | "remoteResourceOptions">>(codec: TCodec, relationName: TCodecRelationName, remoteResource: TRemoteResource, relation: TCodecRelation): PgRegistryBuilder<TCodecs, TResources, TRelations & {
        [codecName in TCodec["name"]]: {
            [relationName in TCodecRelationName]: TCodecRelation & {
                localCodec: TCodec;
                remoteResourceOptions: TRemoteResource;
            };
        };
    }, TExecutors>;
    build(): PgRegistry<Expand<TCodecs>, Expand<TResources>, Expand<TRelations>, Expand<TExecutors>>;
}
export declare function makeRegistry<TCodecs extends {
    [name in string]: PgCodec<name, PgCodecAttributes | undefined, any, any, any, any, any>;
}, TResourceOptions extends {
    [name in string]: PgResourceOptions<name, PgCodec, ReadonlyArray<PgResourceUnique<PgCodecAttributes<any>>>, readonly PgResourceParameter[] | undefined>;
}, TRelations extends {
    [codecName in keyof TCodecs]?: {
        [relationName in string]: PgCodecRelationConfig<PgCodec<string, PgCodecAttributes, any, any, undefined, any, undefined>, PgResourceOptions<any, PgCodecWithAttributes, any, any>>;
    };
}, TExecutors extends {
    [name in string]: PgExecutor;
}>(config: PgRegistryConfig<TCodecs, TResourceOptions, TRelations, TExecutors>): PgRegistry<TCodecs, TResourceOptions, TRelations, TExecutors>;
export declare function makeRegistryBuilder(): PgRegistryBuilder<{}, {}, {}, {}>;
export declare function makePgResourceOptions<const TResourceOptions extends PgResourceOptions<any, any, any, any>>(options: TResourceOptions): TResourceOptions;
//# sourceMappingURL=datasource.d.ts.map