import type {} from "graphile-build-pg";

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
  name = `MultipassIncludePlugin_${++counter}`,
): GraphileConfig.Plugin {
  const { serviceName = "main", tables, functions, types } = options;
  return {
    name,
    gather: {
      hooks: {
        pgIntrospection_options(info, event) {
          const { multipass } = event.options;
          if (event.serviceName !== serviceName || !multipass) return;

          const { includePolicy } = info.lib.pgIntrospection;
          if (tables != null) {
            multipass.policies.push(
              includePolicy(`${name}_tables`, "classes", tables, [
                "registryCodec",
              ]),
            );
          }
          if (functions != null) {
            multipass.policies.push(
              includePolicy(`${name}_functions`, "procs", functions, [
                "registryCodec",
              ]),
            );
          }
          if (types != null) {
            multipass.policies.push(
              includePolicy(`${name}_types`, "types", types, ["registryCodec"]),
            );
          }
        },
      },
    },
  };
}
