import { EventEmitter } from "node:stream";

import { execute, isAsyncIterable } from "grafast";
import type {
  ExecutionPatchResult,
  ExecutionResult,
  GraphQLSchema,
} from "grafast/graphql";
import { parse, validate } from "grafast/graphql";
import JSON5 from "json5";

import type { BenchOperation, GrafastBenchSetupResult } from "./interfaces.js";
export { GrafastBenchConfig } from "./interfaces.js";

const grafastMetricsEmitter = new EventEmitter();

interface Lap {
  category: string;
  subcategory: string | undefined;
  elapsed: number;
}
interface Timing {
  run: number;
  elapsed: number;
  planning?: number;
  laps?: Array<Lap>;
}

export async function bench(
  schema: GraphQLSchema,
  operations: BenchOperation[],
  options: {
    setup?: () => Promise<GrafastBenchSetupResult> | GrafastBenchSetupResult;
    teardown?: (setupResult: GrafastBenchSetupResult) => void | Promise<void>;
    contextFactory?: (
      operation: BenchOperation,
      setupResult: GrafastBenchSetupResult,
    ) => object;
  },
) {
  const {
    setup = () => ({}) as any,
    teardown = () => {},
    contextFactory = () => ({}),
  } = options;
  const runs: Record<string, Timing[]> = Object.create(null);
  for (const operation of operations) {
    runs[operation.name] = [];
  }

  const setupResult = await setup();
  try {
    for (let i = 0; i < 200; i++) {
      for (const operation of operations) {
        const document = parse(operation.source);
        const errors = validate(schema, document);
        if (errors.length !== 0) {
          throw errors[0];
        }
        const errorsAllowed = !/expect\(errors\)\.toBeFalsy\(\)/.test(
          operation.source,
        );
        const variableValuesMatch = operation.source.match(
          /^#> variableValues: ([^\n]+)$/m,
        );
        const variableValues = variableValuesMatch
          ? JSON5.parse(variableValuesMatch[1])
          : {};
        const checkForErrors = (
          result: ExecutionResult | ExecutionPatchResult,
        ) => {
          if (result.errors !== undefined) {
            throw new Error(result.errors[0].message);
          }
        };
        const timing: Timing = {
          run: i,
          elapsed: 0,
        };
        const onPlan = (event: { elapsed: number; laps: Lap[] }) => {
          timing.planning = event.elapsed;
          timing.laps = event.laps;
        };
        grafastMetricsEmitter.on("plan", onPlan);

        const start = performance.now();
        const result = await execute({
          schema,
          document,
          contextValue: {
            ...contextFactory(operation, setupResult),
            grafastMetricsEmitter,
          },
          variableValues,
        });
        const payloads: Array<ExecutionResult | ExecutionPatchResult> = [];
        if (isAsyncIterable(result)) {
          for await (const payload of result) {
            if (!errorsAllowed) checkForErrors(payload);
            payloads.push(payload);
          }
        } else {
          if (!errorsAllowed) checkForErrors(result);
          payloads.push(result);
        }
        const finish = performance.now();
        const elapsed = finish - start;
        timing.elapsed = elapsed;

        grafastMetricsEmitter.off("plan", onPlan);
        runs[operation.name].push(timing);
        // console.log(operation.name);
        // console.log(JSON.stringify(payloads, null, 2));
      }
    }
    const extraTotal = Object.create(null);
    let planningTotal = 0;
    let executionTotal = 0;
    const tableData = Object.entries(runs).map(([name, timings]) => {
      const focus = timings[timings.length - 1];
      const planning = focus.planning!;
      let min = Infinity;
      let max = 0;
      // let sum = 0;
      const laps = focus.laps;
      for (const timing of timings) {
        const { elapsed } = timing;
        if (elapsed < min) min = elapsed;
        if (elapsed > max) max = elapsed;
        // sum += elapsed;
      }
      planningTotal += planning;
      executionTotal += focus.elapsed;
      const extra = laps!.reduce((memo, l) => {
        memo[l.category] = (memo[l.category] ?? 0) + l.elapsed;
        extraTotal[l.category] = (extraTotal[l.category] ?? 0) + l.elapsed;
        return memo;
      }, Object.create(null));
      return {
        name,
        planning,
        min,
        max,
        //avg: sum / times.length,
        ...extra,
      };
    });
    tableData.push({
      name: "TOTAL",
      planning: `${planningTotal.toFixed(2)} (${(
        (100 * planningTotal) /
        executionTotal
      ).toFixed(1)}%)`,
      min: null,
      max: null,
      ...Object.fromEntries(
        Object.entries(extraTotal).map(([k, v]) => {
          if (typeof v !== "number") {
            return [k, v];
          } else {
            return [k, ((100 * v) / planningTotal).toFixed(1) + "%"];
          }
        }),
      ),
    });
    console.table(tableData);
    console.dir(tableData[tableData.length - 1]);
  } finally {
    await teardown(setupResult);
  }
}
