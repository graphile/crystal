import type { SQL, SQLRawValue } from "pg-sql2";
import sql from "pg-sql2";
import { parse as arrayParse } from "postgres-array";
import { parse as rangeParse } from "postgres-range";
import { inspect } from "util";

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
import { exportAs } from "./exportAs.js";
import type {
  PgDecode,
  PgEncode,
  PgEnumTypeCodec,
  PgTypeCodec,
  PgTypeCodecExtensions,
} from "./interfaces.js";

// TODO: optimisation: `identity` can be shortcut
const identity = <T>(value: T): T => value;

export type PgTypeColumnViaExplicit = { relation: string; attribute: string };
export type PgTypeColumnVia = string | PgTypeColumnViaExplicit;

export interface PgTypeColumnExtensions {}

export interface PgTypeColumn<TCanonical = any, TInput = TCanonical> {
  /**
   * How to translate to/from PG and how to cast.
   */
  codec: PgTypeCodec<any, TCanonical, TInput>;

  /**
   * Is the column/attribute guaranteed to not be null?
   */
  notNull: boolean;
  hasDefault?: boolean;

  /**
   * The SQL expression for a derivative attributes, e.g.:
   *
   * ```js
   * expression: (alias) => sql`${alias}.first_name || ' ' || ${alias}.last_name`
   * ```
   */
  expression?: (alias: SQL) => SQL;

  // TODO: we could make TypeScript understand the relations on the object
  // rather than just being string.
  /**
   * If this column actually exists on a relation rather than locally, the name
   * of the (unique) relation this column belongs to.
   */
  via?: PgTypeColumnVia;

  /**
   * If the column exists identically on a relation and locally (e.g.
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
  identicalVia?: PgTypeColumnVia;
  // TODO: can identicalVia be plural? Is that useful? Maybe a column that has
  // multiple foreign key references?

  /**
   * Set this true if you're using column-level select privileges and there are
   * roles accessible that do not have permission to select it. This will tell
   * us not to auto-select it to more efficiently resolve row nullability
   * questions - we'll only try when the user explicitly tells us to.
   */
  restrictedAccess?: boolean;

  description?: string;

  extensions?: Partial<PgTypeColumnExtensions>;
}

export type PgTypeColumns = {
  [columnName: string]: PgTypeColumn<any>;
};

/**
 * Returns a PgTypeCodec for the given builtin Postgres scalar type, optionally
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
 * @param type - the name of the Postgres type - see the `pg_type` table
 * @param options - the configuration options described above
 */
function t<TFromJavaScript = any, TFromPostgres = string>(
  type: string,
  options: Cast<TFromJavaScript, TFromPostgres> = {},
): PgTypeCodec<undefined, TFromPostgres, TFromJavaScript> {
  const { castFromPg, listCastFromPg, fromPg, toPg } = options;
  return {
    name: type,
    sqlType: sql.identifier(...type.split(".")),
    fromPg: fromPg ?? (identity as any),
    toPg: toPg ?? (identity as any),
    columns: undefined,
    extensions: undefined,
    castFromPg,
    listCastFromPg,
  };
}

function pgWrapQuotesInCompositeValue(str: string): string {
  return `"${str.replace(/"/g, '""')}"`;
}

function toRecordString(val: SQLRawValue): string {
  if (val == null) {
    return "";
  } else if (typeof val === "boolean") {
    return val ? "t" : "f";
  } else if (typeof val === "number") {
    return String(val);
  } else if (Array.isArray(val)) {
    const parts = val.map((v) => toListString(v));
    return `{${parts.join(",")}}`;
  } else if (/[(),]/.test(val) || val.length === 0) {
    // > You can put double quotes around any field value, and must do so if
    // > it contains commas or parentheses.
    return pgWrapQuotesInCompositeValue(val);
  } else {
    return String(val);
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
    return String(val);
  } else if (Array.isArray(val)) {
    const parts = val.map((v) => toListString(v));
    return `{${parts.join(",")}}`;
  } else {
    return pgWrapQuotesInArray(val);
  }
}

