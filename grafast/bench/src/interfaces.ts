export interface BenchOperation {
  name: string;
  source: string;
}
export interface GrafastBenchSetupResult {}
export interface GrafastBenchConfig {
  /** Path to a JS file that exports the GraphQL schema to use */
  schema?: string;
  /** Glob specifying GraphQL documents to test against the schema */
  operations?: string;
  /** Create any helpers, e.g. database connection helpers */
  setup?: () => Promise<GrafastBenchSetupResult> | GrafastBenchSetupResult;
  /** Create any helpers, e.g. database connection helpers */
  teardown?: (setupResult: GrafastBenchSetupResult) => void | Promise<void>;
  /** Factory function to get the GraphQL context to use for the operation */
  contextFactory?: (
    operation: BenchOperation,
    setupResult: GrafastBenchSetupResult,
  ) => object;
}

// eslint-disable-next-line no-restricted-syntax
declare global {
  namespace GraphileConfig {
    interface Preset {
      bench?: GrafastBenchConfig;
    }
  }
}
