export interface Options {
    slotName?: string;
    tablePattern?: string;
    sleepDuration?: number;
    temporary?: boolean;
}
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
export type Announcement = InsertCollectionAnnouncement | UpdateCollectionAnnouncement | UpdateRowAnnouncement | DeleteRowAnnouncement;
export type AnnounceCallback = (announcement: Announcement) => void;
export interface LDSubscription {
    close(): void;
}
export default function subscribeToLogicalDecoding(connectionString: string, callback: AnnounceCallback, options?: Options): Promise<LDSubscription>;
export {};
//# sourceMappingURL=index.d.ts.map