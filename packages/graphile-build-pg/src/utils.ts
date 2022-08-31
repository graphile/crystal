import { GraphQLNonNull, GraphQLType } from "graphql";

export function tagToString(
  str: undefined | null | boolean | string | (string | boolean)[],
): string | undefined {
  if (!str || (Array.isArray(str) && str.length === 0)) {
    return undefined;
  }
  return Array.isArray(str) ? str.join("\n") : str === true ? " " : str;
}

export function nullableIf<T extends GraphQLType>(
  GraphQLNonNull: { new <T extends GraphQLType>(t: T): GraphQLNonNull<T> },
  condition: boolean,
  type: T,
): T | GraphQLNonNull<T> {
  if (condition) {
    return type;
  } else {
    return new GraphQLNonNull(type);
  }
}
