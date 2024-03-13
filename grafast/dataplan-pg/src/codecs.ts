import type { JSONValue } from "grafast";
import { exportAs } from "grafast";
import type { SQL, SQLRawValue } from "pg-sql2";
import sql from "pg-sql2";
import { parse as arrayParse } from "postgres-array";
import { parse as rangeParse } from "postgres-range";

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
} from "./codecUtils/index.js";
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
} from "./codecUtils/index.js";
import type { PgExecutor } from "./executor.js";
import { inspect } from "./inspect.js";
import type {
  PgCodec,
  PgCodecExtensions,
  PgCodecPolymorphism,
  PgDecode,
  PgEncode,
  PgEnumCodec,
  PgEnumValue,
} from "./interfaces.js";

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
  // ENHANCE: can identicalVia be plural? Is that useful? Maybe a attribute that has
  // multiple foreign key references?

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
  options?: Cast<TFromJavaScript, TFromPostgres>,
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
    const { castFromPg, listCastFromPg, fromPg, toPg, isBinary } = options;
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
    };
  };
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
  };
}
exportAs("@dataplan/pg", recordCodec, "recordCodec");

function makeRecordCodecToFrom<TAttributes extends PgCodecAttributes>(
  name: string,
  attributes: TAttributes,
): Pick<PgCodec, "fromPg" | "toPg" | "castFromPg" | "listCastFromPg"> {
  const attributeDefs = realAttributeDefs(attributes);
  if (attributeDefs.some(([_attrName, attr]) => attr.codec.castFromPg)) {
    const castFromPg = (fragment: SQL) => {
      return sql`case when (${fragment}) is not distinct from null then null::text else json_build_array(${sql.join(
        attributeDefs.map(([attrName, attr]) => {
          const expr = sql`((${fragment}).${sql.identifier(attrName)})`;
          if (attr.codec.castFromPg) {
            return attr.codec.castFromPg(expr);
          } else {
            return expr;
          }
        }),
        ", ",
      )})::text end`;
    };
    return {
      castFromPg,
      listCastFromPg(frag) {
        const identifier = sql.identifier(Symbol(name));
        return sql`(${sql.indent(
          sql`select array_agg(${castFromPg(
            identifier,
          )})\nfrom unnest(${frag}) ${identifier}`,
        )})::text`;
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
    description?: string;
    extensions?: Partial<PgCodecExtensions>;
    typeDelim?: string;
    identifier?: SQL;
    name?: TName;
  },
): PgCodec<
  TName,
  undefined, // Array has no attributes
  string,
  TInnerCodec extends PgCodec<any, any, any, infer UFromJs, undefined, any, any>
    ? UFromJs[]
    : any[],
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

  const listCodec: PgCodec<
    TName,
    undefined, // Array has no attributes
    string,
    TInnerCodec extends PgCodec<
      any,
      any,
      any,
      infer UFromJs,
      undefined,
      any,
      any
    >
      ? UFromJs[]
      : any[],
    TInnerCodec,
    undefined,
    undefined
  > = {
    name,
    sqlType: identifier,
    fromPg: (value) =>
      arrayParse(value)
        .flat(100)
        .map((v) => (v == null ? null : innerCodec.fromPg(v))) as any,
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
        const str = innerCodec.toPg(v);
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
    ...(innerCodec.listCastFromPg
      ? {
          castFromPg: innerCodec.listCastFromPg,
          listCastFromPg(frag) {
            const identifier = sql.identifier(Symbol(`${name}_item`));
            return sql`(${sql.indent(
              sql`select array_agg(${innerCodec.listCastFromPg!.call(
                this,
                identifier,
              )})\nfrom unnest(${frag}) ${identifier}`,
            )})::text`;
          },
        }
      : null),
    executor: innerCodec.executor,
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
    description?: string;
    extensions?: Partial<PgCodecExtensions>;
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
    description?: string;
    extensions?: Partial<PgCodecExtensions>;
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
          )},\n${innerCodec.castFromPg!(
            sql`upper(${frag})`,
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
          listCastFromPg(frag) {
            const identifier = sql.identifier(Symbol(name));
            return sql`(${sql.indent(
              sql`select array_agg(${castFromPg(
                identifier,
              )})\nfrom unnest(${frag}) ${identifier}`,
            )})::text`;
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
  };
}
exportAs("@dataplan/pg", rangeOfCodec, "rangeOfCodec");

/**
 * Helper type for common casting methods.
 */
type Cast<TFromJavaScript = any, TFromPostgres = string> = {
  castFromPg?(frag: SQL): SQL;
  listCastFromPg?(frag: SQL): SQL;
  toPg?: PgEncode<TFromJavaScript>;
  fromPg?: PgDecode<TFromJavaScript, TFromPostgres>;
  isBinary?: boolean;
};

/**
 * When we can use the raw representation directly, typically suitable for
 * text, varchar, char, etc
 */
const verbatim: Cast = {
  castFromPg: (frag: SQL): SQL => frag,
};

/**
 * Casts to something else before casting to text; e.g. `${expression}::numeric::text`
 */
const castVia = (via: SQL): Cast => ({
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
const viaDateFormat = (format: string, prefix: SQL = sql.blank): Cast => {
  const sqlFormat = sql.literal(format);
  function castFromPg(frag: SQL) {
    return sql`to_char(${prefix}${frag}, ${sqlFormat}::text)`;
  }
  return {
    castFromPg,
    listCastFromPg(frag) {
      const identifier = sql.identifier(Symbol("entry"));
      return sql`(${sql.indent(
        sql`select array_agg(${castFromPg.call(
          this,
          identifier,
        )})\nfrom unnest(${frag}) ${identifier}`,
      )})::text`;
    },
  };
};

const parseAsInt = (n: string) => parseInt(n, 10);
const jsonParse = (s: string) => JSON.parse(s);
const jsonStringify = (o: JSONValue) => JSON.stringify(o);

const stripSubnet32 = {
  fromPg(value: string) {
    return value.replace(/\/(32|128)$/, "");
  },
};

/**
 * Built in PostgreSQL types that we support; note the keys are the "ergonomic"
 * names (like 'bigint'), but the values use the underlying PostgreSQL true
 * names (those that would be found in the `pg_type` table).
 */
export const TYPES = {
  void: t<void>()("2278", "void"), // void: 2278
  boolean: t<boolean>()("16", "bool", {
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
  int2: t<number>()("21", "int2", { fromPg: parseAsInt }),
  int: t<number>()("23", "int4", { fromPg: parseAsInt }),
  bigint: t<string>()("20", "int8"),
  float4: t<number>()("700", "float4", { fromPg: parseFloat }),
  float: t<number>()("701", "float8", { fromPg: parseFloat }),
  money: t<string>()("790", "money", viaNumeric),
  numeric: t<string>()("1700", "numeric"),
  char: t<string>()("18", "char", verbatim),
  bpchar: t<string>()("1042", "bpchar", verbatim),
  varchar: t<string>()("1043", "varchar", verbatim),
  text: t<string>()("25", "text", verbatim),
  name: t<string>()("19", "name", verbatim),
  json: t<JSONValue, string>()("114", "json", {
    fromPg: jsonParse,
    toPg: jsonStringify,
  }),
  jsonb: t<JSONValue, string>()("3802", "jsonb", {
    fromPg: jsonParse,
    toPg: jsonStringify,
  }),
  xml: t<string>()("142", "xml"),
  citext: t<string>()(undefined, "citext", verbatim),
  uuid: t<string>()("2950", "uuid", verbatim),
  timestamp: t<string>()(
    "1114",
    "timestamp",
    viaDateFormat('YYYY-MM-DD"T"HH24:MI:SS.US'),
  ),
  timestamptz: t<string>()(
    "1184",
    "timestamptz",
    viaDateFormat('YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'),
  ),
  date: t<string>()("1082", "date", viaDateFormat("YYYY-MM-DD")),
  time: t<string>()(
    "1083",
    "time",
    viaDateFormat("HH24:MI:SS.US", sql`date '1970-01-01' + `),
  ),
  timetz: t<string>()(
    "1266",
    "timetz",
    viaDateFormat("HH24:MI:SS.USTZH:TZM", sql`date '1970-01-01' + `),
  ),
  inet: t<string>()("869", "inet", stripSubnet32),
  regproc: t<string>()("24", "regproc"),
  regprocedure: t<string>()("2202", "regprocedure"),
  regoper: t<string>()("2203", "regoper"),
  regoperator: t<string>()("2204", "regoperator"),
  regclass: t<string>()("2205", "regclass"),
  regtype: t<string>()("2206", "regtype"),
  regrole: t<string>()("4096", "regrole"),
  regnamespace: t<string>()("4089", "regnamespace"),
  regconfig: t<string>()("3734", "regconfig"),
  regdictionary: t<string>()("3769", "regdictionary"),
  cidr: t<string>()("650", "cidr"),
  macaddr: t<string>()("829", "macaddr"),
  macaddr8: t<string>()("774", "macaddr8"),
  interval: t<PgInterval, string>()("1186", "interval", {
    ...viaDateFormat(`YYYY_MM_DD_HH24_MI_SS.US`),
    fromPg(value: string): PgInterval {
      const parts = value.split("_").map(parseFloat);
      // Note these are actually all integers except for `seconds`.
      const [years, months, days, hours, minutes, seconds] = parts;
      return { years, months, days, hours, minutes, seconds };
    },
    toPg: stringifyInterval,
  }),
  bit: t<string>()("1560", "bit"),
  varbit: t<string>()("1562", "varbit"),
  point: t<PgPoint>()("600", "point", {
    fromPg: parsePoint,
    toPg: stringifyPoint,
  }),
  line: t<PgLine>()("628", "line", { fromPg: parseLine, toPg: stringifyLine }),
  lseg: t<PgLseg>()("601", "lseg", { fromPg: parseLseg, toPg: stringifyLseg }),
  box: t<PgBox>()("603", "box", { fromPg: parseBox, toPg: stringifyBox }),
  path: t<PgPath>()("602", "path", { fromPg: parsePath, toPg: stringifyPath }),
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
