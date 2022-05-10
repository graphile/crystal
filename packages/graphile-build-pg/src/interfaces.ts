export interface PgSourceTags extends PgSmartTagsDict {
  name: string;
  behavior: string | string[];
}

export interface PgSourceRelationTags extends PgSmartTagsDict {
  behavior: string | string[];
}

export interface PgTypeColumnTags extends PgSmartTagsDict {
  name: string;
  behavior: string | string[];
}

export interface PgTypeCodecTags extends PgSmartTagsDict {
  behavior: string | string[];
  deprecated: string | string[];
}

export interface PgSmartTagsDict {
  [tagName: string]: null | true | string | string[];
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
  }

  interface PgSourceRelationExtensions {
    tags: Partial<PgSourceTags>;
  }

  interface PgTypeColumnExtensions {
    tags: Partial<PgTypeColumnTags>;
  }

  interface PgTypeCodecExtensions {
    tags: Partial<PgTypeCodecTags>;
  }
}
