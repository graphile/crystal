"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = options;
exports.run = run;
const tslib_1 = require("tslib");
const behaviorCmd = tslib_1.__importStar(require("./commands/behavior/cli.js"));
const configCmd = tslib_1.__importStar(require("./commands/config/cli.js"));
const inflectionCmd = tslib_1.__importStar(require("./commands/inflection/cli.js"));
function options(yargs) {
    return yargs
        .parserConfiguration({
        // Last option wins - do NOT make duplicates into arrays!
        "duplicate-arguments-array": false,
    })
        .example("$0 config options -C graphile.config.ts", "Output the options available to be used in the given config file, based on the imports it contains.")
        .command("config", "Tools for helping with config", (yargs) => configCmd.options(yargs), configCmd.run)
        .command("inflection", "Tools for helping with inflection", (yargs) => inflectionCmd.options(yargs), inflectionCmd.run)
        .command("behavior", "Tools for helping with behavior", (yargs) => behaviorCmd.options(yargs), behaviorCmd.run)
        .demandCommand();
}
async function run(_args) {
    // Do nothing
}
//# sourceMappingURL=cli.js.map