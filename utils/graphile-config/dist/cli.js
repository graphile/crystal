"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCli = runCli;
exports.getTerminalWidth = getTerminalWidth;
const tslib_1 = require("tslib");
const yargs_1 = tslib_1.__importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
async function runCli(options, run) {
    const argv = await options((0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)))
        .strict()
        .showHelpOnFail(false, "Specify --help for available options")
        .epilogue(`\
Graphile's MIT-licensed Open Source Software is made possible thanks to support from our sponsors. To find out more about sponsorship, please visit:

  💖 https://graphile.org/sponsor

Thank you for using our software.`)
        .wrap(yargs_1.default.terminalWidth()).argv;
    await run(argv);
}
function getTerminalWidth() {
    return yargs_1.default.terminalWidth();
}
//# sourceMappingURL=cli.js.map