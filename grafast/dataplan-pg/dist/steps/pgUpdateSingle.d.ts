import type { ExecutionDetails, GrafastResultsList, Maybe, Setter, SetterCapable } from "grafast";
import { Step } from "grafast";
import type { SQL, SQLable } from "pg-sql2";
import { $$toSQL } from "pg-sql2";
import type { PgResource } from "../datasource.js";
import type { GetPgResourceAttributes, GetPgResourceCodec, GetPgResourceUniques, ObjectForResource, PgCodecWithAttributes, PgQueryBuilder, PlanByUniques, ReadonlyArrayOrDirect } from "../interfaces.js";
import type { PgClassExpressionStep } from "./pgClassExpression.js";
/**
 * Update a single row identified by the 'getBy' argument.
 */
export declare class PgUpdateSingleStep<TResource extends PgResource<any, any, any, any, any> = PgResource> extends Step<unknown[]> implements SQLable {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    /**
     * Tells us what we're dealing with - data type, columns, where to update it,
     * what it's called, etc.
     */
    readonly resource: TResource;
    /**
     * This defaults to the name of the resource but you can override it. Aids
     * in debugging.
     */
    private readonly name;
    /**
     * To be used as the table alias, we always use a symbol unless the calling
     * code specifically indicates a string to use.
     */
    private readonly symbol;
    /** = sql.identifier(this.symbol) */
    readonly alias: SQL;
    /**
     * The attributes and their dependency ids for us to find the record by.
     */
    private getBys;
    /**
     * The attributes and their dependency ids for us to update.
     */
    private attributes;
    /**
     * The id for the PostgreSQL context plan.
     */
    private contextId;
    /**
     * When locked, no more values can be set, no more selects can be added
     */
    private locked;
    /**
     * When finalized, we build the SQL query, queryValues, and note where to feed in
     * the relevant queryValues. This saves repeating this work at execution time.
     */
    private finalizeResults;
    /**
     * The list of things we're selecting.
     */
    private selects;
    private applyDepIds;
    constructor(resource: TResource, getBy: PlanByUniques<GetPgResourceAttributes<TResource>, GetPgResourceUniques<TResource>>, attributes?: {
        [key in keyof GetPgResourceAttributes<TResource>]?: Step;
    });
    toStringMeta(): string | null;
    set<TKey extends keyof GetPgResourceAttributes<TResource>>(name: TKey, value: Step): void;
    /**
     * Returns a plan representing a named attribute (e.g. column) from the newly
     * updateed row.
     */
    get<TAttr extends keyof GetPgResourceAttributes<TResource>>(attr: TAttr): PgClassExpressionStep<GetPgResourceAttributes<TResource>[TAttr]["codec"], TResource>;
    getMeta(key: string): import("grafast").AccessStep<unknown>;
    record(): PgClassExpressionStep<GetPgResourceCodec<TResource>, TResource>;
    apply($step: Step<ReadonlyArrayOrDirect<Maybe<PgUpdateSingleQueryBuilderCallback>>>): void;
    /**
     * `execute` will always run as a root-level query. In future we'll implement a
     * `toSQL` method that allows embedding this plan within another SQL plan...
     * But that's a problem for later.
     *
     * This runs the query for every entry in the values, and then returns an
     * array of results where each entry in the results relates to the entry in
     * the incoming values.
     *
     * NOTE: we don't know what the values being fed in are, we must feed them to
     * the plans stored in this.identifiers to get actual values we can use.
     */
    execute({ indexMap, values, }: ExecutionDetails): Promise<GrafastResultsList<any>>;
    finalize(): void;
    [$$toSQL](): SQL;
}
/**
 * Update a single row identified by the 'getBy' argument.
 */
export declare function pgUpdateSingle<TResource extends PgResource<any, any, any, any>>(resource: TResource, getBy: PlanByUniques<GetPgResourceAttributes<TResource>, GetPgResourceUniques<TResource>>, attributes?: {
    [key in keyof GetPgResourceAttributes<TResource>]?: Step;
}): PgUpdateSingleStep<TResource>;
export interface PgUpdateSingleQueryBuilder<TResource extends PgResource<any, PgCodecWithAttributes, any, any, any> = PgResource<any, PgCodecWithAttributes, any, any, any>> extends PgQueryBuilder, SetterCapable<ObjectForResource<TResource>> {
    set<TAttributeName extends keyof ObjectForResource<TResource>>(key: TAttributeName, value: ObjectForResource<TResource>[TAttributeName]): void;
    setBuilder(): Setter<ObjectForResource<TResource>, this>;
}
type PgUpdateSingleQueryBuilderCallback = (qb: PgUpdateSingleQueryBuilder) => void;
export {};
//# sourceMappingURL=pgUpdateSingle.d.ts.map