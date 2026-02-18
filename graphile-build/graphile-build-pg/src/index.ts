import type { PgRegistry } from "@dataplan/pg";

import type { PartitionExpose } from "./interfaces.ts";
export { PgAllRowsPlugin } from "./plugins/PgAllRowsPlugin.ts";
export { PgAttributeDeprecationPlugin } from "./plugins/PgAttributeDeprecationPlugin.ts";
export { PgAttributesPlugin } from "./plugins/PgAttributesPlugin.ts";
export { PgBasicsPlugin } from "./plugins/PgBasicsPlugin.ts";
export { PgCodecsPlugin } from "./plugins/PgCodecsPlugin.ts";
export { PgConditionArgumentPlugin } from "./plugins/PgConditionArgumentPlugin.ts";
export { PgConditionCustomFieldsPlugin } from "./plugins/PgConditionCustomFieldsPlugin.ts";
export { PgConnectionArgOrderByDefaultValuePlugin } from "./plugins/PgConnectionArgOrderByDefaultValuePlugin.ts";
export { PgConnectionArgOrderByPlugin } from "./plugins/PgConnectionArgOrderByPlugin.ts";
export { PgConnectionTotalCountPlugin } from "./plugins/PgConnectionTotalCountPlugin.ts";
export { PgCustomTypeFieldPlugin } from "./plugins/PgCustomTypeFieldPlugin.ts";
export { PgEnumDomainsPlugin } from "./plugins/PgEnumDomainsPlugin.ts";
export { PgEnumTablesPlugin } from "./plugins/PgEnumTablesPlugin.ts";
export { PgFakeConstraintsPlugin } from "./plugins/PgFakeConstraintsPlugin.ts";
export { PgFirstLastBeforeAfterArgsPlugin } from "./plugins/PgFirstLastBeforeAfterArgsPlugin.ts";
export { PgIndexBehaviorsPlugin } from "./plugins/PgIndexBehaviorsPlugin.ts";
export { PgInterfaceModeUnionAllRowsPlugin } from "./plugins/PgInterfaceModeUnionAllRowsPlugin.ts";
export { PgIntrospectionPlugin } from "./plugins/PgIntrospectionPlugin.ts";
export { PgJWTPlugin } from "./plugins/PgJWTPlugin.ts";
export { PgLtreePlugin } from "./plugins/PgLtreePlugin.ts";
export { PgMutationCreatePlugin } from "./plugins/PgMutationCreatePlugin.ts";
export { PgMutationPayloadEdgePlugin } from "./plugins/PgMutationPayloadEdgePlugin.ts";
export { PgMutationUpdateDeletePlugin } from "./plugins/PgMutationUpdateDeletePlugin.ts";
export { PgNodeIdAttributesPlugin } from "./plugins/PgNodeIdAttributesPlugin.ts";
export { PgOrderAllAttributesPlugin } from "./plugins/PgOrderAllAttributesPlugin.ts";
export { PgOrderByPrimaryKeyPlugin } from "./plugins/PgOrderByPrimaryKeyPlugin.ts";
export { PgOrderCustomFieldsPlugin } from "./plugins/PgOrderCustomFieldsPlugin.ts";
export { PgPolymorphismOnlyArgumentPlugin } from "./plugins/PgPolymorphismOnlyArgumentPlugin.ts";
export { PgPolymorphismPlugin } from "./plugins/PgPolymorphismPlugin.ts";
export { PgProceduresPlugin } from "./plugins/PgProceduresPlugin.ts";
export { PgRBACPlugin } from "./plugins/PgRBACPlugin.ts";
export { PgRefsPlugin } from "./plugins/PgRefsPlugin.ts";
export { PgRegistryPlugin } from "./plugins/PgRegistryPlugin.ts";
export { PgRelationsPlugin } from "./plugins/PgRelationsPlugin.ts";
export { PgRemoveExtensionResourcesPlugin } from "./plugins/PgRemoveExtensionResourcesPlugin.ts";
export { PgRowByUniquePlugin } from "./plugins/PgRowByUniquePlugin.ts";
export { PgTableNodePlugin } from "./plugins/PgTableNodePlugin.ts";
export { PgTablesPlugin } from "./plugins/PgTablesPlugin.ts";
export { PgTypesPlugin } from "./plugins/PgTypesPlugin.ts";
export { defaultPreset } from "./preset.ts";
export { parseDatabaseIdentifier, parseDatabaseIdentifiers } from "./utils.ts";
export { version } from "./version.ts";

