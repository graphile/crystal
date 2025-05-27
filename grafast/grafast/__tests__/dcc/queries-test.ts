/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { readdirSync, readFileSync } from "node:fs";

import { expect } from "chai";
import {
  AsyncExecutionResult,
  Kind,
  parse,
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
import { GraphQLError, print } from "graphql";

// The text the file must end with
const SUFFIX = ".test.graphql";

const BASE_DIR = `${__dirname}/queries`;

async function streamToArray(r: Awaited<ReturnType<typeof grafast>>) {
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

function getObj(base: object, path: ReadonlyArray<string | number>) {
  let current = base;
  for (const part of path) {
    current = current[part];
    if (current == null) {
      throw new Error(`Invalid path ${path} in ${JSON.stringify(base)}!`);
    }
  }
  return current;
}

function deepMerge(target: object, source: object) {
  for (const [key, val] of Object.entries(source)) {
    if (!target[key]) {
      target[key] = val;
    } else if (Array.isArray(val)) {
      throw new Error(`Don't know how to merge arrays`);
    } else if (typeof val === "object" && val !== null) {
      if (typeof target[key] !== "object" || target[key] === null) {
        throw new Error(`Cannot merge object into whatever that was`);
      }
      deepMerge(target[key], val);
    } else {
      throw new Error(`Don't know how to merge key '${key}'`);
    }
  }
}

function deepClone(obj: object | null) {
  return JSON.parse(JSON.stringify(obj));
}

function resolveStreamDefer(r: AsyncExecutionResult[]): ExecutionResult {
  const payload: {
    errors?: GraphQLError[];
    data?: object | null;
    extensions?: object;
  } = {
    errors: [],
    extensions: {},
  };

  for (const p of r) {
    if (p.data !== undefined) {
      const data = deepClone(p.data);
      if ("path" in p && p.path) {
        const target = getObj(payload.data!, p.path);
        if (data) {
          deepMerge(target, data);
        } else {
          console.warn(`Cannot set position at path ${p.path} to null`);
        }
      } else {
        if (payload.data !== undefined) {
          throw new Error(`Refusing to clear data`);
        }
        payload.data = data;
      }
    }
    if (p.errors) {
      for (const e of p.errors) {
        payload.errors!.push(e);
      }
    }
    if (p.extensions) {
      deepMerge(payload.extensions!, p.extensions);
    }
  }

  if (payload.errors?.length === 0) {
    delete payload.errors;
  }
  return payload as ExecutionResult;
}

function pruneAsyncResult(p: AsyncExecutionResult) {
  const copy = { ...p };
  delete copy.extensions;
  if (copy.data != null && Object.keys(copy.data).length > 0) {
    const keys = Object.keys(copy.data);
    const MAX = 5;
    if (keys.length > MAX) {
      copy.data = `{${keys
        .slice(0, MAX)
        .map((k) => `${k}:...`)
        .join(",")},...}`;
    } else {
      copy.data = `{${keys.map((k) => `${k}:...`).join(",")}}`;
    }
  }
  return copy;
}

describe("queries", () => {
  const files = readdirSync(BASE_DIR).filter(
    (n) => !n.startsWith(".") && n.endsWith(SUFFIX),
  );
  for (const file of files) {
    const baseName = file.substring(0, file.length - SUFFIX.length);
    describe(file, () => {
      let rawResult: ExecutionResult | AsyncExecutionResult[];
      let result: ExecutionResult;
      const source = readFileSync(BASE_DIR + "/" + file, "utf8");
      const document = parse(source);
      const operations = document.definitions.filter(
        (d) => d.kind === Kind.OPERATION_DEFINITION,
      );
      operations.forEach((op, i) => {
        const operationName = op.name?.value;
        let expectIncremental = false;
        let variableValues: any;
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
        }
        const suffix = i === 0 ? "" : `.${operationName}`;
        describe(operationName ?? "<anonymous>", () => {
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
                JSON5.stringify(rawResult.map(pruneAsyncResult), null, 2) +
                  "\n",
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
          it("matched data snapshot", async function () {
            await snapshot(
              JSON5.stringify(result.data, null, 2) + "\n",
              `${BASE_DIR}/${baseName}.json5`,
              i === 0,
            );
          });
          it("did not error", function () {
            if (result.errors) {
              console.dir(result.errors);
            }
            expect(result.errors).not.to.exist;
          });
          it("matched plan snapshot", async function () {
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
