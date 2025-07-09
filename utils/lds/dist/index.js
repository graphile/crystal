"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = subscribeToLogicalDecoding;
const tslib_1 = require("tslib");
/* eslint-disable no-console,curly,@typescript-eslint/ban-types */
const fatal_error_js_1 = tslib_1.__importDefault(require("./fatal-error.js"));
const pg_logical_decoding_js_1 = tslib_1.__importStar(require("./pg-logical-decoding.js"));
const DROP_STALE_SLOTS_INTERVAL = 15 * 60 * 1000;
async function subscribeToLogicalDecoding(connectionString, callback, options = {}) {
    const { slotName = "postgraphile", tablePattern = "*.*", sleepDuration = 200, temporary = false, } = options;
    let lastLsn = null;
    const client = new pg_logical_decoding_js_1.default(connectionString, {
        tablePattern,
        slotName,
        temporary,
    });
    // We must do this before we create the temporary slot, since errors will release a temporary slot immediately
    await client.dropStaleSlots();
    try {
        await client.createSlot();
    }
    catch (e) {
        if (e.fatal) {
            throw e;
        }
        else if (e.code === "42710") {
            // Slot already exists; ignore.
        }
        else if (e.code === "42602") {
            throw new fatal_error_js_1.default(`Invalid slot name '${slotName}'?`, e);
        }
        else {
            console.error("An unhandled error occurred when attempting to create the replication slot:");
            console.trace(e);
            throw e;
        }
    }
    let loopTimeout;
    let finished = false;
    const ldSubscription = {
        close: async () => {
            finished = true;
            clearTimeout(loopTimeout);
            await client.close();
        },
    };
    let nextStaleCheck = Date.now() + DROP_STALE_SLOTS_INTERVAL;
    async function loop() {
        try {
            const rows = await client.getChanges(null, 500);
            if (rows.length) {
                for (const row of rows) {
                    const { lsn, data: { change: changes }, } = row;
                    lastLsn = lsn || lastLsn;
                    for (const change of changes) {
                        const { schema, table } = change;
                        if (change.kind === "insert") {
                            const announcement = {
                                _: "insertC",
                                schema,
                                table,
                                data: (0, pg_logical_decoding_js_1.changeToRecord)(change),
                            };
                            callback(announcement);
                        }
                        else if (change.kind === "update") {
                            const rowAnnouncement = {
                                _: "update",
                                schema,
                                table,
                                keys: (0, pg_logical_decoding_js_1.changeToPk)(change),
                                data: (0, pg_logical_decoding_js_1.changeToRecord)(change),
                            };
                            callback(rowAnnouncement);
                            const collectionAnnouncement = {
                                _: "updateC",
                                schema,
                                table,
                                data: (0, pg_logical_decoding_js_1.changeToRecord)(change),
                            };
                            callback(collectionAnnouncement);
                        }
                        else if (change.kind === "delete") {
                            const announcement = {
                                _: "delete",
                                schema,
                                table,
                                keys: (0, pg_logical_decoding_js_1.changeToPk)(change),
                            };
                            callback(announcement);
                        }
                        else {
                            console.warn("Did not understand change: ", change);
                        }
                    }
                }
            }
            if (!temporary && nextStaleCheck < Date.now()) {
                // Roughly every 15 minutes, drop stale slots.
                nextStaleCheck = Date.now() + DROP_STALE_SLOTS_INTERVAL;
                client.dropStaleSlots().catch((e) => {
                    console.error("Failed to drop stale slots:", e.message);
                });
            }
        }
        catch (e) {
            if (finished) {
                return;
            }
            console.error("Error during LDS loop:", e.message);
            // Recovery time...
            loopTimeout = setTimeout(loop, sleepDuration * 10);
            return;
        }
        if (finished) {
            return;
        }
        loopTimeout = setTimeout(loop, sleepDuration);
    }
    loop();
    return ldSubscription;
}
//# sourceMappingURL=index.js.map