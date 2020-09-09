/* eslint-disable no-console */
import * as pg from "pg";
import { EventEmitter } from "events";
import FatalError from "./fatal-error";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

declare module "pg" {
  interface ClientConfig {
    replication?: string;
  }
}

/**
 * Beware: this may include more than the keys (e.g. if there is no index)
 */
interface Keys {
  keynames: Array<string>;
  keytypes: Array<string>;
  keyvalues: Array<any>;
}

interface Change {
  // https://github.com/eulerto/wal2json/blob/f81bf7af09324da656be87dfd53d20741c01e1e0/wal2json.c#L957
  schema: string;

  // https://github.com/eulerto/wal2json/blob/f81bf7af09324da656be87dfd53d20741c01e1e0/wal2json.c#L961
  table: string;
}

// https://github.com/eulerto/wal2json/blob/f81bf7af09324da656be87dfd53d20741c01e1e0/wal2json.c#L941-L949
export interface InsertChange extends Change {
  kind: "insert";

  // https://github.com/eulerto/wal2json/blob/f81bf7af09324da656be87dfd53d20741c01e1e0/wal2json.c#L969
  columnnames: Array<string>;
  columntypes: Array<string>;
  columnvalues: Array<any>;
}

export interface UpdateChange extends Change {
  kind: "update";

  // https://github.com/eulerto/wal2json/blob/f81bf7af09324da656be87dfd53d20741c01e1e0/wal2json.c#L973
  columnnames: Array<string>;
  columntypes: Array<string>;
  columnvalues: Array<any>;

  // https://github.com/eulerto/wal2json/blob/f81bf7af09324da656be87dfd53d20741c01e1e0/wal2json.c#L992-L1003
  oldkeys: Keys;
}

export interface DeleteChange extends Change {
  kind: "delete";

  // https://github.com/eulerto/wal2json/blob/f81bf7af09324da656be87dfd53d20741c01e1e0/wal2json.c#L1009-L1018
  oldkeys: Keys;
}

export const changeToRecord = (change: InsertChange | UpdateChange) => {
  const { columnnames, columnvalues } = change;
  return columnnames.reduce((memo, name, i) => {
    memo[name] = columnvalues[i];
    return memo;
  }, {});
};

export const changeToPk = (change: UpdateChange | DeleteChange) => {
  return change.oldkeys.keyvalues;
};

interface Payload {
  lsn: string;
  data: {
    change: Array<InsertChange | UpdateChange | DeleteChange>;
  };
}

const toLsnData = ([lsn, data]: [string, string]): Payload => ({
  lsn,
  data: JSON.parse(data),
});

interface Options {
  tablePattern?: string;
  slotName?: string;
  temporary?: boolean;
}

export default class PgLogicalDecoding extends EventEmitter {
  public readonly slotName: string;
  public readonly temporary: boolean;
  private connectionString: string;
  private tablePattern: string;
  private pool: pg.Pool | null;
  private client: Promise<pg.PoolClient> | null;

  constructor(connectionString: string, options?: Options) {
    super();
    this.connectionString = connectionString;
    const {
      tablePattern = "*.*",
      slotName = "postgraphile",
      temporary = false,
    } = options || {};
    this.tablePattern = tablePattern;
    this.slotName = slotName;
    this.temporary = temporary;
    // We just use the pool to get better error handling
    this.pool = new pg.Pool({
      connectionString: this.connectionString,
      max: 1,
    });
    this.pool.on("error", this.onPoolError);
  }

  public async dropStaleSlots() {
    const client = await this.getClient();
    try {
      await client.query(
        `
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
        `
      );
    } catch (e) {
      if (e.code === "42P01") {
        // The `postgraphile_meta.logical_decoding_slots` table doesn't exist.
        // Ignore.
      } else {
        console.error("Error clearing stale slots:", e.message);
      }
    }
  }

  public async createSlot(): Promise<void> {
    const client = await this.getClient();
    await this.trackSelf(client);
    try {
      await client.query(
        `SELECT pg_catalog.pg_create_logical_replication_slot($1, 'wal2json', $2)`,
        [this.slotName, !!this.temporary]
      );
    } catch (e) {
      if (e.code === "58P01") {
        const err = new FatalError(
          "Couldn't create replication slot, seems you don't have wal2json installed? Error: " +
            e.message,
          e
        );
        throw err;
      } else {
        throw e;
      }
    }
  }

  public async getChanges(
    uptoLsn: string | null = null,
    uptoNchanges: number | null = null
  ): Promise<Array<Payload>> {
    const client = await this.getClient();
    await this.trackSelf(client);
    try {
      const { rows } = await client.query({
        text: `SELECT lsn, data FROM pg_catalog.pg_logical_slot_get_changes($1, $2, $3, 'add-tables', $4::text)`,
        values: [this.slotName, uptoLsn, uptoNchanges, this.tablePattern],
        rowMode: "array",
      });
      return rows.map(toLsnData);
    } catch (e) {
      if (e.code === "42704") {
        console.warn("Replication slot went away?");
        await this.createSlot();
        console.warn(
          "Recreated slot; retrying getChanges (no further output implies success)"
        );
        await sleep(500);
        return this.getChanges(uptoLsn, uptoNchanges);
      }
      throw e;
    }
  }

  public async close() {
    if (!this.temporary) {
      const client = await this.getClient();
      await client.query("select pg_catalog.pg_drop_replication_slot($1)", [
        this.slotName,
      ]);
      await client.query(
        "delete from postgraphile_meta.logical_decoding_slots where slot_name = $1",
        [this.slotName]
      );
    }
    if (this.client) {
      try {
        (await this.client).release();
      } catch (e) {
        /*noop*/
      }
      this.client = null;
    }
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  public async installSchema(): Promise<void> {
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

  private async getClient(): Promise<pg.PoolClient> {
    if (!this.pool) {
      throw new Error("Pool has been closed");
    }
    if (this.client) {
      return this.client;
    }
    this.client = this.pool.connect();
    return this.client.catch(e => {
      this.client = null;
      return Promise.reject(e);
    });
  }

  private onPoolError = (err: Error) => {
    if (this.client) {
      this.client
        .then(c => c.release(err))
        .catch(() => {
          // noop
        });
    }
    this.client = null;
    console.error("LDS pool error:", err.message);
    // this.emit("error", err);
  };

  private async trackSelf(
    client: pg.PoolClient,
    skipSchema = false
  ): Promise<void> {
    if (this.temporary) {
      // No need to track temporary replication slots
      return;
    }
    try {
      await client.query(
        `
        insert into postgraphile_meta.logical_decoding_slots(slot_name)
        values ($1)
        on conflict (slot_name)
        do update set last_checkin = now();
        `,
        [this.slotName]
      );
    } catch (e) {
      if (!skipSchema) {
        await this.installSchema();
        return this.trackSelf(client, true);
      } else {
        throw e;
      }
    }
  }
}
