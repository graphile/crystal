import type {} from "graphile-build";

import { parseIdentifierParts } from "./parseIdentifierParts.ts";

const DEFAULT_SERVICE_NAME = "main";

export type TableMatch = {
  serviceName?: string;
  schemaName: string;
  tableName: string;
};

type ScopedGatherPgIntrospection<
  TScope extends keyof GraphileBuild.PluginScopes,
> = GraphileBuild.PluginScopes[TScope] extends {
  gather: { pgIntrospection: infer TPgIntrospection };
}
  ? TPgIntrospection
  : never;

type EscapeIdentifierQuotes<TIdentifier extends string> =
  TIdentifier extends `${infer TBefore}"${infer TAfter}`
    ? `${TBefore}""${EscapeIdentifierQuotes<TAfter>}`
    : TIdentifier;

type IdentifierPart<TIdentifier extends string> = TIdentifier extends
  | `${string}.${string}`
  | `${string}"${string}`
  ? `"${EscapeIdentifierQuotes<TIdentifier>}"`
  : TIdentifier;

type TableMatchStringsForService<
  TServiceName extends string,
  TService,
> = TService extends { schemas: infer TSchemas }
  ? {
      [TSchemaName in keyof TSchemas & string]: TSchemas[TSchemaName] extends {
        classes: infer TClasses;
      }
        ? {
            [TTableName in keyof TClasses & string]:
              | `${IdentifierPart<TServiceName>}.${IdentifierPart<TSchemaName>}.${IdentifierPart<TTableName>}`
              | (TServiceName extends "main"
                  ? `${IdentifierPart<TSchemaName>}.${IdentifierPart<TTableName>}`
                  : never);
          }[keyof TClasses & string]
        : never;
    }[keyof TSchemas & string]
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
