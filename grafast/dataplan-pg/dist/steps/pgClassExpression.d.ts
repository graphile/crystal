import type { AccessStep, UnbatchedExecutionExtra } from "grafast";
import { UnbatchedStep } from "grafast";
import type { SQL } from "pg-sql2";
import { $$toSQL } from "pg-sql2";
import type { PgResource } from "../datasource.js";
import type { GetPgCodecAttributes, PgClassSingleStep, PgCodec, PgTypedStep } from "../interfaces.js";
import { PgUnionAllSingleStep } from "./pgUnionAll.js";
/**
 * A plan for selecting a attribute or attribute-like expression. Keep in mind that
 * a attribute might not be a scalar (could be a list, compound type, JSON,
 * geometry, etc), so this might not be a "leaf". The result of this might be used as the input
 * of another layer of plan.
 */
export declare class PgClassExpressionStep<TExpressionCodec extends PgCodec, TResource extends PgResource<any, any, any, any, any>> extends UnbatchedStep<any> implements PgTypedStep<TExpressionCodec> {
    readonly pgCodec: TExpressionCodec;
    private guaranteedNotNull?;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    /**
     * This is the numeric index of this expression within the grandparent
     * PgSelectStep's selection.
     */
    private attrIndex;
    readonly expression: SQL;
    private needsPolymorphicUnwrap;
    private needsTupleAccess;
    constructor($table: PgClassSingleStep<TResource> | PgUnionAllSingleStep, pgCodec: TExpressionCodec, strings: TemplateStringsArray, dependencies?: ReadonlyArray<PgTypedStep<any> | SQL>, guaranteedNotNull?: boolean | undefined);
    toStringMeta(): string;
    get<TAttr extends keyof GetPgCodecAttributes<TExpressionCodec>>(attributeName: TAttr): PgClassExpressionStep<GetPgCodecAttributes<TExpressionCodec>[TAttr]["codec"], TResource>;
    private _getInternal;
    getParentStep(): PgClassSingleStep<TResource> | PgUnionAllSingleStep;
    getMeta(key: string): AccessStep<unknown>;
    optimize(): this;
    unbatchedExecute(_extra: UnbatchedExecutionExtra, v: any): any;
    deduplicate(peers: Array<PgClassExpressionStep<any, any>>): PgClassExpressionStep<TExpressionCodec, TResource>[];
    [$$toSQL](): SQL;
    toSQL(): SQL;
}
/**
 * This higher order function takes a table and codec as input and returns a
 * tagged template literal function that you can use to build an SQL expression
 * that will be selected.
 */
declare function pgClassExpression<TExpressionCodec extends PgCodec, TResource extends PgResource<any, any, any, any, any>>(table: PgClassSingleStep<TResource> | PgUnionAllSingleStep, codec: TExpressionCodec, guaranteedNotNull?: boolean): (strings: TemplateStringsArray, ...dependencies: ReadonlyArray<PgTypedStep<any> | SQL>) => PgClassExpressionStep<TExpressionCodec, TResource>;
export { pgClassExpression };
//# sourceMappingURL=pgClassExpression.d.ts.map