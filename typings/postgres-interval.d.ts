declare module 'postgres-interval' {
  interface Interval {
    seconds?: number
    minutes?: number
    hours?: number
    days?: number
    months?: number
    years?: number
    toPostgres (): string
  }

  function parse (raw: string): Interval

  export = parse
}
