import type { SQL } from "pg-sql2";
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
} from "./codecUtils";
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
} from "./codecUtils";
import type { PgSourceColumns } from "./datasource";
import { exportAs } from "./exportAs";
import type {
  PgDecode,
  PgEncode,
  PgEnumTypeCodec,
  PgTypeCodec,
  PgTypeCodecExtensions,
} from "./interfaces";

// TODO: optimisation: `identity` can be shortcut
const identity = <T>(value: T): T => value;

function t<TFromJavaScript = any, TFromPostgres = string>(
  type: string,
  {
    castFromPg,
    listCastFromPg,
    fromPg,
    toPg,
  }: Cast<TFromJavaScript, TFromPostgres> = {},
): PgTypeCodec<undefined, TFromPostgres, TFromJavaScript> {
  return {
    sqlType: sql.identifier(...type.split(".")),
    fromPg: fromPg ?? (identity as any),
    toPg: toPg ?? (identity as any),
    columns: undefined,
    extensions: undefined,
    castFromPg,
    listCastFromPg,
  };
}

export function recordType<TColumns extends PgSourceColumns>(
  identifier: SQL,
  columns: TColumns,
  extensions?: Partial<PgTypeCodecExtensions>,
  isAnonymous = false,
): PgTypeCodec<TColumns, string, string> {
  return {
    sqlType: identifier,
    isAnonymous,
    fromPg: identity,
    toPg: identity,
    columns,
    extensions,
  };
}
exportAs(recordType, "recordType");

// TODO: rename to enumCodec
export function enumType<TValue extends string>(
  identifier: SQL,
  values: TValue[],
  extensions?: Partial<PgTypeCodecExtensions>,
): PgEnumTypeCodec<TValue> {
  return {
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
    sqlType: identifier,
    // TODO: this does __NOT__ handle nulls safely!
    fromPg: (value) =>
      arrayParse(value)
        .flat(100)
        .map((v) => innerCodec.fromPg(v)) as any,
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

export function domainOfCodec<
  TInnerCodec extends PgTypeCodec<any, any, any, any>,
>(
  innerCodec: TInnerCodec,
  identifier: SQL,
  {
    extensions,
    notNull,
  }: {
    extensions?: Partial<PgTypeCodecExtensions>;
    notNull?: boolean | null;
  },
): PgTypeCodec<
  TInnerCodec extends PgTypeCodec<infer U, any, any, any> ? U : any,
  TInnerCodec extends PgTypeCodec<any, infer U, any, any> ? U : any,
  TInnerCodec extends PgTypeCodec<any, any, infer U, any> ? U : any,
  TInnerCodec extends PgTypeCodec<any, any, any, infer U> ? U : any
> {
  return {
    // Generally same as underlying type:
    ...innerCodec,

    // Overriding:
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

export function rangeOfCodec<
  TInnerCodec extends PgTypeCodec<undefined, any, any, undefined>,
>(
  innerCodec: TInnerCodec,
  identifier: SQL,
  {
    extensions,
  }: {
    extensions?: Partial<PgTypeCodecExtensions>;
  },
): PgTypeCodec<
  undefined,
  any, // TODO
  any, // TODO
  undefined
> {
  return {
    sqlType: identifier,
    extensions,
    rangeOfCodec: innerCodec,
    fromPg(value) {
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

type Cast<TFromJavaScript = any, TFromPostgres = string> = {
  castFromPg?(frag: SQL): SQL;
  listCastFromPg?(frag: SQL): SQL;
  toPg?: PgEncode<TFromJavaScript>;
  fromPg?: PgDecode<TFromJavaScript, TFromPostgres>;
};

const verbatim: Cast = {
  castFromPg: (frag: SQL): SQL => frag,
};

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

const viaDateFormat = (format: string): Cast => {
  const sqlFormat = sql.literal(format);
  return {
    castFromPg(frag) {
      return sql`to_char(${frag}, ${sqlFormat})`;
    },
    listCastFromPg(frag) {
      return sql`(${sql.indent(
        sql`select array_agg(to_char(t, ${sqlFormat}))\nfrom unnest(${frag}) t`,
      )})::text`;
    },
  };
};

const parseAsInt = (n: string) => parseInt(n, 10);

export const TYPES = {
  void: t<void>("void"), // void: 2278
  boolean: t<boolean>("bool", { fromPg: (value) => value === "true" }),
  int2: t<number>("int2", { fromPg: parseAsInt }),
  int: t<number>("int4", { fromPg: parseAsInt }),
  bigint: t<string>("int8"),
  float4: t<number>("float4", { fromPg: parseFloat }),
  float: t<number>("float", { fromPg: parseFloat }),
  money: t<string>("money", viaNumeric),
  numeric: t<string>("numeric"),
  char: t<string>("char", verbatim),
  varchar: t<string>("varchar", verbatim),
  text: t<string>("text", verbatim),
  json: t<string>("json"),
  jsonb: t<string>("jsonb"),
  xml: t<string>("xml"),
  citext: t<string>("citext", verbatim),
  uuid: t<string>("uuid", verbatim),
  timestamp: t<string>("timestamp", viaDateFormat("YYYY-MM-DD HH24:MI:SS.US")),
  timestamptz: t<string>(
    "timestamptz",
    viaDateFormat('YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'),
  ),
  date: t<string>("date", viaDateFormat("YYYY-MM-DD")),
  time: t<string>("time", viaDateFormat("HH24:MI:SS.US")),
  timetz: t<string>("timetz", viaDateFormat("HH24:MI:SS.US")),
  inet: t<string>("inet"),
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
    case "varchar":
      return TYPES.varchar;
    case "text":
      return TYPES.char;
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
