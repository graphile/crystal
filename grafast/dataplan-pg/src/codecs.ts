import type { JSONValue } from "grafast";
import { exportAs, inspect, isDev, Step } from "grafast";
import type { SQL, SQLRawValue } from "pg-sql2";
import sql from "pg-sql2";
import { parse as rangeParse } from "postgres-range";
import type { CustomInspectFunction } from "util";

import type {
  PgBox,
  PgCircle,
  PgHStore,
  PgInterval,
  PgLine,
  PgLseg,
  PgPath,
  PgPoint,
  PgPolygon,
} from "./codecUtils/index.ts";
import {
  parseBox,
  parseCircle,
  parseHstore,
  parseLine,
  parseLseg,
  parsePath,
  parsePoint,
  parsePolygon,
  stringifyBox,
  stringifyCircle,
  stringifyHstore,
  stringifyInterval,
  stringifyLine,
  stringifyLseg,
  stringifyPath,
  stringifyPoint,
  stringifyPolygon,
} from "./codecUtils/index.ts";
import type { PgExecutor } from "./executor.ts";
import type {
  PgCodec,
  PgCodecPolymorphism,
  PgDecode,
  PgEncode,
  PgEnumCodec,
  PgEnumValue,
} from "./interfaces.ts";
import { makeParseArrayWithTransform, parseArray } from "./parseArray.ts";

// PERF: `identity` can be shortcut
const identity = <T>(value: T): T => value;

export type PgCodecAttributeViaExplicit = {
  relation: string;
  attribute: string;
};

export type PgCodecAttributeVia = string | PgCodecAttributeViaExplicit;

/** @deprecated Use DataplanPg.PgCodecAttributeExtensions instead */
export type PgCodecAttributeExtensions = DataplanPg.PgCodecAttributeExtensions;

export interface PgCodecAttribute<
  TCodec extends PgCodec = PgCodec,
  TNotNull extends boolean = boolean,
