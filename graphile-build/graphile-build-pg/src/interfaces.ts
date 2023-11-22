import type { GenericPgRegistry, PgRegistry, WithPgClient } from "@dataplan/pg";
import type { PromiseOrDirect } from "grafast";
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
  }
}

export interface PgAdaptor<
  TAdaptor extends
    keyof GraphileConfig.PgDatabaseAdaptorOptions = keyof GraphileConfig.PgDatabaseAdaptorOptions,
> {
  createWithPgClient: (
    adaptorSettings: GraphileConfig.PgServiceConfiguration<TAdaptor>["adaptorSettings"],
    variant?: "SUPERUSER" | null,
  ) => PromiseOrDirect<WithPgClient>;
}

/*
 * Declaration merging to add graphile-build-pg 'tags' to @dataplan/pg
 * extensions so we can easily use them with TypeScript.
 */
declare global {
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

  namespace GraphileBuild {
    interface BuildInput {
      pgRegistry: GenericPgRegistry;
    }
  }
}
