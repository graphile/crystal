import "graphile-build";
import "./PgTablesPlugin.js";
import "../interfaces.js";
import "graphile-config";

import type { PgRegistry, PgRegistryBuilder, PgCodec } from "@dataplan/pg";
import { makeRegistryBuilder } from "@dataplan/pg";
import type { PromiseOrDirect } from "grafast";
import type { PluginHook } from "graphile-config";
import type { GraphQLType } from "graphql";
import sql from "pg-sql2";

import { getBehavior } from "../behavior.js";
import type { PgCodecMetaLookup } from "../inputUtils.js";
import {
  getCodecMetaLookupFromInput,
  makePgCodecMeta,
} from "../inputUtils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    type HasGraphQLTypeForPgCodec = (
      codec: PgCodec<any, any, any, any, any, any, any>,
      situation?: string,
    ) => boolean;
    type GetGraphQLTypeByPgCodec = (
      codec: PgCodec<any, any, any, any, any, any, any>,
      situation: string,
    ) => GraphQLType | null;
    type GetGraphQLTypeNameByPgCodec = (
      codec: PgCodec<any, any, any, any, any, any, any>,
      situation: string,
    ) => string | null;
    type SetGraphQLTypeForPgCodec = (
      codec: PgCodec<any, any, any, any, any, any, any>,
      situations: string | string[],
      typeName: string,
    ) => void;

    interface Build {
      /**
       * A store of metadata for given codecs. Currently internal as this API
       * may change.
       *
       * @internal
       */
      pgCodecMetaLookup: PgCodecMetaLookup;

      /**
       * Do we already have a GraphQL type to use for the given codec in the
       * given situation?
       */
      hasGraphQLTypeForPgCodec: HasGraphQLTypeForPgCodec;
      /**
       * Get the GraphQL type for the given codec in the given situation.
       */
      getGraphQLTypeByPgCodec: GetGraphQLTypeByPgCodec;
      /**
       * Get the GraphQL type name (string) for the given codec in the given
       * situation.
       */
      getGraphQLTypeNameByPgCodec: GetGraphQLTypeNameByPgCodec;
      /**
       * Set the GraphQL type to use for the given codec in the given
       * situation. If this has already been set, will throw an error.
       */
      setGraphQLTypeForPgCodec: SetGraphQLTypeForPgCodec;

      /**
       * pg-sql2 access on Build to avoid duplicate module issues.
       */
      sql: typeof sql;

      pgGetBehavior: typeof getBehavior;
    }
  }
}

declare global {
  namespace GraphileConfig {
    interface GatherHelpers {
      pgBasics: {
        getRegistryBuilder(): PromiseOrDirect<PgRegistryBuilder<any, any, any>>;
        getRegistry(): PromiseOrDirect<PgRegistry<any, any, any>>;
      };
    }

    interface GatherHooks {
      pgBasics_PgRegistryBuilder_init: PluginHook<
        (event: {
          registryBuilder: PgRegistryBuilder<any, any, any>;
        }) => PromiseOrDirect<void>
      >;
      pgBasics_PgRegistryBuilder_pgCodecs: PluginHook<
        (event: {
          registryBuilder: PgRegistryBuilder<any, any, any>;
        }) => PromiseOrDirect<void>
      >;
      pgBasics_PgRegistryBuilder_pgSources: PluginHook<
        (event: {
          registryBuilder: PgRegistryBuilder<any, any, any>;
        }) => PromiseOrDirect<void>
      >;
      pgBasics_PgRegistryBuilder_pgRelations: PluginHook<
        (event: {
          registryBuilder: PgRegistryBuilder<any, any, any>;
        }) => PromiseOrDirect<void>
      >;
      pgBasics_PgRegistryBuilder_finalize: PluginHook<
        (event: {
          registryBuilder: PgRegistryBuilder<any, any, any>;
        }) => PromiseOrDirect<void>
      >;
      pgBasics_PgRegistry: PluginHook<
        (event: {
          registry: PgRegistry<any, any, any>;
        }) => PromiseOrDirect<void>
      >;
    }
  }
}

interface Cache {}

interface State {
  registryBuilder: PgRegistryBuilder<any, any, any>;
  registry: PromiseOrDirect<PgRegistry<any, any, any>> | null;
}