// TODO: this needs unit tests!
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

function realColumnDefs(
  columns: PgTypeColumns,
): Array<[string, PgTypeColumn<any, any>]> {
  const columnDefs = Object.entries(columns);
  return columnDefs.filter(
    ([_columnName, spec]) => !spec.expression && !spec.via,
  );
}

/**
 * Takes a list of columns and returns a mapping function that takes a
 * composite value and turns it into a string that PostgreSQL could process as
 * the composite value.
 *
 * @see {@link https://www.postgresql.org/docs/current/rowtypes.html#id-1.5.7.24.6}
 */
function makeRecordToSQLRawValue<TColumns extends PgTypeColumns>(
  columns: TColumns,
): (value: any) => SQLRawValue {
  const columnDefs = realColumnDefs(columns);
  return (value) => {
    const values = columnDefs.map(([columnName, spec]) => {
      const v = value[columnName];
      const val = v == null ? null : spec.codec.toPg(v);
      return toRecordString(val);
    });
    return `(${values.join(",")})`;
  };
}

/**
 * Takes a list of columns and returns a mapping function that takes a
 * PostgreSQL record string value (e.g. `(1,2,"hi")`) and turns it into a
 * JavaScript object.
 *
 * @see {@link https://www.postgresql.org/docs/current/rowtypes.html#id-1.5.7.24.6}
 */
function makeSQLValueToRecord<TColumns extends PgTypeColumns>(
  columns: TColumns,
): (value: string) => object {
  const columnDefs = realColumnDefs(columns);
  const columnCount = columnDefs.length;
  return (value) => {
    const tuple = recordStringToTuple(value);
    const record = Object.create(null);
    for (let i = 0; i < columnCount; i++) {
      const [columnName, spec] = columnDefs[i];
      const entry = tuple[i];
      record[columnName] = spec.codec.fromPg(entry);
    }
    return record;
  };
}

// TODO: Move extensions,isAnonymous into a config object for consistency with other functions in this file.
/**
 * Returns a PgTypeCodec that represents a composite type (a type with
 * attributes).
 *
 * @param name - the name of this type
 * @param identifier - a pg-sql2 fragment that uniquely identifies this type, suitable to be fed after `::` into an SQL query.
 * @param columns - the attributes this composite type has
 * @param extensions - an optional object that you can use to associate arbitrary data with this type
 * @param isAnonymous - if true, this represents an "anonymous" type, typically the return value of a function or something like that. If this is true, then name and identifier are ignored.
 */
export function recordType<TColumns extends PgTypeColumns>(
  name: string,
  identifier: SQL,
  columns: TColumns,
  extensions?: Partial<PgTypeCodecExtensions>,
  isAnonymous = false,
): PgTypeCodec<TColumns, string, object> {
  return {
    name,
    sqlType: identifier,
    isAnonymous,
    fromPg: makeSQLValueToRecord(columns),
    toPg: makeRecordToSQLRawValue(columns),
    columns,
    extensions,
  };
}
exportAs(recordType, "recordType");

// TODO: rename to enumCodec
// TODO: enum values should not be strings but objects so that they can have descriptions, tags, etc.
/**
 * Returns a PgTypeCodec that represents a Postgres enum type.
 *
 * @param name - the name of the enum
 * @param identifier - a pg-sql2 fragment that uniquely identifies this type, suitable to be fed after `::` into an SQL query.
 * @param value - a list of the values that this enum can represent
 * @param extensions - an optional object that you can use to associate arbitrary data with this type
 */
export function enumType<TValue extends string>(
  name: string,
  identifier: SQL,
  values: TValue[],
  extensions?: Partial<PgTypeCodecExtensions>,
): PgEnumTypeCodec<TValue> {
  return {
    name,
    sqlType: identifier,
    fromPg: identity as (val: string) => TValue,
    toPg: identity,
    values,
    columns: undefined,
    extensions,
  };
}
exportAs(enumType, "enumType");

