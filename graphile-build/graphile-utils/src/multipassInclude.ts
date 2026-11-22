import type {} from "graphile-build-pg";
import { includePolicy } from "graphile-build-pg/pg-introspection";

import type {
  QualifiedPgNames,
  ScopedGatherPgIntrospection,
} from "./interfaces.ts";

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
              QualifiedPgNames<TSchemas, "classes">,
              QualifiedPgNames<TSchemas, "functions">,
              QualifiedPgNames<TSchemas, "types">
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
