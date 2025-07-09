"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bench = bench;
const tslib_1 = require("tslib");
const node_stream_1 = require("node:stream");
const grafast_1 = require("grafast");
const graphql_1 = require("grafast/graphql");
const json5_1 = tslib_1.__importDefault(require("json5"));
const grafastMetricsEmitter = new node_stream_1.EventEmitter();
async function bench(schema, operations, options) {
    const { setup = () => ({}), teardown = () => { }, contextFactory = () => ({}), } = options;
    const runs = Object.create(null);
    for (const operation of operations) {
        runs[operation.name] = [];
    }
    const setupResult = await setup();
    try {
        for (let i = 0; i < 200; i++) {
            for (const operation of operations) {
                const document = (0, graphql_1.parse)(operation.source);
                const errors = (0, graphql_1.validate)(schema, document);
                if (errors.length !== 0) {
                    throw errors[0];
                }
                const errorsAllowed = !/expect\(errors\)\.toBeFalsy\(\)/.test(operation.source);
                const variableValuesMatch = operation.source.match(/^#> variableValues: ([^\n]+)$/m);
                const variableValues = variableValuesMatch
                    ? json5_1.default.parse(variableValuesMatch[1])
                    : {};
                const checkForErrors = (result) => {
                    if (result.errors !== undefined) {
                        throw new Error(result.errors[0].message);
                    }
                };
                const timing = {
                    run: i,
                    elapsed: 0,
                };
                const onPlan = (event) => {
                    timing.planning = event.elapsed;
                    timing.laps = event.laps;
                };
                grafastMetricsEmitter.on("plan", onPlan);
                const start = performance.now();
                const result = await (0, grafast_1.execute)({
                    schema,
                    document,
                    contextValue: {
                        ...contextFactory(operation, setupResult),
                        grafastMetricsEmitter,
                    },
                    variableValues,
                });
                const payloads = [];
                if ((0, grafast_1.isAsyncIterable)(result)) {
                    for await (const payload of result) {
                        if (!errorsAllowed)
                            checkForErrors(payload);
                        payloads.push(payload);
                    }
                }
                else {
                    if (!errorsAllowed)
                        checkForErrors(result);
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
            const planning = focus.planning;
            let min = Infinity;
            let max = 0;
            // let sum = 0;
            const laps = focus.laps;
            for (const timing of timings) {
                const { elapsed } = timing;
                if (elapsed < min)
                    min = elapsed;
                if (elapsed > max)
                    max = elapsed;
                // sum += elapsed;
            }
            planningTotal += planning;
            executionTotal += focus.elapsed;
            const extra = laps.reduce((memo, l) => {
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
            planning: `${planningTotal.toFixed(2)} (${((100 * planningTotal) /
                executionTotal).toFixed(1)}%)`,
            min: null,
            max: null,
            ...Object.fromEntries(Object.entries(extraTotal).map(([k, v]) => {
                if (typeof v !== "number") {
                    return [k, v];
                }
                else {
                    return [k, ((100 * v) / planningTotal).toFixed(1) + "%"];
                }
            })),
        });
        console.table(tableData);
        console.dir(tableData[tableData.length - 1]);
    }
    finally {
        await teardown(setupResult);
    }
}
//# sourceMappingURL=index.js.map