type PgSmartTagValue = true | string;
export type PgSmartTagValueOrArray = PgSmartTagValue | PgSmartTagValue[];

export interface PgSmartTagsDict {
  [tagName: string]: PgSmartTagValueOrArray;
}

export interface PgSmartTagsAndDescription {
  tags: PgSmartTagsDict;
  description?: string;
}

export const parseSmartComment = (str?: string): PgSmartTagsAndDescription => {
  if (!str) {
    return {
      tags: {},
    };
  }

  let description = "";
  const tags: PgSmartTagsDict = {};

  const lines = str.split(/\r?\n/);
  for (const line of lines) {
    // Ignore empty lines
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      continue;
    }

    if (trimmed[0] !== "@") {
      description += description.length > 0 ? `\n${line}` : line;
      continue;
    }

    // Split by either end of line or whitespace
    const [key, rawValue] = trimmed.substring(1).split(/$|\s/);
    const value = rawValue ? rawValue.trim() : true;

    if (!(key in tags)) {
      tags[key] = value;
      continue;
    }

    const prev = tags[key];
    if (Array.isArray(prev)) {
      prev.push(value);
    } else {
      tags[key] = [prev, value];
    }
  }

  const trimmed = description.trim();
  return {
    tags,
    description: trimmed.length > 0 ? trimmed : undefined,
  };
};
