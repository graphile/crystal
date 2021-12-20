declare module "@dataplan/pg" {
  interface PgSourceTags extends PgSmartTagsDict {
    name: string;
    behavior: string | string[];
  }
  interface PgSourceExtensions {
    tags: Partial<PgSourceTags>;
  }

  interface PgSourceColumnTags extends PgSmartTagsDict {
    name: string;
    behavior: string | string[];
  }
  interface PgSourceColumnExtensions {
    tags: Partial<PgSourceColumnTags>;
  }

  interface PgTypeCodecTags extends PgSmartTagsDict {
    name: string;
    behavior: string | string[];
  }
  interface PgTypeCodecExtensions {
    tags: Partial<PgTypeCodecTags>;
  }
}

export interface PgSmartTagsDict {
  [tagName: string]: null | true | string | string[];
}
