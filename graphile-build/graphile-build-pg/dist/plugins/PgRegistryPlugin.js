"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgRegistryPlugin = void 0;
const pg_1 = require("@dataplan/pg");
const graphile_build_1 = require("graphile-build");
const version_js_1 = require("../version.js");
exports.PgRegistryPlugin = {
    name: "PgRegistryPlugin",
    description: "Generates the registry during the gather phase, containing details of all the codecs, resources, relations and behaviors.",
    version: version_js_1.version,
    gather: (0, graphile_build_1.gatherConfig)({
        namespace: "pgRegistry",
        initialCache: () => ({}),
        initialState: () => ({
            registryBuilder: (0, pg_1.makeRegistryBuilder)(),
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
                        const registryBuilder = await info.helpers.pgRegistry.getRegistryBuilder();
                        await info.process("pgRegistry_PgRegistryBuilder_init", {
                            registryBuilder,
                        });
                        await info.process("pgRegistry_PgRegistryBuilder_pgExecutors", {
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
//# sourceMappingURL=PgRegistryPlugin.js.map