> {
  /**
   * How to translate to/from PG and how to cast.
   */
  codec: TCodec;

  /**
   * Is the column/attribute guaranteed to not be null?
   */
  notNull?: TNotNull;
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
  // ENHANCE: can identicalVia be plural? Is that useful? Maybe a attribute that has
  // multiple foreign key references?
  // Answer: yes it can be plural - consider `parent.id` is identical to
  // `child.parent_id` via the `parent` relation. This is in addition to the
  // existing `item.id` being identical to `topic.id` used by polymorphism.

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

export type PgCodecAttributes<
  TCodecMap extends {
    [attributeName in string]: PgCodecAttribute;
  } = {
    [attributeName in string]: PgCodecAttribute;
  },
> = TCodecMap;

/**
 * Returns a PgCodec for the given builtin Postgres scalar type, optionally
 * pass the following config:
 *
 * - castFromPg: how to wrap the SQL fragment that represents this type so that
 *   it's cast to a suitable type for us to receive via the relevant Postgres
 *   driver
 * - listCastFromPg: as castFromPg, but for usage when the expression type is a
 *   list of this type
 * - fromPg: parse the value from Postgres into JS format
 * - toPg: serialize the value from JS into a format Postgres will understand
 *
 * param type - the name of the Postgres type - see the `pg_type` table
 * param options - the configuration options described above
 */
function t<TFromJavaScript = any, TFromPostgres = string>(): <
  const TName extends string,
>(
  oid: string | undefined,
  type: TName,
  options?: CodecOptions<TFromJavaScript, TFromPostgres>,
) => PgCodec<
  TName,
  undefined,
  TFromPostgres,
  TFromJavaScript,
  undefined,
  undefined,
  undefined
> {
  return (oid, type, options = {}) => {
    const {
      castFromPg,
      listCastFromPg,
      fromPg,
      toPg,
      isBinary,
      isEnum,
      hasNaturalOrdering = false,
      hasNaturalEquality = false,
    } = options;
    return {
      name: type,
      sqlType: sql.identifier(...type.split(".")),
      fromPg: fromPg ?? (identity as any),
      toPg: toPg ?? (identity as any),
      attributes: undefined,
      extensions: { oid: oid },
      castFromPg,
      listCastFromPg,
      executor: null,
      isBinary,
      isEnum,
      hasNaturalOrdering,
      hasNaturalEquality,
      [inspect.custom]: codecInspect,
    };
  };
}

/**
 * As `t`, but for simple types (primitives, i.e. things that make sense to be
 * sorted/ordered)
 */
function s<TFromJavaScript = any, TFromPostgres = string>(): <
  const TName extends string,
>(
  oid: string | undefined,
  type: TName,
  options?: CodecOptions<TFromJavaScript, TFromPostgres>,
) => PgCodec<
  TName,
  undefined,
  TFromPostgres,
  TFromJavaScript,
  undefined,
  undefined,
  undefined
> {
  return (oid, type, options) =>
    t<TFromJavaScript, TFromPostgres>()(oid, type, {
      hasNaturalOrdering: true,
      hasNaturalEquality: true,
      ...options,
    });
}

/**
 * | To put a double quote or backslash in a quoted composite field value,
 * | precede it with a backslash.
 */
function pgWrapQuotesInCompositeValue(str: string): string {
  return `"${str.replace(/["\\]/g, "\\$&")}"`;
}

function toRecordString(val: SQLRawValue): string {
  if (val == null) {
    return "";
  } else if (typeof val === "boolean") {
    return val ? "t" : "f";
  } else if (typeof val === "number") {
    return "" + val;
  } else if (
    // essentially Array.isArray in this context
    typeof val === "object"
  ) {
    const parts = val.map((v) => toListString(v));
    return `{${parts.join(",")}}`;
  } else if (/[(),"\\]/.test(val) || val.length === 0) {
    /*
     * The Postgres manual states:
     *
     * > You can put double quotes around any field value, and must do so if
     * > it contains commas or parentheses.
     *
     * Also:
     *
     * > In particular, fields containing parentheses, commas, double quotes,
     * > or backslashes must be double-quoted. [...] Alternatively, you can
     * > avoid quoting and use backslash-escaping to protect all data
     * > characters that would otherwise be taken as composite syntax.
     *
     * We're going to go with double quoting.
     */
    return pgWrapQuotesInCompositeValue(val);
  } else {
    return "" + val;
  }
}

function pgWrapQuotesInArray(str: string): string {
  return `"${str.replace(/["\\]/g, "\\$&")}"`;
}

function toListString(val: SQLRawValue): string {
  if (val == null) {
    return "NULL";
  } else if (typeof val === "boolean") {
    return val ? "t" : "f";
  } else if (typeof val === "number") {
    return "" + val;
  } else if (
    // essentially Array.isArray in this context
    typeof val === "object"
  ) {
    const parts = val.map((v) => toListString(v));
    return `{${parts.join(",")}}`;
  } else {
    return pgWrapQuotesInArray(val);
  }
}

// TESTS: this needs unit tests!
/**
 * Parses a PostgreSQL record string (e.g. `(1,2,   hi)`) into a tuple (e.g.
 * `["1", "2", "   hi"]`).
 *
 * Postgres says:
 *
 * | The composite output routine will put double quotes around field values if
 * | they are empty strings or contain parentheses, commas, double quotes,
 * | backslashes, or white space. (Doing so for white space is not essential,
 * | but aids legibility.) Double quotes and backslashes embedded in field
 * | values will be doubled.
 *
 * @see {@link https://www.postgresql.org/docs/current/rowtypes.html#id-1.5.7.24.6}
 */
function recordStringToTuple(value: string): Array<string | null> {
  if (!value.startsWith("(") || !value.endsWith(")")) {
    throw new Error(`Unsupported record string '${value}'`);
  }
  let inQuotes = false;
  let current: string | null = null;
  const tuple: Array<string | null> = [];
  // We only need to loop inside the parenthesis. Whitespace is significant in here.
  for (let i = 1, l = value.length - 1; i < l; i++) {
    const char = value[i];
    if (inQuotes) {
      if (current === null) {
        throw new Error("Impossible?");
      }
      if (char === '"') {
        // '""' is an escape for '"'
        if (value[i + 1] === '"') {
          current += value[++i];
        } else {
          inQuotes = false;
          // Expect comma or end
        }
      } else if (char === "\\") {
        // Backslash is literal escape
        current += value[++i];
      } else {
        current += char;
      }
    } else if (char === '"') {
      if (current !== null) {
        throw new Error(
          `Invalid record string attempts to open quotes when value already exists '${value}'`,
        );
      }
      inQuotes = true;
      current = "";
    } else if (char === ",") {
      tuple.push(current);
      current = null;
    } else if (current !== null) {
      current += char;
    } else {
      current = char;
    }
  }
  if (inQuotes) {
    throw new Error(
      `Invalid record string; exits whilst still in quote marks '${value}'`,
    );
  }
  tuple.push(current);
  return tuple;
}

function realAttributeDefs<TAttributes extends PgCodecAttributes>(
  attributes: TAttributes,
): Array<[string, TAttributes[keyof TAttributes]]> {
  const attributeDefs = Object.entries(attributes) as Array<
    [string, TAttributes extends infer U ? U[keyof U] : never]
  >;
  return attributeDefs.filter(
    ([_attributeName, spec]) => !spec.expression && !spec.via,
  );
}

/**
 * Takes a list of attributes and returns a mapping function that takes a
 * composite value and turns it into a string that PostgreSQL could process as
 * the composite value.
 *
 * @see {@link https://www.postgresql.org/docs/current/rowtypes.html#id-1.5.7.24.6}
 */
function makeRecordToSQLRawValue<TAttributes extends PgCodecAttributes>(
  attributes: TAttributes,
): PgEncode<ObjectFromPgCodecAttributes<TAttributes>> {
  const attributeDefs = realAttributeDefs(attributes);
  return (value) => {
    const values = attributeDefs.map(([attributeName, spec]) => {
      const v = value[attributeName];
      const val = v == null ? null : spec.codec.toPg(v);
      return toRecordString(val);
    });
    return `(${values.join(",")})`;
  };
}

export type ObjectFromPgCodecAttributes<TAttributes extends PgCodecAttributes> =
  {
    [attributeName in keyof TAttributes]: TAttributes[attributeName] extends PgCodecAttribute<
      infer UCodec,
      infer UNonNull
    >
      ? UCodec extends PgCodec<any, any, any, infer UFromJs, any, any, any>
        ? UNonNull extends true
          ? Exclude<UFromJs, null | undefined>
          : UFromJs | null
        : never
      : never;
  };

/**
 * Takes a list of attributes and returns a mapping function that takes a
 * PostgreSQL record string value (e.g. `(1,2,"hi")`) and turns it into a
 * JavaScript object. If `asJSON` is true, then instead of a record string value,
 * we expect a JSON array value (typically due to casting).
 *
 * @see {@link https://www.postgresql.org/docs/current/rowtypes.html#id-1.5.7.24.6}
 */
function makeSQLValueToRecord<TAttributes extends PgCodecAttributes>(
  attributes: TAttributes,
  asJSON = false,
): (value: string) => ObjectFromPgCodecAttributes<TAttributes> {
  const attributeDefs = realAttributeDefs(attributes);
  const attributeCount = attributeDefs.length;
  return (value) => {
    const tuple = asJSON ? JSON.parse(value) : recordStringToTuple(value);
    const record = Object.create(null);
    for (let i = 0; i < attributeCount; i++) {
      const [attributeName, spec] = attributeDefs[i];
      const entry = tuple[i];
      record[attributeName] = entry == null ? null : spec.codec.fromPg(entry);
    }
    return record;
  };
}

export type PgRecordTypeCodecSpec<
  TName extends string,
  TAttributes extends PgCodecAttributes,
> = {
  name: TName;
  executor: PgExecutor;
  identifier: SQL;
  attributes: TAttributes;
  polymorphism?: PgCodecPolymorphism<any>;
  description?: string;
  extensions?: Partial<DataplanPg.PgCodecExtensions>;
  isAnonymous?: boolean;
};

const codecInspect: CustomInspectFunction = function (this: PgCodec) {
  const type = this.domainOfCodec
    ? `DomainCodec<${this.domainOfCodec.name}>`
    : this.arrayOfCodec
      ? `ListCodec<${this.arrayOfCodec.name}[]>`
      : this.rangeOfCodec
        ? `RangeCodec<${this.rangeOfCodec.name}>`
        : this.attributes
          ? `RecordCodec`
          : "Codec";
  return `${type}(${this.name})`;
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
export function recordCodec<
  const TName extends string,
  const TAttributes extends PgCodecAttributes,
>(
  config: PgRecordTypeCodecSpec<TName, TAttributes>,
): PgCodec<
  TName,
  TAttributes,
  string,
  ObjectFromPgCodecAttributes<TAttributes>,
  undefined,
  undefined,
  undefined
> {
  const {
    name,
    identifier,
    attributes,
    polymorphism,
    description,
    extensions,
    isAnonymous = false,
    executor,
  } = config;
  return {
    name,
    sqlType: identifier,
    isAnonymous,
    ...makeRecordCodecToFrom(name, attributes),
    attributes,
    polymorphism,
    description,
    extensions,
    executor,
    [inspect.custom]: codecInspect,
  };
}
exportAs("@dataplan/pg", recordCodec, "recordCodec");

function listCastViaUnnest(
  name: string,
  frag: SQL,
  castFromPg: (identifier: SQL) => SQL,
  guaranteedNotNull?: boolean,
) {
  const identifier = sql.identifier(Symbol(name));
  const arraySql = sql`array(${sql.indent(
    sql`select ${castFromPg(identifier)}\nfrom unnest(${frag}) ${identifier}`,
  )})::text`;
  if (guaranteedNotNull) {
    return arraySql;
  } else {
    return sql`(case when (${frag}) is not distinct from null then null::text else ${arraySql} end)`;
  }
}
function makeRecordExpression(
  fragment: SQL,
  attributeDefs: ReadonlyArray<[string, PgCodecAttribute]>,
) {
  /** comma-separated list */
  const csl = sql.join(
    attributeDefs.map(([attrName, attr]) => {
      const expr = sql`((${fragment}).${sql.identifier(attrName)})`;
      if (attr.codec.castFromPg) {
        return attr.codec.castFromPg(expr, attr.codec.notNull);
      } else {
        return sql`(${expr})::text`;
      }
    }),
    ",\n",
  );
  if (attributeDefs.length <= 100) {
    return sql`json_build_array(${sql.indent(csl)})`;
  } else {
    // if (attributeDefs.length <= 16383) {
    return sql`to_json(array[${sql.indent(csl)}])`;
  }
}

function makeRecordCodecToFrom<TAttributes extends PgCodecAttributes>(
  name: string,
  attributes: TAttributes,
): Pick<PgCodec, "fromPg" | "toPg" | "castFromPg" | "listCastFromPg"> {
  const attributeDefs = realAttributeDefs(attributes);
  if (attributeDefs.some(([_attrName, attr]) => attr.codec.castFromPg)) {
    const castFromPg = (fragment: SQL) =>
      sql`case when (${fragment}) is not distinct from null then null::text else ${makeRecordExpression(fragment, attributeDefs)}::text end`;
    return {
      castFromPg,
      listCastFromPg(frag, guaranteedNotNull) {
        return listCastViaUnnest(name, frag, castFromPg, guaranteedNotNull);
      },
      fromPg: makeSQLValueToRecord(attributes, true),
      toPg: makeRecordToSQLRawValue(attributes),
    };
  } else {
    return {
      fromPg: makeSQLValueToRecord(attributes),
      toPg: makeRecordToSQLRawValue(attributes),
    };
  }
}

export type PgEnumCodecSpec<TName extends string, TValue extends string> = {
  name: TName;
  identifier: SQL;
  values: Array<PgEnumValue<TValue> | TValue>;
  description?: string;
  extensions?: Partial<DataplanPg.PgCodecExtensions>;
};

/**
 * Returns a PgCodec that represents a Postgres enum type.
 *
 * - name - the name of the enum
 * - identifier - a pg-sql2 fragment that uniquely identifies this type, suitable to be fed after `::` into an SQL query.
 * - values - a list of the values that this enum can represent
 * - extensions - an optional object that you can use to associate arbitrary data with this type
 */
export function enumCodec<
  const TName extends string,
  const TValue extends string,
>(config: PgEnumCodecSpec<TName, TValue>): PgEnumCodec<TName, TValue> {
  const { name, identifier, values, description, extensions } = config;
  return {
    name,
    sqlType: identifier,
    fromPg: identity as (val: string) => TValue,
    toPg: identity,
    values: values.map((value) =>
      typeof value === "string" ? { value } : value,
    ),
    attributes: undefined,
    description,
    extensions,
    executor: null,
    hasNaturalOrdering: false,
    hasNaturalEquality: true,
    isEnum: true,
  };
}
exportAs("@dataplan/pg", enumCodec, "enumCodec");

export function isEnumCodec<
  TName extends string,
  TValue extends string = string,
>(
  t: PgCodec<TName, any, any, any, any, any, any>,
): t is PgEnumCodec<TName, TValue> {
  return "values" in t;
}

const $$listCodec = Symbol("listCodec");

type CodecWithListCodec<
  TCodec extends PgCodec<any, any, any, any, any, any, any>,
> = TCodec & {
  [$$listCodec]?: PgCodec<
    `${TCodec extends PgCodec<infer UName, any, any, any, any, any, any>
      ? UName
      : never}[]`,
    undefined,
    string,
    TCodec extends PgCodec<any, any, any, infer UFromJs, undefined, any, any>
      ? UFromJs[]
      : any[],
    TCodec,
    undefined,
    undefined
  >;
};

type PgCodecTFromJavaScript<
  TInnerCodec extends PgCodec<any, any, any, any, any, any, any>,
> =
  TInnerCodec extends PgCodec<any, any, any, infer UFromJs, undefined, any, any>
    ? UFromJs
    : any;

/**
 * Given a PgCodec, this returns a new PgCodec that represents a list
 * of the former.
 *
 * List codecs CANNOT BE NESTED - Postgres array types don't have defined
 * dimensionality, so an array of an array of a type doesn't really make sense
 * to Postgres, it being the same as an array of the type.
 *
 * @param listedCodec - the codec that represents the "inner type" of the array
 * @param config - optional configuration for the list codec
 */
export function listOfCodec<
  TInnerCodec extends PgCodec<string, any, any, any, undefined, any, any>,
  TName extends string = `${TInnerCodec extends PgCodec<
    infer UName,
    any,
    any,
    any,
    any,
    any,
    any
  >
    ? UName
    : never}[]`,
>(
  listedCodec: TInnerCodec,
  config?: {
    /** Description for this list type. */
    description?: string;
    /** Metadata to associate with this list type. */
    extensions?: Partial<DataplanPg.PgCodecExtensions>;
    /** Delimiter used to separate entries when Postgres stringifies it. */
    typeDelim?: string;
    /** pg-sql2 fragment that represents the name of this type. */
    identifier?: SQL;
    /** Name for this list type. */
    name?: TName;
  },
): PgCodec<
  TName,
  undefined, // Array has no attributes
  string,
  readonly PgCodecTFromJavaScript<TInnerCodec>[],
  TInnerCodec,
  undefined,
  undefined
> {
  const innerCodec: CodecWithListCodec<TInnerCodec> = listedCodec;

  if (!config && innerCodec[$$listCodec]) {
    return innerCodec[$$listCodec] as any;
  }

  const {
    description,
    extensions,
    identifier = sql`${listedCodec.sqlType}[]`,
    typeDelim = `,`,
    name = `${innerCodec.name}[]` as TName,
  } = config ?? ({} as Record<string, never>);
  const {
    fromPg: innerCodecFromPg,
    toPg: innerCodecToPg,
    listCastFromPg: innerCodecListCastFromPg,
    notNull: innerCodecNotNull,
    executor,
  } = innerCodec;

  const listCodec: PgCodec<
    TName,
    undefined, // Array has no attributes
    string,
    readonly PgCodecTFromJavaScript<TInnerCodec>[],
    TInnerCodec,
    undefined,
    undefined
  > = {
    name,
    sqlType: identifier,
    fromPg:
      innerCodecFromPg === identity && typeDelim === ","
        ? parseArray
        : makeParseArrayWithTransform(innerCodecFromPg, typeDelim),
    toPg: (value) => {
      let result = "{";
      for (let i = 0, l = value.length; i < l; i++) {
        if (i > 0) {
          result += typeDelim;
        }
        const v = value[i];
        if (v == null) {
          result += "NULL";
          continue;
        }
        const str = innerCodecToPg(v);
        if (str == null) {
          result += "NULL";
          continue;
        }
        if (typeof str !== "string" && typeof str !== "number") {
          throw new Error(
            `Do not know how to encode ${inspect(
              str,
            )} to an array (send a PR!)`,
          );
        }
        // > To put a double quote or backslash in a quoted array element
        // > value, precede it with a backslash.
        // -- https://www.postgresql.org/docs/current/arrays.html#ARRAYS-IO
        result += `"${String(str).replace(/[\\"]/g, "\\$&")}"`;
      }
      result += "}";
      return result;
    },
    attributes: undefined,
    description,
    extensions,
    arrayOfCodec: innerCodec,
    ...(innerCodecListCastFromPg
      ? {
          castFromPg: innerCodecListCastFromPg,
          listCastFromPg(frag, guaranteedNotNull) {
            return listCastViaUnnest(
              `${name}_item`,
              frag,
              (identifier) =>
                innerCodecListCastFromPg.call(
                  this,
                  identifier,
                  innerCodecNotNull,
                ),
              guaranteedNotNull,
            );
          },
        }
      : null),
    executor: executor,
    [inspect.custom]: codecInspect,
  };

  if (!config) {
    // Memoize such that every `listOfCodec(foo)` returns the same object.
    Object.defineProperty(innerCodec, $$listCodec, { value: listCodec });
  }

  return listCodec;
}
exportAs("@dataplan/pg", listOfCodec, "listOfCodec");

/**
 * Represents a PostgreSQL `DOMAIN` over the given codec
 *
 * @param innerCodec - the codec that represents the "inner type" of the domain
 * @param name - the name of the domain
 * @param identifier - a pg-sql2 fragment that represents the name of this type
 * @param config - extra details about this domain
 */
export function domainOfCodec<
  TName extends string,
  TInnerCodec extends PgCodec<any, any, any, any, any, any>,
>(
  innerCodec: TInnerCodec,
  name: TName,
  identifier: SQL,
  config: {
    /** Description for this domain. */
    description?: string;
    /** Metadata to associate with this domain. */
    extensions?: Partial<DataplanPg.PgCodecExtensions>;
    /** Whether this domain is not nullable. */
    notNull?: boolean | null;
  } = {},
): PgCodec<
  TName,
  TInnerCodec extends PgCodec<any, infer U, any, any, any, any> ? U : any,
  TInnerCodec extends PgCodec<any, any, infer U, any, any, any> ? U : any,
  undefined,
  TInnerCodec,
  undefined
> {
  const { description, extensions, notNull } = config;
  return {
    // Generally same as underlying type:
    ...innerCodec,

    // Overriding:
    name,
    sqlType: identifier,
    description,
    extensions,
    domainOfCodec: innerCodec.arrayOfCodec ? undefined : innerCodec,
    notNull: Boolean(notNull),
    [inspect.custom]: codecInspect,
  };
}
exportAs("@dataplan/pg", domainOfCodec, "domainOfCodec");

/**
 * @see {@link https://www.postgresql.org/docs/14/rangetypes.html#RANGETYPES-IO}
 *
 * @internal
 */
function escapeRangeValue<
  TInnerCodec extends PgCodec<any, undefined, any, any, undefined, any, any>,
>(value: null | any, innerCodec: TInnerCodec): string {
  if (value == null) {
    return "";
  }
  const encoded = "" + (innerCodec.toPg(value) ?? "");
  // PERF: we don't always need to do this
  return `"${encoded.replace(/"/g, '""')}"`;
}

interface PgRange<T> {
  start: { value: T; inclusive: boolean } | null;
  end: { value: T; inclusive: boolean } | null;
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
export function rangeOfCodec<
  TName extends string,
  TInnerCodec extends PgCodec<
    any,
    undefined,
    any,
    any,
    undefined,
    any,
    undefined
  >,
>(
  innerCodec: TInnerCodec,
  name: TName,
  identifier: SQL,
  config: {
    /** Description for this range. */
    description?: string;
    /** Metadata to associate with this range. */
    extensions?: Partial<DataplanPg.PgCodecExtensions>;
  } = {},
): PgCodec<
  TName,
  undefined,
  string,
  PgRange<unknown>,
  undefined,
  undefined,
  TInnerCodec
> {
  const { description, extensions } = config;
  const needsCast = innerCodec.castFromPg;

  const castFromPg = needsCast
    ? function castFromPg(frag: SQL) {
        return sql`json_build_array(${sql.indent(
          sql`lower_inc(${frag}),\n${innerCodec.castFromPg!(
            sql`lower(${frag})`,
            innerCodec.notNull,
          )},\n${innerCodec.castFromPg!(
            sql`upper(${frag})`,
            innerCodec.notNull,
          )},\nupper_inc(${frag})`,
        )})::text`;
      }
    : null;

  return {
    name,
    sqlType: identifier,
    description,
    extensions,
    rangeOfCodec: innerCodec,
    ...(castFromPg
      ? {
          castFromPg,
          listCastFromPg(frag, guaranteedNotNull) {
            return listCastViaUnnest(name, frag, castFromPg, guaranteedNotNull);
          },
        }
      : null),
    fromPg: needsCast
      ? function (value) {
          const json = JSON.parse(value);
          return {
            start:
              json[1] != null
                ? {
                    value: innerCodec.fromPg(json[1]),
                    inclusive: !!json[0],
                  }
                : null,
            end:
              json[2] != null
                ? {
                    value: innerCodec.fromPg(json[2]),
                    inclusive: !!json[3],
                  }
                : null,
          };
        }
      : function (value) {
          const parsed = rangeParse(value);
          return {
            start:
              parsed.lower != null
                ? {
                    value: innerCodec.fromPg(parsed.lower),
                    inclusive: parsed.isLowerBoundClosed(),
                  }
                : null,
            end:
              parsed.upper != null
                ? {
                    value: innerCodec.fromPg(parsed.upper),
                    inclusive: parsed.isUpperBoundClosed(),
                  }
                : null,
          };
        },
    toPg(value) {
      let str = "";
      if (value.start == null) {
        str += "(";
      } else {
        str += `${value.start.inclusive ? "[" : "("}${escapeRangeValue(
          value.start.value,
          innerCodec,
        )}`;
      }
      str += ",";
      if (value.end == null) {
        str += ")";
      } else {
        str += `${escapeRangeValue(value.end.value, innerCodec)}${
          value.end.inclusive ? "]" : ")"
        }`;
      }
      return str;
    },
    attributes: undefined,
    executor: innerCodec.executor,
    [inspect.custom]: codecInspect,
  };
}
exportAs("@dataplan/pg", rangeOfCodec, "rangeOfCodec");

/**
 * Helper type for common casting methods.
 */
type CodecOptions<TFromJavaScript = any, TFromPostgres = string> = {
  castFromPg?(frag: SQL, guaranteedNotNull?: boolean): SQL;
  listCastFromPg?(frag: SQL, guaranteedNotNull?: boolean): SQL;
  toPg?: PgEncode<TFromJavaScript>;
  fromPg?: PgDecode<TFromJavaScript, TFromPostgres>;
  isBinary?: boolean;
  isEnum?: boolean;

  /**
   * True if doing an equality check for this value would have intuitive
   * results for a human. E.g. `3.0` and `3.0000` when encoded as `float` are
   * the same as a human would expect, so `float` has natural equality. On the
   * other hand Postgres sees the `json` `{"a":1}` as different to
   * `{ "a": 1 }`), whereas a human would see these as the same JSON objects,
   * so `json` does not have natural equality.
   *
   * Typically true primitives will set this true.
   */
  hasNaturalEquality?: boolean;

  /**
   * True if this type has a natural ordering that would be intuitive for a human.
   * For example numbers and text have natural ordering, whereas `{"a":1}` and
   * `{ "a": 2 }` are not so obvious. Similarly, a `point` could be ordered in many
   * ways relative to another point (x-first, then y; y-first, then x; distance
   * from origin first, then angle; etc) so do not have natural order.
   *
   * Typically true primitives will set this true.
   */
  hasNaturalOrdering?: boolean;
};

/**
 * When we can use the raw representation directly, typically suitable for
 * text, varchar, char, etc
 */
const verbatim: CodecOptions = {
  castFromPg: (frag: SQL): SQL => frag,
};

/**
 * Casts to something else before casting to text; e.g. `${expression}::numeric::text`
 */
const castVia = (via: SQL): CodecOptions => ({
  castFromPg(frag) {
    return sql`${sql.parens(frag)}::${via}::text`;
  },
  listCastFromPg(frag) {
    return sql`${sql.parens(frag)}::${via}[]::text[]::text`;
  },
});
const viaNumeric = castVia(sql`numeric`);
// const viaJson = castVia(sql`json`);

/**
 * Casts using to_char to format dates; also handles arrays via unnest.
 */
const viaDateFormat = (
  format: string,
  prefix: SQL = sql.blank,
): CodecOptions => {
  const sqlFormat = sql.literal(format);
  function castFromPg(frag: SQL) {
    return sql`to_char(${prefix}${frag}, ${sqlFormat}::text)`;
  }
  return {
    castFromPg,
    listCastFromPg(frag, guaranteedNotNull) {
      return listCastViaUnnest("entry", frag, castFromPg, guaranteedNotNull);
    },
  };
};

const parseAsTrustedInt = (n: string) => +n;
const jsonParse = (s: string) => JSON.parse(s);
const jsonStringify = (o: JSONValue) => JSON.stringify(o);

const stripSubnet32 = {
  fromPg(value: string) {
    return value.replace(/\/(32|128)$/, "");
  },
};
const reg = { hasNaturalOrdering: false };
/**
 * Built in PostgreSQL types that we support; note the keys are the "ergonomic"
 * names (like 'bigint'), but the values use the underlying PostgreSQL true
 * names (those that would be found in the `pg_type` table).
 */
export const TYPES = {
  void: t<void>()("2278", "void"), // void: 2278
  boolean: s<boolean>()("16", "bool", {
    fromPg: (value) => value[0] === "t",
    toPg: (v) => {
      if (v === true) {
        return "t";
      } else if (v === false) {
        return "f";
      } else {
        throw new Error(
          `${v} isn't a boolean; cowardly refusing to cast it to postgres`,
        );
      }
    },
  }),
  int2: s<number>()("21", "int2", { fromPg: parseAsTrustedInt }),
  int: s<number>()("23", "int4", { fromPg: parseAsTrustedInt }),
  bigint: s<string>()("20", "int8"),
  float4: s<number>()("700", "float4", { fromPg: parseFloat }),
  float: s<number>()("701", "float8", { fromPg: parseFloat }),
  money: s<string>()("790", "money", viaNumeric),
  numeric: s<string>()("1700", "numeric"),
  char: s<string>()("18", "char", verbatim),
  bpchar: s<string>()("1042", "bpchar", verbatim),
  varchar: s<string>()("1043", "varchar", verbatim),
  text: s<string>()("25", "text", verbatim),
  name: s<string>()("19", "name", verbatim),
  json: t<JSONValue, string>()("114", "json", {
    fromPg: jsonParse,
    toPg: jsonStringify,
  }),
  jsonb: t<JSONValue, string>()("3802", "jsonb", {
    fromPg: jsonParse,
    toPg: jsonStringify,
    // We could totally add the following if someone wanted it:
    // hasNaturalEquality: true,
  }),
  jsonpath: t()("4072", "jsonpath"),
  xml: t<string>()("142", "xml"),
  citext: s<string>()(undefined, "citext", verbatim),
  uuid: s<string>()("2950", "uuid", verbatim),
  timestamp: s<string>()(
    "1114",
    "timestamp",
    viaDateFormat('YYYY-MM-DD"T"HH24:MI:SS.US'),
  ),
  timestamptz: s<string>()(
    "1184",
    "timestamptz",
    viaDateFormat('YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'),
  ),
  date: s<string>()("1082", "date", viaDateFormat("YYYY-MM-DD")),
  time: s<string>()(
    "1083",
    "time",
    viaDateFormat("HH24:MI:SS.US", sql`date '1970-01-01' + `),
  ),
  timetz: s<string>()(
    "1266",
    "timetz",
    viaDateFormat("HH24:MI:SS.USTZH:TZM", sql`date '1970-01-01' + `),
  ),
  inet: s<string>()("869", "inet", stripSubnet32),
  regproc: s<string>()("24", "regproc", reg),
  regprocedure: s<string>()("2202", "regprocedure", reg),
  regoper: s<string>()("2203", "regoper", reg),
  regoperator: s<string>()("2204", "regoperator", reg),
  regclass: s<string>()("2205", "regclass", reg),
  regtype: s<string>()("2206", "regtype", reg),
  regrole: s<string>()("4096", "regrole", reg),
  regnamespace: s<string>()("4089", "regnamespace", reg),
  regconfig: s<string>()("3734", "regconfig", reg),
  regdictionary: s<string>()("3769", "regdictionary", reg),
  cidr: s<string>()("650", "cidr"),
  macaddr: s<string>()("829", "macaddr"),
  macaddr8: s<string>()("774", "macaddr8"),
  interval: s<PgInterval, string>()("1186", "interval", {
    ...viaDateFormat(`YYYY_MM_DD_HH24_MI_SS.US`),
    fromPg(value: string): PgInterval {
      const parts = value.split("_").map(parseFloat);
      // Note these are actually all integers except for `seconds`.
      const [years, months, days, hours, minutes, seconds] = parts;
      return { years, months, days, hours, minutes, seconds };
    },
    toPg: stringifyInterval,
  }),
  bit: s<string>()("1560", "bit", { hasNaturalOrdering: false }),
  varbit: s<string>()("1562", "varbit", { hasNaturalOrdering: false }),
  point: t<PgPoint>()("600", "point", {
    fromPg: parsePoint,
    toPg: stringifyPoint,
    hasNaturalEquality: true,
  }),
  line: t<PgLine>()("628", "line", { fromPg: parseLine, toPg: stringifyLine }),
  lseg: t<PgLseg>()("601", "lseg", { fromPg: parseLseg, toPg: stringifyLseg }),
  box: t<PgBox>()("603", "box", { fromPg: parseBox, toPg: stringifyBox }),
  path: t<PgPath>()("602", "path", {
    fromPg: parsePath,
    toPg: stringifyPath,
    hasNaturalEquality: true,
  }),
  polygon: t<PgPolygon>()("604", "polygon", {
    fromPg: parsePolygon,
    toPg: stringifyPolygon,
  }),
  circle: t<PgCircle>()("718", "circle", {
    fromPg: parseCircle,
    toPg: stringifyCircle,
  }),
  hstore: t<PgHStore>()(undefined, "hstore", {
    fromPg: parseHstore,
    toPg: stringifyHstore,
  }),
  bytea: t<Buffer>()("17", "bytea", {
    fromPg(str) {
      // The bytea type supports two formats for input and output: “hex”
      // format and PostgreSQL's historical “escape” format. Both of these
      // are always accepted on input. The output format depends on the
      // configuration parameter bytea_output; the default is hex.
      // -- https://www.postgresql.org/docs/current/datatype-binary.html
      if (str.startsWith("\\x")) {
        // Hex format
        return Buffer.from(str.substring(2), "hex");
      } else {
        // ENHANCE: consider supporting this
        throw new Error(
          `PostgreSQL bytea escape format is currently unsupported, please use \`bytea_output = 'hex'\` in your PostgreSQL configuration.`,
        );
      }
    },
    toPg(data: Buffer) {
      return `\\x${data.toString("hex")}`;
    },
    isBinary: true,
  }),
} as const;
exportAs("@dataplan/pg", TYPES, "TYPES");
for (const [name, codec] of Object.entries(TYPES)) {
  exportAs("@dataplan/pg", codec, ["TYPES", name]);
}

/**
 * For supported builtin type names ('void', 'bool', etc) that will be found in
 * the `pg_catalog` table this will return a PgCodec.
 */
export function getCodecByPgCatalogTypeName(pgCatalogTypeName: string) {
  switch (pgCatalogTypeName) {
    case "void":
      return TYPES.void;
    case "bool":
      return TYPES.boolean;

    case "bytea":
      return TYPES.bytea; // oid: 17

    case "char":
      return TYPES.char;
    case "bpchar":
      return TYPES.bpchar;
    case "varchar":
      return TYPES.varchar;
    case "text":
      return TYPES.text;
    case "name":
      return TYPES.name;
    case "uuid":
      return TYPES.uuid;

    case "xml":
      return TYPES.xml;
    case "json":
      return TYPES.json;
    case "jsonb":
      return TYPES.jsonb;
    case "jsonpath":
      return TYPES.jsonpath;

    case "bit":
      return TYPES.bit;
    case "varbit":
      return TYPES.varbit;

    case "int2":
      return TYPES.int2;
    case "int4":
      return TYPES.int;
    case "int8":
      return TYPES.bigint;
    case "float8":
      return TYPES.float;
    case "float4":
      return TYPES.float4;
    case "numeric":
      return TYPES.numeric;
    case "money":
      return TYPES.money;

    case "box":
      return TYPES.box;
    case "point":
      return TYPES.point;
    case "path":
      return TYPES.path;
    case "line":
      return TYPES.line;
    case "lseg":
      return TYPES.lseg;
    case "circle":
      return TYPES.circle;
    case "polygon":
      return TYPES.polygon;

    case "cidr":
      return TYPES.cidr;
    case "inet":
      return TYPES.inet;
    case "macaddr":
      return TYPES.macaddr;
    case "macaddr8":
      return TYPES.macaddr8;

    case "date":
      return TYPES.date;
    case "timestamp":
      return TYPES.timestamp;
    case "timestamptz":
      return TYPES.timestamptz;
    case "time":
      return TYPES.time;
    case "timetz":
      return TYPES.timetz;
    case "interval":
      return TYPES.interval;

    case "regclass":
      return TYPES.regclass;
    case "regconfig":
      return TYPES.regconfig;
    case "regdictionary":
      return TYPES.regdictionary;
    case "regnamespace":
      return TYPES.regnamespace;
    case "regoper":
      return TYPES.regoper;
    case "regoperator":
      return TYPES.regoperator;
    case "regproc":
      return TYPES.regproc;
    case "regprocedure":
      return TYPES.regprocedure;
    case "regrole":
      return TYPES.regrole;
    case "regtype":
      return TYPES.regtype;
  }
  return null;
}

export function getInnerCodec<
  TCodec extends PgCodec<any, any, any, any, any, any>,
>(
  codec: TCodec,
): TCodec extends PgCodec<
  any,
  any,
  any,
  infer UArray,
  infer UDomain,
  infer URange
>
  ? Exclude<UDomain | UArray | URange, undefined>
  : TCodec {
  if (codec.domainOfCodec) {
    return getInnerCodec(codec.domainOfCodec) as any;
  }
  if (codec.arrayOfCodec) {
    return getInnerCodec(codec.arrayOfCodec) as any;
  }
  if (codec.rangeOfCodec) {
    return getInnerCodec(codec.rangeOfCodec) as any;
  }
  return codec as any;
}
exportAs("@dataplan/pg", getInnerCodec, "getInnerCodec");

export function sqlValueWithCodec(value: unknown, codec: PgCodec) {
  if (isDev && value instanceof Step) {
    throw new Error(
      `sqlValueWithCodec(value, codec) is meant to be called at _execution_ time with runtime values; you've called it with a Step indicating maybe you called it at planning time? You probably want to call something like \`$pgSelect.placeholder($value, codec)\` instead.`,
    );
  }
  return sql`${sql.value(value == null ? null : codec.toPg(value))}::${
    codec.sqlType
  }`;
}
