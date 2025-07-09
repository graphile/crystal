export interface StoredKeys {
    saveHeaders: "true" | "";
    explain: "true" | "";
    explorerIsOpen: "true" | "";
    explainIsOpen: "true" | "";
    explainAtBottom: "true" | "";
    explainSize: string;
    verbose: "true" | "";
}
export interface RuruStorage {
    get<TKey extends keyof StoredKeys>(key: TKey): StoredKeys[TKey] | null;
    set<TKey extends keyof StoredKeys>(key: TKey, value: StoredKeys[TKey]): void;
    toggle<TKey extends keyof StoredKeys>(key: TKey): void;
}
export declare const useStorage: () => RuruStorage;
//# sourceMappingURL=useStorage.d.ts.map