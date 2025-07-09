import type { EdgeCapableStep, Step, UnbatchedExecutionExtra } from "grafast";
import { UnbatchedStep } from "grafast";
import type { GraphQLObjectType } from "grafast/graphql";
import type { SQL, SQLable } from "pg-sql2";
import { $$toSQL } from "pg-sql2";
import type { PgCodecAttribute } from "../codecs.js";
import type { PgResource } from "../datasource.js";
import type { GetPgResourceAttributes, GetPgResourceCodec, GetPgResourceRelations, PgCodec, PgQueryRootStep, PgRegistry, PgSQLCallbackOrDirect, PgTypedStep } from "../interfaces.js";
import type { PgClassExpressionStep } from "./pgClassExpression.js";
import { PgCursorStep } from "./pgCursor.js";
import type { PgSelectMode } from "./pgSelect.js";
import { PgSelectStep } from "./pgSelect.js";
export interface PgSelectSinglePlanOptions {
    fromRelation?: [PgSelectSingleStep<PgResource>, string];
}
/**
 * Represents the single result of a unique PgSelectStep. This might be
 * retrieved explicitly by PgSelectStep.single(), or implicitly (via Grafast)
 * by PgSelectStep.item(). Since this is the result of a fetch it does not make
 * sense to support changing `.where` or similar; however we now add methods
 * such as `.get` and `.cursor` which can receive specific properties by
 * telling the PgSelectStep to select the relevant expressions.
 */
export declare class PgSelectSingleStep<TResource extends PgResource<any, any, any, any, any> = PgResource> extends UnbatchedStep<unknown[] | null> implements PgTypedStep<TResource extends PgResource<any, infer UCodec, any, any, any> ? UCodec : never>, EdgeCapableStep<any>, SQLable {
    private options;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    readonly pgCodec: GetPgResourceCodec<TResource>;
    readonly itemStepId: number;
    readonly mode: PgSelectMode;
    private classStepId;
    private nullCheckId;
    readonly resource: TResource;
    private _coalesceToEmptyObject;
    private typeStepIndexList;
    constructor($class: PgSelectStep<TResource>, $item: Step<unknown[]>, options?: PgSelectSinglePlanOptions);
    coalesceToEmptyObject(): void;
    toStringMeta(): string;
    getClassStep(): PgSelectStep<TResource>;
    /**
     * Returns a plan representing a named attribute (e.g. column) from the class
     * (e.g. table).
     */
    get<TAttr extends keyof GetPgResourceAttributes<TResource>>(attr: TAttr): PgClassExpressionStep<GetPgResourceAttributes<TResource>[TAttr] extends PgCodecAttribute<infer UCodec, any> ? UCodec : never, TResource>;
    private _getInternal;
    getMeta(key: string): import("grafast").AccessStep<unknown>;
    /**
     * Returns a plan representing the result of an expression.
     */
    select<TExpressionCodec extends PgCodec>(fragment: PgSQLCallbackOrDirect<SQL>, codec: TExpressionCodec, guaranteedNotNull?: boolean): PgClassExpressionStep<TExpressionCodec, TResource>;
    scopedSQL: <T>(cb: PgSQLCallbackOrDirect<T>) => T;
    getPgRoot(): PgQueryRootStep;
    /** @deprecated Use .getPgRoot().placeholder() */
    placeholder($step: PgTypedStep<any>): SQL;
    /** @deprecated Use .getPgRoot().placeholder() */
    placeholder($step: Step, codec: PgCodec): SQL;
    deferredSQL($step: Step<SQL>): SQL;
    private existingSingleRelation;
    singleRelation<TRelationName extends keyof GetPgResourceRelations<TResource>>(relationIdentifier: TRelationName): PgSelectSingleStep<GetPgResourceRelations<TResource>[TRelationName]["remoteResource"]>;
    manyRelation<TRelationName extends keyof GetPgResourceRelations<TResource>>(relationIdentifier: TRelationName): PgSelectStep<GetPgResourceRelations<TResource>[TRelationName]["remoteResource"]>;
    record(): PgClassExpressionStep<GetPgResourceCodec<TResource>, TResource>;
    /**
     * When selecting a connection we need to be able to get the cursor. The
     * cursor is built from the values of the `ORDER BY` clause so that we can
     * find nodes before/after it.
     */
    cursor(): PgCursorStep<this>;
    /**
     * For compatibility with EdgeCapableStep.
     */
    node(): this;
    deduplicate(peers: PgSelectSingleStep<any>[]): PgSelectSingleStep<TResource>[];
    planForType(type: GraphQLObjectType): Step;
    /**
     * The polymorphism if this is a "regular" (non-aggregate) request over a
     * single/relational polymorphic codec; otherwise null.
     */
    private singleOrRelationalPolyIfRegular;
    private nonNullAttribute;
    private nullCheckAttributeIndex;
    optimize(): this;
    finalize(): void;
    handlePolymorphism?: (result: any) => any;
    unbatchedExecute(_extra: UnbatchedExecutionExtra, result: string[] | null): unknown[] | null;
    [$$toSQL](): SQL;
}
/**
 * Given a plan that represents a single record (via
 * PgSelectSingleStep.record()) this turns it back into a PgSelectSingleStep
 */
export declare function pgSelectFromRecord<TResource extends PgResource<any, PgCodec<any, any, any, any, any, any, any>, any, any, PgRegistry>>(resource: TResource, $record: PgClassExpressionStep<GetPgResourceCodec<TResource>, TResource> | Step<{
    [Attr in keyof TResource["codec"]["attributes"]]: Step;
}>): PgSelectStep<TResource>;
/**
 * Given a plan that represents a single record (via
 * PgSelectSingleStep.record()) this turns it back into a PgSelectSingleStep
 */
export declare function pgSelectSingleFromRecord<TResource extends PgResource<any, any, any, any>>(resource: TResource, $record: PgClassExpressionStep<GetPgResourceCodec<TResource>, TResource>): PgSelectSingleStep<TResource>;
//# sourceMappingURL=pgSelectSingle.d.ts.map