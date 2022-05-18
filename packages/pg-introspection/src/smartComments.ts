export interface PgSmartTagsDict {
  [tagName: string]: null | true | string | (string | true)[];
}

export interface PgSmartTagsAndDescription {
  tags: PgSmartTagsDict;
  description: string | undefined;
}

export const parseSmartComment = (
  str: string | undefined,
): PgSmartTagsAndDescription => {
  const result: PgSmartTagsAndDescription = {
    tags: Object.create(null),
    description: "",
  };
  if (str) {
    str.split(/\r?\n/).forEach((line) => {
      if (result.description !== "") {
        result.description += `\n${line}`;
        return;
      }
      const match = line.match(/^@[a-zA-Z][a-zA-Z0-9_]*($|\s)/);
      if (!match) {
        result.description = line;
        return;
      }
      const key = match[0].slice(1).trim();
      const value = match[0] === line ? true : line.replace(match[0], "");
      if (key in result.tags) {
        const prev = result.tags[key] as string | true | Array<string | true>;
        if (Array.isArray(prev)) {
          prev.push(value);
        } else {
          result.tags[key] = [prev, value];
        }
      } else {
        result.tags[key] = value;
      }
    });
  }
  if (result.description === "") {
    result.description = undefined;
  }
  return result;
};
