import type { Plugin as EnvelopPlugin } from "@envelop/core";
export interface UseGrafastOptions {
    /**
     * Set this to 'true' to allow all explains; set it to a list of the allowed
     * explains to allow only those, set it to false to disable explains.
     */
    explainAllowed?: boolean | string[];
}
/**
 * An Envelop plugin that uses Grafast to prepare and execute the GraphQL
 * query.
 */
export declare const useGrafast: (options?: UseGrafastOptions) => EnvelopPlugin;
/**
 * An Envelop plugin that will make any GraphQL errors easier to read from
 * inside of GraphiQL.
 */
export declare const useMoreDetailedErrors: () => EnvelopPlugin;
//# sourceMappingURL=envelop.d.ts.map