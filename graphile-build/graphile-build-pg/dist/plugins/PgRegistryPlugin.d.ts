import type { PgRegistry, PgRegistryBuilder } from "@dataplan/pg";
import type { PromiseOrDirect } from "grafast";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            PgRegistryPlugin: true;
        }
        interface GatherHelpers {
            pgRegistry: {
                getRegistryBuilder(): PromiseOrDirect<PgRegistryBuilder<any, any, any, any>>;
                getRegistry(): PromiseOrDirect<PgRegistry<any, any, any, any>>;
            };
        }
        interface GatherHooks {
            pgRegistry_PgRegistryBuilder_init(event: {
                registryBuilder: PgRegistryBuilder<any, any, any, any>;
            }): PromiseOrDirect<void>;
            pgRegistry_PgRegistryBuilder_pgExecutors(event: {
                registryBuilder: PgRegistryBuilder<any, any, any, any>;
            }): PromiseOrDirect<void>;
            pgRegistry_PgRegistryBuilder_pgCodecs(event: {
                registryBuilder: PgRegistryBuilder<any, any, any, any>;
            }): PromiseOrDirect<void>;
            pgRegistry_PgRegistryBuilder_pgResources(event: {
                registryBuilder: PgRegistryBuilder<any, any, any, any>;
            }): PromiseOrDirect<void>;
            pgRegistry_PgRegistryBuilder_pgRelations(event: {
                registryBuilder: PgRegistryBuilder<any, any, any, any>;
            }): PromiseOrDirect<void>;
            pgRegistry_PgRegistryBuilder_finalize(event: {
                registryBuilder: PgRegistryBuilder<any, any, any, any>;
            }): PromiseOrDirect<void>;
            pgRegistry_PgRegistry(event: {
                registry: PgRegistry<any, any, any, any>;
            }): PromiseOrDirect<void>;
        }
    }
}
export declare const PgRegistryPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=PgRegistryPlugin.d.ts.map