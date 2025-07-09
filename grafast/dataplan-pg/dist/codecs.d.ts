import type { JSONValue } from "grafast";
import type { SQL } from "pg-sql2";
import type { PgBox, PgCircle, PgHStore, PgInterval, PgLine, PgLseg, PgPath, PgPoint, PgPolygon } from "./codecUtils/index.js";
import type { PgExecutor } from "./executor.js";
import type { PgCodec, PgCodecExtensions, PgCodecPolymorphism, PgEnumCodec, PgEnumValue } from "./interfaces.js";
export type PgCodecAttributeViaExplicit = {
    relation: string;
    attribute: string;
};
export type PgCodecAttributeVia = string | PgCodecAttributeViaExplicit;
/** @deprecated Use DataplanPg.PgCodecAttributeExtensions instead */
export type PgCodecAttributeExtensions = DataplanPg.PgCodecAttributeExtensions;
export interface PgCodecAttribute<TCodec extends PgCodec = PgCodec, TNotNull extends boolean = boolean> {
    /**
     * How to translate to/from PG and how to cast.
     */
    codec: TCodec;
    /**
     * Is the column/attribute guaranteed to not be null?
     */
    notNull: TNotNull;
    hasDefault?: boolean;
    /**
     * The SQL expression for a derivative attributes, e.g.:
     *
     * ```js
     * expression: (alias) => sql`${alias}.first_name || ' ' || ${alias}.last_name`
     * ```
     */
    expression?: (alias: SQL) => SQL;
    /**
     * If this attribute actually exists on a relation rather than locally, the name
     * of the (unique) relation this attribute belongs to.
     */
    via?: PgCodecAttributeVia;
    /**
     * If the attribute exists identically on a relation and locally (e.g.
     * `posts.author_id` and `users.id` have exactly the same value due to a
     * foreign key reference) then the plans can choose which one to grab.
     *
     * @remarks
     *
     * ```
     * create table users (id serial primary key);
     * create table posts (id serial primary key, author_id int references users);
     * create table comments (id serial primary key, user_id int references users);
     * create table pets (id serial primary key, owner_id int references users);
     * ```
     *
     * Here:
     * - posts.author_id *identical via* 'author.id'
     * - comments.user_id *identical via* 'user.id'
     * - pets.owner_id *identical via* 'owner.id'
     *
     * Note however that `users.id` is not *identical via* anything, because
     * these are all plural relationships. So identicalVia is generally one-way
     * (except in 1-to-1 relationships).
     */
    identicalVia?: PgCodecAttributeVia;
    /**
     * Set this true if you're using column-level select privileges and there are
     * roles accessible that do not have permission to select it. This will tell
     * us not to auto-select it to more efficiently resolve row nullability
     * questions - we'll only try when the user explicitly tells us to.
     */
    restrictedAccess?: boolean;
    description?: string;
    extensions?: Partial<PgCodecAttributeExtensions>;
}
export type PgCodecAttributes<TCodecMap extends {
    [attributeName in string]: PgCodecAttribute;
} = {
    [attributeName in string]: PgCodecAttribute;
}> = TCodecMap;
export type ObjectFromPgCodecAttributes<TAttributes extends PgCodecAttributes> = {
    [attributeName in keyof TAttributes]: TAttributes[attributeName] extends PgCodecAttribute<infer UCodec, infer UNonNull> ? UCodec extends PgCodec<any, any, any, infer UFromJs, any, any, any> ? UNonNull extends true ? Exclude<UFromJs, null | undefined> : UFromJs | null : never : never;
};
export type PgRecordTypeCodecSpec<TName extends string, TAttributes extends PgCodecAttributes> = {
    name: TName;
    executor: PgExecutor;
    identifier: SQL;
    attributes: TAttributes;
    polymorphism?: PgCodecPolymorphism<any>;
    description?: string;
    extensions?: Partial<PgCodecExtensions>;
    isAnonymous?: boolean;
};
/**
 * Returns a PgCodec that represents a composite type (a type with
 * attributes).
 *
 * name - the name of this type
 * identifier - a pg-sql2 fragment that uniquely identifies this type, suitable to be fed after `::` into an SQL query.
 * attributes - the attributes this composite type has
 * extensions - an optional object that you can use to associate arbitrary data with this type
 * isAnonymous - if true, this represents an "anonymous" type, typically the return value of a function or something like that. If this is true, then name and identifier are ignored.
 */
