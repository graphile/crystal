/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";

import { expect } from "chai";
import type { ExecutionResult } from "graphql";
import * as JSON5 from "json5";
import { it } from "mocha";

import { grafast } from "../../dist/index.js";
import { planToMermaid } from "../../dist/mermaid.js";
import { snapshot } from "../snapshots.js";
import { makeBaseArgs } from "./dcc-schema.js";

// The text the file must end with
const SUFFIX = ".test.graphql";

const BASE_DIR = `${__dirname}/queries`;

describe("queries", () => {
  const files = readdirSync(BASE_DIR).filter(
    (n) => !n.startsWith(".") && n.endsWith(SUFFIX),
  );
  for (const file of files) {
    const baseName = file.substring(0, file.length - SUFFIX.length);
    describe(file, () => {
      let result: ExecutionResult;
      before(async () => {
        const baseArgs = makeBaseArgs();
        const source = await readFile(BASE_DIR + "/" + file, "utf8");
        result = (await grafast({
          ...baseArgs,
          source,
        })) as ExecutionResult;
      });
      it("did not error", () => {
        if (result.errors) {
          console.dir(result.errors);
        }
        expect(result.errors).not.to.exist;
      });
      it("matched data snapshot", async () => {
        await snapshot(
          JSON5.stringify(result.data, null, 2) + "\n",
          `${BASE_DIR}/${baseName}.json5`,
        );
      });
      it("matched plan snapshot", async function () {
        const plan = (result.extensions as any)?.explain?.operations?.find(
          (o: any) => o.type === "plan",
        )?.plan;
        if (!plan && result.errors) {
          return this.skip();
        }
        const mermaid = planToMermaid(plan).trim() + "\n";
        await snapshot(mermaid, `${BASE_DIR}/${baseName}.mermaid`);
      });
    });
  }
});
