import type { PgRegistry, WithPgClient } from "@dataplan/pg";
import type { PromiseOrDirect } from "grafast";

export interface PgResourceTags extends PgSmartTagsDict {
  name: string;

  /** For a computed column function/etc, what field name should we use? */
  fieldName: string;
  /** For a computed column function that performs a mutation, what field name should we use on the payload to store the result? */
  resultFieldName: string;
  behavior: string | string[];
  primaryKey: string;
  foreignKey: string | string[];
  unique: string | string[];
  deprecated: string | string[];
}

export interface PgResourceUniqueTags extends PgSmartTagsDict {
  /** The field name for the root-level accessor for a row by this unique constraint */
  fieldName: string;
  behavior: string | string[];
}

export interface PgCodecRelationTags extends PgSmartTagsDict {
  behavior: string | string[];
  deprecated: string | string[];
}

export interface PgCodecRefTags extends PgSmartTagsDict {
  behavior: string | string[];
  deprecated: string | string[];
}

export interface PgCodecAttributeTags extends PgSmartTagsDict {
  name: string;
  behavior: string | string[];
  notNull: true;
}

export interface PgCodecTags extends PgSmartTagsDict {
  behavior: string | string[];
  deprecated: string | string[];
  implements: string | string[];
  interface: string;
  name: string;
  unionMember: string | string[];
}

export interface PgSmartTagsDict {
  [tagName: string]: null | true | string | (string | true)[];
}

export interface PgAdaptor<
  TAdaptor extends keyof GraphileConfig.PgDatabaseAdaptorOptions = keyof GraphileConfig.PgDatabaseAdaptorOptions,
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
declare module "@dataplan/pg" {
  interface PgResourceExtensions {
    tags: Partial<PgResourceTags>;
    description?: string;
    singleOutputParameterName?: string;
    /** For v4 compatibility, what's the name of the actual table. */
    pg?: {
      serviceName: string;
      schemaName: string;
      name: string;
    };
  }

  interface PgResourceUniqueExtensions {
    tags: Partial<PgResourceUniqueTags>;
    description?: string;
  }

  interface PgCodecRelationExtensions {
    tags: Partial<PgCodecRelationTags>;
    description?: string;
  }

  interface PgCodecRefExtensions {
    tags: Partial<PgCodecRefTags>;
    description?: string;
  }

  interface PgCodecAttributeExtensions {
    tags: Partial<PgCodecAttributeTags>;
    description?: string;
  }

  interface PgCodecExtensions {
    /** If false but the codec has attributes then it's probably a composite type */
    isTableLike?: boolean;
    tags: Partial<PgCodecTags>;
    description?: string;
  }
}

declare global {
  namespace GraphileBuild {
    interface BuildInput {
      pgRegistry: PgRegistry<any, any, any>;
    }
  }
}
