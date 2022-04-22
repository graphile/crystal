import StorageAPI from "graphiql/dist/utility/StorageAPI";
import { useMemo, useState } from "react";

const STORAGE_KEYS = {
  SAVE_HEADERS_TEXT: "GraphileInspect:saveHeadersText",
  HEADERS_TEXT: "GraphileInspect:headersText",
  EXPLAIN: "GraphileInspect:explain",
};

export interface StoredKeys {
  saveHeaders: "true" | "";
  headers: string;
  explain: "true" | "";
  explorerIsOpen: "true" | "";
  query: string;
}

const KEYS: { [key in keyof StoredKeys]: string } = {
  saveHeaders: "GraphileInspect:saveHeadersText",
  headers: "GraphileInspect:headersText",
  explain: "GraphileInspect:explain",
  explorerIsOpen: "explorerIsOpen",
  query: "query",
};

const up = (v: number) => v + 1;

export interface GraphileInspectStorage {
  get<TKey extends keyof StoredKeys>(key: TKey): StoredKeys[TKey] | null;
  set<TKey extends keyof StoredKeys>(key: TKey, value: StoredKeys[TKey]): void;
  toggle<TKey extends keyof StoredKeys>(key: TKey): void;
}

export const useStorage = (): GraphileInspectStorage => {
  const storage = useMemo(() => new StorageAPI(), []);
  // Trigger re-render every time we set
  const [revision, bump] = useState(0);

  return useMemo(() => {
    return {
      _revision: revision,
      get(key) {
        return (storage.get(KEYS[key]) as any) ?? null;
      },
      set(key, value) {
        storage.set(KEYS[key], value);
        bump(up);
      },
      toggle(key) {
        if (this.get(key)) {
          this.set(key, "");
        } else {
          this.set(key, "true");
        }
      },
    };
  }, [storage, revision]);
};
