"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeToPk = exports.changeToRecord = void 0;
const tslib_1 = require("tslib");
/* eslint-disable no-console */
const events_1 = require("events");
const pg_1 = require("pg");
const fatal_error_js_1 = tslib_1.__importDefault(require("./fatal-error.js"));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const changeToRecord = (change) => {
    const { columnnames, columnvalues } = change;
    return columnnames.reduce((memo, name, i) => {
        memo[name] = columnvalues[i];
        return memo;
    }, Object.create(null));
};
exports.changeToRecord = changeToRecord;
const changeToPk = (change) => {
    return change.oldkeys.keyvalues;
};
exports.changeToPk = changeToPk;
const toLsnData = ([lsn, data]) => ({
    lsn,
    data: JSON.parse(data),
});
class PgLogicalDecoding extends events_1.EventEmitter {
    constructor(connectionString, options) {
        super();
        this.onPoolError = (err) => {
            if (this.client) {
                this.client
                    .then((c) => c.release(err))
                    .catch(() => {
                    // noop
                });
            }
            this.client = null;
            console.error("LDS pool error:", err.message);
            // this.emit("error", err);
        };
        this.connectionString = connectionString;
        const { tablePattern = "*.*", slotName = "postgraphile", temporary = false, } = options || {};
        this.tablePattern = tablePattern;
        this.slotName = slotName;
        this.temporary = temporary;
        // We just use the pool to get better error handling
        this.pool = new pg_1.Pool({
            connectionString: this.connectionString,
            max: 1,
        });
        this.pool.on("error", this.onPoolError);
        this.client = null;
    }
    async dropStaleSlots() {
        const client = await this.getClient();
        try {
            await client.query(`
          with deleted_slots as (
            delete from postgraphile_meta.logical_decoding_slots
            where last_checkin < now() - interval '1 hour'
            returning *
          )
          select pg_catalog.pg_drop_replication_slot(slot_name)
          from deleted_slots
          where exists (
            select 1
            from pg_catalog.pg_replication_slots
            where pg_replication_slots.slot_name = deleted_slots.slot_name
          )
        `);
        }
        catch (e) {
            if (e.code === "42P01") {
                // The `postgraphile_meta.logical_decoding_slots` table doesn't exist.
                // Ignore.
            }
            else {
                console.error("Error clearing stale slots:", e.message);
            }
        }
    }
    async createSlot() {
        const client = await this.getClient();
        await this.trackSelf(client);
        try {
            await client.query(`SELECT pg_catalog.pg_create_logical_replication_slot($1, 'wal2json', $2)`, [this.slotName, !!this.temporary]);
        }
        catch (e) {
            if (e.code === "58P01") {
                const err = new fatal_error_js_1.default("Couldn't create replication slot, seems you don't have wal2json installed? Error: " +
                    e.message, e);
                throw err;
            }
            else {
                throw e;
            }
        }
    }
    async getChanges(uptoLsn = null, uptoNchanges = null) {
        const client = await this.getClient();
        await this.trackSelf(client);
        try {
            const { rows } = await client.query({
                text: `SELECT lsn, data FROM pg_catalog.pg_logical_slot_get_changes($1, $2, $3, 'add-tables', $4::text)`,
                values: [this.slotName, uptoLsn, uptoNchanges, this.tablePattern],
                rowMode: "array",
            });
            return rows.map(toLsnData);
        }
        catch (e) {
            if (e.code === "42704") {
                console.warn("Replication slot went away?");
                await this.createSlot();
                console.warn("Recreated slot; retrying getChanges (no further output implies success)");
                await sleep(500);
                return this.getChanges(uptoLsn, uptoNchanges);
            }
            throw e;
        }
    }
    async close() {
        if (!this.temporary) {
            const client = await this.getClient();
            await client.query("select pg_catalog.pg_drop_replication_slot($1)", [
                this.slotName,
            ]);
            await client.query("delete from postgraphile_meta.logical_decoding_slots where slot_name = $1", [this.slotName]);
        }
        if (this.client) {
            try {
                (await this.client).release();
            }
            catch (e) {
                /*noop*/
            }
            this.client = null;
        }
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
        }
    }
    async installSchema() {
        const client = await this.getClient();
        await client.query(`
      create schema if not exists postgraphile_meta;
      create table if not exists postgraphile_meta.logical_decoding_slots (
        slot_name text primary key,
        last_checkin timestamptz not null default now()
      );
    `);
    }
    /****************************************************************************/
    async getClient() {
        if (!this.pool) {
            throw new Error("Pool has been closed");
        }
        if (this.client) {
            return this.client;
        }
        this.client = this.pool.connect();
        return this.client.catch((e) => {
            this.client = null;
            return Promise.reject(e);
        });
    }
    async trackSelf(client, skipSchema = false) {
        if (this.temporary) {
            // No need to track temporary replication slots
            return;
        }
        try {
            await client.query(`
        insert into postgraphile_meta.logical_decoding_slots(slot_name)
        values ($1)
        on conflict (slot_name)
        do update set last_checkin = now();
        `, [this.slotName]);
        }
        catch (e) {
            if (!skipSchema) {
                await this.installSchema();
                return this.trackSelf(client, true);
            }
            else {
                throw e;
            }
        }
    }
}
exports.default = PgLogicalDecoding;
//# sourceMappingURL=pg-logical-decoding.js.map