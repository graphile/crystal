"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = options;
exports.run = run;
const main_js_1 = require("./main.js");
function options(yargs) {
    return yargs
        .example("$0 -C graphile.config.ts", "Read and parse graphile.config.ts, and determine the inflectors available for plugins therein")
        .option("config", {
        alias: "C",
        type: "string",
        description: "The path to the config file",
        normalize: true,
    });
}
function run(args) {
    const text = (0, main_js_1.main)({ filename: args.config });
    console.log(text);
}
//# sourceMappingURL=cli.js.map