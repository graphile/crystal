import type { PgResource } from "@dataplan/pg";
import type {} from "graphile-build";

import type {
  QualifiedPgNames,
  ScopedGatherPgIntrospection,
} from "./interfaces.ts";
import {
  type IdentifierPart,
  parseIdentifierParts,
} from "./parseIdentifierParts.ts";

const DEFAULT_SERVICE_NAME = "main";

export type TableMatch = {
  serviceName?: string;
  schemaName: string;
  tableName: string;
};

type TableMatchStringsForService<
  TServiceName extends string,
  TService,
> = TService extends { schemas: infer TSchemas }
  ?
      | `${IdentifierPart<TServiceName>}.${QualifiedPgNames<TSchemas, "classes">}`
      | (TServiceName extends "main"
          ? QualifiedPgNames<TSchemas, "classes">
          : never)
  : never;

/** Valid string table matches from gather-time generated types, when present. */
export type ScopedTableMatchString<
  TScope extends keyof GraphileBuild.PluginScopes,
> = [ScopedGatherPgIntrospection<TScope>] extends [never]
  ? string
  : {
      [TServiceName in keyof ScopedGatherPgIntrospection<TScope> &
        string]: TableMatchStringsForService<
        TServiceName,
        ScopedGatherPgIntrospection<TScope>[TServiceName]
      >;
    }[keyof ScopedGatherPgIntrospection<TScope> & string];

export type ScopedTableMatch<TScope extends keyof GraphileBuild.PluginScopes> =
  | TableMatch
  | ScopedTableMatchString<TScope>;

export function resolveTableMatch(
  matcher: string | TableMatch,
): Required<TableMatch> {
  if (typeof matcher === "string") {
    const parts = parseIdentifierParts(matcher);
    if (parts.length === 2) {
      return {
        serviceName: DEFAULT_SERVICE_NAME,
        schemaName: parts[0],
        tableName: parts[1],
      };
    } else if (parts.length === 3) {
      return {
        serviceName: parts[0],
        schemaName: parts[1],
        tableName: parts[2],
      };
    } else {
      throw new Error(
        `Invalid match; must be schemaName.tableName or serviceName.schemaName.tableName`,
      );
    }
  } else {
    const {
      serviceName = DEFAULT_SERVICE_NAME,
      schemaName,
      tableName,
    } = matcher;
    return { serviceName, schemaName, tableName };
  }
}

type AnyPgResource = PgResource<any, any, any, any, any, any, any>;

type MatchService<TMatch extends TableMatch> =
  | IdentifierPart<NonNullable<TMatch["serviceName"]>>
  | (undefined extends TMatch["serviceName"] ? "main" : never);

type QualifiedTableMatch<TMatch> = TMatch extends TableMatch
  ? `${"serviceName" extends keyof TMatch ? MatchService<TMatch> : "main"}.${IdentifierPart<TMatch["schemaName"]>}.${IdentifierPart<TMatch["tableName"]>}`
  : TMatch;

type TableResourcesByIdentifier<TTables> = {
  [TTable in keyof TTables & string as IdentifierPart<TTable>]: TTables[TTable];
};

type TableResourceForSchema<
  TMatch,
  TSchema extends string,
  TTables,
> = TMatch extends `${IdentifierPart<TSchema>}.${infer TTable extends keyof TableResourcesByIdentifier<TTables> & string}`
  ? TableResourcesByIdentifier<TTables>[TTable]
  : never;

type TableResourceForSchemas<TMatch, TSchemas> = {
  [TSchema in keyof TSchemas & string]: TableResourceForSchema<
    TMatch,
    TSchema,
    TSchemas[TSchema]
  >;
}[keyof TSchemas & string];

type TableResourceForService<TMatch, TService extends string, TSchemas> =
  | (TMatch extends `${IdentifierPart<TService>}.${infer TRest}`
      ? TableResourceForSchemas<TRest, TSchemas>
      : never)
  | (TService extends "main"
      ? TableResourceForSchemas<TMatch, TSchemas>
      : never);

type ResourceForTableMatch<TMatch, TServices> = TMatch extends string
  ? {
      [TService in keyof TServices & string]: TableResourceForService<
        TMatch,
        TService,
        TServices[TService]
      >;
    }[keyof TServices & string] extends infer TResource
    ? [TResource] extends [never]
      ? AnyPgResource
      : TResource extends AnyPgResource
        ? TResource
        : AnyPgResource
    : never
  : AnyPgResource;

export type TableResource<
  TScope extends keyof GraphileBuild.PluginScopes,
  TMatch,
> = GraphileBuild.PluginScopes[TScope] extends {
  pgTableResources: infer TServices;
}
  ? ResourceForTableMatch<QualifiedTableMatch<TMatch>, TServices>
  : AnyPgResource;
