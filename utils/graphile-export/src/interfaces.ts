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

  /**
   * Set 'true' if you're facing memory exhaustion issues on large schemas and
   * wish to skip optimizing the export.
   *
   * Optimizing the export can make the export smaller and more readable,
   * involving fewer IIFEs and similar constructs used throughout EXPORTABLE
   * expressions. It may also have a (positive, hopefully) impact on
   * performance. In general it's recommended to leave optimize enabled.
   */
  disableOptimize?: boolean;
}
