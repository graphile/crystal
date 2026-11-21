import type {} from "graphile-build-pg";
import { includePolicy } from "graphile-build-pg/pg-introspection";

let counter = 0;

export function multipassInclude({
  serviceName = "main",
  tables = [],
  functions = [],
  types = [],
}: {
  serviceName?: string;
  tables?: readonly string[];
  functions?: readonly string[];
  types?: readonly string[];
}): GraphileConfig.Plugin {
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