declare global {
  namespace GraphileBuild {
    interface PgResourceTags extends PgSmartTagsDict {
      name: string;

      /** For a computed attribute function/etc, what field name should we use? */
      fieldName: string;
      /** For a custom mutation function, what field name should we use on the payload to store the result? */
      resultFieldName: string;
      behavior: string | string[];
      primaryKey: string;
      foreignKey: string | string[];
      unique: string | string[];
      deprecated: string | string[];
      nodeIdCodec: string;
      /** For functions returning polymorphic type, which type to choose? */
      returnType: string;

      /** For enum tables; we shouldn't expose these through GraphQL */
      enum: string | true;

      /** For partitioned tables */
      partitionExpose: PartitionExpose;
    }

    interface PgResourceUniqueTags extends PgSmartTagsDict {
      /** The field name for the root-level accessor for a row by this unique constraint */
      fieldName: string;
      behavior: string | string[];
    }

    interface PgCodecRelationTags extends PgSmartTagsDict {
      behavior: string | string[];
      deprecated: string | string[];
      notNull: true;
    }

    interface PgCodecRefTags extends PgSmartTagsDict {
      behavior: string | string[];
      deprecated: string | string[];
      notNull: true;
    }

    interface PgCodecAttributeTags extends PgSmartTagsDict {
      name: string;
      behavior: string | string[];
      notNull: true;
    }

    interface PgCodecTags extends PgSmartTagsDict {
      behavior: string | string[];
      deprecated: string | string[];
      implements: string | string[];
      interface: string;
      name: string;
      unionMember: string | string[];
      nodeIdCodec: string;
    }

    interface PgSmartTagsDict {
      [tagName: string]: null | true | string | (string | true)[];
    }

    interface BuildInput {
      pgRegistry: PgRegistry;
    }

    interface SchemaOptions {
      /**
       * What to expose when we see a partitioned table (or its child partitions).
       *
       * - `parent` - only expose the parent (partitioned) table, not the
       *   children (partitions)
       * - `child` - only expose the children (partitions), not the parent
       *   partitioned table
       * - `both` - expose both the parent (partitioned) table and all of its
       *   partitions
       */
      pgDefaultPartitionedTableExpose?: PartitionExpose;
    }
  }

  /*
   * Declaration merging to add graphile-build-pg 'tags' to @dataplan/pg
   * extensions so we can easily use them with TypeScript.
   */
  namespace DataplanPg {
    interface PgResourceExtensions {
      description?: string;
      tags?: Partial<GraphileBuild.PgResourceTags>;
      singleOutputParameterName?: string;
      /** For v4 compatibility, what's the name of the actual table. */
      pg?: {
        serviceName: string;
        schemaName: string;
        name: string;
        /**
         * - p = permanent table/sequence
         * - u = unlogged table/sequence
         * - t = temporary table/sequence
         */
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        persistence?: "p" | "u" | "t" | (string & {}) | null;
      };
    }

    interface PgResourceUniqueExtensions {
      tags?: Partial<GraphileBuild.PgResourceUniqueTags>;
    }

    interface PgCodecRelationExtensions {
      tags?: Partial<GraphileBuild.PgCodecRelationTags>;
    }

    interface PgCodecRefExtensions {
      tags?: Partial<GraphileBuild.PgCodecRefTags>;
    }

    interface PgCodecAttributeExtensions {
      tags?: Partial<GraphileBuild.PgCodecAttributeTags>;
    }

    interface PgCodecExtensions {
      /** If false but the codec has attributes then it's probably a composite type */
      isTableLike?: boolean;
      tags?: Partial<GraphileBuild.PgCodecTags>;
      pg?: {
        /** The service from which this type originates; if it represents a built in type then it should be null */
        serviceName: string | null;
        schemaName: string;
        name: string;
        /**
         * - p = permanent table/sequence
         * - u = unlogged table/sequence
         * - t = temporary table/sequence
         */
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        persistence?: "p" | "u" | "t" | (string & {}) | null;
      };
    }
  }
}

export {
  getWithPgClientFromPgService,
  withPgClientFromPgService,
} from "@dataplan/pg";
