import { useMemo, useState } from "react";
const KEYS = {
    saveHeaders: "Ruru:saveHeadersText",
    explain: "Ruru:explain",
    explainSize: "Ruru:explainSize",
    explainIsOpen: "Ruru:explainIsOpen",
    explainAtBottom: "Ruru:explainAtBottom",
    explorerIsOpen: "graphiql:explorerIsOpen",
    verbose: "Ruru:verbose",
};
const up = (v) => v + 1;
export const useStorage = () => {
    const storage = typeof window !== "undefined" ? window.localStorage : null;
    // Trigger re-render every time we set
    const [revision, bump] = useState(0);
    const [cache] = useState(Object.create(null));
    return useMemo(() => {
        if (!storage) {
            return {
                _revision: revision,
                get(key) {
                    return cache[key] ?? null;
                },
                set(key, value) {
                    cache[key] = value;
                },
                toggle(key) {
                    cache[key] = cache[key] ? "" : "true";
                },
            };
        }
        return {
            _revision: revision,
            get(key) {
                const val = storage.getItem(KEYS[key]);
                if (val === "null" || val === "undefined") {
                    storage.removeItem(KEYS[key]);
                    return null;
                }
                return val ?? null;
            },
            set(key, value) {
                storage.setItem(KEYS[key], value);
                bump(up);
            },
            toggle(key) {
                if (this.get(key)) {
                    this.set(key, "");
                }
                else {
                    this.set(key, "true");
                }
            },
        };
    }, [storage, revision, cache]);
};
//# sourceMappingURL=useStorage.js.map