import { promises as fsp } from "fs";
import JSON5 from "json5";
import prettier from "prettier";

import { runTestQuery } from "../helpers";

export { runTestQuery };

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

export const assertSnapshotsMatch = async (
  only: "sql" | "result",
  props: {
    result: ReturnType<typeof runTestQuery>;
    document: string;
    path: string;
    config: any;
    ext?: string;
  },
): Promise<void> => {
  const { path, result, ext } = props;
  const basePath = path.replace(/\.test\.graphql$/, "");
  if (basePath === path) {
    throw new Error(`Failed to trim .test.graphql from '${path}'`);
  }

  const { data, queries } = await result;

  if (only === "result") {
    const resultFileName = basePath + (ext || "") + ".json5";
    const formattedData = prettier.format(JSON5.stringify(data), {
      parser: "json5",
      printWidth: 120,
    });
    await snapshot(formattedData, resultFileName);
  } else if (only === "sql") {
    const sqlFileName = basePath + (ext || "") + ".sql";
    const formattedQueries = queries.map((q) => q.text).join("\n\n");
    await snapshot(formattedQueries, sqlFileName);
  } else {
    throw new Error(
      `Unexpected argument to assertSnapshotsMatch; expected result|sql, received '${only}'`,
    );
  }
};

export const assertResultsMatch = async (
  result1: ReturnType<typeof runTestQuery>,
  result2: ReturnType<typeof runTestQuery>,
): Promise<void> => {
  const { data: data1 } = await result1;
  const { data: data2 } = await result2;
  expect(data1).toEqual(data2);
};
