import type { SQL } from "pg-sql2";
import sql from "pg-sql2";
import { parse as arrayParse } from "postgres-array";

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
): PgTypeCodec<TColumns, string, string> {
  return {
    sqlType: identifier,
    fromPg: identity,
    toPg: identity,
    columns,
    extensions,
  };
}
exportAs(recordType, "recordType");

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

export function listOfType<
  TInnerCodec extends PgTypeCodec<any, any, any, undefined>,
>(
  innerCodec: TInnerCodec,
  extensions?: Partial<PgTypeCodecExtensions>,
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
  return {
    sqlType: identifier,
    // TODO: this does __NOT__ handle nulls safely!
    fromPg: (value) =>
      arrayParse(value)
        .flat(100)
        .map((v) => innerCodec.fromPg(v)) as any,
    // TODO: this does __NOT__ handle nulls safely!
    toPg: (value) => (value ? value.map((v) => innerCodec.toPg(v)) : null),
    columns: undefined,
    extensions,
    arrayOfCodec: innerCodec,
    castFromPg: innerCodec.listCastFromPg,
  };
}

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
const viaJson = castVia(sql`json`);

const viaDateFormat = (format: string): Cast => {
  const sqlFormat = sql.literal(format);
  return {
    castFromPg(frag) {
      return sql`to_char(${frag}, ${sqlFormat})`;
    },
    listCastFromPg(frag) {
      return sql`(select array_agg(to_char(t, ${sqlFormat})) from unnest(${frag}) t)::text`;
    },
  };
};

const parseAsInt = (n: string) => parseInt(n, 10);

export const TYPES = {
  boolean: t<boolean>("bool", { fromPg: (value) => value === "true" }),
  int2: t<number>("int2", { fromPg: parseAsInt }),
  int: t<number>("int4", { fromPg: parseAsInt }),
  bigint: t<string>("bigint"),
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

for (const key of Object.keys(TYPES)) {
  exportAs(TYPES[key], ["TYPES", key]);
}
