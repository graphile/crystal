"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithPgClientStep = void 0;
exports.withPgClient = withPgClient;
exports.withPgClientTransaction = withPgClientTransaction;
const grafast_1 = require("grafast");
/**
 * Runs the given `callback` against the given `executor` using any plan data
 * from `$data` (which can be `constant(null)` if you don't need it). Typically
 * useful for running custom transactions.
 */
class WithPgClientStep extends grafast_1.Step {
    static { this.$$export = {
        moduleName: "@dataplan/pg",
        exportName: "WithPgClientStep",
    }; }
    constructor(executor, $data, callback) {
        super();
        this.callback = callback;
        this.isSyncAndSafe = false;
        this.hasSideEffects = true;
        this.executor = executor;
        this.contextId = this.addDependency(this.executor.context());
        this.dataId = this.addDependency($data);
    }
    execute({ indexMap, values, }) {
        const contextDep = values[this.contextId];
        const dataDep = values[this.dataId];
        return indexMap((i) => {
            const context = contextDep.at(i);
            const data = dataDep.at(i);
            const { withPgClient, pgSettings } = context;
            return withPgClient(pgSettings, (client) => this.callback(client, data));
        });
    }
}
exports.WithPgClientStep = WithPgClientStep;
function withPgClient(executor, $data, callback) {
    return new WithPgClientStep(executor, $data ?? (0, grafast_1.constant)($data), callback);
}
function withPgClientTransaction(executor, $data, callback) {
    return withPgClient(executor, $data ?? (0, grafast_1.constant)($data), (client, data) => client.withTransaction((txClient) => callback(txClient, data)));
}
//# sourceMappingURL=withPgClient.js.map