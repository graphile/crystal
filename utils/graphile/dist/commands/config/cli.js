"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = options;
exports.run = run;
const tslib_1 = require("tslib");
const optionsCmd = tslib_1.__importStar(require("./options/cli.js"));
const printCmd = tslib_1.__importStar(require("./print/cli.js"));
function options(yargs) {
    return yargs
        .command("options", "Output the options your config may contain", optionsCmd.options, optionsCmd.run)
        .command("print", "Prints your resolved configuration", printCmd.options, printCmd.run)
        .demandCommand();
}
function run(_args) {
    // This should never happen, yargs handles it for us
    throw new Error("Subcommand required");
}
//# sourceMappingURL=cli.js.map