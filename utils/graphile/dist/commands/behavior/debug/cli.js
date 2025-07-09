"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = options;
exports.run = run;
const main_js_1 = require("./main.js");
function options(yargs) {
    return yargs
        .positional("entityType", { type: "string" })
        .positional("entityIdentifier", { type: "string" })
        .positional("filterString", { type: "string" })
        .example("$0 pgClass public.users", "Output the behavior of the public.users entity")
        .option("config", {
        alias: "C",
        type: "string",
        description: "The path to the config file",
        normalize: true,
    });
}
async function run(args) {
    const text = await (0, main_js_1.main)({
        config: args.config,
        entityType: args.entityType,
        entityIdentifier: args.entityIdentifier,
        filterString: args.filterString,
    });
    console.log(text);
}
//# sourceMappingURL=cli.js.map