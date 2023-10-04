/* eslint-disable graphile-export/export-instances */
import type {
  DefaultPgRegistry,
  PgRegistry,
  PgRegistryBuilder,
  DefaultRegistryBuilder,
  EmptyRegistryBuilder,
} from "@dataplan/pg";
import { makeRegistryBuilder } from "@dataplan/pg";
import type { PromiseOrDirect } from "grafast";
import { gatherConfig } from "graphile-build";

import { version } from "../version.js";

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgRegistry: {
        getRegistryBuilder(): PromiseOrDirect<DefaultRegistryBuilder>;
        getRegistry(): PromiseOrDirect<DefaultPgRegistry>;
      };
    }

    interface GatherHooks {
      pgRegistry_PgRegistryBuilder_init(event: {
        registryBuilder: EmptyRegistryBuilder;
      }): PromiseOrDirect<void>;
      pgRegistry_PgRegistryBuilder_pgCodecs(event: {
        registryBuilder: DefaultRegistryBuilder;
      }): PromiseOrDirect<void>;
      pgRegistry_PgRegistryBuilder_pgResources(event: {
        registryBuilder: DefaultRegistryBuilder;
      }): PromiseOrDirect<void>;
      pgRegistry_PgRegistryBuilder_pgRelations(event: {
        registryBuilder: DefaultRegistryBuilder;
      }): PromiseOrDirect<void>;
      pgRegistry_PgRegistryBuilder_finalize(event: {
        registryBuilder: DefaultRegistryBuilder;
      }): PromiseOrDirect<void>;
      pgRegistry_PgRegistry(event: {
        registry: DefaultPgRegistry;
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

  gather: gatherConfig({
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
  }),
};
