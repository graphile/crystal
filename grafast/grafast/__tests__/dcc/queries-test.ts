/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
import { readdirSync, readFileSync } from "node:fs";

import { isAsyncIterable } from "@envelop/core";
import { expect } from "chai";
import type {
  AsyncExecutionResult,
  ExecutionResult,
  GraphQLError,
} from "graphql";
import { Kind, parse, valueFromASTUntyped } from "graphql";
import JSON5 from "json5";
import { it } from "mocha";

import { grafast } from "../../dist/index.js";
import { planToMermaid } from "../../dist/mermaid.js";
import { readSnapshot, snapshot } from "../snapshots.js";
import { makeBaseArgs } from "./dcc-schema.js";

// The text the file must end with
const SUFFIX = ".test.graphql";

const BASE_DIR = `${__dirname}/queries`;

async function streamToArray(r: Awaited<ReturnType<typeof grafast>>) {
  if (isAsyncIterable(r)) {
    const payloads: AsyncExecutionResult[] = [];
    for await (const payload of r) {
      payloads.push(payload);
    }
    if (
      payloads[0].hasNext === true &&
      payloads[payloads.length - 1].hasNext !== false
    ) {
      console.dir(payloads);
      throw new Error(
        `Invalid stream! Last payload didn't have hasNext: false!`,
      );
    }
    return payloads;
  } else {
    return r;
  }
}

function getObj(
  base: Record<string | number, any>,
  path: ReadonlyArray<string | number>,
) {
  let current = base;
  for (const part of path) {
    current = current[part];
    if (current == null) {
      throw new Error(`Invalid path ${path} in ${JSON.stringify(base)}!`);
    }
  }
  return current;
}

function deepMerge(target: Record<string | number, any>, source: object) {
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
        if (p.path.length === 0) {
          deepMerge(payload.data!, data);
        } else {
          const lead = p.path.slice(0, p.path.length - 1)!;
          const final = p.path[p.path.length - 1];
          const target = getObj(payload.data!, lead);
          if (!target[final]) {
            target[final] = data;
          } else {
            if (!data) {
              console.warn(`Cannot set position at path ${p.path} to ${data}`);
            }
            deepMerge(target[final], data);
          }
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

function sigObj(obj: unknown) {
  if (obj == null) return String(obj);
  const keys = Object.keys(obj);
  const MAX = 15;
  if (keys.length > MAX) {
    return `{${keys.slice(0, MAX).join(",")},...}`;
  } else {
    return `{${keys.join(",")}}`;
  }
}

function sigPath(path: ReadonlyArray<string | number>): string {
  return path.map((n) => (typeof n === "number" ? "*" : n)).join(".");
}

/**
 * Generate an "incremental signature" that indicates what happened without
 * producing an overwhelmingly large amount of data
 */
function incsig(p: readonly AsyncExecutionResult[]) {
  const result = {
    initialData: sigObj(p[0].data),
    patches: Object.create(null) as Record<
      string,
      Record<string, { indicies: string[] }>
    >,
  };
  for (const payload of p.slice(1)) {
    if (!payload.hasNext) break;
    if (!("path" in payload)) {
      throw new Error(`Invalid incremental stream; no path!`);
    }
    const pathSig = sigPath(payload.path!);
    if (!result.patches[pathSig]) {
      result.patches[pathSig] = Object.create(null);
    }
    const payloadSig = sigObj(payload.data);
    if (!result.patches[pathSig][payloadSig]) {
      result.patches[pathSig][payloadSig] = { indicies: [] };
    }
    const indicies = payload.path!.filter((n) => typeof n === "number");
    result.patches[pathSig][payloadSig].indicies.push(indicies.join("/"));
  }
  for (const k in result.patches) {
    result.patches[k] = canonicalSort(result.patches[k]);
  }
  result.patches = canonicalSort(result.patches);
  return result;
}

function canonicalSort(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).sort((a, z) =>
      a[0].localeCompare(
        z[0],
        // Language independent sorting (Unicode binary?)
        // BCP 47 primary language tag "und"
        "und",
      ),
    ),
  );
}

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