export declare function recordCodec<const TName extends string, const TAttributes extends PgCodecAttributes>(config: PgRecordTypeCodecSpec<TName, TAttributes>): PgCodec<TName, TAttributes, string, ObjectFromPgCodecAttributes<TAttributes>, undefined, undefined, undefined>;
export type PgEnumCodecSpec<TName extends string, TValue extends string> = {
    name: TName;
    identifier: SQL;
    values: Array<PgEnumValue<TValue> | TValue>;
    description?: string;
    extensions?: Partial<PgCodecExtensions>;
};
/**
 * Returns a PgCodec that represents a Postgres enum type.
 *
 * - name - the name of the enum
 * - identifier - a pg-sql2 fragment that uniquely identifies this type, suitable to be fed after `::` into an SQL query.
 * - values - a list of the values that this enum can represent
 * - extensions - an optional object that you can use to associate arbitrary data with this type
 */
export declare function enumCodec<const TName extends string, const TValue extends string>(config: PgEnumCodecSpec<TName, TValue>): PgEnumCodec<TName, TValue>;
export declare function isEnumCodec<TName extends string, TValue extends string = string>(t: PgCodec<TName, any, any, any, any, any, any>): t is PgEnumCodec<TName, TValue>;
type PgCodecTFromJavaScript<TInnerCodec extends PgCodec<any, any, any, any, any, any, any>> = TInnerCodec extends PgCodec<any, any, any, infer UFromJs, undefined, any, any> ? UFromJs : any;
/**
 * Given a PgCodec, this returns a new PgCodec that represents a list
 * of the former.
 *
 * List codecs CANNOT BE NESTED - Postgres array types don't have defined
 * dimensionality, so an array of an array of a type doesn't really make sense
 * to Postgres, it being the same as an array of the type.
 *
 * @param innerCodec - the codec that represents the "inner type" of the array
 * @param extensions - an optional object that you can use to associate arbitrary data with this type
 * @param typeDelim - the delimeter used to separate entries in this list when Postgres stringifies it
 * @param identifier - a pg-sql2 fragment that represents the name of this type
 */
export declare function listOfCodec<TInnerCodec extends PgCodec<string, any, any, any, undefined, any, any>, TName extends string = `${TInnerCodec extends PgCodec<infer UName, any, any, any, any, any, any> ? UName : never}[]`>(listedCodec: TInnerCodec, config?: {
    description?: string;
    extensions?: Partial<PgCodecExtensions>;
    typeDelim?: string;
    identifier?: SQL;
    name?: TName;
}): PgCodec<TName, undefined, // Array has no attributes
string, readonly PgCodecTFromJavaScript<TInnerCodec>[], TInnerCodec, undefined, undefined>;
/**
 * Represents a PostgreSQL `DOMAIN` over the given codec
 *
 * @param innerCodec - the codec that represents the "inner type" of the domain
 * @param name - the name of the domain
 * @param identifier - a pg-sql2 fragment that represents the name of this type
 * @param config - extra details about this domain
 */
export declare function domainOfCodec<TName extends string, TInnerCodec extends PgCodec<any, any, any, any, any, any>>(innerCodec: TInnerCodec, name: TName, identifier: SQL, config?: {
    description?: string;
    extensions?: Partial<PgCodecExtensions>;
    notNull?: boolean | null;
}): PgCodec<TName, TInnerCodec extends PgCodec<any, infer U, any, any, any, any> ? U : any, TInnerCodec extends PgCodec<any, any, infer U, any, any, any> ? U : any, undefined, TInnerCodec, undefined>;
interface PgRange<T> {
    start: {
        value: T;
        inclusive: boolean;
    } | null;
    end: {
        value: T;
        inclusive: boolean;
    } | null;
}
/**
 * Returns a PgCodec that represents a range of the given inner PgCodec
 * type.
 *
 * @param innerCodec - the PgCodec that represents the bounds of this range
 * @param name - the name of the range
 * @param identifier - a pg-sql2 fragment that represents the name of this type
 * @param config - extra details about this range
 */
export declare function rangeOfCodec<TName extends string, TInnerCodec extends PgCodec<any, undefined, any, any, undefined, any, undefined>>(innerCodec: TInnerCodec, name: TName, identifier: SQL, config?: {
    description?: string;
    extensions?: Partial<PgCodecExtensions>;
}): PgCodec<TName, undefined, string, PgRange<unknown>, undefined, undefined, TInnerCodec>;
/**
 * Built in PostgreSQL types that we support; note the keys are the "ergonomic"
 * names (like 'bigint'), but the values use the underlying PostgreSQL true
 * names (those that would be found in the `pg_type` table).
 */
