import type { RuruHTMLParts } from "./server.js";
export interface RuruConfig {
    port?: number;
    endpoint?: string;
    subscriptionEndpoint?: string;
    subscriptions?: boolean;
    enableProxy?: boolean;
    /**
     * Override the HTML parts that are used to build the Ruru
     */
    htmlParts?: Partial<RuruHTMLParts>;
}
//# sourceMappingURL=interfaces.d.ts.map