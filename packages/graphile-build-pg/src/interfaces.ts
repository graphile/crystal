export interface PgSourceTags extends PgSmartTagsDict {
  name: string;

  /** For v4 compatibility, what's the name of the actual table. */
  originalName: string;

  /** For a computed column function/etc, what field name should we use? */
  fieldName: string;
  behavior: string | string[];
  primaryKey: string;
  foreignKey: string | string[];
  unique: string | string[];
}

export interface PgSourceUniqueTags extends PgSmartTagsDict {
  /** The field name for the root-level accessor for a row by this unique constraint */
  fieldName: string;
  behavior: string | string[];
}

export interface PgSourceRelationTags extends PgSmartTagsDict {
  behavior: string | string[];
}

export interface PgTypeColumnTags extends PgSmartTagsDict {
  name: string;
  behavior: string | string[];
  notNull: true;
}

export interface PgTypeCodecTags extends PgSmartTagsDict {
  behavior: string | string[];
  deprecated: string | string[];
}

export interface PgSmartTagsDict {
  [tagName: string]: null | true | string | (string | true)[];
}

export type KeysOfType<TObject, TValueType> = {
  [key in keyof TObject]: TObject[key] extends TValueType ? key : never;
}[keyof TObject];

/*
 * Declaration merging to add graphile-build-pg 'tags' to @dataplan/pg
 * extensions so we can easily use them with TypeScript.
 */
declare module "@dataplan/pg" {
  interface PgSourceExtensions {
    tags: Partial<PgSourceTags>;
    description?: string;
  }

  interface PgSourceUniqueExtensions {
    tags: Partial<PgSourceUniqueTags>;
    description?: string;
  }

  interface PgSourceRelationExtensions {
    tags: Partial<PgSourceRelationTags>;
    description?: string;
  }

  interface PgTypeColumnExtensions {
    tags: Partial<PgTypeColumnTags>;
    description?: string;
  }

  interface PgTypeCodecExtensions {
    /** If false but the codec has columns then it's probably a composite type */
    isTableLike?: boolean;
    tags: Partial<PgTypeCodecTags>;
    description?: string;
  }
}
