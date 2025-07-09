"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const promises_1 = tslib_1.__importDefault(require("node:fs/promises"));
const grafast_1 = require("grafast");
const lru_1 = tslib_1.__importDefault(require("@graphile/lru"));
const version_js_1 = require("./version.js");
const PersistedPlugin = {
    name: "PersistedPlugin",
    description: "Enables persisted operations in Grafserv",
    version: version_js_1.version,
    grafserv: {
        middleware: {
            processGraphQLRequestBody(next, event) {
                const { body, resolvedPreset } = event;
                const options = resolvedPreset.grafserv;
                if (!options) {
                    throw new grafast_1.SafeError("Persisted operations misconfigured; rejecting requests.", { statusCode: 500 });
                }
                const realQuery = persistedOperationFromPayload(body, options, shouldAllowUnpersistedOperation(options, event));
                // Always overwrite
                if (realQuery != null && typeof realQuery !== "string") {
                    return realQuery.then((q) => {
                        if (typeof q === "string") {
                            body.query = q;
                        }
                        else {
                            throw new grafast_1.SafeError("Persisted operations are enabled on this server, please provide an approved document id.", { statusCode: 400 });
                        }
                    });
                }
                else {
                    if (typeof realQuery === "string") {
                        body.query = realQuery;
                    }
                    else {
                        throw new grafast_1.SafeError("Persisted operations are enabled on this server, please provide an approved document id.", { statusCode: 400 });
                    }
                }
                return next();
            },
        },
    },
};
exports.default = PersistedPlugin;
/**
 * This fallback hashFromPayload method is compatible with Apollo Client and
 * Relay.
 */
function defaultHashFromPayload(payload) {
    return (
    // https://github.com/apollographql/apollo-link-persisted-queries#protocol
    payload?.extensions?.persistedQuery?.sha256Hash ||
        // https://relay.dev/docs/en/persisted-queries#network-layer-changes
        payload?.documentId ||
        // Benjie's memory
        payload?.id);
}
/**
 * Given a cache object, returns a persisted operation getter that looks up the
 * given hash in said cache object.
 */
function persistedOperationGetterForCache(cache) {
    return (key) => cache[key];
}
function makeGetterForDirectory(directory, scanInterval = -1) {
    // TODO: implement AbortController integration for timer, etc.
    const abortController = new AbortController();
    const { signal } = abortController;
    // NOTE: We periodically scan the folder to see what files it contains so
    // that we can reject requests to non-existent files to avoid DOS attacks
    // having us make lots of requests to the filesystem.
    let files = null;
    /** is scanDirectory active? */
    let scanning = false;
    /** Should we scan the directory again once the current scanDirectory is complete? */
    let scanAgain = false;
    /**
     * This function must never reject.
     */
    async function scanDirectory() {
        if (scanning) {
            scanAgain = true;
            return;
        }
        scanning = true;
        scanAgain = false;
        try {
            const allFiles = await promises_1.default.readdir(directory);
            files = allFiles.filter((name) => name.endsWith(".graphql"));
        }
        catch (e) {
            console.error(`Error occurred whilst scanning '${directory}'`);
            console.error(e);
        }
        finally {
            scanning = false;
            if (scanInterval === "watch") {
                if (scanAgain) {
                    scanDirectory();
                }
            }
            else if (typeof scanInterval === "number" && scanInterval >= 0) {
                // We don't know how long the scanning takes, so rather than setting an
                // interval, we wait for a scan to complete before kicking off the next
                // one.
                setTimeout(scanDirectory, scanInterval);
            }
        }
    }
    scanDirectory();
    if (scanInterval === "watch") {
        (async () => {
            try {
                const watcher = promises_1.default.watch(directory, { signal, recursive: false });
                for await (const _event of watcher) {
                    scanDirectory();
                }
            }
            catch (err) {
                if (err.name === "AbortError")
                    return;
                console.error(`Error occurred whilst watching the persisted operations directory. Folder is no longer being watched. Recommend you restart your server (and file an issue explaining what happened).`);
                console.error(err);
            }
        })();
    }
    const operationFromHash = new Map();
    function getOperationFromHash(hash) {
        if (!/^[a-zA-Z0-9_-]+$/.test(hash)) {
            throw new Error("Invalid hash");
        }
        let operation = operationFromHash.get(hash);
        if (!operation) {
            const filename = `${hash}.graphql`;
            if (files && !files.includes(filename)) {
                throw new Error(`Could not find file for hash '${hash}'`);
            }
            operation = promises_1.default
                .readFile(`${directory}/${filename}`, "utf8")
                .catch(() => null);
            operationFromHash.set(hash, operation);
            // Once resolved, replace reference to string to avoid unnecessary ticks
            operation.then((operationText) => {
                operationFromHash.set(hash, operationText);
            });
        }
        return operation;
    }
    return { getter: getOperationFromHash, abortController };
}
const directoryGetterByDirectory = new Map();
/**
 * Given a directory, get or make the persisted operations getter.
 */
