export interface ExportOptions {
  mode?: "graphql-js" | "typeDefs";

  /**
   * Pass modules to factor into the export; when we see any of the root-level
   * exports from these modules we'll automatically reference them.
   *
   * Example:
   *
   * ```js
   * import * as myModule from 'my-module';
   *
   * const options = {
   *   modules: {
   *     // '*' import:
   *     'my-module': myModule,
   *   }
   * }
   * ```
   */
  modules?: {
    [moduleName: string]: any;
  };

  /**
   * Set 'true' if we should use prettier to format the exported code.
   */
  prettier?: boolean;

  /** @deprecated Use `optimizeRuns: 0` instead */
  disableOptimize?: boolean;

  /**
   * Set `0` if you're facing memory exhaustion issues when exporting large
   * schemas and wish to skip optimizing the export.
   *
   * Optimizing the export can make the export smaller and more readable,
   * involving fewer IIFEs and similar constructs used throughout EXPORTABLE
   * expressions. It may also have a (positive, hopefully) impact on
   * performance. In general it's recommended to leave optimize enabled.
   *
   * Changing this to `1` will only do a single optimization pass, leaving some
   * optimizations on the table. Setting it larger than 2 should generally
   * result in diminishing returns.
   *
   * @defaultValue `2`
   */
  optimizeLoops?: number;
}
