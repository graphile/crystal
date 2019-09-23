/* eslint-disable no-console,curly */
import PgLogicalDecoding, {
  changeToRecord,
  changeToPk,
} from "./pg-logical-decoding";
import FatalError from "./fatal-error";

export interface Options {
  slotName?: string;
  tablePattern?: string;
  sleepDuration?: number;
  temporary?: boolean;
}

const DROP_STALE_SLOTS_INTERVAL = 15 * 60 * 1000;

interface CollectionAnnouncement {
  schema: string;
  table: string;
}
interface RowAnnouncement {
  schema: string;
  table: string;
  keys: Array<string>;
}

export interface InsertCollectionAnnouncement extends CollectionAnnouncement {
  _: "insertC";
  data: {};
}
export interface UpdateCollectionAnnouncement extends CollectionAnnouncement {
  _: "updateC";
  data: {};
}
export interface UpdateRowAnnouncement extends RowAnnouncement {
  _: "update";
  data: {};
}
export interface DeleteRowAnnouncement extends RowAnnouncement {
  _: "delete";
}

export type Announcement =
  | InsertCollectionAnnouncement
  | UpdateCollectionAnnouncement
  | UpdateRowAnnouncement
  | DeleteRowAnnouncement;

export type AnnounceCallback = (announcement: Announcement) => void;

export interface LDSubscription {
  close(): void;
}

export default async function subscribeToLogicalDecoding(
  connectionString: string,
  callback: AnnounceCallback,
  options: Options = {}
): Promise<LDSubscription> {
  const {
    slotName = "postgraphile",
    tablePattern = "*.*",
    sleepDuration = 200,
    temporary = false,
  } = options;
  let lastLsn: string | null = null;
  const client = new PgLogicalDecoding(connectionString, {
    tablePattern,
    slotName,
    temporary,
  });

  // We must do this before we create the temporary slot, since errors will release a temporary slot immediately
  await client.dropStaleSlots();

  try {
    await client.createSlot();
  } catch (e) {
    if (e.fatal) {
      throw e;
    } else if (e.code === "42710") {
      // Slot already exists; ignore.
    } else if (e.code === "42602") {
      throw new FatalError(`Invalid slot name '${slotName}'?`, e);
    } else {
      console.error(
        "An unhandled error occurred when attempting to create the replication slot:"
      );
      console.trace(e);
      throw e;
    }
  }

  let loopTimeout: NodeJS.Timer;

  const ldSubscription = {
    close: async () => {
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
          const {
            lsn,
            data: { change: changes },
          } = row;
          lastLsn = lsn || lastLsn;
          for (const change of changes) {
            const { schema, table } = change;
            if (change.kind === "insert") {
              const announcement: InsertCollectionAnnouncement = {
                _: "insertC",
                schema,
                table,
                data: changeToRecord(change),
              };
              callback(announcement);
            } else if (change.kind === "update") {
              const rowAnnouncement: UpdateRowAnnouncement = {
                _: "update",
                schema,
                table,
                keys: changeToPk(change),
                data: changeToRecord(change),
              };
              callback(rowAnnouncement);
              const collectionAnnouncement: UpdateCollectionAnnouncement = {
                _: "updateC",
                schema,
                table,
                data: changeToRecord(change),
              };
              callback(collectionAnnouncement);
            } else if (change.kind === "delete") {
              const announcement: DeleteRowAnnouncement = {
                _: "delete",
                schema,
                table,
                keys: changeToPk(change),
              };
              callback(announcement);
            } else {
              console.warn("Did not understand change: ", change);
            }
          }
        }
      }
      if (!temporary && nextStaleCheck < Date.now()) {
        // Roughly every 15 minutes, drop stale slots.
        nextStaleCheck = Date.now() + DROP_STALE_SLOTS_INTERVAL;
        client.dropStaleSlots().catch(e => {
          console.error("Failed to drop stale slots:", e.message);
        });
      }
    } catch (e) {
      console.error("Error during LDS loop:", e.message);
      // Recovery time...
      loopTimeout = setTimeout(loop, sleepDuration * 10);
      return;
    }
    loopTimeout = setTimeout(loop, sleepDuration);
  }
  loop();
  return ldSubscription;
}
