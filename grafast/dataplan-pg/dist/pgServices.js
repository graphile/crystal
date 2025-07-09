"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromiseLike = isPromiseLike;
exports.getWithPgClientFromPgService = getWithPgClientFromPgService;
exports.withPgClientFromPgService = withPgClientFromPgService;
exports.withSuperuserPgClientFromPgService = withSuperuserPgClientFromPgService;
/**
 * Is "thenable".
 */
function isPromiseLike(t) {
    return t != null && typeof t.then === "function";
}
const isTest = process.env.NODE_ENV === "test";
const withPgClientDetailsByConfigCache = new Map();
/**
 * Get or build the 'withPgClient' callback function for a given database
 * config, caching it to make future lookups faster.
 */
function getWithPgClientFromPgService(config) {
    const existing = withPgClientDetailsByConfigCache.get(config);
    if (existing) {
        if (isPromiseLike(existing)) {
            return existing.then((v) => {
                v.retainers++;
                return v.withPgClient;
            });
        }
        else {
            existing.retainers++;
            return existing.withPgClient;
        }
    }
    else {
        const promise = (async () => {
            const factory = config.adaptor?.createWithPgClient;
            if (typeof factory !== "function") {
                throw new Error(`'${config.adaptor}' does not look like a withPgClient adaptor - please ensure it exports a method called 'createWithPgClient'`);
            }
            const originalWithPgClient = await factory(config.adaptorSettings);
            const withPgClient = ((...args) => originalWithPgClient.apply(null, args));
            const cachedValue = {
                withPgClient,
                retainers: 1,
            };
            let released = false;
            withPgClient.release = () => {
                cachedValue.retainers--;
                // To allow for other promises to resolve and add/remove from the retaininers, check after a tick
                setTimeout(() => {
                    if (cachedValue.retainers === 0 && !released) {
                        released = true;
                        withPgClientDetailsByConfigCache.delete(config);
                        return originalWithPgClient.release?.();
                    }
                    // TODO: this used to be zero, but that seems really inefficient...
                    // Figure out why I did that?
                    // }, 0);
                }, isTest ? 500 : 5000);
            };
            withPgClientDetailsByConfigCache.set(config, cachedValue);
            return cachedValue;
        })();
        if (!withPgClientDetailsByConfigCache.has(config)) {
            withPgClientDetailsByConfigCache.set(config, promise);
        }
        promise.catch(() => {
            withPgClientDetailsByConfigCache.delete(config);
        });
        return promise.then((v) => v.withPgClient);
    }
}
async function withPgClientFromPgService(config, pgSettings, callback) {
    const withPgClientFromPgService = getWithPgClientFromPgService(config);
    const withPgClient = isPromiseLike(withPgClientFromPgService)
        ? await withPgClientFromPgService
        : withPgClientFromPgService;
    try {
        return await withPgClient(pgSettings, callback);
    }
    finally {
        withPgClient.release();
    }
}
// We don't cache superuser withPgClients
async function withSuperuserPgClientFromPgService(config, pgSettings, callback) {
    const withPgClient = await config.adaptor.createWithPgClient(config.adaptorSettings, "SUPERUSER");
    try {
        return await withPgClient(pgSettings, callback);
    }
    finally {
        withPgClient.release?.();
    }
}
//# sourceMappingURL=pgServices.js.map