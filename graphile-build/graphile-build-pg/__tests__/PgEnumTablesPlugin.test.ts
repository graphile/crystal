import { withPgClientFromPgService } from "@dataplan/pg";
import type {} from "graphile-build";
import sql from "pg-sql2";

import { PgEnumTablesPlugin } from "../dist/plugins/PgEnumTablesPlugin.js";

jest.mock("@dataplan/pg", () => ({
  ...jest.requireActual("@dataplan/pg"),
  withPgClientFromPgService: jest.fn(),
}));

test("uses the introspection settings to read enum table values", async () => {
  const pgSettingsForIntrospection = { role: "introspection_role" };
  const pgService = {
    name: "main",
    pgSettingsForIntrospection,
  };
  const mockedWithPgClientFromPgService = jest.mocked(
    withPgClientFromPgService,
  );
  mockedWithPgClientFromPgService.mockResolvedValue({ rows: [] });

  const getIntrospectionData =
    PgEnumTablesPlugin.gather?.helpers?.getIntrospectionData;
  if (!getIntrospectionData) {
    throw new Error("PgEnumTablesPlugin.getIntrospectionData is not defined");
  }

  await getIntrospectionData(
    {
      lib: { sql },
      resolvedPreset: { pgServices: [pgService] },
    } as never,
    "main",
    {
      getNamespace: () => ({ nspname: "app" }),
      relname: "status",
    } as never,
    [{ attname: "value" }] as never,
  );

  expect(mockedWithPgClientFromPgService).toHaveBeenCalledWith(
    pgService,
    pgSettingsForIntrospection,
    expect.any(Function),
  );
});
