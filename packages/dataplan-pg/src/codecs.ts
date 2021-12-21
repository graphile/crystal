import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type { PgSourceColumns } from "./datasource";
import { exportAs } from "./exportAs";
import type {
  PgEncode,
  PgEnumTypeCodec,
  PgTypeCodec,
  PgTypeCodecExtensions,
} from "./interfaces";

// TODO: optimisation: `identity` can be shortcut
const identity = <T>(value: T): T => value;

const pg2gqlForType = (type: "bool" | "timestamptz" | "timestamp" | string) => {
  switch (type) {
    case "bool": {
      return (value: any) => value === "true";
    }
    case "timestamptz":
    case "timestamp": {
      return (value: any) => new Date(Date.parse(value));
    }
    case "jsonb":
    case "json": {
      return (value: any) => JSON.parse(value);
    }
    default: {
      return identity;
    }
  }
};

const gql2pgForType = (type: string): PgEncode<any> => {
  switch (type) {
    case "jsonb":
    case "json": {
      return (value) => JSON.stringify(value);
    }
    default: {
      return identity;
    }
  }
};

function t<TCanonical = any, TInput = TCanonical>(
  type: string,
): PgTypeCodec<undefined, TCanonical, TInput> {
  return {
    sqlType: sql.identifier(...type.split(".")),
    fromPg: pg2gqlForType(type),
    toPg: gql2pgForType(type),
    columns: undefined,
    extensions: undefined,
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
    fromPg: identity,
    toPg: identity,
    values,
    columns: undefined,
    extensions,
  };
}
exportAs(enumType, "enumType");

export const TYPES = {
  boolean: t<boolean>("bool"),
  int: t<number>("int4"),
  bigint: t<string>("bigint"),
  float: t<number>("float"),
  text: t<string>("text"),
  json: t<string>("json"),
  jsonb: t<string>("jsonb"),
  citext: t<string>("citext"),
  uuid: t<string>("uuid"),
  timestamptz: t<Date, Date | string>("text"),
};
exportAs(TYPES, "TYPES");
for (const key of Object.keys(TYPES)) {
  exportAs(TYPES[key], ["TYPES", key]);
}
