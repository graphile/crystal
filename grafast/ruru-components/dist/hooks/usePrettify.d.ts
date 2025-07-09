declare global {
    interface Window {
        prettier: any;
        prettierPlugins: any;
    }
}
/**
 * Prettifies with 'prettier' if available, otherwise using GraphiQL's built in
 * prettify.
 */
export declare const usePrettify: () => () => void;
//# sourceMappingURL=usePrettify.d.ts.map