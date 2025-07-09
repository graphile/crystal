import type { ExecutionDetails, GrafastResultsList, Maybe } from "grafast";
import { Step } from "grafast";
import type { SQL } from "pg-sql2";
import type { PgCodecWithAttributes, PgResource } from "../index.js";
import type { GetPgResourceAttributes, GetPgResourceCodec, GetPgResourceUniques, PgQueryBuilder, PlanByUniques, ReadonlyArrayOrDirect } from "../interfaces.js";
import type { PgClassExpressionStep } from "./pgClassExpression.js";
/**
 * Deletes a row in the database, can return columns from the deleted row.
 */
export declare class PgDeleteSingleStep<TResource extends PgResource<any, any, any, any, any> = PgResource> extends Step<unknown[]> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    /**
     * Tells us what we're dealing with - data type, columns, where to delete it
     * from, what it's called, etc.
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
     * The id for the PostgreSQL context plan.
     */
    private contextId;
    /**
     * When locked, no more selects can be added
     */
    private locked;
    /**
     * The list of things we're selecting.
     */
    private selects;
    private applyDepIds;
    constructor(resource: TResource, getBy: PlanByUniques<GetPgResourceAttributes<TResource>, GetPgResourceUniques<TResource>>);
    toStringMeta(): string | null;
    /**
     * Returns a plan representing a named attribute (e.g. column) from the newly
     * deleteed row.
     */
    get<TAttr extends keyof GetPgResourceAttributes<TResource>>(attr: TAttr): PgClassExpressionStep<GetPgResourceAttributes<TResource>[TAttr]["codec"], TResource>;
    getMeta(key: string): import("grafast").AccessStep<unknown>;
    record(): PgClassExpressionStep<GetPgResourceCodec<TResource>, TResource>;
    apply($step: Step<ReadonlyArrayOrDirect<Maybe<PgDeleteSingleQueryBuilderCallback>>>): void;
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
}
/**
 * Delete a row in `resource` identified by the `getBy` unique condition.
 */
export declare function pgDeleteSingle<TResource extends PgResource<any, any, any, any>>(resource: TResource, getBy: PlanByUniques<GetPgResourceAttributes<TResource>, GetPgResourceUniques<TResource>>): PgDeleteSingleStep<TResource>;
export interface PgDeleteSingleQueryBuilder<_TResource extends PgResource<any, PgCodecWithAttributes, any, any, any> = PgResource<any, PgCodecWithAttributes, any, any, any>> extends PgQueryBuilder {
}
type PgDeleteSingleQueryBuilderCallback = (qb: PgDeleteSingleQueryBuilder) => void;
export {};
//# sourceMappingURL=pgDeleteSingle.d.ts.map