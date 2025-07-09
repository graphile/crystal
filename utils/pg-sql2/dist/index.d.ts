import { $$type } from "./thereCanBeOnlyOne.js";
export { version } from "./version.js";
/** Use this to enable coercing objects to SQL to make composing SQL fragments more ergonomic */
export declare const $$toSQL: unique symbol;
/** Experimental! */
export declare const $$symbolToIdentifier: unique symbol;
interface PgSQL2Proto {
}
/**
 * Represents raw SQL, the text will be output verbatim into the compiled query.
 */
export interface SQLRawNode {
    __proto__?: PgSQL2Proto;
    readonly [$$type]: "RAW";
}
/**
 * Represents an SQL identifier such as table, column, function, etc name. These
 * identifiers will be automatically escaped when compiled, respecting any
 * reserved words.
 */
export interface SQLIdentifierNode {
    __proto__?: PgSQL2Proto;
    readonly [$$type]: "IDENTIFIER";
}
/**
 * A value that can be used in `sql.value(...)`; note that objects are **NOT**
 * valid values; you must `JSON.stringify(obj)` or similar.
 */
export type SQLRawValue = string | number | boolean | null | ReadonlyArray<SQLRawValue>;
/**
 * Represents an SQL value that will be replaced with a placeholder in the
 * compiled SQL statement.
 */
export interface SQLValueNode {
    __proto__?: PgSQL2Proto;
    readonly [$$type]: "VALUE";
}
/**
 * Represents that the SQL inside this should be indented when pretty printed.
 */
export interface SQLIndentNode {
    readonly [$$type]: "INDENT";
}
/**
 * Informs pg-sql2 to treat symbol2 as if it were the same as symbol1
 */
export interface SQLSymbolAliasNode {
    readonly [$$type]: "SYMBOL_ALIAS";
}
/**
 * A placeholder that should be replaced at compile time using one of the
 * replacements provided.
 */
export interface SQLPlaceholderNode {
    readonly [$$type]: "PLACEHOLDER";
}
export type SQLNode = SQLRawNode | SQLValueNode | SQLIdentifierNode | SQLIndentNode | SQLSymbolAliasNode | SQLPlaceholderNode;
export interface SQLQuery {
    __proto__?: PgSQL2Proto;
    readonly [$$type]: "QUERY";
}
/**
 * Representation of SQL, identifiers, values, etc; to generate a query that
 * can be issued to the database it needs to be fed to `sql.compile`.
 */
export type SQL = SQLNode | SQLQuery;
export declare function escapeSqlIdentifier(str: string): string;
declare function isSQL(node: unknown): node is SQL;
export interface SQLable {
    [$$type]?: never;
    [$$toSQL](): SQL;
}
/**
 * Accepts an sql`...` expression and compiles it out to SQL text with
 * placeholders, and the values to substitute for these values.
 */
export declare function compile(sql: SQL, options?: {
    placeholderValues?: ReadonlyMap<symbol, SQL>;
}): {
    text: string;
    values: SQLRawValue[];
    [$$symbolToIdentifier]: Map<symbol, string>;
};
/**
 * Creates a SQL item for some raw SQL text. Just plain ol‘ raw SQL. This
 * method is dangerous though because it involves no escaping, so proceed with
 * caution! It's very very rarely warranted - there is likely a safer way of
 * achieving your goal.
 */
export declare function raw(text: string): SQL;
/**
 * Creates a SQL item for a SQL identifier. A SQL identifier is anything like
 * a table, schema, or column name. An identifier may also have a namespace,
 * thus why many names are accepted.
 */
export declare function identifier(...names: Array<string | symbol>): SQL;
/**
 * Creates a SQL item for a value that will be included in our final query.
 * This value will be added in a way which avoids SQL injection.
 */
export declare function value(val: SQLRawValue): SQL;
declare const trueNode: SQLRawNode;
declare const falseNode: SQLRawNode;
declare const nullNode: SQLRawNode;
export declare const blank: SQLRawNode;
export declare const dot: SQLRawNode;
/**
 * If the value is simple will inline it into the query, otherwise will defer
 * to `sql.value`.
 */