export const PgBasicsPlugin: GraphileConfig.Plugin = {
  name: "PgBasicsPlugin",
  description:
    "Basic utilities required by many other graphile-build-pg plugins.",
  version: version,

  gather: <GraphileConfig.PluginGatherConfig<"pgBasics", State, Cache>>{
    namespace: "pgBasics",
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
              await info.helpers.pgBasics.getRegistryBuilder();
            await info.process("pgBasics_PgRegistryBuilder_init", {
              registryBuilder,
            });
            await info.process("pgBasics_PgRegistryBuilder_pgCodecs", {
              registryBuilder,
            });
            await info.process("pgBasics_PgRegistryBuilder_pgSources", {
              registryBuilder,
            });
            await info.process("pgBasics_PgRegistryBuilder_pgRelations", {
              registryBuilder,
            });
            await info.process("pgBasics_PgRegistryBuilder_finalize", {
              registryBuilder,
            });
            const registry = registryBuilder.build();
            info.state.registry = registry;
            await info.process("pgBasics_PgRegistry", {
              registry,
            });
            return registry;
          })();
        }
        return info.state.registry;
      },
    },
    async main(output, info) {
      output.pgRegistry = await info.helpers.pgBasics.getRegistry();
    },
  },

  schema: {
    hooks: {
      build(build) {
        const {
          graphql: { GraphQLList, GraphQLNonNull },
        } = build;
        const pgCodecMetaLookup = getCodecMetaLookupFromInput(build.input);

        const getGraphQLTypeNameByPgCodec: GraphileBuild.GetGraphQLTypeNameByPgCodec =
          (codec, situation) => {
            if (codec.arrayOfCodec) {
              throw new Error(
                "Do not use getGraphQLTypeNameByPgCodec with an array type, find the underlying type instead",
              );
            }
            const meta = pgCodecMetaLookup.get(codec);
            if (!meta) {
              throw new Error(
                `Codec '${codec.name}' does not have an entry in pgCodecMetaLookup, someone needs to call setGraphQLTypeForPgCodec passing this codec.`,
              );
            }
            const typeName = meta.typeNameBySituation[situation] ?? null;
            return typeName ?? null;
          };

        const getGraphQLTypeByPgCodec: GraphileBuild.GetGraphQLTypeByPgCodec = (
          codec,
          situation,
        ) => {
          if (!build.status.isInitPhaseComplete) {
            throw new Error(
              `Calling build.getGraphQLTypeByPgCodec before the 'init' phase has completed is not allowed.`,
            );
          }
          if (codec.arrayOfCodec) {
            const type = getGraphQLTypeByPgCodec(codec.arrayOfCodec, situation);
            const nonNull = codec.extensions?.listItemNonNull;
            return type
              ? new GraphQLList(nonNull ? new GraphQLNonNull(type) : type)
              : null;
          }
          const typeName = getGraphQLTypeNameByPgCodec(codec, situation);
          return typeName ? build.getTypeByName(typeName) ?? null : null;
        };

        const hasGraphQLTypeForPgCodec: GraphileBuild.HasGraphQLTypeForPgCodec =
          (codec, situation) => {
            const meta = pgCodecMetaLookup.get(codec);
            if (!meta) {
              return false;
            }
            if (situation != null) {
              const typeName = meta.typeNameBySituation[situation] ?? null;
              return typeName != null;
            } else {
              return Object.keys(meta.typeNameBySituation).length > 0;
            }
          };

        const setGraphQLTypeForPgCodec: GraphileBuild.SetGraphQLTypeForPgCodec =
          (codec, variants, typeName) => {
            build.assertTypeName(typeName);

            let meta = pgCodecMetaLookup.get(codec);
            if (!meta) {
              meta = makePgCodecMeta(codec);
              pgCodecMetaLookup.set(codec, meta);
            }

            const situations_ = Array.isArray(variants) ? variants : [variants];
            for (const situation of situations_) {
              if (meta.typeNameBySituation[situation] != null) {
                // TODO: allow this?
                throw new Error("Type already set");
              }
              meta.typeNameBySituation[situation] = typeName;
            }
          };

        return build.extend(
          build,
          {
            pgCodecMetaLookup,
            getGraphQLTypeNameByPgCodec,
            getGraphQLTypeByPgCodec,
            hasGraphQLTypeForPgCodec,
            setGraphQLTypeForPgCodec,
            sql,
            pgGetBehavior: getBehavior,
            // For slightly better backwards compatibility with v4.
            pgSql: sql,
          },
          "Adding helpers from PgBasicsPlugin",
        );
      },
    },
  },
};
