/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { readdirSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";

import { expect } from "chai";
import {
  AsyncExecutionResult,
  Kind,
  parse,
  type ExecutionResult,
} from "graphql";
import JSON5 from "json5";
import { it } from "mocha";

import { grafast } from "../../dist/index.js";
import { planToMermaid } from "../../dist/mermaid.js";
import { snapshot } from "../snapshots.js";
import { makeBaseArgs } from "./dcc-schema.js";
import { isAsyncIterable } from "@envelop/core";

// The text the file must end with
const SUFFIX = ".test.graphql";

const BASE_DIR = `${__dirname}/queries`;

async function resolveStreamDefer(r: Awaited<ReturnType<typeof grafast>>) {
  if (isAsyncIterable(r)) {
    const payloads: AsyncExecutionResult[] = [];
    for await (const payload of r) {
      payloads.push(payload);
    }
    return payloads;
  } else {
    return r;
  }
}

describe("queries", () => {
  const files = readdirSync(BASE_DIR).filter(
    (n) => !n.startsWith(".") && n.endsWith(SUFFIX),
  );
  for (const file of files) {
    const baseName = file.substring(0, file.length - SUFFIX.length);
    describe(file, () => {
      let result: ExecutionResult | AsyncExecutionResult[];
      const source = readFileSync(BASE_DIR + "/" + file, "utf8");
      const document = parse(source);
      const operations = document.definitions.filter(
        (d) => d.kind === Kind.OPERATION_DEFINITION,
      );
      operations.forEach((op, i) => {
        const operationName = op.name?.value;
        const suffix = i === 0 ? "" : `.${operationName}`;
        describe(operationName ?? "unnamed", () => {
          before(async () => {
            const baseArgs = makeBaseArgs();
            result = await resolveStreamDefer(
              await grafast({
                ...baseArgs,
                source,
                operationName,
              }),
            );
          });
          it("did not error", () => {
            if (Array.isArray(result)) {
              const errors = result.map((r) => r.errors).filter(Boolean);
              expect(errors).to.have.length(0);
            } else {
              expect(result.errors).not.to.exist;
            }
          });
          it("matched data snapshot", async () => {
            if (Array.isArray(result)) {
              await snapshot(
                JSON5.stringify(result, null, 2) + "\n",
                `${BASE_DIR}/${baseName}${suffix}.json5`,
              );
            } else {
              await snapshot(
                JSON5.stringify(result.data, null, 2) + "\n",
                `${BASE_DIR}/${baseName}${suffix}.json5`,
              );
            }
          });
          it("matched plan snapshot", async function () {
            const ext = Array.isArray(result)
              ? result[0].extensions
              : result.extensions;
            const plan = (ext as any)?.explain?.operations?.find(
              (o: any) => o.type === "plan",
            )?.plan;
            if (
              !plan &&
              (Array.isArray(result)
                ? result.some((r) => r.errors)
                : result.errors)
            ) {
              return this.skip();
            }
            const mermaid = planToMermaid(plan).trim() + "\n";
            await snapshot(mermaid, `${BASE_DIR}/${baseName}${suffix}.mermaid`);
          });
        });
      });
    });
  }
});
