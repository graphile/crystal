/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { readdirSync, readFileSync } from "node:fs";

import { expect } from "chai";
import type { AsyncExecutionResult, ExecutionResult } from "graphql";
import { Kind, parse, valueFromASTUntyped } from "graphql";
import JSON5 from "json5";
import { it } from "mocha";

import { grafast } from "../../dist/index.js";
import { planToMermaid } from "../../dist/mermaid.js";
import {
  incsig,
  resolveStreamDefer,
  streamToArray,
} from "../incrementalUtils.js";
import { readSnapshot, snapshot } from "../snapshots.js";
import { makeBaseArgs } from "./dcc-schema.js";

const itNotCi = process.env.CI ? it.skip : it;

// The text the file must end with
const SUFFIX = ".test.graphql";

const BASE_DIR = `${__dirname}/queries`;

//.map(pruneAsyncResult)

describe("queries", () => {
  const files = readdirSync(BASE_DIR).filter(
    (n) => !n.startsWith(".") && n.endsWith(SUFFIX),
  );
  for (const file of files) {
    const baseName = file.substring(0, file.length - SUFFIX.length);
    describe(file, () => {
      const source = readFileSync(BASE_DIR + "/" + file, "utf8");
      const document = parse(source);
      const operations = document.definitions.filter(
        (d) => d.kind === Kind.OPERATION_DEFINITION,
      );
      operations.forEach((op, i) => {
        const operationName = op.name?.value;
        let expectIncremental = false;
        let variableValues: any;
        let expectedErrorCount = 0;
        for (const dir of op.directives ?? []) {
          if (dir.name.value === "incremental") {
            expectIncremental = true;
          }
          if (dir.name.value === "variables") {
            const values = dir.arguments?.find(
              (a) => a.name.value === "values",
            );
            if (!values) {
              throw new Error(
                `Variables must be specified as \`@variables(values: {...})\``,
              );
            }
            variableValues = valueFromASTUntyped(values.value) as any;
          }
          if (dir.name.value === "expectError") {
            expectedErrorCount = 1;
          }
        }
        const suffix = i === 0 ? "" : `.${operationName}`;
        describe(operationName ?? "<anonymous>", () => {
          let rawResult: ExecutionResult | AsyncExecutionResult[];
          let result: ExecutionResult;
          before(async () => {
            const baseArgs = makeBaseArgs();
            rawResult = await streamToArray(
              await grafast({
                ...baseArgs,
                source,
                operationName,
                variableValues,
              }),
            );
            result = Array.isArray(rawResult)
              ? resolveStreamDefer(rawResult)
              : rawResult;
          });

          if (expectIncremental) {
            it("was incremental", () => {
              if (!Array.isArray(rawResult)) {
                console.dir(rawResult);
                throw new Error(`Expected operation to be incremental`);
              }
            });
            it("matched incremental signature", async function () {
              if (!Array.isArray(rawResult)) return this.skip();
              await snapshot(
                JSON5.stringify(incsig(rawResult), null, 2) + "\n",
                // incremental signature
                `${BASE_DIR}/${baseName}${suffix}.incsig.json5`,
              );
            });
          } else {
            it("was not incremental", () => {
              if (Array.isArray(rawResult)) {
                console.dir(rawResult);
                throw new Error(
                  `Did not expect ${operationName} to be incremental; add the \`@incremental\` directive to the operation if this is expected.`,
                );
              }
            });
          }
          if (i === 0 || !expectIncremental) {
            it("matched data snapshot exactly", async function () {
              await snapshot(
                JSON5.stringify(result.data, null, 2) + "\n",
                `${BASE_DIR}/${baseName}.json5`,
                i === 0,
              );
            });
          } else {
            it("matched data snapshot roughly (order ignored)", async function () {
              // Incremental is allowed to be out of order
              const original = await readSnapshot(
                `${BASE_DIR}/${baseName}.json5`,
              );
              if (original == null) {
                throw new Error(
                  `You need to run the primary test before you can check against the snapshot`,
                );
              }
              expect(result.data).to.deep.equal(JSON5.parse(original));
            });
          }
          if (expectedErrorCount === 0) {
            it("did not error", function () {
              if (result.errors) {
                console.dir(result.errors);
              }
              expect(result.errors).not.to.exist;
            });
          } else {
            it(`raised ${expectedErrorCount} errors`, async function () {
              expect(result.errors).to.exist;
              expect(result.errors).to.have.length(expectedErrorCount);
              await snapshot(
                JSON5.stringify(result.errors, null, 2) + "\n",
                `${BASE_DIR}/${baseName}.errors.json5`,
                i === 0,
              );
            });
          }
          itNotCi("matched plan snapshot", async function () {
            const ext = result.extensions;
            const plan = (ext as any)?.explain?.operations?.find(
              (o: any) => o.type === "plan",
            )?.plan;
            if (!plan && result.errors) {
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