export function isEnumCodec<TValue extends string = string>(
  t: PgTypeCodec<any, any, any, any>,
): t is PgEnumTypeCodec<TValue> {
  return "values" in t;
}

const $$listCodec = Symbol("listCodec");

// TODO: rename to listOfCodec
/**
 * Given a PgTypeCodec, this returns a new PgTypeCodec that represents a list
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
export function listOfType<
  TInnerCodec extends PgTypeCodec<any, any, any, undefined>,
>(
  innerCodec: TInnerCodec,
  extensions?: Partial<PgTypeCodecExtensions>,
  typeDelim = `,`,
  identifier: SQL = sql`${innerCodec.sqlType}[]`,
): PgTypeCodec<
  undefined, // Array has no columns
  string,
  TInnerCodec extends PgTypeCodec<any, any, infer U> ? U[] : any[],
  TInnerCodec
> {
  if (innerCodec.arrayOfCodec) {
    throw new Error("Array types cannot be nested");
  }

  if (innerCodec[$$listCodec]) {
    return innerCodec[$$listCodec];
  }

  const listCodec: PgTypeCodec<
    undefined, // Array has no columns
    string,
    TInnerCodec extends PgTypeCodec<any, any, infer U> ? U[] : any[],
    TInnerCodec
  > = {
    name: innerCodec.name + "[]",
    sqlType: identifier,
    // TODO: this does __NOT__ handle nulls safely!
    fromPg: (value) =>
      value == null
        ? null
        : (arrayParse(value)
            .flat(100)
            .map((v) => innerCodec.fromPg(v)) as any),
    // TODO: this does __NOT__ handle nulls safely!
    toPg: (value) => {
      if (!value) {
        return null;
      }
      const encoded = value.map((v) => {
        if (v == null) {
          return "NULL";
        }
        const str = innerCodec.toPg(v);
        if (str == null) {
          return "NULL";
        }
        if (typeof str !== "string" && typeof str !== "number") {
          throw new Error(
            `Do not known how to encode ${inspect(
              str,
            )} to an array (send a PR!)`,
          );
        }
        return `"${String(str).replace(/"/g, '""')}"`;
      });

      return `{${encoded.join(typeDelim)}}`;
    },
    columns: undefined,
    extensions,
    arrayOfCodec: innerCodec,
    castFromPg: innerCodec.listCastFromPg,
  };

  // Memoize such that every `listOfType(foo)` returns the same object.
  Object.defineProperty(innerCodec, $$listCodec, { value: listCodec });

  return listCodec;
}
exportAs(listOfType, "listOfType");

/**
 * Represents a PostgreSQL `DOMAIN` over the given codec
 *
 * @param innerCodec - the codec that represents the "inner type" of the domain
 * @param name - the name of the domain
 * @param identifier - a pg-sql2 fragment that represents the name of this type
 * @param config - extra details about this domain
 */
export function domainOfCodec<
  TInnerCodec extends PgTypeCodec<any, any, any, any>,
>(
  innerCodec: TInnerCodec,
  name: string,
  identifier: SQL,
  config: {
    extensions?: Partial<PgTypeCodecExtensions>;
    notNull?: boolean | null;
  } = {},
): PgTypeCodec<
  TInnerCodec extends PgTypeCodec<infer U, any, any, any> ? U : any,
  TInnerCodec extends PgTypeCodec<any, infer U, any, any> ? U : any,
  TInnerCodec extends PgTypeCodec<any, any, infer U, any> ? U : any,
  TInnerCodec extends PgTypeCodec<any, any, any, infer U> ? U : any