export declare const TYPES: {
    readonly void: PgCodec<"void", undefined, string, void, undefined, undefined, undefined>;
    readonly boolean: PgCodec<"bool", undefined, string, boolean, undefined, undefined, undefined>;
    readonly int2: PgCodec<"int2", undefined, string, number, undefined, undefined, undefined>;
    readonly int: PgCodec<"int4", undefined, string, number, undefined, undefined, undefined>;
    readonly bigint: PgCodec<"int8", undefined, string, string, undefined, undefined, undefined>;
    readonly float4: PgCodec<"float4", undefined, string, number, undefined, undefined, undefined>;
    readonly float: PgCodec<"float8", undefined, string, number, undefined, undefined, undefined>;
    readonly money: PgCodec<"money", undefined, string, string, undefined, undefined, undefined>;
    readonly numeric: PgCodec<"numeric", undefined, string, string, undefined, undefined, undefined>;
    readonly char: PgCodec<"char", undefined, string, string, undefined, undefined, undefined>;
    readonly bpchar: PgCodec<"bpchar", undefined, string, string, undefined, undefined, undefined>;
    readonly varchar: PgCodec<"varchar", undefined, string, string, undefined, undefined, undefined>;
    readonly text: PgCodec<"text", undefined, string, string, undefined, undefined, undefined>;
    readonly name: PgCodec<"name", undefined, string, string, undefined, undefined, undefined>;
    readonly json: PgCodec<"json", undefined, string, JSONValue, undefined, undefined, undefined>;
    readonly jsonb: PgCodec<"jsonb", undefined, string, JSONValue, undefined, undefined, undefined>;
    readonly xml: PgCodec<"xml", undefined, string, string, undefined, undefined, undefined>;
    readonly citext: PgCodec<"citext", undefined, string, string, undefined, undefined, undefined>;
    readonly uuid: PgCodec<"uuid", undefined, string, string, undefined, undefined, undefined>;
    readonly timestamp: PgCodec<"timestamp", undefined, string, string, undefined, undefined, undefined>;
    readonly timestamptz: PgCodec<"timestamptz", undefined, string, string, undefined, undefined, undefined>;
    readonly date: PgCodec<"date", undefined, string, string, undefined, undefined, undefined>;
    readonly time: PgCodec<"time", undefined, string, string, undefined, undefined, undefined>;
    readonly timetz: PgCodec<"timetz", undefined, string, string, undefined, undefined, undefined>;
    readonly inet: PgCodec<"inet", undefined, string, string, undefined, undefined, undefined>;
    readonly regproc: PgCodec<"regproc", undefined, string, string, undefined, undefined, undefined>;
    readonly regprocedure: PgCodec<"regprocedure", undefined, string, string, undefined, undefined, undefined>;
    readonly regoper: PgCodec<"regoper", undefined, string, string, undefined, undefined, undefined>;
    readonly regoperator: PgCodec<"regoperator", undefined, string, string, undefined, undefined, undefined>;
    readonly regclass: PgCodec<"regclass", undefined, string, string, undefined, undefined, undefined>;
    readonly regtype: PgCodec<"regtype", undefined, string, string, undefined, undefined, undefined>;
    readonly regrole: PgCodec<"regrole", undefined, string, string, undefined, undefined, undefined>;
    readonly regnamespace: PgCodec<"regnamespace", undefined, string, string, undefined, undefined, undefined>;
    readonly regconfig: PgCodec<"regconfig", undefined, string, string, undefined, undefined, undefined>;
    readonly regdictionary: PgCodec<"regdictionary", undefined, string, string, undefined, undefined, undefined>;
    readonly cidr: PgCodec<"cidr", undefined, string, string, undefined, undefined, undefined>;
    readonly macaddr: PgCodec<"macaddr", undefined, string, string, undefined, undefined, undefined>;
    readonly macaddr8: PgCodec<"macaddr8", undefined, string, string, undefined, undefined, undefined>;
    readonly interval: PgCodec<"interval", undefined, string, PgInterval, undefined, undefined, undefined>;
    readonly bit: PgCodec<"bit", undefined, string, string, undefined, undefined, undefined>;
    readonly varbit: PgCodec<"varbit", undefined, string, string, undefined, undefined, undefined>;
    readonly point: PgCodec<"point", undefined, string, PgPoint, undefined, undefined, undefined>;
    readonly line: PgCodec<"line", undefined, string, PgLine, undefined, undefined, undefined>;
    readonly lseg: PgCodec<"lseg", undefined, string, PgLseg, undefined, undefined, undefined>;
    readonly box: PgCodec<"box", undefined, string, PgBox, undefined, undefined, undefined>;
    readonly path: PgCodec<"path", undefined, string, PgPath, undefined, undefined, undefined>;
    readonly polygon: PgCodec<"polygon", undefined, string, PgPolygon, undefined, undefined, undefined>;
    readonly circle: PgCodec<"circle", undefined, string, PgCircle, undefined, undefined, undefined>;
    readonly hstore: PgCodec<"hstore", undefined, string, PgHStore, undefined, undefined, undefined>;
    readonly bytea: PgCodec<"bytea", undefined, string, Buffer<ArrayBufferLike>, undefined, undefined, undefined>;
};
/**
 * For supported builtin type names ('void', 'bool', etc) that will be found in
 * the `pg_catalog` table this will return a PgCodec.
 */
