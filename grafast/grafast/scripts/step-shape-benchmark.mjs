/* eslint-disable graphile-export/exhaustive-deps, graphile-export/export-methods, graphile-export/export-plans, graphile-export/export-instances, graphile-export/export-subclasses, graphile-export/no-nested */
// Measures how a plan stores `hasSideEffects` on its steps: how many step
// objects V8 keeps in fast-properties mode, and how much heap the plan retains.
//
//   yarn build
//   node --allow-natives-syntax --expose-gc \
//     scripts/step-shape-benchmark.mjs [fields]
//
// `%HasFastProperties` is a V8 intrinsic, hence `--allow-natives-syntax` and a
// plain `.mjs` file (TypeScript cannot parse the intrinsic). Run the script on
// the commit before the change and on the change itself to compare.
import process from "node:process";

import { constant, grafast, makeGrafastSchema } from "../dist/index.js";

const fieldCount = Number(process.argv[2] ?? 2000);
if (!Number.isInteger(fieldCount) || fieldCount < 1) {
  throw new Error("the field count must be a positive integer");
}

const isFast = (value) => %HasFastProperties(value);

const typeDefs = `type Query {\n${Array.from(
  { length: fieldCount },
  (_, i) => `  f${i}: Int`,
).join("\n")}\n}`;

const steps = [];
const plans = {};
for (let i = 0; i < fieldCount; i++) {
  plans[`f${i}`] = () => {
    const $value = constant(i);
    steps.push($value);
    return $value;
  };
}

const schema = makeGrafastSchema({
  typeDefs,
  objects: { Query: { plans } },
});

const source = `{ ${Array.from({ length: fieldCount }, (_, i) => `f${i}`).join(" ")} }`;

globalThis.gc();
globalThis.gc();
const baseline = process.memoryUsage().heapUsed;

const started = performance.now();
const result = await grafast({ schema, source, requestContext: {} });
const planningMs = performance.now() - started;

if ("next" in result) throw new Error("Iterator not expected");
if (result.errors) throw new Error(`planning failed: ${result.errors[0]}`);

globalThis.gc();
globalThis.gc();
const retainedMiB = (process.memoryUsage().heapUsed - baseline) / 1048576;

const fastSteps = steps.filter((step) => isFast(step)).length;

console.log(
  JSON.stringify(
    {
      steps: steps.length,
      fastSteps,
      dictionarySteps: steps.length - fastSteps,
      planningMs: Math.round(planningMs),
      retainedMiB: Math.round(retainedMiB),
    },
    null,
    2,
  ),
);
