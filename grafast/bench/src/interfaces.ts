export interface BenchOperation {
  name: string;
  source: string;
}
export interface GrafastBenchConfig {
  /** Path to a JS file that exports the GraphQL schema to use */
  schema?: string;
  /** Glob specifying GraphQL documents to test against the schema */
  operations?: string;
  /** Factory function to get the GraphQL context to use for the operation */
  contextFactory?: (operation: BenchOperation) => object;
}

declare global {
  namespace GraphileConfig {
    interface Preset {
      bench?: GrafastBenchConfig;
    }
  }
}