> {
  const { extensions, notNull } = config;
  return {
    // Generally same as underlying type:
    ...innerCodec,

    // Overriding:
    name,
    sqlType: identifier,
    extensions,
    domainOfCodec: innerCodec,
    notNull: Boolean(notNull),
  };
}
exportAs(domainOfCodec, "domainOfCodec");

/**
 * @see {@link https://www.postgresql.org/docs/14/rangetypes.html#RANGETYPES-IO}
 *
 * @internal
 */
function escapeRangeValue(
  value: null | any,
  innerCodec: PgTypeCodec<undefined, any, any, undefined>,
): string {
  if (value == null) {
    return "";
  }
  const encoded = String(innerCodec.toPg(value));
  // TODO: we don't always need to do this
  return `"${encoded.replace(/"/g, '""')}"`;
}

/**
 * Returns a PgTypeCodec that represents a range of the given inner PgTypeCodec
 * type.
 *
 * @param innerCodec - the PgTypeCodec that represents the bounds of this range
 * @param name - the name of the range
 * @param identifier - a pg-sql2 fragment that represents the name of this type
 * @param config - extra details about this range
 */
export function rangeOfCodec<
  TInnerCodec extends PgTypeCodec<undefined, any, any, undefined>,
>(
  innerCodec: TInnerCodec,
  name: string,
  identifier: SQL,
  config: { extensions?: Partial<PgTypeCodecExtensions> } = {},
): PgTypeCodec<
  undefined,
  any, // TODO
  any, // TODO
  undefined
