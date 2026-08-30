import { parseIdentifierParts } from "./parseIdentifierParts.ts";

const DEFAULT_SERVICE_NAME = "main";

export type TableMatch = {
  serviceName?: string;
  schemaName: string;
  tableName: string;
};

export function resolveTableMatch(
  matcher: string | TableMatch,
): Required<TableMatch> {
  if (typeof matcher === "string") {
    const parts = parseIdentifierParts(matcher);
    if (parts.length === 2) {
      return {
        serviceName: DEFAULT_SERVICE_NAME,
        schemaName: parts[0],
        tableName: parts[1],
      };
    } else if (parts.length === 3) {
      return {
        serviceName: parts[0],
        schemaName: parts[1],
        tableName: parts[2],
      };
    } else {
      throw new Error(
        `Invalid match; must be schemaName.tableName or serviceName.schemaName.tableName`,
      );
    }
  } else {
    const {
      serviceName = DEFAULT_SERVICE_NAME,
      schemaName,
      tableName,
    } = matcher;
    return { serviceName, schemaName, tableName };
  }
}
