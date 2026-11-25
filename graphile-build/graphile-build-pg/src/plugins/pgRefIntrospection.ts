import { parseDatabaseIdentifiers } from "../utils.ts";

export function parseRefHop(part: string) {
  const trimmed = part.trim();
  const matches = trimmed.match(/^\(([^)]+)\)->([^)]+)(?:\(([^)]+)\))?$/);
  if (matches === null) {
    return { table: trimmed, localColumns: null, remoteColumns: null };
  }
  const [, localColumns, table, remoteColumns] = matches;
  return {
    table,
    localColumns: parseDatabaseIdentifiers(localColumns, 1).map(
      ([name]) => name,
    ),
    remoteColumns:
      remoteColumns === undefined
        ? null
        : parseDatabaseIdentifiers(remoteColumns, 1).map(([name]) => name),
  };
}
