declare module "@dataplan/pg" {
  interface PgSourceTags extends PgSmartTagsDict {
    name: string;
  }
  interface PgSourceExtensions {
    tags: PgSourceTags;
  }
  interface PgTypeCodecTags extends PgSmartTagsDict {
    name: string;
  }
  interface PgTypeCodecExtensions {
    tags: PgTypeCodecTags;
  }
}

export interface PgSmartTagsDict {
  [tagName: string]: null | true | string | string[];
}
