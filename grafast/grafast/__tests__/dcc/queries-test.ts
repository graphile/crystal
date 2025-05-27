/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { readdirSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";

import { expect } from "chai";
import {
  AsyncExecutionResult,
  coerceInputValue,
  Kind,
  parse,
  valueFromAST,
  valueFromASTUntyped,
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

function tidyAsyncResult(p: AsyncExecutionResult) {
  if (p.extensions !== undefined) {
    const copy = { ...p };
    delete copy.extensions;
    return copy;
  } else {
    return p;
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
        let expectIncremental = false;
        let variableValues = {};
        for (const dir of op.directives ?? []) {
          if (dir.name.value === "incremental") {
            expectIncremental = true;
          }
          if (dir.name.value === "variables") {
            for (const arg of dir.arguments ?? []) {
              variableValues[arg.name.value] = valueFromASTUntyped(arg.value);
            }
          }
        }
        const suffix = i === 0 ? "" : `.${operationName}`;
        describe(operationName ?? "unnamed", () => {
          before(async () => {
            const baseArgs = makeBaseArgs();
            result = await resolveStreamDefer(
              await grafast({
                ...baseArgs,
                source,
                operationName,
                variableValues,
              }),
            );
          });

          if (expectIncremental) {
            it("was incremental", () => {
              if (!Array.isArray(result)) {
                console.dir(result);
                throw new Error(`Expected operation to be incremental`);
              }
            });
            it("did not error", function () {
              if (!Array.isArray(result)) return this.skip();
              const errors = result.map((r) => r.errors).filter(Boolean);
              expect(errors).to.have.length(0);
            });
            it("matched data snapshot", async function () {
              if (!Array.isArray(result)) return this.skip();
              await snapshot(
                JSON5.stringify(result.map(tidyAsyncResult), null, 2) + "\n",
                `${BASE_DIR}/${baseName}${suffix}.json5`,
              );
            });
            it("matched plan snapshot", async function () {
              if (!Array.isArray(result)) return this.skip();
              const ext = result[0].extensions;
              const plan = (ext as any)?.explain?.operations?.find(
                (o: any) => o.type === "plan",
              )?.plan;
              if (!plan && result.some((r) => r.errors)) {
                return this.skip();
              }
              const mermaid = planToMermaid(plan).trim() + "\n";
              await snapshot(
                mermaid,
                `${BASE_DIR}/${baseName}${suffix}.mermaid`,
              );
            });
          } else {
            it("was not incremental", () => {
              if (Array.isArray(result)) {
                console.dir(result);
                throw new Error(
                  `Did not expect ${operationName} to be incremental; add the \`@incremental\` directive to the operation if this is expected.`,
                );
              }
            });
            it("did not error", function () {
              if (Array.isArray(result)) return this.skip();
              expect(result.errors).not.to.exist;
            });
            it("matched data snapshot", async function () {
              if (Array.isArray(result)) return this.skip();
              await snapshot(
                JSON5.stringify(result.data, null, 2) + "\n",
                `${BASE_DIR}/${baseName}${suffix}.json5`,
              );
            });
            it("matched plan snapshot", async function () {
              if (Array.isArray(result)) return this.skip();
              const ext = result.extensions;
              const plan = (ext as any)?.explain?.operations?.find(
                (o: any) => o.type === "plan",
              )?.plan;
              if (!plan && result.errors) {
                return this.skip();
              }
              const mermaid = planToMermaid(plan).trim() + "\n";
              await snapshot(
                mermaid,
                `${BASE_DIR}/${baseName}${suffix}.mermaid`,
              );
            });
          }
        });
      });
    });
  }
});
