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
}
