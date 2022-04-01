declare module "@dataplan/pg" {
  interface PgSourceTags extends PgSmartTagsDict {
    name: string;
    behavior: string | string[];
  }
  interface PgSourceExtensions {
    tags: Partial<PgSourceTags>;
  }

  interface PgSourceRelationTags extends PgSmartTagsDict {
    behavior: string | string[];
  }
  interface PgSourceRelationExtensions {
    tags: Partial<PgSourceTags>;
  }

  interface PgTypeColumnTags extends PgSmartTagsDict {
    name: string;
    behavior: string | string[];
  }
  interface PgTypeColumnExtensions {
    tags: Partial<PgTypeColumnTags>;
  }

  interface PgTypeCodecTags extends PgSmartTagsDict {
    behavior: string | string[];
  }
  interface PgTypeCodecExtensions {
    tags: Partial<PgTypeCodecTags>;
  }
}

export interface PgSmartTagsDict {
  [tagName: string]: null | true | string | string[];
}
