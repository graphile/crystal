import type { SQL } from "pg-sql2";
import sql from "pg-sql2";

import type { PgSourceColumns } from "./datasource";
import type { PgTypeCodec } from "./interfaces";

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
      return (value: any) => value;
    }
  }
};

const gql2pgForType = (type: string) => {
  switch (type) {
    case "jsonb":
    case "json": {
      return (value: any) =>
        sql`${sql.value(JSON.stringify(value))}::${sql.identifier(type)}`;
    }
    default: {
      return (value: any) => sql`${sql.value(value)}::${sql.identifier(type)}`;
    }
  }
};

function t<TCanonical = any, TInput = TCanonical>(
  type: string,
): PgTypeCodec<TCanonical, TInput> {
  return {
    sqlType: sql.identifier(...type.split(".")),
    fromPg: pg2gqlForType(type),
    toPg: gql2pgForType(type),
  };
}

export function recordType(
  identifier: SQL,
  columns: PgSourceColumns,
): PgTypeCodec<string, string> {
  return {
    sqlType: identifier,
    fromPg(value) {
      return value;
    },
    toPg(value) {
      return sql`${sql.value(value)}::${identifier}`;
    },
    columns,
  };
}

export function enumType(identifier: SQL): PgTypeCodec<string, string> {
  return {
    sqlType: identifier,
    fromPg(value) {
      return value;
    },
    toPg(value) {
      return sql`${sql.value(value)}::${identifier}`;
    },
  };
}

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
