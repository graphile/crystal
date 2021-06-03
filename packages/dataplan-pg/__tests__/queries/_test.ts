import { promises as fsp } from "fs";
import JSON5 from "json5";
import prettier from "prettier";

import type { PgClientQuery } from "../../src/datasource";
import { runTestQuery } from "../helpers";

const UPDATE_SNAPSHOTS = process.env.UPDATE_SNAPSHOTS === "1";

async function snapshot(actual: string, filePath: string) {
  let expected: string | null = null;
  try {
    expected = await fsp.readFile(filePath, "utf8");
  } catch (e) {
    /* noop */
  }
  if (expected == null || UPDATE_SNAPSHOTS) {
    if (expected !== actual) {
      console.warn(`Updated snapshot in '${filePath}'`);
      await fsp.writeFile(filePath, actual);
    }
  } else {
    expect(actual).toEqual(expected);
  }
}

export const testGraphQL = async (props: {
  document: string;
  path: string;
  assertions: (result: {
    data: any;
    queries: PgClientQuery[];
  }) => Promise<void>;
  config: any;
}): Promise<void> => {
  const { document, path, assertions } = props;
  const sqlFileName = path + ".sql";
  const resultFileName = path + ".json5";

  const { data, queries } = await runTestQuery(document);

  await assertions({ data, queries });

  const formattedData = prettier.format(JSON5.stringify(data), {
    parser: "json5",
    printWidth: 120,
  });
  await snapshot(formattedData, resultFileName);
  const formattedQueries = queries.map((q) => q.text).join("\n\n");
  await snapshot(formattedQueries, sqlFileName);

  expect(queries).toHaveLength(1);
};