export declare function literal(val: string | number | boolean | null): SQL;
/**
 * Join some SQL items together, optionally separated by a string. Useful when
 * dealing with lists of SQL items, for example a dynamic list of columns or
 * variadic SQL function arguments.
 */
export declare function join(items: ReadonlyArray<SQL>, separator?: string): SQL;
export declare function indent(fragment: SQL): SQL;
export declare function indent(strings: TemplateStringsArray, ...values: Array<SQL>): SQL;
export declare function indentIf(condition: boolean, fragment: SQL): SQL;
/**
 * Wraps the given fragment in parens if necessary (or if forced, e.g. for a
 * subquery or maybe stylistically a join condition).
 *
 * Returns the input SQL fragment if it does not need parenthesis to be
 * inserted into another expression, otherwise a parenthesised fragment if not
 * doing so could cause ambiguity. We're relying on the user to be sensible
 * here, this is not fool-proof.
 *
 * @remarks The following are all parens safe:
 *
 * - A placeholder `$1`
 * - A number `0.123456`
 * - A string `'Foo bar'` / `E'Foo bar'`
 * - An identifier `table.column` / `"MyTaBlE"."MyCoLuMn"`
 *
 * The following might seem but are not parens safe:
 *
 * - A function call `schema.func(param)` - reason: `schema.func(param).*`
 *   should be `(schema.func(param)).*`
 * - A simple expression `1 = 2` - reason: `1 = 2 = false` is invalid; whereas
 *   `(1 = 2) = false` is fine. Similarly `1 = 2::text` differs from `(1 = 2)::text`.
 * - An identifier `table.column.attribute` / `"MyTaBlE"."MyCoLuMn"."MyAtTrIbUtE"` (this needs to be `(table.column).attribute`)
 */
export declare function parens(frag: SQL, force?: boolean): SQL;
export declare function symbolAlias(symbol1: symbol, symbol2: symbol): SQL;
export declare function placeholder(symbol: symbol, fallback?: SQL): SQLPlaceholderNode;
export declare function arraysMatch<T>(array1: ReadonlyArray<T>, array2: ReadonlyArray<T>, comparator?: (val1: T, val2: T) => boolean): boolean;
export declare function isEquivalent(sql1: SQL, sql2: SQL, options?: {
    symbolSubstitutes?: ReadonlyMap<symbol, symbol>;
}): boolean;
/**
 * @experimental
 */
export declare function replaceSymbol(frag: SQL, needle: symbol, replacement: symbol): SQL;
export type Transformer<TNewEmbed> = <TValue>(sql: PgSQL, value: TNewEmbed | TValue, where?: string) => SQL | TValue;
export declare function withTransformer<TNewEmbed, TResult = SQL>(transformer: Transformer<TNewEmbed>, callback: (sql: PgSQL<TNewEmbed>) => TResult): TResult;
export declare const sql: PgSQL;
export default sql;
export { falseNode as false, sql as fragment, isSQL, nullNode as null, sql as query, trueNode as true, };
export interface PgSQL<TEmbed = never> {
    (strings: TemplateStringsArray, ...values: Array<SQL | SQLable | TEmbed>): SQL;
    escapeSqlIdentifier: typeof escapeSqlIdentifier;
    compile: typeof compile;
    isEquivalent: typeof isEquivalent;
    query: PgSQL<TEmbed>;
    raw: typeof raw;
    identifier: typeof identifier;
    value: typeof value;
    literal: typeof literal;
    join: typeof join;
    indent: typeof indent;
    indentIf: typeof indentIf;
    parens: typeof parens;
    symbolAlias: typeof symbolAlias;
    placeholder: typeof placeholder;
    blank: typeof blank;
    fragment: PgSQL<TEmbed>;
    true: typeof trueNode;
    false: typeof falseNode;
    null: typeof nullNode;
    isSQL: typeof isSQL;
    replaceSymbol: typeof replaceSymbol;
    sql: PgSQL<TEmbed>;
    withTransformer<TNewEmbed, TResult = SQL>(transformer: Transformer<TNewEmbed>, callback: (sql: PgSQL<TEmbed | TNewEmbed>) => TResult): TResult;
}
//# sourceMappingURL=index.d.ts.map