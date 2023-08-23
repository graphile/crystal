import "graphile-build";
import "./PgTablesPlugin.js";
import "../interfaces.js";
import "graphile-config";

import type {
  PgCodec,
  PgCodecRef,
  PgCodecRelation,
  PgCodecWithAttributes,
  PgRefDefinition,
  PgResource,
  PgResourceUnique,
} from "@dataplan/pg";
import * as dataplanPg from "@dataplan/pg";
import type { GraphQLType } from "grafast/graphql";
import sql from "pg-sql2";

import { getBehavior } from "../behavior.js";
import type { PgCodecMetaLookup } from "../inputUtils.js";
import { getCodecMetaLookupFromInput, makePgCodecMeta } from "../inputUtils.js";
import { version } from "../version.js";

declare global {
  namespace GraphileBuild {
    interface BuildVersions {
      "graphile-build-pg": string;
      "@dataplan/pg": string;
    }
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
       * A copy of `import * from "@dataplan/pg"` so that plugins don't need to
       * import it directly.
       */
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      dataplanPg: typeof import("@dataplan/pg");

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

      /**
       * Get a table-like resource for the given codec, assuming exactly one exists.
       */
      pgTableResource<TCodec extends PgCodecWithAttributes>(
        codec: TCodec,
      ): PgResource<
        string,
        TCodec,
        ReadonlyArray<PgResourceUnique>,
        undefined
      > | null;
    }

    interface BehaviorEntities {
      pgCodec: PgCodec;
      pgCodecAttribute: [codec: PgCodecWithAttributes, attributeName: string];
      pgResource: PgResource<any, any, any, any, any>;
      pgResourceUnique: [
        resource: PgResource<any, any, any, any, any>,
        unique: PgResourceUnique,
      ];
      pgCodecRelation: PgCodecRelation;
      pgCodecRef: PgCodecRef;
      pgRefDefinition: PgRefDefinition;
    }
  }
}

export const PgBasicsPlugin: GraphileConfig.Plugin = {
  name: "PgBasicsPlugin",
  description:
    "Basic utilities required by many other graphile-build-pg plugins.",
  version: version,

  schema: {
    globalBehavior: "connection -list",
    entityBehavior: {
      pgCodec: {
        after: ["default", "inferred"],
        provides: ["override"],
        callback(behavior, codec) {
          return [behavior, getBehavior(codec.extensions)];
        },
      },
      pgCodecAttribute: {
        after: ["default", "inferred"],
        provides: ["override"],
        callback(behavior, [codec, attributeName]) {
          if (typeof attributeName !== "string") {
            throw new Error(
              `pgCodecAttribute no longer accepts (codec, attribute) - it now accepts (codec, attributeName). Please update your code. Sorry! (Changed in PostGraphile V5 alpha 13.)`,
            );
          }
          const attribute = codec.attributes[attributeName];
          return [
            behavior,
            getBehavior([codec.extensions, attribute.extensions]),
          ];
        },
      },
      pgResource: {
        after: ["default", "inferred"],
        provides: ["override"],
        callback(behavior, resource) {
          return [
            behavior,
            getBehavior([resource.codec.extensions, resource.extensions]),
          ];
        },
      },
      pgResourceUnique: {
        after: ["default", "inferred"],
        provides: ["override"],
        callback(behavior, [resource, unique]) {
          return [
            behavior,
            getBehavior([
              resource.codec.extensions,
              resource.extensions,
              unique.extensions,
            ]),
          ];
        },
      },
      pgCodecRelation: {
        after: ["default", "inferred"],
        provides: ["override"],
        callback(behavior, relationSpec) {
          return [
            behavior,
            // The behavior is the relation behavior PLUS the remote table
            // behavior. But the relation settings win.
            getBehavior([
              relationSpec.remoteResource.codec.extensions,
              relationSpec.remoteResource.extensions,
              relationSpec.extensions,
            ]),
          ];
        },
      },
      pgCodecRef: {
        after: ["default", "inferred"],
        provides: ["override"],
        callback(behavior, ref) {
          return [
            behavior,
            getBehavior([ref.definition.extensions, ref.extensions]),
          ];
        },
      },
      pgRefDefinition: {
        after: ["default", "inferred"],
        provides: ["override"],
        callback(behavior, refSpec) {
          return [behavior, getBehavior(refSpec.extensions)];
        },
      },
    },

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
        const resourceByCodecCache = new Map<
          PgCodecWithAttributes,
          PgResource<any, any, any, any, any> | null
        >();
        const pgTableResource = <TCodec extends PgCodecWithAttributes>(
          codec: TCodec,
        ): PgResource<
          string,
          TCodec,
          ReadonlyArray<PgResourceUnique>,
          undefined
        > | null => {
          if (resourceByCodecCache.has(codec)) {
            return resourceByCodecCache.get(codec)!;
          }
          const resources = Object.values(
            build.input.pgRegistry.pgResources,
          ).filter(
            (
              r: PgResource<any, any, any, any>,
            ): r is PgResource<string, TCodec, any, undefined> =>
              r.codec === codec &&
              !r.parameters &&
              !r.isVirtual &&
              !r.isUnique &&
              r.executor === codec.executor,
          );
          if (resources.length < 1) {
            resourceByCodecCache.set(codec, null);
            return null;
          } else if (resources.length > 1) {
            console.warn(
              `[WARNING]: detected more than one table-like resource for codec '${codec.name}'; returning nothing to avoid ambiguity.`,
            );
            resourceByCodecCache.set(codec, null);
            return null;
          } else {
            resourceByCodecCache.set(codec, resources[0]);
            return resources[0] as any;
          }
        };

        return build.extend(
          build,
          {
            versions: build.extend(
              build.versions,
              {
                "graphile-build-pg": version,
                "@dataplan/pg": dataplanPg.version,
              },
              "Adding graphile-build-pg and @dataplan/pg version to build.versions",
            ),
            dataplanPg,
            pgCodecMetaLookup,
            getGraphQLTypeNameByPgCodec,
            getGraphQLTypeByPgCodec,
            hasGraphQLTypeForPgCodec,
            setGraphQLTypeForPgCodec,
            sql,
            pgGetBehavior: getBehavior,
            // For slightly better backwards compatibility with v4.
            pgSql: sql,
            pgTableResource,
          },
          "Adding helpers from PgBasicsPlugin",
        );
      },
    },
  },
};