export declare function getCodecByPgCatalogTypeName(pgCatalogTypeName: string): PgCodec<"void", undefined, string, void, undefined, undefined, undefined> | PgCodec<"bool", undefined, string, boolean, undefined, undefined, undefined> | PgCodec<"int2", undefined, string, number, undefined, undefined, undefined> | PgCodec<"int4", undefined, string, number, undefined, undefined, undefined> | PgCodec<"int8", undefined, string, string, undefined, undefined, undefined> | PgCodec<"float4", undefined, string, number, undefined, undefined, undefined> | PgCodec<"float8", undefined, string, number, undefined, undefined, undefined> | PgCodec<"money", undefined, string, string, undefined, undefined, undefined> | PgCodec<"numeric", undefined, string, string, undefined, undefined, undefined> | PgCodec<"char", undefined, string, string, undefined, undefined, undefined> | PgCodec<"bpchar", undefined, string, string, undefined, undefined, undefined> | PgCodec<"varchar", undefined, string, string, undefined, undefined, undefined> | PgCodec<"text", undefined, string, string, undefined, undefined, undefined> | PgCodec<"name", undefined, string, string, undefined, undefined, undefined> | PgCodec<"json", undefined, string, JSONValue, undefined, undefined, undefined> | PgCodec<"jsonb", undefined, string, JSONValue, undefined, undefined, undefined> | PgCodec<"xml", undefined, string, string, undefined, undefined, undefined> | PgCodec<"uuid", undefined, string, string, undefined, undefined, undefined> | PgCodec<"timestamp", undefined, string, string, undefined, undefined, undefined> | PgCodec<"timestamptz", undefined, string, string, undefined, undefined, undefined> | PgCodec<"date", undefined, string, string, undefined, undefined, undefined> | PgCodec<"time", undefined, string, string, undefined, undefined, undefined> | PgCodec<"timetz", undefined, string, string, undefined, undefined, undefined> | PgCodec<"inet", undefined, string, string, undefined, undefined, undefined> | PgCodec<"regproc", undefined, string, string, undefined, undefined, undefined> | PgCodec<"regprocedure", undefined, string, string, undefined, undefined, undefined> | PgCodec<"regoper", undefined, string, string, undefined, undefined, undefined> | PgCodec<"regoperator", undefined, string, string, undefined, undefined, undefined> | PgCodec<"regclass", undefined, string, string, undefined, undefined, undefined> | PgCodec<"regtype", undefined, string, string, undefined, undefined, undefined> | PgCodec<"regrole", undefined, string, string, undefined, undefined, undefined> | PgCodec<"regnamespace", undefined, string, string, undefined, undefined, undefined> | PgCodec<"regconfig", undefined, string, string, undefined, undefined, undefined> | PgCodec<"regdictionary", undefined, string, string, undefined, undefined, undefined> | PgCodec<"cidr", undefined, string, string, undefined, undefined, undefined> | PgCodec<"macaddr", undefined, string, string, undefined, undefined, undefined> | PgCodec<"macaddr8", undefined, string, string, undefined, undefined, undefined> | PgCodec<"interval", undefined, string, PgInterval, undefined, undefined, undefined> | PgCodec<"bit", undefined, string, string, undefined, undefined, undefined> | PgCodec<"varbit", undefined, string, string, undefined, undefined, undefined> | PgCodec<"point", undefined, string, PgPoint, undefined, undefined, undefined> | PgCodec<"line", undefined, string, PgLine, undefined, undefined, undefined> | PgCodec<"lseg", undefined, string, PgLseg, undefined, undefined, undefined> | PgCodec<"box", undefined, string, PgBox, undefined, undefined, undefined> | PgCodec<"path", undefined, string, PgPath, undefined, undefined, undefined> | PgCodec<"polygon", undefined, string, PgPolygon, undefined, undefined, undefined> | PgCodec<"circle", undefined, string, PgCircle, undefined, undefined, undefined> | PgCodec<"bytea", undefined, string, Buffer<ArrayBufferLike>, undefined, undefined, undefined> | null;
export declare function getInnerCodec<TCodec extends PgCodec<any, any, any, any, any, any>>(codec: TCodec): TCodec extends PgCodec<any, any, any, infer UArray, infer UDomain, infer URange> ? Exclude<UDomain | UArray | URange, undefined> : TCodec;
export declare function sqlValueWithCodec(value: unknown, codec: PgCodec): SQL;
export {};
//# sourceMappingURL=codecs.d.ts.map