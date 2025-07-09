import { Modifier } from "grafast";
import type { SQL, SQLable } from "pg-sql2";
import { $$toSQL } from "pg-sql2";
export type PgWhereConditionSpec<TAttribute extends string> = SQL | PgWhereConditionAttributeSpec<TAttribute>;
export interface PgWhereConditionAttributeSpec<TAttribute extends string> {
    type: "attribute";
    attribute: TAttribute;
    callback: (fragment: SQL) => SQL;
}
export type PgHavingConditionSpec<_TAttribute extends string> = SQL;
export interface PgConditionCapableParent {
    alias: SQL;
    where(condition: PgWhereConditionSpec<any>): void;
    having?(condition: PgHavingConditionSpec<any>): void;
}
type PgConditionModeExists = {
    mode: "EXISTS";
    tableExpression: SQL;
    alias?: string;
    equals?: boolean;
};
export type PgConditionResolvedMode = {
    mode: "PASS_THRU";
} | {
    mode: "AND";
} | {
    mode: "OR";
} | {
    mode: "NOT";
} | PgConditionModeExists;
export type PgConditionMode = "PASS_THRU" | "AND" | "OR" | "NOT" | PgConditionResolvedMode;
export declare class PgCondition<TParent extends PgConditionCapableParent = PgConditionCapableParent> extends Modifier<TParent> implements PgConditionCapableParent, SQLable {
    private isHaving;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    private conditions;
    private havingConditions;
    readonly alias: SQL;
    extensions: DataplanPg.PgConditionExtensions;
    readonly resolvedMode: PgConditionResolvedMode;
    constructor(parent: TParent, isHaving?: boolean, mode?: PgConditionMode);
    toStringMeta(): string;
    orPlan(): PgCondition<this>;
    andPlan(): PgCondition<this>;
    notPlan(): PgCondition<this>;
    existsPlan(options: Omit<PgConditionModeExists, "mode">): PgCondition<this>;
    where(condition: PgWhereConditionSpec<any>): void;
    having(condition: PgHavingConditionSpec<any>): void;
    private transform;
    apply(): void;
    [$$toSQL](): SQL;
}
export declare function pgWhereConditionSpecListToSQL(alias: SQL, conditions: PgWhereConditionSpec<any>[], andOr?: "and" | "or", transform?: (frag: SQL) => SQL): SQL | null;
export {};
//# sourceMappingURL=pgCondition.d.ts.map