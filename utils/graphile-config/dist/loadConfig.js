"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
require("./interfaces.js");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const node_url_1 = require("node:url");
const interpret_1 = require("interpret");
const extensions = Object.keys(interpret_1.jsVariants);
async function exists(filePath) {
    try {
        await (0, promises_1.access)(filePath);
        return true;
    }
    catch (e) {
        if (e.code === "ENOENT") {
            return false;
        }
        else {
            throw e;
        }
    }
}
async function registerLoader(loader) {
    if (loader === null) {
        // noop
    }
    else if (Array.isArray(loader)) {
        let firstError;
        for (const entry of loader) {
            try {
                await registerLoader(entry);
                return;
            }
            catch (e) {
                if (!firstError) {
                    firstError = e;
                }
            }
        }
        throw firstError ?? new Error(`Empty array handler`);
    }
    else if (typeof loader === "string") {
        require(loader);
    }
    else if (typeof loader === "object" && loader != null) {
        const loaderModule = require(loader.module);
        loader.register(loaderModule);
    }
    else {
        throw new Error("Unsupported loader");
    }
}
function fixESMShenanigans(requiredModule) {
    if (typeof requiredModule.default === "object" &&
        requiredModule.default !== null &&
        !Array.isArray(requiredModule.default)) {
        return requiredModule.default;
    }
    return requiredModule;
}
async function loadConfig(configPath) {
    if (configPath != null) {
        // Explicitly load the file the user has indicated
        const resolvedPath = (0, node_path_1.resolve)(process.cwd(), configPath);
        // First try one of the supported loaders
        for (const extension of extensions) {
            if (resolvedPath.endsWith(extension)) {
                registerLoader(interpret_1.jsVariants[extension]);
                try {
                    return fixESMShenanigans(require(resolvedPath));
                }
                catch {
                    /* continue to the next one */
                }
            }
        }
        // Fallback to direct import
        return (await import((0, node_url_1.pathToFileURL)(resolvedPath).href)).default;
    }
    else {
        // There's no config path; look for a `graphile.config.*`
        const basePath = (0, node_path_1.resolve)(process.cwd(), "graphile.config");
        for (const extension of extensions) {
            const resolvedPath = basePath + extension;
            if (await exists(resolvedPath)) {
                registerLoader(interpret_1.jsVariants[extension]);
                try {
                    return fixESMShenanigans(require(resolvedPath));
                }
                catch (e) {
                    if (e.code === "ERR_REQUIRE_ESM") {
                        return (await import((0, node_url_1.pathToFileURL)(resolvedPath).href)).default;
                    }
                    else {
                        throw e;
                    }
                }
            }
        }
    }
    // No config found
    return null;
}
//# sourceMappingURL=loadConfig.js.map