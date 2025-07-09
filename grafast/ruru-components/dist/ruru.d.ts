import type { GraphiQLProps } from "graphiql";
import type { FC } from "react";
import type { RuruStorage } from "./hooks/useStorage.js";
import type { RuruProps } from "./interfaces.js";
export declare const Ruru: FC<RuruProps>;
export declare const RuruInner: FC<{
    editorTheme?: string;
    storage: RuruStorage;
    error: Error | null;
    setError: React.Dispatch<React.SetStateAction<Error | null>>;
    onEditQuery?: GraphiQLProps["onEditQuery"];
    onEditVariables?: GraphiQLProps["onEditVariables"];
    streamEndpoint: string | null;
}>;
//# sourceMappingURL=ruru.d.ts.map