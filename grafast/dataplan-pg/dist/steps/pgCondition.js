"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgCondition = void 0;
exports.pgWhereConditionSpecListToSQL = pgWhereConditionSpecListToSQL;
const grafast_1 = require("grafast");
const pg_sql2_1 = require("pg-sql2");
class PgCondition extends grafast_1.Modifier {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "PgCondition",
    }; }
    constructor(parent, isHaving = false, mode = "PASS_THRU") {
        super(parent);
        this.isHaving = isHaving;
        this.conditions = [];
        this.havingConditions = [];
        this.extensions = Object.create(null);
        if (typeof mode === "string") {
            this.resolvedMode = { mode };
        }
        else {
            this.resolvedMode = mode;
        }
        switch (this.resolvedMode.mode) {
            case "PASS_THRU":
            case "AND":
            case "OR":
            case "NOT": {
                this.alias = parent.alias;
                break;
            }
            case "EXISTS": {
                this.alias = pg_sql2_1.sql.identifier(Symbol(this.resolvedMode.alias ?? "exists"));
                break;
            }
        }
    }
    toStringMeta() {
        return `${this.parent.id}/${this.resolvedMode.mode}`;
    }
    orPlan() {
        return new PgCondition(this, this.isHaving, "OR");
    }
    andPlan() {
        return new PgCondition(this, this.isHaving, "AND");
    }
    notPlan() {
        return new PgCondition(this, this.isHaving, "NOT");
    }
    existsPlan(options) {
        if (this.isHaving) {
            // Is this true?
            throw new Error(`EXISTS inside having is currently unsupported`);
        }
        return new PgCondition(this, this.isHaving, {
            ...options,
            mode: "EXISTS",
        });
    }
    where(condition) {
        if (this.isHaving) {
            throw new Error(`Cannot call .where() on a 'having' condition`);
        }
        this.conditions.push(condition);
    }
    having(condition) {
        if (!this.isHaving) {
            throw new Error(`cannot call .having() on a 'where' condition`);
        }
        this.havingConditions.push(condition);
    }
    transform(conditions) {
        const sqlCondition = pgWhereConditionSpecListToSQL(this.alias, conditions, this.resolvedMode.mode === "OR" ? "or" : "and", this.resolvedMode.mode === "NOT"
            ? (frag) => pg_sql2_1.sql.parens((0, pg_sql2_1.sql) `not ${pg_sql2_1.sql.parens(frag)}`)
            : (frag) => frag);
        if (sqlCondition === null) {
            return null;
        }
        switch (this.resolvedMode.mode) {
            case "PASS_THRU": {
                throw new Error("Should never reach here");
            }
            case "AND":
            case "OR":
            case "NOT": {
                return sqlCondition;
            }
            case "EXISTS": {
                const sqlExists = (0, pg_sql2_1.sql) `exists(${pg_sql2_1.sql.indent `\
select 1
from ${this.resolvedMode.tableExpression} as ${this.alias}
where ${sqlCondition}`})`;
                if (this.resolvedMode.equals != null) {
                    return (0, pg_sql2_1.sql) `${sqlExists} = ${this.resolvedMode.equals ? pg_sql2_1.sql.true : pg_sql2_1.sql.false}`;
                }
                else {
                    // Assume true
                    return sqlExists;
                }
            }
            default: {
                const never = this.resolvedMode;
                throw new Error(`Unhandled mode: ${never.mode}`);
            }
        }
    }
    apply() {
        if (this.isHaving) {
            if (!this.parent.having) {
                throw new Error(`${this.parent} doesn't support 'having'`);
            }
            if (this.resolvedMode.mode === "PASS_THRU") {
                this.havingConditions.forEach((condition) => {
                    this.parent.having(condition);
                });
            }
            else {
                const frag = this.transform(this.havingConditions);
                if (frag) {
                    this.parent.having(frag);
                }
            }
        }
        else {
            if (this.resolvedMode.mode === "PASS_THRU") {
                this.conditions.forEach((condition) => {
                    this.parent.where(condition);
                });
            }
            else {
                const frag = this.transform(this.conditions);
                if (frag) {
                    this.parent.where(frag);
                }
            }
        }
    }
    [pg_sql2_1.$$toSQL]() {
        return this.alias;
    }
}
exports.PgCondition = PgCondition;
function pgWhereConditionSpecListToSQL(alias, conditions, andOr = "and", transform = (frag) => frag) {
    const mappedConditions = [];
    for (const c of conditions) {
        if (pg_sql2_1.sql.isSQL(c)) {
            if (pg_sql2_1.sql.isEquivalent(c, pg_sql2_1.sql.blank)) {
                continue;
            }
            const frag = pg_sql2_1.sql.parens(c);
            mappedConditions.push(pg_sql2_1.sql.indent(transform(frag)));
            continue;
        }
        else {
            switch (c.type) {
                case "attribute": {
                    const frag = c.callback((0, pg_sql2_1.sql) `${alias}.${pg_sql2_1.sql.identifier(c.attribute)}`);
                    mappedConditions.push(pg_sql2_1.sql.indent(transform(frag)));
                    continue;
                }
                default: {
                    const never = c.type;
                    throw new Error(`Unsupported condition: ` + never);
                }
            }
        }
    }
    if (mappedConditions.length === 0) {
        return null;
    }
    const joined = pg_sql2_1.sql.join(mappedConditions, `\n${andOr}\n`);
    const sqlCondition = pg_sql2_1.sql.parens(joined);
    return sqlCondition;
}
//# sourceMappingURL=pgCondition.js.map