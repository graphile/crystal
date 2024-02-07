import type { PgRegistry } from "@dataplan/pg";
export { PgAllRowsPlugin } from "./plugins/PgAllRowsPlugin.js";
export { PgAttributeDeprecationPlugin } from "./plugins/PgAttributeDeprecationPlugin.js";
export { PgAttributesPlugin } from "./plugins/PgAttributesPlugin.js";
export { PgBasicsPlugin } from "./plugins/PgBasicsPlugin.js";
export { PgCodecsPlugin } from "./plugins/PgCodecsPlugin.js";
export { PgConditionArgumentPlugin } from "./plugins/PgConditionArgumentPlugin.js";
export { PgConditionCustomFieldsPlugin } from "./plugins/PgConditionCustomFieldsPlugin.js";
export { PgConnectionArgOrderByDefaultValuePlugin } from "./plugins/PgConnectionArgOrderByDefaultValuePlugin.js";
export { PgConnectionArgOrderByPlugin } from "./plugins/PgConnectionArgOrderByPlugin.js";
export { PgConnectionTotalCountPlugin } from "./plugins/PgConnectionTotalCountPlugin.js";
export { PgCustomTypeFieldPlugin } from "./plugins/PgCustomTypeFieldPlugin.js";
export { PgEnumTablesPlugin } from "./plugins/PgEnumTablesPlugin.js";
export { PgFakeConstraintsPlugin } from "./plugins/PgFakeConstraintsPlugin.js";
export { PgFirstLastBeforeAfterArgsPlugin } from "./plugins/PgFirstLastBeforeAfterArgsPlugin.js";
export { PgInterfaceModeUnionAllRowsPlugin } from "./plugins/PgInterfaceModeUnionAllRowsPlugin.js";
export { PgIntrospectionPlugin } from "./plugins/PgIntrospectionPlugin.js";
export { PgJWTPlugin } from "./plugins/PgJWTPlugin.js";
export { PgLtreePlugin } from "./plugins/PgLtreePlugin.js";
export { PgMutationCreatePlugin } from "./plugins/PgMutationCreatePlugin.js";
export { PgMutationPayloadEdgePlugin } from "./plugins/PgMutationPayloadEdgePlugin.js";
export { PgMutationUpdateDeletePlugin } from "./plugins/PgMutationUpdateDeletePlugin.js";
export { PgNodeIdAttributesPlugin } from "./plugins/PgNodeIdAttributesPlugin.js";
export { PgOrderAllAttributesPlugin } from "./plugins/PgOrderAllAttributesPlugin.js";
export { PgOrderByPrimaryKeyPlugin } from "./plugins/PgOrderByPrimaryKeyPlugin.js";
export { PgOrderCustomFieldsPlugin } from "./plugins/PgOrderCustomFieldsPlugin.js";
export { PgPolymorphismPlugin } from "./plugins/PgPolymorphismPlugin.js";
export { PgProceduresPlugin } from "./plugins/PgProceduresPlugin.js";
export { PgRBACPlugin } from "./plugins/PgRBACPlugin.js";
export { PgRegistryPlugin } from "./plugins/PgRegistryPlugin.js";
export { PgRelationsPlugin } from "./plugins/PgRelationsPlugin.js";
export { PgRowByUniquePlugin } from "./plugins/PgRowByUniquePlugin.js";
export { PgTableNodePlugin } from "./plugins/PgTableNodePlugin.js";
export { PgTablesPlugin } from "./plugins/PgTablesPlugin.js";
export { PgTypesPlugin } from "./plugins/PgTypesPlugin.js";
export { defaultPreset } from "./preset.js";
export {
  addBehaviorToTags,
  parseDatabaseIdentifier,
  parseDatabaseIdentifiers,
} from "./utils.js";
export { version } from "./version.js";

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
      /** For functions returning polymorphic type, which type to choose? */
      returnType: string;
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
    }

    interface PgSmartTagsDict {
      [tagName: string]: null | true | string | (string | true)[];
    }

    interface BuildInput {
      pgRegistry: PgRegistry;
    }
  }

  /*
   * Declaration merging to add graphile-build-pg 'tags' to @dataplan/pg
   * extensions so we can easily use them with TypeScript.
   */
  namespace DataplanPg {
    interface PgResourceExtensions {
      tags: Partial<GraphileBuild.PgResourceTags>;
      singleOutputParameterName?: string;
      /** For v4 compatibility, what's the name of the actual table. */
      pg?: {
        serviceName: string;
        schemaName: string;
        name: string;
      };
    }

    interface PgResourceUniqueExtensions {
      tags: Partial<GraphileBuild.PgResourceUniqueTags>;
    }

    interface PgCodecRelationExtensions {
      tags: Partial<GraphileBuild.PgCodecRelationTags>;
    }

    interface PgCodecRefExtensions {
      tags: Partial<GraphileBuild.PgCodecRefTags>;
    }

    interface PgCodecAttributeExtensions {
      tags: Partial<GraphileBuild.PgCodecAttributeTags>;
    }

    interface PgCodecExtensions {
      /** If false but the codec has attributes then it's probably a composite type */
      isTableLike?: boolean;
      tags: Partial<GraphileBuild.PgCodecTags>;
    }
  }
}

export {
  getWithPgClientFromPgService,
  withPgClientFromPgService,
} from "@dataplan/pg";
