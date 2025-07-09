"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = options;
exports.run = run;
const tslib_1 = require("tslib");
const debugCmd = tslib_1.__importStar(require("./debug/cli.js"));
function options(yargs) {
    return yargs
        .command("debug [entityType] [entityIdentifier] [filterString]", "Detail the behavior for a particular entity", debugCmd.options, debugCmd.run)
        .demandCommand();
}
function run(_args) {
    // This should never happen, yargs handles it for us
    throw new Error("Subcommand required");
}
//# sourceMappingURL=cli.js.map