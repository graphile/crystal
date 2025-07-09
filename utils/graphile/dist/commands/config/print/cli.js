"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = options;
exports.run = run;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const graphile_config_1 = require("graphile-config");
const cli_1 = require("graphile-config/cli");
const load_1 = require("graphile-config/load");
const util_1 = require("util");
const stripAnsi_js_1 = require("../../../stripAnsi.js");
const inspectOpts = {
    colors: true,
};
function options(yargs) {
    return yargs
        .example("$0 -C graphile.config.ts", "Print your graphile.config.ts")
        .option("config", {
        alias: "C",
        type: "string",
        description: "The path to the config file",
        normalize: true,
    })
        .option("full", {
        alias: "f",
        type: "boolean",
        description: "Print full details, do not summarize",
        normalize: true,
    })
        .option("debug-order", {
        alias: "o",
        type: "boolean",
        description: "Include details to help debug the ordering of plugins",
        normalize: true,
    });
}
async function run(args) {
    const opts = {
        ...args,
        // debug-order implies full currently
        full: args.full || args.debugOrder,
    };
    const userPreset = await (0, load_1.loadConfig)(opts.config);
    if (!userPreset) {
        console.error("Failed to load config, please check the file exists");
        process.exit(1);
    }
    const resolvedPreset = (0, graphile_config_1.resolvePreset)(userPreset);
    console.log(printPlugins(opts, resolvedPreset.plugins));
    for (const key of Object.keys(resolvedPreset)) {
        if (key === "plugins" || key === "extends" || key === "disablePlugins") {
            continue;
        }
        console.log();
        console.log(chalk_1.default.whiteBright.bold(key) + ":");
        const value = resolvedPreset[key];
        if (Array.isArray(value)) {
            console.log((0, util_1.inspect)(value, inspectOpts));
        }
        else if (typeof value === "object" && value !== null) {
            const keys = Object.keys(value).filter((key) => value[key] !== undefined);
            if (keys.length) {
                for (const key of keys) {
                    const val = value[key];
                    console.log(`  ${chalk_1.default.blueBright(key)}: ${printValue(val, 4)}`);
                }
            }
            else {
                console.log(`  ${chalk_1.default.gray("-empty-")}`);
            }
        }
        else {
            console.log((0, util_1.inspect)(value, inspectOpts));
        }
    }
}
function printAPB(opts, strs, type, plugins, index) {
    if (!strs || strs.length === 0) {
        return chalk_1.default.gray("-");
    }
    else {
        if (opts.debugOrder && (type === "after" || type === "before")) {
            const matches = strs.map((str) => {
                const hits = [];
                for (let i = 0, l = plugins.length; i < l; i++) {
                    const plugin = plugins[i];
                    if (plugin.provides?.includes(str) || plugin.name === str) {
                        const good = type === "after" ? i < index : i > index;
                        hits.push({
                            plugin,
                            index: i,
                            good,
                        });
                    }
                }
                const allGood = hits.every((h) => h.good);
                return `${hits.length === 0
                    ? chalk_1.default.strikethrough(str)
                    : allGood
                        ? chalk_1.default.green(str)
                        : chalk_1.default.red(str)}${hits.length > 0 ? chalk_1.default.gray(`[${hits.map((h) => h.index + 1)}]`) : ""}`;
            });
            return chalk_1.default.cyan(matches.join("    "));
        }
        else {
            return chalk_1.default.cyan(strs.join("    "));
        }
    }
}
function printPlugins(opts, plugins) {
    if (!plugins || plugins.length === 0) {
        return "";
    }
    return `${chalk_1.default.whiteBright.bold("plugins")}:
${plugins.map((p, i) => printPlugin(opts, p, plugins, i)).join("\n")}`;
}
function printPlugin(opts, plugin, plugins, index) {
    const { full, debugOrder } = opts;
    const left = `  ${debugOrder ? chalk_1.default.whiteBright(`${index + 1}. `.padStart(5, " ")) : ""}${chalk_1.default.greenBright.bold(plugin.name)}${chalk_1.default.whiteBright("@")}${chalk_1.default.gray(plugin.version)}${plugin.description || debugOrder ? (full ? ":" : ": ") : ""}`;
    const indent = debugOrder ? `       ` : `    `;
    if (full) {
        return `${left}${debugOrder
            ? `
${indent}${chalk_1.default.whiteBright("After:")}    ${printAPB(opts, plugin.after, "after", plugins, index)}
${indent}${chalk_1.default.whiteBright("Provides:")} ${printAPB(opts, plugin.provides, "provides", plugins, index)}
${indent}${chalk_1.default.whiteBright("Before:")}   ${printAPB(opts, plugin.before, "before", plugins, index)}`
            : ""}${plugin.description
            ? `
${indent}${chalk_1.default.dim(plugin.description.replace(/\n/g, `\n${indent}`))}`
            : ``}
`;
    }
    else {
        const l = (0, stripAnsi_js_1.stripAnsi)(left).length;
        const MAX = 50;
        const SCREEN_WIDTH = (0, cli_1.getTerminalWidth)();
        const padL = Math.max(MAX, l) - l;
        const pad = " ".repeat(Math.max(0, padL));
        return `${left}${plugin.description
            ? `${pad}${chalk_1.default.dim(oneLine(plugin.description, SCREEN_WIDTH - pad.length - (0, stripAnsi_js_1.stripAnsi)(left).length))}`
            : ""}`;
    }
}
function oneLine(str, max = 60, suffix = "...") {
    const single = str.replace(/[\r\n\t]+/g, " ");
    if (single.length > max - suffix.length) {
        return single.slice(0, max - suffix.length) + suffix;
    }
    else {
        return single;
    }
}
function printValue(value, indentation) {
    const indent = " ".repeat(indentation);
    return (0, util_1.inspect)(value, inspectOpts).replace(/\n/g, `\n${indent}`);
}
//# sourceMappingURL=cli.js.map