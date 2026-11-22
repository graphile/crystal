import type {} from "graphile-build-pg";
import { includePolicy } from "graphile-build-pg/pg-introspection";

import type { ScopedGatherPgIntrospection } from "./interfaces.ts";
import type { IdentifierPart } from "./parseIdentifierParts.ts";

type QualifiedNames<
  TSchemas,
  TKind extends "classes" | "functions" | "types",
> = {
  [TSchema in keyof TSchemas & string]: TSchemas[TSchema] extends Record<
    TKind,
    infer TEntries
  >
    ? `${IdentifierPart<TSchema>}.${IdentifierPart<keyof TEntries & string>}`
    : never;
}[keyof TSchemas & string];

type IncludeOptions<
  TTable extends string,
  TFunction extends string,
  TType extends string,
> = {
  tables?: readonly TTable[];
  functions?: readonly TFunction[];
  types?: readonly TType[];
};

type UnscopedOptions = { serviceName?: string } & IncludeOptions<
  string,
  string,
  string
>;

type ScopedOptions<TIntrospection> = [TIntrospection] extends [never]
  ? UnscopedOptions
  : {
      [TService in keyof TIntrospection &
        string]: TIntrospection[TService] extends { schemas: infer TSchemas }
        ? (TService extends "main"
            ? { serviceName?: TService }
            : { serviceName: TService }) &
            IncludeOptions<
              QualifiedNames<TSchemas, "classes">,
              QualifiedNames<TSchemas, "functions">,
              QualifiedNames<TSchemas, "types">
            >
        : never;
    }[keyof TIntrospection & string];

let counter = 0;

export function multipassInclude<
  TScope extends keyof GraphileBuild.PluginScopes = "default",
>(
  options: ScopedOptions<ScopedGatherPgIntrospection<TScope>>,
): GraphileConfig.Plugin {
  const {
    serviceName = "main",
    tables = [],
    functions = [],
    types = [],
  } = options;
  const name = `MultipassIncludePlugin_${++counter}`;
  return {
    name,
    gather: {
      hooks: {
        pgIntrospection_options(_info, event) {
          const { multipass } = event.options;
          if (event.serviceName !== serviceName || !multipass) return;
          multipass.policies = [
            ...(multipass.policies ?? []),
            includePolicy(`${name}_tables`, "classes", tables, [
              "registryCodec",
            ]),
            includePolicy(`${name}_functions`, "procs", functions, [
              "registryCodec",
            ]),
            includePolicy(`${name}_types`, "types", types, ["registryCodec"]),
          ];
        },
      },
    },
  };
}
