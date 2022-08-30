export function tagToString(
  str: undefined | string | string[],
): string | undefined {
  if (!str || str.length === 0) {
    return undefined;
  }
  return Array.isArray(str) ? str.join("\n") : str;
}
