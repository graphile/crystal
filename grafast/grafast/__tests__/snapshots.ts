import * as fsp from "node:fs/promises";
import path from "node:path";

import { expect } from "chai";

/**
 * We go beyond what Jest snapshots allow; so we have to manage it ourselves.
 * If UPDATE_SNAPSHOTS is set then we'll write updated snapshots, otherwise
 * we'll do the default behaviour of comparing to existing snapshots.
 *
 * Set UPDATE_SNAPSHOTS=1 to update all snapshots. Alternatively, set it to a
 * comma separated list of snapshot types to update.
 */
const { UPDATE_SNAPSHOTS } = process.env;
const updateSnapshotExtensions = UPDATE_SNAPSHOTS?.split(",")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);
function shouldUpdateSnapshot(filePath: string) {
  // Never update snapshots in CI
  if (process.env.CI) return false;
  if (UPDATE_SNAPSHOTS === "1") return true;
  if (!updateSnapshotExtensions) return false;
  return updateSnapshotExtensions.some((e) => filePath.endsWith(e));
}

/**
 * If UPDATE_SNAPSHOTS is set then wrotes the given snapshot to the given
 * filePath, otherwise it asserts that the snapshot matches the previous
 * snapshot.
 */
export async function snapshot(actual: string, filePath: string) {
  let expected: string | null = null;
  try {
    expected = await fsp.readFile(filePath, "utf8");
  } catch (e) {
    /* noop */
  }
  if (expected == null || shouldUpdateSnapshot(filePath)) {
    if (expected !== actual) {
      const relative = path.relative(process.cwd(), filePath);
      console.warn(`      Updated snapshot in '${relative}'`);
      await fsp.writeFile(filePath, actual);
    }
  } else {
    expect(actual).to.equal(expected);
  }
}