function getterForDirectory(directory, scanInterval) {
    const key = `${scanInterval}|${directory}`;
    let getter = directoryGetterByDirectory.get(key);
    if (!getter) {
        getter = makeGetterForDirectory(directory, scanInterval);
        directoryGetterByDirectory.set(key, getter);
    }
    return getter;
}
/**
 * Extracts or creates a persisted operation getter function from the
 * PostGraphile options.
 */
function getterFromOptionsCore(options) {
    const optionsSpecified = Object.keys(options).filter((key) => [
        "persistedOperationsGetter",
        "persistedOperationsDirectory",
        "persistedOperations",
    ].includes(key));
    if (optionsSpecified.length > 1) {
        // If you'd like support for more than one of these options; send a PR!
        throw new Error(`'${optionsSpecified.join("' and '")}' were specified, at most one of these operations can be specified.`);
    }
    if (options.persistedOperationsGetter) {
        return options.persistedOperationsGetter;
    }
    else if (options.persistedOperations) {
        return persistedOperationGetterForCache(options.persistedOperations);
    }
    else if (options.persistedOperationsDirectory) {
        // TODO: do something with abortController? abortController.abort()
        const { getter, abortController: _abortController } = getterForDirectory(options.persistedOperationsDirectory, options.persistedOperationsDirectoryScanInterval);
        return getter;
    }
    else {
        throw new Error("Server misconfiguration issue: persisted operations (operation allowlist) is in place, but the server has not been told how to fetch the allowed operations. Please provide one of the persisted operations configuration options.");
    }
}
const getterFromOptionsCache = new lru_1.default({
    maxLength: 100,
});
/**
 * Returns a cached getter for performance reasons.
 */
function getterFromOptions(options) {
    let getter = getterFromOptionsCache.get(options);
    if (!getter) {
        getter = getterFromOptionsCore(options);
        getterFromOptionsCache.set(options, getter);
    }
    return getter;
}
function shouldAllowUnpersistedOperation(options, event) {
    const { allowUnpersistedOperation } = options;
    if (typeof allowUnpersistedOperation === "function") {
        return allowUnpersistedOperation(event);
    }
    return !!allowUnpersistedOperation;
}
/**
 * Given a payload, this method returns the GraphQL operation document
 * (string), or null on failure. It **never throws**.
 */
function persistedOperationFromPayload(payload, options, allowUnpersistedOperation) {
    try {
        const hashFromPayload = options.hashFromPayload || defaultHashFromPayload;
        const hash = hashFromPayload(payload);
        if (typeof hash !== "string") {
            if (allowUnpersistedOperation && typeof payload?.query === "string") {
                return payload.query;
            }
            throw new Error("We could not find a persisted operation hash string in the request.");
        }
        const getter = getterFromOptions(options);
        return getter(hash);
    }
    catch (e) {
        console.error("Failed to get persisted operation from payload", payload, e);
        // We must not throw, instead just overwrite the query with null (the error
        // will be thrown elsewhere).
        return null;
    }
}
//# sourceMappingURL=index.js.map