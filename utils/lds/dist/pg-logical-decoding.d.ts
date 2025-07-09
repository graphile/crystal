import { EventEmitter } from "events";
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
    schema: string;
    table: string;
}
export interface InsertChange extends Change {
    kind: "insert";
    columnnames: Array<string>;
    columntypes: Array<string>;
    columnvalues: Array<any>;
}
export interface UpdateChange extends Change {
    kind: "update";
    columnnames: Array<string>;
    columntypes: Array<string>;
    columnvalues: Array<any>;
    oldkeys: Keys;
}
export interface DeleteChange extends Change {
    kind: "delete";
    oldkeys: Keys;
}
export declare const changeToRecord: (change: InsertChange | UpdateChange) => any;
export declare const changeToPk: (change: UpdateChange | DeleteChange) => any[];
interface Payload {
    lsn: string;
    data: {
        change: Array<InsertChange | UpdateChange | DeleteChange>;
    };
}
interface Options {
    tablePattern?: string;
    slotName?: string;
    temporary?: boolean;
}
export default class PgLogicalDecoding extends EventEmitter {
    readonly slotName: string;
    readonly temporary: boolean;
    private connectionString;
    private tablePattern;
    private pool;
    private client;
    constructor(connectionString: string, options?: Options);
    dropStaleSlots(): Promise<void>;
    createSlot(): Promise<void>;
    getChanges(uptoLsn?: string | null, uptoNchanges?: number | null): Promise<Array<Payload>>;
    close(): Promise<void>;
    installSchema(): Promise<void>;
    /****************************************************************************/
    private getClient;
    private onPoolError;
    private trackSelf;
}
export {};
//# sourceMappingURL=pg-logical-decoding.d.ts.map