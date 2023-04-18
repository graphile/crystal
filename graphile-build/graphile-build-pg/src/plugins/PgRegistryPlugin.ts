/* eslint-disable graphile-export/export-instances */
import type { PgRegistry, PgRegistryBuilder } from "@dataplan/pg";
import { makeRegistryBuilder } from "@dataplan/pg";
import type { PromiseOrDirect } from "grafast";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgRegistry: {
        getRegistryBuilder(): PromiseOrDirect<PgRegistryBuilder<any, any, any>>;
        getRegistry(): PromiseOrDirect<PgRegistry<any, any, any>>;
      };
    }

    interface GatherHooks {
      pgRegistry_PgRegistryBuilder_init(event: {
        registryBuilder: PgRegistryBuilder<any, any, any>;
      }): PromiseOrDirect<void>;
      pgRegistry_PgRegistryBuilder_pgCodecs(event: {
        registryBuilder: PgRegistryBuilder<any, any, any>;
      }): PromiseOrDirect<void>;
      pgRegistry_PgRegistryBuilder_pgResources(event: {
        registryBuilder: PgRegistryBuilder<any, any, any>;
      }): PromiseOrDirect<void>;
      pgRegistry_PgRegistryBuilder_pgRelations(event: {
        registryBuilder: PgRegistryBuilder<any, any, any>;
      }): PromiseOrDirect<void>;
      pgRegistry_PgRegistryBuilder_finalize(event: {
        registryBuilder: PgRegistryBuilder<any, any, any>;
      }): PromiseOrDirect<void>;
      pgRegistry_PgRegistry(event: {
        registry: PgRegistry<any, any, any>;
      }): PromiseOrDirect<void>;
    }
  }
}

interface Cache {}

interface State {
  registryBuilder: PgRegistryBuilder<any, any, any>;
  registry: PromiseOrDirect<PgRegistry<any, any, any>> | null;
}

export const PgRegistryPlugin: GraphileConfig.Plugin = {
  name: "PgRegistryPlugin",
  description:
    "Generates the registry during the gather phase, containing details of all the codecs, resources, relations and behaviors.",
  version: version,

  gather: <GraphileConfig.PluginGatherConfig<"pgRegistry", State, Cache>>{
    namespace: "pgRegistry",
    initialCache: (): Cache => ({}),
    initialState: (): State => ({
      registryBuilder: makeRegistryBuilder(),
      registry: null,
    }),
    helpers: {
      getRegistryBuilder(info) {
        const { registryBuilder } = info.state;
        return registryBuilder;
      },
      async getRegistry(info) {
        if (!info.state.registry) {
          info.state.registry = (async () => {
            const registryBuilder =
              await info.helpers.pgRegistry.getRegistryBuilder();
            await info.process("pgRegistry_PgRegistryBuilder_init", {
              registryBuilder,
            });
            await info.process("pgRegistry_PgRegistryBuilder_pgCodecs", {
              registryBuilder,
            });
            await info.process("pgRegistry_PgRegistryBuilder_pgResources", {
              registryBuilder,
            });
            await info.process("pgRegistry_PgRegistryBuilder_pgRelations", {
              registryBuilder,
            });
            await info.process("pgRegistry_PgRegistryBuilder_finalize", {
              registryBuilder,
            });
            const registry = registryBuilder.build();
            info.state.registry = registry;
            await info.process("pgRegistry_PgRegistry", {
              registry,
            });
            return registry;
          })();
        }
        return info.state.registry;
      },
    },
    async main(output, info) {
      output.pgRegistry = await info.helpers.pgRegistry.getRegistry();
    },
  },
};
