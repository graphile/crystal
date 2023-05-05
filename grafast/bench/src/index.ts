import {
  ExecutionPatchResult,
  ExecutionResult,
  GraphQLSchema,
  parse,
  validate,
} from "graphql";
import { execute, isAsyncIterable } from "grafast";
import { BenchOperation } from "./interfaces.js";
import { EventEmitter } from "node:stream";
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
  contextFactory?: (operation: BenchOperation) => object,
) {
  const runs: Record<string, Timing[]> = Object.create(null);
  for (const operation of operations) {
    runs[operation.name] = [];
  }

  // debugger;
  for (let i = 0; i < 2; i++) {
    for (const operation of operations) {
      const document = parse(operation.source);
      const errors = validate(schema, document);
      if (errors.length) {
        throw errors[0];
      }
      const errorsAllowed = !/expect\(errors\)\.toBeFalsy\(\)/.test(
        operation.source,
      );
      const checkForErrors = (
        result: ExecutionResult | ExecutionPatchResult,
      ) => {
        if (result.errors) {
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
          ...contextFactory?.(operation),
          grafastMetricsEmitter,
        },
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
  const tableData = Object.entries(runs).map(([name, timings]) => {
    const planning = timings[timings.length - 1].planning?.toFixed(2);
    const times = timings.map((t) => t.elapsed);
    let min = Infinity;
    let max = 0;
    let sum = 0;
    for (const timing of timings) {
      const { elapsed } = timing;
      if (elapsed < min) min = elapsed;
      if (elapsed > max) max = elapsed;
      sum += elapsed;
    }
    return { name, planning, min, max, avg: sum / times.length };
  });
  console.table(tableData);
}
