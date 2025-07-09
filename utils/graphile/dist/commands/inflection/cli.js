"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = options;
exports.run = run;
const tslib_1 = require("tslib");
const listCmd = tslib_1.__importStar(require("./list/cli.js"));
function options(yargs) {
    return yargs
        .command("list", "List the available inflectors", listCmd.options, listCmd.run)
        .demandCommand();
}
function run(_args) {
    // This should never happen, yargs handles it for us
    throw new Error("Subcommand required");
}
//# sourceMappingURL=cli.js.map