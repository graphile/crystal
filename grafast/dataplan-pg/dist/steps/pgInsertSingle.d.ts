import type { ExecutionDetails, GrafastResultsList, Maybe, Setter, SetterCapable } from "grafast";
import { Step } from "grafast";
import type { SQL, SQLable } from "pg-sql2";
import { $$toSQL } from "pg-sql2";
import type { PgCodecAttribute } from "../codecs.js";
import type { PgResource } from "../datasource.js";
import type { GetPgResourceAttributes, GetPgResourceCodec, ObjectForResource, PgCodecWithAttributes, PgQueryBuilder, PgTypedStep, ReadonlyArrayOrDirect } from "../interfaces.js";
import type { PgClassExpressionStep } from "./pgClassExpression.js";
/**
 * Inserts a row into resource with the given specified attribute values.
 */
export declare class PgInsertSingleStep<TResource extends PgResource<any, any, any, any, any> = PgResource> extends Step<unknown[]> implements SetterCapable<{
    [key in keyof GetPgResourceAttributes<TResource> & string]: Step;
}>, SQLable {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    /**
     * Tells us what we're dealing with - data type, columns, where to insert it,
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
     * The attributes and their dependency ids for us to insert.
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
    constructor(resource: TResource, attributes?: {
        [key in keyof GetPgResourceAttributes<TResource>]?: PgTypedStep<GetPgResourceAttributes<TResource>[key]["codec"]> | Step;
    });
    toStringMeta(): string | null;
    set<TKey extends keyof GetPgResourceAttributes<TResource>>(name: TKey, value: Step): void;
    /**
     * Returns a plan representing a named attribute (e.g. column) from the newly
     * inserted row.
     */
    get<TAttr extends keyof GetPgResourceAttributes<TResource>>(attr: TAttr): PgClassExpressionStep<GetPgResourceAttributes<TResource>[TAttr] extends PgCodecAttribute<infer UCodec> ? UCodec : never, TResource>;
    getMeta(key: string): import("grafast").AccessStep<unknown>;
    record(): PgClassExpressionStep<GetPgResourceCodec<TResource>, TResource>;
    apply($step: Step<ReadonlyArrayOrDirect<Maybe<PgInsertSingleQueryBuilderCallback>>>): void;
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
 * Inserts a row into resource with the given specified attribute values.
 */
export declare function pgInsertSingle<TResource extends PgResource<any, any, any, any, any>>(resource: TResource, attributes?: {
    [key in keyof GetPgResourceAttributes<TResource>]?: PgTypedStep<GetPgResourceAttributes<TResource>[key]["codec"]> | Step;
}): PgInsertSingleStep<TResource>;
export interface PgInsertSingleQueryBuilder<TResource extends PgResource<any, PgCodecWithAttributes, any, any, any> = PgResource<any, PgCodecWithAttributes, any, any, any>> extends PgQueryBuilder, SetterCapable<ObjectForResource<TResource>> {
    set<TAttributeName extends keyof ObjectForResource<TResource>>(key: TAttributeName, value: ObjectForResource<TResource>[TAttributeName]): void;
    setBuilder(): Setter<ObjectForResource<TResource>, this>;
}
type PgInsertSingleQueryBuilderCallback = (qb: PgInsertSingleQueryBuilder) => void;
export {};
//# sourceMappingURL=pgInsertSingle.d.ts.map