> {
  const { extensions } = config;
  const needsCast = innerCodec.castFromPg;
  return {
    name,
    sqlType: identifier,
    extensions,
    rangeOfCodec: innerCodec,
    ...(needsCast
      ? {
          castFromPg(frag) {
            return sql`json_build_array(${sql.indent(
              sql`lower_inc(${frag}),\n${innerCodec.castFromPg!(
                sql`lower(${frag})`,
              )},\n${innerCodec.castFromPg!(
                sql`upper(${frag})`,
              )},\nupper_inc(${frag})`,
            )})::text`;
          },
          listCastFromPg(frag) {
            return sql`(${sql.indent(
              sql`select array_agg(${this.castFromPg!(
                sql`t`,
              )})\nfrom unnest(${frag}) t`,
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
                    value: json[1],
                    inclusive: !!json[0],
                  }
                : null,
            end:
              json[2] != null
                ? {
                    value: json[2],
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
                    value: parsed.lower,
                    inclusive: parsed.isLowerBoundClosed(),
                  }
                : null,
            end:
              parsed.upper != null
                ? {
                    value: parsed.upper,
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
    columns: undefined,
  };
}
exportAs(rangeOfCodec, "rangeOfCodec");

/**
 * Helper type for common casting methods.
 */
type Cast<TFromJavaScript = any, TFromPostgres = string> = {
  castFromPg?(frag: SQL): SQL;
  listCastFromPg?(frag: SQL): SQL;
  toPg?: PgEncode<TFromJavaScript>;
  fromPg?: PgDecode<TFromJavaScript, TFromPostgres>;
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
  return {
    castFromPg(frag) {
      return sql`to_char(${prefix}${frag}, ${sqlFormat}::text)`;
    },
    listCastFromPg(frag) {
      return sql`(${sql.indent(
        sql`select array_agg(${this.castFromPg!(
          sql`t`,
        )})\nfrom unnest(${frag}) t`,
      )})::text`;
    },
  };
};

const parseAsInt = (n: string) => parseInt(n, 10);

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
  void: t<void>("void"), // void: 2278
  boolean: t<boolean>("bool", { fromPg: (value) => value === "true" }),
  int2: t<number>("int2", { fromPg: parseAsInt }),
  int: t<number>("int4", { fromPg: parseAsInt }),
  bigint: t<string>("int8"),
  float4: t<number>("float4", { fromPg: parseFloat }),
  float: t<number>("float8", { fromPg: parseFloat }),
  money: t<string>("money", viaNumeric),
  numeric: t<string>("numeric"),
  char: t<string>("char", verbatim),
  bpchar: t<string>("bpchar", verbatim),
  varchar: t<string>("varchar", verbatim),
  text: t<string>("text", verbatim),
  json: t<string>("json"),
  jsonb: t<string>("jsonb"),
  xml: t<string>("xml"),
  citext: t<string>("citext", verbatim),
  uuid: t<string>("uuid", verbatim),
  timestamp: t<string>(
    "timestamp",
    viaDateFormat('YYYY-MM-DD"T"HH24:MI:SS.US'),
  ),
  timestamptz: t<string>(
    "timestamptz",
    viaDateFormat('YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'),
  ),
  date: t<string>("date", viaDateFormat("YYYY-MM-DD")),
  time: t<string>(
    "time",
    viaDateFormat("HH24:MI:SS.US", sql`date '1970-01-01' + `),
  ),
  timetz: t<string>(
    "timetz",
    viaDateFormat("HH24:MI:SS.US", sql`date '1970-01-01' + `),
  ),
  inet: t<string>("inet", stripSubnet32),
  regproc: t<string>("regproc"),
  regprocedure: t<string>("regprocedure"),
  regoper: t<string>("regoper"),
  regoperator: t<string>("regoperator"),
  regclass: t<string>("regclass"),
  regtype: t<string>("regtype"),
  regrole: t<string>("regrole"),
  regnamespace: t<string>("regnamespace"),
  regconfig: t<string>("regconfig"),
  regdictionary: t<string>("regdictionary"),
  cidr: t<string>("cidr"),
  macaddr: t<string>("macaddr"),
  macaddr8: t<string>("macaddr8"),
  interval: t<PgInterval, string>("interval", {
    ...viaDateFormat(`YYYY_MM_DD_HH24_MI_SS.US`),
    fromPg(value: string): PgInterval {
      const parts = value.split("_").map(parseFloat);
      // Note these are actually all integers except for `seconds`.
      const [years, months, days, hours, minutes, seconds] = parts;
      return { years, months, days, hours, minutes, seconds };
    },
    toPg: stringifyInterval,
  }),
  bit: t<string>("bit"),
  varbit: t<string>("varbit"),
  point: t<PgPoint>("point", { fromPg: parsePoint, toPg: stringifyPoint }),
  line: t<PgLine>("line", { fromPg: parseLine, toPg: stringifyLine }),
  lseg: t<PgLseg>("lseg", { fromPg: parseLseg, toPg: stringifyLseg }),
  box: t<PgBox>("box", { fromPg: parseBox, toPg: stringifyBox }),
  path: t<PgPath>("path", { fromPg: parsePath, toPg: stringifyPath }),
  polygon: t<PgPolygon>("polygon", {
    fromPg: parsePolygon,
    toPg: stringifyPolygon,
  }),
  circle: t<PgCircle>("circle", { fromPg: parseCircle, toPg: stringifyCircle }),
  hstore: t<PgHStore>("hstore", { fromPg: parseHstore, toPg: stringifyHstore }),
} as const;
exportAs(TYPES, "TYPES");

/**
 * For supported builtin type names ('void', 'bool', etc) that will be found in
 * the `pg_catalog` table this will return a PgTypeCodec.
 */
export function getCodecByPgCatalogTypeName(
  pgCatalogTypeName: string,
): PgTypeCodec<undefined, any, any, undefined> | null {
  switch (pgCatalogTypeName) {
    case "void":
      return TYPES.void;
    case "bool":
      return TYPES.boolean;

    // TODO!
    //case "bytea":
    //  return TYPES.bytea;

    case "char":
      return TYPES.char;
    case "bpchar":
      return TYPES.bpchar;
    case "varchar":
      return TYPES.varchar;
    case "text":
      return TYPES.text;
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

for (const key of Object.keys(TYPES)) {
  exportAs(TYPES[key], ["TYPES", key]);
}
